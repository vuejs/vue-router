/*!
 * vue-router v0.1.0
 * (c) 2015 Evan You
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["VueRouter"] = factory();
	else
		root["VueRouter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var routerUtil = __webpack_require__(1)
	var Recognizer = __webpack_require__(2)
	var installed = false

	/**
	 * Router constructor
	 *
	 * @param {Object} [options]
	 *                 - {String} root
	 *                 - {Boolean} hashbang  (default: true)
	 *                 - {Boolean} pushstate (default: false)
	 */

	function Router (options) {
	  if (!installed) {
	    throw new Error(
	      'Please install the Router with Vue.use() before ' +
	      'creating an instance.'
	    )
	  }

	  options = options || {}

	  // Vue instances
	  this.app = null
	  this._children = []

	  // route recognizer
	  this._recognizer = new Recognizer()
	  this._guardRecognizer = new Recognizer()

	  // state
	  this._started = false
	  this._currentRoute = { path: '/' }

	  // feature detection
	  this._hasPushState = typeof history !== 'undefined' && history.pushState

	  // global handler/hooks
	  this._notFoundHandler = options.notFound || null
	  this._beforeEachHook = options.beforeEach || null
	  this._afterEachHook = options.afterEach || null

	  // other options
	  this._hashbang = options.hashbang !== false
	  this._history = !!(this._hasPushState && options.history)
	  this._saveScrollPosition = !!options.saveScrollPosition

	  // resolve root path
	  var root = options && options.root
	  if (root) {
	    // make sure there's the starting slash
	    if (root.charAt(0) !== '/') {
	      root = '/' + root
	    }
	    // remove trailing slash
	    this._root = root.replace(/\/$/, '')
	  } else {
	    this._root = null
	  }
	}

	/**
	 * Installation interface.
	 * Install the necessary directives.
	 */

	Router.install = function (Vue) {
	  if (installed) {
	    routerUtil.warn('already installed.')
	    return
	  }
	  __webpack_require__(5)(Vue, Router)
	  __webpack_require__(6)(Vue, Router)
	  __webpack_require__(8)(Vue)
	  __webpack_require__(10)(Vue)
	  __webpack_require__(11)(Vue, Router)
	  installed = true
	}

	// auto install
	if (window.Vue) {
	  Router.install(window.Vue)
	}

	module.exports = Router


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Warn stuff.
	 *
	 * @param {String} msg
	 * @param {Error} [err]
	 */

	exports.warn = function (msg, err) {
	  if (window.console) {
	    console.warn('[vue-router] ' + msg)
	    if (err) {
	      console.warn(err.stack)
	    }
	  }
	}

	/**
	 * Set current hash
	 *
	 * @param {String} hash
	 * @param {Boolean} replace
	 */

	exports.setHash = function (hash, replace) {
	  if (replace) {
	    var urlLength = location.href.length - location.hash.length
	    var fullURL = location.href.slice(0, urlLength) + '#' + hash
	    location.replace(fullURL)
	  } else {
	    location.hash = hash
	  }
	}

	/**
	 * Resolve a relative path.
	 *
	 * @param {String} base
	 * @param {String} relative
	 * @return {String}
	 */

	exports.resolvePath = function (base, relative) {
	  var stack = base.split('/')
	  // remove trailing segment
	  stack.pop()
	  // resolve relative path
	  var segments = relative.split('/')
	  for (var i = 0; i < segments.length; i++) {
	    var segment = segments[i]
	    if (segment === '.') {
	      continue
	    } else if (segment === '..') {
	      stack.pop()
	    } else {
	      stack.push(segment)
	    }
	  }
	  // ensure leading slash
	  if (stack[0] !== '') {
	    stack.unshift('')
	  }
	  return stack.join('/')
	}

	/**
	 * Call an async hook function with a list of arguments,
	 * plus a pair of resolve and reject functions. If the hook
	 * returns a promise, or returns a boolean, the resolve and
	 * reject functions will be handled accordingly.
	 *
	 * @param {Function} fn
	 * @param {Object} options
	 *                 - {Array} [args]
	 *                 - {Function} onResolve
	 *                 - {Function} onReject
	 */

	exports.callAsyncFn = function (fn, options) {
	  var args = options.args || []
	  var onResolve = options.onResolve
	  var onReject = options.onReject
	  args.push(onResolve, onReject)
	  var res = fn.apply(null, args)
	  if (isPromise(res)) {
	    res.then(onResolve, onReject)
	  } else if (res === true) {
	    onResolve()
	  } else if (res === false) {
	    onReject()
	  }
	}

	/**
	 * Forgiving check for a promise
	 *
	 * @param {Object} p
	 * @return {Boolean}
	 */

	function isPromise (p) {
	  return p &&
	    typeof p.then === 'function'
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {(function() {
	    "use strict";
	    function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
	      this.path = path;
	      this.matcher = matcher;
	      this.delegate = delegate;
	    }

	    $$route$recognizer$dsl$$Target.prototype = {
	      to: function(target, callback) {
	        var delegate = this.delegate;

	        if (delegate && delegate.willAddRoute) {
	          target = delegate.willAddRoute(this.matcher.target, target);
	        }

	        this.matcher.add(this.path, target);

	        if (callback) {
	          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
	          this.matcher.addChild(this.path, target, callback, this.delegate);
	        }
	        return this;
	      }
	    };

	    function $$route$recognizer$dsl$$Matcher(target) {
	      this.routes = {};
	      this.children = {};
	      this.target = target;
	    }

	    $$route$recognizer$dsl$$Matcher.prototype = {
	      add: function(path, handler) {
	        this.routes[path] = handler;
	      },

	      addChild: function(path, target, callback, delegate) {
	        var matcher = new $$route$recognizer$dsl$$Matcher(target);
	        this.children[path] = matcher;

	        var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);

	        if (delegate && delegate.contextEntered) {
	          delegate.contextEntered(target, match);
	        }

	        callback(match);
	      }
	    };

	    function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
	      return function(path, nestedCallback) {
	        var fullPath = startingPath + path;

	        if (nestedCallback) {
	          nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
	        } else {
	          return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
	        }
	      };
	    }

	    function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
	      var len = 0;
	      for (var i=0, l=routeArray.length; i<l; i++) {
	        len += routeArray[i].path.length;
	      }

	      path = path.substr(len);
	      var route = { path: path, handler: handler };
	      routeArray.push(route);
	    }

	    function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
	      var routes = matcher.routes;

	      for (var path in routes) {
	        if (routes.hasOwnProperty(path)) {
	          var routeArray = baseRoute.slice();
	          $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);

	          if (matcher.children[path]) {
	            $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
	          } else {
	            callback.call(binding, routeArray);
	          }
	        }
	      }
	    }

	    var $$route$recognizer$dsl$$default = function(callback, addRouteCallback) {
	      var matcher = new $$route$recognizer$dsl$$Matcher();

	      callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));

	      $$route$recognizer$dsl$$eachRoute([], matcher, function(route) {
	        if (addRouteCallback) { addRouteCallback(this, route); }
	        else { this.add(route); }
	      }, this);
	    };

	    var $$route$recognizer$$specials = [
	      '/', '.', '*', '+', '?', '|',
	      '(', ')', '[', ']', '{', '}', '\\'
	    ];

	    var $$route$recognizer$$escapeRegex = new RegExp('(\\' + $$route$recognizer$$specials.join('|\\') + ')', 'g');

	    function $$route$recognizer$$isArray(test) {
	      return Object.prototype.toString.call(test) === "[object Array]";
	    }

	    // A Segment represents a segment in the original route description.
	    // Each Segment type provides an `eachChar` and `regex` method.
	    //
	    // The `eachChar` method invokes the callback with one or more character
	    // specifications. A character specification consumes one or more input
	    // characters.
	    //
	    // The `regex` method returns a regex fragment for the segment. If the
	    // segment is a dynamic of star segment, the regex fragment also includes
	    // a capture.
	    //
	    // A character specification contains:
	    //
	    // * `validChars`: a String with a list of all valid characters, or
	    // * `invalidChars`: a String with a list of all invalid characters
	    // * `repeat`: true if the character specification can repeat

	    function $$route$recognizer$$StaticSegment(string) { this.string = string; }
	    $$route$recognizer$$StaticSegment.prototype = {
	      eachChar: function(callback) {
	        var string = this.string, ch;

	        for (var i=0, l=string.length; i<l; i++) {
	          ch = string.charAt(i);
	          callback({ validChars: ch });
	        }
	      },

	      regex: function() {
	        return this.string.replace($$route$recognizer$$escapeRegex, '\\$1');
	      },

	      generate: function() {
	        return this.string;
	      }
	    };

	    function $$route$recognizer$$DynamicSegment(name) { this.name = name; }
	    $$route$recognizer$$DynamicSegment.prototype = {
	      eachChar: function(callback) {
	        callback({ invalidChars: "/", repeat: true });
	      },

	      regex: function() {
	        return "([^/]+)";
	      },

	      generate: function(params) {
	        return params[this.name];
	      }
	    };

	    function $$route$recognizer$$StarSegment(name) { this.name = name; }
	    $$route$recognizer$$StarSegment.prototype = {
	      eachChar: function(callback) {
	        callback({ invalidChars: "", repeat: true });
	      },

	      regex: function() {
	        return "(.+)";
	      },

	      generate: function(params) {
	        return params[this.name];
	      }
	    };

	    function $$route$recognizer$$EpsilonSegment() {}
	    $$route$recognizer$$EpsilonSegment.prototype = {
	      eachChar: function() {},
	      regex: function() { return ""; },
	      generate: function() { return ""; }
	    };

	    function $$route$recognizer$$parse(route, names, types) {
	      // normalize route as not starting with a "/". Recognition will
	      // also normalize.
	      if (route.charAt(0) === "/") { route = route.substr(1); }

	      var segments = route.split("/"), results = [];

	      for (var i=0, l=segments.length; i<l; i++) {
	        var segment = segments[i], match;

	        if (match = segment.match(/^:([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$DynamicSegment(match[1]));
	          names.push(match[1]);
	          types.dynamics++;
	        } else if (match = segment.match(/^\*([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$StarSegment(match[1]));
	          names.push(match[1]);
	          types.stars++;
	        } else if(segment === "") {
	          results.push(new $$route$recognizer$$EpsilonSegment());
	        } else {
	          results.push(new $$route$recognizer$$StaticSegment(segment));
	          types.statics++;
	        }
	      }

	      return results;
	    }

	    // A State has a character specification and (`charSpec`) and a list of possible
	    // subsequent states (`nextStates`).
	    //
	    // If a State is an accepting state, it will also have several additional
	    // properties:
	    //
	    // * `regex`: A regular expression that is used to extract parameters from paths
	    //   that reached this accepting state.
	    // * `handlers`: Information on how to convert the list of captures into calls
	    //   to registered handlers with the specified parameters
	    // * `types`: How many static, dynamic or star segments in this route. Used to
	    //   decide which route to use if multiple registered routes match a path.
	    //
	    // Currently, State is implemented naively by looping over `nextStates` and
	    // comparing a character specification against a character. A more efficient
	    // implementation would use a hash of keys pointing at one or more next states.

	    function $$route$recognizer$$State(charSpec) {
	      this.charSpec = charSpec;
	      this.nextStates = [];
	    }

	    $$route$recognizer$$State.prototype = {
	      get: function(charSpec) {
	        var nextStates = this.nextStates;

	        for (var i=0, l=nextStates.length; i<l; i++) {
	          var child = nextStates[i];

	          var isEqual = child.charSpec.validChars === charSpec.validChars;
	          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

	          if (isEqual) { return child; }
	        }
	      },

	      put: function(charSpec) {
	        var state;

	        // If the character specification already exists in a child of the current
	        // state, just return that state.
	        if (state = this.get(charSpec)) { return state; }

	        // Make a new state for the character spec
	        state = new $$route$recognizer$$State(charSpec);

	        // Insert the new state as a child of the current state
	        this.nextStates.push(state);

	        // If this character specification repeats, insert the new state as a child
	        // of itself. Note that this will not trigger an infinite loop because each
	        // transition during recognition consumes a character.
	        if (charSpec.repeat) {
	          state.nextStates.push(state);
	        }

	        // Return the new state
	        return state;
	      },

	      // Find a list of child states matching the next character
	      match: function(ch) {
	        // DEBUG "Processing `" + ch + "`:"
	        var nextStates = this.nextStates,
	            child, charSpec, chars;

	        // DEBUG "  " + debugState(this)
	        var returned = [];

	        for (var i=0, l=nextStates.length; i<l; i++) {
	          child = nextStates[i];

	          charSpec = child.charSpec;

	          if (typeof (chars = charSpec.validChars) !== 'undefined') {
	            if (chars.indexOf(ch) !== -1) { returned.push(child); }
	          } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
	            if (chars.indexOf(ch) === -1) { returned.push(child); }
	          }
	        }

	        return returned;
	      }

	      /** IF DEBUG
	      , debug: function() {
	        var charSpec = this.charSpec,
	            debug = "[",
	            chars = charSpec.validChars || charSpec.invalidChars;

	        if (charSpec.invalidChars) { debug += "^"; }
	        debug += chars;
	        debug += "]";

	        if (charSpec.repeat) { debug += "+"; }

	        return debug;
	      }
	      END IF **/
	    };

	    /** IF DEBUG
	    function debug(log) {
	      console.log(log);
	    }

	    function debugState(state) {
	      return state.nextStates.map(function(n) {
	        if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
	        return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
	      }).join(", ")
	    }
	    END IF **/

	    // This is a somewhat naive strategy, but should work in a lot of cases
	    // A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
	    //
	    // This strategy generally prefers more static and less dynamic matching.
	    // Specifically, it
	    //
	    //  * prefers fewer stars to more, then
	    //  * prefers using stars for less of the match to more, then
	    //  * prefers fewer dynamic segments to more, then
	    //  * prefers more static segments to more
	    function $$route$recognizer$$sortSolutions(states) {
	      return states.sort(function(a, b) {
	        if (a.types.stars !== b.types.stars) { return a.types.stars - b.types.stars; }

	        if (a.types.stars) {
	          if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }
	          if (a.types.dynamics !== b.types.dynamics) { return b.types.dynamics - a.types.dynamics; }
	        }

	        if (a.types.dynamics !== b.types.dynamics) { return a.types.dynamics - b.types.dynamics; }
	        if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }

	        return 0;
	      });
	    }

	    function $$route$recognizer$$recognizeChar(states, ch) {
	      var nextStates = [];

	      for (var i=0, l=states.length; i<l; i++) {
	        var state = states[i];

	        nextStates = nextStates.concat(state.match(ch));
	      }

	      return nextStates;
	    }

	    var $$route$recognizer$$oCreate = Object.create || function(proto) {
	      function F() {}
	      F.prototype = proto;
	      return new F();
	    };

	    function $$route$recognizer$$RecognizeResults(queryParams) {
	      this.queryParams = queryParams || {};
	    }
	    $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
	      splice: Array.prototype.splice,
	      slice:  Array.prototype.slice,
	      push:   Array.prototype.push,
	      length: 0,
	      queryParams: null
	    });

	    function $$route$recognizer$$findHandler(state, path, queryParams) {
	      var handlers = state.handlers, regex = state.regex;
	      var captures = path.match(regex), currentCapture = 1;
	      var result = new $$route$recognizer$$RecognizeResults(queryParams);

	      for (var i=0, l=handlers.length; i<l; i++) {
	        var handler = handlers[i], names = handler.names, params = {};

	        for (var j=0, m=names.length; j<m; j++) {
	          params[names[j]] = captures[currentCapture++];
	        }

	        result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
	      }

	      return result;
	    }

	    function $$route$recognizer$$addSegment(currentState, segment) {
	      segment.eachChar(function(ch) {
	        var state;

	        currentState = currentState.put(ch);
	      });

	      return currentState;
	    }

	    function $$route$recognizer$$decodeQueryParamPart(part) {
	      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
	      part = part.replace(/\+/gm, '%20');
	      return decodeURIComponent(part);
	    }

	    // The main interface

	    var $$route$recognizer$$RouteRecognizer = function() {
	      this.rootState = new $$route$recognizer$$State();
	      this.names = {};
	    };


	    $$route$recognizer$$RouteRecognizer.prototype = {
	      add: function(routes, options) {
	        var currentState = this.rootState, regex = "^",
	            types = { statics: 0, dynamics: 0, stars: 0 },
	            handlers = [], allSegments = [], name;

	        var isEmpty = true;

	        for (var i=0, l=routes.length; i<l; i++) {
	          var route = routes[i], names = [];

	          var segments = $$route$recognizer$$parse(route.path, names, types);

	          allSegments = allSegments.concat(segments);

	          for (var j=0, m=segments.length; j<m; j++) {
	            var segment = segments[j];

	            if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

	            isEmpty = false;

	            // Add a "/" for the new segment
	            currentState = currentState.put({ validChars: "/" });
	            regex += "/";

	            // Add a representation of the segment to the NFA and regex
	            currentState = $$route$recognizer$$addSegment(currentState, segment);
	            regex += segment.regex();
	          }

	          var handler = { handler: route.handler, names: names };
	          handlers.push(handler);
	        }

	        if (isEmpty) {
	          currentState = currentState.put({ validChars: "/" });
	          regex += "/";
	        }

	        currentState.handlers = handlers;
	        currentState.regex = new RegExp(regex + "$");
	        currentState.types = types;

	        if (name = options && options.as) {
	          this.names[name] = {
	            segments: allSegments,
	            handlers: handlers
	          };
	        }
	      },

	      handlersFor: function(name) {
	        var route = this.names[name], result = [];
	        if (!route) { throw new Error("There is no route named " + name); }

	        for (var i=0, l=route.handlers.length; i<l; i++) {
	          result.push(route.handlers[i]);
	        }

	        return result;
	      },

	      hasRoute: function(name) {
	        return !!this.names[name];
	      },

	      generate: function(name, params) {
	        var route = this.names[name], output = "";
	        if (!route) { throw new Error("There is no route named " + name); }

	        var segments = route.segments;

	        for (var i=0, l=segments.length; i<l; i++) {
	          var segment = segments[i];

	          if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

	          output += "/";
	          output += segment.generate(params);
	        }

	        if (output.charAt(0) !== '/') { output = '/' + output; }

	        if (params && params.queryParams) {
	          output += this.generateQueryString(params.queryParams, route.handlers);
	        }

	        return output;
	      },

	      generateQueryString: function(params, handlers) {
	        var pairs = [];
	        var keys = [];
	        for(var key in params) {
	          if (params.hasOwnProperty(key)) {
	            keys.push(key);
	          }
	        }
	        keys.sort();
	        for (var i = 0, len = keys.length; i < len; i++) {
	          key = keys[i];
	          var value = params[key];
	          if (value == null) {
	            continue;
	          }
	          var pair = encodeURIComponent(key);
	          if ($$route$recognizer$$isArray(value)) {
	            for (var j = 0, l = value.length; j < l; j++) {
	              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
	              pairs.push(arrayPair);
	            }
	          } else {
	            pair += "=" + encodeURIComponent(value);
	            pairs.push(pair);
	          }
	        }

	        if (pairs.length === 0) { return ''; }

	        return "?" + pairs.join("&");
	      },

	      parseQueryString: function(queryString) {
	        var pairs = queryString.split("&"), queryParams = {};
	        for(var i=0; i < pairs.length; i++) {
	          var pair      = pairs[i].split('='),
	              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
	              keyLength = key.length,
	              isArray = false,
	              value;
	          if (pair.length === 1) {
	            value = 'true';
	          } else {
	            //Handle arrays
	            if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
	              isArray = true;
	              key = key.slice(0, keyLength - 2);
	              if(!queryParams[key]) {
	                queryParams[key] = [];
	              }
	            }
	            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
	          }
	          if (isArray) {
	            queryParams[key].push(value);
	          } else {
	            queryParams[key] = value;
	          }
	        }
	        return queryParams;
	      },

	      recognize: function(path) {
	        var states = [ this.rootState ],
	            pathLen, i, l, queryStart, queryParams = {},
	            isSlashDropped = false;

	        queryStart = path.indexOf('?');
	        if (queryStart !== -1) {
	          var queryString = path.substr(queryStart + 1, path.length);
	          path = path.substr(0, queryStart);
	          queryParams = this.parseQueryString(queryString);
	        }

	        path = decodeURI(path);

	        // DEBUG GROUP path

	        if (path.charAt(0) !== "/") { path = "/" + path; }

	        pathLen = path.length;
	        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
	          path = path.substr(0, pathLen - 1);
	          isSlashDropped = true;
	        }

	        for (i=0, l=path.length; i<l; i++) {
	          states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
	          if (!states.length) { break; }
	        }

	        // END DEBUG GROUP

	        var solutions = [];
	        for (i=0, l=states.length; i<l; i++) {
	          if (states[i].handlers) { solutions.push(states[i]); }
	        }

	        states = $$route$recognizer$$sortSolutions(solutions);

	        var state = solutions[0];

	        if (state && state.handlers) {
	          // if a trailing slash was dropped and a star segment is the last segment
	          // specified, put the trailing slash back
	          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
	            path = path + "/";
	          }
	          return $$route$recognizer$$findHandler(state, path, queryParams);
	        }
	      }
	    };

	    $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;

	    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.5';

	    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(4)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return $$route$recognizer$$default; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = $$route$recognizer$$default;
	    } else if (typeof this !== 'undefined') {
	      this['RouteRecognizer'] = $$route$recognizer$$default;
	    }
	}).call(this);

	//# sourceMappingURL=route-recognizer.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var routerUtil = __webpack_require__(1)

	module.exports = function (Vue, Router) {

	  var p = Router.prototype

	  /**
	   * Register a map of top-level paths.
	   */

	  p.map = function (map) {
	    for (var route in map) {
	      this.on(route, map[route])
	    }
	  }

	  /**
	   * Register a single root-level path
	   *
	   * @param {String} rootPath
	   * @param {Object} handler
	   *                 - {String} component
	   *                 - {Object} [subRoutes]
	   *                 - {Boolean} [forceRefresh]
	   *                 - {Function} [before]
	   *                 - {Function} [after]
	   */

	  p.on = function (rootPath, handler) {
	    if (rootPath === '*') {
	      this._notFound(handler)
	    } else {
	      this._addRoute(rootPath, handler, [])
	    }
	  }

	  /**
	   * Set redirects.
	   *
	   * @param {Object} map
	   */

	  p.redirect = function (map) {
	    for (var path in map) {
	      this._addRedirect(path, map[path])
	    }
	  }

	  /**
	   * Set aliases.
	   *
	   * @param {Object} map
	   */

	  p.alias = function (map) {
	    for (var path in map) {
	      this._addAlias(path, map[path])
	    }
	  }

	  /**
	   * Set global before hook.
	   *
	   * @param {Function} fn
	   */

	  p.beforeEach = function (fn) {
	    this._beforeEachHook = fn
	  }

	  /**
	   * Set global after hook.
	   *
	   * @param {Function} fn
	   */

	  p.afterEach = function (fn) {
	    this._afterEachHook = fn
	  }

	  /**
	   * Navigate to a given path.
	   * The path is assumed to be already decoded, and will
	   * be resolved against root (if provided)
	   *
	   * @param {String} path
	   * @param {Object} [options]
	   */

	  p.go = function (path, options) {
	    var replace = options && options.replace
	    var url, hash
	    if (this._hasPushState) {
	      if (this._history) {
	        url = this._formatPath(path)
	        path = url.replace(/#.*$/, '')
	        var hashMatch = url.match(/#.*$/)
	        hash = hashMatch && hashMatch[0].slice(1)
	      } else {
	        url = this._formatHashPath(path)
	        path = url.replace(/^#!?/, '')
	      }
	      if (replace) {
	        history.replaceState({}, '', url)
	      } else {
	        // record scroll position
	        var pos = {
	          x: window.pageXOffset,
	          y: window.pageYOffset
	        }
	        history.replaceState({ pos: pos }, '', location.href)
	        // actually push new state
	        history.pushState({}, '', url)
	      }
	      this._match(path)
	      // in history mode, scroll to hash anchor
	      if (hash) {
	        Vue.nextTick(function () {
	          var el = document.getElementById(hash)
	          if (el) {
	            window.scrollTo(window.scrollX, el.offsetTop)
	          }
	        })
	      }
	    } else {
	      // just set hash
	      routerUtil.setHash(this._formatHashPath(path), replace)
	    }
	  }

	  /**
	   * Short hand for replacing current path
	   *
	   * @param {String} path
	   */

	  p.replace = function (path) {
	    this.go(path, {
	      replace: true
	    })
	  }

	  /**
	   * Start the router.
	   *
	   * @param {VueConstructor} App
	   * @param {String|Element} container
	   */

	  p.start = function (App, container) {
	    if (this._started) {
	      routerUtil.warn('already started.')
	      return
	    }
	    this._started = true
	    if (!this.app) {
	      if (!App || !container) {
	        throw new Error(
	          'Must start vue-router with a component and a ' +
	          'root container.'
	        )
	      }
	      this._appContainer = container
	      this._appConstructor = typeof App === 'function'
	        ? App
	        : Vue.extend(App)
	    }
	    if (this._hasPushState) {
	      this._initHistoryMode()
	    } else {
	      this._initHashMode()
	    }
	  }

	  /**
	   * Stop listening to route changes.
	   */

	  p.stop = function () {
	    var event = this._history
	      ? 'popstate'
	      : 'hashchange'
	    window.removeEventListener(event, this._onRouteChange)
	    this._started = false
	  }
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var routerUtil = __webpack_require__(1)
	var Route = __webpack_require__(7)

	module.exports = function (Vue, Router) {

	  var p = Router.prototype

	  /**
	   * Initialize HTML5 history mode.
	   */

	  p._initHistoryMode = function () {
	    var self = this
	    this._onRouteChange = function (e) {
	      var url = location.pathname + location.search
	      if (self._history) {
	        url = decodeURI(url)
	        // respet base tag
	        var base = document.querySelector('base')
	        if (base) {
	          url = url.replace(base.getAttribute('href'), '')
	        }
	        self._match(url)
	      } else {
	        // delegate hashbang formatting to router.go
	        self.replace(decodeURI(location.hash))
	      }
	      // restore scroll position if saved
	      var pos = e && e.state && e.state.pos
	      if (pos && self._saveScrollPosition) {
	        Vue.nextTick(function () {
	          window.scrollTo(pos.x, pos.y)
	        })
	      }
	    }
	    window.addEventListener('popstate', this._onRouteChange)
	    this._onRouteChange()
	  }

	  /**
	   * Initialize hash mode.
	   */

	  p._initHashMode = function () {
	    var self = this
	    this._onRouteChange = function () {
	      // format hashbang
	      var hash = location.hash
	      if (self._hashbang && hash && hash.charAt(1) !== '!') {
	        routerUtil.setHash('!' + hash.slice(1), true)
	        return
	      }
	      if (!self._hashbang && hash && hash.charAt(1) === '!') {
	        routerUtil.setHash(hash.slice(2), true)
	        return
	      }
	      hash = hash.replace(/^#!?/, '')
	      var url = hash + location.search
	      url = decodeURI(url)
	      self._match(url)
	    }
	    window.addEventListener('hashchange', this._onRouteChange)
	    this._onRouteChange()
	  }

	  /**
	   * Add a route containing a list of segments to the internal
	   * route recognizer. Will be called recursively to add all
	   * possible sub-routes.
	   *
	   * @param {String} path
	   * @param {Object} handler
	   * @param {Array} segments
	   */

	  p._addRoute = function (path, handler, segments) {
	    guardComponent(handler)
	    segments.push({
	      path: path,
	      handler: handler
	    })
	    this._recognizer.add(segments)
	    if (handler.subRoutes) {
	      for (var subPath in handler.subRoutes) {
	        // default handler
	        if (subPath === '*') {
	          var child = handler.subRoutes[subPath]
	          guardComponent(child)
	          handler.defaultChildHandler = child
	          continue
	        }
	        // recursively walk all sub routes
	        this._addRoute(
	          subPath,
	          handler.subRoutes[subPath],
	          // pass a copy in recursion to avoid mutating
	          // across branches
	          segments.slice()
	        )
	      }
	    }
	  }

	  /**
	   * Set the notFound route handler.
	   *
	   * @param {Object} handler
	   */

	  p._notFound = function (handler) {
	    guardComponent(handler)
	    this._notFoundHandler = [{ handler: handler }]
	  }

	  /**
	   * Add a redirect record.
	   *
	   * @param {String} path
	   * @param {String} redirectPath
	   */

	  p._addRedirect = function (path, redirectPath) {
	    this._addGuard(path, redirectPath, this.replace)
	  }

	  /**
	   * Add an alias record.
	   *
	   * @param {String} path
	   * @param {String} aliasPath
	   */

	  p._addAlias = function (path, aliasPath) {
	    this._addGuard(path, aliasPath, this._match)
	  }

	  /**
	   * Add a path guard.
	   *
	   * @param {String} path
	   * @param {String} mappedPath
	   * @param {Function} handler
	   */

	  p._addGuard = function (path, mappedPath, handler) {
	    var router = this
	    this._guardRecognizer.add([{
	      path: path,
	      handler: function (match) {
	        var realPath = mappedPath
	        if (match.isDynamic) {
	          for (var key in match.params) {
	            realPath = replaceParam(realPath, match, key)
	          }
	        }
	        handler.call(router, realPath)
	      }
	    }])
	  }

	  /**
	   * Replace a param segment with real value in a matched
	   * path.
	   *
	   * @param {String} path
	   * @param {Object} match
	   * @param {String} key
	   * @return {String}
	   */

	  function replaceParam (path, match, key) {
	    var regex = new RegExp(':' + key + '(\\/|$)')
	    var value = match.params[key]
	    return path.replace(regex, function (m) {
	      return m.charAt(m.length - 1) === '/'
	        ? value + '/'
	        : value
	    })
	  }

	  /**
	   * Check if a path matches any redirect records.
	   *
	   * @param {String} path
	   * @return {Boolean} - if true, will skip normal match.
	   */

	  p._checkGuard = function (path) {
	    var matched = this._guardRecognizer.recognize(path)
	    if (matched) {
	      matched[0].handler(matched[0])
	      return true
	    }
	  }

	  /**
	   * Match a URL path and set the route context on vm,
	   * triggering view updates.
	   *
	   * @param {String} path
	   */

	  p._match = function (path) {
	    var self = this

	    if (this._checkGuard(path)) {
	      return
	    }

	    var previousRoute = this._currentRoute
	    if (this.app && path === previousRoute.path) {
	      return
	    }

	    // normalize against root
	    if (
	      this._history &&
	      this._root &&
	      path.indexOf(this._root) === 0
	    ) {
	      path = path.slice(this._root.length)
	    }

	    // construct route context
	    var route = new Route(path, this)

	    // initial render
	    if (!this.app) {
	      // initial render
	      this.app = new this._appConstructor({
	        el: this._appContainer,
	        data: {
	          route: route
	        }
	      })
	    }

	    // check gloal before hook
	    var before = this._beforeEachHook
	    if (before) {
	      routerUtil.callAsyncFn(before, {
	        args: [route, previousRoute],
	        onResolve: function () {
	          self._transition(route, previousRoute)
	        },
	        onReject: function () {
	          self.replace(previousRoute.path)
	        }
	      })
	    } else {
	      self._transition(route, previousRoute)
	    }
	  }

	  /**
	   * Perform a route transition after it is validated.
	   *
	   * @param {Route} route
	   * @param {Route} previousRoute
	   */

	  p._transition = function (route, previousRoute) {

	    if (this.app.route !== route) {
	      this.app.route = route
	      this._children.forEach(function (child) {
	        child.route = route
	      })
	    }

	    // check global after hook
	    if (this._afterEachHook) {
	      this._afterEachHook.call(null, route, previousRoute)
	    }

	    this._currentRoute = route
	  }

	  /**
	   * Format a raw path to an actual URL.
	   *
	   * @param {String} path
	   * @return {String}
	   */

	  p._formatPath = function (path) {
	    return path.charAt(0) === '/'
	      // absolute path
	      ? this._root
	        ? this._root + '/' + path.replace(/^\//, '')
	        : path
	      // relative path
	      : routerUtil.resolvePath(location.pathname, path)
	  }

	  /**
	   * Format a raw path to a hash fragment.
	   *
	   * @param {String} path
	   * @return {String}
	   */

	  p._formatHashPath = function (path) {
	    path = path.replace(/^#!?/, '')
	    var prefix = '#' + (this._hashbang ? '!' : '')
	    return path.charAt(0) === '/'
	      ? prefix + path
	      : prefix + routerUtil.resolvePath(
	          location.hash.replace(/^#!?/, ''),
	          path
	        )
	  }

	  /**
	   * Allow directly passing components to a route
	   * definition.
	   *
	   * @param {Object} handler
	   */

	  function guardComponent (handler) {
	    var comp = handler.component
	    var type = typeof comp
	    if (type !== 'string') {
	      if (type !== 'function') {
	        comp = Vue.extend(comp)
	      }
	      if (!comp.cid) {
	        routerUtil.warn('invalid router component: ' + comp)
	        handler.component = null
	        return
	      }
	      // generate a unique id for the anonymous component
	      // and register it globally
	      var id = 'router-view-' + comp.cid
	      if (!Vue.component(id)) {
	        Vue.component(id, comp)
	      }
	      // overwrite the definition so we don't do this again
	      handler.component = id
	    }
	  }
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	function Route (path, router) {
	  this.path = path
	  var matched = router._recognizer.recognize(path)

	  this.query = matched
	    ? matched.queryParams
	    : {}

	  this.params = matched
	    ? [].reduce.call(matched, function (prev, cur) {
	        if (cur.params) {
	          for (var key in cur.params) {
	            prev[key] = cur.params[key]
	          }
	        }
	        return prev
	      }, {})
	    : {}

	  // private stuff
	  def(this, '_matched', matched || router._notFoundHandler)
	  def(this, '_router', router)
	}

	function def (obj, key, val) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: false
	  })
	}

	module.exports = Route


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var routerUtil = __webpack_require__(1)

	// install the <router-view> element directive
	module.exports = function (Vue) {

	  // insert global css to make sure router-view has
	  // display:block so that transitions work properly
	  __webpack_require__(9)('router-view{display:block;}')

	  var _ = Vue.util
	  var component = Vue.directive('_component')

	  // v-view extends v-component
	  var viewDef = _.extend({}, component)

	  // with some overrides
	  _.extend(viewDef, {

	    _isRouterView: true,

	    bind: function () {
	      // react to route change
	      this.currentRoute = null
	      this.currentComponentId = null
	      this.unwatch = this.vm.$watch(
	        'route',
	        _.bind(this.onRouteChange, this),
	        // important as this makes the watcher execute
	        // in the internal queue instead of the user queue,
	        // so that the callback fires before the view is
	        // affected by the route change.
	        { user: false }
	      )
	      // force dynamic directive so v-component doesn't
	      // attempt to build right now
	      this._isDynamicLiteral = true
	      // finally, init by delegating to v-component
	      component.bind.call(this)
	      // initial render
	      if (this.vm.route) {
	        this.onRouteChange(this.vm.route)
	      }
	    },

	    /**
	     * Route change handler. Check match, segment and before
	     * hook to determine whether this view should be
	     * rendered or switched.
	     *
	     * @param {Route} route
	     */

	    onRouteChange: function (route) {
	      var self = this
	      var previousRoute = this.currentRoute
	      this.currentRoute = route

	      if (!route._matched) {
	        // route not found, this outlet is invalidated
	        return this.invalidate()
	      }

	      // determine handler
	      var handler
	      var depth = getViewDepth(this.vm)
	      var segment = route._matched[depth]
	      if (!segment) {
	        // check if the parent view has a default child view
	        var parent = route._matched[depth - 1]
	        if (parent && parent.handler.defaultChildHandler) {
	          handler = parent.handler.defaultChildHandler
	        } else {
	          // no segment that matches this outlet
	          return this.invalidate()
	        }
	      } else {
	        handler = segment.handler
	      }

	      // trigger component switch
	      var prevPath = previousRoute && previousRoute.path
	      if (route.path !== prevPath) {
	        // call before hook
	        if (handler.before) {
	          routerUtil.callAsyncFn(handler.before, {
	            args: [route, previousRoute],
	            onResolve: transition,
	            onReject: reject
	          })
	        } else {
	          transition()
	        }
	      }

	      function transition () {
	        self.switchView(route, previousRoute, handler)
	      }

	      function reject () {
	        var path = previousRoute
	          ? previousRoute.path
	          : '/'
	        route._router.replace(path)
	      }
	    },

	    /**
	     * Transition from a previous route to a new route.
	     * Handles the async data loading logic, then delegates
	     * to the component directive's setComponent method.
	     *
	     * @param {Route} route
	     * @param {Route} previousRoute
	     * @param {RouteHandler} handler
	     */

	    switchView: function (route, previousRoute, handler) {
	      var self = this
	      var symbol = this.transitionSymbol = {}

	      // The component may have been switched before async
	      // callbacks are called. Make sure the callbacks only
	      // execute when the current directive instance is still
	      // active and current transition is still valid.
	      function onlyWhenValid (fn) {
	        return function () {
	          if (self.vm && self.transitionSymbol === symbol) {
	            fn.apply(this, arguments)
	          }
	        }
	      }

	      var mount = onlyWhenValid(function (data) {
	        self.setComponent(handler.component, data, null, afterTransition)
	      })

	      var afterTransition = onlyWhenValid(function () {
	        if (handler.after) {
	          handler.after(route, previousRoute)
	        }
	      })

	      var setData = onlyWhenValid(function (vm, data) {
	        for (var key in data) {
	          vm.$set(key, data[key])
	        }
	        vm.loading = false
	      })

	      function warnDataError (err) {
	        routerUtil.warn(
	          'failed to load data for route: ' +
	          route.path, err
	        )
	      }

	      // the error handler doesn't need to cancel.
	      function onDataError (err) {
	        warnDataError(err)
	        mount()
	      }

	      // if we are switching into the same component as the
	      // existing one, we only need to update the data and
	      // call after hook.
	      if (
	        this.childVM &&
	        !handler.alwaysRefresh &&
	        handler.component === this.currentComponentId
	      ) {
	        if (handler.data) {
	          var vm = this.childVM
	          vm.loading = true
	          routerUtil.callAsyncFn(handler.data, {
	            args: [route],
	            onResolve: function (data) {
	              setData(vm, data)
	              vm.loading = false
	              if (handler.waitOnData) {
	                afterTransition()
	              }
	            },
	            onReject: warnDataError
	          })
	          if (!handler.waitOnData) {
	            afterTransition()
	          }
	        } else {
	          afterTransition()
	        }
	        return
	      }

	      // switching into a new component.
	      this.currentComponentId = handler.component

	      // call data hook
	      if (handler.data) {
	        if (handler.waitOnData) {
	          routerUtil.callAsyncFn(handler.data, {
	            args: [route],
	            onResolve: mount,
	            onReject: onDataError
	          })
	        } else {
	          // async data loading with possible race condition.
	          // the data may load before the component gets
	          // rendered (due to async components), or it could
	          // be the other way around.
	          var _data, _vm
	          // send out data request...
	          routerUtil.callAsyncFn(handler.data, {
	            args: [route],
	            onResolve: function (data) {
	              if (_vm) {
	                setData(_vm, data)
	              } else {
	                _data = data
	              }
	            },
	            onReject: onDataError
	          })
	          // start the component switch...
	          this.setComponent(handler.component, { loading: true }, function (vm) {
	            if (_data) {
	              setData(vm, _data)
	            } else {
	              _vm = vm
	            }
	          }, afterTransition)
	        }
	      } else {
	        // no data hook, just set component
	        mount()
	      }
	    },

	    /**
	     * Clears the unmatched view.
	     */

	    invalidate: function () {
	      this.currentRoute =
	      this.currentComponentId =
	      this.transitionSymbol = null
	      this.setComponent(null)
	    },

	    unbind: function () {
	      this.unwatch()
	      component.unbind.call(this)
	    }

	  })

	  Vue.elementDirective('router-view', viewDef)

	  //
	  // Helpers
	  //

	  /**
	   * Checked nested view depth of the current view.
	   *
	   * @param {Vue} vm
	   * @return {Number}
	   */

	  function getViewDepth (vm) {
	    var depth = 0
	    while (vm.$parent) {
	      if (vm.$options._isRouterView) {
	        depth++
	      }
	      vm = vm.$parent
	    }
	    return depth
	  }
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	var inserted = {};

	module.exports = function (css, options) {
	    if (inserted[css]) return;
	    inserted[css] = true;
	    
	    var elem = document.createElement('style');
	    elem.setAttribute('type', 'text/css');

	    if ('textContent' in elem) {
	      elem.textContent = css;
	    } else {
	      elem.styleSheet.cssText = css;
	    }
	    
	    var head = document.getElementsByTagName('head')[0];
	    if (options && options.prepend) {
	        head.insertBefore(elem, head.childNodes[0]);
	    } else {
	        head.appendChild(elem);
	    }
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	// install v-link, which provides navigation support for
	// HTML5 history mode

	module.exports = function (Vue) {

	  var _ = Vue.util

	  Vue.directive('link', {

	    isLiteral: true,

	    bind: function () {
	      var vm = this.vm
	      if (!vm.route && _.warn) {
	        _.warn(
	          'v-link can only be used inside a ' +
	          'router-enabled app.'
	        )
	        return
	      }
	      var self = this
	      this.handler = function (e) {
	        if (e.button === 0) {
	          e.preventDefault()
	          if (self.destination != null) {
	            vm.route._router.go(self.destination)
	          }
	        }
	      }
	      this.el.addEventListener('click', this.handler)
	      if (!this._isDynamicLiteral) {
	        this.update(this.expression)
	      }
	    },

	    unbind: function () {
	      this.el.removeEventListener('click', this.handler)
	    },

	    update: function (path) {
	      this.destination = path
	      path = path || ''
	      var router = this.vm.route._router
	      var href = router._history
	        ? path.charAt(0) === '/'
	          // only format the path if it's absolute
	          ? router._formatPath(path)
	          : path
	        : router._formatHashPath(path)
	      if (this.el.tagName === 'A') {
	        if (href) {
	          this.el.href = href
	        } else {
	          this.el.removeAttribute('href')
	        }
	      }
	    }

	  })

	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	// overriding Vue's $addChild method, so that every child
	// instance inherits the route data

	module.exports = function (Vue, Router) {

	  var addChild = Vue.prototype.$addChild

	  Vue.prototype.$addChild = function (opts, Ctor) {

	    var route = this.route
	    var router = route && route._router
	    var isRouterEnabled = router instanceof Router

	    if (isRouterEnabled) {
	      opts = opts || {}
	      var data = opts.data = opts.data || {}
	      data.route = route
	      if (opts._isRouterView) {
	        data.loading = data.loading || false
	      }
	    }

	    var child = addChild.call(this, opts, Ctor)

	    if (isRouterEnabled) {
	      // keep track of all children created so we can
	      // update the routes
	      router._children.push(child)
	      child.$on('hook:beforeDestroy', function () {
	        router._children.$remove(child)
	      })
	    }

	    return child
	  }
	}


/***/ }
/******/ ])
});
;