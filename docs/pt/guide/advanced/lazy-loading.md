# Carregamento preguiço de rotas

<div class="vueschool"><a href="https://vueschool.io/lessons/how-to-lazy-load-routes-with-vue-router?friend=vuejs" target="_blank" rel="sponsored noopener" title="Aprenda como aumentar a performace atráves do carregamento prequiçoso de rotas na Vue School">Aprenda como aumentar a performace atráves do carregamento prequiçoso de rotas na Vue School</a></div>

Quando construimos aplicações em conjunto com um empacotador, o pacote de JavaScript pode vir a se tornar consideravelmente grande, e por consequência afetar tempo de carregamento da página. Seria muito mais eficiente se nós pudessimos dividir cada componente de rota dentro de um pacote pequeno, e somente carregar-los quando a rota for visitada.

Combinar a [funcionalidade de componente assincrono](https://vuejs.org/guide/components.html#Async-Components) do Vue e a [funcionalidade de repartição de código](https://webpack.js.org/guides/code-splitting-async/) do webpack, é trivialmente fácil para carregar de forma preguiçosa componentes de rotas.

Primeiro, um componente assincrono pode ser definido como uma função fabricadora que retorna uma promessa (que deveria resolver o componente em si).

```js
const Foo = () =>
  Promise.resolve({
    /* definição do componente */
  })
```
Segundo, no webpack 2, nós podemos usar a sintaxe da [importação dinâmica](https://github.com/tc39/proposal-dynamic-import) para indicar um ponto de repartição de código:

```js
import('./Foo.vue') // returns a Promise
```

::: tip Note
Se você estiver usando o Babel, você irá precisar adicionar o plugin da [sintaxe de importação dinâmica](https://babeljs.io/docs/plugins/syntax-dynamic-import/) assim o Babel poderá parsear a sintaxe de forma apropriada.
:::

Combinando os dois, é assim que se define um componente assincrono que cujo código será automaticamente repartido pelo webpack:

```js
const Foo = () => import('./Foo.vue')
```

Não precisa mudar nada dentro da configuração de rotas, apenas use `Foo` como habitual:

```js
const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }]
})
```

## Agrupando componentes no mesmo pedaço

Algumas vezes nós iremos querer agrupar todos os componentes aninhados sob a mesma rota dentro do mesmo pedaço assincrono. Para alcançar isso, nós precisamos usar [pedaços nomeados](https://webpack.js.org/api/module-methods/#magic-comments) ao prover um nome de pedaço usando uma sintaxe especial para comentarios (necessita webpack > 2.4):

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

o webpack irá agrupar qualquer módulo assincrono com o mesmo nome de pedaço dentro do mesmo pedaço assincrono.
