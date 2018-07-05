# La instancia de Router

### Propiedades

#### router.app

- tipo: `Vue instance`

  La instancia principal de Vue donde `router` fue inyectado.

#### router.mode

- tipo: `string`

  El [modo](options.md#mode) que `router` está utilizando.

#### router.currentRoute

- tipo: `Route`

  La ruta actual representada como un [objeto Route](route-object.md).

### Métodos

- **router.beforeEach(guard)**
- **router.beforeResolve(guard)** (2.5.0+)
- **router.afterEach(hook)**

  Agrega guardias de navegación globales. Info: [guardias de navegación](../advanced/navigation-guards.md).

  A partir de la versión 2.5.0 los tres métodos devuelven una función que elimina el guardia/hook registrado.

- **router.push(location, onComplete?, onAbort?)**
- **router.replace(location, onComplete?, onAbort?)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Navega mediante código a una nueva URL. Info: [navegación mediante código](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Devuelve un array de componentes (definiciones/constructores, no instancias) que coincidan con la ubicación provista o la ruta actual. Se utiliza principalmente durante el renderizado del lado servidor para realizar precarga de datos.

- **router.resolve(location, current?, append?)**

  > 2.1.0+

  Resolución inversa de URL. Dada una ubicación de la misma forma que las usadas en `<router-link/>`, devuelve un objeto con las siguiente propiedades:

  ``` js
  {
    location: Location;
    route: Route;
    href: string;
  }
  ```

- **router.addRoutes(routes)**

  > 2.2.0+

  Agrega dinámicamente más rutas al `router`. El argumento debe ser un array utilizando el mismo formato de configuración que las opciones del constructor de `routes`.

- **router.onReady(callback, [errorCallback])**

  > 2.2.0+

  Este método pone una _función callback_ en espera a ser llamada cuando el `router` haya completado la navegación inicial, lo cual significa que ya ha resuelto todos los _hooks_ de entrada asíncronos y los componentes asíncronos asociados con la ruta inicial.

  Esto es útil en el renderizado del lado servidor para asegurar un resultado consistente tanto en el servidor como en el cliente.

  El segundo argumento, `errorCallback`, solo es soportado a partir de la versión 2.4. Será llamado cuando la resolución de ruta inicial devuelva un error (por ejemplo, cuando falla la resolución de un componente asíncrono).

- **router.onError(callback)**

  > 2.4.0+

  Registra una _función callback_ la cual será llamada cuando un error es capturado durante la navegación. Ten en cuenta que sucederá solo en las siguientes situaciones:

  - El error es lanzado sincrónicamente dentro de una función de guardia de ruta;

  - El error es capturado y manejado asíncronamente llamando a `next(err)` dentro de una función de guardia de ruta;

  - El error ocurre cuando se intenta resolver un componente asíncrono que es necesario para renderizar una ruta.
