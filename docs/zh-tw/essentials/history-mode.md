
# HTML5 History 模式

`vue-router` 默認 hash 模式 —— 使用 URL 的 hash 來模擬一個完整的 URL，於是當 URL 改變時，頁面不會重新加載。

如果不想要很醜的 hash，我們可以用路由的 **history 模式**，這種模式充分利用 `history.pushState` API 來完成 URL 跳轉而無須重新加載頁面。

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

當你使用 history 模式時，URL 就像正常的 url，例如 `http://yoursite.com/user/id`，也好看！

不過這種模式要玩好，還需要後台配置支持。因為我們的應用是個單頁客戶端應用，如果後台沒有正確的配置，當用戶在瀏覽器直接訪問 `http://oursite.com/user/id` 就會返回 404，這就不好看了。

所以呢，你要在服務端增加一個覆蓋所有情況的候選資源：如果 URL 匹配不到任何靜態資源，則應該返回同一個 `index.html` 頁面，這個頁面就是你 app 依賴的頁面。

## 後端配置例子

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

#### 原生 Node.js

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http.createServer((req, res) => {
  fs.readFile('index.htm', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open 'index.htm' file.')
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

#### 基於 Node.js 的 Express

對於 Node.js/Express，請考慮使用 [connect-history-api-fallback 中間件](https://github.com/bripkens/connect-history-api-fallback)。

#### Internet Information Services (IIS)

1. 安裝 [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. 在你的網站根目錄中創建一個 `web.config` 文件，內容如下：

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

## 警告

給個警告，因為這麼做以後，你的服務器就不再返回 404 錯誤頁面，因為對於所有路徑都會返回 `index.html` 文件。為了避免這種情況，你應該在 Vue 應用裡面覆蓋所有的路由情況，然後在給出一個 404 頁面。

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

或者，如果你使用 Node.js 服務器，你可以用服務端路由匹配到來的 URL，並在沒有匹配到路由的時候返回 404，以實現回退。更多詳情請查閲 [Vue 服務端渲染文檔](https://ssr.vuejs.org/zh/)。

