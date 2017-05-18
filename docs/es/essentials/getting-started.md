# Primeros pasos

> Utilizaremos [ES2015](https://github.com/lukehoban/es6features) en el código de los ejemplos en esta guía.

Crear una aplicación de una sola página (SPA por sus siglas en inglés) con Vue.js + vue-router es muy sencillo. Con Vue.js, ya estamos estructurando nuestra aplicación con componentes. Cuando agregamos vue-router, todo lo que debemos hacer es mapear nuestros componentes a las rutas e informar a vue-router donde renderizarlas. Aquí hay un ejemplo básico:

> Todos los ejemplos utilizarán la versión independiente de Vue para hacer posible el análisis de plantillas. Más detalles [aquí](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- Utiliza el componente router-link para la navegación. -->
    <!-- especifica el enlace pasando la propiedad `to`. -->
    <!-- <router-link> será renderizado por defecto como una etiqueta `<a>` -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- El componente que coincida con la ruta será renderizado aquí -->
  <router-view></router-view>
</div>
```

### JavaScript

``` js
// 0. Si utilizas un sistema de empaquetamiento de módulos (por ejemplo, a través de vue-cli), importa Vue y VueRouter y luego ejecuta Vue.use(VueRouter).

// 1. Define componentes de enrutamiento.
// Estos pueden ser importados desde otros archivos
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Define algunas rutas
// Cada ruta debe mapear a un componente. El "componente" puede
// ser un constructor de componente creado a través de
// Vue.extend(), o simplemente un objeto de opciones de componente.
// Más tarde hablaremos acerca de las sub-rutas.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Crea una instancia del _router_ y pasa la opción `routes`
// Puedes pasar opciones adicionales aquí,
// pero mantengámoslo simple por el momento.
const router = new VueRouter({
  routes // forma corta para routes: routes
})

// 4. Crea y monta la instancia principal.
// Asegúrate de inyectar el _router_ con la opcion router para
// garantizar que toda la aplicación tenga acceso al mismo.
const app = new Vue({
  router
}).$mount('#app')

// ¡Ahora la aplicación está ejecutándose!
```

Puedes consultar este [ejemplo](http://jsfiddle.net/yyx990803/xgrjzsup/).

Nota que `<router-link>` obtiene automáticamente la clase `.router-link-active` cuando la ruta a la que apunta es accedida. Puedes leer más acerca de eso en la documentación de la [API](../api/router-link.md).
