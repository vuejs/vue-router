# Modo historia HTML5

El modo por defecto para `vue-router` es _hash mode_ - el cual utiliza una almohadilla para similar la URL completa para que la página no sea recargada cuando la URL cambia.

Para eliminar la almohadilla, podemos utilizar el **modo historia** del enrutador, el cual utiliza el método `history.pushState` de la API para conseguir una navegación sin recarga de página:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Cuando utilice el modo historia, la URL lucirá "normal", por ejemplo: `http://oursite.com/user/id`. ¡Hermoso!

Sin embargo, hay un problema: dado que nuestra aplicación es de una sola página del lado cliente, sin una configuración apropiada de nuestro servidor, los usuarios van a obtener errores 404 si intentan acceder directamente a `http://oursite.com/user/id` en sus navegadores. Eso es horrible.

No hay problema: para solucionar el error, todo lo que debe hacer es agregar un redireccionamiento en su servidor. Si la URL no coincide con ningún recurso estático, debe apuntar a la misma página `index.html` donde se encuentra su aplicación. Nuevamente, ¡Hermoso! 

## Ejemplos de configuraciones de servidores

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Node.js (Express)

Para Node.js/Express, considere utilizar el middleware [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback).

## Contras

Hay una contra para esto: su servidor ya no reportará errores 404 dado que todas las rutas no encontradas serán redireccionadas a su archivo `index.html`. Para solucionar este problema debe implementar dentro de su aplicación Vue una ruta por defecto para mostrar una página de error 404:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Otra solución, si utiliza un servidor Node.js, es utilizar el enrutador del lado del servidor para analizar las URL ingresadas y responder con un error 404 si ninguna ruta coincide.
