# Umleitung und Alias

### Umleitung

Eine Umleitung bedeutet, dass, wenn der Nutzer `/a` besucht, die URL mit `/b` ersetzt wird und auch die Komponente unter `/b` rendert. Dieses richtet man in der `routes`-Konfiguration ein:


``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

Die Umleitung kann auch an einer benannten Route angewandt werden:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Oder auch mit einer Funktion für dynamische Umleitung:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // Die Funktion erhält die Ziel-Route als Argument
      // und gibt den Umleitungsort/-pfad hier aus.
    }}
  ]
})
```

Für andere erweiterte Nutzungen siehe auch dieses [Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

Ein Alias von `/a` als `/b` bedeutet, dass die URL `/b` bleibt, wenn diese besucht wird, jedoch die Komponente von `/a` gerendert wird.

Dieses kann man in der Router-Konfiguration folgendermaßen definieren:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Ein Alias gibt die Möglichkeit eine gewisse UI-Struktur einer
beliebigen URL zuzuordnen, anstatt von der verschachtelten Struktur der Konfiguration eingeschränkt zu werden.

Für erweiterte Nutzung siehe folgendes [Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
