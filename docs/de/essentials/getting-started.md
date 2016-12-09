# Erste Schritte

> Wir werden [ES2015](https://github.com/lukehoban/es6features) in den Code-Beispielen nutzen.

Eine Single-Page-Applikation mit Vue.js und vue-router zu schreiben, ist super einfach. Mit Vue.js erstellen wir unsere App bereits mit Komponenten. Wird vue-router hinzugefügt, müssen wir lediglich die Komponenten den Routes zuordnen, um vue-router wissen zu lassen, wo diese gerendert werden sollen. Hier ein einfaches Beispiel:

> Alle Beispiele nutzen die Standalone-Version von Vue, um Template-Parsing möglich zu machen. Mehr Details [hier (englisch)](http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build)

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- nutze <router-link> zur Navigation -->
    <!-- gib den Link mit dem `to`-Prop an -->
    <!-- <router-link> wird standardmäßig als <a> gerendert-->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- Route-Ausgang -->
  <!-- von der Route zutreffende Komponente wird hier gerendert-->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. Wenn ein Modulsystem genutzt wird (zB. via vue-cli), importiere Vue sowie VueRouter und rufe Vue.use(VueRouter) auf.

// 1. Definiere Route-Komponenten
// Diese können von anderen Dateien importiert werden.
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Definiere ein paar Routes
// Jede Route sollte mit einer Komponente verbunden sein.
// Die "Komponente" kann entweder eine tatsächliche Komponente sein, die via Vue.extend() erstellt wird,
// ein Komponenten-ID-String registriert via Vue.component() oder lediglich ein Optionsobjekt der Komponent.
// Verschachtelte Routes erscheinen später in der Anleitung.

const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Kreiere die Router-Instanz und leg ihr die `routes`-Option bei.
// Individuelle Optionen sind auch möglich, jedoch wird es hier erstmal einfach gehalten.

const router = new VueRouter({
  routes // kurz für 'routes: routes'
})

// 4. Kreiere und 'mount' die Root-Instanz.
// Stelle sicher, dass der Router mit Optionen initialisiert wird, damit die App diesen nutzen kann.

const app = new Vue({
  router
}).$mount('#app')

// Die App ist nun gestartet.
```
Sieh dir auch dieses [Beispiel](http://jsfiddle.net/yyx990803/xgrjzsup/) an.

`<router-link>` erhält automatisch die Klasse `.router-link-active`, wenn dessen Ziel-Route übereinstimmt. Mehr Infos dazu in der [API-Referenz](../api/router-link.md).
