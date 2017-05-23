# Redireccionamiento y alias

### Redireccionamiento

El redireccionamiento también se realiza en la configuración de `routes`. Para redireccionar desde `/a` hasta `/b`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```

EL redireccionamiento también puede apuntar a una ruta con nombre:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```

O incluso puedes utilizar una función para un redireccionamiento dinámico:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // la función recibe la ruta destino como argumento
      // retorna aquí la ruta de redirección.
    }}
  ]
})
```

Para otros usos avanzados, tienes el siguiente [ejemplo](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js).

### Alias

Una redirección significa que el usuario visita `/a`, y la URL será reemplazada por `/b`, para luego ejecutar el código correspondiente a `/b`. Pero, ¿qué es un alias?

**Un alias de `/a` como `/b` significa que cuando el usuario visita `/b`, la URL se mantiene como `/b`, pero el código ejecutado corresponderá al mismo que si el usuario visitase `/a`.**

Lo anterior puede ser expresado en la configuración de enrutamiento como:

``` js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

Un alias te da la libertad de mapear una estructura de _UI_ a una URL arbitraria, en lugar de estar restringido por la estructura anidada de la configuración.

Para otros usos avanzados, aquí tienes un [ejemplo](https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js).
