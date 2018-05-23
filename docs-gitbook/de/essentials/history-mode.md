# HTML5-Verlaufsmodus ("History Mode")

Der Standardmodus für `vue-router` ist der _Hash-Modus_. Er nutzt den URL-Hash, um eine komplette URL zu simulieren, damit die Seite nicht neu geladen wird, wenn sich die URL ändert.

Um ohne Hash zu arbeiten, nutzt man den **Verlaufsmodus**, welcher die `history.pushState`-API von HTML5 nutzt, um URL-Navigation ohne Reload zu erreichen:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Bei Nutzung des Verlaufsmodus sieht die URL "normal" aus, zB. `http://meine-seite.de/benutzer/id` - Wunderschön!

Es gibt jedoch ein Problem: Da unsere App eine so genannte "Single Page Application (SPA)" ist, die komplett im Browser läuft, erhält der Nutzer einen 404-Fehler, wenn er `http://meine-seite.de/benutzer/id` direkt aufruft - denn unter diesem Pfad wird dein Webserver nichts finden.

Aber keine Sorge: Um dieses Problem zu beheben, musst du nur eine einzige "catch-all"-Route in deiner Serverkonfiguration ergänzen. Wenn die URL zu keiner statischen Datei gehört, sollte diese Route immer die `index.html` an den Browser senden, in der deine App läuft ist.

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

Für Node.js/Express benutz du am besten [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

## Warnung

Es gibt einen kleinen Nachteil: Der Server wird  keine 404-Fehler mehr melden, da alle nicht gefundenen Pfade zur `index.html` führen. Um das zu beheben, solltest du eine Sammel-Route in der Vue-App für die 404-Seite definieren.

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternativ kann man bei einem Node.js-Server den Fallback nutzen, indem man das serverseitige Router-System den 404-Fehler ausgeben lässt, sollte die URL auf keine Route treffen, die deine Vue-App kennt.
