const help = `
  Usage: fisheye-remapper [input-filename] [output-filename] [options]

  Options:

    -h, --help               output usage information
    -v, --version            output the version
    -t, --persp-theta        perspective change latitude in degrees
    -p, --persp-phi          perspective change longitude in degrees
    -r, --rotate             source circular fisheye rotation in degrees

  Example:

    $ fisheye-remapper image.jpg output.jpg
    $ fisheye-remapper -t 35 -p 0 -r -6 image.jpg output.jpg
`
const tooMany = `
  Sorry you've provided too many arguments
`
const notEnough = `
  Sorry you haven't provided enough arguments
`


module.exports = {
  help
, tooMany
, notEnough
}
