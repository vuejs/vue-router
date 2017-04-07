# `<router-view>`

El componente `<router-view>` es un componente funcional que renderiza a otro en base a la ruta seleccionada. Los componentes renderizados en `<router-view>` pueden contener su propio `<router-view>`, el cual renderizará componentes para sub-rutas.

### Propiedades

- **name**

  - tipo: `string`

  - valor por defecto: `"default"`

  Cuando un componente `<router-view>` tiene un nombre, renderizará el componente con el nombre correspondiente en la opción `components` del registro de ruta que coincida. Accede a [vistas con nombre](../essentials/named-views.md) para más información.

### Comportamiento

Cualquier propiedad diferente a `name` será pasada al componente renderizado. De cualquier manera, la mayor parte del tiempo los datos de la ruta están contenidos dentro de los parámetros de la ruta.

Dado que es simplemente un componente, funciona con `<transition>` y `<keep-alive>`. Cuando utilices ambos en conjunto, asegúrate de usar `<keep-alive>` dentro de `<transition>`:

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
