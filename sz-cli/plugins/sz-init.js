'use strict';

var ask = require('ask-sync');
var fs = require('fs');

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

    var config = ask({
      base: ask.string('Enter your base language file'),
      source: ask.string('Enter your source (base files) folder'),
      dest: ask.string('Enter your destination (translation files) folder'),
      langs: ask.string('Enter your available languages (comma separated)'),
      source_code: ask.string('Enter your source code (src) folder'),
    })
    
    config.langs = config.langs.split(',')
    fs.writeFileSync('i18n.json', JSON.stringify(config, null, 2), 'utf8')

    console.log('Generated i18n.json config.')
  }
}

module.exports = Init
