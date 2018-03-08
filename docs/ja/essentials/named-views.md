# 名前付きビュー

しばしば、ネストをさせずに同時に複数の view を表示する必要があるでしょう。例えば、`sidebar` view と `main` view を使ったレイアウトを作成する時です。そんな時に名前付きビューは便利です。あなたの view に 1 つのアウトレットを持つのではなく、複数のそれぞれが名前付きの view を持つことができます。名前を持たない `router-view` はその名前として `default` が付与されます。

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

1 つの view は 1 つのコンポーネントを使って描画されます。したがって、同じルートに対する複数の view には複数のコンポーネントが必須になります。この `components` (s が付いている) オプションに注意してください。

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

この例の動作しているデモは 
[こちら](https://jsfiddle.net/posva/6du90epg/) です。

## Nested Named Views

It is possible to create complex layouts using named views with nested views. When doing so, you will also need to name nested `router-view` components used. Let's take a Settings panel example:

```
/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+
```

- `Nav` is just a regular compnonent
- `UserSettings` is the view comopnent
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` are nested view components

**Note**: _Let's forget about how the HTML/CSS should look like to represent such layout and focus on the components used_

The `<template>` section for `UserSettings` component in the above layout would look something like this:

```html
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>
```

_The nested view components are omitted here but you can find the complete source code for the example above [here](https://jsfiddle.net/posva/22wgksa3/)_

Then you can achieve the layout above with this route configuration:

```js
{ path: '/settings',
  // You could also have named views at the top
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
```

A working demo of this example can be found [here](https://jsfiddle.net/posva/22wgksa3/).
