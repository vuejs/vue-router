# Navigationsschutz

Der Navigationsschutz bereit gestellt vom `vue-router` wird primär genutzt, um Navigationen vor Umleitung oder Unterbrechung zu schützen. Es gibt eine Vielzahl an Wege: global, per-route oder in der Komponente.

Merke, dass Parameter oder Query-Abfragen den Navigationsschutz nicht auslosen. Beobachte einfach [das `$route`-Objekt](../essentials/dynamic-matching.md#reacting-to-params-changes), um auf Änderungen zu reagieren.

### Globaler Schutz

Man kann globalen Schutz für die Zeit direkt vor einer Navigation (globaler Vor-Schutz) mit `router.beforeEach` anwenden:

``` js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

Globale Vor-Schutze werden in Kreierungsreihenfolge aufgerufen, wenn eine Navigation ausgelöst wird. Der Schutz darf auch asynchron angewandt werden, sodass die Navigation als **unerledigt** da steht, bis alle bearbeitet wurden.

Jede Schutzfunktion erhält drei Argumente:

- **`to: Route`**: das [Route-Objekt](../api/route-object.md), zu dem navigiert wird

- **`from: Route`**: die aktuelle Route, von der wegnavigiert wird

- **`next: Function`**: Diese Funktion muss aufgerufen werden, um den Hook aufzulösen. Die Aktion hängt von den Argumenten in `next` ab:

  - **`next()`**: Gehe zum nächsten Hook in der Leitung. Wenn keiner vorhanden ist, ist die Navigation **bestätigt**.

  - **`next(false)`**: Brich die aktuelle Navigation ab. Wurde die URL geändert (entweder manuell durch den Nutzer oder via Zurück-Button), wird es zurückgesetzt zu dem, was die `from`-Route wiedergab.

  - **`next('/')` or `next({ path: '/' })`**: Umleitung zu einem anderen Ort. Die aktuelle Navigation wird abgebrochen und eine neue gestartet.

**Die `next`-Funktion muss immer aufgerufen werden, sonst kann der Hook nicht aufgelöst werden.**

Man kann auch globale Nach-Hooks registrieren, allerdings erhalten diese keine `next`-Funktion wie der Navigationsschutz und beeinflussen nicht die Navigation selbst:

``` js
router.afterEach((to, from) => {
  // ...
})
```

### Per-Route-Schutz

Man kann den `beforeEnter`-Schutz direkt in der Router-Konfiguration definieren:

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

Diese Schutze haben die exakt gleiche Signature als globale Vor-Schutze.

### Schutz in Komponenten

Letztendlich kann man auch Navigationsschutz in den Route-Komponenten (die, die der Router-Konfiguration hinzugefügt werden) mit `beforeRouteEnter` und `beforeRouteLeave` definieren:

``` js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // Aufgerufen bevor die Route bestätigt wird, die die Komponenten rendert.
    // Hat keinen Zugang zum `this`-Kontext der Komponenteninstanz,
    // da es noch nicht erstellt wurde, wenn der Schutz aufgerufen wird.
  },
  beforeRouteLeave (to, from, next) {
    // Aufgerufen, wenn von der Route, die die Komponente rendert, wegnavigiert wird.
    // Hat Zugriff zum `this`-Kontext.
  }
}
```

Der `beforeRouteEnter`-Schutz hat keinen Zugriff zum `this`-Kontext, weil der Schutz aufgerufen wird, bevor die Navigation bestätigt wurde, demnach wurde die Komponente noch gar nicht kreiert.

Allerdings hat man Zugriff auf die Instanz, indem man einen Callback an `next` anfügt. Dieser wird aufgerufen, wenn die Navigation bestätigt wurde. Die Komponente wird im Callback als Argument hinzugefügt:

``` js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // Zugriff auf Komponenteninstanz via 'vm'
  })
}
```

Man kann den `this`-Kontext in `beforeRouteLeave` aufrufen. Der Abgangsschutz wird normalerweise genutzt, um versehentliches Verlassen der Route mit ungesicherten Arbeiten zu verhindern. Die Navigation kann mit `next(false)` abgebrochen werden.
