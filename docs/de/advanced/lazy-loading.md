# Lazy Loading

Wenn Apps mit einem Bundler erstellt werden, kann das erzeugte "Bundle" recht groß werden und so die Seitenladezeit beeinträchtigen. Es wäre effizienter, wenn man das Bundle in die einzelnen  Router-Komponenten aufteilen könnte und sie nur dann lädt, wenn die Route besucht wird.

Mit der Kombination von Vue's Feature für [asynchrone Komponenten](http://vuejs.org/guide/components.html#Async-Components) und Webpack's Feature ["Code-Splitting"](https://webpack.js.org/guides/code-splitting-require/) (engl. _to split_: _teilen_) ist es einfach, dieses "Lazy Loading" genannte Verhalten für Route-Komponenten zu erreichen.

Dazu müssen wir nur unsere Route-Komponenten als asynchrone Komponente definieren:

``` js
const Foo = resolve => {
  // require.ensure ist Webpacks speziale Syntax für Code-Splitting.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

Es gibt auch eine alternative Code-Splitting Syntax mit `require` im AMD-Stil, mit der das ganze folgendermaßen vereinfacht werden kann:

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

In der Route-Konfiguration muss nichts genändert werden - wir nutzen `Foo` wie gewohnt:

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Gruppierung von Komponenten im selben Chunk

Manchmal wollen wir alle Komponenten unter derselben Route in den selben ansynchronen Chunk gruppieren. Dafür benutzern wir das ["named Chunks" (englisch)](https://webpack.js.org/guides/code-splitting-require/#chunkname) Feature, indem wir einen Chunk-Namen als drittes Argument für `require.ensure` hinzufügen.

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack bündelt alle asynchronen Module mit dem gleichen Chunk-Namen in denselben asynchronen Chunk. Das bedeutet auch, dass keine Dependencies mehr für `require.ensure` explizit aufgelistet werden müssen - daher das leere Array als Argument.
