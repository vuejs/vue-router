# 동적 라우트 매칭

주어진 패턴을 가진 라우트를 동일한 컴포넌트에 매핑해야하는 경우가 자주 있습니다. 예를 들어 모든 사용자에 대해 동일한 레이아웃을 가지지만 하지만 다른 사용자 ID로 렌더링되어야하는 `User` 컴포넌트가 있을 수 있습니다. `vue-router`에서 우리는 경로에서 동적 세그먼트를 사용하여 다음을 할 수 있습니다.

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 동적 세그먼트는 콜론으로 시작합니다.
    { path: '/user/:id', component: User }
  ]
})
```

이제 `/user/foo`와 `/user/bar` 같은 URL은 모두 같은 경로에 매핑됩니다.

동적 세그먼트는 콜론 `:`으로 표시됩니다. 라우트가 일치하면 동적 세그먼트의 값은 모든 컴포넌트에서 `this.$route.params`로 표시됩니다. 그러므로 `User`의 템플릿을 다음과 같이 갱신하여 현재 사용자 ID를 표현할 수 있습니다 :

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

실제 예제는 [여기](http://jsfiddle.net/yyx990803/4xfa2f19/)에 있습니다.

동일한 라우트에 여러 동적 세그먼트를 가질 수 있으며, `$route.params`의 해당 필드에 매핑됩니다.

예:

| 패턴 | 일치하는 패스 | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

`$route.params` 외에도 `$route` 객체는 `$route.query` (URL에 쿼리가 있는 경우), `$route.hash` 등의 유용한 정보를 제공합니다. [API 레퍼런스](../api/route-object.md)에서 전체 세부 정보를 확인할 수 있습니다.

### Params 변경 사항에 반응하기

매개 변수와 함께 라우트를 사용할 때 주의 해야할 점은 사용자가 `/user/foo`에서 `/user/bar`로 이동할 때 **동일한 컴포넌트 인스턴스가 재사용된다는 것입니다.** 두 라우트 모두 동일한 컴포넌트를 렌더링하므로 이전 인스턴스를 삭제 한 다음 새 인스턴스를 만드는 것보다 효율적입니다. **그러나 이는 또한 컴포넌트의 라이프 사이클 훅이 호출되지 않음을 의미합니다.**

동일한 컴포넌트의 params 변경 사항에 반응하려면 `$route` 객체를 보면됩니다.

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 경로 변경에 반응하여...
    }
  }
}
```

또는 2.2에서 소개된 `beforeRouteUpdate` 가드를 사용하십시오.
```js
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```

### 고급 매칭 패턴

`vue-router`는 라우트 매칭 엔진으로 [path-to-regexp](https://github.com/pillarjs/path-to-regexp)를 사용하기 때문에 선택적 동적 세그먼트, 0개 이상/하나 이상의 요구 사항, 심지어 커스텀 정규식 패턴과 같은 많은 고급 매칭 패턴을 지원합니다. 이 고급 패턴들과 `vue-router`에서 사용하는 [예제](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js)에 대한 [문서](https://github.com/pillarjs/path-to-regexp#parameters)를 확인하십시오.

### 매칭 우선순위

동일한 URL이 여러 라우트와 일치하는 경우가 있습니다. 이 경우 일치하는 우선 순위는 라우트 정의의 순서에 따라 결정됩니다. 즉, 경로가 더 먼저 정의 될수록 우선 순위가 높아집니다.
