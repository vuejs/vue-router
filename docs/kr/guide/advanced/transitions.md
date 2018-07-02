# 트랜지션

`<router-view>`는 본질적으로 동적인 컴포넌트이기 때문에 `<transition>` 컴포넌트를 사용하는 것과 같은 방식으로 트랜지션 효과를 적용할 수 있습니다.

``` html
<transition>
  <router-view></router-view>
</transition>
```

[`<transition>`에 대한 모든 것](http://vuejs.org/guide/transitions.html) 을 확인하십시오.

### 라우트 별 트랜지션

위의 사용법은 모든 라우트에 대해 동일한 트랜지션을 적용합니다. 각 라우트의 컴포넌트가 서로 다른 트랜지션을 갖도록 하려면 각 라우트 컴포넌트 내에서 다른 이름으로 `<transition>`을 사용할 수 있습니다.

``` js
const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
```

### 라우트 기반 동적 트랜지션

또한 대상 라우트와 현재 라우트 간의 관계를 기반으로 동적으로 사용할 트랜지션을 결정할 수도 있습니다.

``` html
<!-- 동적 트랜지션을 위한 name을 지정합니다. -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// 그런 다음 부모 구성 요소에서 `$route`를 보고 사용할 트랜지션을 결정합니다
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

전체 예제는 [여기](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js)에 있습니다.
