# Transitions

Since the `<router-view>` is essentially a dynamic component, we can apply transition effects to it the same way using the `<transition>` component:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[All transition APIs](https://vuejs.org/guide/transitions.html) work the same here.

## Per-Route Transition

The above usage will apply the same transition for all routes. If you want each route's component to have different transitions, you can instead use `<transition>` with different names inside each route component:

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

## Route-Based Dynamic Transition

It is also possible to determine the transition to use dynamically based on the relationship between the target route and current route:

``` html
<!-- use a dynamic transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// then, in the parent component,
// watch the `$route` to determine the transition to use
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

See full example [here](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
