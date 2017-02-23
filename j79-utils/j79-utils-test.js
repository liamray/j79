/**************************************************************************************
 j79-utils test

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0
 **************************************************************************************/

const j79Utils = require('./j79-utils');
const assert = require('assert');
const path = require('path');

assert(j79Utils.getType(79) === '[object Number]');
assert(j79Utils.isString(''));
assert(j79Utils.isNumber(0));
assert(j79Utils.isBool(true));
assert(j79Utils.isArray([]));
assert(j79Utils.isObject({}));
assert(j79Utils.isObject(Math));
assert(j79Utils.isFunction(function () {
}));

assert(j79Utils.wrapWithArrayIfNeeded('hello')[0] === 'hello');
assert(j79Utils.wrapWithObjIfNeeded('world', 'our')['our'] === 'world');

var arr = [1, 2, 3];
assert(j79Utils.unwrapFromArrayIfPossible(arr) === arr);
assert(j79Utils.unwrapFromArrayIfPossible([4]) === 4);

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
assert(j79Utils.isValSet({}));
assert(j79Utils.isValSet(true));
assert(j79Utils.isValSet(-1));
assert(j79Utils.isPrimitive(1.4));
assert(j79Utils.isPrimitive('test'));
assert(j79Utils.isPrimitive(true));
assert(!j79Utils.isPrimitive({}));
assert(!j79Utils.isPrimitive(new Date()));
assert(!j79Utils.isPrimitive(Math));

assert(j79Utils.replaceAll('701 198 373 198 560, 198', '198', 'nothing') === '701 nothing 373 nothing 560, nothing');

assert(j79Utils.isUnescapedCharAt('test', 't', 0));
assert(!j79Utils.isUnescapedCharAt('\\test', 't', 1));

assert(j79Utils.removeLastPathNode('C:\\Program Files\\nodejs\\node.exe') === 'C:\\Program Files\\nodejs');
assert(j79Utils.removeLastPathNode('/home/srv/test.sh') === '/home/srv');

assert(j79Utils.fixPathSlashes('C:\\Program Files\\nodejs\\node.exe') === ['C:', 'Program Files', 'nodejs', 'node.exe'].join(path.sep));
assert(j79Utils.fixPathSlashes('/home/srv/test.sh') === ['', 'home', 'srv', 'test.sh'].join(path.sep));

assert(j79Utils.assemblePath('c:\\\\', '\\Program Files\\', 'nodejs') === 'c:\\Program Files\\nodejs');

assert(j79Utils.getObjectValues({1: 2, 3: 4})[1] === 4);
assert(j79Utils.escapeRegex('-  [  ]  /  {  }  (  )  *  +  ?  .  \\  ^  $  |') === '\\-  \\[  \\]  \\/  \\{  \\}  \\(  \\)  \\*  \\+  \\?  \\.  \\\\  \\^  \\$  \\|');
assert(j79Utils.makeOrRegexOfArray([1, 2, 'hello', 'world?']) === '1|2|hello|world\\?');

var esc1 = j79Utils.escapePrecedingSlashes('123456', 3);
assert(esc1.escaped === false);
assert(esc1.escapedStr === '123456');
assert(esc1.correctedPos === 3);

var esc2 = j79Utils.escapePrecedingSlashes('123\\456', 4);
assert(esc2.escaped === true);
assert(esc2.escapedStr === '123456');
assert(esc2.correctedPos === 3);

var esc3 = j79Utils.escapePrecedingSlashes('123\\\\456', 5);
assert(esc3.escaped === false);
assert(esc3.escapedStr === '123\\456');
assert(esc3.correctedPos === 4);

console.log('All tests are passed OK ;)');