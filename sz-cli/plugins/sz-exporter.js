'use strict';

var fs = require('fs')
var path = require('path')
var _ = require('lodash')

class Exporter {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }

  export() {
    const callback = (srcData) => {
      const messages = this.extract(srcData)
      this.createDst(messages)
    }

    this.extractSrc(callback)

    return 0
  }

  extractSrc(callback) {
    this.getFileData(this.source, false, callback)
  }

  getFileData(file, empty, callback) {
    var that = this

    fs.open(file, 'a', (err, fd) => {
      if(err)
        throw(err)
      fs.readFile(file, 'utf8', (err, data) => {
        if(err)
          throw('No Access to file: ' + file)
        if(!data && !empty)
          throw('File empty: ' + file)

        if(data) {
          data = JSON.parse(data)
          callback(data)
        } else {
          callback({})
        }
      })
      fs.close(fd)
    })
  }

  extract(data) {
    if(!data) {
      return data
    }

    let messages = []
    if(data.values) {
      messages = this.extractValues(data.values)
    }

    if(data.contexts) {
      messages = messages.concat(this.extractContexts(data.contexts))
    }

    messages.sort()
    messages = _.uniq(messages)

    return messages
  }

  extractValues(values) {
    let nested_messages = []

    let messages = Object.keys(values).map((key) => {
      const value = values[key]
      if(typeof value == 'object') {
        nested_messages.push(value)
      }
      return key
    })

    let result = nested_messages.map((value, key) => {
      return this.extractNested(value)
    })

    let result_nested_messages = []
    for(var i=0;i<result.length;i++) {
      const value = result[i]
      for(var j=0;j<value.length;j++) {
        result_nested_messages.push(value[j])
      }
    }

    messages = messages.concat(result_nested_messages)

    return messages
  }

  extractNested(nested) {
    const messages = Object.keys(nested).map((key) => {
      const value = nested[key]
      const last_value = value[value.length-1]

      if(typeof last_value === 'string')
        return last_value

      if(typeof value == 'object')
        return this.extractNested(nested)
    })
    return messages
  }

  extractContexts(contexts) {
    let messages = []

    messages = Object.keys(contexts).map((key) => {
      const value = contexts[key]

      return this.extractValues(value.values)
    })

    let result_nested_messages = []
    for(var i=0;i<messages.length;i++) {
      const value = messages[i]
      for(var j=0;j<value.length;j++) {
        result_nested_messages.push(value[j])
      }
    }
    messages = result_nested_messages

    return messages
  }

  createDst(messages) {
    const callback = (lang, file, translated_messages) => {
      let keys_translated_messages = Object.keys(translated_messages)
      let result = _.xor(messages, keys_translated_messages)
      result.map((value, key) => {
        translated_messages[value] = ""
        if (this.base_lang && lang == this.base_lang) {
          translated_messages[value] = value
        }

        return translated_messages[value]
      })

      fs.writeFile(file, JSON.stringify(translated_messages, null, '  '), 'utf8', (err) => {
        if(err) throw err

        console.log('File Saved: ', file)
      });
    }

    this.getFileDataDest(this.dest, true, callback)
  }

  getFileDataDest(dest_folder, empty, callback) {
    var langs = this.langs.split(',')
    fs.stat(dest_folder, (err, stat) => {
      if(err) {
        if(err.code == 'ENOENT') {
          fs.mkdir(dest_folder)
        }
      }
      langs.map((lang) => {
        let lang_folder = dest_folder + path.sep + lang
        fs.stat(lang_folder, (e, st) => {
          if(e) {
            if(e.code == 'ENOENT') {
              fs.mkdir(lang_folder)
            }
          }
        })

        let createFile = (file) => {
          fs.readFile(file, 'utf8', (err, data) => {
            if(err)
              throw('No Access to file: ' + file)
            if(!data && !empty)
              throw('File empty: ' + file)
            if(data) {
              data = JSON.parse(data)
              callback(lang, file, data)
            } else {
              callback(lang, file, {})
            }
          })
        }

        let file = lang_folder + path.sep + lang + '.json'
        fs.stat(file, (e, st) => {
          if(e) {
            if(e.code == 'ENOENT') {
              fs.open(file, 'a', (er, fd) => {
                createFile(file)
                fs.close(fd)
              })
            }
          } else {
            createFile(file)
          }
        })
      })
    })
  }
}

module.exports = Exporter
