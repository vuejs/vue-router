/*!
 * vue-router v0.5.0
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
	var Router = __webpack_require__(5)

	/**
	 * Installation interface.
	 * Install the necessary directives.
	 */

	Router.install = function (Vue) {
	  /* istanbul ignore if */
	  if (Router.installed) {
	    routerUtil.warn('already installed.')
	    return
	  }
	  __webpack_require__(9)(Vue, Router)
	  __webpack_require__(10)(Vue, Router)
	  __webpack_require__(14)(Vue)
	  __webpack_require__(15)(Vue)
	  __webpack_require__(16)(Vue)
	  routerUtil.Vue = Vue
	  Router.installed = true
	}

	// auto install
	/* istanbul ignore if */
	if (window.Vue) {
	  Router.install(window.Vue)
	}

	module.exports = Router


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var RouteRecognizer = __webpack_require__(2)
	var genQuery = RouteRecognizer.prototype.generateQueryString

	/**
	 * Warn stuff.
	 *
	 * @param {String} msg
	 * @param {Error} [err]
	 */

	exports.warn = function (msg, err) {
	  /* istanbul ignore next */
	  if (window.console) {
	    console.warn('[vue-router] ' + msg)
	    if (err) {
	      console.warn(err.stack)
	    }
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
	  var query = base.match(/(\?.*)$/)
	  if (query) {
	    query = query[1]
	    base = base.slice(0, -query.length)
	  }
	  // a query!
	  if (relative.charAt(0) === '?') {
	    return base + relative
	  }
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
	 * Forgiving check for a promise
	 *
	 * @param {Object} p
	 * @return {Boolean}
	 */

	exports.isPromise = function (p) {
	  return p &&
	    typeof p.then === 'function'
	}

	/**
	 * Retrive a route config field from a component instance
	 * OR a component contructor.
	 *
	 * @param {Function|Vue} component
	 * @param {String} name
	 * @return {*}
	 */

	exports.getRouteConfig = function (component, name) {
	  var options =
	    component &&
	    (component.$options || component.options)
	  return options &&
	    options.route &&
	    options.route[name]
	}

	/**
	 * Resolve an async component factory. Have to do a dirty
	 * mock here because of Vue core's internal API depends on
	 * an ID check.
	 *
	 * @param {Object} handler
	 * @param {Function} cb
	 */

	var resolver
	exports.resolveAsyncComponent = function (handler, cb) {
	  if (!resolver) {
	    resolver = {
	      resolve: exports.Vue.prototype._resolveComponent,
	      $options: {
	        components: {
	          _: handler.component
	        }
	      }
	    }
	  } else {
	    resolver.$options.components._ = handler.component
	  }
	  resolver.resolve('_', function (Component) {
	    handler.component = Component
	    cb(Component)
	  })
	}

	/**
	 * Map the dynamic segments in a path to params.
	 *
	 * @param {String} path
	 * @param {Object} params
	 * @param {Object} query
	 */

	exports.mapParams = function (path, params, query) {
	  for (var key in params) {
	    path = replaceParam(path, params, key)
	  }
	  if (query) {
	    path += genQuery(query)
	  }
	  return path
	}

	/**
	 * Replace a param segment with real value in a matched
	 * path.
	 *
	 * @param {String} path
	 * @param {Object} params
	 * @param {String} key
	 * @return {String}
	 */

	function replaceParam (path, params, key) {
	  var regex = new RegExp(':' + key + '(\\/|$)')
	  var value = params[key]
	  return path.replace(regex, function (m) {
	    return m.charAt(m.length - 1) === '/'
	      ? value + '/'
	      : value
	  })
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

	    function $$route$recognizer$$parse(route, names, specificity) {
	      // normalize route as not starting with a "/". Recognition will
	      // also normalize.
	      if (route.charAt(0) === "/") { route = route.substr(1); }

	      var segments = route.split("/"), results = [];

	      // A routes has specificity determined by the order that its different segments
	      // appear in. This system mirrors how the magnitude of numbers written as strings
	      // works.
	      // Consider a number written as: "abc". An example would be "200". Any other number written
	      // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
	      // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
	      // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
	      // leading symbol, "1".
	      // The rule is that symbols to the left carry more weight than symbols to the right
	      // when a number is written out as a string. In the above strings, the leading digit
	      // represents how many 100's are in the number, and it carries more weight than the middle
	      // number which represents how many 10's are in the number.
	      // This system of number magnitude works well for route specificity, too. A route written as
	      // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
	      // `x`, irrespective of the other parts.
	      // Because of this similarity, we assign each type of segment a number value written as a
	      // string. We can find the specificity of compound routes by concatenating these strings
	      // together, from left to right. After we have looped through all of the segments,
	      // we convert the string to a number.
	      specificity.val = '';

	      for (var i=0, l=segments.length; i<l; i++) {
	        var segment = segments[i], match;

	        if (match = segment.match(/^:([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$DynamicSegment(match[1]));
	          names.push(match[1]);
	          specificity.val += '3';
	        } else if (match = segment.match(/^\*([^\/]+)$/)) {
	          results.push(new $$route$recognizer$$StarSegment(match[1]));
	          specificity.val += '2';
	          names.push(match[1]);
	        } else if(segment === "") {
	          results.push(new $$route$recognizer$$EpsilonSegment());
	          specificity.val += '1';
	        } else {
	          results.push(new $$route$recognizer$$StaticSegment(segment));
	          specificity.val += '4';
	        }
	      }

	      specificity.val = +specificity.val;

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

	    // Sort the routes by specificity
	    function $$route$recognizer$$sortSolutions(states) {
	      return states.sort(function(a, b) {
	        return b.specificity.val - a.specificity.val;
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
	            specificity = {},
	            handlers = [], allSegments = [], name;

	        var isEmpty = true;

	        for (var i=0, l=routes.length; i<l; i++) {
	          var route = routes[i], names = [];

	          var segments = $$route$recognizer$$parse(route.path, names, specificity);

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
	        currentState.specificity = specificity;

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

	    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.9';

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

	var Recognizer = __webpack_require__(2)
	var historyBackends = {
	  abstract: __webpack_require__(6),
	  hash: __webpack_require__(7),
	  html5: __webpack_require__(8)
	}

	/**
	 * Router constructor
	 *
	 * @param {Object} [options]
	 *                 - {Boolean} hashbang  (default: true)
	 *                 - {Boolean} history (default: false)
	 *                 - {Boolean} abstract (default: false)
	 *                 - {Boolean} saveScrollPosition (default: false)
	 *                 - {Boolean} transitionOnLoad (default: false)
	 *                 - {Boolean} suppressTransitionError (default: false)
	 *                 - {String} root (default: null)
	 *                 - {String} linkActiveClass (default: 'v-link-active')
	 */

	function Router (options) {
	  /* istanbul ignore if */
	  if (!Router.installed) {
	    throw new Error(
	      'Please install the Router with Vue.use() before ' +
	      'creating an instance.'
	    )
	  }

	  options = options || {}

	  // Vue instances
	  this.app = null
	  this._views = []
	  this._children = []

	  // route recognizer
	  this._recognizer = new Recognizer()
	  this._guardRecognizer = new Recognizer()

	  // state
	  this._started = false
	  this._currentRoute = {}
	  this._currentTransition = null
	  this._notFoundHandler = null
	  this._beforeEachHook = null

	  // feature detection
	  this._hasPushState = typeof history !== 'undefined' && history.pushState

	  // trigger transition on initial render?
	  this._rendered = false
	  this._transitionOnLoad = options.transitionOnLoad

	  // history mode
	  this._abstract = !!options.abstract
	  this._hashbang = options.hashbang !== false
	  this._history = !!(this._hasPushState && options.history)

	  // other options
	  this._saveScrollPosition = !!options.saveScrollPosition
	  this._linkActiveClass = options.linkActiveClass || 'v-link-active'
	  this._suppress = !!options.suppressTransitionError

	  // create history object
	  this.mode = this._abstract
	    ? 'abstract'
	    : this._history
	      ? 'html5'
	      : 'hash'

	  var History = historyBackends[this.mode]
	  var self = this
	  this.history = new History({
	    root: options.root,
	    hashbang: this._hashbang,
	    onChange: function (path, state, anchor) {
	      self._match(path, state, anchor)
	    }
	  })
	}

	Router.installed = false
	module.exports = Router


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(1)

	function AbstractHistory (options) {
	  this.onChange = options.onChange
	  this.currentPath = '/'
	}

	var p = AbstractHistory.prototype

	p.start = function () {
	  this.onChange('/')
	}

	p.stop = function () {}

	p.go = function (path) {
	  path = this.currentPath = this.formatPath(path)
	  this.onChange(path)
	}

	p.formatPath = function (path) {
	  return path.charAt(0) === '/'
	    ? path
	    : util.resolvePath(this.currentPath, path)
	}

	module.exports = AbstractHistory


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(1)

	function HashHistory (options) {
	  this.hashbang = options.hashbang
	  this.onChange = options.onChange
	}

	var p = HashHistory.prototype

	p.start = function () {
	  var self = this
	  this.listener = function () {
	    var path = location.hash
	    var formattedPath = self.formatPath(path, true)
	    if (formattedPath !== path) {
	      location.replace(formattedPath)
	      return
	    }
	    var pathToMatch = decodeURI(
	      path.replace(/^#!?/, '') + location.search
	    )
	    self.onChange(pathToMatch)
	  }
	  window.addEventListener('hashchange', this.listener)
	  this.listener()
	}

	p.stop = function () {
	  window.removeEventListener('hashchange', this.listener)
	}

	p.go = function (path, replace) {
	  path = this.formatPath(path)
	  if (replace) {
	    location.replace(path)
	  } else {
	    location.hash = path
	  }
	}

	p.formatPath = function (path, expectAbsolute) {
	  path = path.replace(/^#!?/, '')
	  var isAbsoloute = path.charAt(0) === '/'
	  if (expectAbsolute && !isAbsoloute) {
	    path = '/' + path
	  }
	  var prefix = '#' + (this.hashbang ? '!' : '')
	  return isAbsoloute || expectAbsolute
	    ? prefix + path
	    : prefix + util.resolvePath(
	        location.hash.replace(/^#!?/, ''),
	        path
	      )
	}

	module.exports = HashHistory


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(1)
	var hashRE = /#.*$/

	function HTML5History (options) {
	  var root = options.root
	  if (root) {
	    // make sure there's the starting slash
	    if (root.charAt(0) !== '/') {
	      root = '/' + root
	    }
	    // remove trailing slash
	    this.root = root.replace(/\/$/, '')
	    this.rootRE = new RegExp('^\\' + this.root)
	  } else {
	    this.root = null
	  }
	  this.onChange = options.onChange
	  // check base tag
	  var baseEl = document.querySelector('base')
	  this.base = baseEl && baseEl.getAttribute('href')
	}

	var p = HTML5History.prototype

	p.start = function () {
	  var self = this
	  this.listener = function (e) {
	    var url = decodeURI(location.pathname + location.search)
	    if (this.root) {
	      url = url.replace(this.rootRE, '')
	    }
	    self.onChange(url, e && e.state, location.hash)
	  }
	  window.addEventListener('popstate', this.listener)
	  this.listener()
	}

	p.stop = function () {
	  window.removeEventListener('popstate', this.listener)
	}

	p.go = function (path, replace) {
	  var root = this.root
	  var url = this.formatPath(path, root)
	  if (replace) {
	    history.replaceState({}, '', url)
	  } else {
	    // record scroll position by replacing current state
	    history.replaceState({
	      pos: {
	        x: window.pageXOffset,
	        y: window.pageYOffset
	      }
	    }, '')
	    // then push new state
	    history.pushState({}, '', url)
	  }
	  var hashMatch = path.match(hashRE)
	  var hash = hashMatch && hashMatch[0]
	  path = url
	    // strip hash so it doesn't mess up params
	    .replace(hashRE, '')
	    // remove root before matching
	    .replace(this.rootRE, '')
	  this.onChange(path, null, hash)
	}

	p.formatPath = function (path) {
	  return path.charAt(0) === '/'
	    // absolute path
	    ? this.root
	      ? this.root + '/' + path.replace(/^\//, '')
	      : path
	    : util.resolvePath(this.base || location.pathname, path)
	}

	module.exports = HTML5History


/***/ },
/* 9 */
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
	   * Navigate to a given path.
	   * The path is assumed to be already decoded, and will
	   * be resolved against root (if provided)
	   *
	   * @param {String} path
	   * @param {Boolean} [replace]
	   */

	  p.go = function (path, replace) {
	    this.history.go(path + '', replace)
	  }

	  /**
	   * Short hand for replacing current path
	   *
	   * @param {String} path
	   */

	  p.replace = function (path) {
	    this.go(path, true)
	  }

	  /**
	   * Start the router.
	   *
	   * @param {VueConstructor} App
	   * @param {String|Element} container
	   */

	  p.start = function (App, container) {
	    /* istanbul ignore if */
	    if (this._started) {
	      routerUtil.warn('already started.')
	      return
	    }
	    this._started = true
	    if (!this.app) {
	      /* istanbul ignore if */
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
	    this.history.start()
	  }

	  /**
	   * Stop listening to route changes.
	   */

	  p.stop = function () {
	    this.history.stop()
	    this._started = false
	  }
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var routerUtil = __webpack_require__(1)
	var Route = __webpack_require__(11)
	var RouteTransition = __webpack_require__(12)

	module.exports = function (Vue, Router) {

	  var _ = Vue.util
	  var p = Router.prototype

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
	      handler: function (match, query) {
	        var realPath = routerUtil.mapParams(
	          mappedPath,
	          match.params,
	          query
	        )
	        handler.call(router, realPath)
	      }
	    }])
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
	      matched[0].handler(matched[0], matched.queryParams)
	      return true
	    }
	  }

	  /**
	   * Match a URL path and set the route context on vm,
	   * triggering view updates.
	   *
	   * @param {String} path
	   * @param {Object} [state]
	   * @param {String} [anchor]
	   */

	  p._match = function (path, state, anchor) {
	    var self = this

	    if (this._checkGuard(path)) {
	      return
	    }

	    var prevRoute = this._currentRoute
	    var prevTransition = this._currentTransition

	    // abort ongoing transition
	    if (prevTransition && path !== prevTransition.to.path) {
	      prevTransition.aborted = true
	    }

	    // do nothing if going to the same route.
	    // the route only changes when a transition successfully
	    // reaches activation; we don't need to do anything
	    // if an ongoing transition is aborted during validation
	    // phase.
	    if (prevTransition && path === prevRoute.path) {
	      return
	    }

	    // construct new route and transition context
	    var route = new Route(path, this)
	    var transition = this._currentTransition =
	      new RouteTransition(this, route, prevRoute)

	    if (!this.app) {
	      // initial render
	      this.app = new this._appConstructor({
	        el: this._appContainer,
	        _meta: {
	          $route: route
	        }
	      })
	    }

	    // check global before hook
	    var before = this._beforeEachHook
	    var startTransition = function () {
	      transition.start(function () {
	        self._postTransition(route, state, anchor)
	      })
	    }

	    if (before) {
	      transition.callHook(before, null, startTransition, true)
	    } else {
	      startTransition()
	    }

	    // HACK:
	    // set rendered to true after the transition start, so
	    // that components that are acitvated synchronously know
	    // whether it is the initial render.
	    this._rendered = true
	  }

	  /**
	   * Switch the current route to a new one.
	   * This is called by the transition object when the
	   * validation of a route has succeeded.
	   *
	   * @param {Route} route
	   */

	  p._updateRoute = function (route) {
	    this._currentRoute = route
	    // update route context for all children
	    if (this.app.$route !== route) {
	      this.app.$route = route
	      this._children.forEach(function (child) {
	        child.$route = route
	      })
	    }
	  }

	  /**
	   * Handle stuff after the transition.
	   *
	   * @param {Route} route
	   * @param {Object} [state]
	   * @param {String} [anchor]
	   */

	  p._postTransition = function (route, state, anchor) {
	    // handle scroll positions
	    // saved scroll positions take priority
	    // then we check if the path has an anchor
	    var pos = state && state.pos
	    if (pos && this._saveScrollPosition) {
	      Vue.nextTick(function () {
	        window.scrollTo(pos.x, pos.y)
	      })
	    } else if (anchor) {
	      Vue.nextTick(function () {
	        var el = document.getElementById(anchor.slice(1))
	        if (el) {
	          window.scrollTo(window.scrollX, el.offsetTop)
	        }
	      })
	    }
	  }

	  /**
	   * Allow directly passing components to a route
	   * definition.
	   *
	   * @param {Object} handler
	   */

	  function guardComponent (handler) {
	    var comp = handler.component
	    if (_.isPlainObject(comp)) {
	      comp = handler.component = Vue.extend(comp)
	    }
	    /* istanbul ignore if */
	    if (typeof comp !== 'function') {
	      handler.component = null
	      routerUtil.warn(
	        'invalid component for route "' + handler.path + '"'
	      )
	    }
	  }
	}


/***/ },
/* 11 */
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
	  this._aborted = false
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(1)
	var pipeline = __webpack_require__(13)

	/**
	 * A Transition object manages the pipeline of a
	 * router-view switching process. This is also the object
	 * passed into user route hooks.
	 *
	 * @param {Router} router
	 * @param {Route} to
	 * @param {Route} from
	 */

	function Transition (router, to, from) {
	  this.router = router
	  this.to = to
	  this.from = from
	  this.next = null
	  this.aborted = false

	  // start by determine the queues

	  // the deactivate queue is an array of router-view
	  // directive instances that need to be deactivated,
	  // deepest first.
	  this.deactivateQueue = router._views

	  // check the default handler of the deepest match
	  var matched = to._matched
	    ? Array.prototype.slice.call(to._matched)
	    : []
	  var deepest = matched[matched.length - 1]
	  if (deepest && deepest.handler.defaultChildHandler) {
	    matched.push({
	      handler: deepest.handler.defaultChildHandler
	    })
	  }

	  // the activate queue is an array of route handlers
	  // that need to be activated
	  this.activateQueue = matched.map(function (match) {
	    return match.handler
	  })
	}

	var p = Transition.prototype

	/**
	 * Abort current transition and return to previous location.
	 */

	p.abort = function () {
	  if (!this.aborted) {
	    this.aborted = true
	    this.router.replace(this.from.path || '/')
	  }
	}

	/**
	 * Abort current transition and redirect to a new location.
	 *
	 * @param {String} path
	 */

	p.redirect = function (path) {
	  if (!this.aborted) {
	    this.aborted = true
	    path = util.mapParams(path, this.to.params, this.to.query)
	    this.router.replace(path)
	  }
	}

	/**
	 * A router view transition's pipeline can be described as
	 * follows, assuming we are transitioning from an existing
	 * <router-view> chain [Component A, Component B] to a new
	 * chain [Component A, Component C]:
	 *
	 *  A    A
	 *  | => |
	 *  B    C
	 *
	 * 1. Reusablity phase:
	 *   -> canReuse(A, A)
	 *   -> canReuse(B, C)
	 *   -> determine new queues:
	 *      - deactivation: [B]
	 *      - activation: [C]
	 *
	 * 2. Validation phase:
	 *   -> canDeactivate(B)
	 *   -> canActivate(C)
	 *
	 * 3. Activation phase:
	 *   -> deactivate(B)
	 *   -> activate(C)
	 *
	 * Each of these steps can be asynchronous, and any
	 * step can potentially abort the transition.
	 *
	 * @param {Function} cb
	 */

	p.start = function (cb) {
	  var transition = this
	  var daq = this.deactivateQueue
	  var aq = this.activateQueue
	  var rdaq = daq.slice().reverse()
	  var reuseQueue

	  // check reusability
	  for (var i = 0; i < rdaq.length; i++) {
	    if (!pipeline.canReuse(rdaq[i], aq[i], transition)) {
	      break
	    }
	  }
	  if (i > 0) {
	    reuseQueue = rdaq.slice(0, i)
	    daq = rdaq.slice(i).reverse()
	    aq = aq.slice(i)
	  }

	  transition.runQueue(daq, pipeline.canDeactivate, function canActivatePhase () {
	    transition.runQueue(aq, pipeline.canActivate, function deactivatePhase () {
	      transition.runQueue(daq, pipeline.deactivate, function activatePhase () {
	        // Validation phase is now over! The new route is valid.

	        // Update router current route
	        transition.router._updateRoute(transition.to)

	        // trigger reuse for all reused views
	        reuseQueue && reuseQueue.forEach(function (view) {
	          pipeline.reuse(view, transition)
	        })

	        // the root of the chain that needs to be replaced
	        // is the top-most non-reusable view.
	        if (daq.length) {
	          var view = daq[daq.length - 1]
	          var depth = reuseQueue ? reuseQueue.length : 0
	          pipeline.activate(view, transition, depth, cb)
	        } else {
	          cb()
	        }
	      })
	    })
	  })
	}

	/**
	 * Asynchronously and sequentially apply a function to a
	 * queue.
	 *
	 * @param {Array} queue
	 * @param {Function} fn
	 * @param {Function} cb
	 */

	p.runQueue = function (queue, fn, cb) {
	  var transition = this
	  step(0)
	  function step (index) {
	    if (index >= queue.length) {
	      cb()
	    } else {
	      fn(queue[index], transition, function nextStep () {
	        step(index + 1)
	      })
	    }
	  }
	}

	/**
	 * Call a user provided route transition hook and handle
	 * the response (e.g. if the user returns a promise).
	 *
	 * @param {Function} hook
	 * @param {*} [context]
	 * @param {Function} [cb]
	 * @param {Boolean} [expectBoolean]
	 * @param {Function} [cleanup]
	 */

	p.callHook = function (hook, context, cb, expectBoolean, cleanup) {
	  var transition = this
	  var nextCalled = false

	  var next = function (data) {
	    if (nextCalled) {
	      util.warn('transition.next() should be called only once.')
	      return
	    }
	    nextCalled = true
	    if (!cb || transition.aborted) {
	      return
	    }
	    cb(data)
	  }

	  var abort = function () {
	    cleanup && cleanup()
	    transition.abort()
	  }

	  var onError = function (err) {
	    // cleanup indicates an after-activation hook,
	    // so instead of aborting we just let the transition
	    // finish.
	    cleanup ? next() : abort()
	    if (err && !transition.router._suppress) {
	      util.warn('Uncaught error during transition: ')
	      throw err instanceof Error ? err : new Error(err)
	    }
	  }

	  // the copied transition object passed to the user.
	  var exposed = {
	    to: transition.to,
	    from: transition.from,
	    abort: abort,
	    next: next,
	    redirect: function () {
	      transition.redirect.apply(transition, arguments)
	    }
	  }
	  var res
	  try {
	    res = hook.call(context, exposed)
	  } catch (err) {
	    return onError(err)
	  }
	  var promise = util.isPromise(res)
	  if (expectBoolean) {
	    if (typeof res === 'boolean') {
	      res ? next() : abort()
	    } else if (promise) {
	      res.then(function (ok) {
	        ok ? next() : abort()
	      }, onError)
	    }
	  } else if (promise) {
	    res.then(next, onError)
	  }
	}

	module.exports = Transition


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(1)

	/**
	 * Determine the reusability of an existing router view.
	 *
	 * @param {Directive} view
	 * @param {Object} handler
	 * @param {Transition} transition
	 */

	exports.canReuse = function (view, handler, transition) {
	  var component = view.childVM
	  if (!component || !handler) {
	    return false
	  }
	  // important: check view.Component here because it may
	  // have been changed in activate hook
	  if (view.Component !== handler.component) {
	    return false
	  }
	  var canReuseFn = util.getRouteConfig(component, 'canReuse')
	  return typeof canReuseFn === 'boolean'
	    ? canReuseFn
	    : canReuseFn
	      ? canReuseFn.call(component, {
	          to: transition.to,
	          from: transition.from
	        })
	      : true // defaults to true
	}

	/**
	 * Check if a component can deactivate.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	exports.canDeactivate = function (view, transition, next) {
	  var fromComponent = view.childVM
	  var hook = util.getRouteConfig(fromComponent, 'canDeactivate')
	  if (!hook) {
	    next()
	  } else {
	    transition.callHook(hook, fromComponent, next, true)
	  }
	}

	/**
	 * Check if a component can activate.
	 *
	 * @param {Object} handler
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	exports.canActivate = function (handler, transition, next) {
	  util.resolveAsyncComponent(handler, function (Component) {
	    // have to check due to async-ness
	    if (transition.aborted) {
	      return
	    }
	    // determine if this component can be activated
	    var hook = util.getRouteConfig(Component, 'canActivate')
	    if (!hook) {
	      next()
	    } else {
	      transition.callHook(hook, null, next, true)
	    }
	  })
	}

	/**
	 * Call deactivate hooks for existing router-views.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Function} next
	 */

	exports.deactivate = function (view, transition, next) {
	  var component = view.childVM
	  var hook = util.getRouteConfig(component, 'deactivate')
	  if (!hook) {
	    next()
	  } else {
	    transition.callHook(hook, component, next)
	  }
	}

	/**
	 * Activate / switch component for a router-view.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 * @param {Number} depth
	 * @param {Function} [cb]
	 */

	exports.activate = function (view, transition, depth, cb) {
	  var handler = transition.activateQueue[depth]
	  if (!handler) {
	    view.setComponent(null)
	    cb && cb()
	    return
	  }

	  var Component = view.Component = handler.component
	  var activateHook = util.getRouteConfig(Component, 'activate')
	  var dataHook = util.getRouteConfig(Component, 'data')
	  var waitForData = util.getRouteConfig(Component, 'waitForData')

	  // unbuild current component. this step also destroys
	  // and removes all nested child views.
	  view.unbuild(true)
	  // build the new component. this will also create the
	  // direct child view of the current one. it will register
	  // itself as view.childView.
	  var component = view.build({
	    _meta: {
	      $loadingRouteData: !!(dataHook && !waitForData)
	    }
	  })

	  // cleanup the component in case the transition is aborted
	  // before the component is ever inserted.
	  var cleanup = function () {
	    component.$destroy()
	  }

	  // actually insert the component and trigger transition
	  var insert = function () {
	    var router = transition.router
	    if (router._rendered || router._transitionOnLoad) {
	      view.transition(component)
	    } else {
	      // no transition on first render, manual transition
	      view.setCurrent(component)
	      component.$before(view.anchor, null, false)
	    }
	    cb && cb()
	  }

	  // called after activation hook is resolved
	  var afterActivate = function () {
	    // activate the child view
	    if (view.childView) {
	      exports.activate(view.childView, transition, depth + 1)
	    }
	    if (dataHook && waitForData) {
	      // wait until data loaded to insert
	      loadData(component, transition, dataHook, insert, cleanup)
	    } else {
	      // load data and insert at the same time
	      if (dataHook) {
	        loadData(component, transition, dataHook)
	      }
	      insert()
	    }
	  }

	  if (activateHook) {
	    transition.callHook(activateHook, component, afterActivate, false, cleanup)
	  } else {
	    afterActivate()
	  }
	}

	/**
	 * Reuse a view, just reload data if necessary.
	 *
	 * @param {Directive} view
	 * @param {Transition} transition
	 */

	exports.reuse = function (view, transition) {
	  var component = view.childVM
	  var dataHook = util.getRouteConfig(component, 'data')
	  if (dataHook) {
	    loadData(component, transition, dataHook)
	  }
	}

	/**
	 * Asynchronously load and apply data to component.
	 *
	 * @param {Vue} component
	 * @param {Transition} transition
	 * @param {Function} hook
	 * @param {Function} cb
	 * @param {Function} cleanup
	 */

	function loadData (component, transition, hook, cb, cleanup) {
	  component.$loadingRouteData = true
	  transition.callHook(hook, component, function (data) {
	    for (var key in data) {
	      component.$set(key, data[key])
	    }
	    component.$loadingRouteData = false
	    cb && cb(data)
	  }, false, cleanup)
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (Vue) {

	  var _ = Vue.util
	  var util = __webpack_require__(1)
	  var componentDef = Vue.directive('_component')

	  // <router-view> extends the internal component directive
	  var viewDef = _.extend({}, componentDef)

	  // with some overrides
	  _.extend(viewDef, {

	    _isRouterView: true,

	    bind: function () {
	      var route = this.vm.$route
	      /* istanbul ignore if */
	      if (!route) {
	        util.warn(
	          '<router-view> can only be used inside a ' +
	          'router-enabled app.'
	        )
	        return
	      }
	      // force dynamic directive so v-component doesn't
	      // attempt to build right now
	      this._isDynamicLiteral = true
	      // finally, init by delegating to v-component
	      componentDef.bind.call(this)
	      // does not support keep-alive.
	      /* istanbul ignore if */
	      if (this.keepAlive) {
	        this.keepAlive = false
	        util.warn('<router-view> does not support keep-alive.')
	      }

	      // all we need to do here is registering this view
	      // in the router. actual component switching will be
	      // managed by the pipeline.
	      var router = this.router = route._router
	      router._views.unshift(this)

	      // note the views are in reverse order.
	      var parentView = router._views[1]
	      if (parentView) {
	        // register self as a child of the parent view,
	        // instead of activating now. This is so that the
	        // child's activate hook is called after the
	        // parent's has resolved.
	        parentView.childView = this
	      }
	    },

	    unbind: function () {
	      this.router._views.$remove(this)
	      componentDef.unbind.call(this)
	    }
	  })

	  Vue.elementDirective('router-view', viewDef)
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// install v-link, which provides navigation support for
	// HTML5 history mode

	module.exports = function (Vue) {

	  var _ = Vue.util
	  var routerUtil = __webpack_require__(1)

	  Vue.directive('link', {

	    isLiteral: true,

	    bind: function () {
	      var vm = this.vm
	      /* istanbul ignore if */
	      if (!vm.$route) {
	        routerUtil.warn(
	          'v-link can only be used inside a ' +
	          'router-enabled app.'
	        )
	        return
	      }
	      var self = this
	      var router = vm.$route._router
	      this.handler = function (e) {
	        if (e.button === 0) {
	          e.preventDefault()
	          if (self.destination != null) {
	            router.go(self.destination)
	          }
	        }
	      }
	      this.el.addEventListener('click', this.handler)
	      if (!this._isDynamicLiteral) {
	        this.update(this.expression)
	      }
	      // manage active link class
	      this.unwatch = vm.$watch(
	        '$route.path',
	        _.bind(this.updateClasses, this)
	      )
	    },

	    updateClasses: function (path) {
	      var el = this.el
	      var dest = this.destination
	      var router = this.vm.$route._router
	      var activeClass = router._linkActiveClass
	      var exactClass = activeClass + '-exact'
	      if (path.indexOf(dest) === 0) {
	        _.addClass(el, activeClass)
	      } else {
	        _.removeClass(el, activeClass)
	      }
	      if (path === dest) {
	        _.addClass(el, exactClass)
	      } else {
	        _.removeClass(el, exactClass)
	      }
	    },

	    update: function (path) {
	      this.destination = path
	      this.updateClasses(this.vm.$route.path)
	      path = path || ''
	      var router = this.vm.$route._router
	      var isAbsolute = path.charAt(0) === '/'
	      // do not format non-hash relative paths
	      var href = router.mode === 'hash' || isAbsolute
	        ? router.history.formatPath(path)
	        : path
	      if (this.el.tagName === 'A') {
	        if (href) {
	          this.el.href = href
	        } else {
	          this.el.removeAttribute('href')
	        }
	      }
	    },

	    unbind: function () {
	      this.el.removeEventListener('click', this.handler)
	      this.unwatch && this.unwatch()
	    }
	  })
	}


/***/ },
/* 16 */
/***/ function(module, exports) {

	// overriding Vue's $addChild method, so that every child
	// instance inherits the route data

	module.exports = function (Vue) {

	  var addChild = Vue.prototype.$addChild

	  Vue.prototype.$addChild = function (opts, Ctor) {

	    var route = this.$route
	    var router = route && route._router

	    // inject meta
	    if (router) {
	      opts = opts || {}
	      var meta = opts._meta = opts._meta || {}
	      meta.$route = route
	      if (opts._isRouterView) {
	        meta.$loadingRouteData = meta.$loadingRouteData || false
	      }
	    }

	    var child = addChild.call(this, opts, Ctor)

	    if (router) {
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