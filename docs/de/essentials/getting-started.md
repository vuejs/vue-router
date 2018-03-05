# Erste Schritte

> Hinweis: Wir benutzen [ES2015](https://github.com/lukehoban/es6features) in den Code-Beispielen.

Eine Single-Page-Applikation mit Vue.js und vue-router zu erstellen ist wirklich simpel. Mit Vue.js stellen wir unsere App ja bereits aus Komponenten zusammen. Wenn wir nun vue-router ins Spiel bringen, müssen wir lediglich unsere Komponenten den "Routes" zuordnen und vue-router mitteilen, wo diese Komponenten gerendert werden sollen. Hier ein einfaches Beispiel:

> Alle Beispiele nutzen die Standalone-Version von Vue, um Template-Parsing nutzen zu können. Mehr Details [hier (englisch)](http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build)

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- nutze <router-link> zur Navigation -->
    <!-- gib den Link mit der `to`-Prop an -->
    <!-- <router-link> wird standardmäßig als <a> gerendert-->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- Route-Outlet (zu deutsch soviel wie: "Ausgang") -->
  <!-- die der Route zugeordnete Komponente wird hier gerendert-->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. Wenn du ein Modul-System wie Webpack oder Browserify benutzt (z. B. via vue-cli), importiere Vue sowie VueRouter und rufe Vue.use(VueRouter) auf.

// 1. Definiere die Route-Komponenten
// Diese können auch aus anderen Dateien importiert werden.
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Definiere ein paar Routes
// Jede Route sollte mit einer Komponente verbunden sein.
// Die Komponenente kann entweder eine tatsächliche Komponente sein, die via Vue.extend() erstellt wird
// oder lediglich ein Optionsobjekt der Komponenente.
// Hinweis: Verschachtelte (engl: "nested") Routes werden später in dieser Anleitung behandelt.

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Erstelle die Router-Instanz und füge ihr die `routes`-Option hinzu.
// Es gibt ntürlich noch mehr Optionen, aber hier halten wir es erstmal einfach.

const router = new VueRouter({
  routes // kurz für 'routes: routes'
})

// 4. Erstelle und mounte die Root-Instanz.
// Stelle sicher, dass der Router mit der `router` option an die Root Instanz übergeben wird, damit er später überall in deiner App zur Verfügung steht.

const app = new Vue({
  router
}).$mount('#app')

// Die App ist nun gestartet.
```
Das ganze gibt es natürlich auch als [Live-Beispiel](http://jsfiddle.net/yyx990803/xgrjzsup/).

Hinweis: `<router-link>` erhält automatisch die CSS-Klasse `.router-link-active`, wenn die aktuelle Route im Browser der des router-link entspricht. Mehr Infos dazu in der [API-Referenz](../api/router-link.md).
