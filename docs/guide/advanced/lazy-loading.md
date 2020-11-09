# Lazy Loading Routes

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-lazy-load-routes-with-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to increase performance by lazy loading routes on Vue School">Learn how to lazy load routes with a free lesson on Vue School</a></div>

When building apps with a bundler, the JavaScript bundle can become quite large, and thus affect the page load time. It would be more efficient if we can split each route's components into a separate chunk, and only load them when the route is visited.

Combining Vue's [async component feature](https://vuejs.org/guide/components.html#Async-Components) and webpack's [code splitting feature](https://webpack.js.org/guides/code-splitting-async/), it's trivially easy to lazy-load route components.

First, an async component can be defined as a factory function that returns a Promise (which should resolve to the component itself):

```js
const Foo = () =>
  Promise.resolve({
    /* component definition */
  })
```

Second, in webpack 2, we can use the [dynamic import](https://github.com/tc39/proposal-dynamic-import) syntax to indicate a code-split point:

```js
import('./Foo.vue') // returns a Promise
```

::: tip Note
if you are using Babel, you will need to add the [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) plugin so that Babel can properly parse the syntax.
:::

Combining the two, this is how to define an async component that will be automatically code-split by webpack:

```js
const Foo = () => import('./Foo.vue')
```

Nothing needs to change in the route config, just use `Foo` as usual:

```js
const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }]
})
```

## Grouping Components in the Same Chunk

Sometimes we may want to group all the components nested under the same route into the same async chunk. To achieve that we need to use [named chunks](https://webpack.js.org/api/module-methods/#magic-comments) by providing a chunk name using a special comment syntax (requires webpack > 2.4):

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

webpack will group any async module with the same chunk name into the same async chunk.
