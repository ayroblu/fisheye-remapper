#!/usr/bin/env node

const options = require('minimist')(process.argv.slice(2), {
  alias: {p: 'persp-phi', t: 'persp-theta', r: 'rotate', v: 'version', h: 'help'}
})
const run = require('./src')
const {help, notEnough, tooMany} = require('./text')

if (options._.length === 0 || (options.h || options.help)) {
  console.log(help)
  process.exit(0)
}
if (options._.length === 0 && (options.v || options.version)) {
  printVersionsAndExit()
}

const commands = options._
if (commands.length > 2) {
  console.error(tooMany)
  process.exit(1)
}
if (commands.length < 2) {
  console.error(notEnough)
  process.exit(1)
}

const [inputFilename, outputFilename] = commands

const params = {
  persp: (options.t || options.p) ? {
    theta: parseFloat(options.t || 0)*Math.PI/180
  , phi: parseFloat(options.p || 0)*Math.PI/180
  } : null
, rot: parseFloat(options.r)*Math.PI/180
}
run(inputFilename, outputFilename, params)

function printVersionsAndExit() {
  console.log('fisheye-remapper: ' + require('./package.json').version)
  process.exit()
}





