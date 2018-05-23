# Scroll-Verhalten

Oft wollen wir, dass die Seite nach oben scrollt, wenn zu einer neuen Route navigiert wird, oder dass die Scroll-Position von Verlaufseinträgen wie beim Neuladen einer Seite beibehalten wird. `vue-router` ermöglichst das und noch mehr - wir können das Scroll-Verhalten komplett individualisieren.

> Merke: Dies funktioniert nur im HTML5-Verlaufsmodus ("history mode").

Beim Erzeugen der Router-Instanz fügt man die `scrollBehavior`-Funktion hinzu:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // zurückgeben der gewünschten Position
  }
})
```

Die `scrollBehavior`-Funktion erhält die Route-Objeke `to` und `from` als Argumente. Das dritte Argument `savedPosition` steht nur zur Verfügung, wenn es sich um eine `popstate`-Navigation handelt (d.h. der Vor-/Zurück-Button des Browsers hat die Navigation ausgelöst).

Die Funktion sollte ein Objekt zurückgeben, dass die Scroll-Position beschreibt. Das Objekt kann folgendermaßen aussehen:

- `{ x: number, y: number }`
- `{ selector: string }`

Wenn ein falscher (falsy) Wert oder ein leeres Objekt zurückgegeben wird, wird nicht gescrollt.

Im folgenden Beispiel scrollt die Seite komplett nach oben:
``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```


Wenn die Funktion das `savedPosition`-Object zurückgibt, verhält sich die Seite wie ein Browser, innerhalb dessen mit den Vor-/Zurück Buttons navigiert wird.

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Simulation des "Scrolle zum Anchor"-Verhaltens:

``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

Du kannst außerdem die [Route Meta-Felder](meta.md) für eine noch genauere Kontrolle des Scroll-Verhaltens nutzen.  [Hier](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js) findest du ein Beispiel.
