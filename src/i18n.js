import Translator from './translator'

export default class i18n {
  constructor() {
    this.dictionaries = {}
    this.activeDictionary = null
    this.once = null
  }

  using(dictionary, once = true) {
    this.activeDictionary = dictionary
    this.once = once
    return this
  }

  translator(dictionary = null) {
    return this.dictionaries[dictionary || this.activeDictionary]
  }

  translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
    if(this.activeDictionary) {
      const result = this.dictionaries[this.activeDictionary].translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context)
      if(this.once) {
        this.activeDictionary = null
        this.once = null
      }
      return result
    }
    if(Object.keys(this.dictionaries).length == 1)
      return this.dictionaries[Object.keys(this.dictionaries)[0]].translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context)
  }

  getAvailableDictionaries() {
    return this.dictionaries
  }

  getDictionary(lang) {
    return this.dictionaries[lang]
  }

  create(lang, data) {
    let trans = new Translator
    if(data) {
      trans.add(data)
    }
    if(!this.dictionaries[lang]) {
      this.dictionaries[lang] = trans
    }
    return trans
  }
}
