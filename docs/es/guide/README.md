# Empezando

::: tip Nota
Usaremos [ES2015](https://github.com/lukehoban/es6features) en los ejemplos de la guia.

Además, todos los ejemplos usarán la versión completa de Vue para que sea posible la compilación de las plantillas sobre la marcha. Ver más detalles [aquí](https://es.vuejs.org/v2/guide/installation.html#Runtime-Compilador-vs-Runtime).
:::

Crear una aplicación de una sola página con Vue + Vue Router es simple: con Vue.js, ya estamos desarrollando nuestra aplicación con componentes. Cuando agregamos Vue Router a la mezcla, todo lo que necesitamos hacer es mapear nuestro componentes a las rutas y dejar que Vue Router sepa a donde renderizarlos. Este es un ejemplo básico:

## HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hola App!</h1>
  <p>
    <!-- utilizar el componente router-link para navegación. -->
    <!-- especificar el enlace agregando la propiedad `to`. -->
    <!-- `<router-link>` será renderizado como un tag `<a>` por defecto -->
    <router-link to="/foo">Ir a Foo</router-link>
    <router-link to="/bar">Ir a Bar</router-link>
  </p>
  <!-- etiqueta para el componente router-view -->
  <!-- el componente que coincida con la ruta se renderiza aquí -->
  <router-view></router-view>
</div>
```

## JavaScript

```js
// 0. Si estás usando un sistema de módulos (ej. vía vue-cli), importa Vue y VueRouter
// y luego llama `Vue.use(VueRouter)`.

// 1. Definir los componentes de la ruta.
// Los componentes pueden ser importados desde otro archivos
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Definir algunas rutas
// Cada ruta debe mapear un componente. El "componente" puede
// ser un constructor de componentes creado a través de
// `Vue.extend()`, o solo un objeto de opciones de componente.
// Hablaremos sobre las rutas anidadas más adelante.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Crear la instancia de router and pasar las opciones `routes`
// Puedes pasar opciones adicionales, pero
// mantengámoslo simple por ahora.
const router = new VueRouter({
  routes // short for `routes: routes`
})

// 4. Crear y montar la instancia de raíz.
// Asegúrese de inyectar el router con las opciones para hacer
// toda la aplicación consciente del uso de router.
const app = new Vue({
  router
}).$mount('#app')

// Ahora la aplicación ha iniciado!
```

Al inyectar el router, obtenemos acceso a su instancia como `this.$router` y a la instancia de la ruta actual como `this.$route` dentro de cualquier componente:

```js
// Home.vue
export default {
  computed: {
    username() {
      // Veremos que es la propiedad `params` dentro de poco
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
```

A lo largo de la documentación, usaremos a menudo la instancia de `router`. Ten en cuenta que `this.$router` es lo mismo que usar `router`. La razón por la que usamos `this.$router` es porque no queremos importar el router en cada componente que necesite manipular las rutas.

También puedes ver este [ejemplo](https://jsfiddle.net/yyx990803/xgrjzsup/).

Observe que `<router-link>` automaticamente obtiene la clase `.router-link-active` cuando su ruta de destino coincide. Puedes obtener más información sobre `<router-link>` [acá](../api/#router-link).
