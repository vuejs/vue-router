# Empezando

> Utilizaremos [ES2015](https://github.com/lukehoban/es6features) en el código de los ejemplos en esta guía.

Crear una aplicación de una sola página con Vue.js + vue-router es muy simple. Con Vue.js, ya estamos estructurando nuestra aplicación con componentes. Cuando agregamos vue-router, todo lo que debemos hacer es mapear nuestros componentes a las rutas e informar a vue-router donde renderizarlas. Aquí hay un ejemplo básico:

> Todos los ejemplos utilizarán la versión independiente de Vue para hacer posible el análisis de plantillas. Más detalles [aquí](http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build).

### HTML

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- Utilice el componente router-link para la navegación. -->
    <!-- especifique el enlace pasando la propiedad `to`. -->
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
// 0. Si utiliza un sistema de empaquetamiento de módulos (por ejemplo, a través de vue-cli), importe Vue y VueRoutery luego ejecute Vue.use(VueRouter).

// 1. Defina componentes de enrutamiento.
// Estos pueden ser importados desde otros archivos
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. Defina algunas rutas
// Cada ruta debe mapear a un componente. El "componente" puede
// ser un constructor de componente creado a través de
// Vue.extend(), o simplemente un objeto de opciones de componente.
// Más tarde hablaremos acerca de las rutas anidadas.
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. Cree una instancia del _router_ y pase la opción `routes`
// Puede pasar opciones adicionales aquí,
// pero mantengámoslo simple por el momento.
const router = new VueRouter({
  routes // forma corta para routes: routes
})

// 4. Cree y monte la instancia principal.
// Asegúrese de inyectar el _router_ con la opcion router para
// garantizar que toda la aplicación tenga acceso al mismo.
const app = new Vue({
  router
}).$mount('#app')

// ¡Ahora la aplicación está ejecutándose!
```

Puede consultar este [ejemplo](http://jsfiddle.net/yyx990803/xgrjzsup/).

Note que `<router-link>` obtiene automaáticamente la clase `.router-link-active` cuando la ruta a la que apunta es accedida. Puede leer más acerca de eso en la documentación de la [API](../api/router-link.md).
