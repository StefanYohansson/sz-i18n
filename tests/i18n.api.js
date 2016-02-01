const chai = require('chai')
import i18n from '../dist/i18n'

const assert = chai.assert.equal

describe("API", () => {
  const _i = new i18n
  var ja = null
  var pt = null
  
  it('should create a japanese instance', () => {
    ja = _i.create('ja', {values: {"Cancel": "キャンセル"}})
    assert(typeof _i.getDictionary('ja'), "object")
  })

  it('should translate from japanese', () => {
    assert(ja.translate('Cancel'), "キャンセル")
    assert(_i.using('ja').translate('Cancel'), "キャンセル")
  })

  it('should create a portuguese instance', () => {
    pt = _i.create('pt', {values: {"Cancel": "Cancelar"}})
    assert(typeof _i.getDictionary('pt'), "object")
  })

  it('should translate from portuguese', () => {
    assert(pt.translate('Cancel'), "Cancelar")
    assert(_i.using('pt').translate('Cancel'), "Cancelar")
  })

  it('should have two instances in pool', () => {
    assert(Object.keys(_i.getAvailableDictionaries()).length == 2, true)
  })

  it('should set japanese as default dictionary', () => {
    _i.using('ja', false);
    assert(_i.activeDictionary, 'ja')
  })

  it('should translate using default dictionary', () => {
    assert(_i.translate('Cancel'), "キャンセル")
  })
})