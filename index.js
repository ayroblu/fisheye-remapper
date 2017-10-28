const fs = require('fs')

const getPixels = require("get-pixels")
const savePixels = require('save-pixels')
const zeros = require("zeros")
const {
  pixel2LatLng, getCircCoord, getCircCoordPaul, getCircCoordHoriz
, latLngDirCorrection, rotateCirc
} = require('./circFuncs')
 
function run(){
  getPixels("image.jpg", function(err, pixels) {
    if(err) {
      console.log("Bad image path")
      return
    }
    console.log("got pixels", Object.keys(pixels), pixels.get(100,100,0), pixels.get(100,100,1), pixels.get(100,100,2), pixels.get(100,100,3), pixels.shape.slice())

    var width = pixels.shape[0]
    var height = pixels.shape[1]
    var dim = Math.min(width, height)
    var im = zeros([dim*2, dim, 4])

    var xOffset = (width - dim) / 2
    var yOffset = (height - dim) / 2
    for (var i = 0; i < dim*2; ++i) {
      for (var j = 0; j < dim; ++j) {
        const ll = pixel2LatLng(i, j, dim*2, dim)
        //const coord = getCircCoord(ll.lat, ll.lng, dim/2)
        //const coord = getCircCoordPaul(-ll.lat, ll.lng, dim*2)
        
        //const {lat,lng} = latLngDirCorrection(ll.lat, ll.lng, 60/180*Math.PI, 0)
        //const {x,y} = getCircCoordHoriz(lat, lng, dim/2)
        //const coord = rotateCirc(x, y, dim/2, 1/180*Math.PI)
        const coord = rotateCirc(i, j, dim/2, 0)
        for (var k = 0; k < 4; ++k) {
          im.set(i,j,k, pixels.get(parseInt(coord.x, 10)+xOffset,parseInt(coord.y, 10)+yOffset,k))
        }
      }
    }
    // simple: lets say i'm pointing 45 degrees up, no longitudinal adjustment given FOV = 180deg horiz + vert
    // idea1: loop over all pixels, convert to lat lng, check if inside FOV, if is check where it is in circ and write

    // pixel2LatLng: x/(dim*2) - pi, y / dim - pi/2
    // FOVCheck: -lngFOV < x-lngRot < lngFOV, -latFOV < y-latRot < latFOV
      // lngRot = 0, lngFOV = pi, latRot = pi/4, latFOV = pi. Also have to do a correction
      // if y-latRot < -pi/2 then lat=-pi-(y-latRot) and lng=(lng > 0 ? lng-pi : lng + pi)
        // =>-80 - 45 = -125 -> -55
      // if y-latRot > pi/2 then pi-(y-latRot) and lng=(lng > 0 ? lng-pi : lng + pi)
        // =>80 + 45 = 125 -> 55
    // getCircColour: adjLatLng, x:Math.cos(lat)*Math.sin(lng), y: Math.sin(lat)*Math.cos(lng), z: Math.sin(phi)
    
    console.log('writing...')
    const writeStream = fs.createWriteStream('someFile.jpg', { flags : 'w' });
    savePixels(im, "jpg").pipe(writeStream)

    writeStream.on('close', function () {
      console.log('All done!');
    });
  })
}

run()
