# 라우트 컴포넌트에 속성 전달

컴포넌트에서 `$route`를 사용하면 특정 URL에서만 사용할 수 있는 컴포넌트의 유연성을 제한하는 라우트와 강한 결합을 만듭니다.

컴포넌트와 라우터 속성을 분리하려면 다음과 같이 하십시오.

** $route에 의존성 추가**

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

** 속성에 의존성 해제**

``` js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
  ]
})
```

이를 통해 어디서나 컴포넌트를 사용할 수 있으므로 컴포넌트 재사용 및 테스트하기가 더 쉽습니다.

### Boolean 모드

`props`를 `true`로 설정하면 `route.params`가 컴포넌트 `props`로 설정됩니다.

### 객체 모드

`props`가 객체일때 컴포넌트 `props`가 있는 그대로 설정됩니다.
`props`가 정적일 때 유용합니다.

``` js
const router = new VueRouter({
  routes: [
    { path: '/promotion/from-newsletter', component: Promotion, props: { newsletterPopup: false } }
  ]
})
```

### 함수 모드

`props`를 반환하는 함수를 만들 수 있습니다. 이를 통해 전달인자를 다른 타입으로 캐스팅하고 적정인 값을 라우트 기반 값과 결합됩니다.

``` js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

`/search?q=vue`는 `{query: "vue"}`를 `SearchUser` 컴포넌트에 전달합니다.

라우트 변경시에만 평가되므로 `props` 함수는 상태를 저장하지 않도록 합니다.
`props`를 정의할 상태가 필요한 경우 래퍼 컴포넌트를 사용하면 상태가 변경될 때마다 응답할 수 있습니다.

고급 사용예를 보려면 [예제](https://github.com/vuejs/vue-router/blob/dev/examples/route-props/app.js)를 확인하세요.
