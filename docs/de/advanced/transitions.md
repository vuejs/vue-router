# Übergänge

Da `<router-view>` im Grunde eine dynamische Komponente ist, kann man Übergangseffekte mit der `<transition>`-Komponente hinzufügen:

``` html
<transition>
  <router-view></router-view>
</transition>
```

[Alles über `<transition>`](http://vuejs.org/guide/transitions.html) funktioniert auch hier.

### Per-Route-Übergang

Das obige setzt den gleichen Übergangseffekt auf alle Routes. Wenn unterschiedliche Übergänge pro Route gewollt sind, kann man `<transition>` in der Route-Komponente jeweils andere Namen verpassen:

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

Es ist auch möglich den Übergang dynamisch anhand der Beziehung zwischen Ziel- und aktueller Route festzulegen:

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

Siehe als Beispiel [hier](https://github.com/vuejs/vue-router/blob/dev/examples/transitions/app.js).
