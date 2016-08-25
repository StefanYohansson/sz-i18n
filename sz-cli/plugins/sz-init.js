'use strict';

var prompt = require('prompt-sync')()
var fs = require('fs')

class Init {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }

  init() {
    var fileExists = fs.existsSync('i18n.json')

    if (fileExists)
      console.log(`[WARNING] File already exists.
`)

    console.log(`This steps will guide you in creation of i18n.json file.
base, source and destination must be the path relative to this folder.
i.e: ./my/base/file.json

`)

    var config = {
      base: { message: 'Enter your base language file', required: true },
      source: { message: 'Enter your source (base files) folder', required: true },
      dest: { message: 'Enter your destination (translation files) folder', required: true },
      langs: { message: 'Enter your available languages (comma separated)', required: true },
      source_code: { message: 'Enter your source code (src) folder', required: true },
    }

    var result = {}
    var properties = Object.keys(config)
    var index = 0
    while (index < properties.length) {
      var key = properties[index]
      var rules = config[key]

      var message = rules.message || ''
      var required = rules.required || null

      var answer = prompt(`${message}: `)

      if (required && !answer) {
        console.log('Please provide correct information. This atrribute is required.')
      } else {
        result[key] = answer
        index++
      }
    }

    result.langs = result.langs.split(',')
    fs.writeFileSync('i18n.json', JSON.stringify(result, null, 2), 'utf8')

    console.log('Generated i18n.json config.')
  }
}

module.exports = Init
