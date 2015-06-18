var Vue = require('vue')
var VueRouter = require('../src')

Vue.use(VueRouter)

var router = new VueRouter({
  pushstate: true
})

var App = Vue.extend({
  components: {
    inbox: {
      template: '<div><h2>inbox!</h2><router-view></router-view>',
      replace: true,
      components: {
        message: {
          data: function () {
            return {
              id: null
            }
          },
          template: '<div>' +
            '<div v-if="loading">Loading data...</div>' +
            '<div v-if="!loading">message! {{id}} {{route.params.messageId}}</div>',
          replace: true
        },
        archive: {
          template: '<div>archive lol {{route.params.messageId}}</div>',
          replace: true
        }
      }
    },
    user: {
      template: '<h2>User yo</h2><router-view></router-view>',
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
        component: 'message',
        data: function (route, resolve, reject) {
          setTimeout(function () {
            resolve({
              id: route.params.messageId
            })
          }, 1000)
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
