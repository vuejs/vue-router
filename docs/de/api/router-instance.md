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

  Die akuelle Route wiedergespiegelt als [Route-Objekt](route-object.md).

### Methoden

- **router.beforeEach(guard)**
- **router.afterEach(hook)**

  Füge globalen Navigationsschutz hinzu. Siehe [Navigationsschutz](../advanced/navigation-guards.md).


- **router.push(location)**
- **router.replace(location)**
- **router.go(n)**
- **router.back()**
- **router.forward()**

  Navigiere programmatisch zu einer neuen URL. Siehe [Programmatische Navigation](../essentials/navigation.md).

- **router.getMatchedComponents(location?)**

  Gibt einen Array von Komponenten (Definition/Konstruktor, nicht Instanz) wieder, der auf den gegebenen Ort oder die aktuelle Route zutrifft. Wird meist genutzt bei serverseitigem Rendern, um ein Vorabladen von Daten zu ermöglichen.

- **router.resolve(location, current?, append?)**

  Umgekehrte URL-Umwandlung. Sofern ein Ort in gleicher Form wie in `<router-link>` vorhanden ist, gibt es ein Objekt mit dem String `href` wieder.
