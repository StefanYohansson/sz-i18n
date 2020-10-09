/* eslint no-param-reassign: 0 */
import sprintf from 'sprintf-js';
import DriverConfig from './drivers';
import InvalidDriverException from './drivers/InvalidDriverException';

const { DEFAULT_DRIVER, driversMap } = DriverConfig;

class T {
  constructor(translatorFn) {
    this.translatorFn = translatorFn;
  }

  resolve(context) {
    return this.translatorFn(context);
  }
}

class Dictionary {
  constructor(dict, options = {}) {
    this.dict = dict;

    const driver = options.driver || DEFAULT_DRIVER;
    if (!Object.keys(driversMap).includes(driver)) {
      throw (new InvalidDriverException(`Invalid driver: ${driver}`));
    }
    this.driver = new driversMap[driver](this.dict);
  }

  static replace(haystack, needle = []) {
    return sprintf.vsprintf(haystack, needle);
  }

  findByQuantifier(haystack, needle, text) {
    return this.driver.getQuantifier(haystack, needle, text);
  }

  translate(text, replaceArguments) {
    return new T((context = null) =>
      Dictionary.replace(
        this.driver.getText(text, context),
        replaceArguments,
      ));
  }

  translatePluralization(text, quantifier, replaceArguments) {
    return new T((context = null) =>
      Dictionary.replace(this.findByQuantifier(
        this.driver.getText(text, context),
        quantifier, text,
      ), replaceArguments));
  }
}

export default Dictionary;
