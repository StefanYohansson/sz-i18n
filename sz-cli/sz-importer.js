'use strict';

var fs = require('fs')
var path = require('path')
var _ = require('lodash')

class Importer {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }

  import() {
    this.checkBaseFile(this.base_dest)

    return 0
  }

  checkBaseFile(base, callback) {
    fs.readFile(base, 'utf8', (err, data) => {
      if(err)
        throw(err)
      this.importDest(data)
    })
  }
  
  importDest(t_messages_content) {
    const langs = this.langs.split(',')
    fs.stat(this.source, (err, stat) => {
      if(err)
        throw(err)

      langs.map((lang) => {
        let lang_folder = this.source + lang
        fs.stat(lang_folder, (e, st) => {
          if(e)
            throw(e)
        
          let file = lang_folder + path.sep + lang + '.json'
          fs.readFile(file, 'utf8', (e, data) => {
            if(e)
              throw(e)
            data = JSON.parse(data)
            this.replaceLang(lang, t_messages_content, data)
          })
        })
      })
    })
  }

  replaceLang(lang, content, data) {
    const messages = Object.keys(data)
    messages.map((message) => {
      const value = data[message]
      if(value != '') {
        content = content.replace(new RegExp("(.*[:] )?\""+message+"\"([,\\]])","gi"), "$1\"" + value + "\"$2") 
        content = content.replace(new RegExp("(.*[:] )?\""+message+"\"","gi"), "$1\"" + value + "\"") 
      }
    })
    this.saveDest(lang, content)
  }

  saveDest(lang, content) {
    let lang_file = this.dest + path.sep + lang + '.json'
    fs.writeFile(lang_file, content, 'utf8', (err) => {
      if(err) 
        throw(err)
      console.log('File Saved: ' + lang_file)
    })
  }
}

module.exports = Importer 
