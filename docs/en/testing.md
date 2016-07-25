# Unit Testing

Sometimes you may test components that need the vue-router to be started. This requires a slightly different test setup.

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import Routes from './routes'
import MyComponent from './my-component'

describe('MyComponent component', () => {
  it('should pass this dummy test', () => {
    Vue.use(VueRouter)
    const App = Vue.extend({
      template: '<div><my-component></my-component></div>',
      components: { MyComponent },
      data () {
        return {
          someData: {
            foo: bar
          }
        }
      },
      replace: false
    })
    router = new VueRouter({ abstract: true })
    router.map(DataRoutes)

    router.start(App, 'body')
    router.go('/some/route')
    
    expect(router.app.$refs.['my-component'])
  })
})
```
