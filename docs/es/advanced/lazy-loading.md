# Lazy loading

Cuando se construyen aplicaciones con un sistema de empaquetamiento de módulos, el archivo JavaScript resultante puede terminar siendo muy grande, afectando los tiempos de carga de la página. Sería más eficiente si pudiesemos dividir los componentes de cada ruta en porciones separadas y cargarlas solo cuando esa ruta es visitada.

Combinando [las características asíncronas de componentes de Vue](http://vuejs.org/guide/components.html#Async-Components) y las características de división de código de [Webpack](https://webpack.js.org/guides/code-splitting-require/), es trivial el _lazy loading_ de componentes de ruta.

Todo lo que necesitamos es definir nuestros componentes de rutas como asíncronos:

``` js
const Foo = resolve => {
  // require.ensure es la sintaxis especial de Webpack para indicar un punto de división de código.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

Hay una alternativa a la sintaxis de división de código utilizando _require_ como lo hace AMD, por lo que puede simplificarse como:

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

Nada debe cambiarse en la configuración del _router_, solo utiliza `Foo` como lo harías normalmente:

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Agrupando componentes en la misma porción

A veces deseamos agrupar todos los componentes bajo la misma ruta en la misma porción asíncrona. Para lograr esto, necesitamos usar [porciones con nombre](https://webpack.js.org/guides/code-splitting-require/#chunkname) proveyendo un nombre de porción a `require.ensure` como el tercer argumento:

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack agrupará los módulos asíncronos con el mismo nombre dentro de la misma porción asíncrona - esto también significa que no necesitamos más listar explícitamente las dependencias de `require.ensure` (por lo tanto pasamos un array vacío).
