# [3.0.2](https://github.com/vuejs/vue-router/compare/v3.0.1...v3.0.2) (2018-11-23)

### Bug Fixes

- **errors:** throws with invalid route objects ([#1893](https://github.com/vuejs/vue-router/issues/1893)) ([c837666](https://github.com/vuejs/vue-router/commit/c837666))
- fix the test in async.spec.js ([#1953](https://github.com/vuejs/vue-router/issues/1953)) ([4e9e66b](https://github.com/vuejs/vue-router/commit/4e9e66b))
- initial url path for non ascii urls ([#2375](https://github.com/vuejs/vue-router/issues/2375)) ([c3b0a33](https://github.com/vuejs/vue-router/commit/c3b0a33))
- only setupScroll when support pushState due to possible fallback: false ([#1835](https://github.com/vuejs/vue-router/issues/1835)) ([fac60f6](https://github.com/vuejs/vue-router/commit/fac60f6)), closes [#1834](https://github.com/vuejs/vue-router/issues/1834)
- workaround replaceState bug in Safari ([#2295](https://github.com/vuejs/vue-router/issues/2295)) ([3c7d8ab](https://github.com/vuejs/vue-router/commit/3c7d8ab)), closes [#2195](https://github.com/vuejs/vue-router/issues/2195)
- **hash:** support unicode in initial route ([8369c6b](https://github.com/vuejs/vue-router/commit/8369c6b))
- **history-mode:** correcting indentation in web.config example ([#1948](https://github.com/vuejs/vue-router/issues/1948)) ([4b071f9](https://github.com/vuejs/vue-router/commit/4b071f9))
- **match:** use pathMatch for the param of \* routes ([#1995](https://github.com/vuejs/vue-router/issues/1995)) ([ca1fccd](https://github.com/vuejs/vue-router/commit/ca1fccd)), closes [#1994](https://github.com/vuejs/vue-router/issues/1994)

### Features

- call scrollBehavior with app context ([#1804](https://github.com/vuejs/vue-router/issues/1804)) ([c93a734](https://github.com/vuejs/vue-router/commit/c93a734))

# [3.0.1](https://github.com/vuejs/vue-router/compare/v3.0.0...v3.0.1) (2017-10-13)

### Bug Fixes

- fix props-passing regression ([02ff792](https://github.com/vuejs/vue-router/commit/02ff792)), closes [#1800](https://github.com/vuejs/vue-router/issues/1800)

# [3.0.0](https://github.com/vuejs/vue-router/compare/v2.8.0...v3.0.0) (2017-10-11)

### Features

- **typings:** adapt to the new Vue typings ([#1685](https://github.com/vuejs/vue-router/issues/1685)) ([8855e36](https://github.com/vuejs/vue-router/commit/8855e36))

### BREAKING CHANGES

- **typings:** It is no longer compatible with the old Vue typings

# [2.8.0](https://github.com/vuejs/vue-router/compare/v2.7.0...v2.8.0) (2017-10-11)

### Bug Fixes

- allow insllation on extended Vue copies ([f62c5d6](https://github.com/vuejs/vue-router/commit/f62c5d6))
- avoid first popstate event with async guard together (fix [#1508](https://github.com/vuejs/vue-router/issues/1508)) ([#1661](https://github.com/vuejs/vue-router/issues/1661)) ([3cbc0f3](https://github.com/vuejs/vue-router/commit/3cbc0f3))
- deep clone query when creating routes ([effb114](https://github.com/vuejs/vue-router/commit/effb114)), closes [#1690](https://github.com/vuejs/vue-router/issues/1690)
- fix scroll when going back to initial route ([#1586](https://github.com/vuejs/vue-router/issues/1586)) ([c166822](https://github.com/vuejs/vue-router/commit/c166822))
- handle null values when comparing objects ([#1568](https://github.com/vuejs/vue-router/issues/1568)) ([4e95bd8](https://github.com/vuejs/vue-router/commit/4e95bd8)), closes [#1566](https://github.com/vuejs/vue-router/issues/1566)
- resolve native ES modules ([8a28426](https://github.com/vuejs/vue-router/commit/8a28426))
- send props not defined on the route component in \$attrs. Fixes [#1695](https://github.com/vuejs/vue-router/issues/1695). ([#1702](https://github.com/vuejs/vue-router/issues/1702)) ([a722b6a](https://github.com/vuejs/vue-router/commit/a722b6a))

### Features

- enhance hashHistory to support scrollBehavior ([#1662](https://github.com/vuejs/vue-router/issues/1662)) ([1422eb5](https://github.com/vuejs/vue-router/commit/1422eb5))
- scrollBehavior accept returning a promise ([#1758](https://github.com/vuejs/vue-router/issues/1758)) ([ce13b55](https://github.com/vuejs/vue-router/commit/ce13b55))

# [2.7.0](https://github.com/vuejs/vue-router/compare/v2.6.0...v2.7.0) (2017-06-29)

### Features

- auto resolve ES module default when resolving async components ([d539788](https://github.com/vuejs/vue-router/commit/d539788))
