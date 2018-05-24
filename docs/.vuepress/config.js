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
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'API Reference',
            link: '/api/'
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: {
          '/api/': [
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
          ],
          '/': [
            '/installation.md',
            '/',
            {
              title: 'Essentials',
              collapsable: false,
              children: [
                '/guide/essentials/getting-started.md',
                '/guide/essentials/dynamic-matching.md',
                '/guide/essentials/nested-routes.md',
                '/guide/essentials/navigation.md',
                '/guide/essentials/named-routes.md',
                '/guide/essentials/named-views.md',
                '/guide/essentials/redirect-and-alias.md',
                '/guide/essentials/passing-props.md',
                '/guide/essentials/history-mode.md'
              ]
            },
            {
              title: 'Advanced',
              collapsable: false,
              children: [
                '/guide/advanced/navigation-guards.md',
                '/guide/advanced/meta.md',
                '/guide/advanced/transitions.md',
                '/guide/advanced/data-fetching.md',
                '/guide/advanced/scroll-behavior.md',
                '/guide/advanced/lazy-loading.md'
              ]
            }
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: 'API 参考',
            link: '/zh/api/'
          },
          {
            text: '更新记录',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: {
          '/zh/api/': [
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
          ],
          '/zh/': [
            '/zh/installation.md',
            '/zh/',
            {
              title: '基础',
              collapsable: false,
              children: [
                '/zh/guide/essentials/getting-started.md',
                '/zh/guide/essentials/dynamic-matching.md',
                '/zh/guide/essentials/nested-routes.md',
                '/zh/guide/essentials/navigation.md',
                '/zh/guide/essentials/named-routes.md',
                '/zh/guide/essentials/named-views.md',
                '/zh/guide/essentials/redirect-and-alias.md',
                '/zh/guide/essentials/passing-props.md',
                '/zh/guide/essentials/history-mode.md'
              ]
            },
            {
              title: '进阶',
              collapsable: false,
              children: [
                '/zh/guide/advanced/navigation-guards.md',
                '/zh/guide/advanced/meta.md',
                '/zh/guide/advanced/transitions.md',
                '/zh/guide/advanced/data-fetching.md',
                '/zh/guide/advanced/scroll-behavior.md',
                '/zh/guide/advanced/lazy-loading.md'
              ]
            }
          ]
        }
      }
    }
  }
}
