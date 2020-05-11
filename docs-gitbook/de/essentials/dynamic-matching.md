# Dynamisches Route-Matching

Häufig müssen wir URLs, die einem bestimmten Muster entsprechen, einer Route bzw. Komponente zuordnen. Zum Beispiel haben wir eine `User`-Komponente, welche für alle User mit unterschiedlichen IDs gerendert werden soll. In `vue-router` können wir hierfür ein dynamisches Segment im Pfad nutzen:

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

Nun werden URLs wie `/user/foo` und `/user/bar` der gleichen Route und damit der gleichen Komponente zugeordnet.

Ein dynamisches Segment wird mit einem Doppelpunkt `:` gekennzeichnet. Wenn eine Route mit einem dynamischen Segment erkannt wird, kann man über `this.$route.params`  in jeder Komponente auf die Werte der dynamischen Segmente zugreifen. So können wir zum Beispiel die aktuelle User-ID rendern, indem wir das `User`-Template folgendermaßen erweitern:

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

Ein interactives Beispiel ist [hier](http://jsfiddle.net/yyx990803/4xfa2f19/) zu finden.

Mehrere dynamische Segmente in der gleichen Route sind möglich und werden den entsprechenden Feldern in `$route.params` zugeordnet. Beispiele:

| Muster | passender Pfad | $route.params |
|---------|------|--------|
| /user/:username | /user/evan | `{ username: 'evan' }` |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

Neben `$route.params` bietet das `$route`-Objekt Zugriff auf weitere nützliche Informationen wie `$route.query` (sofern eine Query in der URL vorhanden ist). Du findest alle Details dazu in der [API Referenz](../api/route-object.md).


### Reagieren auf Änderungen von "Params"

Bei der Nutzung von Parametern in Routes ist zu beachten, dass **die selbe Komponenteninstanz genutzt wird,** wenn der Nutzer von `/user/foo` nach `/user/bar` navigiert. Da beide Routes die gleiche Komponente rendern, ist das effizienter als die alte zu zerstören und eine neue zu erstellen. **Allerdings bedeutet das auch, dass die "lifecycle hooks" der Komponente nicht aufgerufen werden.**

Um nun auf Änderungen der Params in der gleichen Komponente zu reagieren, kann man einfach das `$route`-Objekt mit einer watch-function beobachten:

``` js
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // reagiere auf @Route-Änderungen
    }
  }
}
```

### Erweiterte Matchingsmuster

`vue-router` nutzt [path-to-regexp](https://github.com/pillarjs/path-to-regexp) für das Matching der URL-Pfade, und unterstützt damit viele erweiterte Matching-Muster wie optionale dynamische Segmente, "null oder mehr" / "ein oder mehr" Bedingungen und sogar benutzerdefinierte RegEx-Muster.
An dieser Stelle sei für weitere Informationen zur Nutzung dieser Features auf die [Dokumentation für erweiterte Muster](https://github.com/pillarjs/path-to-regexp#parameters) und [dieses Beispiel](https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js) verwiesen.

### Matching Priorität

Manchmal passt die URL zu mehr als einer Route. In diesem Fall ist die Priorität durch die Anordnung der Routes definiert: **Je früher eine Route definiert ist, desto höher ihre Priorität.**
