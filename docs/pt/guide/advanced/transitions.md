# Transições

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-create-route-transitions-with-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda a criar transições para rotas em uma aula gratuita na Vue School">Aprenda a criar transições para rotas em uma aula gratuita na Vue School</a></div>

Desde que o `<router-view>` seja essencialmente um componente dinâmico, nós podemos aplicar efeitos de transição para ele da mesma maneira usando o componente `<transition>`:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Todas APIs de Transição](https://br.vuejs.org/guide/transitions.html) funcionam da mesma maneira aqui.


## Transição por Rota

O exemplo de uso acima irá aplicar a mesma transição para todas as rotas. Se você quiser que cada componente da rota tenham transições diferentes, você pode usar `<transition>` com diferentes nomes dentro de cada componente de rota.

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

## Transição Dinâmica Baseada em Rotas

É também possível determinar usar transição dinamicamente baseada no relacionameto entre a rota alvo e a rota atual:

``` html
<!-- use um nome de transição dinamico -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// depois, no componente pai,
// observe o `$route` para de determinar a transição a usar
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

Veja um exemplo completo [aqui](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
