module.exports = {

  // basic example
  '/about': {
    // the component can also be a plain string component id,
    // but a component with that id must be available in the
    // App component's scope.
    component: require('./components/about.vue')
  },

  // nested example
  '/user/:userId': {
    component: require('./components/user/index.vue'),
    subRoutes: {
      // matches "/user/:userId/profile/:something"
      'profile/:something': {
        component: require('./components/user/profile.vue')
      },
      // matches "/user/:userId/posts"
      'posts': {
        component: require('./components/user/posts.vue')
      },
      // matches "/user/:userId/settings"
      'settings': {
        component: require('./components/user/settings.vue')
      }
    }
  },

  // not found handler
  '*': {
    component: require('./components/not-found.vue')
  },

  // advanced example
  '/inbox': {
    // always reload the component when the route changes,
    // even if this segment remains the same.
    // e.g. /inbox/message/123 -> /inbox/message/234
    alwaysRefresh: true,
    component: require('./components/inbox/index.vue'),
    // async before hook.
    // must call allow/deny or return a Promise.
    before: function (to, from, allow, deny) {
      console.log('before')
      console.log(to.path, from && from.path)
      if (from && from.path === '/about') {
        alert('not allowed')
        deny()
      } else {
        allow()
      }
    },
    // sync after hook.
    after: function (to, from) {
      console.log('after')
      console.log(to.path, from && from.path)
    },
    subRoutes: {
      '/message/:messageId': {
        component: require('./components/inbox/message.vue'),
        // async data hook: must call resolve/reject
        // or return a Promise.
        data: function (route, resolve, reject) {
          // return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                // route params/query are available here
                id: route.params.messageId
              })
            }, 1000)
          // })
        }
      },
      '/archived': {
        component: require('./components/inbox/archive.vue')
      },
      // default component to render into the nested outlet
      // when the parent route is matched but there's no
      // nested segment. In this case, "/inbox".
      '*': {
        // inline component
        component: {
          template: 'default yo'
        }
      }
    }
  }
}
