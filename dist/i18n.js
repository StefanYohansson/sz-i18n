'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _translator = require('./translator');

var _translator2 = _interopRequireDefault(_translator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = function () {
  function i18n() {
    _classCallCheck(this, i18n);

    this.dictionaries = {};
    this.onceOldDict = null;
    this.activeDictionary = null;
    this.once = null;
  }

  _createClass(i18n, [{
    key: 'using',
    value: function using(dictionary) {
      var once = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.onceOldDict = this.activeDictionary;
      this.activeDictionary = dictionary;
      this.once = once;
      return this;
    }
  }, {
    key: 'translator',
    value: function translator() {
      var dictionary = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      return this.dictionaries[dictionary || this.activeDictionary];
    }
  }, {
    key: 'translate',
    value: function translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
      if (this.activeDictionary) {
        var result = this.dictionaries[this.activeDictionary].translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context);
        if (this.once) {
          this.activeDictionary = this.onceOldDict;
          this.once = null;
        }
        return result;
      }
      if (Object.keys(this.dictionaries).length == 1) return this.dictionaries[Object.keys(this.dictionaries)[0]].translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context);
    }
  }, {
    key: 'getAvailableDictionaries',
    value: function getAvailableDictionaries() {
      return this.dictionaries;
    }
  }, {
    key: 'getDictionary',
    value: function getDictionary(lang) {
      return this.dictionaries[lang];
    }
  }, {
    key: 'create',
    value: function create(lang, data) {
      var trans = new _translator2.default();
      if (data) {
        trans.add(data);
      }
      if (!this.dictionaries[lang]) {
        this.dictionaries[lang] = trans;
      }
      return trans;
    }
  }, {
    key: 'remove',
    value: function remove(lang) {
      delete this.dictionaries[lang];
    }
  }]);

  return i18n;
}();

exports.default = i18n;