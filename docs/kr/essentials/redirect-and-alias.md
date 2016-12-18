# 리다이렉트와 별칭

### 리다이렉트

리디렉션은 `routes` 설정에서도 할 수 있습니다. `/a`에서 `/b`로 리디렉션하려면

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

리디렉션은 이름이 지정된 라우트를 지정할 수도 있습니다.

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

또는 동적 리디렉션을 위한 함수를 사용할 수도 있습니다.

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 함수는 인수로 대상 라우트를 받습니다.
      // 여기서 path/location 반환합니다.
    }}
  ]
})
```
기타 고급 사용법은 [예제](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js)를 확인 하십시오.

### 별칭

리다이렉트는 사용자가 `/a`를 방문했을 때 URL이 `/b`로 대체 된 다음 `/b`로 매칭된다는 것을 의미합니다. 하지만 별칭이란 무엇입니까?

**`/a`의 별칭은 `/b`는 사용자가 `/b`를 방문했을 때 URL은 `/b`을 유지하지만 사용자가 `/a`를 방문한 것처럼 매칭합니다.**

위는 라우트 구성에서 다음과 같이 표현할 수 있습니다.

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

별칭을 사용하면 구성의 중첩 구조에 의해 제약을 받는 대신 UI 구조를 임의의 URL에 매핑 할 수 있습니다.

기타 고급 사용법은 [예제](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js)를 확인 하십시오.
