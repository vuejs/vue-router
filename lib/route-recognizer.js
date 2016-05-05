import map from './dsl'

var specials = [
  '/', '.', '*', '+', '?', '|',
  '(', ')', '[', ']', '{', '}', '\\'
]

var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g')

var noWarning = false
function warn (msg) {
  if (!noWarning && typeof console !== 'undefined') {
    console.error('[vue-router] ' + msg)
  }
}

function tryDecode (uri, asComponent) {
  try {
    return asComponent
      ? decodeURIComponent(uri)
      : decodeURI(uri)
  } catch (e) {
    warn('malformed URI' + (asComponent ? ' component: ' : ': ') + uri)
  }
}

function isArray(test) {
  return Object.prototype.toString.call(test) === "[object Array]"
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

function StaticSegment(string) { this.string = string }
StaticSegment.prototype = {
  eachChar: function(callback) {
    var string = this.string, ch

    for (var i=0, l=string.length; i<l; i++) {
      ch = string.charAt(i)
      callback({ validChars: ch })
    }
  },

  regex: function() {
    return this.string.replace(escapeRegex, '\\$1')
  },

  generate: function() {
    return this.string
  }
}

function DynamicSegment(name) { this.name = name }
DynamicSegment.prototype = {
  eachChar: function(callback) {
    callback({ invalidChars: "/", repeat: true })
  },

  regex: function() {
    return "([^/]+)"
  },

  generate: function(params) {
    var val = params[this.name]
    return val == null ? ":" + this.name : val
  }
}

function StarSegment(name) { this.name = name }
StarSegment.prototype = {
  eachChar: function(callback) {
    callback({ invalidChars: "", repeat: true })
  },

  regex: function() {
    return "(.+)"
  },

  generate: function(params) {
    var val = params[this.name]
    return val == null ? ":" + this.name : val
  }
}

function EpsilonSegment() {}
EpsilonSegment.prototype = {
  eachChar: function() {},
  regex: function() { return "" },
  generate: function() { return "" }
}

function parse(route, names, specificity) {
  // normalize route as not starting with a "/". Recognition will
  // also normalize.
  if (route.charAt(0) === "/") { route = route.substr(1) }

  var segments = route.split("/"), results = []

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
  specificity.val = ''

  for (var i=0, l=segments.length; i<l; i++) {
    var segment = segments[i], match

    if (match = segment.match(/^:([^\/]+)$/)) {
      results.push(new DynamicSegment(match[1]))
      names.push(match[1])
      specificity.val += '3'
    } else if (match = segment.match(/^\*([^\/]+)$/)) {
      results.push(new StarSegment(match[1]))
      specificity.val += '2'
      names.push(match[1])
    } else if(segment === "") {
      results.push(new EpsilonSegment())
      specificity.val += '1'
    } else {
      results.push(new StaticSegment(segment))
      specificity.val += '4'
    }
  }

  specificity.val = +specificity.val

  return results
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

function State(charSpec) {
  this.charSpec = charSpec
  this.nextStates = []
}

State.prototype = {
  get: function(charSpec) {
    var nextStates = this.nextStates

    for (var i=0, l=nextStates.length; i<l; i++) {
      var child = nextStates[i]

      var isEqual = child.charSpec.validChars === charSpec.validChars
      isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars

      if (isEqual) { return child }
    }
  },

  put: function(charSpec) {
    var state

    // If the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(charSpec)) { return state }

    // Make a new state for the character spec
    state = new State(charSpec)

    // Insert the new state as a child of the current state
    this.nextStates.push(state)

    // If this character specification repeats, insert the new state as a child
    // of itself. Note that this will not trigger an infinite loop because each
    // transition during recognition consumes a character.
    if (charSpec.repeat) {
      state.nextStates.push(state)
    }

    // Return the new state
    return state
  },

  // Find a list of child states matching the next character
  match: function(ch) {
    // DEBUG "Processing `" + ch + "`:"
    var nextStates = this.nextStates,
        child, charSpec, chars

    // DEBUG "  " + debugState(this)
    var returned = []

    for (var i=0, l=nextStates.length; i<l; i++) {
      child = nextStates[i]

      charSpec = child.charSpec

      if (typeof (chars = charSpec.validChars) !== 'undefined') {
        if (chars.indexOf(ch) !== -1) { returned.push(child) }
      } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
        if (chars.indexOf(ch) === -1) { returned.push(child) }
      }
    }

    return returned
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
}

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
function sortSolutions(states) {
  return states.sort(function(a, b) {
    return b.specificity.val - a.specificity.val
  })
}

function recognizeChar(states, ch) {
  var nextStates = []

  for (var i=0, l=states.length; i<l; i++) {
    var state = states[i]

    nextStates = nextStates.concat(state.match(ch))
  }

  return nextStates
}

var oCreate = Object.create || function(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}

function RecognizeResults(queryParams) {
  this.queryParams = queryParams || {}
}
RecognizeResults.prototype = oCreate({
  splice: Array.prototype.splice,
  slice:  Array.prototype.slice,
  push:   Array.prototype.push,
  length: 0,
  queryParams: null
})

function findHandler(state, path, queryParams) {
  var handlers = state.handlers, regex = state.regex
  var captures = path.match(regex), currentCapture = 1
  var result = new RecognizeResults(queryParams)

  for (var i=0, l=handlers.length; i<l; i++) {
    var handler = handlers[i], names = handler.names, params = {}

    for (var j=0, m=names.length; j<m; j++) {
      params[names[j]] = captures[currentCapture++]
    }

    result.push({ handler: handler.handler, params: params, isDynamic: !!names.length })
  }

  return result
}

function addSegment(currentState, segment) {
  segment.eachChar(function(ch) {
    var state

    currentState = currentState.put(ch)
  })

  return currentState
}

function decodeQueryParamPart(part) {
  // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
  part = part.replace(/\+/gm, '%20')
  return tryDecode(part, true)
}

// The main interface

var RouteRecognizer = function() {
  this.rootState = new State()
  this.names = {}
}


RouteRecognizer.prototype = {
  add: function(routes, options) {
    var currentState = this.rootState, regex = "^",
        specificity = {},
        handlers = [], allSegments = [], name

    var isEmpty = true

    for (var i=0, l=routes.length; i<l; i++) {
      var route = routes[i], names = []

      var segments = parse(route.path, names, specificity)

      allSegments = allSegments.concat(segments)

      for (var j=0, m=segments.length; j<m; j++) {
        var segment = segments[j]

        if (segment instanceof EpsilonSegment) { continue }

        isEmpty = false

        // Add a "/" for the new segment
        currentState = currentState.put({ validChars: "/" })
        regex += "/"

        // Add a representation of the segment to the NFA and regex
        currentState = addSegment(currentState, segment)
        regex += segment.regex()
      }

      var handler = { handler: route.handler, names: names }
      handlers.push(handler)
    }

    if (isEmpty) {
      currentState = currentState.put({ validChars: "/" })
      regex += "/"
    }

    currentState.handlers = handlers
    currentState.regex = new RegExp(regex + "$")
    currentState.specificity = specificity

    if (name = options && options.as) {
      this.names[name] = {
        segments: allSegments,
        handlers: handlers
      }
    }
  },

  handlersFor: function(name) {
    var route = this.names[name], result = []
    if (!route) { throw new Error("There is no route named " + name) }

    for (var i=0, l=route.handlers.length; i<l; i++) {
      result.push(route.handlers[i])
    }

    return result
  },

  hasRoute: function(name) {
    return !!this.names[name]
  },

  generate: function(name, params) {
    var route = this.names[name], output = ""
    if (!route) { throw new Error("There is no route named " + name) }

    var segments = route.segments

    for (var i=0, l=segments.length; i<l; i++) {
      var segment = segments[i]

      if (segment instanceof EpsilonSegment) { continue }

      output += "/"
      output += segment.generate(params)
    }

    if (output.charAt(0) !== '/') { output = '/' + output }

    if (params && params.queryParams) {
      output += this.generateQueryString(params.queryParams)
    }

    return output
  },

  generateQueryString: function(params) {
    var pairs = []
    var keys = []
    for(var key in params) {
      if (params.hasOwnProperty(key)) {
        keys.push(key)
      }
    }
    keys.sort()
    for (var i = 0, len = keys.length; i < len; i++) {
      key = keys[i]
      var value = params[key]
      if (value == null) {
        continue
      }
      var pair = encodeURIComponent(key)
      if (isArray(value)) {
        for (var j = 0, l = value.length; j < l; j++) {
          var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j])
          pairs.push(arrayPair)
        }
      } else {
        pair += "=" + encodeURIComponent(value)
        pairs.push(pair)
      }
    }

    if (pairs.length === 0) { return '' }

    return "?" + pairs.join("&")
  },

  parseQueryString: function(queryString) {
    var pairs = queryString.split("&"), queryParams = {}
    for(var i=0; i < pairs.length; i++) {
      var pair      = pairs[i].split('='),
          key       = decodeQueryParamPart(pair[0]),
          keyLength = key.length,
          isArray = false,
          value
      if (pair.length === 1) {
        value = 'true'
      } else {
        //Handle arrays
        if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
          isArray = true
          key = key.slice(0, keyLength - 2)
          if(!queryParams[key]) {
            queryParams[key] = []
          }
        }
        value = pair[1] ? decodeQueryParamPart(pair[1]) : ''
      }
      if (isArray) {
        queryParams[key].push(value)
      } else {
        queryParams[key] = value
      }
    }
    return queryParams
  },

  recognize: function(path, silent) {
    noWarning = silent
    var states = [ this.rootState ],
        pathLen, i, l, queryStart, queryParams = {},
        isSlashDropped = false

    queryStart = path.indexOf('?')
    if (queryStart !== -1) {
      var queryString = path.substr(queryStart + 1, path.length)
      path = path.substr(0, queryStart)
      if (queryString) {
        queryParams = this.parseQueryString(queryString)
      }
    }

    path = tryDecode(path)
    if (!path) return

    // DEBUG GROUP path

    if (path.charAt(0) !== "/") { path = "/" + path }

    pathLen = path.length
    if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
      path = path.substr(0, pathLen - 1)
      isSlashDropped = true
    }

    for (i=0, l=path.length; i<l; i++) {
      states = recognizeChar(states, path.charAt(i))
      if (!states.length) { break }
    }

    // END DEBUG GROUP

    var solutions = []
    for (i=0, l=states.length; i<l; i++) {
      if (states[i].handlers) { solutions.push(states[i]) }
    }

    states = sortSolutions(solutions)

    var state = solutions[0]

    if (state && state.handlers) {
      // if a trailing slash was dropped and a star segment is the last segment
      // specified, put the trailing slash back
      if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
        path = path + "/"
      }
      return findHandler(state, path, queryParams)
    }
  }
}

RouteRecognizer.prototype.map = map

export default RouteRecognizer
