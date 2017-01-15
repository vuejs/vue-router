# Injektion von Komponenten

### Injizierte Eigenschaften

Diese Eigenschaften werden in jede Child-Komponente durch Hinzufügen der Router-Instanz in die Grundinstanz als Router-Option injiziert.

- #### $router

  Die Router-Instanz.

- #### $route

  Die aktuelle aktive [Route](route-object.md). Diese Eigenschaft ist schreibgeschützt und dessen Eigenschaften sind unveränderbar, können aber überwacht werden.

### Aktivierte Optionen

- **beforeRouteEnter**
- **beforeRouteLeave**

  Siehe [innerer Komponentenschutz](../advanced/navigation-guards.md#incomponent-guards).
