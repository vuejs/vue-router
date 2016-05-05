# 动态组件载入 lazy load

当你在使用 Webpack 或者 Browserify 时，在基于[异步组件](http://vuejs.org/guide/components.html#Async_Components)编写的 Vue 项目时，也可以较为容易的实现惰性加载组件。不再是之前所述的直接引用一个组件，现在需要像下面这样通过定义一个函数返回一个组件：


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

现在，通过手动实现组件的加载不是个理想的办法，不过像 Webpack 和 Browserify 这类的构建工具都提供了一些更加简单方便的解决方案。

### Webpack

Webpack 已经集成了代码分割功能。你可以使用 AMD 风格的 `require` 来对你的代码标识代码分割点:

``` js
require(['./MyComponent.vue'], function (MyComponent) {
  // code here runs after MyComponent.vue is asynchronously loaded.
})
```

和路由配合使用，如下：

``` js
router.map({
  '/async': {
    component: function (resolve) {
      require(['./MyComponent.vue'], resolve)
    }
  }
})
```

现在，只有当 `/async` 需要被渲染时，`MyComponent.vue`组件，会自动加载它的依赖组件，并且异步的加载进来。

### Browserify

使用 Browserify 还需要一些技巧。你可能需要插件 [`partition-bundle`](https://github.com/substack/browserify-handbook/blob/master/readme.markdown#partition-bundle)，并且需要在 `json` 文件中手动声明：

``` json
{
  "main.js": ["./main.js"],
  "my-component.js": ["./MyComponent.vue"]
}
```

然后在 `main.js`，你需要做一些类似的操作，用 `loadjs` 替代 `require`：

``` js
router.map({
  '/async': {
    component: function (resolve) {
      loadjs(['./MyComponent.vue'], resolve)
    }
  }
})
```
