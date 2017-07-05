# Transitions (Übergänge)

Da `<router-view>` im Grunde eine dynamische Komponente ist, kann man Übergangs-Effekte mit der `<transition>`-Komponente hinzufügen:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Alle Features von `<transition>`](http://vuejs.org/guide/transitions.html) funktionieren hier genauso.

### Übergang für einzelne Routes

Das obige Beispiel nutzt den gleichen Übergangseffekt für alle Routes. Wenn unterschiedliche Übergänge je Route gewollt sind, kann man `<transition>` stattdessen *in* der Route-Komponente mit jeweils anderen Namen verwenden:

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

### Route-basierter dynamischer Übergang

Es ist auch möglich, den Übergang dynamisch anhand der Beziehung zwischen Ziel- und aktueller Route festzulegen:

``` html
<!-- nutze einen dynamischen Übergangsnamen -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
```

``` js
// überwache $route in der Parent-Komponente,
// um den Übergang festzulegen
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
```

Komplettes Beispiel [hier](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js) ansehen.
