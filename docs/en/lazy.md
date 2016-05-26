# Lazy Loading Routes

When you are using bundlers like Webpack or Browserify, it's trivially easy to lazy-load a route component using Vue.js' built-in [async component functionality](http://vuejs.org/guide/components.html#Async-Components). Instead of directly defining your route component, you define it as a function that will asynchronously resolve the actual component definition:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      // somehow retrieve your component definition from server...
      resolve(MyComponent)
    }
  }
})
```

Now, manually handling component retrieval is less than ideal, but bundlers like Webpack & Browserify both provides ways to make it easier.

### Webpack

Webpack has built-in support for async code-splitting. You can use the AMD-like `require` syntax in your code to indicate an async code-split point:

``` js
require(['./MyComponent.vue'], function (MyComponent) {
  // code here runs after MyComponent.vue is asynchronously loaded.
})
```

Combined with the router it can simply look like this:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      require(['./MyComponent.vue'], resolve)
    }
  }
})
```

Now, `MyComponent.vue`, along with any dependencies that is only used by itself, will be loaded asynchronously only when the route `/async` needs to be rendered.

### Browserify

It's a bit more tricky to achieve the same with Browserify, but it's possible with the [`partition-bundle` plugin](https://github.com/substack/browserify-handbook/blob/master/readme.markdown#partition-bundle). You will have to manually declare your bundle mappings in a `json` file:

``` json
{
  "main.js": ["./main.js"],
  "my-component.js": ["./MyComponent.vue"]
}
```

Then in `main.js` you would do something similar, using the `loadjs` function instead of `require`:

``` js
router.map({
  '/async': {
    component: function (resolve) {
      loadjs(['./MyComponent.vue'], resolve)
    }
  }
})
```
