# Transições

Uma vez que o `<router-view>` é essencialmente um componente dinâmico, podemos aplicar efeitos de transição da mesma forma usando o componente `<transition>`:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Tudo sobre `<transition>`] (https://vuejs.org/guide/transitions.html) funciona o mesmo aqui.

### Transição por rota

O uso acima usará a mesma transição para todas as rotas. Se você deseja que o componente de cada rota tenha transições diferentes, você pode usar `<transição>` com nomes diferentes dentro de cada componente de rota:

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

### Transição Dinâmica Baseada na Rota

Também é possível determinar a transição para usar dinamicamente com base na relação entre a rota de destino e a rota atual:

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

Veja o exemplo completo[aqui](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).