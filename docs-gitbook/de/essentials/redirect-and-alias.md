# Redirect und Alias

### Redirect (Umleitung)

Ein Redirect bedeutet, dass, wenn der Nutzer `/a` besucht, die URL mit `/b` ersetzt wird und auch die Komponente der Route zu `/b` rendert. Das kann in der `routes`-Konfiguration folgendermaßen eingestellt werden:


``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

Der Redirect kann auch auf eine benannten Route angewandt werden:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

Oder auch mit einer Funktion für dynamische Redirects:

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

Für erweiterte Anwendungsmöglichkeiten siehe auch dieses [Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

Ein Redirect bedeutet: Wenn wir die URL `/a` besuchen, wird die URL mit `/b` ersetzt und dann mit der Route für `/b` gematched. Aber was ist dann ein *Alias*?

Ein Alias von `/a` als `/b` bedeutet, dass die URL `/b` bleibt, wenn diese besucht wird, jedoch die Komponente von `/a` gerendert wird.

Dieses kann man in der Router-Konfiguration folgendermaßen definieren:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Ein Alias biete die Möglichkeit, eine bestimmte UI-Struktur einer beliebigen URL zuzuordnen, anstatt von der verschachtelten Struktur der Konfiguration eingeschränkt zu werden.

Für die erweiterte Anwendung siehe folgendes [Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
