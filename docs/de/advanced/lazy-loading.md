# Lazy Loading

Wenn Apps mit einem Bundler zusammengefügt werden, kann die Datei recht groß werden und so die Seitenladezeit beeinträchtigen. Es wäre effizienter, wenn man das Bundle in mehrere Router-Komponenten aufteilen könnte und sie nur dann lädt, wenn die Route besucht wird.

Mit der Kombination von Vues [asynchronischem Komponenten-Feature](http://vuejs.org/guide/components.html#Async-Components) und Webpacks Feature zur [Code-Aufteilung (englisch)](https://webpack.github.io/docs/code-splitting.html) ist es einfach Lazy Loading von Route-Komponenten zu erreichen.

Alles was benötigt wird, ist die Definition der Route-Komponenten als asynchrone Komponenten:

``` js
const Foo = resolve => {
  // require.ensure ist Webpacks speziale Syntax für Code-Aufteilung.
  require.ensure(['./Foo.vue'], () => {
    resolve(require('./Foo.vue'))
  })
}
```

Es gibt auch eine alternative Code-Teilungssyntax mit `require` im AMD-Stil:

``` js
const Foo = resolve => require(['./Foo.vue'], resolve)
```

Nichts muss geändert werden in der Route-Konfiguration - nutze `Foo` wie gewohnt:

``` js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### Gruppierung von Komponenten im selben Chunk

Manchmal ist es gewollt, alle Komponenten unter der selben Route in den selben ansynchronen Chunk zu gruppieren. Um das zu erreichen, werden [benannte Chunks (englisch)](https://webpack.github.io/docs/code-splitting.html#named-chunks) genutzt. Hierbei wird ein Chunk-Name als drittes Argument für `require.ensure` hinzugefügt.

``` js
const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
```

Webpack packt alle asynchronen Module mit dem gleichen Chunk-Namen in den selben asynchronen Chunk. Das bedeutet auch, dass keine Abhängigkeiten mehr für `require.ensure` explizit aufgelistet werden müssen - daher der leere Array als Argument.
