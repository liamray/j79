/**************************************************************************************
 j79-utils test

 Copyright (c) 2016 Yevgeny Sergeyev
 License : Apache 2.0
 **************************************************************************************/

const j79Utils = require('./j79-utils');
const assert = require('assert');
const path = require('path');

assert(j79Utils.getType(79) === '[object Number]');
assert(j79Utils.isString(''));
assert(j79Utils.isInt(0));
assert(j79Utils.isBool(true));
assert(j79Utils.isArray([]));
assert(j79Utils.isObject({}));
assert(j79Utils.isFunction(function () {
}));

assert(j79Utils.wrapWithArrayIfNeeded('hello')[0] === 'hello');
assert(j79Utils.wrapWithObjIfNeeded('world', 'our')['our'] === 'world');

var obj = {
	a: 1,
	b: {
		first: 2,
		second: 3
	}
};
var obj2ArrayIfNeeded = j79Utils.obj2ArrayIfNeeded(obj);
assert(obj2ArrayIfNeeded.length === 3 && obj2ArrayIfNeeded[2] === 3);

assert(!j79Utils.isValSet(null));
assert(!j79Utils.isValSet(undefined));
assert(!j79Utils.isValSet(NaN));
assert(j79Utils.isValSet(''));

assert(j79Utils.replaceAll('701 198 373 198 560, 198', '198', 'nothing') === '701 nothing 373 nothing 560, nothing');

assert(j79Utils.isUnescapedCharAt('test', 't', 0));
assert(!j79Utils.isUnescapedCharAt('\\test', 't', 1));

assert(j79Utils.removeLastPathNode('C:\\Program Files\\nodejs\\node.exe') === 'C:\\Program Files\\nodejs');
assert(j79Utils.removeLastPathNode('/home/srv/test.sh') === '/home/srv');

assert(j79Utils.fixPathSlashes('C:\\Program Files\\nodejs\\node.exe') === ['C:', 'Program Files', 'nodejs', 'node.exe'].join(path.sep));
assert(j79Utils.fixPathSlashes('/home/srv/test.sh') === ['', 'home', 'srv', 'test.sh'].join(path.sep));

assert(j79Utils.assemblePath('c:\\\\', '\\Program Files\\', 'nodejs') === 'c:\\Program Files\\nodejs');

console.log('All tests are passed OK ;)');