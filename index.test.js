const {
  pixel2LatLng, getCircCoordHoriz, latLngDirCorrection, rotateCirc
} = require('./circFuncs')

describe('Pixel locations go to lat lngs', ()=>{
  it('converts correct', ()=>{
    console.log(pixel2LatLng(100, 100, 8000, 4000))
    console.log(pixel2LatLng(4000, 2000, 8000, 4000))
    console.log(pixel2LatLng(5000, 2000, 8000, 4000))
    console.log(pixel2LatLng(5000, 1000, 8000, 4000))
    console.log(pixel2LatLng(5000, 3000, 8000, 4000))
  })
})
describe('Gets Circular Coords horiz', ()=>{
  it('checks circ horiz coords', ()=>{
    console.log(getCircCoordHoriz(Math.PI/2, Math.PI/2, 2000))
    console.log(getCircCoordHoriz(0, 0, 2000))
    console.log(getCircCoordHoriz(Math.PI/100, 0, 2000))
    console.log(getCircCoordHoriz(0, Math.PI/100, 2000))
    console.log(getCircCoordHoriz(-Math.PI/100, 0, 2000))
    console.log(getCircCoordHoriz(0, -Math.PI/100, 2000))
    console.log(getCircCoordHoriz(Math.PI/100, Math.PI/100, 2000))
    console.log(getCircCoordHoriz(Math.PI/100, -Math.PI/100, 2000))
    console.log(getCircCoordHoriz(-Math.PI/100, Math.PI/100, 2000))
    console.log(getCircCoordHoriz(-Math.PI/100, -Math.PI/100, 2000))
    console.log(getCircCoordHoriz(Math.PI/4, Math.PI/4, 2000))
  })
  it('checks lat lng correction', ()=>{
    console.log(latLngDirCorrection(Math.PI/10, Math.PI/10, 0, 0))
    console.log(latLngDirCorrection(Math.PI/10, Math.PI/10, Math.PI/4, 0))
    console.log(latLngDirCorrection(-Math.PI/2.1, Math.PI/10, Math.PI/4, 0))
  })
  it('rotate circ', ()=>{
    console.log(rotateCirc(500, 500, 1000, 0))
    console.log(rotateCirc(500, 1500, 1000, 0))
    console.log(rotateCirc(1500, 500, 1000, 0))
    console.log(rotateCirc(1500, 1500, 1000, 0))
    console.log(rotateCirc(1000, 1500, 1000, 0))
    console.log(rotateCirc(1500, 1000, 1000, 0))
    console.log(rotateCirc(500, 1000, 1000, 0))
    console.log(rotateCirc(1000, 500, 1000, 0))
  })
})
