import Dictionary from './Dictionary';

class I18n {
  constructor(dictionary, options = {}) {
    this.dictionary = new Dictionary(dictionary, options);
  }

  translate(text, replaceArguments) {
    return this.dictionary.translate(text, replaceArguments).resolve();
  }

  lazy(text, replaceArguments) {
    return this.dictionary.translate(text, replaceArguments);
  }
}

export default I18n;
