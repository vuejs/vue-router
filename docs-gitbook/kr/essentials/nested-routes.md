# 중첩된 라우트

실제 앱 UI는 일반적으로 여러 단계로 중첩 된 컴포넌트로 이루어져 있습니다. URL의 세그먼트가 중첩 된 컴포넌트의 특정 구조와 일치한다는 것은 매우 일반적입니다. 예를 들면 다음과 같습니다.

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

`vue-router`를 사용하면 중첩 된 라우트 구성을 사용하여 관계를 표현하는 것이 매우 간단합니다.

이전 장에서 만든 앱을 생각해보십시오.

``` html
<div id="app">
  <router-view></router-view>
</div>
```

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

여기에있는 `<router-view>`는 최상위 outlet입니다. 최상위 경로와 일치하는 컴포넌트를 렌더링합니다. 비슷하게 렌더링 된 컴포넌트는 자신의 중첩 된 `<router-view>`를 포함 할 수도 있습니다. 다음은 `User` 컴포넌트의 템플릿 안에 하나를 추가하는 예 입니다.

``` js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

이 중첩 outlet에 컴포넌트를 렌더링하려면 `children`을 사용해야합니다.
`VueRouter` 생성자의 옵션 config:

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // /user/:id/profile 과 일치 할 때
          // UserProfile은 User의 <router-view> 내에 렌더링 됩니다.
          path: 'profile',
          component: UserProfile
        },
        {
          // /user/:id/posts 과 일치 할 때
          // UserPosts가 User의 <router-view> 내에 렌더링 됩니다.
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**`/`로 시작하는 중첩 된 라우트는 루트 경로로 취급됩니다. 이렇게하면 중첩 된 URL을 사용하지 않고도 컴포넌트 중첩을 활용할 수 있습니다.**

여러분이 볼 수 있듯이 `children` 옵션은 `routes`와 같은 라우트 설정 객체의 또 다른 배열입니다. 따라서 필요한만큼 중첩 된 뷰를 유지할 수 있습니다.

이 시점에서, 위의 설정으로, `/user/foo`를 방문했을 때 하위 라우트가 매치되지 않았기 때문에 `User`의 outlet에 아무것도 출력되지 않습니다. 어쩌면 거기에 무언가를 렌더링하고 싶을지도 모릅니다. 이 경우 빈 서브 루트 경로를 제공 할 수 있습니다.

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // UserHome은 /user/:id 가 일치 할 때
        // User의 <router-view> 안에 렌더링됩니다.
        { path: '', component: UserHome },

        // ...또 다른 서브 라우트
      ]
    }
  ]
})
```

이 예제의 작업 데모는 [이 곳](http://jsfiddle.net/yyx990803/L7hscd8h/)에서 찾을 수 있습니다.
