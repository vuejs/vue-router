# Verschachtelte Routes

Echte App-UIs bestehen normalerweise aus Komponenten, die mehrere Ebenen tief verschachtelt sind. Und es ist durchaus üblich, dass die Segmente der URL die Struktur der Verschachtelung wiederspiegeln, zum Beispiel so:

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

Mit `vue-router` können wir derartige Beziehungen sehr leicht mit einer verschachtelten (englisch: "nested") Route-Konfiguration abbilden.

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

Die `router-view` Komponente ist das Outlet der obersten Ebene. Sie rendert die Komponenten, welche zu Routes der obersten Ebene gehören. Eine dort gerenderte Komponente kann selbst wiederum eine `router-view` Komponente enthalten. Wenn wir zum Beispiel eine `router-view` Komponente im Template der User-Komponente platzieren, sieht das so aus:

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

Um Komponenten in diesem verschachtelten Outlet zu rendern, müssen wir die `children`-Option in der Konfiguration des `VueRouter`-Konstruktors verwenden.

``` js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // UserProfile wird innerhalb der
          // <router-view> von User gerendert,
          // wenn '/user/:id/profile' gematched wird.
          path: 'profile',
          component: UserProfile
        },
        {
          // UserPosts wird innerhalb der
          // <router-view> von User gerendert,
          // wenn '/user/:id/posts' gematched wird.
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

**Hinweis: Verschachtelte Pfade, die mit `/` starten, werden als "root-path" (zu deutsch: "Wurzel-Pfad") behandelt. Damit kann man eine verschachtelte Route mit einem direkten Pfad erreichen, ohne dass die verschachtelten Pfadsegmente der übergeordneten Routes enthalten sein müssen.**

Wie du sieht, ist die `children`-Option nur eine weiteres Array mit Route-Konfigurationsobjekten - wie das `routes`-Array selbst. Daher können wir Views so oft ineinander verschachteln, wie wir möchten.

Wenn du nun aber mit mit der aktuellen Konfiguration `/user/foo` aufrufst, wird nichts im `router-view` Outlet von `User` gerendert, da keine Sub-Route gematched wurde. Wollen wir in dem Fall dennoch eine Komponente rendern, erreichen wir das ganz einfach mit einer Route im `children`-Array, die einen leeren String als Pfad hat:

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

Eine Demo dazu findest du [hier](http://jsfiddle.net/yyx990803/L7hscd8h/)
