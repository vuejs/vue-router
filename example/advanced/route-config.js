export function configRouter (router) {

  // normal routes
  router.map({
    // basic example
    '/about': {
      // 
      docTitle: 'About Pages',
      // the component can also be a plain string component id,
      // but a component with that id must be available in the
      // App component's scope.
      component: require('./components/about.vue')
    },

    // nested example
    '/user/:userId': {
      component: require('./components/user/index.vue'),
      docTitle: 'User Info',
      subRoutes: {
        // matches "/user/:userId/profile/:something"
        'profile/:something': {
          docTitle: 'Profile Page',
          component: require('./components/user/profile.vue')
        },
        // matches "/user/:userId/posts"
        'posts': {
          docTitle: 'Posts Pages',
          component: require('./components/user/posts.vue')
        },
        // matches "/user/:userId/settings"
        'settings': {
          docTitle: 'Settings Pages',
          component: require('./components/user/settings.vue')
        }
      }
    },

    // not found handler
    '*': {
      docTitle: 'Not Found!',
      component: require('./components/not-found.vue')
    },

    // advanced example
    '/inbox': {
      docTitle: 'Inbox Pages',
      component: require('./components/inbox/index.vue'),
      subRoutes: {
        '/message/:messageId': {
          docTitle: 'Message Page',
          component: require('./components/inbox/message.vue')
        },
        '/archived': {
          docTitle: 'Archived Page',
          component: require('./components/inbox/archive.vue')
        },
        // default component to render into the nested outlet
        // when the parent route is matched but there's no
        // nested segment. In this case, "/inbox".
        '/': {
          // inline component
          component: {
            docTitle: 'Index',
            template: 'default yo'
          }
        }
      }
    }
  })

  // redirect
  router.redirect({
    '/info': '/about',
    '/hello/:userId': '/user/:userId'
  })

  // global before
  // 3 options:
  // 1. return a boolean
  // 2. return a Promise that resolves to a boolean
  // 3. call transition.next() or transition.abort()
  router.beforeEach((transition) => {
    if (transition.to.path === '/forbidden') {
      router.app.authenticating = true
      setTimeout(() => {
        router.app.authenticating = false
        alert('this route is forbidden by a global before hook')
        transition.abort()
      }, 3000)
    } else {
      transition.next()
    }
  })

  // change document title

  // singleiframe 
  // to fix ios document title bug
  const singleIframe = (function () {
    let iframe = null;
    return function () {
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      return iframe
    }
  })()

  // global after
  // You cannot call transition methods in the global after hook.
  router.afterEach(function (transition) {
    let iframe = singleIframe();
    document.title = transition.to.docTitle || "Default Title"
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      iframe.src = '/favicon.ico?' + Math.random()
    }
  })
}
