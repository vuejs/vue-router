// NOTE: this example is based on 0.12.2 in which the
// `replace` option defaults to true.

var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

var router = new VueRouter({
  history: true
})

var App = Vue.extend({
  components: {
    inbox: {
      template: '<div><h2>inbox!</h2><router-view></router-view></div>',
      components: {
        archive: {
          template: '<div>archive lol {{route.params.messageId}}</div>',
        }
      }
    },
    user: {
      template: '<div><h2>User yo</h2><router-view></router-view></div>',
      components: {
        'user-profile': {
          template: '<div>user profile {{route.params.userId}} {{route.params.something}}</div>'
        },
        'user-posts': {
          template: '<div>user posts</div>'
        },
        'user-settings': {
          template: '<div>user settings</div>'
        }
      }
    },
    about: {
      template: '<h1>OHHHH ABOUT</h1>'
    },
    'not-found': {
      template: '<p>FOUR OH FOUR</p>'
    }
  }
})

router.map({
  '/inbox': {
    component: 'inbox',
    alwaysRefresh: true,
    before: function (to, from) {
      console.log('before')
      console.log(to.path, from && from.path)
      if (from && from.path === '/about') {
        alert('not allowed')
        return false
      }
    },
    after: function (to, from) {
      console.log('after')
      console.log(to.path, from && from.path)
    },
    subRoutes: {
      '/message/:messageId': {
        // directly providing a component
        component: {
          data: function () {
            return {
              id: null
            }
          },
          template:
            '<div>' +
              '<div v-if="loading">Loading data...</div>' +
              '<div v-if="!loading">message! {{id}} {{route.params.messageId}}</div>' +
            '</div>'
        },
        data: function (route) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                id: route.params.messageId
              })
            }, 1000)
          })
        }
      },
      '/archived': {
        component: 'archive'
      }
    }
  },
  '/user/:userId': {
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
  },
  '/about': {
    component: 'about'
  },
  '*': {
    component: 'not-found'
  }
})

router.redirect({
  '/info': '/about',
  '/hello/:userId': '/user/:userId'
})

router.beforeEach(function (from, to) {
  if (to.path === '/forbidden') {
    alert('this route is forbidden by a global before hook')
    return false
  }
})

router.afterEach(function (from, to) {
  console.log('global after')
})

router.start(App, '#app')
