# 라우트 메타 필드

라우트를 정의 할 때 `meta` 필드를 포함시킬 수 있습니다.

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // 메타 필드
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

그렇다면 이 `메타`필드에 어떻게 접근할까요?

첫째,`routes` 설정의 각 라우트 객체를 **라우트 레코드** 라고합니다. 라우트 레코드는 중첩 될 수 있습니다. 따라서 라우트가 일치하면 둘 이상의 라우트 레코드와 잠재적으로 일치 할 수 있습니다.

예를 들어, 위의 라우트 구성에서 URL `/foo/bar`는 상위 라우트 레코드와 하위 라우트 레코드 모두와 일치합니다.

라우트와 일치하는 모든 라우트 레코드는 `$route` 객체(그리고 네비게이션 가드의 라우트 객체)에 `$route.matched` 배열로 노출됩니다. 그러므로 우리는 `$route.matched`를 반복하여 라우트 레코드의 메타 필드를 검사 할 필요가 있습니다.

예제 사용 사례는 글로벌 네비게이션 가드에서 메타 필드를 확인하는 것입니다.

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 이 라우트는 인증이 필요하며 로그인 한 경우 확인하십시오.
    // 그렇지 않은 경우 로그인 페이지로 리디렉션하십시오.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 반드시 next()를 호출하십시오!
  }
})
```
