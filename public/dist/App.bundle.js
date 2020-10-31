/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = extend;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {};

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  API_ORIGIN: 'https://api.mapbox.com',
  EVENT_PROGRESS_DOWNLOAD: 'downloadProgress',
  EVENT_PROGRESS_UPLOAD: 'uploadProgress',
  EVENT_ERROR: 'error',
  EVENT_RESPONSE: 'response',
  ERROR_HTTP: 'HttpError',
  ERROR_REQUEST_ABORTED: 'RequestAbortedError'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var browser = __webpack_require__(16);
var MapiClient = __webpack_require__(4);

function BrowserClient(options) {
  MapiClient.call(this, options);
}
BrowserClient.prototype = Object.create(MapiClient.prototype);
BrowserClient.prototype.constructor = BrowserClient;

BrowserClient.prototype.sendRequest = browser.browserSend;
BrowserClient.prototype.abortRequest = browser.browserAbort;

/**
 * Create a client for the browser.
 *
 * @param {Object} options
 * @param {string} options.accessToken
 * @param {string} [options.origin]
 * @returns {MapiClient}
 */
function createBrowserClient(options) {
  return new BrowserClient(options);
}

module.exports = createBrowserClient;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseToken = __webpack_require__(5);
var MapiRequest = __webpack_require__(18);
var constants = __webpack_require__(1);

/**
 * A low-level Mapbox API client. Use it to create service clients
 * that share the same configuration.
 *
 * Services and `MapiRequest`s use the underlying `MapiClient` to
 * determine how to create, send, and abort requests in a way
 * that is appropriate to the configuration and environment
 * (Node or the browser).
 *
 * @class MapiClient
 * @property {string} accessToken - The Mapbox access token assigned
 *   to this client.
 * @property {string} [origin] - The origin
 *   to use for API requests. Defaults to https://api.mapbox.com.
 */

function MapiClient(options) {
  if (!options || !options.accessToken) {
    throw new Error('Cannot create a client without an access token');
  }
  // Try parsing the access token to determine right away if it's valid.
  parseToken(options.accessToken);

  this.accessToken = options.accessToken;
  this.origin = options.origin || constants.API_ORIGIN;
}

MapiClient.prototype.createRequest = function createRequest(requestOptions) {
  return new MapiRequest(this, requestOptions);
};

module.exports = MapiClient;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64 = __webpack_require__(29);

var tokenCache = {};

function parseToken(token) {
  if (tokenCache[token]) {
    return tokenCache[token];
  }

  var parts = token.split('.');
  var usage = parts[0];
  var rawPayload = parts[1];
  if (!rawPayload) {
    throw new Error('Invalid token');
  }

  var parsedPayload = parsePaylod(rawPayload);

  var result = {
    usage: usage,
    user: parsedPayload.u
  };
  if (has(parsedPayload, 'a')) result.authorization = parsedPayload.a;
  if (has(parsedPayload, 'exp')) result.expires = parsedPayload.exp * 1000;
  if (has(parsedPayload, 'iat')) result.created = parsedPayload.iat * 1000;
  if (has(parsedPayload, 'scopes')) result.scopes = parsedPayload.scopes;
  if (has(parsedPayload, 'client')) result.client = parsedPayload.client;
  if (has(parsedPayload, 'll')) result.lastLogin = parsedPayload.ll;
  if (has(parsedPayload, 'iu')) result.impersonator = parsedPayload.iu;

  tokenCache[token] = result;
  return result;
}

function parsePaylod(rawPayload) {
  try {
    return JSON.parse(base64.decode(rawPayload));
  } catch (parseError) {
    throw new Error('Invalid token');
  }
}

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = parseToken;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var MapboxGeocoder = __webpack_require__(13);

function autocomplete(input, latInput, lngInput) {
	if (!input) return;

	var MAPBOX_KEY = 'pk.eyJ1IjoiamVuYXJvOTQiLCJhIjoiY2pzbnBpajh3MGV5MTQ0cnJ3dmJlczFqbiJ9.Aktxa1EqTzpy7yEaBDM1xQ';
	mapboxgl.accessToken = MAPBOX_KEY;

	var geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		mapboxgl: mapboxgl
	});

	geocoder.addTo('#search-address');
	geocoder.on('result', function (e) {
		input.value = e.result.place_name;
		lngInput.value = e.result.geometry.coordinates[0];
		latInput.value = e.result.geometry.coordinates[1];
	});

	document.querySelector('#search-address>div').style = 'width: 100%; max-width: unset; border: 1px solid #e6e6e6; box-shadow: unset; border-radius: 0; z-index: 1000; font-family: sans-serif; font-size: 100%; line-height: 1.15; margin: 0 0 10px 0;';
}

exports.default = autocomplete;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// based on https://gist.github.com/paulirish/12fb951a8b893a454b32

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem) {
    elem.on(name, fn);
  });
};

exports.$ = $;
exports.$$ = $$;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Validators are functions which assert certain type.
 * They can return a string which can then be used
 * to display a helpful error message.
 * They can also return a function for a custom error message.
 */

var isPlainObject = __webpack_require__(33);
var xtend = __webpack_require__(0);

var DEFAULT_ERROR_PATH = 'value';
var NEWLINE_INDENT = '\n  ';

var v = {};

/**
 * Runners
 *
 * Take root validators and run assertion
 */
v.assert = function (rootValidator, options) {
  options = options || {};
  return function (value) {
    var message = validate(rootValidator, value);
    // all good
    if (!message) {
      return;
    }

    var errorMessage = processMessage(message, options);

    if (options.apiName) {
      errorMessage = options.apiName + ': ' + errorMessage;
    }

    throw new Error(errorMessage);
  };
};

/**
 * Higher Order Validators
 *
 * validators which take other validators as input
 * and output a new validator
 */
v.shape = function shape(validatorObj) {
  var validators = objectEntries(validatorObj);
  return function shapeValidator(value) {
    var validationResult = validate(v.plainObject, value);

    if (validationResult) {
      return validationResult;
    }

    var key, validator;
    var errorMessages = [];

    for (var i = 0; i < validators.length; i++) {
      key = validators[i].key;
      validator = validators[i].value;
      validationResult = validate(validator, value[key]);

      if (validationResult) {
        // return [key].concat(validationResult);
        errorMessages.push([key].concat(validationResult));
      }
    }

    if (errorMessages.length < 2) {
      return errorMessages[0];
    }

    // enumerate all the error messages
    return function (options) {
      errorMessages = errorMessages.map(function (message) {
        var key = message[0];
        var renderedMessage = processMessage(message, options).split('\n').join(NEWLINE_INDENT); // indents any inner nesting
        return '- ' + key + ': ' + renderedMessage;
      });

      var objectId = options.path.join('.');
      var ofPhrase = objectId === DEFAULT_ERROR_PATH ? '' : ' of ' + objectId;

      return 'The following properties' + ofPhrase + ' have invalid values:' + NEWLINE_INDENT + errorMessages.join(NEWLINE_INDENT);
    };
  };
};

v.strictShape = function strictShape(validatorObj) {
  var shapeValidator = v.shape(validatorObj);
  return function strictShapeValidator(value) {
    var shapeResult = shapeValidator(value);
    if (shapeResult) {
      return shapeResult;
    }

    var invalidKeys = Object.keys(value).reduce(function (memo, valueKey) {
      if (validatorObj[valueKey] === undefined) {
        memo.push(valueKey);
      }
      return memo;
    }, []);

    if (invalidKeys.length !== 0) {
      return function () {
        return 'The following keys are invalid: ' + invalidKeys.join(', ');
      };
    }
  };
};

v.arrayOf = function arrayOf(validator) {
  return createArrayValidator(validator);
};

v.tuple = function tuple() {
  var validators = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
  return createArrayValidator(validators);
};

// Currently array validation fails when the first invalid item is found.
function createArrayValidator(validators) {
  var validatingTuple = Array.isArray(validators);
  var getValidator = function getValidator(index) {
    if (validatingTuple) {
      return validators[index];
    }
    return validators;
  };

  return function arrayValidator(value) {
    var validationResult = validate(v.plainArray, value);
    if (validationResult) {
      return validationResult;
    }

    if (validatingTuple && value.length !== validators.length) {
      return 'an array with ' + validators.length + ' items';
    }

    for (var i = 0; i < value.length; i++) {
      validationResult = validate(getValidator(i), value[i]);
      if (validationResult) {
        return [i].concat(validationResult);
      }
    }
  };
}

v.required = function required(validator) {
  function requiredValidator(value) {
    if (value == null) {
      return function (options) {
        return formatErrorMessage(options, isArrayCulprit(options.path) ? 'cannot be undefined/null.' : 'is required.');
      };
    }
    return validator.apply(this, arguments);
  }
  requiredValidator.__required = true;

  return requiredValidator;
};

v.oneOfType = function oneOfType() {
  var validators = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
  return function oneOfTypeValidator(value) {
    var messages = validators.map(function (validator) {
      return validate(validator, value);
    }).filter(Boolean);

    // If we don't have as many messages as no. of validators,
    // then at least one validator was ok with the value.
    if (messages.length !== validators.length) {
      return;
    }

    // check primitive type
    if (messages.every(function (message) {
      return message.length === 1 && typeof message[0] === 'string';
    })) {
      return orList(messages.map(function (m) {
        return m[0];
      }));
    }

    // Complex oneOfTypes like
    // `v.oneOftypes(v.shape({name: v.string})`, `v.shape({name: v.number}))`
    // are complex ¯\_(ツ)_/¯. For the current scope only returning the longest message.
    return messages.reduce(function (max, arr) {
      return arr.length > max.length ? arr : max;
    });
  };
};

/**
 * Meta Validators
 * which take options as argument (not validators)
 * and return a new primitive validator
 */
v.equal = function equal(compareWith) {
  return function equalValidator(value) {
    if (value !== compareWith) {
      return JSON.stringify(compareWith);
    }
  };
};

v.oneOf = function oneOf() {
  var options = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
  var validators = options.map(function (value) {
    return v.equal(value);
  });

  return v.oneOfType.apply(this, validators);
};

v.range = function range(compareWith) {
  var min = compareWith[0];
  var max = compareWith[1];
  return function rangeValidator(value) {
    var validationResult = validate(v.number, value);

    if (validationResult || value < min || value > max) {
      return 'number between ' + min + ' & ' + max + ' (inclusive)';
    }
  };
};

/**
 * Primitive validators
 *
 * simple validators which return a string or undefined
 */
v.any = function any() {
  return;
};

v.boolean = function boolean(value) {
  if (typeof value !== 'boolean') {
    return 'boolean';
  }
};

v.number = function number(value) {
  if (typeof value !== 'number') {
    return 'number';
  }
};

v.plainArray = function plainArray(value) {
  if (!Array.isArray(value)) {
    return 'array';
  }
};

v.plainObject = function plainObject(value) {
  if (!isPlainObject(value)) {
    return 'object';
  }
};

v.string = function string(value) {
  if (typeof value !== 'string') {
    return 'string';
  }
};

v.func = function func(value) {
  if (typeof value !== 'function') {
    return 'function';
  }
};

function validate(validator, value) {
  // assertions are optional by default unless wrapped in v.require
  if (value == null && !validator.hasOwnProperty('__required')) {
    return;
  }

  var result = validator(value);

  if (result) {
    return Array.isArray(result) ? result : [result];
  }
}

function processMessage(message, options) {
  // message array follows the convention
  // [...path, result]
  // path is an array of object keys / array indices
  // result is output of the validator
  var len = message.length;

  var result = message[len - 1];
  var path = message.slice(0, len - 1);

  if (path.length === 0) {
    path = [DEFAULT_ERROR_PATH];
  }
  options = xtend(options, { path: path });

  return typeof result === 'function' ? result(options) // allows customization of result
  : formatErrorMessage(options, prettifyResult(result));
}

function orList(list) {
  if (list.length < 2) {
    return list[0];
  }
  if (list.length === 2) {
    return list.join(' or ');
  }
  return list.slice(0, -1).join(', ') + ', or ' + list.slice(-1);
}

function prettifyResult(result) {
  return 'must be ' + addArticle(result) + '.';
}

function addArticle(nounPhrase) {
  if (/^an? /.test(nounPhrase)) {
    return nounPhrase;
  }
  if (/^[aeiou]/i.test(nounPhrase)) {
    return 'an ' + nounPhrase;
  }
  if (/^[a-z]/i.test(nounPhrase)) {
    return 'a ' + nounPhrase;
  }
  return nounPhrase;
}

function formatErrorMessage(options, prettyResult) {
  var arrayCulprit = isArrayCulprit(options.path);
  var output = options.path.join('.') + ' ' + prettyResult;
  var prepend = arrayCulprit ? 'Item at position ' : '';

  return prepend + output;
}

function isArrayCulprit(path) {
  return typeof path[path.length - 1] == 'number' || typeof path[0] == 'number';
}

function objectEntries(obj) {
  return Object.keys(obj || {}).map(function (key) {
    return { key: key, value: obj[key] };
  });
}

v.validate = validate;
v.processMessage = processMessage;

module.exports = v;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nanoid = __webpack_require__(35);

/**
 * Construct a new mapbox event client to send interaction events to the mapbox event service
 * @param {Object} options options with which to create the service
 * @param {String} options.accessToken the mapbox access token to make requests
 * @param {Number} [options.flushInterval=1000] the number of ms after which to flush the event queue
 * @param {Number} [options.maxQueueSize=100] the number of events to queue before flushing
 * @private
 */
function MapboxEventManager(options) {
  this.origin = options.origin || 'https://api.mapbox.com';
  this.endpoint = 'events/v2';
  this.access_token = options.accessToken;
  this.version = '0.2.0';
  this.sessionID = this.generateSessionID();
  this.userAgent = this.getUserAgent();

  this.options = options;
  this.send = this.send.bind(this);

  // parse global options to be sent with each request
  this.countries = options.countries ? options.countries.split(",") : null;
  this.types = options.types ? options.types.split(",") : null;
  this.bbox = options.bbox ? options.bbox : null;
  this.language = options.language ? options.language.split(",") : null;
  this.limit = options.limit ? +options.limit : null;
  this.locale = navigator.language || null;
  this.enableEventLogging = this.shouldEnableLogging(options);
  this.eventQueue = new Array();
  this.flushInterval = options.flushInterval || 1000;
  this.maxQueueSize = options.maxQueueSize || 100;
  this.timer = this.flushInterval ? setTimeout(this.flush.bind(this), this.flushInterval) : null;
  // keep some state to deduplicate requests if necessary
  this.lastSentInput = "";
  this.lastSentIndex = 0;
}

