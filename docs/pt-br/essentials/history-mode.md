# Modo histórico do HTML5

O modo padrão para `vue-router` é _hash mode_ - ele usa o URL hash para simular uma URL completa para que a página não seja recarregada quando a URL mudar.

Para se livrar do hash, podemos usar rotas **modo história**, que alavanca o `history.pushState` para navegar uma URL sem recarregar a página:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Ao usar o modo histórico, o URL ficará "normal", e.g. `http://oursite.com/user/id`. Lindo!

No entanto, vem um problema: uma vez que nossa aplicação no lado do cliente, sem uma configuração adequada do servidor, os usuários obterão um erro 404 se tiverem acesso `http://oursite.com/user/id` diretamente no seu navegador. Agora isso é feio.

Não se preocupe: para corrigir o problema, tudo o que você precisa fazer é adicionar uma rota de retorno simples ao seu servidor. Se o URL não corresponder a nenhum recurso estático, ele deve servir o mesmo `index.html`. Sua página, linda novamente!

## Exemplo de Configurações do Servidor

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

#### Node.js

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http.createServer((req, res) => {
  fs.readFile('index.htm', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open "index.htm" file.')
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

#### Express com Node.js

Para Node.js/Express, considere usar [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

#### Serviços de Informação da Internet (Internet Information Services - IIS)

1. Instalação [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Crie um arquivo `web.config` no diretório raiz de sua aplicação com o seguinte código:

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

#### Firebase

Adicione isso ao seu `firebase.json`:

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

## Caveat

Há uma advertência para isso: Seu servidor não informará mais 404 erros, pois todos os caminhos não encontrados são apontados para o arquivo `index.html`. Para contornar o problema, você deve implementar uma rota global em seu aplicativo do Vue para mostrar uma página 404:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Uma alternativa se você estiver usando um servidor Node.js, é implementar o retorno usando a rota do lado do servidor para coincidir com a URL recebida e responder com 404 se nenhuma rota for correspondida. Confira [Vue server side rendering documentation](https://ssr.vuejs.org/en/) para mais informações.