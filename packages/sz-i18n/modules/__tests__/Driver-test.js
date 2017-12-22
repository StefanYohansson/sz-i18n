/* eslint no-undef: 0 */
import { expect } from 'chai';
import Json from '../drivers/Json';
import Po from '../drivers/Po';

import ptBR from './fixtures/ptBR';

describe('A <Json> Driver', () => {
  it('can receive a valid dictionary', () => {
    const jsonDriver = new Json({});
    expect(jsonDriver.dictionary).to.be.a('object');
  });

  it('should throw when receive invalid type', () => {
    const instantiateJsonDriver = () => new Json('');
    expect(instantiateJsonDriver)
      .to.throw('You should provide an object as dictionary. string given.');
  });

  it('should fetch a valid translation', () => {
    const jsonDriver = new Json(ptBR);
    expect(jsonDriver.getText('Cancel')).to.be.equal('Cancelar');
    expect(jsonDriver.getText('May')).to.be.equal('Talvez');
    expect(jsonDriver.getText('May', 'month')).to.be.equal('Maio');
  });
});

describe('A <Po> Driver', () => {
  it('can receive a valid dictionary', () => {
    const jsonDriver = new Po('');
    expect(jsonDriver.dictionary).to.be.a('string');
  });
});