MapboxEventManager.prototype = {
  /**
     * Send a search.select event to the mapbox events service
     * This event marks the array index of the item selected by the user out of the array of possible options
     * @private
     * @param {Object} selected the geojson feature selected by the user
     * @param {Object} geocoder a mapbox-gl-geocoder instance
     * @returns {Promise}
     */
  select: function select(selected, geocoder) {
    var resultIndex = this.getSelectedIndex(selected, geocoder);
    var payload = this.getEventPayload('search.select', geocoder);
    payload.resultIndex = resultIndex;
    payload.resultPlaceName = selected.place_name;
    payload.resultId = selected.id;
    if (resultIndex === this.lastSentIndex && payload.queryString === this.lastSentInput || resultIndex == -1) {
      // don't log duplicate events if the user re-selected the same feature on the same search
      return;
    }
    this.lastSentIndex = resultIndex;
    this.lastSentInput = payload.queryString;
    if (!payload.queryString) return; // will be rejected
    return this.push(payload);
  },

  /**
     * Send a search-start event to the mapbox events service
     * This turnstile event marks when a user starts a new search
     * @private
     * @param {Object} geocoder a mapbox-gl-geocoder instance
     * @returns {Promise}
     */
  start: function start(geocoder) {
    var payload = this.getEventPayload('search.start', geocoder);
    if (!payload.queryString) return; // will be rejected
    return this.push(payload);
  },

  /**
   * Send a search-keyevent event to the mapbox events service
   * This event records each keypress in sequence
   * @private
   * @param {Object} keyEvent the keydown event to log
   * @param {Object} geocoder a mapbox-gl-geocoder instance
   * 
   */
  keyevent: function keyevent(keyEvent, geocoder) {

    //pass invalid event
    if (!keyEvent.key) return;
    // don't send events for keys that don't change the input
    // TAB, ESC, LEFT, RIGHT, ENTER, UP, DOWN
    if (keyEvent.metaKey || [9, 27, 37, 39, 13, 38, 40].indexOf(keyEvent.keyCode) !== -1) return;
    var payload = this.getEventPayload('search.keystroke', geocoder);
    payload.lastAction = keyEvent.key;
    if (!payload.queryString) return; // will be rejected
    return this.push(payload);
  },

  /**
   * Send an event to the events service
   *
   * The event is skipped if the instance is not enabled to send logging events
   *
   * @private
   * @param {Object} payload the http POST body of the event
   * @param {Function} [callback] a callback function to invoke when the send has completed
   * @returns {Promise}
   */
  send: function send(payload, callback) {
    if (!this.enableEventLogging) {
      if (callback) return callback();
      return;
    }
    var options = this.getRequestOptions(payload);
    this.request(options, function (err) {
      if (err) return this.handleError(err, callback);
      if (callback) {
        return callback();
      }
    }.bind(this));
  },
  /**
   * Get http request options
   * @private
   * @param {*} payload
   */
  getRequestOptions: function getRequestOptions(payload) {
    if (!Array.isArray(payload)) payload = [payload];
    var options = {
      // events must be sent with POST
      method: "POST",
      host: this.origin,
      path: this.endpoint + "?access_token=" + this.access_token,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) //events are arrays
    };
    return options;
  },

  /**
   * Get the event payload to send to the events service
   * Most payload properties are shared across all events
   * @private
   * @param {String} event the name of the event to send to the events service. Valid options are 'search.start', 'search.select', 'search.feedback'.
   * @param {Object} geocoder a mapbox-gl-geocoder instance
   * @returns {Object} an event payload
   */
  getEventPayload: function getEventPayload(event, geocoder) {
    var proximity;
    if (!geocoder.options.proximity) proximity = null;else proximity = [geocoder.options.proximity.longitude, geocoder.options.proximity.latitude];

    var zoom = geocoder._map ? geocoder._map.getZoom() : undefined;
    var payload = {
      event: event,
      created: +new Date(),
      sessionIdentifier: this.sessionID,
      country: this.countries,
      userAgent: this.userAgent,
      language: this.language,
      bbox: this.bbox,
      types: this.types,
      endpoint: 'mapbox.places',
      // fuzzyMatch: search.fuzzy, //todo  --> add to plugin
      proximity: proximity,
      limit: geocoder.options.limit,
      // routing: search.routing, //todo --> add to plugin
      mapZoom: zoom,
      keyboardLocale: this.locale

      // get the text in the search bar
    };if (event === "search.select") {
      payload.queryString = geocoder.inputString;
    } else if (event != "search.select" && geocoder._inputEl) {
      payload.queryString = geocoder._inputEl.value;
    } else {
      payload.queryString = geocoder.inputString;
    }
    return payload;
  },

  /**
   * Wraps the request function for easier testing
   * Make an http request and invoke a callback
   * @private
   * @param {Object} opts options describing the http request to be made
   * @param {Function} callback the callback to invoke when the http request is completed
   */
  request: function request(opts, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 204) {
          //success
          return callback(null);
        } else {
          return callback(this.statusText);
        }
      }
    };

    xhttp.open(opts.method, opts.host + '/' + opts.path, true);
    for (var header in opts.headers) {
      var headerValue = opts.headers[header];
      xhttp.setRequestHeader(header, headerValue);
    }
    xhttp.send(opts.body);
  },

  /**
   * Handle an error that occurred while making a request
   * @param {Object} err an error instance to log
   * @private
   */
  handleError: function handleError(err, callback) {
    if (callback) return callback(err);
  },

  /**
   * Generate a session ID to be returned with all of the searches made by this geocoder instance
   * ID is random and cannot be tracked across sessions
   * @private
   */
  generateSessionID: function generateSessionID() {
    return nanoid();
  },

  /**
   * Get a user agent string to send with the request to the events service
   * @private
   */
  getUserAgent: function getUserAgent() {
    return 'mapbox-gl-geocoder.' + this.version + "." + navigator.userAgent;
  },

  /**
     * Get the 0-based numeric index of the item that the user selected out of the list of options
     * @private
     * @param {Object} selected the geojson feature selected by the user
     * @param {Object} geocoder a Mapbox-GL-Geocoder instance
     * @returns {Number} the index of the selected result
     */
  getSelectedIndex: function getSelectedIndex(selected, geocoder) {
    if (!geocoder._typeahead) return;
    var results = geocoder._typeahead.data;
    var selectedID = selected.id;
    var resultIDs = results.map(function (feature) {
      return feature.id;
    });
    var selectedIdx = resultIDs.indexOf(selectedID);
    return selectedIdx;
  },

  /**
     * Check whether events should be logged
     * Clients using a localGeocoder or an origin other than mapbox should not have events logged
     * @private
     */
  shouldEnableLogging: function shouldEnableLogging(options) {
    if (options.enableEventLogging === false) return false;
    if (options.origin && options.origin.indexOf('api.mapbox.com') == -1) return false;
    // hard to make sense of events when a local instance is suplementing results from origin
    if (options.localGeocoder) return false;
    // hard to make sense of events when a custom filter is in use
    if (options.filter) return false;
    return true;
  },

  /**
   * Flush out the event queue by sending events to the events service
   * @private
   */
  flush: function flush() {
    if (this.eventQueue.length > 0) {
      this.send(this.eventQueue);
      this.eventQueue = new Array();
    }
    // //reset the timer
    if (this.timer) clearTimeout(this.timer);
    if (this.flushInterval) this.timer = setTimeout(this.flush.bind(this), this.flushInterval);
  },

  /**
   * Push event into the pending queue
   * @param {Object} evt the event to send to the events service
   * @param {Boolean} forceFlush indicates that the event queue should be flushed after adding this event regardless of size of the queue
   * @private
   */
  push: function push(evt, forceFlush) {
    this.eventQueue.push(evt);
    if (this.eventQueue.length >= this.maxQueueSize || forceFlush) {
      this.flush();
    }
  },

  /**
   * Flush any remaining events from the queue before it is removed
   * @private
   */
  remove: function remove() {
    this.flush();
  }
};

