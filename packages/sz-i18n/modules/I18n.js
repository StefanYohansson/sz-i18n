import Dictionary from './Dictionary';

class I18n {
  constructor(dictionary, options = {}) {
    this.dictionary = new Dictionary(dictionary, options);
  }

  translate(text, replaceArguments, context) {
    return this.dictionary
      .translate(text, replaceArguments).resolve(context);
  }

  pluralize(text, quantifier, replaceArguments, context) {
    return this.dictionary
      .translatePluralization(text, quantifier, replaceArguments)
      .resolve(context);
  }

  lazy(text, replaceArguments) {
    return this.dictionary
      .translate(text, replaceArguments);
  }

  lazyp(text, quantifier, replaceArguments) {
    return this.dictionary
      .translatePluralization(text, quantifier, replaceArguments);
  }
}

export default I18n;
