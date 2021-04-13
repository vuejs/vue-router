# 지연된 로딩

번들러를 이용하여 앱을 제작할 때 JavaScript 번들이 상당히 커져 페이지로드 시간에 영향을 줄 수 있습니다. 각 라우트의 컴포넌트를 별도의 단위로 분할하고 경로를 방문할 때 로드하는 것이 효율적일 것입니다.

Vue의 [비동기 컴포넌트](http://vuejs.org/guide/components.html#Async-Components)와 Webpack의 [코드 분할](https://webpack.js.org/guides/code-splitting-async/)을 결합합니다. 라우트 컴포넌트를 쉽게 불러올 수 있습니다.

첫째, 비동기 컴포넌트는 Promise를 반환하는 팩토리 함수로 정의할 수 있습니다 (컴포넌트가 resolve 되어야함).

```js
const Foo = () =>
  Promise.resolve({
    /* 컴포넌트 정의 */
  })
```

둘째, Webpack 2에서 [dynamic import](https://github.com/tc39/proposal-dynamic-import)를 사용하여 코드 분할 포인트를 지정할 수 있습니다.

```js
import('./Foo.vue') // returns a Promise
```

> 참고: Babel을 사용하고 있는 경우 올바른 구문 분석을 위해 [syntax-dynamic-import](http://babeljs.io/docs/plugins/syntax-dynamic-import/) 플러그인을 추가해야합니다.

이 두 가지를 결합하여 Webpack에 의해 자동으로 코드 분할될 비동기 컴포넌트를 정의하는 방법입니다.

```js
const Foo = () => import('./Foo.vue')
```

라우트 설정에서 아무것도 바꿀 필요가 없습니다. `Foo`만 사용하면 됩니다.

```js
const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }]
})
```

### 같은 묶음으로 컴포넌트 그룹화하기

때로는 동일한 라우트 아래에 중첩된 모든 컴포넌트를 동일한 비동기 묶음으로 그룹화 할 수 있습니다. 이를 위해 특수 주석 문법을 사용하는 이름(Webpack 2.4 이상 지원)을 제공하여 [이름을 가진 묶음](https://webpack.js.org/api/module-methods/#magic-comments)을 사용해야합니다.

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

Webpack은 동일한 이름의 묶음을 가진 비동기 모듈을 동일한 비동기 묶음으로 그룹화합니다.
