# Guardias de navegación

Como el nombre sugiere, los guardias de navegación provistas por `vue-router` son básicamente utilizadas para proteger rutas de navegación ya sea redireccionando o cancelandolas. Hay varias maneras de engancharse en el proceso de navegación de rutas: globalmente, por ruta o dentro de los componentes.

Recuerde **Los cambios en los parámetros o las _queries_ no harán que se ejecuten los guardias de navegación**. Simplemente [observe el objeto `$route`](../essentials/dynamic-matching.md#reacting-to-params-changes) para obtener reactividad frente a esos cambios.

### Guardias globales

Puede registrar guardias _before_ globales usando `router.beforeEach`:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Los guardias _before_ globales son llamados por orden de creación, cuando una navegación es disparada. Los guardias pueden ejecutarse asincrónicamente, y la navegación se considera **pendiente** antes que todos los _hooks_ sean resueltos. 

Cada función guardia recibe tres argumentos:

- **`to: Route`**: el [Objeto Route](../api/route-object.md) hacia donde se navega.

- **`from: Route`**: la ruta actual desde la cual se navega.

- **`next: Function`**: esta función debe ser ejecutada para **resolver** el _hook_. La acción a realizar depende de los argumentos provistos a `next`:

  - **`next()`**: moverse al siguiente _hook_ en la cadena. Si no queda ninguno, la navegación se **confirma**.

  - **`next(false)`**: cancelar la navegación actual. Si la URL en el navegador cambió (ya sea manualmente o a través del botón _atrás_), será reseteada al valor de la ruta `from`.

  - **`next('/')` o `next({ path: '/' })`**: redirecciona a una ruta diferente. La navegación actual será abortada y una nueva será iniciada.

**Asegúrese de llamar siempre a la función `next`, de otra manera el _hook_ nunca será resuelto.**

También puede registrar _hooks after_ globales. Sin embargo, a diferencia de los guardias, estos _hooks_ no reciben una función `next` y no pueden afectar la navegación:

``` js
router.afterEach((to, from) => {
  // ...
})
```

### Guardias por ruta

Puede definier guardias `beforeEnter` directamente en el objeto de configuración de una ruta:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

Estos guardias tienen exactamente la misma firma que los guardias _before_ globales.

### Guardias en componentes

Por último, puede directamente definir guardias de navegación dentro de los componentes de ruta (los que son pasados a la configuración del enrutador) con las siguientes opciones:

- `beforeRouteEnter`
- `beforeRouteUpdate` (agregado en la versión 2.2)
- `beforeRouteLeave`

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // se llama antes que la ruta que renderiza este componente sea confirmada.
    // NO tiene acceso a la instancia del componente `this`,
    // ¡porque no ha sido creada todavía cuando este guardia es ejecutado!
  },
  beforeRouteUpdate (to, from, next) {
    // se llama cuando la ruta que renderiza este componente ha cambiado,
    // pero este componente es reusado en la nueva ruta.
    // Por ejemplo, para una ruta con parámetros dinámicos /foo/:id, cuando
    // navegamos desde /foo/1 havia /foo/2, la misma instancia del componente Foo
    // será reusada, y este _hook_ será llamado cuando eso suceda.
    // Tiene acceso a la instancia del componente `this`
  },
  beforeRouteLeave (to, from, next) {
    // se llama cuando la ruta que renderiza el componente está por ser
    // abandonada.
    // Tiene acceso a la instancia del componente `this`
  }
}
```

El guardia `beforeRouteEnter` **NO** tiene acceso a `this`, porque es ejecutado antes que la navegación sea confirmada, por lo tanto el componente destino todavía no ha sido creado.

Sin embargo, puede acceder a la instancia pasando una _callback_ a `next`. La _callback_ se ejecutará cuando la navegación sea confirmada, y la instancia del componente será pasada como argumento:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // acceda a la instancia del componente a través de `vm`
  })
}
```

Puede acceder directamente a `this` dentro de `beforeRouteLeave`. El guardia _leave_ se usa normalmente para prevenir al usuario cuando intenta abandonar la ruta accidentalmente sin guardar cambios. La navegación puede ser cancelada ejecutando `next(false)`.
