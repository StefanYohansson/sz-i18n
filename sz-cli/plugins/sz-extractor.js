'use strict';

var fs = require('fs')
var _ = require('lodash')
var recursive = require('recursive-readdir')
var readline = require('readline-sync')
var colors = require('colors/safe');

function unique(list) {
  var result = [];
  _.each(list, function(v, k) {
    if (result.indexOf(v) == -1) result.push(v);
  });
  return result;
}

class Extractor {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })

    this.matches = []
    this.source_map = []
  }

  addSourceMapLine(file, line, match) {
    this.source_map.push({
      file,
      line,
      match
    })
  }

  extractFromFile(file) {
    var content = fs.readFileSync(file, 'utf8')
    const strip = content.split(`\n`)
    var line_c = 1
    strip.map((line) => {
      // @TODO: this rule should comes from config file 
      var reg = /i18n\.t\(['"`](.*?)['"`].*?\)/g
      var matches = [];
      var match;
      while (match !== null) {
        match = reg.exec(line)
        if(match) {
          this.matches.push(match[1])
          this.addSourceMapLine(file, line_c, match[1])
        }
      }

      line_c++
    })
  }
  
  generateSourceMapContent() {
    var content = ''
    
    this.source_map.map((source) => {
      content = `${content}\n
      ${source.file}+${source.line}:${match}\n`
    })
    
    return content
  }
  
  promptCommands(messages) {
    var result = { values: {} };
    _.each(messages, (message) => {
      console.log(colors.yellow('Processing: '))
      console.log(message)
      
      result['values'][message] = message;
      
      var reg = new RegExp("(.*?%[snfd].*?)")
      var match = message.match(reg)
      if (match) {
        var has_plural = readline.keyInYNStrict('We detected your string has replaceable values. Do you want to add plural?')
        if (has_plural) {
          var pluralization = [];
          var new_plural = true
          while (new_plural) {
            var range = readline.question('Enter plural range: ')
            var plural_message = readline.question('Enter message for this range: ')
            range = range.split('-')
            var range1 = range[1]
            if (range1 == 'null') {
              range1 = null
            } else {
              range1 = Number(range1)
            }
            
            pluralization.push([Number(range[0]), range1, plural_message]);
            
            console.log('message created.')

            new_plural = !readline.keyInYNStrict(colors.red(`finish ${message} pluralization?`))
          }

          result['values'][message] = pluralization;
        }
      }
      console.log(colors.green('Processing next.\n'))
    })

    return result;
  }

  extract() {
    const extract_rules = this.extract_rules || ['!*.js'];
    recursive(this.source_code, extract_rules, (err, files) => {
      files.map(this.extractFromFile.bind(this))
      // remove no matches
      var messages = _.filter(this.matches, (f) => { return f.length })
      // merge matches
      var all_messages = [].concat.apply([], messages)
      // remove duplicate
      all_messages = unique(all_messages)
      // get collected messages
      var base_file = fs.readFileSync(this.base, 'utf8')
      if(!base_file)
        console.log(colors.red("You need to generate a base file and reference in config or provide by argument. Please read the docs."));
      // filter existing messages
      messages = _.filter(all_messages, (f) => { return base_file.indexOf(f) == -1 })
      // ask what user want to do
      var user_happy = false
      while (!user_happy) {
        var generated_messages = this.promptCommands(messages)
        console.log(colors.yellow('We\'ll generate this strings: '))
        console.log(colors.green(JSON.stringify(generated_messages, null, 2)))
        var is_happy = readline.question(colors.red(`are you happy? [y/n/q] `))
        if (is_happy == 'q') {
          process.exit(0)
        }

        user_happy = is_happy == 'y'
      }
      base_file = JSON.parse(base_file || '{}')
      all_messages = Object.assign(base_file, generated_messages)
      all_messages = JSON.stringify(all_messages, null, 2)
      fs.writeFileSync(this.base, all_messages, 'utf8')
      var source_map = this.generateSourceMapContent()
      fs.writeFileSync(this.base+'.map', source_map, 'utf8')
    })
  }
}

module.exports = Extractor;
