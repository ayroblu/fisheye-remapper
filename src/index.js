const fs = require('fs')

const getPixels = require("get-pixels")
const savePixels = require('save-pixels')
const zeros = require("zeros")
const {
  pixel2LatLng, getCircCoordHoriz
, latLngDirCorrection, rotateCirc
} = require('./circFuncs')
 
async function run(inputFilename, outputFilename, options={}){
  const log = options.silent ? ()=>{} : console.log
  if (!inputFilename) {
    return log('Missing input filename')
  }
  if (!outputFilename) {
    return log('Missing output filename')
  }
  log('Reading ', inputFilename)
  const pixels = await new Promise((y,n)=>{
    getPixels(inputFilename, function(err, pixels) {
      if(err) {
        log("Bad image path")
        n(err)
        return
      }
      y(pixels)
    })
  })
  log('Pixels read, making changes')
  
  const width = pixels.shape[0]
  const height = pixels.shape[1]
  const dim = Math.min(width, height)
  const im = zeros([dim*2, dim, 4])

  const xOffset = (width - dim) / 2
  const yOffset = (height - dim) / 2
  for (var i = 0; i < dim*2; ++i) {
    for (var j = 0; j < dim; ++j) {
      const ll = pixel2LatLng(i, j, dim*2, dim)
      
      const {lat,lng} = options.persp
        ? latLngDirCorrection(ll.lat, ll.lng, options.persp.theta, options.persp.phi)
        : ll
      const {x,y} = getCircCoordHoriz(lat, lng, dim/2)
      const coord = options.rot
        ? rotateCirc(x, y, dim/2, options.rot)
        : {x,y}
      for (var k = 0; k < 4; ++k) {
        im.set(i,j,k, pixels.get(parseInt(coord.x, 10)+xOffset,parseInt(coord.y, 10)+yOffset,k))
      }
    }
  }
  
  log('writing...', outputFilename)
  const isPng = outputFilename.endsWith('.png')
  const writeStream = fs.createWriteStream(outputFilename, { flags : 'w' });
  savePixels(im, isPng ? 'png' : 'jpg').pipe(writeStream)

  writeStream.on('close', function () {
    log('All done!');
  })
}

module.exports = run
//run('image.jpg', 'someFile.jpg', {
//  persp: {theta: 35/180*Math.PI, phi: 0}
//, rot: -6/180*Math.PI
//})
