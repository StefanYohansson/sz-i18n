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

  getQuantifier(haystack, needle, text) {
    if (!(haystack instanceof Array && haystack.length)) {
      return haystack;
    }

    const pluralizedText = haystack.reduce((acc, triple) => {
      if ((needle >= triple[0] || triple[0] == null)
         && (needle <= triple[1] || triple[1] == null)) {
        acc = triple[2].replace('-%n', String(-needle));
        acc = acc.replace('%n', String(needle));
      }
      return acc;
    }, text);

    return pluralizedText;
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
