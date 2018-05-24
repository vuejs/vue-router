# 시작하기

> 가이드의 샘플 코드는[ES2015](https://github.com/lukehoban/es6features)를 사용합니다.

Vue.js와 vue-router로 단일 페이지 애플리케이션을 만드는 것은 간단합니다. Vue.js를 통해 우리는 이미 컴포넌트로 애플리케이션을 구성하고 있습니다. vue-router를 추가 할 때, 우리가해야 할 일은 우리의 컴포넌트를 route에 매핑하고 vue-router가 어디서 렌더링할 지 지정하는 것입니다. 다음은 기본적인 예입니다.

> 모든 예제는 Vue의 전체 버전을 사용하여 템플릿 구문 분석을 가능하게합니다. 자세한 내용은 [여기](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only) 있습니다.

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 탐색을 위해 라우터 링크 구성 요소를 사용하십시오. -->
    <!-- `to` prop를 전달하여 링크를 지정하십시오. -->
    <!-- `<router-link>`는 기본적으로`<a>`태그로 렌더링 될 것입니다 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- route outlet -->
  <!-- 라우트와 일치하는 컴포넌트가 여기 렌더링됩니다. -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. 모듈 시스템을 사용하는 경우 (예: vue-cli를 이용해서), Vue 및 VueRouter를 가져온 다음 `Vue.use(VueRouter)`를 호출하십시오.

// 1. 라우트 컴포넌트를 정의하십시오.
// 다른 파일에서 가져올 수 있습니다.
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 라우트를 정의합니다.
// 일부 라우트 정의 각 라우트는 컴포넌트에 맵핑되어야합니다.
// "컴포넌트"는 `Vue.extend()`를 통해 생성된
// 실제 컴포넌트 생성자이거나 컴포넌트 옵션 객체 일 수 있습니다.
// 나중에 중첩 된 라우트에 대해 이야기하겠습니다.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 라우터 인스턴스를 생성하고 `routes` 옵션을 전달하십시오.
// 여기에 추가 옵션을 전달할 수 있지만, 지금은 간단하게 하겠습니다.
const router = new VueRouter({
  routes // routes: routes 의 약어
})

// 4. 루트 인스턴스를 만들고 마운트하십시오.
// 라우터 옵션을 라우터에 삽입하여
// 전체 응용 프로그램을 라우터가 인식하도록 하십시오.
const app = new Vue({
  router
}).$mount('#app')

// 이제 앱을 시작 해보세요!
```

이 [예제](http://jsfiddle.net/yyx990803/xgrjzsup/)를 확인하십시오.

`<router-link>`는 가리키는 라우트가 일치 할 때 자동으로 `.router-link-active` 클래스를 얻습니다. API 레퍼런스에서 더 많은 것을 배울 수 있습니다.
