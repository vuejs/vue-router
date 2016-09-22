# HTML5 History Mode

The default mode for `vue-router` is hash mode - it uses the URL hash to simulate a full URL so that the page won't be reloaded when the URL changes.

To get rid of the ugly hash, we can use the router's **history mode**, which leverages the `history.pushState` API to achieve URL navigation without page reload:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

But for this mode to work properly, you need to configure your server properly. When using history mode, the URL will look like a normal url, e.g. `http://yoursite.com/user/id`. Since our app is a single page client side app, without proper server configuration the users will get a 404 if they visit that URL directly.

Therefore you need to add a catch-all fallback route to your server: if the URL doesn't match any static assets, it should serve the same `index.html` page that your app lives in.

## Example Server Configurations

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

https://github.com/bripkens/connect-history-api-fallback

## Caveats

There is a caveats to this, because that your server will no longer report 404 errors as all paths will serve up your `index.html` file. To get around the issue, you should implement a catch-all route within your Vue app to show a 404 page:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternatively, if you are using a Node.js server, you can implement the fallback by using the router on the server side to match the incoming URL, and respond with 404 if no route is matched.
