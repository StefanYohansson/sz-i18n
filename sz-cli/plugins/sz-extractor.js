'use strict';

var fs = require('fs')
var _ = require('lodash')
var recursive = require('recursive-readdir')
var ask = require('ask-sync');

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
  }

  extractFromFile(file) {
    var content = fs.readFileSync(file, 'utf8')
    // @TODO: this rule should comes from config file 
    var reg = new RegExp("i18n\\.t\\(['\"`](.*?)['\"`]\\)", 'g')
    var matches = [];
    var match;
    while (match !== null) {
      match = reg.exec(content)
      if(match)
        matches.push(match[1])
    }
    return matches
  }
  
  promptCommands(messages) {
    messages.map(promptString);
    
    function promptString(message) {
      /*
      var reg = new RegExp("%[snfd]", 'g')
      var match = message.match(reg)

      console.log('message:', match);
      
      
      var options = ask({
        'has_context': ask.string('The string has context?', {
          values: ['y', 'n']
        })
      })

      console.log(options)
      */
    }
  }

  extract() {
    const extract_rules = this.extract_rules || ['!*.js'];
    recursive(this.source_code, extract_rules, (err, files) => {
      var messages = files.map(this.extractFromFile)
      // remove no matches
      messages = _.filter(messages, (f) => { return f.length })
      // merge matches
      var all_messages = [].concat.apply([], messages)
      // remove duplicate
      all_messages = unique(all_messages)
      // get collected messages
      var base_file = fs.readFileSync(this.base, 'utf8')
      if(!base_file)
        console.log("You need to generate a base file and reference in config or provide by argument. Please read the docs.");
      // filter existing messages
      messages = _.filter(all_messages, (f) => { return base_file.indexOf(f) == -1 })
      // ask what user want to do
      this.promptCommands(messages)
    })
  }
}

module.exports = Extractor;