module.exports = MapboxEventManager;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  'fr': {
    'name': 'France',
    'bbox': [[-4.59235, 41.380007], [9.560016, 51.148506]]
  },
  'us': {
    'name': 'United States',
    'bbox': [[-171.791111, 18.91619], [-66.96466, 71.357764]]
  },
  'ru': {
    'name': 'Russia',
    'bbox': [[19.66064, 41.151416], [190.10042, 81.2504]]
  },
  'ca': {
    'name': 'Canada',
    'bbox': [[-140.99778, 41.675105], [-52.648099, 83.23324]]
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Typeahead = __webpack_require__(38);
var debounce = __webpack_require__(34);
var extend = __webpack_require__(0);
var EventEmitter = __webpack_require__(31).EventEmitter;
var exceptions = __webpack_require__(12);
var MapboxClient = __webpack_require__(15);
var mbxGeocoder = __webpack_require__(23);
var MapboxEventManager = __webpack_require__(11);
var localization = __webpack_require__(14);
var subtag = __webpack_require__(37);

/**
 * A geocoder component using the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/#geocoding)
 * @class MapboxGeocoder
 * @param {Object} options
 * @param {String} options.accessToken Required.
 * @param {String} [options.origin=https://api.mapbox.com] Use to set a custom API origin.
 * @param {Object} [options.mapboxgl] A [mapbox-gl](https://github.com/mapbox/mapbox-gl-js) instance to use when creating [Markers](https://docs.mapbox.com/mapbox-gl-js/api/#marker). Required if `options.marker` is `true`.
 * @param {Number} [options.zoom=16] On geocoded result what zoom level should the map animate to when a `bbox` isn't found in the response. If a `bbox` is found the map will fit to the `bbox`.
 * @param {Boolean|Object} [options.flyTo=true] If `false`, animating the map to a selected result is disabled. If `true`, animating the map will use the default animation parameters. If an object, it will be passed as `options` to the map [`flyTo`](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto) or [`fitBounds`](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds) method providing control over the animation of the transition.
 * @param {String} [options.placeholder=Search] Override the default placeholder attribute value.
 * @param {Object} [options.proximity] a proximity argument: this is
 * a geographical point given as an object with `latitude` and `longitude`
 * properties. Search results closer to this point will be given
 * higher priority.
 * @param {Boolean} [options.trackProximity=true] If `true`, the geocoder proximity will automatically update based on the map view.
 * @param {Boolean} [options.collapsed=false] If `true`, the geocoder control will collapse until hovered or in focus.
 * @param {Boolean} [options.clearAndBlurOnEsc=false] If `true`, the geocoder control will clear it's contents and blur when user presses the escape key.
 * @param {Boolean} [options.clearOnBlur=false] If `true`, the geocoder control will clear its value when the input blurs.
 * @param {Array} [options.bbox] a bounding box argument: this is
 * a bounding box given as an array in the format `[minX, minY, maxX, maxY]`.
 * Search results will be limited to the bounding box.
 * @param {string} [options.countries] a comma separated list of country codes to
 * limit results to specified country or countries.
 * @param {string} [options.types] a comma seperated list of types that filter
 * results to match those specified. See https://docs.mapbox.com/api/search/#data-types
 * for available types.
 * If reverseGeocode is enabled, you should specify one type. If you configure more than one type, the first type will be used.
 * @param {Number} [options.minLength=2] Minimum number of characters to enter before results are shown.
 * @param {Number} [options.limit=5] Maximum number of results to show.
 * @param {string} [options.language] Specify the language to use for response text and query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas. Defaults to the browser's language settings.
 * @param {Function} [options.filter] A function which accepts a Feature in the [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) format to filter out results from the Geocoding API response before they are included in the suggestions list. Return `true` to keep the item, `false` otherwise.
 * @param {Function} [options.localGeocoder] A function accepting the query string which performs local geocoding to supplement results from the Mapbox Geocoding API. Expected to return an Array of GeoJSON Features in the [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) format.
 * @param {distance|score} [options.reverseMode=distance] - Set the factors that are used to sort nearby results.
 * @param {boolean} [options.reverseGeocode=false] If `true`, enable reverse geocoding mode. In reverse geocoding, search input is expected to be coordinates in the form `lat, lon`, with suggestions being the reverse geocodes.
 * @param {Boolean} [options.enableEventLogging=true] Allow Mapbox to collect anonymous usage statistics from the plugin.
 * @param {Boolean|Object} [options.marker=true]  If `true`, a [Marker](https://docs.mapbox.com/mapbox-gl-js/api/#marker) will be added to the map at the location of the user-selected result using a default set of Marker options.  If the value is an object, the marker will be constructed using these options. If `false`, no marker will be added to the map. Requires that `options.mapboxgl` also be set.
 * @param {Function} [options.render] A function that specifies how the results should be rendered in the dropdown menu. This function should accepts a single [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) object as input and return a string. Any HTML in the returned string will be rendered.
 * @param {Function} [options.getItemValue] A function that specifies how the selected result should be rendered in the search bar. This function should accept a single [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) object as input and return a string. HTML tags in the output string will not be rendered. Defaults to `(item) => item.place_name`.
 * @param {String} [options.mode=mapbox.places] A string specifying the geocoding [endpoint](https://docs.mapbox.com/api/search/#endpoints) to query. Options are `mapbox.places` and `mapbox.places-permanent`. The `mapbox.places-permanent` mode requires an enterprise license for permanent geocodes.
 * @param {Boolean} [options.localGeocoderOnly=false] If `true`, indicates that the `localGeocoder` results should be the only ones returned to the user. If `false`, indicates that the `localGeocoder` results should be combined with those from the Mapbox API with the `localGeocoder` results ranked higher.
 * @example
 * var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken });
 * map.addControl(geocoder);
 * @return {MapboxGeocoder} `this`
 *
 */

function MapboxGeocoder(options) {
  this._eventEmitter = new EventEmitter();
  this.options = extend({}, this.options, options);
  this.inputString = '';
  this.fresh = true;
  this.lastSelected = null;
}

MapboxGeocoder.prototype = {
  options: {
    zoom: 16,
    flyTo: true,
    trackProximity: true,
    minLength: 2,
    reverseGeocode: false,
    limit: 5,
    origin: 'https://api.mapbox.com',
    enableEventLogging: true,
    marker: true,
    mapboxgl: null,
    collapsed: false,
    clearAndBlurOnEsc: false,
    clearOnBlur: false,
    getItemValue: function getItemValue(item) {
      return item.place_name;
    },
    render: function render(item) {
      var placeName = item.place_name.split(',');
      return '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">' + placeName[0] + '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address">' + placeName.splice(1, placeName.length).join(',') + '</div></div>';
    }
  },

  /**
   * Add the geocoder to a container. The container can be either a `mapboxgl.Map`, an `HTMLElement` or a CSS selector string.
   *
   * If the container is a [`mapboxgl.Map`](https://docs.mapbox.com/mapbox-gl-js/api/map/), this function will behave identically to [`Map.addControl(geocoder)`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addcontrol).
   * If the container is an instance of [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), then the geocoder will be appended as a child of that [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).
   * If the container is a [CSS selector string](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors), the geocoder will be appended to the element returned from the query.
   *
   * This function will throw an error if the container is none of the above.
   * It will also throw an error if the referenced HTML element cannot be found in the `document.body`.
   *
   * For example, if the HTML body contains the element `<div id='geocoder-container'></div>`, the following script will append the geocoder to `#geocoder-container`:
   *
   * ```javascript
   * var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken });
   * geocoder.addTo('#geocoder-container');
   * ```
   * @param {String|HTMLElement|mapboxgl.Map} container A reference to the container to which to add the geocoder
   */
  addTo: function addTo(container) {

    function addToExistingContainer(geocoder, container) {
      if (!document.body.contains(container)) {
        throw new Error("Element provided to #addTo() exists, but is not in the DOM");
      }
      var el = geocoder.onAdd(); //returns the input elements, which are then added to the requested html container
      container.appendChild(el);
    }

    // if the container is a map, add the control like normal
    if (container._controlContainer) {
      //  it's a mapbox-gl map, add like normal
      container.addControl(this);
    }
    // if the container is an HTMLElement, then set the parent to be that element
    else if (container instanceof HTMLElement) {
        addToExistingContainer(this, container);
      }
      // if the container is a string, treat it as a CSS query
      else if (typeof container == 'string') {
          var parent = document.querySelectorAll(container);
          if (parent.length === 0) {
            throw new Error("Element ", container, "not found.");
          }

          if (parent.length > 1) {
            throw new Error("Geocoder can only be added to a single html element");
          }

          addToExistingContainer(this, parent[0]);
        } else {
          throw new Error("Error: addTo must be a mapbox-gl-js map, an html element, or a CSS selector query for a single html element");
        }
  },

  onAdd: function onAdd(map) {
    if (map && typeof map != 'string') {
      this._map = map;
    }

    this.setLanguage();

    if (!this.options.localGeocoderOnly) {
      this.geocoderService = mbxGeocoder(MapboxClient({
        accessToken: this.options.accessToken,
        origin: this.options.origin
      }));
    }

    if (this.options.localGeocoderOnly && !this.options.localGeocoder) {
      throw new Error("A localGeocoder function must be specified to use localGeocoderOnly mode");
    }

    this.eventManager = new MapboxEventManager(this.options);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._showButton = this._showButton.bind(this);
    this._hideButton = this._hideButton.bind(this);
    this._onQueryResult = this._onQueryResult.bind(this);
    this.clear = this.clear.bind(this);
    this._updateProximity = this._updateProximity.bind(this);
    this._collapse = this._collapse.bind(this);
    this._unCollapse = this._unCollapse.bind(this);
    this._clear = this._clear.bind(this);
    this._clearOnBlur = this._clearOnBlur.bind(this);

    var el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-geocoder mapboxgl-ctrl';

    var searchIcon = this.createIcon('search', '<path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"/>');

    this._inputEl = document.createElement('input');
    this._inputEl.type = 'text';
    this._inputEl.className = 'mapboxgl-ctrl-geocoder--input';

    this.setPlaceholder();

    if (this.options.collapsed) {
      this._collapse();
      this.container.addEventListener('mouseenter', this._unCollapse);
      this.container.addEventListener('mouseleave', this._collapse);
      this._inputEl.addEventListener('focus', this._unCollapse);
    }

    if (this.options.collapsed || this.options.clearOnBlur) {
      this._inputEl.addEventListener('blur', this._onBlur);
    }

    this._inputEl.addEventListener('keydown', debounce(this._onKeyDown, 200));
    this._inputEl.addEventListener('paste', this._onPaste);
    this._inputEl.addEventListener('change', this._onChange);
    this.container.addEventListener('mouseenter', this._showButton);
    this.container.addEventListener('mouseleave', this._hideButton);
    this._inputEl.addEventListener('keyup', function (e) {
      this.eventManager.keyevent(e, this);
    }.bind(this));

    var actions = document.createElement('div');
    actions.classList.add('mapboxgl-ctrl-geocoder--pin-right');

    this._clearEl = document.createElement('button');
    this._clearEl.setAttribute('aria-label', 'Clear');
    this._clearEl.addEventListener('click', this.clear);
    this._clearEl.className = 'mapboxgl-ctrl-geocoder--button';

    var buttonIcon = this.createIcon('close', '<path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"/>');
    this._clearEl.appendChild(buttonIcon);

    this._loadingEl = this.createIcon('loading', '<path fill="#333" d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"/><path opacity=".1" d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"/>');

    actions.appendChild(this._clearEl);
    actions.appendChild(this._loadingEl);

    el.appendChild(searchIcon);
    el.appendChild(this._inputEl);
    el.appendChild(actions);

    this._typeahead = new Typeahead(this._inputEl, [], {
      filter: false,
      minLength: this.options.minLength,
      limit: this.options.limit
    });

    this.setRenderFunction(this.options.render);
    this._typeahead.getItemValue = this.options.getItemValue;

    this.mapMarker = null;
    this._handleMarker = this._handleMarker.bind(this);
    if (this._map) {
      if (this.options.trackProximity) {
        this._updateProximity();
        this._map.on('moveend', this._updateProximity);
      }
      this._mapboxgl = this.options.mapboxgl;
      if (!this._mapboxgl && this.options.marker) {
        // eslint-disable-next-line no-console
        console.error("No mapboxgl detected in options. Map markers are disabled. Please set options.mapboxgl.");
        this.options.marker = false;
      }
    }
    return el;
  },

  createIcon: function createIcon(name, path) {
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-' + name);
    icon.setAttribute('viewBox', '0 0 18 18');
    icon.setAttribute('xml:space', 'preserve');
    icon.setAttribute('width', 18);
    icon.setAttribute('height', 18);
    // IE does not have innerHTML for SVG nodes
    if (!('innerHTML' in icon)) {
      var SVGNodeContainer = document.createElement('div');
      SVGNodeContainer.innerHTML = '<svg>' + path.valueOf().toString() + '</svg>';
      var SVGNode = SVGNodeContainer.firstChild,
          SVGPath = SVGNode.firstChild;
      icon.appendChild(SVGPath);
    } else {
      icon.innerHTML = path;
    }
    return icon;
  },

  onRemove: function onRemove() {
    this.container.parentNode.removeChild(this.container);

    if (this.options.trackProximity && this._map) {
      this._map.off('moveend', this._updateProximity);
    }

    this._removeMarker();

    this._map = null;

    return this;
  },

  _onPaste: function _onPaste(e) {
    var value = (e.clipboardData || window.clipboardData).getData('text');
    if (value.length >= this.options.minLength) {
      this._geocode(value);
    }
  },

  _onKeyDown: function _onKeyDown(e) {
    var ESC_KEY_CODE = 27,
        TAB_KEY_CODE = 9;

    if (e.keyCode === ESC_KEY_CODE && this.options.clearAndBlurOnEsc) {
      this._clear(e);
      return this._inputEl.blur();
    }

    // if target has shadowRoot, then get the actual active element inside the shadowRoot
    var target = e.target && e.target.shadowRoot ? e.target.shadowRoot.activeElement : e.target;
    var value = target ? target.value : '';

    if (!value) {
      this.fresh = true;
      // the user has removed all the text
      if (e.keyCode !== TAB_KEY_CODE) this.clear(e);
      return this._clearEl.style.display = 'none';
    }

    // TAB, ESC, LEFT, RIGHT, ENTER, UP, DOWN
    if (e.metaKey || [TAB_KEY_CODE, ESC_KEY_CODE, 37, 39, 13, 38, 40].indexOf(e.keyCode) !== -1) return;

    if (target.value.length >= this.options.minLength) {
      this._geocode(target.value);
    }
  },

  _showButton: function _showButton() {
    if (this._typeahead.selected) this._clearEl.style.display = 'block';
  },

  _hideButton: function _hideButton() {
    if (this._typeahead.selected) this._clearEl.style.display = 'none';
  },

  _onBlur: function _onBlur(e) {
    if (this.options.clearOnBlur) {
      this._clearOnBlur(e);
    }
    if (this.options.collapsed) {
      this._collapse();
    }
  },
  _onChange: function _onChange() {
    var selected = this._typeahead.selected;
    if (selected && JSON.stringify(selected) !== this.lastSelected) {
      this._clearEl.style.display = 'none';
      if (this.options.flyTo) {
        var flyOptions;
        if (selected.properties && exceptions[selected.properties.short_code]) {
          // Certain geocoder search results return (and therefore zoom to fit)
          // an unexpectedly large bounding box: for example, both Russia and the
          // USA span both sides of -180/180, or France includes the island of
          // Reunion in the Indian Ocean. An incomplete list of these exceptions
          // at ./exceptions.json provides "reasonable" bounding boxes as a
          // short-term solution; this may be amended as necessary.
          flyOptions = extend({}, this.options.flyTo);
          if (this._map) {
            this._map.fitBounds(exceptions[selected.properties.short_code].bbox, flyOptions);
          }
        } else if (selected.bbox) {
          var bbox = selected.bbox;
          flyOptions = extend({}, this.options.flyTo);
          if (this._map) {
            this._map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], flyOptions);
          }
        } else {
          var defaultFlyOptions = {
            zoom: this.options.zoom
          };
          flyOptions = extend({}, defaultFlyOptions, this.options.flyTo);
          //  ensure that center is not overriden by custom options
          flyOptions.center = selected.center;
          if (this._map) {
            this._map.flyTo(flyOptions);
          }
        }
      }
      if (this.options.marker && this._mapboxgl) {
        this._handleMarker(selected);
      }

      // After selecting a feature, re-focus the textarea and set
      // cursor at start.
      this._inputEl.focus();
      this._inputEl.scrollLeft = 0;
      this._inputEl.setSelectionRange(0, 0);
      this.lastSelected = JSON.stringify(selected);
      this._eventEmitter.emit('result', { result: selected });
      this.eventManager.select(selected, this);
    }
  },

  _geocode: function _geocode(searchInput) {
    this._loadingEl.style.display = 'block';
    this._eventEmitter.emit('loading', { query: searchInput });
    this.inputString = searchInput;
    // Possible config proprerties to pass to client
    var keys = ['bbox', 'limit', 'proximity', 'countries', 'types', 'language', 'reverseMode', 'mode'];
    var self = this;
    // Create config object
    var config = keys.reduce(function (config, key) {
      if (self.options[key]) {
        // countries, types, and language need to be passed in as arrays to client
        // https://github.com/mapbox/mapbox-sdk-js/blob/master/services/geocoding.js#L38-L47
        ['countries', 'types', 'language'].indexOf(key) > -1 ? config[key] = self.options[key].split(/[\s,]+/) : config[key] = self.options[key];

        if (key === 'proximity' && self.options[key] && typeof self.options[key].longitude === 'number' && typeof self.options[key].latitude === 'number') {
          config[key] = [self.options[key].longitude, self.options[key].latitude];
        }
      }
      return config;
    }, {});

    var request;
    if (this.options.localGeocoderOnly) {
      request = Promise.resolve();
    }
    // check if searchInput resembles coordinates, and if it does,
    // make the request a reverseGeocode
    else if (this.options.reverseGeocode && /(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)[ ]*$/.test(searchInput)) {
        // parse coordinates
        var coords = searchInput.split(/[\s(,)?]+/).map(function (c) {
          return parseFloat(c, 10);
        }).reverse();

        // client only accepts one type for reverseGeocode, so
        // use first config type if one, if not default to poi
        config.types ? [config.types[0]] : ["poi"];
        config = extend(config, { query: coords, limit: 1 });

        // drop proximity which may have been set by trackProximity since it's not supported by the reverseGeocoder
        if ('proximity' in config) {
          delete config.proximity;
        }

        request = this.geocoderService.reverseGeocode(config).send();
      } else {
        config = extend(config, { query: searchInput });
        request = this.geocoderService.forwardGeocode(config).send();
      }

    var localGeocoderRes = [];
    if (this.options.localGeocoder) {
      localGeocoderRes = this.options.localGeocoder(searchInput);
      if (!localGeocoderRes) {
        localGeocoderRes = [];
      }
    }

    request.then(function (response) {
      this._loadingEl.style.display = 'none';

      var res = {};

      if (!response) {
        res = {
          type: 'FeatureCollection',
          features: []
        };
      } else if (response.statusCode == '200') {
        res = response.body;
        res.request = response.request;
        res.headers = response.headers;
      }

      res.config = config;
      if (this.fresh) {
        this.eventManager.start(this);
        this.fresh = false;
      }
      // supplement Mapbox Geocoding API results with locally populated results
      res.features = res.features ? localGeocoderRes.concat(res.features) : localGeocoderRes;

      // apply results filter if provided
      if (this.options.filter && res.features.length) {
        res.features = res.features.filter(this.options.filter);
      }

      if (res.features.length) {
        this._clearEl.style.display = 'block';
        this._eventEmitter.emit('results', res);
        this._typeahead.update(res.features);
      } else {
        this._clearEl.style.display = 'none';
        this._typeahead.selected = null;
        this._renderNoResults();
        this._eventEmitter.emit('results', res);
      }
    }.bind(this));

    request.catch(function (err) {
      this._loadingEl.style.display = 'none';

      // in the event of an error in the Mapbox Geocoding API still display results from the localGeocoder
      if (localGeocoderRes.length && this.options.localGeocoder) {
        this._clearEl.style.display = 'block';
        this._typeahead.update(localGeocoderRes);
      } else {
        this._clearEl.style.display = 'none';
        this._typeahead.selected = null;
        this._renderError();
      }

      this._eventEmitter.emit('results', { features: localGeocoderRes });
      this._eventEmitter.emit('error', { error: err });
    }.bind(this));

    return request;
  },

  /**
   * Shared logic for clearing input
   * @param {Event} [ev] the event that triggered the clear, if available
   * @private
   *
   */
  _clear: function _clear(ev) {
    if (ev) ev.preventDefault();
    this._inputEl.value = '';
    this._typeahead.selected = null;
    this._typeahead.clear();
    this._onChange();
    this._clearEl.style.display = 'none';
    this._removeMarker();
    this.lastSelected = null;
    this._eventEmitter.emit('clear');
    this.fresh = true;
  },

  /**
   * Clear and then focus the input.
   * @param {Event} [ev] the event that triggered the clear, if available
   *
   */
  clear: function clear(ev) {
    this._clear(ev);
    this._inputEl.focus();
  },

  /**
   * Clear the input, without refocusing it. Used to implement clearOnBlur
   * constructor option.
   * @param {Event} [ev] the blur event
   * @private
   */
  _clearOnBlur: function _clearOnBlur(ev) {
    var ctx = this;

    /*
     * If relatedTarget is not found, assume user targeted the suggestions list.
     * In that case, do not clear on blur. There are other edge cases where
     * ev.relatedTarget could be null. Clicking on list always results in null
     * relatedtarget because of upstream behavior in `suggestions`.
     *
     * The ideal solution would be to check if ev.relatedTarget is a child of
     * the list. See issue #258 for details on why we can't do that yet.
     */
    if (ev.relatedTarget) {
      ctx._clear(ev);
    }
  },

  _onQueryResult: function _onQueryResult(response) {
    var results = response.body;
    if (!results.features.length) return;
    var result = results.features[0];
    this._typeahead.selected = result;
    this._inputEl.value = result.place_name;
    this._onChange();
  },

  _updateProximity: function _updateProximity() {
    // proximity is designed for local scale, if the user is looking at the whole world,
    // it doesn't make sense to factor in the arbitrary centre of the map
    if (!this._map) {
      return;
    }
    if (this._map.getZoom() > 9) {
      var center = this._map.getCenter().wrap();
      this.setProximity({ longitude: center.lng, latitude: center.lat });
    } else {
      this.setProximity(null);
    }
  },

  _collapse: function _collapse() {
    // do not collapse if input is in focus
    if (!this._inputEl.value && this._inputEl !== document.activeElement) this.container.classList.add('mapboxgl-ctrl-geocoder--collapsed');
  },

  _unCollapse: function _unCollapse() {
    this.container.classList.remove('mapboxgl-ctrl-geocoder--collapsed');
  },

  /**
   * Set & query the input
   * @param {string} searchInput location name or other search input
   * @returns {MapboxGeocoder} this
   */
  query: function query(searchInput) {
    this._geocode(searchInput).then(this._onQueryResult);
    return this;
  },

  _renderError: function _renderError() {
    var errorMessage = "<div class='mapbox-gl-geocoder--error'>There was an error reaching the server</div>";
    this._renderMessage(errorMessage);
  },

  _renderNoResults: function _renderNoResults() {
    var errorMessage = "<div class='mapbox-gl-geocoder--error mapbox-gl-geocoder--no-results'>No results found</div>";
    this._renderMessage(errorMessage);
  },

  _renderMessage: function _renderMessage(msg) {
    this._typeahead.update([]);
    this._typeahead.selected = null;
    this._typeahead.clear();
    this._typeahead.renderError(msg);
  },

  /**
   * Get the text to use as the search bar placeholder
   *
   * If placeholder is provided in options, then use options.placeholder
   * Otherwise, if language is provided in options, then use the localized string of the first language if available
   * Otherwise use the default
   *
   * @returns {String} the value to use as the search bar placeholder
   * @private
   */
  _getPlaceholderText: function _getPlaceholderText() {
    if (this.options.placeholder) return this.options.placeholder;
    if (this.options.language) {
      var firstLanguage = this.options.language.split(",")[0];
      var language = subtag.language(firstLanguage);
      var localizedValue = localization.placeholder[language];
      if (localizedValue) return localizedValue;
    }
    return 'Search';
  },

  /**
   * Set input
   * @param {string} searchInput location name or other search input
   * @returns {MapboxGeocoder} this
   */
  setInput: function setInput(searchInput) {
    // Set input value to passed value and clear everything else.
    this._inputEl.value = searchInput;
    this._typeahead.selected = null;
    this._typeahead.clear();
    if (searchInput.length >= this.options.minLength) {
      this._geocode(searchInput);
    }
    return this;
  },

  /**
   * Set proximity
   * @param {Object} proximity The new `options.proximity` value. This is a geographical point given as an object with `latitude` and `longitude` properties.
   * @returns {MapboxGeocoder} this
   */
  setProximity: function setProximity(proximity) {
    this.options.proximity = proximity;
    return this;
  },

  /**
   * Get proximity
   * @returns {Object} The geocoder proximity
   */
  getProximity: function getProximity() {
    return this.options.proximity;
  },

  /**
   * Set the render function used in the results dropdown
   * @param {Function} fn The function to use as a render function. This function accepts a single [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) object as input and returns a string.
   * @returns {MapboxGeocoder} this
   */
  setRenderFunction: function setRenderFunction(fn) {
    if (fn && typeof fn == "function") {
      this._typeahead.render = fn;
    }
    return this;
  },

  /**
   * Get the function used to render the results dropdown
   *
   * @returns {Function} the render function
   */
  getRenderFunction: function getRenderFunction() {
    return this._typeahead.render;
  },

  /**
   * Get the language to use in UI elements and when making search requests
   *
   * Look first at the explicitly set options otherwise use the browser's language settings
   * @param {String} language Specify the language to use for response text and query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas.
   * @returns {MapboxGeocoder} this
   */
  setLanguage: function setLanguage(language) {
    var browserLocale = navigator.language || navigator.userLanguage || navigator.browserLanguage;
    this.options.language = language || this.options.language || browserLocale;
    return this;
  },

  /**
   * Get the language to use in UI elements and when making search requests
   * @returns {String} The language(s) used by the plugin, if any
   */
  getLanguage: function getLanguage() {
    return this.options.language;
  },

  /**
   * Get the zoom level the map will move to when there is no bounding box on the selected result
   * @returns {Number} the map zoom
   */
  getZoom: function getZoom() {
    return this.options.zoom;
  },

  /**
   * Set the zoom level
   * @param {Number} zoom The zoom level that the map should animate to when a `bbox` isn't found in the response. If a `bbox` is found the map will fit to the `bbox`.
   * @returns {MapboxGeocoder} this
   */
  setZoom: function setZoom(zoom) {
    this.options.zoom = zoom;
    return this;
  },

  /**
   * Get the parameters used to fly to the selected response, if any
   * @returns {Boolean|Object} The `flyTo` option
   */
  getFlyTo: function getFlyTo() {
    return this.options.flyTo;
  },

  /**
   * Set the flyTo options
   * @param {Boolean|Object} flyTo If false, animating the map to a selected result is disabled. If true, animating the map will use the default animation parameters. If an object, it will be passed as `options` to the map [`flyTo`](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto) or [`fitBounds`](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds) method providing control over the animation of the transition.
   */
  setFlyTo: function setFlyTo(flyTo) {
    this.options.flyTo = flyTo;
    return this;
  },

  /**
   * Get the value of the placeholder string
   * @returns {String} The input element's placeholder value
   */
  getPlaceholder: function getPlaceholder() {
    return this.options.placeholder;
  },

  /**
   * Set the value of the input element's placeholder
   * @param {String} placeholder the text to use as the input element's placeholder
   * @returns {MapboxGeocoder} this
   */
  setPlaceholder: function setPlaceholder(placeholder) {
    this.placeholder = placeholder ? placeholder : this._getPlaceholderText();
    this._inputEl.placeholder = this.placeholder;
    this._inputEl.setAttribute('aria-label', this.placeholder);
    return this;
  },

  /**
   * Get the bounding box used by the plugin
   * @returns {Array<Number>} the bounding box, if any
   */
  getBbox: function getBbox() {
    return this.options.bbox;
  },

  /**
   * Set the bounding box to limit search results to
   * @param {Array<Number>} bbox a bounding box given as an array in the format [minX, minY, maxX, maxY].
   * @returns {MapboxGeocoder} this
   */
  setBbox: function setBbox(bbox) {
    this.options.bbox = bbox;
    return this;
  },

  /**
   * Get a list of the countries to limit search results to
   * @returns {String} a comma separated list of countries to limit to, if any
   */
  getCountries: function getCountries() {
    return this.options.countries;
  },

  /**
   * Set the countries to limit search results to
   * @param {String} countries a comma separated list of countries to limit to
   * @returns {MapboxGeocoder} this
   */
  setCountries: function setCountries(countries) {
    this.options.countries = countries;
    return this;
  },

  /**
   * Get a list of the types to limit search results to
   * @returns {String} a comma separated list of types to limit to
   */
  getTypes: function getTypes() {
    return this.options.types;
  },

  /**
   * Set the types to limit search results to
   * @param {String} countries a comma separated list of types to limit to
   * @returns {MapboxGeocoder} this
   */
  setTypes: function setTypes(types) {
    this.options.types = types;
    return this;
  },

  /**
   * Get the minimum number of characters typed to trigger results used in the plugin
   * @returns {Number} The minimum length in characters before a search is triggered
   */
  getMinLength: function getMinLength() {
    return this.options.minLength;
  },

  /**
   * Set the minimum number of characters typed to trigger results used by the plugin
   * @param {Number} minLength the minimum length in characters
   * @returns {MapboxGeocoder} this
   */
  setMinLength: function setMinLength(minLength) {
    this.options.minLength = minLength;
    if (this._typeahead) this._typeahead.minLength = minLength;
    return this;
  },

  /**
   * Get the limit value for the number of results to display used by the plugin
   * @returns {Number} The limit value for the number of results to display used by the plugin
   */
  getLimit: function getLimit() {
    return this.options.limit;
  },

  /**
   * Set the limit value for the number of results to display used by the plugin
   * @param {Number} limit the number of search results to return
   * @returns {MapboxGeocoder}
   */
  setLimit: function setLimit(limit) {
    this.options.limit = limit;
    if (this._typeahead) this._typeahead.options.limit = limit;
    return this;
  },

  /**
   * Get the filter function used by the plugin
   * @returns {Function} the filter function
   */
  getFilter: function getFilter() {
    return this.options.filter;
  },

  /**
   * Set the filter function used by the plugin.
   * @param {Function} filter A function which accepts a Feature in the [Carmen GeoJSON](https://github.com/mapbox/carmen/blob/master/carmen-geojson.md) format to filter out results from the Geocoding API response before they are included in the suggestions list. Return `true` to keep the item, `false` otherwise.
   * @returns {MapboxGeocoder} this
   */
  setFilter: function setFilter(filter) {
    this.options.filter = filter;
    return this;
  },

  /**
   * Set the geocoding endpoint used by the plugin.
   * @param {Function} origin A function which accepts an HTTPS URL to specify the endpoint to query results from.
   * @returns {MapboxGeocoder} this
   */
  setOrigin: function setOrigin(origin) {
    this.options.origin = origin;
    this.geocoderService = mbxGeocoder(MapboxClient({
      accessToken: this.options.accessToken,
      origin: this.options.origin
    }));
    return this;
  },

  /**
   * Get the geocoding endpoint the plugin is currently set to
   * @returns {Function} the endpoint URL
   */
  getOrigin: function getOrigin() {
    return this.options.origin;
  },

  /**
   * Handle the placement of a result marking the selected result
   * @private
   * @param {Object} selected the selected geojson feature
   * @returns {MapboxGeocoder} this
   */
  _handleMarker: function _handleMarker(selected) {
    // clean up any old marker that might be present
    if (!this._map) {
      return;
    }
    this._removeMarker();
    var defaultMarkerOptions = {
      color: '#4668F2'
    };
    var markerOptions = extend({}, defaultMarkerOptions, this.options.marker);
    this.mapMarker = new this._mapboxgl.Marker(markerOptions);
    if (selected.center) {
      this.mapMarker.setLngLat(selected.center).addTo(this._map);
    } else if (selected.geometry && selected.geometry.type && selected.geometry.type === 'Point' && selected.geometry.coordinates) {
      this.mapMarker.setLngLat(selected.geometry.coordinates).addTo(this._map);
    }
    return this;
  },

  /**
   * Handle the removal of a result marker
   * @private
   */
  _removeMarker: function _removeMarker() {
    if (this.mapMarker) {
      this.mapMarker.remove();
      this.mapMarker = null;
    }
  },

  /**
   * Subscribe to events that happen within the plugin.
   * @param {String} type name of event. Available events and the data passed into their respective event objects are:
   *
   * - __clear__ `Emitted when the input is cleared`
   * - __loading__ `{ query } Emitted when the geocoder is looking up a query`
   * - __results__ `{ results } Fired when the geocoder returns a response`
   * - __result__ `{ result } Fired when input is set`
   * - __error__ `{ error } Error as string`
   * @param {Function} fn function that's called when the event is emitted.
   * @returns {MapboxGeocoder} this;
   */
  on: function on(type, fn) {
    this._eventEmitter.on(type, fn);
    return this;
  },

  /**
   * Remove an event
   * @returns {MapboxGeocoder} this
   * @param {String} type Event name.
   * @param {Function} fn Function that should unsubscribe to the event emitted.
   */
  off: function off(type, fn) {
    this._eventEmitter.removeListener(type, fn);
    this.eventManager.remove();
    return this;
  }
};

