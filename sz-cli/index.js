#!/usr/bin/env node

var docopt = require('docopt')
var fs = require('fs')
szExporter = require('./sz-exporter')

doc = `
Usage:
    sz-i18n export [-f | -d] <source> <dest> -t <langs>
    sz-i18n import [-f | -d] <source> <dest> 
    sz-i18n -h | --help | --version
`

var userArgs = process.argv.slice(2)
var packageConfig = {}
var opts = null

fs.readFile(__dirname + '/../package.json', (err, data) => {
  if(err) {
    return console.log(err)
  }

  packageConfig = JSON.parse(data)
  opts = docopt.docopt(doc, {argv: userArgs, version: packageConfig['version']})
  
  main()
})

function main() {
  if (opts.export) {
    ex = new szExporter({
      directory: opts['-d'],
      file: opts['-f'],
      source: opts['<source>'],
      dest: opts['<dest>'],
      langs: opts['<langs>']
    })
    return ex.export()
  }

  if (opts.import) {

  }

  return 0
}

