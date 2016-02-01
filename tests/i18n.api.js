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
    pt = _i.create('pt', {values: {"Cancel": "Cancelar", "Welcome %{name}": "Bem Vindo %{name}"}})
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

  it('should change japanese dictionary', () => {
    _i.getDictionary('ja').add({values: {
      "Hello": "こんにちは",
      "Yes": "はい",
      "No": "いいえ",
      "Ok": "Ok",
      "Cancel": "キャンセル",
      "%n comments":[
        [0, null, "%n コメント"]
      ],
      "_monkeys":"猿も木から落ちる"
    },
    contexts:[
      {
        "matches": {
          "gender":"male"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album":[
          [0, null, "%{name}は彼の%{album}アルバムに写真%n枚をアップロードしました"]
        ]
        }
      },
      {
        "matches": {
          "gender":"female"
        },
        "values": {
          "%{name} uploaded %n photos to their %{album} album":[
            [0, null, "%{name}は彼女の%{album}アルバムに写真%n枚をアップロードしました"]
          ]
        }
      }
    ]})
    
    assert(_i.getDictionary('ja').data.values['Hello'], 'こんにちは')
  })

  it('should translate using default dictionary', () => {
    assert(_i.translate('Cancel'), "キャンセル")
  })

  it('should pluralize japanese', () => {
    assert(_i.translate("%n comments", 0), "0 コメント")
    assert(_i.translate("%n comments", 1), "1 コメント")
    assert(_i.translate("%n comments", 2), "2 コメント")
  })

  it('should create an english dictionary', () => {
    _i.create('en', {
      values: {
        "Cancel": "Cancel",
        "%n comments":[
          [0, 0, "%n comments"],
          [1, 1, "%n comment"],
          [2, null, "%n comments"]
        ],
        "Due in %n days":[
          [null, -2, "Due -%n days ago"],
          [-1, -1, "Due Yesterday"],
          [0, 0, "Due Today"],
          [1, 1, "Due Tomorrow"],
          [2, null, "Due in %n days"]
        ]
      },
      contexts:[
        {
          "matches": {
            "gender":"male"
          },
          "values": {
            "%{name} uploaded %n photos to their %{album} album":[
              [0, 0, "%{name} uploaded %n photos to his %{album} album"],
              [1, 1, "%{name} uploaded %n photo to his %{album} album"],
              [2, null, "%{name} uploaded %n photos to his %{album} album"]
            ]
          }
        },
        {
          "matches": {
            "gender":"female"
          },
          "values": {
            "%{name} uploaded %n photos to their %{album} album":[
              [0, 0, "%{name} uploaded %n photos to her %{album} album"],
              [1, 1, "%{name} uploaded %n photo to her %{album} album"],
              [2, null, "%{name} uploaded %n photos to her %{album} album"]
            ]
          }
        }
      ] 
    })

    assert(_i.getDictionary('en').data.values['Cancel'], 'Cancel')
  })

  it('should pluralize english', () => {
    assert(_i.using('en').translate("%n comments", 0), "0 comments")
    assert(_i.using('en').translate("%n comments", 1), "1 comment")
    assert(_i.using('en').translate("%n comments", 2), "2 comments")
  })

  it('should complex pluralize english', () => {
    assert(_i.using('en').translate("Due in %n days", -2), "Due 2 days ago")
    assert(_i.using('en').translate("Due in %n days", -1), "Due Yesterday")
    assert(_i.using('en').translate("Due in %n days", 0), "Due Today")
    assert(_i.using('en').translate("Due in %n days", 1), "Due Tomorrow")
    assert(_i.using('en').translate("Due in %n days", 2), "Due in 2 days")
  })

  it('should interpolate', () => {
    assert(_i.using('pt').translate("Welcome %{name}", { name:"John" }), "Bem Vindo John")
  })

  it('should interpolate, pluralize and contextualize english', () => {
    assert(
      _i.using('en').translate("%{name} uploaded %n photos to their %{album} album", 1,
        { name:"John", album:"Buck's Night" },
        { gender:"male" }
      ),
      "John uploaded 1 photo to his Buck's Night album"
    )

    assert(
      _i.using('en').translate("%{name} uploaded %n photos to their %{album} album", 4,
        { name:"Jane", album:"Hen's Night" },
        { gender:"female" }
      ),
      "Jane uploaded 4 photos to her Hen's Night album"
    ) 
  })

  it('should interpolate, pluralize and contextualize japanese', () => {
    assert(
      _i.translate("%{name} uploaded %n photos to their %{album} album", 1,
        { name:"John", album:"Buck's Night" },
        { gender:"male" }
      ),
      "Johnは彼のBuck's Nightアルバムに写真1枚をアップロードしました"
    )

    assert(
      _i.translate("%{name} uploaded %n photos to their %{album} album", 4,
        { name:"Jane", album:"Hen's Night" },
        { gender:"female" }
      ),
      "Janeは彼女のHen's Nightアルバムに写真4枚をアップロードしました"
    ) 
  })
})
