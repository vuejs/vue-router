# Transitions

Vu que `<router-view>` est essentiellement un composant dynamique, on peut lui appliquer certains effets de transitions en utilisant le composant `<transition>` :

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Tout à propos de `<transition>`](https://fr.vuejs.org/v2/guide/transitions.html) fonctionne également ici de la même manière.

### Transition par route

L'utilisation du dessus applique la même transition pour chaque route. Si vous voulez que les composants de route aient des transitions différentes, vous pouvez utiliser à la place `<transition>` avec des noms différents à l'intérieur de chaque composant de route :

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

# Transition dynamique basée sur la route

Il est aussi possible de déterminer la transition à utiliser en se basant sur la relation entre la route cible et la route actuelle :

``` html
<!-- utiliser un nom de transition dynamique -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// et dans le composant parent,
// observer la `$route` pour déterminer la transition à utiliser
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

Voir un exemple complet [ici](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
