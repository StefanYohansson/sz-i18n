sz-i18n
======

[![Build Status](https://travis-ci.org/StefanYohansson/sz-i18n.svg?branch=master)](https://travis-ci.org/StefanYohansson/sz-i18n) [![npm version](https://badge.fury.io/js/sz-i18n.svg)](https://badge.fury.io/js/sz-i18n)

Internationalization library. ️ Easy and Fast. ⚡️

Highly inspired by: https://github.com/roddeh/i18njs

## Install
```sh
npm install sz-i18n
```

## Test
```sh
npm test
```

## How to use

### Simple example

```javascript
  var i = new i18n
  var ja = i.create('ja', {values: {'Cancel': 'キャンセル'}})
  i.translate('Cancel')
  // result: キャンセル
```

### Two dictionaries

```javascript
  var i = new i18n
  var ja = i.create('ja', {values: {'Cancel': 'キャンセル'}})
  var pt = i.create('pt', {values: {'Cancel': 'Cancelar'}})
  
  i.using('pt').translate('Cancel')
  // result: Cancelar
  // or
  pt.translate('Cancel')
  // result: Cancelar

  i.using('ja').translate('Cancel')
  // result: キャンセル
  // or
  ja.translate('Cancel')
  // result: キャンセル
```

### Change dictionary values

```javascript
  var i = new i18n
  var ja = i.create('ja', {values: {'Cancel': 'キャンセル'}})
  // result: キャンセル

  i.using('ja').translate('Cancel')

  i.getDictionary('ja').add({values: {
  "Hello": "こんにちは"
  }})

  i.using('ja').translate('Hello')
  // result: こんにちは
```

### Pluralisation

```javascript
  var i = new i18n
  var ja = i.create('ja', {
            values: {
              "Hello": "こんにちは",
              "Yes": "はい",
              "No": "いいえ",
              "Ok": "Ok",
              "Cancel": "キャンセル",
              "%n comments":[
              [0, null, "%n コメント"]
              ],
              "_monkeys":"猿も木から落ちる"
            }
          })

 i.translate("%n comments", 0)
 // result: 0 コメント 
 i.translate("%n comments", 1)
 // result: 1 コメント
 i.translate("%n comments", 2)
 // result: 2 コメント
```

### Interpolation

```javascript
  var i = new i18n
  var pt = i.create('pt', {values: {'Welcome %{name}': 'Bem Vindo %{name}'}})

  i.translate('Welcome %{name}', { name:"John" })
  // result: Bem Vindo John
```

### Contexts

```javascript
  var i = new i18n
  var en = _i.create('en', {
      values: {},
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

  i.using('en').translate("%{name} uploaded %n photos to their %{album} album", 1,
    { name:"John", album:"Buck's Night" },
    { gender:"male" }
  )
  // result: John uploaded 1 photo to his Buck's Night album
```
