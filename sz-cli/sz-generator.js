'use strict';

var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var sample = require('./sample.json')

class Generator {
  constructor(opts) {
    Object.keys(opts).map((key) => {
      this[key] = opts[key]
    })
  }
  
  generate() {
    console.log(JSON.stringify(sample, null, 2))
  }
}

module.exports = Generator
