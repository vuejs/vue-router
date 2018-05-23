module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Router',
      description: 'The official router for Vue.js.'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vue Router',
      description: 'Vue.js 官方的路由管理器。'
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
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '起步',
            link: '/zh/essentials/getting-started'
          },
          {
            text: 'API 参考',
            link: '/zh/api/options'
          },
          {
            text: '更新记录',
            link: 'https://github.com/vuejs/vue-router/releasess'
          }
        ],
        sidebar: [
          '/zh/installation.md',
          '/zh/',
          {
            title: '基础',
            collapsable: false,
            children: [
              '/zh/essentials/getting-started.md',
              '/zh/essentials/dynamic-matching.md',
              '/zh/essentials/nested-routes.md',
              '/zh/essentials/navigation.md',
              '/zh/essentials/named-routes.md',
              '/zh/essentials/named-views.md',
              '/zh/essentials/redirect-and-alias.md',
              '/zh/essentials/passing-props.md',
              '/zh/essentials/history-mode.md'
            ]
          },
          {
            title: '进阶',
            collapsable: false,
            children: [
              '/zh/advanced/navigation-guards.md',
              '/zh/advanced/meta.md',
              '/zh/advanced/transitions.md',
              '/zh/advanced/data-fetching.md',
              '/zh/advanced/scroll-behavior.md',
              '/zh/advanced/lazy-loading.md'
            ]
          },
          {
            title: 'API 参考',
            collapsable: false,
            children: [
              '/zh/api/options.md',
              '/zh/api/router-instance.md',
              '/zh/api/route-object.md',
              '/zh/api/component-injections.md',
              '/zh/api/router-link.md',
              '/zh/api/router-view.md'
            ]
          }
        ]
      }
    }
  }
}
