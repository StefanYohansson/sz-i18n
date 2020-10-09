/* eslint no-undef: 0 */
import regeneratorRuntime from "regenerator-runtime";
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import Dictionary from '../Dictionary';
import DriverConfig from '../drivers';

import ptBR from './fixtures/ptBR';

// this function is using fs but could be a http request on client side
function getFileDictionary(dictionary) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, dictionary), 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

const { DRIVER_JSON, DRIVER_PO } = DriverConfig;

describe('A <Dictionary>', () => {
  it('can receive a json dictionary map', () => {
    // driver json is the default, this is just for example
    const dictionary = new Dictionary(ptBR, { driver: DRIVER_JSON });
    expect(dictionary.dict).to.be.a('object');
    expect(dictionary.dict).to.equal(ptBR);
  });

  it('can receive a po dictionary map', async () => {
    const ptBRpo = await getFileDictionary('/fixtures/ptBR.po');
    const dictionary = new Dictionary(ptBRpo, { driver: DRIVER_PO });
    expect(dictionary.dict).to.be.a('string');
    expect(dictionary.dict).to.equal(ptBRpo);
  });

  it('should throw invalid driver exception', () => {
    const newDictionary = () => new Dictionary(ptBR, { driver: 'invalid' });
    expect(newDictionary).to.throw('Invalid driver: invalid');
  });

  describe('Resolve translations with <Json> Driver', () => {
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

  describe('Resolve translations with <Po> Driver', () => {
    it('should fetch a valid translation', async () => {
      const ptBRpo = await getFileDictionary('/fixtures/ptBR.po');
      const dictionary = new Dictionary(ptBRpo, { driver: DRIVER_PO });
      expect(dictionary.translate('Cancel').resolve()).to.be.equal('Cancelar');
      expect(dictionary.translate('May').resolve()).to.be.equal('Talvez');
      expect(dictionary.translate('May').resolve('Month')).to.be.equal('Maio');
    });
    
    it('should interpolate', async () => {
      const ptBRpo = await getFileDictionary('/fixtures/ptBR.po');
      const dictionary = new Dictionary(ptBRpo, { driver: DRIVER_PO });
      expect(dictionary.translate('Limit: %d', [1]).resolve())
        .to.be.equal('Limite: 1');
    });
    
    it('should pluralize', async () => {
      const ptBRpo = await getFileDictionary('/fixtures/ptBR.po');
      const dictionary = new Dictionary(ptBRpo, { driver: DRIVER_PO });
      expect(dictionary.translatePluralization('%d user', 1).resolve())
        .to.be.equal('1 usuário');
    });
  });
});
