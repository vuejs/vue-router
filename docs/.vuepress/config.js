module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Router',
      description: 'The official router for Vue.js.'
    }
  },
  serviceWorker: true,
  theme: 'vue',
  themeConfig: {
    repo: 'vuejs/vue-router',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Getting Started',
            link: '/essentials/getting-started'
          },
          {
            text: 'API Reference',
            link: '/api/options'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/vuejs/vue-router/releasess'
          }
        ],
        sidebar: [
          '/installation.md',
          '/',
          {
            title: 'Essentials',
            collapsable: false,
            children: [
              '/essentials/getting-started.md',
              '/essentials/dynamic-matching.md',
              '/essentials/nested-routes.md',
              '/essentials/navigation.md',
              '/essentials/named-routes.md',
              '/essentials/named-views.md',
              '/essentials/redirect-and-alias.md',
              '/essentials/passing-props.md',
              '/essentials/history-mode.md'
            ]
          },
          {
            title: 'Advanced',
            collapsable: false,
            children: [
              '/advanced/navigation-guards.md',
              '/advanced/meta.md',
              '/advanced/transitions.md',
              '/advanced/data-fetching.md',
              '/advanced/scroll-behavior.md',
              '/advanced/lazy-loading.md'
            ]
          },
          {
            title: 'API Reference',
            collapsable: false,
            children: [
              '/api/options.md',
              '/api/router-instance.md',
              '/api/route-object.md',
              '/api/component-injections.md',
              '/api/router-link.md',
              '/api/router-view.md'
            ]
          }
        ]
      }
    }
  }
}
