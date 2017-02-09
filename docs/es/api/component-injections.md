# Inyección de componentes

### Propiedades inyectadas

Estas propiedades son inyectadas dentro de cada componente hijo pasando la instancia del enrutador a la instancia principal como la opción `router`.

- #### $router

  La instancia del enrutador.

- #### $route

  El objeto [Route activo](route-object.md). Esta propiedad es de solo lectura y sus propiedades son inmutables, pero puede ser observada.

### Opciones habilitadas

- **beforeRouteEnter**
- **beforeRouteLeave**

  Vea [Guardias en componentes](../advanced/navigation-guards.md#incomponent-guards).
