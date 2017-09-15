# Injektion von Komponenten

### Injizierte Eigenschaften

Die folgenden Eigenschaften werden in jede Child-Komponente injiziert, wenn man die Router-Instanz in die Root-Instanz der App als `router:`-Option übergibt.

- #### $router

  Die Router-Instanz.

- #### $route

  Die aktuell aktive [Route](route-object.md). Diese Eigenschaft ist schreibgeschützt und ihre Eigenschaften sind unveränderbar - aber sie kann überwacht werden.

### Aktivierte Optionen

- **beforeRouteEnter**
- **beforeRouteLeave**

  Siehe [Guards in Komponenten Komponentenschutz](../advanced/navigation-guards.md#guards-in-komponenten).
