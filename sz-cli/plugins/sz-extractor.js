'use strict';

var fs = require('fs')
var _ = require('lodash')
var recursive = require('recursive-readdir')
var prompt = require('prompt-sync')()
var colors = require('colors/safe')

function unique(list) {
  var result = [];
  _.each(list, function(v, k) {
    if (result.indexOf(v) == -1) result.push(v)
  });
  return result;
}

class Extractor {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
    this.source_map = [];
  }

  extractFromFile(file) {
    var content = fs.readFileSync(file, 'utf8')
    var lines = content.split('\n')

    var _matches = lines.map((line, k) => {
      // @TODO: this rule should comes from config file
      var reg = /i18n\.t\("([.\s\S]*?)".*?\)|i18n\.t\('([.\s\S]*?)'.*?\)|i18n\.t\(`([.\s\S]*?)`.*?\)/g
      var matches = [];
      var match;
      while (match !== null) {
        match = reg.exec(line)
        if(match) {
          matches.push(match[1] || match[2] || match[3])
          this.source_map.push(`${file}+${k}:${match[1] || match[2] || match[3]}`)
        }
      }
      return matches
    })

    return [].concat.apply([], _matches)
  }

  promptCommands(messages) {
    var result = { values: {} };
    _.each(messages, (message) => {
      console.log(colors.yellow('Processing: '))
      console.log(message)

      result['values'][message] = message;

      var reg = new RegExp("(.*?%[snfd].*?)")
      var match = message.match(reg)
      if(match) {
        var has_plural = prompt('We detected your string has replaceable values. Do you want to add plural? [y/n] ')
        if (has_plural == 'y') {
          var pluralization = [];
          var new_plural = true
          while (new_plural) {
            var range = prompt('Enter plural range: ')
            var plural_message = prompt(`Enter message for this range: [${message}]: `, message)
            range = range.split('-')
            var range1 = range[1]
            if (range1 == 'null') {
              range1 = null
            } else {
              range1 = Number(range1)
            }

            if (Number(range[0]) === null || Number(range[0]) === undefined || range1 === undefined) {
              console.log(colors.yellow('Skipping, check your string and try again.'));
              continue;
            }

            pluralization.push([Number(range[0]), range1, plural_message]);
            console.log(colors.green('Message created.'))

            var finish_plur = prompt(colors.red(`finish ${message} pluralization? [y/n/r]`), 'n')

            if (finish_plur == 'y') {
              new_plural = !(finish_plur == 'y');
            } else if (finish_plur == 'r') {
              pluralization.pop();
            }
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
      var messages = files.map(this.extractFromFile.bind(this))
      // remove no matches
      messages = _.filter(messages, (f) => { return f.length })
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
        var is_happy = prompt(colors.red(`are you happy? [y/n/q] `))
        if (is_happy == 'q') {
          process.exit(0)
        }

        user_happy = is_happy == 'y'
      }
      base_file = JSON.parse(base_file || '{}')
      all_messages = Object.assign(base_file, generated_messages)
      all_messages = JSON.stringify(all_messages, null, 2)
      fs.writeFileSync(this.base, all_messages, 'utf8')
      fs.writeFileSync(this.base+'.map', this.source_map.join('\n'), 'utf8')
    })
  }
}

module.exports = Extractor;
