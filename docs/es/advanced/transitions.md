# Transiciones

Dado que `<router-view>` es esencialmente un componente dinámico, podemos aplicarle efectos de transición utilizando el componente `<transition>`:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Todo acerca de `<transition>`](http://vuejs.org/guide/transitions.html) también funciona aquí.

### Transiciones por ruta

El ejemplo anterior aplicará la misma transición a todas las rutas. Si deseas que cada componente de ruta tenga diferentes transiciones, puedes utilizar `<transition>` con diferentes nombres dentro de cada componente de ruta:

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

### Transiciones dinámicas basadas en componentes

También es posible determinar dinámicamente la transición a utilizar basado en las relaciones entre la ruta destino y la ruta actual:

``` html
<!-- utiliza un nombre de transición dinámico -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// luego, en el componente padre,
// observa $route para determinar que transición utilizar
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

Tienes un ejemplo completo [aquí](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
