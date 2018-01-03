<p align="center">
  <b>sz-i18n</b>
  <br><br>
  <img width="45" src="https://raw.githubusercontent.com/StefanYohansson/sz-dotfiles/master/8bheart.png">
</p>

[![Join the chat at https://gitter.im/StefanYohansson/sz-i18n](https://badges.gitter.im/StefanYohansson/sz-i18n.svg)](https://gitter.im/StefanYohansson/sz-i18n?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/StefanYohansson/sz-i18n.svg?branch=master)](https://travis-ci.org/StefanYohansson/sz-i18n) [![npm version](https://badge.fury.io/js/sz-i18n.svg)](https://badge.fury.io/js/sz-i18n)

[![NPM](https://nodei.co/npm/sz-i18n.png?downloads=true&stars=true)](https://nodei.co/npm/sz-i18n/)


Another Internationalization library.

## Install
```sh
npm install sz-i18n
```

Then with a module bundler like webpack, use as you would anything else:

```
import i18n from 'sz-i18n';
import getDictionaryByLanguage from './helpers/i18n';

// this should return an object containing
// the translations to be inputed on i18n lib
const dictionary = getDictionaryByLanguage(navigator.language);

// driver can be omitted, json is the default option
window.__ = new i18n(dictionary, { driver: 'json' });

// feel free to create shortcuts
__.t = __.translate;
__.l = __.lazy;

console.log(__.t('Cancel'));
console.log(__.l('May').resolve('month'));
```

## Test
```sh
npm test
```
