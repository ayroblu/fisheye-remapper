function pixel2LatLng(x, y, dimX, dimY){
  return {
    lat: -(y / dimY - 0.5)*Math.PI
  , lng: (x / dimX - 0.5)*2*Math.PI // x 0-dimX to 360 (-pi to pi)
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
function latLngDirCorrection(lat, lng, rotTheta=0, rotPhi=0){
  // convert to theta or phi
  // adjust theta and phi for correction
  // Map back to lat lng based on new theta and phi
  // https://gis.stackexchange.com/questions/10808/manually-transforming-rotated-lat-lon-to-regular-lat-lon
  // Assuming conventional lat lng, x is in to page, y is left to right, z is vertical
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
, getCircCoordHoriz
, latLngDirCorrection
, rotateCirc
}
