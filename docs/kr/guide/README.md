# 시작하기

::: tip 참고
이 가이드는 코드샘플에 [ES2015](https://github.com/lukehoban/es6features)를 사용합니다.

또한 모든 예제는 Vue 정식 버전을 이용해 바로 컴파일 할 수 있습니다. 더 자세한 내용은 [여기](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only)를 확인하세요.
:::

Vue와 Vue 라우터를 이용해 싱글 페이지 앱을 만드는 것은 매우 쉽습니다. Vue.js를 사용한다면 이미 컴포넌트로 앱을 구성하고 있을 것입니다. Vue 라우터를 함께 사용할 때 추가로 해야하는 것은 라우트에 컴포넌트를 매핑한 후, 어떤 주소에서 렌더링할 지 알려주는 것 뿐입니다.

아래는 기본 예제입니다.

## HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 네비게이션을 위해 router-link 컴포넌트를 사용합니다. -->
    <!-- 구체적인 속성은 `to` prop을 이용합니다. -->
    <!-- 기본적으로 `<router-link>`는 `<a>` 태그로 렌더링됩니다.-->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 라우트 아울렛 -->
  <!-- 현재 라우트에 맞는 컴포넌트가 렌더링됩니다. -->
  <router-view></router-view>
</div>
```

## JavaScript

``` js
// 0. 모듈 시스템 (예: vue-cli)을 이용하고 있다면, Vue와 Vue 라우터를 import 하세요
// 그리고 `Vue.use(VueRouter)`를 호출하세요


// 1. 라우트 컴포넌트를 정의하세요.
// 아래 내용들은 다른 파일로부터 가져올 수 있습니다.
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 라우트를 정의하세요.
// Each route should map to a component. The "component" can
// 각 라우트는 반드시 컴포넌트와 매핑되어야 합니다.
// "component"는 `Vue.extend()`를 통해 만들어진
// 실제 컴포넌트 생성자이거나 컴포넌트 옵션 객체입니다.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. `routes` 옵션과 함께 router 인스턴스를 만드세요.
// 추가 옵션을 여기서 전달해야합니다.
// 지금은 간단하게 유지하겠습니다.
const router = new VueRouter({
  routes // `routes: routes`의 줄임
})

// 4. 루트 인스턴스를 만들고 mount 하세요.
// router와 router 옵션을 전체 앱에 주입합니다.
const app = new Vue({
  router
}).$mount('#app')

// 이제 앱이 시작됩니다!
```

라우터를 주입하였으므로 `this.$router`와 현재 라우트를 `this$.route`로 접근할 수 있습니다.

```js
// Home.vue
export default {
  computed: {
    username () {
      // 곧 `params` 확인할 수 있습니다.
      return this.$route.params.username
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
```

문서 전체에서 `router`를 자주 사용했습니다. `this.$router`는 정확히 `router`와 동일합니다. `this.$router`를 사용하는 이유는 라우터를 조작해야하는 모든 컴포넌트에서 라우트 객체를 가져올 필요가 없기 때문입니다.


이 [예제](https://jsfiddle.net/yyx990803/xgrjzsup/)에서 바로 확인해볼 수 있습니다.

`<router-link>`는 현재 라우트와 일치할 때 자동으로 `.router-link-active` 클래스가 추가됩니다. [API 레퍼런스](../api/#router-link)를 확인하세요.