module.exports = MapboxGeocoder;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Localized values for the placeholder string
 * 
 * @private
 */

var placeholder = {
  // list drawn from https://docs.mapbox.com/api/search/#language-coverage
  'de': 'Suche', // german
  'it': 'Ricerca', //italian
  'en': 'Search', // english
  'nl': 'Zoeken', //dutch
  'fr': 'Chercher', //french
  'ca': 'Cerca', //catalan
  'he': 'לחפש', //hebrew
  'ja': 'サーチ', //japanese
  'lv': 'Meklēt', //latvian
  'pt': 'Procurar', //portuguese 
  'sr': 'Претрага', //serbian
  'zh': '搜索', //chinese-simplified
  'cs': 'Vyhledávání', //czech
  'hu': 'Keresés', //hungarian
  'ka': 'ძიება', // georgian
  'nb': 'Søke', //norwegian
  'sk': 'Vyhľadávanie', //slovak
  'th': 'ค้นหา', //thai
  'fi': 'Hae', //finnish
  'is': 'Leita', //icelandic
  'ko': '수색', //korean
  'pl': 'Szukaj', //polish
  'sl': 'Iskanje', //slovenian
  'fa': 'جستجو' //persian(aka farsi)
};

module.exports = { placeholder: placeholder };

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var client = __webpack_require__(3);

module.exports = client;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MapiResponse = __webpack_require__(19);
var MapiError = __webpack_require__(17);
var constants = __webpack_require__(1);
var parseHeaders = __webpack_require__(20);

// Keys are request IDs, values are XHRs.
var requestsUnderway = {};

function browserAbort(request) {
  var xhr = requestsUnderway[request.id];
  if (!xhr) return;
  xhr.abort();
  delete requestsUnderway[request.id];
}

function createResponse(request, xhr) {
  return new MapiResponse(request, {
    body: xhr.response,
    headers: parseHeaders(xhr.getAllResponseHeaders()),
    statusCode: xhr.status
  });
}

function normalizeBrowserProgressEvent(event) {
  var total = event.total;
  var transferred = event.loaded;
  var percent = 100 * transferred / total;
  return {
    total: total,
    transferred: transferred,
    percent: percent
  };
}

function sendRequestXhr(request, xhr) {
  return new Promise(function (resolve, reject) {
    xhr.onprogress = function (event) {
      request.emitter.emit(constants.EVENT_PROGRESS_DOWNLOAD, normalizeBrowserProgressEvent(event));
    };

    var file = request.file;
    if (file) {
      xhr.upload.onprogress = function (event) {
        request.emitter.emit(constants.EVENT_PROGRESS_UPLOAD, normalizeBrowserProgressEvent(event));
      };
    }

    xhr.onerror = function (error) {
      reject(error);
    };

    xhr.onabort = function () {
      var mapiError = new MapiError({
        request: request,
        type: constants.ERROR_REQUEST_ABORTED
      });
      reject(mapiError);
    };

    xhr.onload = function () {
      delete requestsUnderway[request.id];
      if (xhr.status < 200 || xhr.status >= 400) {
        var mapiError = new MapiError({
          request: request,
          body: xhr.response,
          statusCode: xhr.status
        });
        reject(mapiError);
        return;
      }
      resolve(xhr);
    };

    var body = request.body;

    // matching service needs to send a www-form-urlencoded request
    if (typeof body === 'string') {
      xhr.send(body);
    } else if (body) {
      xhr.send(JSON.stringify(body));
    } else if (file) {
      xhr.send(file);
    } else {
      xhr.send();
    }

    requestsUnderway[request.id] = xhr;
  }).then(function (xhr) {
    return createResponse(request, xhr);
  });
}

// The accessToken argument gives this function flexibility
// for Mapbox's internal client.
function createRequestXhr(request, accessToken) {
  var url = request.url(accessToken);
  var xhr = new window.XMLHttpRequest();
  xhr.open(request.method, url);
  Object.keys(request.headers).forEach(function (key) {
    xhr.setRequestHeader(key, request.headers[key]);
  });
  return xhr;
}

function browserSend(request) {
  return Promise.resolve().then(function () {
    var xhr = createRequestXhr(request, request.client.accessToken);
    return sendRequestXhr(request, xhr);
  });
}

module.exports = {
  browserAbort: browserAbort,
  sendRequestXhr: sendRequestXhr,
  browserSend: browserSend,
  createRequestXhr: createRequestXhr
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var constants = __webpack_require__(1);

/**
 * A Mapbox API error.
 *
 * If there's an error during the API transaction,
 * the Promise returned by `MapiRequest`'s [`send`](#send)
 * method should reject with a `MapiError`.
 *
 * @class MapiError
 * @hideconstructor
 * @property {MapiRequest} request - The errored request.
 * @property {string} type - The type of error. Usually this is `'HttpError'`.
 *   If the request was aborted, so the error was
 *   not sent from the server, the type will be
 *   `'RequestAbortedError'`.
 * @property {number} [statusCode] - The numeric status code of
 *   the HTTP response.
 * @property {Object | string} [body] - If the server sent a response body,
 *   this property exposes that response, parsed as JSON if possible.
 * @property {string} [message] - Whatever message could be derived from the
 *   call site and HTTP response.
 *
 * @param {MapiRequest} options.request
 * @param {number} [options.statusCode]
 * @param {string} [options.body]
 * @param {string} [options.message]
 * @param {string} [options.type]
 */
function MapiError(options) {
  var errorType = options.type || constants.ERROR_HTTP;

  var body;
  if (options.body) {
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      body = options.body;
    }
  } else {
    body = null;
  }

  var message = options.message || null;
  if (!message) {
    if (typeof body === 'string') {
      message = body;
    } else if (body && typeof body.message === 'string') {
      message = body.message;
    } else if (errorType === constants.ERROR_REQUEST_ABORTED) {
      message = 'Request aborted';
    }
  }

  this.message = message;
  this.type = errorType;
  this.statusCode = options.statusCode || null;
  this.request = options.request;
  this.body = body;
}

module.exports = MapiError;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseToken = __webpack_require__(5);
var xtend = __webpack_require__(0);
var EventEmitter = __webpack_require__(30);
var urlUtils = __webpack_require__(22);
var constants = __webpack_require__(1);

var requestId = 1;

