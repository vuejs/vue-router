# Named Views

Sometimes you need to display multiple views at the same time instead of nesting them, e.g. creating a layout with a `sidebar` view and a `main` view. This is where named views come in handy. Instead of having one single outlet in your view, you can have multiple and give each of them a name. A `router-view` without a name will be given `default` as its name.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

A view is rendered by using a component, therefore multiple views require multiple components for the same route. Make sure to use the `components` (with
an s) option:

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

A working demo of this example can be found [here](https://jsfiddle.net/posva/6du90epg/).

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

- `Nav` is just a regular component
- `UserSettings` is the view component
- `UserEmailsSubscriptions`, `UserProfile`, `UserProfilePreview` are nested view components

**Note**: _Let's forget about how the HTML/CSS should look like to represent such layout and focus on the components used._

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

_The nested view components are omitted here but you can find the complete source code for the example above [here](https://jsfiddle.net/posva/22wgksa3/)._

Then you can achieve the layout above with this route configuration:

```js
{
  path: '/settings',
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
