# Mode historique de HTML5

Le mode par défaut de `vue-router` est le _mode hash_. Il utilise la partie hash de l'URL pour simuler un URL complet et ainsi ne pas recharger la page quand l'URL change.

Pour nous passer du hash, nous pouvons utiliser le **mode historique** qui utilisera l'API `history.pushState` afin de permettre une navigation sans rechargement de page :

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Quand vous utilisez le mode historique, l'URL ressemblera à n'importe quel URL normal. Par ex. `http://oursite.com/user/id`. Magnifique !

Cependant, un problème apparait si votre application est une application monopage cliente. Sans une configuration serveur adaptée, les utilisateurs tomberont sur une page d'erreur 404 en tentant d'accéder à `http://oursite.com/user/id` directement dans leur navigateur. Maintenant ça craint.

Ne vous inquiétez pas. Pour résoudre ce problème, il vous suffit d'ajouter une route à votre serveur prenant en compte toutes les adresses demandées. Si l'URL demandée ne concorde avec aucun fichier statique, alors il doit toujours renvoyer la page `index.html` qui contient le code de votre application. De nouveau magnifique !

## Exemple de configurations serveur

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

#### Node.js natif

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http.createServer((req, res) => {
  fs.readFile('index.htm', 'utf-8', (err, content) => {
    if (err) {
      console.log(`Impossible d'ouvrir le fichier "index.htm"`)
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })

    res.end(content)
  })
}).listen(httpPort, () => {
  console.log('Le serveur écoute à : http://localhost:%s', httpPort)
})
```

#### Node.js avec Express

Pour Node.js avec Express, vous pouvez utiliser le [middleware connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback).

#### Internet Information Services (IIS)

1. Instaler [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Créer un fichier `web.config` dans le répertoire racine de votre site avec le contenu suivant :

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

#### Hébergement Firebase

Ajouter ceci à votre fichier `firebase.json` :

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

## Limitation

Il y a une limitation a tout ceci. Votre serveur ne renverra plus les erreurs 404 des chemins qui ne sont pas trouvés puisqu'il va servir à présent le fichier `index.html`. Pour contourner ce problème, vous pouvez implémenter une route concordant avec toutes les adresses en 404 dans votre application Vue :

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Une alternative possible, si vous utilisez un serveur Node.js, est d'implémenter ce mécanisme de substitution en utilisant le routeur côté serveur pour vérifier la concordance des demandes d'URL entrant. Si la route ne concorde avec rien, la page est inexistante. Consultez l'[utilisation de Vue côté serveur](https://ssr.vuejs.org/fr/) pour plus d'informations.
