# Inyección en componentes

### Propiedades inyectadas

Estas propiedades son inyectadas dentro de cada componente hijo pasando la instancia del `router` a la instancia principal como la opción `router`.

- #### $router

  La instancia del `router`.

- #### $route

  El objeto [Route activo](route-object.md). Esta propiedad es de solo lectura y sus propiedades son inmutables, pero puede ser observada.

### Opciones habilitadas

- **beforeRouteEnter**
- **beforeRouteUpdate** (agregado en 2.2)
- **beforeRouteLeave**

  Más información en [guardias en componentes](../advanced/navigation-guards.md#incomponent-guards).
