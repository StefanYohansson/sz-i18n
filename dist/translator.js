"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isObject(obj) {
  var type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
  return type == "function" || type == "object" && !!obj;
}

var Translator = function () {
  function Translator() {
    _classCallCheck(this, Translator);

    this.data = {
      values: {},
      contexts: []
    };
    this.globalContext = {};
  }

  _createClass(Translator, [{
    key: "getNumberOrContextFormat",
    value: function getNumberOrContextFormat(defaultReplacers, optionalReplacers, formattingOrContext) {
      var defaultText = null;
      var num = null;
      var formatting = null;
      var context = null;

      if (typeof defaultReplacers == "number") {
        num = defaultReplacers;
        formatting = optionalReplacers;
        context = formattingOrContext || this.globalContext;
      } else {
        defaultText = defaultReplacers;
        if (typeof optionalReplacers == "number") {
          num = optionalReplacers;
          formatting = formattingOrContext;
        } else {
          formatting = optionalReplacers;
          context = formattingOrContext || this.globalContext;
        }

        return [defaultText, num, formatting, context];
      }
    }
  }, {
    key: "formatParams",
    value: function formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
      var defaultText = null;
      var num = null;
      var formatting = null;

      if (isObject(defaultReplacers)) {
        formatting = defaultReplacers;
        context = numOrFormattingOrContext || this.globalContext;
      } else {
        var _getNumberOrContextFo = this.getNumberOrContextFormat(defaultReplacers, optionalReplacers, formattingOrContext);

        var _getNumberOrContextFo2 = _slicedToArray(_getNumberOrContextFo, 4);

        defaultText = _getNumberOrContextFo2[0];
        num = _getNumberOrContextFo2[1];
        formatting = _getNumberOrContextFo2[2];
        context = _getNumberOrContextFo2[3];
      }

      return [defaultText, num, formatting, context];
    }
  }, {
    key: "translate",
    value: function translate(text, defaultReplacers, optionalReplacers, formattingOrContext) {
      var context = arguments.length <= 4 || arguments[4] === undefined ? this.globalContext : arguments[4];

      var defaultText = null;
      var num = null;
      var formatting = null;

      var _formatParams = this.formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context);

      var _formatParams2 = _slicedToArray(_formatParams, 4);

      defaultText = _formatParams2[0];
      num = _formatParams2[1];
      formatting = _formatParams2[2];
      context = _formatParams2[3];

      return this.translateText(text, num, formatting, context, defaultText);
    }
  }, {
    key: "add",
    value: function add(data) {
      var _this = this;

      if (data.values) {
        (function () {
          var that = _this;
          Object.keys(data.values).forEach(function (key) {
            var value = data.values[key];
            that.data.values[key] = value;
          });
        })();
      }

      if (data.contexts) {
        data.contexts.map(function (context) {
          _this.data.contexts.push(context);
        });
      }
    }
  }, {
    key: "setContext",
    value: function setContext(key, value) {
      this.globalContext[key] = value;
    }
  }, {
    key: "clearContext",
    value: function clearContext(key) {
      this.globalContext[key] = null;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.data = { values: {}, contexts: [] };
      this.globalContext = {};
    }
  }, {
    key: "resetData",
    value: function resetData() {
      this.data = { values: {}, contexts: [] };
    }
  }, {
    key: "resetContext",
    value: function resetContext() {
      this.globalContext = {};
    }
  }, {
    key: "translateText",
    value: function translateText(text, num, formatting) {
      var context = arguments.length <= 3 || arguments[3] === undefined ? this.globalContext : arguments[3];
      var defaultText = arguments[4];

      if (this.data == null) {
        return this.useOriginalText(defaultText || text, num, formatting);
      }

      var contextData = this.getContextData(this.data, context);
      var result = null;

      if (contextData) {
        result = this.findTranslation(text, num, formatting, contextData.values, defaultText);
      }

      if (!result) {
        result = this.findTranslation(text, num, formatting, this.data.values, defaultText);
      }

      if (!result) {
        return this.useOriginalText(defaultText || text, num, formatting);
      }

      return result;
    }
  }, {
    key: "findTranslation",
    value: function findTranslation(text, num, formatting, data) {
      var _this2 = this;

      var value = data[text];
      if (value == null) {
        return value;
      }
      if (num == null) {
        if (typeof value === "string") {
          return this.applyFormatting(value, num, formatting);
        }
      } else {
        if (value instanceof Array || value.length) {
          value.map(function (tripe) {
            if ((num >= triple[0] || triple[0] == null) && (num <= triple[1] || triple[1] == null)) {
              result = _this2.applyFormatting(triple[2].replace("-%n", String(-num)), num, formatting);
              return _this2.applyFormatting(result.replace("%n", String(num)), num, formatting);
            }
          });
        }
      }
      return null;
    }
  }, {
    key: "getContextData",
    value: function getContextData(data, context) {
      if (data.contexts == null) {
        return data.contexts;
      }

      data.contexts.map(function (context) {
        var equal = true;
        context.matches.keys(context.matches).map(function (index) {
          var value = context.matches[index];
          equal = equal && value == context[key];
        });
        if (equal) return context;
      });
      return null;
    }
  }, {
    key: "useOriginalText",
    value: function useOriginalText(text, num, formatting) {
      if (num == null) return this.applyFormatting(text, num, formatting);

      return this.applyFormatting(text.replace("%n", String(num)), num, formatting);
    }
  }, {
    key: "applyFormatting",
    value: function applyFormatting(text, num, formatting) {
      if (formatting instanceof Array && formatting.length > 0) {
        formatting.map(function (ind) {
          regex = new RegExp("%{#{ ind }}", "g");
          text = text.replace(regex, formatting[ind]);
        });
      }
      return text;
    }
  }]);

  return Translator;
}();

exports.default = Translator;