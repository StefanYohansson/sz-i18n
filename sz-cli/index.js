#!/usr/bin/env node

var docopt = require('docopt')
var fs = require('fs')
szExporter = require('./sz-exporter')
szImporter = require('./sz-importer')
szGenerator = require('./sz-generator')

doc = `
Usage:
    sz-i18n export <source> -o <dest> -t <langs>
    sz-i18n import <source> -b <base> -o <dest> [-t <langs>]
    sz-i18n generate
    sz-i18n -h | --help | --version
`

var userArgs = process.argv.slice(2)
var packageConfig = {}
var opts = null

fs.readFile(__dirname + '/../package.json', (err, data) => {
  if(err) {
    throw(err)
  }

  packageConfig = JSON.parse(data)
  opts = docopt.docopt(doc, {argv: userArgs, version: packageConfig['version']})
  
  main()
})

function main() {
  if (opts.export) {
    ex = new szExporter({
      output: opts['-o'],
      target: opts['-t'],
      source: opts['<source>'],
      dest: opts['<dest>'],
      langs: opts['<langs>']
    })
    return ex.export()
  }

  if (opts.import) {
    im = new szImporter({
      output: opts['-o'],
      target: opts['-t'],
      base: opts['-b'],
      base_dest: opts['<base>'],
      source: opts['<source>'],
      dest: opts['<dest>'],
      langs: opts['<langs>']
    })
    return im.import()
  }

  if (opts.generate) {
    g = new szGenerator({})

    return g.generate()
  }

  return 0
}

