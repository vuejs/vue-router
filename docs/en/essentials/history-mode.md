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

For Node.js/Express, consider using [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

#### Internet Information Services (IIS)
```
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
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
      <httpErrors>     
          <remove statusCode="404" subStatusCode="-1" />                
          <remove statusCode="500" subStatusCode="-1" />
          <error statusCode="404" path="/survey/notfound" responseMode="ExecuteURL" />                
          <error statusCode="500" path="/survey/error" responseMode="ExecuteURL" />
      </httpErrors>
      <modules runAllManagedModulesForAllRequests="true"/>
  </system.webServer>
</configuration>
```

## Caveat

There is a caveat to this: Your server will no longer report 404 errors as all not-found paths now serve up your `index.html` file. To get around the issue, you should implement a catch-all route within your Vue app to show a 404 page:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternatively, if you are using a Node.js server, you can implement the fallback by using the router on the server side to match the incoming URL and respond with 404 if no route is matched.
