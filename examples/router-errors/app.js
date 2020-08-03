import Vue from 'vue'
import VueRouter from 'vue-router'

const component = {
  template: `
  <div>
  {{ $route.fullPath }}
  </div>
  `
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component }, { path: '/foo', component }
  ]
})

window.router = router

router.beforeEach((to, from, next) => {
  console.log('from', from.fullPath)
  console.log('going to', to.fullPath)
  if (to.query.wait) {
    setTimeout(() => next(), 100)
  } else if (to.query.redirect) {
    next(to.query.redirect)
  } else if (to.query.abort) {
    next(false)
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router
})

// 4 NAVIGATION ERROR CASES :

// navigation duplicated
// router.push('/foo')
// router.push('/foo')

// navigation cancelled
// router.push('/foo?wait=y')
// router.push('/')

// navigation redirected
// router.push('/foo?redirect=/')

// navigation aborted
// router.push('/foo?abort=y')
