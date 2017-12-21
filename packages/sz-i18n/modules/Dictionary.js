import {
  DEFAULT_DRIVER,
  driversMap,
} from './drivers';
import InvalidDriverException from './drivers/InvalidDriverException';

function replace(haystack, needle) {
  // @TODO: use sprintf library for this
  return haystack.replace(needle);
}

class T {
  constructor(translatorFn) {
    this.translatorFn = translatorFn;
  }

  resolve() {
    return this.translatorFn();
  }
}

class Dictionary {
  constructor(dict = {}, options) {
    this.dict = dict;

    const driver = options.driver || DEFAULT_DRIVER;
    if (!Object.keys(driversMap).includes(driver)) {
      throw InvalidDriverException;
    }
    this.driver = new driversMap[driver](this.dict);
  }

  translate(text, replaceArguments) {
    return new T(() => replace(this.driver.getText(text), replaceArguments));
  }
}

export default Dictionary;
