function pixel2LatLng(x, y, dimX, dimY){
  return {
    lat: -(y / dimY - 0.5)*Math.PI
  , lng: (x / dimX - 0.5)*2*Math.PI // x 0-dimX to 360 (-pi to pi)
  }
}
function getCircCoord(lat, lng, radius) {
  const FOV = Math.PI
  // 1. convert lat, lng to angle and radius
  // 2. convert angle and radius to x and y
  if (Math.abs(lat) > FOV/2 || Math.abs(lng) > FOV/2) {
    //console.log('too far', lat, lng)
    return {x: 0, y: 0}
  }

  const theta = Math.atan(lng / lat)
  const squareR = getSquareHypo(theta, FOV)
  const r = radius * Math.sqrt(lat**2 + lng**2)/squareR
  //console.log(lng, lat, theta, squareR, r, radius)
  if (isNaN(theta)){
    console.log('nan theta')
    return {x: radius, y: radius}
  }

	// Pixel in fisheye space
	return {
    x: radius + r * Math.sin(theta) * (lat < 0 ? -1 : 1)
	, y: radius + r * Math.cos(theta) * (lat > 0 ? -1 : 1)
  }
  // You're dumb, this should actually be just remapping horizontals to be more stretched out
}
function getSquareHypo(theta, FOV){
  if (Math.abs(theta) <= Math.PI/4) {
    return (FOV/2)/Math.cos(theta)
  } else {
    return Math.abs((FOV/2)/Math.sin(theta))
  }
}
function getCircCoordPaul(lat, lng, radius){
  const FOV = Math.PI

	// Vector in 3D space
  const psph = {
    x: Math.cos(lat) * Math.sin(lng)
  , y: Math.cos(lat) * Math.cos(lng)
  , z: Math.sin(lat)
  }
	
	// Calculate fisheye angle and radius
	const theta = Math.atan(psph.z / psph.x);
	const phi = Math.atan(Math.sqrt(psph.x*psph.x+psph.z*psph.z) / psph.y);
	const r = radius * phi / FOV;

	// Pixel in fisheye space
	return {
    x: 0.5 * radius + r * Math.cos(theta)
	, y: 0.5 * radius + r * Math.sin(theta)
  }
}
function getCircCoordHoriz(lat, lng, radius){
  // so to do this, I get the lat lng, figure out the vertical and horizontal
  const FOV = Math.PI
  // 1. convert lat, lng to angle and radius
  // 2. convert angle and radius to x and y
  if (Math.abs(lat) > FOV/2 || Math.abs(lng) > FOV/2) {
    //console.log('too far', lat, lng)
    return {x: 0, y: 0}
  }

  // scale over FOV for the position
  const x = lng / (FOV/2)*radius
  const y = -lat / (FOV/2)*radius
  const xScale = Math.sqrt(radius**2 - y**2)/radius

  return {
    x: radius + x*xScale
  , y: radius + y
  }
}
function latLngDirCorrection(lat, lng, rotTheta, rotPhi){
  // You have to do a polar rotation you silly

  // convert to theta or phi
  // adjust theta and phi for correction
  // Map back to lat lng based on new theta and phi
  // https://gis.stackexchange.com/questions/10808/manually-transforming-rotated-lat-lon-to-regular-lat-lon
  const x = Math.cos(lat) * Math.cos(lng)
  const y = Math.cos(lat) * Math.sin(lng)
  const z = Math.sin(lat)
  const xRot = Math.cos(rotTheta)*Math.cos(rotPhi)*x + Math.sin(rotPhi)*y + Math.sin(rotTheta)*Math.cos(rotPhi)*z
  const yRot = -Math.cos(rotTheta)*Math.sin(rotPhi)*x + Math.cos(rotPhi)*y - Math.sin(rotTheta)*Math.sin(rotPhi)*z
  const zRot = -Math.sin(rotTheta)*x + Math.cos(rotTheta)*z

	return {
    lat: Math.asin(zRot)
	, lng: Math.atan2(yRot, xRot)
  }
}
function rotateCirc(x, y, radius, angle){
  return {
    x: Math.cos(angle) * (x-radius) - Math.sin(angle) * (y-radius) + radius
  , y: Math.sin(angle) * (x-radius) + Math.cos(angle) * (y-radius) + radius
  }
}

module.exports = {
  pixel2LatLng
, getCircCoord
, getCircCoordPaul
, getCircCoordHoriz
, latLngDirCorrection
, rotateCirc
}
