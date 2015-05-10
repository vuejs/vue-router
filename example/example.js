var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

var router = new VueRouter({
  pushstate: true,
  root: '/hello'
})

var root = new Vue({
  el: '#app',
  components: {
    inbox: {
      template: '<div><h2>inbox!</h2><div v-view></div></div>',
      replace: true,
      components: {
        message: {
          template: '<div>message! {{route.params.messageId}}</div>',
          replace: true
        },
        archive: {
          template: '<div>archive lol</div>',
          replace: true
        }
      }
    },
    user: {
      template: '<h2>User yo</h2><div v-view></div>',
      components: {
        'user-profile': {
          template: 'user profile {{route.params.userId}} {{route.params.something}}'
        },
        'user-posts': {
          template: 'user posts'
        },
        'user-settings': {
          template: 'user settings'
        }
      }
    },
    about: {
      template: '<h1>OHHHH ABOUT</h1>',
      replace: true
    },
    'not-found': {
      template: 'FOUR OH FOUR'
    }
  }
})

router.on('/inbox', {
  name: 'inbox',
  component: 'inbox',
  subRoutes: {
    '/message/:messageId': {
      name: 'message',
      component: 'message',
      alwaysRefresh: true
    },
    '/archived': {
      name: 'archive',
      component: 'archive'
    }
  }
})

router.on('/user/:userId', {
  name: 'user',
  component: 'user',
  subRoutes: {
    'profile/:something': {
      component: 'user-profile'
    },
    'posts': {
      component: 'user-posts'
    },
    'settings': {
      component: 'user-settings'
    }
  }
})

router.on('/about', {
  component: 'about',
})

router.notfound({
  component: 'not-found'
})

router.redirect({
  '/info': '/about'
})

router.start(root)