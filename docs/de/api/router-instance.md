# Router-Instanz

### Eigenschaften

#### router.app

- Typ: `Vue instance`

  Die grundlegende Vue-Instanz, in die `router` injiziert wurde.

#### router.mode

- Typ: `string`

  Der [Modus](options.md#mode), den der Router nutzt.


#### router.currentRoute

- Typ: `Route`

  Die akuelle Route, widergespiegelt als [Route-Objekt](route-object.md).

### Methoden

- **router.beforeEach(guard)**
- **router.afterEach(hook)**

  Füge globalen Navigationsschutz hinzu. Siehe [Navigations-Guards](../advanced/navigation-guards.md).


- **router.push(location)**
- **router.replace(location)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Navigiere programmatisch zu einer neuen URL. Siehe [Programmatische Navigation](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Gibt ein Array von Komponenten (Definition/Konstruktor, nicht Instanz) zurück, die für den gegebenen Ort oder die aktuelle Route gematched wurden. Wird meist bei serverseitigem Rendern genutzt, um ein Vorladen von Daten zu ermöglichen.

- **router.resolve(location, current?, append?)**

  Umgekehrte URL-Erkennung. Wenn man ein Ziel in gleicher Form wie in `<router-link>` übergibt, gibt die Funktion ein Objekt mit den folgenden Eigenschaften zurück:

``` js
{
  location: Location;
  route: Route;
  href: string;
}
```

- **router.addRoutes(routes)**

  > 2.2.0+

  Füge dynamisch weitere Routen zum Router hinzu. Das Argument muss ein Array mit demselben Format wie die `routes` Konstruktor-Option sein.

- **router.onReady(callback)**

  > 2.2.0+

  Diese Methode queued eine Callback-Funktion, welche aufgerufen wird, sobald der Router die initiale Navigation beendet hat - das heißt, dass alle asynchronen Komponenten und enter-hooks, die zu der aktuellen Route gehören, geladen und ausgeführt wurden.

  Damit lässt sich im serverseitigen Rendern sicherstellen, dass auf dem Server und im Client der gleiche Output gerendert wird.
