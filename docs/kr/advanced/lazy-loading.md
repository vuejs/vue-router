# 지연된 로딩

번들러를 이용하여 앱을 제작할 때 JavaScript 번들이 상당히 커져 페이지로드 시간에 영향을 줄 수 있습니다. 각 라우트의 컴포넌트를 별도의 단위로 분할하고 경로를 방문할 때 로드하는 것이 효율적일 것입니다.

Vue의 [비동기 컴포넌트](http://vuejs.org/guide/components.html#Async-Components)와 Webpack의 [코드 분할](https://webpack.js.org/guides/code-splitting-require/)을 결합합니다. 라우트 컴포넌트를 쉽게 불러올 수 있습니다.

라우트 컴포넌트를 비동기 컴포넌트로 정의하면됩니다.

``` js
const Foo = resolve => {
  // require.ensure는 Webpack의 코드 분할에 대한 특수 구문입니다.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

AMD 스타일 요구 사항을 사용하는 또다른 코드 분할 구문도 있으므로 다음과 같이 단순화 할 수 있습니다.

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

라우트 설정에서 아무것도 바꿀 필요가 없습니다. 보통 `Foo`만 사용하십시오.

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 같은 묶음으로 컴포넌트 그룹화하기

때로는 동일한 라우트 아래에 중첩된 모든 컴포넌트를 동일한 비동기 묶음으로 그룹화 할 수 있습니다. 이를 위해 우리는 세 번째 전달인자로 `require.ensure`에 묶음 이름을 제공하여 [이름을 가진 묶음](https://webpack.js.org/guides/code-splitting-require/#chunkname)을 사용해야합니다.

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack은 동일한 묶음 이름을 가진 비동기 모듈을 같은 비동기 묶음으로 그룹화합니다. 이것은 또한`require.ensure`에 대한 종속성을 더 이상 명시 적으로 나열할 필요가 없음을 의미합니다(따라서 빈 배열을 전달합니다).
