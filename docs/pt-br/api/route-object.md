# O objeto da rota

O **route object** representa o estado da rota ativa atual. Contém informações analisadas do URL atual e os ** registros de rotas ** correspondentes ao URL.

O objeto de rota é imutável. Toda navegação bem-sucedida resultará em um novo objeto de rota.

O objeto de rota pode ser encontrado em vários locais:

- Componentes internos como `this.$route`

- Dentro dos callbacks do observador `$route`

- Como o valor de retorno do chamado `router.match(location)`

- Protetores de navegação internos como os dois primeiros argumentos:

  ``` js
  router.beforeEach((to, from, next) => {
    // `to` and `from` are both route objects
  })
  ```

- Dentro da função `scrollBehavior` como os dois primeiros argumentos:

  ``` js
  const router = new VueRouter({
    scrollBehavior (to, from, savedPosition) {
      // `to` and `from` are both route objects
    }
  })
  ```

### Propriedades do objeto da rota

- **$route.path**

  - type: `string`

    Uma string que é igual ao caminho da rota atual, sempre resolvida como um caminho absoluto. por ex. `"/foo/bar"`.

- **$route.params**

  - type: `Object`

    Um objeto que contém key/value pares de segmentos dinâmicos e segmentos de estrela. Se não houver params, o valor será um objeto vazio.

- **$route.query**

  - type: `Object`

    Um objeto que contém key/value pares da seqüência de consulta. Por exemplo, para um caminho `/foo?user=1`, recebemos `$route.query.user == 1`. Se não houver consulta, o valor será um objeto vazio.

- **$route.hash**

  - type: `string`

    O hash da rota atual (com o `#`), se tiver um. Se nenhum hash estiver presente, o valor será uma string vazia.

- **$route.fullPath**

  - type: `string`

    O URL completo, resolvido, incluindo consulta e hash.

- **$route.matched**

  - type: `Array<RouteRecord>`

  Uma matriz contendo **route records** para todos os segmentos de caminho aninhados da rota atual. Os registros de rotas são as cópias dos objetos no `routes` configura Array (e em `children` Arrays):

  ``` js
  const router = new VueRouter({
    routes: [
      // the following object is a route record
      { path: '/foo', component: Foo,
        children: [
          // this is also a route record
          { path: 'bar', component: Bar }
        ]
      }
    ]
  })
  ```

  Quando o URL é `/foo/bar`, `$route.matched` será uma matriz contendo ambos os objetos (clonados), na ordem principal para o filho.

- **$route.name**

  O nome da rota atual, se tiver um. (Veja [Named Routes](../essentials/named-routes.md))

- **$route.redirectedFrom**

  O nome da rota sendo redirecionado, se houvesse um. (Veja [Redirect and Alias](../essentials/redirect-and-alias.md))
