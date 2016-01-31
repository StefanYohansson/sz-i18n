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
    this.activeDictionary = null;
  }

  _createClass(i18n, [{
    key: 'useDictionary',
    value: function useDictionary(dictionary) {
      this.activeDictionary = dictionary;
    }
  }, {
    key: 'translator',
    value: function translator() {
      var dictionary = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      return this.dictionaries[dictionary || this.activeDictionary];
    }
  }, {
    key: 'getAvailableDictionary',
    value: function getAvailableDictionary() {
      return this.dictionaries;
    }
  }, {
    key: 'create',
    value: function create(data) {
      trans = new _translator2.default();
      if (data) {
        trans.add(data);
      }
      return trans;
    }
  }]);

  return i18n;
}();

i18n.translate = _translator2.default.translate;

exports.default = i18n;