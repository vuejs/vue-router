# Unit Testing

Sometimes you may need to test components that need the vue-router to be started. This requires a slightly different test setup.

``` js
// component.spec.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Routes from './routes'
import MyComponent from './my-component'

describe('MyComponent component', () => {
  it('should pass this dummy test', () => {
    /* Plug the router into Vue */
    Vue.use(VueRouter)

    /* This is not a new, but rather a Vue.extend */
    const App = Vue.extend({
      /* We assign a ref to our component in order to access it later */
      template: '<div><my-component :foo="foo" v-ref:mycomponent></my-component></div>',
      components: { MyComponent },
      data () {
        return {
          foo: 'bar'
        }
      },
      replace: false
    })

    /* The router is initialized with the abstract option */
    router = new VueRouter({ abstract: true })
    router.map(Routes)

    router.start(App, 'body')
    router.go('/some/route')

    /* We are now able to access the component via the ref */
    expect(router.app.$refs.mycomponent.foo).to.be('bar')
  })
})
```

Here, things happen similarly to unit testing completely isolated Vuejs
components, except for some differences:

* we enable the router plugin into the Vue class;
* we do *not* instantiate a component instance and mount it, but rather define
a component class by `extend`-ing Vue. This class will be later instantiated by
the router (do not forget the `replace: false` option);
* we instantiate the router with the `abstract: true` option. This will tell the
router not to rely on the History backend API, which is very important in a
testing environment (this will keep the router instantiation synchronous);
* we then access the component via `router.app`. Here, we use the `$refs` to
directly access the component instance and test its internal logic.
