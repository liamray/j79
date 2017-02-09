/**************************************************************************************
 j79-utils

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0

 Set of utility functions for JavaScript
 **************************************************************************************/

var ex = module.exports;
var path = require('path');

const TYPE_STRING = '[object String]';
const TYPE_NUMBER = '[object Number]';
const TYPE_BOOLEAN = '[object Boolean]';
const TYPE_ARRAY = '[object Array]';
const TYPE_OBJECT = '[object Object]';
const TYPE_MATH = '[object Math]';
var TYPE_FUNCTION = '[object Function]';

ex.getType = function (obj) {
	return Object.prototype.toString.call(obj);
};

ex.isString = function (obj) {
	return ex.getType(obj) === TYPE_STRING;
};

ex.isNumber = function (obj) {
	return ex.getType(obj) === TYPE_NUMBER;
};

ex.isBool = function (obj) {
	return ex.getType(obj) === TYPE_BOOLEAN;
};

ex.isArray = function (obj) {
	return ex.getType(obj) === TYPE_ARRAY;
};

ex.isObject = function (obj) {
	return ex.getType(obj) === TYPE_OBJECT || ex.getType(obj) === TYPE_MATH;
};

ex.isFunction = function (obj) {
	return ex.getType(obj) === TYPE_FUNCTION;
};

ex.isPrimitive = function (obj) {
	var type = ex.getType(obj);
	return type === TYPE_STRING || type === TYPE_NUMBER || type === TYPE_BOOLEAN;
};

ex.wrapWithArrayIfNeeded = function (obj) {
	return ex.isArray(obj) ? obj : [obj];
};

ex.wrapWithObjIfNeeded = function (obj, key) {
	if (ex.isObject(obj)) {
		return obj;
	}
	var result = {};
	result[key] = obj;
	return result;
};

ex.obj2ArrayIfNeeded = function (obj) {
	if (!ex.isObject(obj)) {
		return obj;
	}

	var result = [];
	for (var field in obj) {
		var value = obj[field];
		value = ex.obj2ArrayIfNeeded(value);
		value = ex.wrapWithArrayIfNeeded(value);
		result = result.concat(value);
	}
	return result;
};

ex.isValSet = function (val) {
	//                                            | NaN check ( NaN doesn't equal itself )
	return (val != null) && ( val != undefined ) && ( val === val );
};

ex.replaceAll = function (str, searchVal, replaceVal) {
	var result = str;
	while (result.indexOf(searchVal) >= 0) {
		result = result.replace(searchVal, replaceVal);
	}
	return result;
};

// is a [char] character is at [index] position in [str] string and it is not escaped by \\
ex.isUnescapedCharAt = function (str, char, index) {
	if (str[index] != char) {
		return false;
	}

	// todo : might be more complex
	if ((index > 0) && (str[index - 1] == '\\')) {
		return false;
	}

	return true;
};

// C:\Program Files\nodejs\node.exe => C:\Program Files\nodejs
ex.removeLastPathNode = function (param) {
	return param.replace(/[\\\/][^\\\/]*$/g, "");
};

ex.fixPathSlashes = function (param) {
	return param.replace(/[\\\/]/g, path.sep);
};

ex.assemblePath = function () {
	// converting arguments to array
	var args = Array.prototype.slice.call(arguments);

	// joining array's elements
	var params = args.join(path.sep);

	// removing double/triple/... slash characters
	return params.replace(/\/{2,}/g, '/').replace(/\\{2,}/g, '\\');
};

// resolves object's values
ex.getObjectValues = function (obj) {
	var result = [];
	for (var key in obj) {
		result.push(obj[key]);
	}

	return result;
};

// escapes regex special characters
ex.escapeRegex = function (str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

// makes OR regex of array elements
ex.makeOrRegexOfArray = function (arr) {
	var result = arr.join('\n');
	result = ex.escapeRegex(result);
	result = result.replace(/\n/g, '|');
	return result;
};