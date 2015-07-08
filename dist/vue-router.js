/**
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

	var Recognizer = __webpack_require__(3)
	var hasPushState = history && history.pushState

	/**
	 * Router constructor
	 *
	 * @param {Object} [options]
	 *                 - {String} root
	 *                 - {Boolean} hashbang  (default: true)
	 *                 - {Boolean} pushstate (default: false)
	 */

	function VueRouter (options) {
	  this._recognizer = new Recognizer()
	  this._started = false
	  this._vm = null
	  this._currentPath = null
	  this._notfoundHandler = null
	  this._root = null
	  var root = options && options.root
	  if (root) {
	    // make sure there's the starting slash
	    if (root.charAt(0) !== '/') {
	      root = '/' + root
	    }
	    // remove trailing slash
	    this._root = root.replace(/\/$/, '')
	  }
	  this._hashbang = !(options && options.hashbang === false)
	  this._pushstate = !!(hasPushState && options && options.pushstate)
	}

	var p = VueRouter.prototype

	//
	// Public API
	//
	//

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
	 * @param {Object} config
	 *                 - {String} component
	 *                 - {Object} [subRoutes]
	 *                 - {Boolean} [forceRefresh]
	 *                 - {Function} [before]
	 *                 - {Function} [after]
	 */

	p.on = function (rootPath, config) {
	  if (rootPath === '*') {
	    this.notfound(config)
	  } else {
	    this._addRoute(rootPath, config, [])
	  }
	}

	/**
	 * Set the notfound route config.
	 *
	 * @param {Object} config
	 */

	p.notfound = function (config) {
	  this._notfoundHandler = [{ handler: config }]
	}

	/**
	 * Set redirects.
	 *
	 * @param {Object} map
	 */

	p.redirect = function (map) {
	  // TODO
	  // use another recognizer to recognize redirects
	}

	/**
	 * Navigate to a given path.
	 * The path is assumed to be already decoded, and will
	 * be resolved against root (if provided)
	 *
	 * @param {String} path
	 */

	p.go = function (path) {
	  if (this._pushstate) {
	    // make it relative to root
	    path = this._root
	      ? this._root + '/' + path.replace(/^\//, '')
	      : path
	    history.pushState({}, '', path)
	    this._match(path)
	  } else {
	    path = path.replace(/^#!?/, '')
	    location.hash = this._hashbang
	      ? '!' + path
	      : path
	  }
	}

	/**
	 * Start the router.
	 *
	 * @param {Vue} vm
	 */

	p.start = function (vm) {
	  if (this._started) {
	    return
	  }
	  this._started = true
	  this._vm = this._vm || vm
	  if (!this._vm) {
	    throw new Error(
	      'vue-router must be started with a root Vue instance.'
	    )
	  }
	  if (this._pushstate) {
	    this.initHistoryMode()
	  } else {
	    this.initHashMode()
	  }
	}

	/**
	 * Initialize hash mode.
	 */

	p.initHashMode = function () {
	  var self = this
	  this.onRouteChange = function () {
	    // format hashbang
	    if (
	      self._hashbang &&
	      location.hash &&
	      location.hash.charAt(1) !== '!'
	    ) {
	      location.hash = '!' + location.hash.slice(1)
	      return
	    }
	    var hash = location.hash.replace(/^#!?/, '')
	    var url = hash + location.search
	    url = decodeURI(url)
	    self._match(url)
	  }
	  window.addEventListener('hashchange', this.onRouteChange)
	  this.onRouteChange()
	}

	/**
	 * Initialize HTML5 history mode.
	 */

	p.initHistoryMode = function () {
	  var self = this
	  this.onRouteChange = function () {
	    var url = location.pathname + location.search
	    url = decodeURI(url)
	    self._match(url)
	  }
	  window.addEventListener('popstate', this.onRouteChange)
	  this.onRouteChange()
	}

	/**
	 * Stop listening to route changes.
	 */

	p.stop = function () {
	  var event = this._pushstate
	    ? 'popstate'
	    : 'hashchange'
	  window.removeEventListener(event, this.onRouteChange)
	  this._vm.route = null
	  this._started = false
	}

	//
	// Private Methods
	//

	/**
	 * Add a route containing a list of segments to the internal
	 * route recognizer. Will be called recursively to add all
	 * possible sub-routes.
	 *
	 * @param {String} path
	 * @param {Object} config
	 * @param {Array} segments
	 */
	p._addRoute = function (path, config, segments) {
	  segments.push({
	    path: path,
	    handler: config
	  })
	  this._recognizer.add(segments)
	  if (config.subRoutes) {
	    for (var subPath in config.subRoutes) {
	      // recursively walk all sub routes
	      this._addRoute(
	        subPath,
	        config.subRoutes[subPath],
	        // pass a copy in recursion to avoid mutating
	        // across branches
	        segments.slice()
	      )
	    }
	  }
	}

	/**
	 * Match a URL path and set the route context on vm,
	 * triggering view updates.
	 *
	 * @param {String} path
	 */
	p._match = function (path) {
	  if (path === this._currentPath) {
	    return
	  }
	  this._currentPath = path
	  // normalize against root
	  if (
	    this._pushstate &&
	    this._root &&
	    path.indexOf(this._root) === 0
	  ) {
	    path = path.slice(this._root.length)
	  }
	  var matched = this._recognizer.recognize(path)
	  // aggregate params
	  var params
	  if (matched) {
	    params = [].reduce.call(matched, function (prev, cur) {
	      if (cur.params) {
	        for (var key in cur.params) {
	          prev[key] = cur.params[key]
	        }
	      }
	      return prev
	    }, {})
	  }
	  // construct route context
	  var context = {
	    path: path,
	    params: params,
	    query: matched && matched.queryParams,
	    _matched: matched || this._notfoundHandler,
	    _matchedCount: 0,
	    _router: this
	  }
	  this._vm.$set('route', context)
	}

	/**
	 * Installation interface.
	 * Install the necessary directives.
	 */

	VueRouter.install = function (Vue) {
	  __webpack_require__(1)(Vue)
	  __webpack_require__(2)(Vue)
	}

	module.exports = VueRouter

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// install the v-view directive

	module.exports = function (Vue) {

	  // insert global css to make sure router-view has
	  // display:block so that transitions work properly
	  __webpack_require__(4)('router-view{display:block;}')

	  var _ = Vue.util
	  var component = Vue.directive('_component')
	  var templateParser = Vue.parsers.template

	  // v-view extends v-component
	  var viewDef = _.extend({}, component)

	  // with some overrides
	  _.extend(viewDef, {

	    bind: function () {
	      // react to route change
	      this.currentRoute = null
	      this.currentComponentId = null
	      this.onRouteChange = _.bind(this.onRouteChange, this)
	      this.unwatch = this.vm.$watch('route', this.onRouteChange)
	      // force dynamic directive so v-component doesn't
	      // attempt to build right now
	      this._isDynamicLiteral = true
	      // finally, init by delegating to v-component
	      component.bind.call(this)
	      if (this.vm.route) {
	        this.onRouteChange(this.vm.route)
	      }
	    },

	    onRouteChange: function (route) {
	      this.currentRoute = route
	      if (!route._matched) {
	        // route not found, this outlet is invalidated
	        return this.invalidate()
	      }
	      var segment = route._matched[route._matchedCount]
	      if (!segment) {
	        // no segment that matches this outlet
	        return this.invalidate()
	      }
	      // mutate the route as we pass it further down the
	      // chain. this series of mutation is done exactly once
	      // for every route as we match the components to render.
	      route._matchedCount++
	      // trigger component switch
	      if (segment.handler.component !== this.currentComponentId ||
	          segment.handler.alwaysRefresh) {
	        // TODO: handle before/after hooks
	        this.currentComponentId = segment.handler.component
	        this.update(segment.handler.component)
	      } else if (this.childVM) {
	        // update route context
	        this.childVM.route = route
	      }
	    },

	    invalidate: function () {
	      this.currentComponentId = null
	      this.update(null)
	    },

	    // currently duplicating some logic from v-component
	    // TODO: make it cleaner
	    build: function () {
	      var route = this.currentRoute
	      if (this.keepAlive) {
	        var cached = this.cache[this.ctorId]
	        if (cached) {
	          cached.route = route
	          return cached
	        }
	      }
	      var vm = this.vm
	      var el = templateParser.clone(this.el)
	      if (this.Ctor) {
	        var child = vm.$addChild({
	          el: el,
	          template: this.template,
	          _asComponent: true,
	          _host: this._host,
	          data: {
	            route: route
	          }
	        }, this.Ctor)
	        if (this.keepAlive) {
	          this.cache[this.ctorId] = child
	        }
	        return child
	      }
	    },

	    unbind: function () {
	      this.unwatch()
	    }

	  })

	  Vue.elementDirective('router-view', viewDef)
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// install v-link, which provides navigation support for
	// HTML5 history mode

	module.exports = function (Vue) {

	  Vue.directive('link', {

	    bind: function () {
	      var vm = this.vm
	      var href = this.expression
	      if (this.el.tagName === 'A') {
	        this.el.href = href
	      }
	      this.handler = function (e) {
	        e.preventDefault()
	        vm.route._router.go(href)
	      }
	      this.el.addEventListener('click', this.handler)
	    },

	    unbind: function () {
	      this.el.removeEventListener('click', this.handler)
	    }

	  })

	}

/***/ },
/* 3 */
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
	    if ("function" === 'function' && __webpack_require__(5)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return $$route$recognizer$$default; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = $$route$recognizer$$default;
	    } else if (typeof this !== 'undefined') {
	      this['RouteRecognizer'] = $$route$recognizer$$default;
	    }
	}).call(this);

	//# sourceMappingURL=route-recognizer.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ }
/******/ ])
});
;