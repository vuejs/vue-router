# Guardias de navegación

Como el nombre sugiere, las guardias de navegación provistas por `vue-router` son básicamente utilizadas para proteger rutas de navegación ya sea redireccionando o cancelándolas. Hay varias maneras de engancharse en el proceso de navegación de rutas: globalmente, por ruta o dentro de los componentes.

Recuerda: **Los cambios en los parámetros o las _queries_ no harán que se ejecuten los guardias de navegación**. Simplemente [observa el objeto `$route`](../essentials/dynamic-matching.md#reacting-to-params-changes) para poder reaccionar frente a esos cambios o utiliza el guardia `beforeRouteUpdate` en el componente.

### Guardias globales

Puedes registrar guardias _before_ globales utilizando `router.beforeEach`:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Las guardias _before_ globales son llamadas por orden de creación, cuando una navegación comienza. Las guardias pueden ejecutarse asincrónicamente, y la navegación se considera **pendiente** hasta que todos los _hooks_ sean resueltos. 

Cada función guardia recibe tres argumentos:

- **`to: Route`**: el [Objeto Route](../api/route-object.md) hacia donde se navega.

- **`from: Route`**: la ruta actual desde la cual se navega.

- **`next: Function`**: esta función debe ser ejecutada para **resolver** el _hook_. La acción a realizar depende de los argumentos provistos a `next`:

  - **`next()`**: moverse al siguiente _hook_ en la cadena. Si no queda ninguno, la navegación se **confirma**.

  - **`next(false)`**: cancelar la navegación actual. Si la URL en el navegador cambió (ya sea manualmente o a través del botón _atrás_), será reseteada al valor de la ruta `from`.

  - **`next('/')` o `next({ path: '/' })`**: redirecciona a una ruta diferente. La navegación actual será abortada y una nueva será iniciada.

  - **`next(error)`**: (2.4.0+) si el argumento pasado a `next` es una instancia de `Error`, la navegación se abortará y el error será pasado a las _funciones callback_ registradas a través de `router.onError()`.

**Asegúrese de llamar siempre a la función `next`, sino el _hook_ nunca será resuelto.**

### Guardias de resolución globales

> Nuevo en 2.5.0

A partir de la versión 2.5.0 puedes registrar un guardia global con `router.beforeResolve`. Esto es similar a `router.beforeEach`, con la diferencia que los guardias de resolución serán llamados justo antes de que la navegación sea confirmada, **después que todos los guardias en el componente y los componentes de rutas asíncronos sean resueltos**.

### Post _hooks_ globales

También puedes registrar _hooks_ globales que se ejecutarán después de que la navegación sea confirmada. Sin embargo, a diferencia de los guardias, estos _hooks_ no reciben una función `next` y no pueden afectar la navegación:

``` js
router.afterEach((to, from) => {
  // ...
})
```

### Guardias por ruta

Puedes definir guardias `beforeEnter` directamente en el objeto de configuración de una ruta:

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

Por último, puedes directamente definir guardias de navegación dentro de los componentes de ruta (los que son pasados a la configuración del `router`) con las siguientes opciones:

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

La guardia `beforeRouteEnter` **NO** tiene acceso a `this`, porque es ejecutada antes que la navegación sea confirmada, por lo tanto el componente destino todavía no ha sido creado.

Sin embargo, puedes acceder a la instancia pasando una _función callback_ a `next`. La _función callback_ se ejecutará cuando la navegación sea confirmada, y la instancia del componente será pasada como argumento:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // accede a la instancia del componente a través de `vm`
  })
}
```

Puedes acceder directamente a `this` dentro de `beforeRouteLeave`. La guardia _leave_ se utiliza normalmente para prevenir al usuario cuando intenta abandonar la ruta accidentalmente sin guardar cambios. La navegación puede ser cancelada ejecutando `next(false)`.

### El flujo de resolución de navegación completo

1. Se dispara la navegación.
2. Se llaman a los guardias _leave_ en los componentes desactivados.
3. Se llaman a los guardias `beforeEach` globales.
4. Se llaman a los guardias `beforeRouteUpdate` en los componentes reutilizados (2.2+).
5. Se llama a `beforeEnter` en las configuraciones de rutas.
6. Se resuelven componentes de rutas asíncronos.
7. Se llama a `beforeRouteEnter` en los componentes activados.
8. Se llama a los guardias globales `beforeResolve` (2.5+).
9. Se confirma la navegación.
10. Se llaman a los _hook_ globales`afterEach`.
11. Se disparan las actualizaciones del DOM.
12. Se llaman a las _funciones callback_ pasadas a `next` en los guardias `beforeRouteEnter` con las instancias creadas.
