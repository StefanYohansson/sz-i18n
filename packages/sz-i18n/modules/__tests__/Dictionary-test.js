/* eslint no-undef: 0 */
import { expect } from 'chai';
import Dictionary from '../Dictionary';
import DriverConfig from '../drivers';

import ptBR from './fixtures/ptBR';

const { DRIVER_JSON, DRIVER_PO } = DriverConfig;

const poPtBR = `
      msgid: test
      msgstr: teste
`;

describe('A <Dictionary>', () => {
  it('can receive a json dictionary map', () => {
    // driver json is the default, this is just for example
    const dictionary = new Dictionary(ptBR, { driver: DRIVER_JSON });
    expect(dictionary.dict).to.be.a('object');
    expect(dictionary.dict).to.equal(ptBR);
  });

  it('can receive a po dictionary map', () => {
    const dictionary = new Dictionary(poPtBR, { driver: DRIVER_PO });
    expect(dictionary.dict).to.be.a('string');
    expect(dictionary.dict).to.equal(poPtBR);
  });

  it('should throw invalid driver exception', () => {
    const newDictionary = () => new Dictionary(ptBR, { driver: 'invalid' });
    expect(newDictionary).to.throw('Invalid driver: invalid');
  });

  it('should fetch a valid translation', () => {
    const dictionary = new Dictionary(ptBR);
    expect(dictionary.translate('Cancel').resolve()).to.be.equal('Cancelar');
    expect(dictionary.translate('May').resolve()).to.be.equal('Talvez');
    expect(dictionary.translate('May').resolve('month')).to.be.equal('Maio');
  });

  it('should interpolate', () => {
    const dictionary = new Dictionary(ptBR);
    expect(dictionary.translate('Limit: %d', [1]).resolve())
      .to.be.equal('Limite: 1');
  });

  it('should pluralize', () => {
    const dictionary = new Dictionary(ptBR);
    expect(dictionary.translatePluralization('%n users', 1).resolve())
      .to.be.equal('1 usuário');
  });
});
