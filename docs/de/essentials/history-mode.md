# HTML5-Verlaufsmodus

Der Standardmodus für `vue-router` ist der **Hash-Modus**. Es nutzt den URL-Hash, um eine komplette URL zu simulieren, damit die Seite nicht neu geladen wird, wenn sich die URL ändert.

Um ohne Hash zu arbeiten, nutzt man den **Verlaufsmodus**, welcher die `history.pushState`-API nutzt, um URL-Navigation ohne Seitenladen zu erreichen:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Bei Nutzung des Verlaufsmodus sieht die URL "normal" aus, zB. `http://meine-seite.de/benutzer/id` - wunderbar!

Es gibt jedoch ein Problem: Da unsere App eine einseitige (Single Page)
und im browserlaufende App ist, erhält der Nutzer einen 404-Fehler, wenn er `http://meine-seite.de/benutzer/id` direkt aufruft.

Aber keine Sorge: Um den Fehler zu beheben, ist eine einzige Angabe einer Sammel-Route bei der Serverkonfiguration notwendig. Wenn die URL zu keiner statischen Datei gehört, lädt es die gleiche `index.html`, in der die App vorhanden ist.

## Beispiel einer Serverkonfiguration

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

Für Node.js/Express nutze [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

## Warnung

Der Server wird nicht länger einen 404-Fehler darstellen, da alle nicht gefundenen Pfade zur `index.html` führen. Um dies zu beheben, sollte man eine Sammel-Route in der Vue-App für die 404-Seite definieren.

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternativ kann man bei einem Node.js-Server den Fallback nutzen, indem man das serverseitige Router-System den 404-Fehler ausgeben lässt, sollte die URL auf keine Route treffen.
