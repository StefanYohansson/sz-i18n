import Driver from './Driver';
import InvalidDictionaryType from './InvalidDictionaryType';

class Json extends Driver {
  constructor(dict) {
    const dictType = typeof dict;
    if (dictType !== 'object') {
      throw (new InvalidDictionaryType(`You should provide an object as dictionary. ${dictType} given.`));
    }
    super(dict);
  }

  getText(text, context = null) {
    let values = this.dictionary.values || this.dictionary;

    if (context) {
      values = this.dictionary.contexts[context] || this.dictionary;
    }

    return values[text] || text;
  }
}

export default Json;
