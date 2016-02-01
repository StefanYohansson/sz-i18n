function isObject(obj) {
  const type = typeof obj
  return type == "function" || type == "object" && !!obj
}

export default class Translator {
  constructor() {
    this.data = {
      values: {},
      contexts: []
    }
    this.globalContext = {}
  }

  getNumberOrContextFormat(defaultReplacers, optionalReplacers, formattingOrContext) {
    let defaultText = null
    let num = null
    let formatting = null
    let context = null
    
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
    }
    return [defaultText, num, formatting, context]
  }

  formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
    let defaultText = null
    let num = null
    let formatting = null
    
    if (isObject(defaultReplacers)) {
      formatting = defaultReplacers
      context = optionalReplacers || this.globalContext
    } else {
      [defaultText, num, formatting, context] = this.getNumberOrContextFormat(defaultReplacers, optionalReplacers, formattingOrContext);
    }
    
    return [defaultText, num, formatting, context]; 
  }


  translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context = this.globalContext) {
    let defaultText = null
    let num = null
    let formatting = null;

    [defaultText, num, formatting, context] = this.formatParams(text, defaultReplacers, optionalReplacers, formattingOrContext, context)

    return this.translateText(text, num, formatting, context, defaultText)
  }

  add(data) {
    if(data.values) {
      let that = this
      Object.keys(data.values).forEach(function (key) {
        let value = data.values[key]
        that.data.values[key] = value
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

    let contextData = this.getContextData(this.data, context)
    let result = null
    
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
    let value = data[text]
    
    if(value == null) {
      return value;
    }
    if(num == null) {
      if(typeof value === "string") {
        return this.applyFormatting(value, num, formatting)
      }
    } else {
      if(value instanceof Array || value.length) {
        let result = null
        value.map((triple) => {
            if((num >= triple[0] || triple[0] == null) && (num <= triple[1] || triple[1] == null)) {
            result = this.applyFormatting(triple[2].replace("-%n", String(-num)), num, formatting)
            result = this.applyFormatting(result.replace("%n", String(num)), num, formatting)
          }
        })
        return result
      }
    }
    return null
  }

  getContextData(data, context) {
    if(data.contexts == null) {
      return data.contexts;
    }

    let equal = true
    let i = null
    let len = null
    let key = null

    for(i = 0, len = data.contexts.length; i < len; i++) {
      const c = data.contexts[i]
      let equal = true
      const matches = c.matches
      for (key in matches) {
        let value = matches[key]
        equal = equal && value === context[key]
      }
      if(equal) {
        return c;
      }
    }
    
    return null
  }

  useOriginalText(text, num, formatting) {
    if(num == null)
      return this.applyFormatting(text, num, formatting)

    return this.applyFormatting(text.replace("%n", String(num)), num, formatting)
  }

  applyFormatting(text, num, formatting) {
    if(!formatting) {
      return text
    }

    Object.keys(formatting).map((ind) => {
      const regex = new RegExp("%{" + ind + "}", "g")
      text = text.replace(regex, formatting[ind])
    })
    return text
  }
}
