# Dynamisches Route-Matching

Häufig müssen wir Routes unter Nutzung des gegebenen Musters mit der gleichen Komponente verbinden. Zum Beispiel haben wir eine `User`-Komponente, welche für alle User mit unterschiedlichen IDs gerendert werden soll. In `vue-router` ist ein dynamisches Segment im Pfad nutzbar, um das zu erreichen:

``` js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // dynamische Segmente beginnen mit Doppelpunkt
    { path: '/user/:id', component: User }
  ]
})
```

Nun werden URLs wie `/user/foo` und `/user/bar` mit der gleichen Komponente verbunden.

Ein dynamisches Segment wird mit einem Doppelpunkt `:` definiert. Trifft eine Route überein, wird der Wert der dynamischen Segmente über `this.$route.params` in jeder Komponente ansprechbar. Deswegen ist es möglich die aktuelle User-ID zu rendern, indem das `User`-Template aktualisiert wird:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

Ein Beispiel ist [hier](http://jsfiddle.net/yyx990803/4xfa2f19/) zu finden.

Mehrere dynamische Segmente in der gleichen Route sind möglich, wobei sie dem entsprechenden Feld in `$route.params` zugeordnet werden. Beispiele:

| Muster | passender Pfad | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: 123 }` |

Neben `$route.params` bietet das `$route`-Objekt weitere nützliche Informationen wie `$route.query` - sofern eine Abfrage in der URL vorhanden ist.


### Reagieren auf Änderungen von Parametern

Wichtig bei der Nutzung von Parametern in Routes ist, dass **die selbe Komponenteninstanz genutzt wird,** wenn der Nutzer von `/user/foo` nach `/user/bar` navigiert. Da beide Routes die gleiche Komponente rendern, ist es effizienter als die alte zu zerstören und eine neue zu kreieren. **Allerdings bedeutet das auch, dass die Hooks der Lebenszyklen nicht aufgerufen werden.**

Um auf Parameteränderungen in der gleichen Komponente zu reagieren, kann man einfach das `$route`-Objekt beobachten.

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // reagiere auf Route-Änderungen
    }
  }
}
```

### Erweiterte Übereinstimmungsmuster

`vue-router` nutzt [path-to-regexp](https://github.com/pillarjs/path-to-regexp) zur Prüfung seiner Pfadübereinstimmungen. Demnach unterstützt es viele erweiterte Übereinstimmungsmuster wie optionale dynamische Segmente, null oder mehr/ein oder mehr Anforderungen und sogar eigene RegEx-Muster.  
Siehe [Dokumentation für erweiterte Muster](https://github.com/pillarjs/path-to-regexp#parameters) und [dieses Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) der Nutzung mit `vue-router`.

### Priorität der Übereinstimmung

Manchmal trifft die URL auf mehrere Routes zu. In diesem Fall ist die Priorität durch die Anordnung der Routes definiert: **Je früher eine Route definiert ist, desto höher ihre Priorität.**
