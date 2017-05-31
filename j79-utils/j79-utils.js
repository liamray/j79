/**************************************************************************************
 j79-utils

 Copyright (c) 2016-2017 Yevgeny Sergeyev
 License : Apache 2.0

 Set of utility functions for JavaScript
 **************************************************************************************/

const ex = module.exports;
const path = require('path');
const util = require('util');
const winston = require('winston');

const TYPE_STRING = '[object String]';
const TYPE_NUMBER = '[object Number]';
const TYPE_BOOLEAN = '[object Boolean]';
const TYPE_ARRAY = '[object Array]';
const TYPE_OBJECT = '[object Object]';
const TYPE_MATH = '[object Math]';
const TYPE_FUNCTION = '[object Function]';

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

ex.isPrimitiveType = function (type) {
	return type === TYPE_STRING || type === TYPE_NUMBER || type === TYPE_BOOLEAN;
};

ex.isPrimitive = function (obj) {
	var type = ex.getType(obj);
	return ex.isPrimitiveType(type);
};

ex.wrapWithArrayIfNeeded = function (obj) {
	return ex.isArray(obj) ? obj : [obj];
};

ex.unwrapFromArrayIfPossible = function (param) {
	if (ex.isArray(param) && param.length === 1) {
		return param[0];
	} else {
		return param;
	}
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

// returning the following in object :
// escaped - is str escaped ? true|false
// str - corrected str if slashes were found
// correctedPos - the new position of character which was at [pos] position
ex.escapePrecedingSlashes = function (str, pos) {
	var result = {};
	var slashesCnt = 0;

	for (var i = pos - 1; i >= 0; i--) {
		if (str.charAt(i) !== '\\') {
			break;
		}

		slashesCnt++;
	}

	// odd count of slashes tells that character at [pos] position is escaped
	result.escaped = ( slashesCnt % 2 === 1 );

	var halfSlashes = Math.floor((slashesCnt + 1 ) / 2);

	if (slashesCnt > 0) {
		// cutting 1/2 slashes
		result.escapedStr = str.substr(0, pos - halfSlashes) + str.substr(pos);
	} else {
		result.escapedStr = str;
	}

	result.correctedPos = pos - halfSlashes;

	return result;
};

ex.abortIfNodeVersionLowerThan = function (versionNumeric) {
	var processVersion = process.version;
	var currentVersion = processVersion.match(/^v(\d+)/);
	if (currentVersion === null || currentVersion.length !== 2) {
		throw util.format('Strange nodejs version. Expecting for version in the vXXX format, but got a [%s]', processVersion);
	}

	currentVersion = currentVersion[1];
	var currentVersionNr = parseInt(currentVersion);
	if (currentVersionNr < versionNumeric) {
		throw util.format('This application requires at least [v%s] version of nodejs, but current version is [%s]', versionNumeric, processVersion);
	}
};

ex.rawNowISODate = function () {
	return new Date().toISOString().replace('T', ' ').replace('Z', '');
};

ex.isLogLevel = function (level) {
	return winston.levels[winston.level] >= winston.levels[level];
};

ex.winston = winston;