# Route Meta Fields

Route Meta Fields allow you to attach **arbitrary data** to route records. This is invaluable for storing route-specific information that needs to be accessed during navigation or within components, such as authorization requirements, transition names, or page titles.

This is achieved through the **`meta`** property, which accepts an object of custom properties.

## Defining Meta Fields

The `meta` field is defined directly on a route record. The values are merged across nested routes, meaning a child route can access the `meta` properties of its parent.

```js
import VueRouter from 'vue-router'

const router = new VueRouter({
  routes: [
    {
      path: '/admin',
      component: AdminLayout,
      // Parent route meta: authentication required for all children
      meta: { requiresAuth: true }, 
      children: [
        {
          path: 'users',
          component: AdminUsers,
          // Child route meta: includes a specific title
          meta: { isAdmin: true, title: 'Manage Users' }
        },
        {
          path: 'login',
          component: Login,
          // Explicitly overriding the parent meta to allow public access
          meta: { requiresAuth: false }
        }
      ]
    }
  ]
})