/**
 * A Mapbox API request.
 *
 * Note that creating a `MapiRequest` does *not* send the request automatically.
 * Use the request's `send` method to send it off and get a `Promise`.
 *
 * The `emitter` property is an `EventEmitter` that emits the following events:
 *
 * - `'response'` - Listeners will be called with a `MapiResponse`.
 * - `'error'` - Listeners will be called with a `MapiError`.
 * - `'downloadProgress'` - Listeners will be called with `ProgressEvents`.
 * - `'uploadProgress'` - Listeners will be called with `ProgressEvents`.
 *   Upload events are only available when the request includes a file.
 *
 * @class MapiRequest
 * @property {EventEmitter} emitter - An event emitter. See above.
 * @property {MapiClient} client - This request's `MapiClient`.
 * @property {MapiResponse|null} response - If this request has been sent and received
 *   a response, the response is available on this property.
 * @property {MapiError|Error|null} error - If this request has been sent and
 *   received an error in response, the error is available on this property.
 * @property {boolean} aborted - If the request has been aborted
 *   (via [`abort`](#abort)), this property will be `true`.
 * @property {boolean} sent - If the request has been sent, this property will
 *   be `true`. You cannot send the same request twice, so if you need to create
 *   a new request that is the equivalent of an existing one, use
 *   [`clone`](#clone).
 * @property {string} path - The request's path, including colon-prefixed route
 *   parameters.
 * @property {string} origin - The request's origin.
 * @property {string} method - The request's HTTP method.
 * @property {Object} query - A query object, which will be transformed into
 *   a URL query string.
 * @property {Object} params - A route parameters object, whose values will
 *   be interpolated the path.
 * @property {Object} headers - The request's headers.
 * @property {Object|string|null} body - Data to send with the request.
 *   If the request has a body, it will also be sent with the header
 *   `'Content-Type: application/json'`.
 * @property {Blob|ArrayBuffer|string|ReadStream} file - A file to
 *   send with the request. The browser client accepts Blobs and ArrayBuffers;
 *   the Node client accepts strings (filepaths) and ReadStreams.
 * @property {string} encoding - The encoding of the response.
 * @property {string} sendFileAs - The method to send the `file`. Options are
 *   `data` (x-www-form-urlencoded) or `form` (multipart/form-data).
 */

/**
 * @ignore
 * @param {MapiClient} client
 * @param {Object} options
 * @param {string} options.method
 * @param {string} options.path
 * @param {Object} [options.query={}]
 * @param {Object} [options.params={}]
 * @param {string} [options.origin]
 * @param {Object} [options.headers]
 * @param {Object} [options.body=null]
 * @param {Blob|ArrayBuffer|string|ReadStream} [options.file=null]
 * @param {string} [options.encoding=utf8]
 */
function MapiRequest(client, options) {
  if (!client) {
    throw new Error('MapiRequest requires a client');
  }
  if (!options || !options.path || !options.method) {
    throw new Error('MapiRequest requires an options object with path and method properties');
  }

  var defaultHeaders = {};
  if (options.body) {
    defaultHeaders['content-type'] = 'application/json';
  }

  var headersWithDefaults = xtend(defaultHeaders, options.headers);

  // Disallows duplicate header names of mixed case,
  // e.g. Content-Type and content-type.
  var headers = Object.keys(headersWithDefaults).reduce(function (memo, name) {
    memo[name.toLowerCase()] = headersWithDefaults[name];
    return memo;
  }, {});

  this.id = requestId++;
  this._options = options;

  this.emitter = new EventEmitter();
  this.client = client;
  this.response = null;
  this.error = null;
  this.sent = false;
  this.aborted = false;
  this.path = options.path;
  this.method = options.method;
  this.origin = options.origin || client.origin;
  this.query = options.query || {};
  this.params = options.params || {};
  this.body = options.body || null;
  this.file = options.file || null;
  this.encoding = options.encoding || 'utf8';
  this.sendFileAs = options.sendFileAs || null;
  this.headers = headers;
}

/**
 * Get the URL of the request.
 *
 * @param {string} [accessToken] - By default, the access token of the request's
 *   client is used.
 * @return {string}
 */
MapiRequest.prototype.url = function url(accessToken) {
  var url = urlUtils.prependOrigin(this.path, this.origin);
  url = urlUtils.appendQueryObject(url, this.query);
  var routeParams = this.params;
  var actualAccessToken = accessToken == null ? this.client.accessToken : accessToken;
  if (actualAccessToken) {
    url = urlUtils.appendQueryParam(url, 'access_token', actualAccessToken);
    var accessTokenOwnerId = parseToken(actualAccessToken).user;
    routeParams = xtend({ ownerId: accessTokenOwnerId }, routeParams);
  }
  url = urlUtils.interpolateRouteParams(url, routeParams);
  return url;
};

/**
 * Send the request. Returns a Promise that resolves with a `MapiResponse`.
 * You probably want to use `response.body`.
 *
 * `send` only retrieves the first page of paginated results. You can get
 * the next page by using the `MapiResponse`'s [`nextPage`](#nextpage)
 * function, or iterate through all pages using [`eachPage`](#eachpage)
 * instead of `send`.
 *
 * @returns {Promise<MapiResponse>}
 */
MapiRequest.prototype.send = function send() {
  var self = this;

  if (self.sent) {
    throw new Error('This request has already been sent. Check the response and error properties. Create a new request with clone().');
  }
  self.sent = true;

  return self.client.sendRequest(self).then(function (response) {
    self.response = response;
    self.emitter.emit(constants.EVENT_RESPONSE, response);
    return response;
  }, function (error) {
    self.error = error;
    self.emitter.emit(constants.EVENT_ERROR, error);
    throw error;
  });
};

/**
 * Abort the request.
 *
 * Any pending `Promise` returned by [`send`](#send) will be rejected with
 * an error with `type: 'RequestAbortedError'`. If you've created a request
 * that might be aborted, you need to catch and handle such errors.
 *
 * This method will also abort any requests created while fetching subsequent
 * pages via [`eachPage`](#eachpage).
 *
 * If the request has not been sent or has already been aborted, nothing
 * will happen.
 */
MapiRequest.prototype.abort = function abort() {
  if (this._nextPageRequest) {
    this._nextPageRequest.abort();
    delete this._nextPageRequest;
  }

  if (this.response || this.error || this.aborted) return;

  this.aborted = true;
  this.client.abortRequest(this);
};

/**
 * Invoke a callback for each page of a paginated API response.
 *
 * The callback should have the following signature:
 *
 * ```js
 * (
 *   error: MapiError,
 *   response: MapiResponse,
 *   next: () => void
 * ) => void
 * ```
 *
 * **The next page will not be fetched until you've invoked the
 * `next` callback**, indicating that you're ready for it.
 *
 * @param {Function} callback
 */
MapiRequest.prototype.eachPage = function eachPage(callback) {
  var self = this;

  function handleResponse(response) {
    function getNextPage() {
      delete self._nextPageRequest;
      var nextPageRequest = response.nextPage();
      if (nextPageRequest) {
        self._nextPageRequest = nextPageRequest;
        getPage(nextPageRequest);
      }
    }
    callback(null, response, getNextPage);
  }

  function handleError(error) {
    callback(error, null, function () {});
  }

  function getPage(request) {
    request.send().then(handleResponse, handleError);
  }
  getPage(this);
};

/**
 * Clone this request.
 *
 * Each request can only be sent *once*. So if you'd like to send the
 * same request again, clone it and send away.
 *
 * @returns {MapiRequest} - A new `MapiRequest` configured just like this one.
 */
MapiRequest.prototype.clone = function clone() {
  return this._extend();
};

/**
 * @ignore
 */
MapiRequest.prototype._extend = function _extend(options) {
  var extendedOptions = xtend(this._options, options);
  return new MapiRequest(this.client, extendedOptions);
};

module.exports = MapiRequest;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseLinkHeader = __webpack_require__(21);

/**
 * A Mapbox API response.
 *
 * @class MapiResponse
 * @property {Object} body - The response body, parsed as JSON.
 * @property {string} rawBody - The raw response body.
 * @property {number} statusCode - The response's status code.
 * @property {Object} headers - The parsed response headers.
 * @property {Object} links - The parsed response links.
 * @property {MapiRequest} request - The response's originating `MapiRequest`.
 */

/**
 * @ignore
 * @param {MapiRequest} request
 * @param {Object} responseData
 * @param {Object} responseData.headers
 * @param {string} responseData.body
 * @param {number} responseData.statusCode
 */
function MapiResponse(request, responseData) {
  this.request = request;
  this.headers = responseData.headers;
  this.rawBody = responseData.body;
  this.statusCode = responseData.statusCode;
  try {
    this.body = JSON.parse(responseData.body || '{}');
  } catch (parseError) {
    this.body = responseData.body;
  }
  this.links = parseLinkHeader(this.headers.link);
}

/**
 * Check if there is a next page that you can fetch.
 *
 * @returns {boolean}
 */
MapiResponse.prototype.hasNextPage = function hasNextPage() {
  return !!this.links.next;
};

/**
 * Create a request for the next page, if there is one.
 * If there is no next page, returns `null`.
 *
 * @returns {MapiRequest | null}
 */
MapiResponse.prototype.nextPage = function nextPage() {
  if (!this.hasNextPage()) return null;
  return this.request._extend({
    path: this.links.next.url
  });
};

module.exports = MapiResponse;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function parseSingleHeader(raw) {
  var boundary = raw.indexOf(':');
  var name = raw.substring(0, boundary).trim().toLowerCase();
  var value = raw.substring(boundary + 1).trim();
  return {
    name: name,
    value: value
  };
}

/**
 * Parse raw headers into an object with lowercase properties.
 * Does not fully parse headings into more complete data structure,
 * as larger libraries might do. Also does not deal with duplicate
 * headers because Node doesn't seem to deal with those well, so
 * we shouldn't let the browser either, for consistency.
 *
 * @param {string} raw
 * @returns {Object}
 */
function parseHeaders(raw) {
  var headers = {};
  if (!raw) {
    return headers;
  }

  raw.trim().split(/[\r|\n]+/).forEach(function (rawHeader) {
    var parsed = parseSingleHeader(rawHeader);
    headers[parsed.name] = parsed.value;
  });

  return headers;
}

module.exports = parseHeaders;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Like https://github.com/thlorenz/lib/parse-link-header but without any
// additional dependencies.

function parseParam(param) {
  var parts = param.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
  if (!parts) return null;

  return {
    key: parts[1],
    value: parts[2]
  };
}

function parseLink(link) {
  var parts = link.match(/<?([^>]*)>(.*)/);
  if (!parts) return null;

  var linkUrl = parts[1];
  var linkParams = parts[2].split(';');
  var rel = null;
  var parsedLinkParams = linkParams.reduce(function (result, param) {
    var parsed = parseParam(param);
    if (!parsed) return result;
    if (parsed.key === 'rel') {
      if (!rel) {
        rel = parsed.value;
      }
      return result;
    }
    result[parsed.key] = parsed.value;
    return result;
  }, {});
  if (!rel) return null;

  return {
    url: linkUrl,
    rel: rel,
    params: parsedLinkParams
  };
}

/**
 * Parse a Link header.
 *
 * @param {string} linkHeader
 * @returns {{
 *   [string]: {
 *     url: string,
 *     params: { [string]: string }
 *   }
 * }}
 */
function parseLinkHeader(linkHeader) {
  if (!linkHeader) return {};

  return linkHeader.split(/,\s*</).reduce(function (result, link) {
    var parsed = parseLink(link);
    if (!parsed) return result;
    // rel value can be multiple whitespace-separated rels.
    var splitRel = parsed.rel.split(/\s+/);
    splitRel.forEach(function (rel) {
      if (!result[rel]) {
        result[rel] = {
          url: parsed.url,
          params: parsed.params
        };
      }
    });
    return result;
  }, {});
}

module.exports = parseLinkHeader;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Encode each item of an array individually. The comma
// delimiters should not themselves be encoded.

function encodeArray(arrayValue) {
  return arrayValue.map(encodeURIComponent).join(',');
}

function encodeValue(value) {
  if (Array.isArray(value)) {
    return encodeArray(value);
  }
  return encodeURIComponent(String(value));
}

/**
 * Append a query parameter to a URL.
 *
 * @param {string} url
 * @param {string} key
 * @param {string|number|boolean|Array<*>>} [value] - Provide an array
 *   if the value is a list and commas between values need to be
 *   preserved, unencoded.
 * @returns {string} - Modified URL.
 */
function appendQueryParam(url, key, value) {
  if (value === false || value === null) {
    return url;
  }
  var punctuation = /\?/.test(url) ? '&' : '?';
  var query = encodeURIComponent(key);
  if (value !== undefined && value !== '' && value !== true) {
    query += '=' + encodeValue(value);
  }
  return '' + url + punctuation + query;
}

/**
 * Derive a query string from an object and append it
 * to a URL.
 *
 * @param {string} url
 * @param {Object} [queryObject] - Values should be primitives.
 * @returns {string} - Modified URL.
 */
function appendQueryObject(url, queryObject) {
  if (!queryObject) {
    return url;
  }

  var result = url;
  Object.keys(queryObject).forEach(function (key) {
    var value = queryObject[key];
    if (value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value = value.filter(function (v) {
        return v !== null && v !== undefined;
      }).join(',');
    }
    result = appendQueryParam(result, key, value);
  });
  return result;
}

/**
 * Prepend an origin to a URL. If the URL already has an
 * origin, do nothing.
 *
 * @param {string} url
 * @param {string} origin
 * @returns {string} - Modified URL.
 */
function prependOrigin(url, origin) {
  if (!origin) {
    return url;
  }

  if (url.slice(0, 4) === 'http') {
    return url;
  }

  var delimiter = url[0] === '/' ? '' : '/';
  return '' + origin.replace(/\/$/, '') + delimiter + url;
}

/**
 * Interpolate values into a route with express-style,
 * colon-prefixed route parameters.
 *
 * @param {string} route
 * @param {Object} [params] - Values should be primitives
 *   or arrays of primitives. Provide an array if the value
 *   is a list and commas between values need to be
 *   preserved, unencoded.
 * @returns {string} - Modified URL.
 */
function interpolateRouteParams(route, params) {
  if (!params) {
    return route;
  }
  return route.replace(/\/:([a-zA-Z0-9]+)/g, function (_, paramId) {
    var value = params[paramId];
    if (value === undefined) {
      throw new Error('Unspecified route parameter ' + paramId);
    }
    var preppedValue = encodeValue(value);
    return '/' + preppedValue;
  });
}

module.exports = {
  appendQueryObject: appendQueryObject,
  appendQueryParam: appendQueryParam,
  prependOrigin: prependOrigin,
  interpolateRouteParams: interpolateRouteParams
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var xtend = __webpack_require__(0);
var v = __webpack_require__(28);
var pick = __webpack_require__(26);
var stringifyBooleans = __webpack_require__(27);
var createServiceFactory = __webpack_require__(24);

/**
 * Geocoding API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/search/#geocoding).
 */
var Geocoding = {};

var featureTypes = ['country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'address', 'poi', 'poi.landmark'];

/**
 * Search for a place.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/#forward-geocoding).
 *
 * @param {Object} config
 * @param {string} config.query - A place name.
 * @param {'mapbox.places'|'mapbox.places-permanent'} [config.mode="mapbox.places"] - Either `mapbox.places` for ephemeral geocoding, or `mapbox.places-permanent` for storing results and batch geocoding.
 * @param {Array<string>} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Coordinates} [config.proximity] - Bias local results based on a provided location.
 * @param {Array<'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'|'poi'|'poi.landmark'>} [config.types] - Filter results by feature types.
 * @param {boolean} [config.autocomplete=true] - Return autocomplete results or not.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=5] - Limit the number of results returned.
 * @param {Array<string>} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {boolean} [config.routing=false] - Specify whether to request additional metadata about the recommended navigation destination. Only applicable for address features.
 * @return {MapiRequest}
 *
 * @example
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   limit: 2
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * @example
 * // geocoding with proximity
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   proximity: [-95.4431142, 33.6875431]
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * // geocoding with countries
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   countries: ['fr']
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * // geocoding with bounding box
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   bbox: [2.14, 48.72, 2.55, 48.96]
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 */
Geocoding.forwardGeocode = function (config) {
  v.assertShape({
    query: v.required(v.string),
    mode: v.oneOf('mapbox.places', 'mapbox.places-permanent'),
    countries: v.arrayOf(v.string),
    proximity: v.coordinates,
    types: v.arrayOf(v.oneOf(featureTypes)),
    autocomplete: v.boolean,
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.arrayOf(v.string),
    routing: v.boolean
  })(config);

  config.mode = config.mode || 'mapbox.places';

  var query = stringifyBooleans(xtend({ country: config.countries }, pick(config, ['proximity', 'types', 'autocomplete', 'bbox', 'limit', 'language', 'routing'])));

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: query
  });
};

