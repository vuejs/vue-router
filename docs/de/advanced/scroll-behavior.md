# Scroll-Verhalten

Bei browserseitigem Routing ist manchmal gewollt nach oben zu scrollen, wenn zu einer neuen Route navigiert wird oder die Scroll-Position von Verlaufseinträgen wie beim Neuladen der Seite beizubehalten. `vue-router` erlaubt diese Vorgehensweisen und ermöglicht sogar das Scroll-Verhalten zu individualisieren.

> Merke: Dies funktioniert nur im HTML5-Verlaufsmodus.

Bei Kreierung der Router-Instanz fügt man die `scrollBehavior`-Funktion hinzu:

``` js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // Wiedergabe der gewünschten Position
  }
})
```

Die `scrollBehavior`-Funktion erhält die Route-Objeke `to` und `from`. Das dritte Argument `savedPosition` steht nur zur Verfügung, wenn es sich um eine `popstate`-Navigation (ausgeführt durch Vor-/Zurück-Button des Browsers) handelt.

Die Funktion gibt ein Objekt der Scroll-Position wieder. Das Objekt könnte folgendermaßen aussehen:

- `{ x: number, y: number }`
- `{ selector: string }`

Wenn ein falschartiger (falsy) Wert oder ein leeres Objekt wiedergegeben wird, wird nicht gescrollt.

Beim folgenden Beispiel scrollt die Seite nach oben:
``` js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```


Wiedergabe von `savedPosition` resultiert in einem nativähnlichen Verhalten, wenn mit den Vor-/Zurück-Buttons des Browsers navigiert wird.

``` js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Für die Simulation des "Scroll zum Anker"-Verhalten:
``` js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
```

Die Implementierung von [Route-Metafelder](meta.md) kann auch für feine Kontrolle über das Scroll-Verhalten genutzt werden. Siehe [hier](https://github.com/vuejs/vue-router/blob/dev/examples/scroll-behavior/app.js) für ein Beispiel.
