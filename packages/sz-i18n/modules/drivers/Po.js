import Driver from './Driver';
import InvalidDictionaryType from './InvalidDictionaryType';

class Po extends Driver {
  constructor(dict) {
    const dictType = typeof dict;
    if (dictType !== 'string') {
      throw (new InvalidDictionaryType(`You should provide an string as dictionary. ${dictType} given.`));
    }
    super(dict);
  }
}

export default Po;
