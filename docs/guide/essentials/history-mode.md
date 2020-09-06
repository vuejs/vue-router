# HTML5 History Mode

The default mode for `vue-router` is _hash mode_ - it uses the URL hash to simulate a full URL so that the page won't be reloaded when the URL changes.

To get rid of the hash, we can use the router's **history mode**, which leverages the `history.pushState` API to achieve URL navigation without a page reload:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

When using history mode, the URL will look "normal," e.g. `http://oursite.com/user/id`. Beautiful!

Here comes a problem, though: Since our app is a single page client side app, without a proper server configuration, the users will get a 404 error if they access `http://oursite.com/user/id` directly in their browser. Now that's ugly.

Not to worry: To fix the issue, all you need to do is add a simple catch-all fallback route to your server. If the URL doesn't match any static assets, it should serve the same `index.html` page that your app lives in. Beautiful, again!

## Example Server Configurations

**Note**: The following examples assume you are serving your app from the root folder. If you deploy to a subfolder, you should use [the `publicPath` option of Vue CLI](https://cli.vuejs.org/config/#publicpath) and the related [`base` property of the router](https://router.vuejs.org/api/#base). You also need to adjust the examples below to use the subfolder instead of the root folder (e.g. replacing `RewriteBase /` with `RewriteBase /name-of-your-subfolder/`).

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

Instead of `mod_rewrite`, you could also use [`FallbackResource`](https://httpd.apache.org/docs/2.2/mod/mod_dir.html#fallbackresource).

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Native Node.js

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http.createServer((req, res) => {
  fs.readFile('index.html', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open "index.html" file.')
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(content)
  })
}).listen(httpPort, () => {
  console.log('Server listening on: http://localhost:%s', httpPort)
})
```

#### Express with Node.js

For Node.js/Express, consider using [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

#### Internet Information Services (IIS)

1. Install [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Create a `web.config` file in the root directory of your site with the following:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

#### Caddy

```
rewrite {
    regexp .*
    to {path} /
}
```

#### Firebase hosting

Add this to your `firebase.json`:

```
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Caveats

### Reporting 404 errors

There is a caveat to this: Your server will no longer report 404 errors as all not-found paths now serve up your `index.html` file. To get around the issue, you should implement a catch-all route within your Vue app to show a 404 page:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternatively, if you are using a Node.js server, you can implement the fallback by using the router on the server side to match the incoming URL and respond with 404 if no route is matched. Check out the [Vue server side rendering documentation](https://ssr.vuejs.org/en/) for more information.

### Navigation Guards

An issue may be caused if the user manually enters another URL pointing to our single page client side app. The browser navigation creates a new context for Vue Router, which means it is not possible any more for it to send the user back using `next(false)` inside Global Before Guards (`router.beforeEach()`). Doing so can result in an empty view (blank page), since the navigation being aborted is an initial navigation to (re)load our SPA. This could also be an issue when using hash mode, if the user navigates to an invalid URL that does not start with `#`, but for most practical cases Global Before Guards work as expected when navigating between URLs starting with `#`, even if done by manipulating the URL in the browser's address bar.

As a workaround one can use Global After Hooks (`router.afterEach()`) to store the target route on each sucessful navigation in a cookie or sessionStorage, and instead of using `next(false)` provide the last valid stored route to `next`. Indeed it is not the same as calling `next(false)` as in this case a navigation happens, but one can examine `from` to decide when it is appropriate to call `next(false)` and when it is adequate to use an alternative.

``` js
router.beforeEach((to, from, next) => {
  if ( shouldAbort ) {
    if ( from.matched.length ) next(false)
    else next({ path: sessionStorage.getItem('last_route') || '/' })
  }
  else next()
})
router.afterEach((to, from) => {
  sessionStorage.setItem( 'last_route', to.fullPath )
})
```