/**
 * Search for places near coordinates.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/#reverse-geocoding).
 *
 * @param {Object} config
 * @param {Coordinates} config.query - Coordinates at which features will be searched.
 * @param {'mapbox.places'|'mapbox.places-permanent'} [config.mode="mapbox.places"] - Either `mapbox.places` for ephemeral geocoding, or `mapbox.places-permanent` for storing results and batch geocoding.
 * @param {Array<string>} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Array<'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'|'poi'|'poi.landmark'>} [config.types] - Filter results by feature types.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=1] - Limit the number of results returned. If using this option, you must provide a single item for `types`.
 * @param {Array<string>} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {'distance'|'score'} [config.reverseMode='distance'] - Set the factors that are used to sort nearby results.
 * @param {boolean} [config.routing=false] - Specify whether to request additional metadata about the recommended navigation destination. Only applicable for address features.
 * @return {MapiRequest}
 *
 * @example
 * geocodingClient.reverseGeocode({
 *   query: [-95.4431142, 33.6875431]
 * })
 *   .send()
 *   .then(response => {
 *     // GeoJSON document with geocoding matches
 *     const match = response.body;
 *   });
 */
Geocoding.reverseGeocode = function (config) {
  v.assertShape({
    query: v.required(v.coordinates),
    mode: v.oneOf('mapbox.places', 'mapbox.places-permanent'),
    countries: v.arrayOf(v.string),
    types: v.arrayOf(v.oneOf(featureTypes)),
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.arrayOf(v.string),
    reverseMode: v.oneOf('distance', 'score'),
    routing: v.boolean
  })(config);

  config.mode = config.mode || 'mapbox.places';

  var query = stringifyBooleans(xtend({ country: config.countries }, pick(config, ['country', 'types', 'bbox', 'limit', 'language', 'reverseMode', 'routing'])));

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: query
  });
};

module.exports = createServiceFactory(Geocoding);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MapiClient = __webpack_require__(4);
// This will create the environment-appropriate client.
var createClient = __webpack_require__(3);

function createServiceFactory(ServicePrototype) {
  return function (clientOrConfig) {
    var client;
    if (MapiClient.prototype.isPrototypeOf(clientOrConfig)) {
      client = clientOrConfig;
    } else {
      client = createClient(clientOrConfig);
    }
    var service = Object.create(ServicePrototype);
    service.client = client;
    return service;
  };
}

module.exports = createServiceFactory;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function objectMap(obj, cb) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = cb(key, obj[key]);
    return result;
  }, {});
}

module.exports = objectMap;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Create a new object by picking properties off an existing object.
 * The second param can be overloaded as a callback for
 * more fine grained picking of properties.
 * @param {Object} source
 * @param {Array<string>|function(string, Object):boolean} keys
 * @returns {Object}
 */

function pick(source, keys) {
  var filter = function filter(key, val) {
    return keys.indexOf(key) !== -1 && val !== undefined;
  };

  if (typeof keys === 'function') {
    filter = keys;
  }

  return Object.keys(source).filter(function (key) {
    return filter(key, source[key]);
  }).reduce(function (result, key) {
    result[key] = source[key];
    return result;
  }, {});
}

module.exports = pick;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var objectMap = __webpack_require__(25);

/**
 * Stringify all the boolean values in an object, so true becomes "true".
 *
 * @param {Object} obj
 * @returns {Object}
 */
function stringifyBoolean(obj) {
  return objectMap(obj, function (_, value) {
    return typeof value === 'boolean' ? JSON.stringify(value) : value;
  });
}

module.exports = stringifyBoolean;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var xtend = __webpack_require__(0);
var v = __webpack_require__(10);

function file(value) {
  // If we're in a browser so Blob is available, the file must be that.
  // In Node, however, it could be a filepath or a pipeable (Readable) stream.
  if (typeof window !== 'undefined') {
    if (value instanceof global.Blob || value instanceof global.ArrayBuffer) {
      return;
    }
    return 'Blob or ArrayBuffer';
  }
  if (typeof value === 'string' || value.pipe !== undefined) {
    return;
  }
  return 'Filename or Readable stream';
}

function assertShape(validatorObj, apiName) {
  return v.assert(v.strictShape(validatorObj), apiName);
}

function date(value) {
  var msg = 'date';
  if (typeof value === 'boolean') {
    return msg;
  }
  try {
    var date = new Date(value);
    if (date.getTime && isNaN(date.getTime())) {
      return msg;
    }
  } catch (e) {
    return msg;
  }
}

function coordinates(value) {
  return v.tuple(v.number, v.number)(value);
}

module.exports = xtend(v, {
  file: file,
  date: date,
  coordinates: coordinates,
  assertShape: assertShape
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function (root) {

	// Detect free variables `exports`.
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function InvalidCharacterError(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error();
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function error(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function decode(input) {
		input = String(input).replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (length % 4 == 1 ||
		// http://whatwg.org/C#alphanumeric-ascii-characters
		/[^+a-zA-Z0-9/]/.test(input)) {
			error('Invalid character: the string to be decoded is not correctly encoded.');
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6));
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function encode(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error('The string to be encoded contains characters outside of the ' + 'Latin1 range.');
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += TABLE.charAt(buffer >> 18 & 0x3F) + TABLE.charAt(buffer >> 12 & 0x3F) + TABLE.charAt(buffer >> 6 & 0x3F) + TABLE.charAt(buffer & 0x3F);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += TABLE.charAt(buffer >> 10) + TABLE.charAt(buffer >> 4 & 0x3F) + TABLE.charAt(buffer << 2 & 0x3F) + '=';
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += TABLE.charAt(buffer >> 2) + TABLE.charAt(buffer << 4 & 0x3F) + '==';
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(6)) == 'object' && __webpack_require__(6)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return base64;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) {
			// in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.base64 = base64;
	}
})(undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(41)(module), __webpack_require__(2)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty,
    prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once),
      evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
      events,
      name;

  if (this._eventsCount === 0) return names;

  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
      handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
      listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt],
      len = arguments.length,
      args,
      i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;
      case 2:
        return listeners.fn.call(listeners.context, a1), true;
      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;
      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
        j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);break;
        case 2:
          listeners[i].fn.call(listeners[i].context, a1);break;
        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);break;
        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);break;
        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = (typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)));
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {

  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }var doError = type === 'error';

  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) {
      ReflectApply(listeners[i], this, args);
    }
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  checkListener(listener);

  events = this._events;
  if (events === undefined) return this;

  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }

    if (list.length === 1) events[type] = list[0];

    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;

  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined) return [];

  var evlistener = events[type];
  if (evlistener === undefined) return [];

  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) {
    copy[i] = arr[i];
  }return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };
    var errorListener;

    // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.
    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Fuzzy
 * https://github.com/myork/fuzzy
 *
 * Copyright (c) 2012 Matt York
 * Licensed under the MIT license.
 */

(function () {

  var root = this;

  var fuzzy = {};

  // Use in node or in browser
  if (true) {
    module.exports = fuzzy;
  } else {
    root.fuzzy = fuzzy;
  }

  // Return all elements of `array` that have a fuzzy
  // match against `pattern`.
  fuzzy.simpleFilter = function (pattern, array) {
    return array.filter(function (str) {
      return fuzzy.test(pattern, str);
    });
  };

  // Does `pattern` fuzzy match `str`?
  fuzzy.test = function (pattern, str) {
    return fuzzy.match(pattern, str) !== null;
  };

  // If `pattern` matches `str`, wrap each matching character
  // in `opts.pre` and `opts.post`. If no match, return null
  fuzzy.match = function (pattern, str, opts) {
    opts = opts || {};
    var patternIdx = 0,
        result = [],
        len = str.length,
        totalScore = 0,
        currScore = 0
    // prefix
    ,
        pre = opts.pre || ''
    // suffix
    ,
        post = opts.post || ''
    // String to compare against. This might be a lowercase version of the
    // raw string
    ,
        compareString = opts.caseSensitive && str || str.toLowerCase(),
        ch;

    pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

    // For each character in the string, either add it to the result
    // or wrap in template if it's the next string in the pattern
    for (var idx = 0; idx < len; idx++) {
      ch = str[idx];
      if (compareString[idx] === pattern[patternIdx]) {
        ch = pre + ch + post;
        patternIdx += 1;

        // consecutive characters should increase the score more than linearly
        currScore += 1 + currScore;
      } else {
        currScore = 0;
      }
      totalScore += currScore;
      result[result.length] = ch;
    }

    // return rendered string if we have a match for every char
    if (patternIdx === pattern.length) {
      // if the string is an exact match with pattern, totalScore should be maxed
      totalScore = compareString === pattern ? Infinity : totalScore;
      return { rendered: result.join(''), score: totalScore };
    }

    return null;
  };

  // The normal entry point. Filters `arr` for matches against `pattern`.
  // It returns an array with matching values of the type:
  //
  //     [{
  //         string:   '<b>lah' // The rendered string
  //       , index:    2        // The index of the element in `arr`
  //       , original: 'blah'   // The original element in `arr`
  //     }]
  //
  // `opts` is an optional argument bag. Details:
  //
  //    opts = {
  //        // string to put before a matching character
  //        pre:     '<b>'
  //
  //        // string to put after matching character
  //      , post:    '</b>'
  //
  //        // Optional function. Input is an entry in the given arr`,
  //        // output should be the string to test `pattern` against.
  //        // In this example, if `arr = [{crying: 'koala'}]` we would return
  //        // 'koala'.
  //      , extract: function(arg) { return arg.crying; }
  //    }
  fuzzy.filter = function (pattern, arr, opts) {
    if (!arr || arr.length === 0) {
      return [];
    }
    if (typeof pattern !== 'string') {
      return arr;
    }
    opts = opts || {};
    return arr.reduce(function (prev, element, idx, arr) {
      var str = element;
      if (opts.extract) {
        str = opts.extract(element);
      }
      var rendered = fuzzy.match(pattern, str, opts);
      if (rendered != null) {
        prev[prev.length] = {
          string: rendered.rendered,
          score: rendered.score,
          index: idx,
          original: element
        };
      }
      return prev;
    }, [])

    // Sort by score. Browsers are inconsistent wrt stable/unstable
    // sorting, so force stable by using the index in the case of tie.
    // See http://ofb.net/~sethml/is-sort-stable.html
    .sort(function (a, b) {
      var compare = b.score - a.score;
      if (compare) return compare;
      return a.index - b.index;
    });
  };
})();

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function now() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if (process.env.NODE_ENV !== 'production') {
  // All bundlers will remove this block in production bundle
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    throw new Error('React Native does not have a built-in secure random generator. ' + 'If you don’t need unpredictable IDs, you can use `nanoid/non-secure`. ' + 'For secure ID install `expo-random` locally and use `nanoid/async`.');
  }
  if (typeof self === 'undefined' || !self.crypto && !self.msCrypto) {
    throw new Error('Your browser does not have secure random generator. ' + 'If you don’t need unpredictable IDs, you can use nanoid/non-secure.');
  }
}

var crypto = self.crypto || self.msCrypto;

// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for smaller size.
// -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
var url = '-_';
// Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
var i = 36;
while (i--) {
  // 36 is radix. Number.prototype.toString(36) returns number
  // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
  url += i.toString(36);
}
// Loop from 36 to 10 (from Z to A in Base36).
i = 36;
while (i-- - 10) {
  url += i.toString(36).toUpperCase();
}

