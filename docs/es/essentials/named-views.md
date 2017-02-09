# Vistas con nombre

A veces es necesario mostrar múltiples vistas al mismo tiempo en lugar de anidarlas, por ejemplo, cuando se crea una plantilla con una vista `sidebar` y una vista `main`. Aquí es cuando las vistas con nombre se vuelven útiles. En lugar de tener un solo _outlet_ es su vista, puede tener varios y darle a cada uno un nombre diferente. Por defecto, un `router-view` sin nombre se llamará `default`.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

Una vista se renderiza utilizando un componente, por lo tanto, múltiples vistas requerirán múltiples componentes para la misma ruta. Asegúrese de usar la opción `components` (con una _s_ al final):

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

Puede ver una demostración de este ejemplo 
[aquí](https://jsfiddle.net/posva/6du90epg/).
