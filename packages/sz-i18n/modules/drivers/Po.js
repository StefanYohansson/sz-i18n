import sprintf from 'sprintf-js';
import Driver from './Driver';
import InvalidDictionaryType from './InvalidDictionaryType';
import { parse as parsePo } from './PoParser/PoParser';

class Po extends Driver {
  constructor(dict) {
    const dictType = typeof dict;
    if (dictType !== 'string') {
      throw (new InvalidDictionaryType(`You should provide an string as dictionary. ${dictType} given.`));
    }

    const dictionary = parsePo(dict);    
    super(dictionary);
  }

  _getPluralForm(pluralForm) {
    // Plural form string regexp
    // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
    // plural forms list available here http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html
    var pfRe = new RegExp('^\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;n0-9_\(\)])+');
    
    if (!pfRe.test(pluralForm))
      throw new Error(`The plural form "${pluralForm}" is not valid`);

    // Careful here, this is a hidden eval() equivalent..
    // Risk should be reasonable though since we test the plural_form through regex before
    // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
    // TODO: should test if https://github.com/soney/jsep present and use it if so
    return new Function("n", 'var plural, nplurals; '+ pluralForm +' return { nplurals: nplurals, plural: (plural === true ? 1 : (plural ? plural : 0)) };');
  }

  getQuantifier(haystack, needle, text) {
    if (!this.dictionary['headers'] || !this.dictionary['headers']['Plural-Forms']) {
      throw new Error('PO file doesnt provide header with plural form');
    }

    const pluralIndex = this._getPluralForm(this.dictionary['headers']['Plural-Forms']);
    const translatedTextIndex = pluralIndex(needle).plural;

    return sprintf.vsprintf(haystack[translatedTextIndex], needle);
  }

  getText(text, context = '') {
    let values = this.dictionary.translations || this.dictionary;

    if (context) {
      values = this.dictionary.translations[context] || values;
    } else {
      values = values[''] ? values[''] : values;
    }

    let result = values[text].msgstr;

    if (result.length == 1) {
      result = result[0];
    }

    return result;
  }
}

export default Po;
