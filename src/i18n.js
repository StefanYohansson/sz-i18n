function isObject(obj) {
  type = typeof obj
  return type == "function" || type == "object" && !!obj
}

class Translator {
  constructor() {
    this.data = {
      values: {},
      contexts: []
    }
    this.globalContext = {}
  }

  getNumberOrContextFormat(defaultReplacers, optionalReplacers, formattingOrContext) {
    defaultText = null
    num = null
    if (typeof defaultReplacers == "number") {
      num = defaultReplacers
      formatting = optionalReplacers
      context = formattingOrContext || this.globalContext
    } else {
      defaultText = defaultReplacers
      if (typeof optionalReplacers == "number") {
        num = optionalReplacers
        formatting = formattingOrContext
      } else {
        formatting = optionalReplacers
        context = formattingOrContext || this.globalContext
      }

      return [defaultText, num, formatting, context]
    }
  }

  formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
    defaultText = null
    num = null

    if (isObject(replacers)) {
      formatting = replacers
      context = numOrFormattingOrContext || this.globalContext
    } else {
      [defaultText, num, formatting, context] = getNumberOrContextFormat(replacers, optionalReplacers, formattingOrContext);
    }

    return [defaultText, num, formatting, context]; 
  }


  translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context = this.globalContext) {
    [defaultText, num, formatting, context] = this.formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context)
    
    this.translateText(text, num, formatting, context, defaultText)
  }

  add(data) {
    if(data.values) {
      Object.keys(data.values).forEach(function (key) {
        let value = data.values[key]
        this.data.values[key] = value
      });
    }
    
    if(data.contexts) {
      data.contexts.map((context) => {
        this.data.contexts.push(context)
      })
    }
  }

  setContext(key, value) {
    this.globalContext[key] = value
  }

  clearContext(key) {
    this.globalContext[key] = null
  }

  reset() {
    this.data = {values: {}, contexts: []}
    this.globalContext = {}
  }

  resetData() {
    this.data = {values: {}, contexts: []}
  }

  resetContext() {
    this.globalContext = {}
  }
  
  translateText(text, num, formatting, context = this.globalContext, defaultText) {
    if(this.data == null) {
      return this.useOriginalText(defaultText || text, num, formatting)
    }

    contextData = this.getContextData(this.data, context)
    if(contextData) {
      result = this.findTranslation(text, num, formatting, contextData.values, defaultText)
    }

    if(!result) {
      result = this.findTranslation(text, num, formatting, this.data.values, defaultText)
    }

    if(!result) {
      return this.useOriginalText(defaultText || text, num, formatting)
    }

    return result;
  }

  findTranslation(text, num, formatting, data) {
    value = data[text]
    if(value == null) {
      return value;
    }
    if(num == null) {
      if(typeof value === "string") {
        return this.applyFormatting(value, num, formatting)
      }
    } else {
      if(value instanceof Array || value.length) {
        value.map((tripe) => {
            if((num >= triple[0] || triple[0] == null) && (num <= triple[1] || triple[1] == null)) {
            result = this.applyFormatting(triple[2].replace("-%n", String(-num)), num, formatting)
            return this.applyFormatting(result.replace("%n", String(num)), num, formatting)
          }
        })
      }
    }
    return null
  }

  getContextData(data, context) {
    if(data.contexts == null) {
      return data.contexts;
    }

    data.contexts.map((context) => {
      let equal = true
      context.matches.keys(context.matches).map(function(index) {
        let value = context.matches[index]
        equal = equal && value == context[key]
      });
      if(equal)
        return context  
    })
    return null
  }

  useOriginalText(text, num, formatting) {
    if(num == null)
      return this.applyFormatting(text, num, formatting)

    return this.applyFormatting(text.replace("%n", String(num)), num, formatting)
  }

  applyFormatting(text, num, formatting) {
    formatting.map((ind) => {
      regex = new RegExp("%{#{ ind }}", "g")
      text = text.replace(regex, formatting[ind])
    })
    return text
  }
}
