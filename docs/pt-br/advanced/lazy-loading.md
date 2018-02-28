# Lazy Loading Routes

Ao criar aplicativos com um bundler, o pacote de JavaScript pode se tornar bastante grande e, portanto, afetar o tempo de carregamento da página. Seria mais eficiente se pudermos dividir os componentes de cada rota em um pedaço separado e apenas carregá-los quando a rota for visitada.

Combinando Vue's [componente assíncrono](https://vuejs.org/guide/components.html#Async-Components) e webpack's [code splitting feature](https://webpack.js.org/guides/code-splitting-async/), É trivialmente fácil para os componentes de Lazy Loading Routes.

Primeiro, um componente assíncrono pode ser definido como uma função de fábrica que retorna uma Promessa (que deve resolver o próprio componente):

``` js
const Foo = () => Promise.resolve({ /* component definition */ })
```

Em segundo lugar, no webpack 2, podemos usar o [dynamic import](https://github.com/tc39/proposal-dynamic-import) sintaxe para indicar um ponto de code-split:

``` js
import('./Foo.vue') // returns a Promise
```

> Nota: se você estiver usando o Babel, você precisará adicionar o [syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) plugin para que Babel possa analisar adequadamente a sintaxe.

Combinando os dois, é assim que define um componente assíncrono que será automaticamente dividido em código pelo webpack:

``` js
const Foo = () => import('./Foo.vue')
```

Nada precisa mudar na configuração da rota, use apenas `Foo` como de costume:

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Agrupando componentes no mesmo pedaço

Às vezes, podemos querer agrupar todos os componentes aninhados na mesma rota no mesmo pedaço de sincronização. Para conseguir isso, precisamos usar [partes nomeados](https://webpack.js.org/guides/code-splitting-async/#chunk-names) fornecendo um nome de bloco usando uma sintaxe de comentário especial (requer webpack> 2.4):

``` js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

O webpack agrupará qualquer módulo assíncrono com o mesmo nome do pedaço no mesmo pedaço de sincronização.