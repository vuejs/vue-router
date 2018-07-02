# 이름을 가지는 라우트

때로는 라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용하는 것이 더 편리합니다. Router 인스턴스를 생성하는 동안 `routes` 옵션에 라우트를 지정할 수 있습니다.

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

이름을 가진 라우트에 링크하려면, 객체를 `router-link`, 컴포넌트의 `to` prop로 전달할 수 있습니다.

``` html
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
```

이것은 `router.push()`와 프로그램적으로 사용되는 것과 정확히 같은 객체입니다.

```js
router.push({ name: 'user', params: { userId: 123 }})
```

두 경우 모두 라우터는 `/user/123` 경로로 이동합니다.

전체 예제는 [여기](https://github.com/vuejs/vue-router/blob/dev/examples/named-routes/app.js)에 있습니다.
