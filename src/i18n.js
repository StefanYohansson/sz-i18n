import Translator from './translator'

class i18n {
  constructor() {
    this.dictionaries = {}
    this.activeDictionary = null
  }

  useDictionary(dictionary) {
    this.activeDictionary = dictionary
  }

  translator(dictionary = null) {
    return this.dictionaries[dictionary || this.activeDictionary]
  }

  getAvailableDictionary() {
    return this.dictionaries
  }

  create(data) {
    trans = new Translator
    if(data) {
      trans.add(data)
    }
    return trans
  }
}

i18n.translate = Translator.translate

export default i18n
