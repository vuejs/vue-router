# Navegación mediante código

Además de utilizar `<router-link>` para crear etiquetas `a` para una navegación declarativa, podemos hacer lo mismo a través de código usando los métodos de la instancia del enrutador.

#### `router.push(location, onComplete?, onAbort?)`

**Nota: Dentro de una instancia de Vue, tienes acceso a la instancia del router a través de `$router`. Por lo tanto puedes llamar a `this.$router.push`.**

Para navegar a una URL diferente, utiliza `router.push`. Este método agrega una nueva entrada a la pila del historial, por lo que cuando el usuario presione el botón _volver_ del navegador, será llevado a la URL anterior.

Este método es el que se llama internamente cuando se hace clic en un componente `<router-link>`, por lo que`<router-link :to="...">` es el equivalente a ejecutar `router.push(...)`.

| Declarativo | Mediante código |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

El argumento puede ser una cadena de texto o un objeto descriptor. Por ejemplo:

``` js
// cadena de texto literal
router.push('home')

// Objeto
router.push({ path: 'home' })

// Ruta con nombre
router.push({ name: 'user', params: { userId: 123 }})

// Con _query_, con lo que se obtiene /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

A partir de la version 2.2.0+, puedes opcionalmente pasar _funciones callbacks_ `onComplete` y `onAbort` a `router.push` o `router.replace` como segundo y tercer argumento. Estas _funciones callbacks_ serán ejecutadas cuando la navegación sea completada exitosamente (luego que todos los _hooks_ asíncronos sean resueltos), o abortada (navegando a la misma ruta, o a una ruta diferente antes que la navegación actual haya finalizado), respectivamente.

#### `router.replace(location, onComplete?, onAbort?)`

Actúa como `router.push`, la única diferencia es que navega sin agregar una nueva entrada al historial, como su nombre sugiere - reemplaza la entrada actual.

| Declarativo | Mediante código |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### `router.go(n)`

Este método toma un entero como parámetro que indica cuantos pasos avanzar o retroceder en el historial, similar a `window.history.go(n)`.

Ejemplos

``` js
// Ir hacia adelante un paso, similar a history.forward()
router.go(1)

// Ir hacia atrás un paso, similar a history.back()
router.go(-1)

// Ir 3 pasos hacia adelante
router.go(3)

// Falla silenciosamente si no existe esa cantidad de registros en el historial
router.go(-100)
router.go(100)
```

#### Manipulación del historial

Seguramente notaste que `router.push`, `router.replace` y `router.go` son contra partes de [`window.history.pushState`, `window.history.replaceState` y `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), y que imitan a las API de `window.history`.

Por lo tanto, si estás familiarizado con las [API del historial del navegador](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipularlo será muy sencillo con vue-router.

Vale la pena mencionar que los métodos de navegacion de vue-router (`push`, `replace`, `go`) funcionan consistentemente en todos los modos de trabajo del `router` (`history`, `hash` y `abstract`).
