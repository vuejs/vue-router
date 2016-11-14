# Lazy Loading Routes

When building apps with a bundler, the JavaScript bundle can become quite large and thus affecting page load time. It would be more efficient if we can split each route's components into a separate chunk, and only load them when the route is visited.

Combining Vue's [async component feature](http://vuejs.org/guide/components.html#Async-Components) and Webpack's [code splitting feature](https://webpack.github.io/docs/code-splitting.html), it's trivially easy to
lazy-load route components.

All we need to do is defining our route components as async components:

``` js
const Foo = resolve => {
  // require.ensure is Webpack's special syntax for a code-split point.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

There's also an alternative code-split syntax using AMD style require, so this can be simplified to:

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

Nothing needs to change in the route config, just use `Foo` as usual:

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Grouping Components in the Same Chunk

Sometimes we may want to group all the components nested under the same route into the same async chunk. To achieve that we need to use [named chunks](https://webpack.github.io/docs/code-splitting.html#named-chunks) by providing a chunk name to `require.ensure` as the 3rd argument:

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack will group any async module with the same chunk name into the same async chunk - this also means we don't need to explicitly list dependencies for `require.ensure` anymore (thus passing an empty array).
