'use strict';

var fs = require('fs')
var _ = require('lodash')

class Importer {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }

  import() {
    checkBaseFile()

    return 0
  }

  checkBaseFile() {
    
  }
}

module.exports = Importer 
