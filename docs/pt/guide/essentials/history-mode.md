# Modo History da HTML5

O modo padrão para `vue-router` é _modo de hash_ - ele usa a hash na URL para simular uma URL completa, assim a página não será recarregada quando a URL mudar.

Para se livrar do hash, nós precisamos usar o **modo history** do router, que influencia a API `history.pushState` a alcançar a URL da navegação sem um recarregamento de página:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

Quando usamos o modo history, a URL irá parecer "normal", exemplo: `http://oursite.com/user/id`. Lindo!

Aqui surgi um problema, embora: Visto que nossa aplicação é uma aplicação do lado do cliente de página única (single page), sem uma configuração de servidor própria, os usuários irão receber um erro 404 se eles acessarem `http://oursite.com/user/id` diretamente em seus navegadores (browser). Agora está feio.

Não se preocupe: para resolver o problema, tudo o que você precisa fazer é adicionar uma simples rota para capturar tudo como fallback no seu servidor. Se a URL não corresponder a qualquer arquivo estático, ela deveria servir a mesma página `index.html` onde sua aplicação se encontra. Lindo, de novo!

## Exemple de Configuração de Servidor

**Note**: Os exemplos que se seguem assumem que você está servindo sua aplicação a partir da pasta raiz. Se você instalar numa subpasta, você deveria usar [a opção `publicPath` do Vue CLI](https://cli.vuejs.org/config/#publicpath) e o relacionar a [propriedade `base` do router](https://router.vuejs.org/api/#base). Você também precisa ajustar os exemplos abaixo para usar a subpasta ao invés da pasta raiz (exemplo: substituindo `RewriteBase /` por `RewriteBase /nome-da-sua-subpasta`).

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

Ao invés de `mod_rewrite`, você poderia também usar [`FallbackResource`](https://httpd.apache.org/docs/2.2/mod/mod_dir.html#fallbackresource).

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Node.js Nativo

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

#### Node.js com Express

Para Node.js/Express, considere usar [o intermediário connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback).


### Internet Information Services (IIS)

1. Instale [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Crie uma arquivo `web.config` na raiz do diretório do seu site com o seguinte:

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

Adiciona isto ao seu `firebase.json`:

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

## Aviso

Existe um aviso para isso: Seu servidor não irá mais reportar erros 404 como todos os caminhos não encontrados porque agora ele serve o seu arquivo `index.html`. Para dar a volta ao problema, você deveria implementar uma rota de captura global dentro de sua aplicação Vue para mostrar uma página 404:

``` js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

Alternativamente, se você estiver usando um servidor Node.js, você pode implementar o fallback pelo uso do router no lado do servidor, para capturar a chegada da URL e responder com 404 se não houver rota para ela. Consulte a [documentação do Vue renderizado no lado do servidor](https://ssr.vuejs.org/en/) para mais informações.
