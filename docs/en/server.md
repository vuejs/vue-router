# Server Configuration for history mode

The Router's history mode enables the use of the HTML5 pushstate adding the ability for your app to change the URL of your site without refreshing the page, and without the use of the hashbang in the URL. Using this mode however requires some pre-configuration of your server otherwise when a user visits deep linked content they'll be served a 404 Not Found. Below you can find configuration samples for several server softwares.

There are a few caveats to this, in that your server will no longer report 404 errors as all paths will serve up your index.html file. To get around this issue you should implement a catch-all route and display a 404 page within your Vue app. See the [Caveats](#caveats) section for more information.

 - [Server Configurations](#server-configurations)
   - [Apache](#apache)
   - [nginx](#nginx)
 - [Caveats](#caveats)

## Server Configurations

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

## Caveats

To get around the issue that the server will no longer serve 404 errors you should implement a catch-all route within your Vue app to show a 404 page.

```javascript
new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```
