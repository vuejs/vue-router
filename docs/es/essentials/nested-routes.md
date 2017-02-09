# Rutas anidadas

Las interfaces de usuario (UI por sus siglas en inglés) de aplicaciones reales normalmente están compuestas por componentes que están anidados varios niveles. Es también muy común que los segmentos de una URL correspondan a cierta estructura de componentes anidados, por ejemplo:

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

Con `vue-router` es muy simple expresar esta relación usando configuraciones de rutas anidadas.

Dada la aplicación que creamos en el capítulo anterior:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

Aquí, `<router-view>` es un _outlet_ de nivel superior. Renderiza el componente que coincida con una ruta de nivel superior. Así, un componente renderizado puede contener su propio `<router-view>` anidado. Por ejemplo, si agregamos uno dentro de la plantilla del componente `User`:

``` js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

Para renderizar componentes dentro de este _outlet_ anidado, necesitamos usar la opción `children` en la configuración del constructor de `VueRouter`:

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // UserProfile será renderizado en el <router-view> dentro de User
          // cuando /user/:id/profile coincida
          path: 'profile',
          component: UserProfile
        },
        {
          // UserPosts será renderizado en el <router-view> dentro de User
          // cuando /user/:id/posts coincida
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Note que las rutas anidadas que empiecen con `/` serán tratadas como absolutas. Esto permite aprovechar el anidamiento de componentes sin tener que usar URL anidadas.**

Como puede ver, la opción `children` es simplemente otro arreglo de objetos de configuración de rutas, como `routes`. Por lo tanto, puede anidar tantas vistas como necesite.

En este punto, con la configuración anterior, cuando visite `/user/foo`, nada será renderizado dentro de, _outlet_ de  `User`, porque ninguna sub ruta coincidió. Tal vez quiera renderizar algo ahí. En ese caso, puede proveer una sub ruta vacía:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // UserHome será renderizado en el <router-view> dentro de User
        // cuando /user/:id coincida
        { path: '', component: UserHome },

        // ...otras sub rutas
      ]
    }
  ]
})
```

Puede encontrar una demostración de este ejemplo [aquí](http://jsfiddle.net/yyx990803/L7hscd8h/).
