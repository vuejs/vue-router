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
    subRoutes: {
      '/message/:messageId': {
        component: require('./components/inbox/message.vue')
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
