#!/usr/bin/env node

var docopt = require('docopt')
var fs = require('fs')
var _ = require('lodash')
var plugins = require('./plugins')

doc = `
Usage:
    sz-i18n init
    sz-i18n extract [<source_code>] [<base>] [-t <langs>]
    sz-i18n export [<base>] [-o <dest>] [-t <langs>]
    sz-i18n import [<source>] [-b <base>] [-o <dest>] [-t <langs>]
    sz-i18n generate
    sz-i18n -h | --help | --version
`

var userArgs = process.argv.slice(2)
var packageConfig = {}
var opts = null
var config = {}

var packageConfig = fs.readFileSync(__dirname + '/../package.json', 'utf8')
packageConfig = JSON.parse(packageConfig)
opts = docopt.docopt(doc, {argv: userArgs, version: packageConfig['version']})

try {
  config = JSON.parse(fs.readFileSync('i18n.json', 'utf8'))
} catch(e) {
  if (!opts.init) {
    console.log(e.message)
    console.log('Please make sure you have any i18n.json in current folder or provide arguments.')
    process.exit(0)
  }
}

// entrypoint
main(config)


function validateConfig(config) {
  _.map(config, (value, key) => {
    if (!value) {
      console.log(`Please provide ${key} and make sure it isn't empty in i18n.json.`);
      process.exit(0)
    }
  })
}

function main(config) {
  validateConfig(config)

  if (opts.init) {
    i = new plugins.szInit({})
    return i.init()
  }

  if (opts.extract) {
    et = new plugins.szExtractor({
      source_code: opts['<source_code>'] || config['source_code'],
      base: opts['base'] || config['base'],
      langs: opts['langs'] || config['langs'].join(',')
    })
    return et.extract()
  }

  if (opts.export) {
    ex = new plugins.szExporter({
      output: opts['-o'],
      target: opts['-t'],
      source: opts['<base>'] || config['base'],
      dest: opts['<dest>'] || config['dest'],
      base_lang: config['base_lang'],
      langs: opts['<langs>'] || config['langs'].join(',')
    })
    return ex.export()
  }

  if (opts.import) {
    im = new plugins.szImporter({
      output: opts['-o'],
      target: opts['-t'],
      base: opts['-b'],
      base_dest: opts['<base>'] || config['base'],
      source: opts['<source>'] || config['dest'],
      dest: opts['<dest>'] || config['source'],
      langs: opts['<langs>'] || config['langs'].join(',')
    })
    return im.import()
  }

  if (opts.generate) {
    g = new plugins.szGenerator({})

    return g.generate()
  }

  return 0
}
