'use strict';

var fs = require('fs')
var _ = require('lodash')
var recursive = require('recursive-readdir')

class Extractor {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }
  
  extract() {
  }
}

