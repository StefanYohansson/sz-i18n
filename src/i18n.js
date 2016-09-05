import Translator from './translator'

export default class i18n {
  constructor() {
    this.dictionaries = {}
    this.onceOldDict = null
    this.activeDictionary = null
    this.once = null
  }

  using(dictionary, once = true) {
    this.onceOldDict = this.activeDictionary
    this.activeDictionary = dictionary
    this.once = once
    return this
  }

  translator(dictionary = null) {
    return this.dictionaries[dictionary || this.activeDictionary]
  }

  translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context) {
    if(this.activeDictionary && this.activeDictionary in this.dictionaries) {
      const result = this.dictionaries[this.activeDictionary].translate(text, defaultReplacers, optionalReplacers, formattingOrContext, context)
      if(this.once) {
        this.activeDictionary = this.onceOldDict
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

  remove(lang) {
    delete this.dictionaries[lang]
  }
}
