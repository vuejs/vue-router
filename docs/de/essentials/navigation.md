# Programmatische Navigation

Neben `router-link` für deklarative Links in Templates, können wir mit Hilfe der Methoden der Router-Instanz programmatisch navigieren.

#### `router.push(location, onComplete?, onAbort?)`

Um zu einer anderen URL zu navigieren, nutzt man `router.push`. Diese Methode "pusht" einen neuen Eintrag in den Browser-Verlauf, sodass der Nutzer, wenn er die Zurück-Schaltfläche des Browsers betätigt, zur vorherigen URL zurückkehrt.

Das ist dieselbe Methode, die intern aufgerufen wird, wenn wir auf einen `<router-link>` klicken. Das Anlicken von `<router-link :to="...">` ist also das Äquivalent zu `router.push(...)`.

| Deklarativ | Programmatisch |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

Das Argument kann ein Pfad als String oder eine Beschreibung des Ziels (der "location") als Objekt sein.

``` js
// String
router.push('home')

// Objekt
router.push({ path: 'home' })

// benannte ("named") Route
router.push({ name: 'user', params: { userId: 123 }})

// mit Query, resultiert in /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

In Version 2.2.0 können wir optional `onComplete` und `onAbort` Callbacks als zweites und drittes Argument angeben. Diese Callbacks werden jeweilse aufgerufen, wenn die Navigation entweder erfolgreich abgeschlossen wurde (nachdem alle asynchronen hooks durchlaufen wurden), oder wenn sie abgerochen wurde (weil eine neue Navigation zu derselben oder einer anderen Route gestartet wurde, z.B. durch einen Klick, bevor die aktuelle Navigation beendet werden konnte).

#### `router.replace(location, onComplete?, onAbort?)`

Dise methode verhält sich wie `router.push`, allerdings erstellt sie keinen neuen Eintrag im Browser-Verlauf. Sie ersetzt lediglich den aktuellen Eintrag.

| Deklarativ | Programmatisch |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### `router.go(n)`

Diese Methode akzeptiert einen einfachen Integer als Parameter, der angibt, wie viele Schritte im Browser-Verlauf vor- oder rückwärts zu gehen sind - ähnlich wie `window.history.go(n)`.

Beispiele

``` js
// gehe einen Eintrag vorwärts - wie history.forward()
router.go(1)

// gehe einen Eintrag zurück - wie history.back()
router.go(-1)

// gehe drei Einträge vor
router.go(3)

// scheitert ohne Nachricht, wenn nicht genügend Einträge vorhanden sind
router.go(-100)
router.go(100)
```

#### Manipulation des Verlaufs

Vielleicht ist dir aufgefallen, dass `router.push`, `router.replace` und `router.go` Gegenstücke von [`window.history.pushState`, `window.history.replaceState` und `window.history.go`](https://developer.mozilla.org/de/docs/Web/API/History) sind und sie die `window.history`-API imitieren.

Das macht es einfach, den Verlauf zu manipulieren, wenn man sich mit den [Browser-Verlauf-APIs](https://developer.mozilla.org/de/docs/Web/Guide/DOM/Manipulating_the_browser_history)
auskennt.

Erwähnenswert ist, dass Navigationsmethoden von `vue-router` (`push`, `replace`, `go`) in allen router modes (`history`, `hash`, `abstract`) genau gleich funktionieren.