module.exports = function (size) {
  var id = '';
  var bytes = crypto.getRandomValues(new Uint8Array(size || 21));
  i = size || 21;

  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    id += url[bytes[i] & 63];
  }
  return id;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(36)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function (root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make();else root[name] = make();
}(undefined, 'subtag', function () {

  var empty = '';
  var pattern = /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;

  function match(tag) {
    return tag.match(pattern) || [];
  }

  function split(tag) {
    return match(tag).filter(function (v, i) {
      return v && i;
    });
  }

  function api(tag) {
    tag = match(tag);
    return {
      language: tag[1] || empty,
      extlang: tag[2] || empty,
      script: tag[3] || empty,
      region: tag[4] || empty
    };
  }

  function expose(target, key, value) {
    Object.defineProperty(target, key, {
      value: value,
      enumerable: true
    });
  }

  function part(position, pattern, type) {
    function method(tag) {
      return match(tag)[position] || empty;
    }
    expose(method, 'pattern', pattern);
    expose(api, type, method);
  }

  part(1, /^[a-zA-Z]{2,3}$/, 'language');
  part(2, /^[a-zA-Z]{3}$/, 'extlang');
  part(3, /^[a-zA-Z]{4}$/, 'script');
  part(4, /^[a-zA-Z]{2}$|^[0-9]{3}$/, 'region');

  expose(api, 'split', split);

  return api;
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A typeahead component for inputs
 * @class Suggestions
 *
 * @param {HTMLInputElement} el A valid HTML input element
 * @param {Array} data An array of data used for results
 * @param {Object} options
 * @param {Number} [options.limit=5] Max number of results to display in the auto suggest list.
 * @param {Number} [options.minLength=2] Number of characters typed into an input to trigger suggestions.
 * @param {Boolean} [options.hideOnBlur=true] If `true`, hides the suggestions when focus is lost.
 * @return {Suggestions} `this`
 * @example
 * // in the browser
 * var input = document.querySelector('input');
 * var data = [
 *   'Roy Eldridge',
 *   'Roy Hargrove',
 *   'Rex Stewart'
 * ];
 *
 * new Suggestions(input, data);
 *
 * // with options
 * var input = document.querySelector('input');
 * var data = [{
 *   name: 'Roy Eldridge',
 *   year: 1911
 * }, {
 *   name: 'Roy Hargrove',
 *   year: 1969
 * }, {
 *   name: 'Rex Stewart',
 *   year: 1907
 * }];
 *
 * var typeahead = new Suggestions(input, data, {
 *   filter: false, // Disable filtering
 *   minLength: 3, // Number of characters typed into an input to trigger suggestions.
 *   limit: 3, //  Max number of results to display.
 *   hideOnBlur: false // Don't hide results when input loses focus
 * });
 *
 * // As we're passing an object of an arrays as data, override
 * // `getItemValue` by specifying the specific property to search on.
 * typeahead.getItemValue = function(item) { return item.name };
 *
 * input.addEventListener('change', function() {
 *   console.log(typeahead.selected); // Current selected item.
 * });
 *
 * // With browserify
 * var Suggestions = require('suggestions');
 *
 * new Suggestions(input, data);
 */

var Suggestions = __webpack_require__(40);
window.Suggestions = module.exports = Suggestions;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var List = function List(component) {
  this.component = component;
  this.items = [];
  this.active = 0;
  this.wrapper = document.createElement('div');
  this.wrapper.className = 'suggestions-wrapper';
  this.element = document.createElement('ul');
  this.element.className = 'suggestions';
  this.wrapper.appendChild(this.element);

  // selectingListItem is set to true in the time between the mousedown and mouseup when clicking an item in the list
  // mousedown on a list item will cause the input to blur which normally hides the list, so this flag is used to keep
  // the list open until the mouseup
  this.selectingListItem = false;

  component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
  return this;
};

List.prototype.show = function () {
  this.element.style.display = 'block';
};

List.prototype.hide = function () {
  this.element.style.display = 'none';
};

List.prototype.add = function (item) {
  this.items.push(item);
};

List.prototype.clear = function () {
  this.items = [];
  this.active = 0;
};

List.prototype.isEmpty = function () {
  return !this.items.length;
};

List.prototype.isVisible = function () {
  return this.element.style.display === 'block';
};

List.prototype.draw = function () {
  this.element.innerHTML = '';

  if (this.items.length === 0) {
    this.hide();
    return;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.drawItem(this.items[i], this.active === i);
  }

  this.show();
};

List.prototype.drawItem = function (item, active) {
  var li = document.createElement('li'),
      a = document.createElement('a');

  if (active) li.className += ' active';

  a.innerHTML = item.string;

  li.appendChild(a);
  this.element.appendChild(li);

  li.addEventListener('mousedown', function () {
    this.selectingListItem = true;
  }.bind(this));

  li.addEventListener('mouseup', function () {
    this.handleMouseUp.call(this, item);
  }.bind(this));
};

List.prototype.handleMouseUp = function (item) {
  this.selectingListItem = false;
  this.component.value(item.original);
  this.clear();
  this.draw();
};

List.prototype.move = function (index) {
  this.active = index;
  this.draw();
};

List.prototype.previous = function () {
  this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
};

List.prototype.next = function () {
  this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
};

List.prototype.drawError = function (msg) {
  var li = document.createElement('li');

  li.innerHTML = msg;

  this.element.appendChild(li);
  this.show();
};

module.exports = List;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(0);
var fuzzy = __webpack_require__(32);
var List = __webpack_require__(39);

var Suggestions = function Suggestions(el, data, options) {
  options = options || {};

  this.options = extend({
    minLength: 2,
    limit: 5,
    filter: true,
    hideOnBlur: true
  }, options);

  this.el = el;
  this.data = data || [];
  this.list = new List(this);

  this.query = '';
  this.selected = null;

  this.list.draw();

  this.el.addEventListener('keyup', function (e) {
    this.handleKeyUp(e.keyCode);
  }.bind(this), false);

  this.el.addEventListener('keydown', function (e) {
    this.handleKeyDown(e);
  }.bind(this));

  this.el.addEventListener('focus', function () {
    this.handleFocus();
  }.bind(this));

  this.el.addEventListener('blur', function () {
    this.handleBlur();
  }.bind(this));

  this.el.addEventListener('paste', function (e) {
    this.handlePaste(e);
  }.bind(this));

  // use user-provided render function if given, otherwise just use the default
  this.render = this.options.render ? this.options.render.bind(this) : this.render.bind(this);

  this.getItemValue = this.options.getItemValue ? this.options.getItemValue.bind(this) : this.getItemValue.bind(this);

  return this;
};

Suggestions.prototype.handleKeyUp = function (keyCode) {
  // 40 - DOWN
  // 38 - UP
  // 27 - ESC
  // 13 - ENTER
  // 9 - TAB

  if (keyCode === 40 || keyCode === 38 || keyCode === 27 || keyCode === 13 || keyCode === 9) return;

  this.handleInputChange(this.el.value);
};

Suggestions.prototype.handleKeyDown = function (e) {
  switch (e.keyCode) {
    case 13: // ENTER
    case 9:
      // TAB
      if (!this.list.isEmpty()) {
        if (this.list.isVisible()) {
          e.preventDefault();
        }
        this.value(this.list.items[this.list.active].original);
        this.list.hide();
      }
      break;
    case 27:
      // ESC
      if (!this.list.isEmpty()) this.list.hide();
      break;
    case 38:
      // UP
      this.list.previous();
      break;
    case 40:
      // DOWN
      this.list.next();
      break;
  }
};

Suggestions.prototype.handleBlur = function () {
  if (!this.list.selectingListItem && this.options.hideOnBlur) {
    this.list.hide();
  }
};

Suggestions.prototype.handlePaste = function (e) {
  if (e.clipboardData) {
    this.handleInputChange(e.clipboardData.getData('Text'));
  } else {
    var self = this;
    setTimeout(function () {
      self.handleInputChange(e.target.value);
    }, 100);
  }
};

Suggestions.prototype.handleInputChange = function (query) {
  this.query = this.normalize(query);

  this.list.clear();

  if (this.query.length < this.options.minLength) {
    this.list.draw();
    return;
  }

  this.getCandidates(function (data) {
    for (var i = 0; i < data.length; i++) {
      this.list.add(data[i]);
      if (i === this.options.limit - 1) break;
    }
    this.list.draw();
  }.bind(this));
};

Suggestions.prototype.handleFocus = function () {
  if (!this.list.isEmpty()) this.list.show();
  this.list.selectingListItem = false;
};

/**
 * Update data previously passed
 *
 * @param {Array} revisedData
 */
Suggestions.prototype.update = function (revisedData) {
  this.data = revisedData;
  this.handleKeyUp();
};

/**
 * Clears data
 */
Suggestions.prototype.clear = function () {
  this.data = [];
  this.list.clear();
};

/**
 * Normalize the results list and input value for matching
 *
 * @param {String} value
 * @return {String}
 */
Suggestions.prototype.normalize = function (value) {
  value = value.toLowerCase();
  return value;
};

/**
 * Evaluates whether an array item qualifies as a match with the current query
 *
 * @param {String} candidate a possible item from the array passed
 * @param {String} query the current query
 * @return {Boolean}
 */
Suggestions.prototype.match = function (candidate, query) {
  return candidate.indexOf(query) > -1;
};

Suggestions.prototype.value = function (value) {
  this.selected = value;
  this.el.value = this.getItemValue(value);

  if (document.createEvent) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent('change', true, false);
    this.el.dispatchEvent(e);
  } else {
    this.el.fireEvent('onchange');
  }
};

Suggestions.prototype.getCandidates = function (callback) {
  var options = {
    pre: '<strong>',
    post: '</strong>',
    extract: function (d) {
      return this.getItemValue(d);
    }.bind(this)
  };
  var results;
  if (this.options.filter) {
    results = fuzzy.filter(this.query, this.data, options);

    results = results.map(function (item) {
      return {
        original: item.original,
        string: this.render(item.original, item.string)
      };
    }.bind(this));
  } else {
    results = this.data.map(function (d) {
      var renderedString = this.render(d);
      return {
        original: d,
        string: renderedString
      };
    }.bind(this));
  }
  callback(results);
};

/**
 * For a given item in the data array, return what should be used as the candidate string
 *
 * @param {Object|String} item an item from the data array
 * @return {String} item
 */
Suggestions.prototype.getItemValue = function (item) {
  return item;
};

/**
 * For a given item in the data array, return a string of html that should be rendered in the dropdown
 * @param {Object|String} item an item from the data array
 * @param {String} sourceFormatting a string that has pre-formatted html that should be passed directly through the render function 
 * @return {String} html
 */
Suggestions.prototype.render = function (item, sourceFormatting) {
  if (sourceFormatting) {
    // use existing formatting on the source string
    return sourceFormatting;
  }
  var boldString = item.original ? this.getItemValue(item.original) : this.getItemValue(item);
  var indexString = this.normalize(boldString);
  var indexOfQuery = indexString.lastIndexOf(this.query);
  while (indexOfQuery > -1) {
    var endIndexOfQuery = indexOfQuery + this.query.length;
    boldString = boldString.slice(0, indexOfQuery) + '<strong>' + boldString.slice(indexOfQuery, endIndexOfQuery) + '</strong>' + boldString.slice(endIndexOfQuery);
    indexOfQuery = indexString.slice(0, indexOfQuery).lastIndexOf(this.query);
  }
  return boldString;
};

/**
 * Render an custom error message in the suggestions list
 * @param {String} msg An html string to render as an error message
 */
Suggestions.prototype.renderError = function (msg) {
  this.list.drawError(msg);
};

module.exports = Suggestions;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(9);

var _bling = __webpack_require__(8);

var _autocomplete = __webpack_require__(7);

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _typeAhead = __webpack_require__(51);

var _typeAhead2 = _interopRequireDefault(_typeAhead);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _autocomplete2.default)((0, _bling.$)('#address'), (0, _bling.$)('#lat'), (0, _bling.$)('#lng'));
(0, _typeAhead2.default)((0, _bling.$)('.search'));

/***/ }),
/* 43 */,
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bind = __webpack_require__(50);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  typeof document.createElement -> undefined
 */
function isStandardBrowserEnv() {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof document.createElement === 'function';
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge() /* obj1, obj2, obj3, ... */{
  var result = {};
  function assignValue(val, key) {
    if (_typeof(result[key]) === 'object' && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(44);
var normalizeHeaderName = __webpack_require__(67);

var PROTECTION_PREFIX = /^\)\]\}',?\n/;
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(46);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(46);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      data = data.replace(PROTECTION_PREFIX, '');
      try {
        data = JSON.parse(data);
      } catch (e) {/* Ignore */}
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(36)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(44);
var settle = __webpack_require__(59);
var buildURL = __webpack_require__(62);
var parseHeaders = __webpack_require__(68);
var isURLSameOrigin = __webpack_require__(66);
var createError = __webpack_require__(49);
var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || __webpack_require__(61);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(64);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        if (request.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(36)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(58);

/**
 * Create an Error with the specified message, config, error code, and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, response);
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _axios = __webpack_require__(52);

var _axios2 = _interopRequireDefault(_axios);

var _dompurify = __webpack_require__(70);

var _dompurify2 = _interopRequireDefault(_dompurify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function searchResultsHTML(stores) {
	return stores.map(function (store) {
		return '\n\t\t\t<a href="/store/' + store.slug + '" class="search__result">\n\t\t\t\t<strong>' + store.name + '</strong>\n\t\t\t</a>\n\t\t';
	}).join('');
}

function typeAhead(search) {
	if (!search) return;

	var searchInput = search.querySelector('input[name="search"]');
	var searchResults = search.querySelector('.search__results');

	searchInput.on('input', function () {
		var _this = this;

		if (!this.value) {
			searchResults.style.display = 'none';
			return;
		}
		// searchResults.innerHTML=`No results for ${this.value}`;
		searchResults.style.display = "block";
		_axios2.default.get('/api/search?q=' + this.value).then(function (res) {
			if (res.data.length) {
				searchResults.innerHTML = _dompurify2.default.sanitize(searchResultsHTML(res.data));
				return;
			}
			searchResults.innerHTML = _dompurify2.default.sanitize('<div class="search__result">No results for ' + _this.value + ' found!</div>');
		}).catch(function (err) {
			console.error(err);
		});
	});

	//handle keyboard inputs
	searchInput.on('keyup', function (e) {
		//if they aren't pressing up down or enter who cares?
		if (![38, 40, 13].includes(e.keyCode)) {
			return;
		}
		var activeClass = 'search__result--active';
		var current = search.querySelector('.' + activeClass);
		var items = search.querySelectorAll('.search__result');
		var next = void 0;
		if (e.keyCode === 40 && current) {
			//if pushing down and current
			next = current.nextElementSibling || items[0];
		} else if (e.keyCode === 40) {
			//no current, select the first
			next = items[0];
		} else if (e.keyCode === 38 && current) {
			//if pushing up and there is a current
			next = current.previousElementSibling || items[items.length - 1];
		} else if (e.keyCode === 38) {
			next = items[items.length - 1];
		} else if (e.keyCode === 13 && current.href) {
			//hitting enter and clicking on element with link
			window.location = current.href;
			return;
		}
		if (current) {
			current.classList.remove(activeClass);
		}
		next.classList.add(activeClass);
		// console.log(next);
	});
}

exports.default = typeAhead;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(53);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);
var bind = __webpack_require__(50);
var Axios = __webpack_require__(55);
var defaults = __webpack_require__(45);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(47);
axios.CancelToken = __webpack_require__(54);
axios.isCancel = __webpack_require__(48);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(69);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(47);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(45);
var utils = __webpack_require__(44);
var InterceptorManager = __webpack_require__(56);
var dispatchRequest = __webpack_require__(57);
var isAbsoluteURL = __webpack_require__(65);
var combineURLs = __webpack_require__(63);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);
var transformData = __webpack_require__(60);
var isCancel = __webpack_require__(48);
var defaults = __webpack_require__(45);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(config.data, config.headers, config.transformRequest);

  // Flatten headers
  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(response.data, response.headers, config.transformResponse);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 @ @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.response = response;
  return error;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(49);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response));
  }
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error();
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
  // initialize result and counter
  var block, charCode, idx = 0, map = chars;
  // if the next str index does not exist:
  //   change the mapping table to "="
  //   check if d has no fractional digits
  str.charAt(idx | 0) || (map = '=', idx % 1);
  // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },

    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },

    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() :

// Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
  );
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;

  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */
  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href);

    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);

  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */
  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() :

// Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(44);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (factory) {
    'use strict';
    /* global window: false, define: false, module: false */

    var root = typeof window === 'undefined' ? null : window;

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return factory(root);
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined') {
        module.exports = factory(root);
    } else {
        root.DOMPurify = factory(root);
    }
})(function factory(window) {
    'use strict';

    var DOMPurify = function DOMPurify(window) {
        return factory(window);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '0.8.5';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
        // not running in a browser, provide a factory function
        // so that you can pass your own Window
        DOMPurify.isSupported = false;
        return DOMPurify;
    }

    var document = window.document;
    var originalDocument = document;
    var DocumentFragment = window.DocumentFragment;
    var HTMLTemplateElement = window.HTMLTemplateElement;
    var Node = window.Node;
    var NodeFilter = window.NodeFilter;
    var NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap;
    var Text = window.Text;
    var Comment = window.Comment;
    var DOMParser = window.DOMParser;

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.
    if (typeof HTMLTemplateElement === 'function') {
        var template = document.createElement('template');
        if (template.content && template.content.ownerDocument) {
            document = template.content.ownerDocument;
        }
    }
    var implementation = document.implementation;
    var createNodeIterator = document.createNodeIterator;
    var getElementsByTagName = document.getElementsByTagName;
    var createDocumentFragment = document.createDocumentFragment;
    var importNode = originalDocument.importNode;

    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = typeof implementation.createHTMLDocument !== 'undefined' && document.documentMode !== 9;

    /* Add properties to a lookup table */
    var _addToSet = function _addToSet(set, array) {
        var l = array.length;
        while (l--) {
            if (typeof array[l] === 'string') {
                array[l] = array[l].toLowerCase();
            }
            set[array[l]] = true;
        }
        return set;
    };

    /* Shallow clone an object */
    var _cloneObj = function _cloneObj(object) {
        var newObject = {};
        var property;
        for (property in object) {
            if (object.hasOwnProperty(property)) {
                newObject[property] = object[property];
            }
        }
        return newObject;
    };

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */
    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = _addToSet({}, [

    // HTML
    'a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr',

    // SVG
    'svg', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern',

    // SVG Filters
    'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence',

    //MathML
    'math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmuliscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mpspace', 'msqrt', 'mystyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover',

    //Text
    '#text']);

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = _addToSet({}, [

    // HTML
    'accept', 'action', 'align', 'alt', 'autocomplete', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'coords', 'datetime', 'default', 'dir', 'disabled', 'download', 'enctype', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'ismap', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'span', 'srclang', 'start', 'src', 'step', 'style', 'summary', 'tabindex', 'title', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns',

    // SVG
    'accent-height', 'accumulate', 'additivive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'mode', 'min', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'surfacescale', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'y', 'y1', 'y2', 'z', 'zoomandpan',

    // MathML
    'accent', 'accentunder', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'display', 'displaystyle', 'fence', 'frame', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset',

    // XML
    'xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for jQuery's $() factory? */
    var SAFE_FOR_JQUERY = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Specify template detection regex for SAFE_FOR_TEMPLATES mode */
    var MUSTACHE_EXPR = /\{\{[\s\S]*|[\s\S]*\}\}/gm;
    var ERB_EXPR = /<%[\s\S]*|[\s\S]*%>/gm;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html string.
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html string */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify. */
    var RETURN_DOM_IMPORT = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = _addToSet({}, ['audio', 'head', 'math', 'script', 'style', 'svg', 'video']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = _addToSet({}, ['audio', 'video', 'img', 'source']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = _addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  optional config literal
     */
    var _parseConfig = function _parseConfig(cfg) {
        /* Shield configuration object from tampering */
        if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
            cfg = {};
        }

        /* Set configuration parameters */
        ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? _addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
        ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? _addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
        FORBID_TAGS = 'FORBID_TAGS' in cfg ? _addToSet({}, cfg.FORBID_TAGS) : {};
        FORBID_ATTR = 'FORBID_ATTR' in cfg ? _addToSet({}, cfg.FORBID_ATTR) : {};
        ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
        ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
        SAFE_FOR_JQUERY = cfg.SAFE_FOR_JQUERY || false; // Default false
        SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
        WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
        RETURN_DOM = cfg.RETURN_DOM || false; // Default false
        RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
        RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || false; // Default false
        SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
        KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

        if (SAFE_FOR_TEMPLATES) {
            ALLOW_DATA_ATTR = false;
        }

        if (RETURN_DOM_FRAGMENT) {
            RETURN_DOM = true;
        }

        /* Merge configuration parameters */
        if (cfg.ADD_TAGS) {
            if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
                ALLOWED_TAGS = _cloneObj(ALLOWED_TAGS);
            }
            _addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
        }
        if (cfg.ADD_ATTR) {
            if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
                ALLOWED_ATTR = _cloneObj(ALLOWED_ATTR);
            }
            _addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
        }
        if (cfg.ADD_URI_SAFE_ATTR) {
            _addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
        }

        /* Add #text in case KEEP_CONTENT is set to true */
        if (KEEP_CONTENT) {
            ALLOWED_TAGS['#text'] = true;
        }

        // Prevent further manipulation of configuration.
        // Not available in IE8, Safari 5, etc.
        if (Object && 'freeze' in Object) {
            Object.freeze(cfg);
        }

        CONFIG = cfg;
    };

    /**
      * _forceRemove
      *
      * @param  a DOM node
      */
    var _forceRemove = function _forceRemove(node) {
        DOMPurify.removed.push({ element: node });
        try {
            node.parentNode.removeChild(node);
        } catch (e) {
            node.outerHTML = '';
        }
    };

    /**
      * _removeAttribute
      *
      * @param  an Attribute name
      * @param  a DOM node
      */
    var _removeAttribute = function _removeAttribute(name, node) {
        DOMPurify.removed.push({
            attribute: node.getAttributeNode(name),
            from: node
        });
        node.removeAttribute(name);
    };

    /**
      * _initDocument
      *
      * @param  a string of dirty markup
      * @return a DOM, filled with the dirty markup
      */
    var _initDocument = function _initDocument(dirty) {
        /* Create a HTML document using DOMParser */
        var doc, body;
        try {
            doc = new DOMParser().parseFromString(dirty, 'text/html');
        } catch (e) {}

        /* Some browsers throw, some browsers return null for the code above
           DOMParser with text/html support is only in very recent browsers.
           See #159 why the check here is extra-thorough */
        if (!doc || !doc.documentElement) {
            doc = implementation.createHTMLDocument('');
            body = doc.body;
            body.parentNode.removeChild(body.parentNode.firstElementChild);
            body.outerHTML = dirty;
        }

        /* Work on whole document or just its body */
        if (typeof doc.getElementsByTagName === 'function') {
            return doc.getElementsByTagName(WHOLE_DOCUMENT ? 'html' : 'body')[0];
        }
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    };

    /**
     * _createIterator
     *
     * @param  document/fragment to create iterator for
     * @return iterator instance
     */
    var _createIterator = function _createIterator(root) {
        return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
            return NodeFilter.FILTER_ACCEPT;
        }, false);
    };

    /**
     * _isClobbered
     *
     * @param  element to check for clobbering attacks
     * @return true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
        if (elm instanceof Text || elm instanceof Comment) {
            return false;
        }
        if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function') {
            return true;
        }
        return false;
    };

    /**
     * _isNode
     *
     * @param object to check whether it's a DOM node
     * @return true is object is a DOM node
     */
    var _isNode = function _isNode(obj) {
        return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === "object" ? obj instanceof Node : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   node to check for permission to exist
     * @return  true if node was killed, false if left alive
     */
    var _sanitizeElements = function _sanitizeElements(currentNode) {
        var tagName, content;
        /* Execute a hook if present */
        _executeHook('beforeSanitizeElements', currentNode, null);

        /* Check if element is clobbered or can clobber */
        if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
            return true;
        }

        /* Now let's check the element's type and name */
        tagName = currentNode.nodeName.toLowerCase();

        /* Execute a hook if present */
        _executeHook('uponSanitizeElement', currentNode, {
            tagName: tagName,
            allowedTags: ALLOWED_TAGS
        });

        /* Remove element if anything forbids its presence */
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            /* Keep content except for black-listed elements */
            if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && typeof currentNode.insertAdjacentHTML === 'function') {
                try {
                    currentNode.insertAdjacentHTML('AfterEnd', currentNode.innerHTML);
                } catch (e) {}
            }
            _forceRemove(currentNode);
            return true;
        }

        /* Convert markup to cover jQuery behavior */
        if (SAFE_FOR_JQUERY && !currentNode.firstElementChild && (!currentNode.content || !currentNode.content.firstElementChild) && /</g.test(currentNode.textContent)) {
            DOMPurify.removed.push({ element: currentNode.cloneNode() });
            currentNode.innerHTML = currentNode.textContent.replace(/</g, '&lt;');
        }

        /* Sanitize element content to be template-safe */
        if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
            /* Get the element's text content */
            content = currentNode.textContent;
            content = content.replace(MUSTACHE_EXPR, ' ');
            content = content.replace(ERB_EXPR, ' ');
            if (currentNode.textContent !== content) {
                DOMPurify.removed.push({ element: currentNode.cloneNode() });
                currentNode.textContent = content;
            }
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeElements', currentNode, null);

        return false;
    };

    var DATA_ATTR = /^data-[\-\w.\u00B7-\uFFFF]/;
    var IS_ALLOWED_URI = /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
    var IS_SCRIPT_OR_DATA = /^(?:\w+script|data):/i;
    /* This needs to be extensive thanks to Webkit/Blink's behavior */
    var ATTR_WHITESPACE = /[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g;

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param   node to sanitize
     * @return  void
     */
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
        var attr, name, value, lcName, idAttr, attributes, hookEvent, l;
        /* Execute a hook if present */
        _executeHook('beforeSanitizeAttributes', currentNode, null);

        attributes = currentNode.attributes;

        /* Check if we have attributes; if not we might have a text node */
        if (!attributes) {
            return;
        }

        hookEvent = {
            attrName: '',
            attrValue: '',
            keepAttr: true,
            allowedAttributes: ALLOWED_ATTR
        };
        l = attributes.length;

        /* Go backwards over all attributes; safely remove bad ones */
        while (l--) {
            attr = attributes[l];
            name = attr.name;
            value = attr.value.trim();
            lcName = name.toLowerCase();

            /* Execute a hook if present */
            hookEvent.attrName = lcName;
            hookEvent.attrValue = value;
            hookEvent.keepAttr = true;
            _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
            value = hookEvent.attrValue;

            /* Remove attribute */
            // Safari (iOS + Mac), last tested v8.0.5, crashes if you try to
            // remove a "name" attribute from an <img> tag that has an "id"
            // attribute at the time.
            if (lcName === 'name' && currentNode.nodeName === 'IMG' && attributes.id) {
                idAttr = attributes.id;
                attributes = Array.prototype.slice.apply(attributes);
                _removeAttribute('id', currentNode);
                _removeAttribute(name, currentNode);
                if (attributes.indexOf(idAttr) > l) {
                    currentNode.setAttribute('id', idAttr.value);
                }
            } else {
                // This avoids a crash in Safari v9.0 with double-ids.
                // The trick is to first set the id to be empty and then to
                // remove the attriubute
                if (name === 'id') {
                    currentNode.setAttribute(name, '');
                }
                _removeAttribute(name, currentNode);
            }

            /* Did the hooks approve of the attribute? */
            if (!hookEvent.keepAttr) {
                continue;
            }

            /* Make sure attribute cannot clobber */
            if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in window || value in document || value in formElement)) {
                continue;
            }

            /* Sanitize attribute content to be template-safe */
            if (SAFE_FOR_TEMPLATES) {
                value = value.replace(MUSTACHE_EXPR, ' ');
                value = value.replace(ERB_EXPR, ' ');
            }

            /* Allow valid data-* attributes: At least one character after "-"
               (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
               XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
               We don't need to check the value; it's always URI safe. */
            if (ALLOW_DATA_ATTR && DATA_ATTR.test(lcName)) {}
            // This attribute is safe

            /* Otherwise, check the name is permitted */
            else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
                    continue;
                }
                /* Check value is safe. First, is attr inert? If so, is safe */
                else if (URI_SAFE_ATTRIBUTES[lcName]) {}
                    // This attribute is safe

                    /* Check no script, data or unknown possibly unsafe URI
                       unless we know URI values are safe for that attribute */
                    else if (IS_ALLOWED_URI.test(value.replace(ATTR_WHITESPACE, ''))) {}
                        // This attribute is safe

                        /* Keep image data URIs alive if src is allowed */
                        else if (lcName === 'src' && value.indexOf('data:') === 0 && DATA_URI_TAGS[currentNode.nodeName.toLowerCase()]) {}
                            // This attribute is safe

                            /* Allow unknown protocols: This provides support for links that
                               are handled by protocol handlers which may be unknown ahead of
                               time, e.g. fb:, spotify: */
                            else if (ALLOW_UNKNOWN_PROTOCOLS && !IS_SCRIPT_OR_DATA.test(value.replace(ATTR_WHITESPACE, ''))) {}
                                // This attribute is safe

                                /* Check for binary attributes */
                                else if (!value) {}
                                    // binary attributes are safe at this point

                                    /* Anything else, presume unsafe, do not add it back */
                                    else {
                                            continue;
                                        }

            /* Handle invalid data-* attribute set by try-catching it */
            try {
                currentNode.setAttribute(name, value);
                DOMPurify.removed.pop();
            } catch (e) {}
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  fragment to iterate over recursively
     * @return void
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
        var shadowNode;
        var shadowIterator = _createIterator(fragment);

        /* Execute a hook if present */
        _executeHook('beforeSanitizeShadowDOM', fragment, null);

        while (shadowNode = shadowIterator.nextNode()) {
            /* Execute a hook if present */
            _executeHook('uponSanitizeShadowNode', shadowNode, null);

            /* Sanitize tags and elements */
            if (_sanitizeElements(shadowNode)) {
                continue;
            }

            /* Deep shadow DOM detected */
            if (shadowNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM(shadowNode.content);
            }

            /* Check attributes, sanitize if necessary */
            _sanitizeAttributes(shadowNode);
        }

        /* Execute a hook if present */
        _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
        if (!hooks[entryPoint]) {
            return;
        }

        hooks[entryPoint].forEach(function (hook) {
            hook.call(DOMPurify, currentNode, data, CONFIG);
        });
    };

    /**
     * sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    DOMPurify.sanitize = function (dirty, cfg) {
        var body, importedNode, currentNode, oldNode, nodeIterator, returnNode;
        /* Make sure we have a string to sanitize.
           DO NOT return early, as this will return the wrong type if
           the user has requested a DOM object rather than a string */
        if (!dirty) {
            dirty = '<!-->';
        }

        /* Stringify, in case dirty is an object */
        if (typeof dirty !== 'string' && !_isNode(dirty)) {
            if (typeof dirty.toString !== 'function') {
                throw new TypeError('toString is not a function');
            } else {
                dirty = dirty.toString();
            }
        }

        /* Check we can run. Otherwise fall back or ignore */
        if (!DOMPurify.isSupported) {
            if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
                if (typeof dirty === 'string') {
                    return window.toStaticHTML(dirty);
                } else if (_isNode(dirty)) {
                    return window.toStaticHTML(dirty.outerHTML);
                }
            }
            return dirty;
        }

        /* Assign config vars */
        _parseConfig(cfg);

        /* Clean up removed elements */
        DOMPurify.removed = [];

        if (dirty instanceof Node) {
            /* If dirty is a DOM element, append to an empty document to avoid
               elements being stripped by the parser */
            body = _initDocument('<!-->');
            importedNode = body.ownerDocument.importNode(dirty, true);
            if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
                /* Node is already a body, use as is */
                body = importedNode;
            } else {
                body.appendChild(importedNode);
            }
        } else {
            /* Exit directly if we have nothing to do */
            if (!RETURN_DOM && !WHOLE_DOCUMENT && dirty.indexOf('<') === -1) {
                return dirty;
            }

            /* Initialize the document to work on */
            body = _initDocument(dirty);

            /* Check we have a DOM node from the data */
            if (!body) {
                return RETURN_DOM ? null : '';
            }
        }

        /* Get node iterator */
        nodeIterator = _createIterator(body);

        /* Now start iterating over the created document */
        while (currentNode = nodeIterator.nextNode()) {

            /* Fix IE's strange behavior with manipulated textNodes #89 */
            if (currentNode.nodeType === 3 && currentNode === oldNode) {
                continue;
            }

            /* Sanitize tags and elements */
            if (_sanitizeElements(currentNode)) {
                continue;
            }

            /* Shadow DOM detected, sanitize it */
            if (currentNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM(currentNode.content);
            }

            /* Check attributes, sanitize if necessary */
            _sanitizeAttributes(currentNode);

            oldNode = currentNode;
        }

        /* Return sanitized string or DOM */
        if (RETURN_DOM) {

            if (RETURN_DOM_FRAGMENT) {
                returnNode = createDocumentFragment.call(body.ownerDocument);

                while (body.firstChild) {
                    returnNode.appendChild(body.firstChild);
                }
            } else {
                returnNode = body;
            }

            if (RETURN_DOM_IMPORT) {
                /* adoptNode() is not used because internal state is not reset
                   (e.g. the past names map of a HTMLFormElement), this is safe
                   in theory but we would rather not risk another attack vector.
                   The state that is cloned by importNode() is explicitly defined
                   by the specs. */
                returnNode = importNode.call(originalDocument, returnNode, true);
            }

            return returnNode;
        }

        return WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    };

    /**
     * addHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint
     * @param {Function} hookFunction
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
        if (typeof hookFunction !== 'function') {
            return;
        }
        hooks[entryPoint] = hooks[entryPoint] || [];
        hooks[entryPoint].push(hookFunction);
    };

    /**
     * removeHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint
     * @return void
     */
    DOMPurify.removeHook = function (entryPoint) {
        if (hooks[entryPoint]) {
            hooks[entryPoint].pop();
        }
    };

    /**
     * removeHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint
     * @return void
     */
    DOMPurify.removeHooks = function (entryPoint) {
        if (hooks[entryPoint]) {
            hooks[entryPoint] = [];
        }
    };

    /**
     * removeAllHooks
     * Public method to remove all DOMPurify hooks
     *
     * @return void
     */
    DOMPurify.removeAllHooks = function () {
        hooks = {};
    };

    return DOMPurify;
});

/***/ })
/******/ ]);
//# sourceMappingURL=App.bundle.js.map