# Verschachtelte Routes

Reale App-UI ist normalerweise zusammengesetzt aus Komponenten, die mehrere Level tief verschachtelt sind. Es ist auch herkömmlich, dass Teile der URL gewisse Strukturen der Verschachtelung wiederspiegeln:

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

Wir bauen auf der App auf, die im letzten Kapitel erstellt wurde:

``` html
<div id="app">
  <router-view></router-view>
</div>
```

``` js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User }
  ]
})
```

Der `router-view` hier ist ein Ausgangspunkt der höchsten Ebene. Es rendert die Komponente, welche zur Route der höchsten Ebene passt. Ebenso kann eine gerenderte Komponente selbst `router-view` enthalten. Im Beispiel wird eines in das Template der `User`-Komponente eingesetzt:

``` js
const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
```

Um Komponenten in diesem verschachtelten Ausgangspunkt zu rendern, benötigt man die `children`-Option in der Konfiguration des `VueRouter`-Konstruktors.

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // UserProfile wird innerhalb der
          // <router-view> von User gerendert,
          // wenn '/user/:id/profile' zutrifft.
          path: 'profile',
          component: UserProfile
        },
        {
          // UserPosts wird innerhalb der
          // <router-view> von User gerendert,
          // wenn '/user/:id/posts' zutrifft.
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Merke, dass verschachtelte Pfade, die mit `/` starten, als Grundpfad (Root) behandelt werden. Das erlaubt verschachtelte Komponenten ohne angepasste URL.**

Wie man sieht, ist die `children`-Option nur eine weitere Aneinanderkettung von Objekten der Router-Konfiguration wie `routes` selbst. Demnach kann man Views so oft ineinander verschachteln, wie man möchte.

Mit der oben genannten Konfiguration wird hierbei, wenn `/user/foo` besucht wird, nichts im Ausgangspunkt von `User` gerendert, da keine Sub-Route zutrifft. Sollte man dennoch etwas darstellen wollen, kann man einen leeren Pfad zur Sub-Route kreieren.

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // UserHome wird in <router-view>
        // von User gerendert,
        // wenn /user/:id zutrifft.
        { path: '', component: UserHome },

        // ...weitere Sub-Routes
      ]
    }
  ]
})
```

Eine Demo dazu kann [hier](http://jsfiddle.net/yyx990803/L7hscd8h/) gefunden werden.
