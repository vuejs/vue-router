# Режим HTML5 History

Режимом по умолчанию для `Vue-router` является _hash mode_, использующий хэш URL'а для симуляции полного URL-адреса, что позволяет избежать перезагрузки страницы при изменении URL.

Мы можем обойтись без хэша, используя **history mode**, который работает с API `history.pushState` для достижения той же цели:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

При использовании history mode URL выглядит естественно, например: `http://oursite.com/user/id`. Прекрасно!

Возникает, однако, и проблема: поскольку наше приложение — одностраничное, не сконфигурировав соответствующим образом сервер мы заставим пользователей получать ошибку 404, если они перейдут по `http://oursite.com/user/id` напрямую. Вот это уже прекрасным не назвать.

Не спешите расстраиваться: всё, что нужно — единственная "резервная" запись в конфигурации сервера. Если URL не совпадает ни с одним статическим файлом, сервер должен просто отдать `index.html`, в котором и живёт наше приложение. И снова, прекрасно!

## Примеры конфигурации серверов

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

При использовании Node.js/Express, мы рекомендуем пользоваться [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

## Предостережение

При таком подходе возникает одно неприятное последствие: сервер больше не будет выдавать ошибки 404, так как обслуживание всех путей отдаётся на откуп клиентскому роутингу. Частично эту проблему можно решить, указав путь по умолчанию во Vue-router:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Если же вы используете на сервере Node.js, уже на стороне сервера можно задействовать конфигурацию роутера и решить таким образом проблему целиком.
