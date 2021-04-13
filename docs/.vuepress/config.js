module.exports = ctx => ({
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
    },
    '/ja/': {
      lang: 'ja',
      title: 'Vue Router',
      description: 'Vue.js の公式ルータ'
    },
    '/ru/': {
      lang: 'ru',
      title: 'Vue Router',
      description: 'Официальный маршрутизатор для Vue.js.'
    },
    '/kr/': {
      lang: 'kr',
      title: 'Vue Router',
      description: 'Vue.js 공식 라우터'
    },
    '/fr/': {
      lang: 'fr',
      title: 'Vue Router',
      description: 'Routeur officiel pour Vue.Js'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    [
      'link',
      { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#3eaf7c'
      }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/msapplication-icon-144x144.png'
      }
    ]
  ],
  // theme: '@vuepress/vue',
  plugins: [
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      }
    ]
  ],
  themeConfig: {
    algolia: ctx.isProd
      ? {
          apiKey: 'f854bb46d3de7eeb921a3b9173bd0d4c',
          indexName: 'vue-router'
        }
      : null,
    carbonAds: {
      carbon: 'CEBICK3I',
      custom: 'CEBICK3M',
      placement: 'routervuejsorg'
    },
    repo: 'vuejs/vue-router',
    docsDir: 'docs',
    smoothScroll: true,
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
        sidebar: [
          '/installation.md',
          {
            title: 'Essentials',
            collapsable: false,
            children: [
              '/guide/',
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
              '/guide/advanced/lazy-loading.md',
              '/guide/advanced/navigation-failures.md'
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
        sidebar: [
          '/zh/installation.md',
          {
            title: '基础',
            collapsable: false,
            children: [
              '/zh/guide/',
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
              '/zh/guide/advanced/lazy-loading.md',
              '/zh/guide/advanced/navigation-failures.md'
            ]
          }
        ]
      },
      '/ja/': {
        label: '日本語',
        selectText: '言語',
        editLinkText: 'GitHub 上でこのページを編集する',
        nav: [
          {
            text: 'ガイド',
            link: '/ja/guide/'
          },
          {
            text: 'API リファレンス',
            link: '/ja/api/'
          },
          {
            text: 'リリースノート',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: [
          '/ja/installation.md',
          {
            title: '基本的な使い方',
            collapsable: false,
            children: [
              '/ja/guide/',
              '/ja/guide/essentials/dynamic-matching.md',
              '/ja/guide/essentials/nested-routes.md',
              '/ja/guide/essentials/navigation.md',
              '/ja/guide/essentials/named-routes.md',
              '/ja/guide/essentials/named-views.md',
              '/ja/guide/essentials/redirect-and-alias.md',
              '/ja/guide/essentials/passing-props.md',
              '/ja/guide/essentials/history-mode.md'
            ]
          },
          {
            title: '高度な使い方',
            collapsable: false,
            children: [
              '/ja/guide/advanced/navigation-guards.md',
              '/ja/guide/advanced/meta.md',
              '/ja/guide/advanced/transitions.md',
              '/ja/guide/advanced/data-fetching.md',
              '/ja/guide/advanced/scroll-behavior.md',
              '/ja/guide/advanced/lazy-loading.md'
            ]
          }
        ]
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Переводы',
        editLinkText: 'Изменить эту страницу на GitHub',
        nav: [
          {
            text: 'Руководство',
            link: '/ru/guide/'
          },
          {
            text: 'Справочник API',
            link: '/ru/api/'
          },
          {
            text: 'История изменений',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: [
          '/ru/installation.md',
          {
            title: 'Основы',
            collapsable: false,
            children: [
              '/ru/guide/',
              '/ru/guide/essentials/dynamic-matching.md',
              '/ru/guide/essentials/nested-routes.md',
              '/ru/guide/essentials/navigation.md',
              '/ru/guide/essentials/named-routes.md',
              '/ru/guide/essentials/named-views.md',
              '/ru/guide/essentials/redirect-and-alias.md',
              '/ru/guide/essentials/passing-props.md',
              '/ru/guide/essentials/history-mode.md'
            ]
          },
          {
            title: 'Продвинутые темы',
            collapsable: false,
            children: [
              '/ru/guide/advanced/navigation-guards.md',
              '/ru/guide/advanced/meta.md',
              '/ru/guide/advanced/transitions.md',
              '/ru/guide/advanced/data-fetching.md',
              '/ru/guide/advanced/scroll-behavior.md',
              '/ru/guide/advanced/lazy-loading.md',
              '/ru/guide/advanced/navigation-failures.md'
            ]
          }
        ]
      },
      '/kr/': {
        label: '한국어',
        selectText: '언어',
        editLinkText: 'GitHub에서 이 문서를 수정하세요',
        nav: [
          {
            text: '가이드',
            link: '/kr/guide/'
          },
          {
            text: 'API 레퍼런스',
            link: '/kr/api/'
          },
          {
            text: '릴리즈 노트',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: [
          '/kr/installation.md',
          {
            title: '기본 사용법',
            collapsable: false,
            children: [
              '/kr/guide/',
              '/kr/guide/essentials/dynamic-matching.md',
              '/kr/guide/essentials/nested-routes.md',
              '/kr/guide/essentials/navigation.md',
              '/kr/guide/essentials/named-routes.md',
              '/kr/guide/essentials/named-views.md',
              '/kr/guide/essentials/redirect-and-alias.md',
              '/kr/guide/essentials/passing-props.md',
              '/kr/guide/essentials/history-mode.md'
            ]
          },
          {
            title: '고급 사용법',
            collapsable: false,
            children: [
              '/kr/guide/advanced/navigation-guards.md',
              '/kr/guide/advanced/meta.md',
              '/kr/guide/advanced/transitions.md',
              '/kr/guide/advanced/data-fetching.md',
              '/kr/guide/advanced/scroll-behavior.md',
              '/kr/guide/advanced/lazy-loading.md'
            ]
          }
        ]
      },
      '/fr/': {
        label: 'Français',
        selectText: 'Langues',
        editLinkText: 'Editer cette page sur Github',
        nav: [
          {
            text: 'Guide',
            link: '/fr/guide/'
          },
          {
            text: 'API',
            link: '/fr/api/'
          },
          {
            text: 'Notes de version',
            link: 'https://github.com/vuejs/vue-router/releases'
          }
        ],
        sidebar: [
          '/fr/installation.md',
          {
            title: 'Essentiels',
            collapsable: false,
            children: [
              '/fr/guide/',
              '/fr/guide/essentials/dynamic-matching.md',
              '/fr/guide/essentials/nested-routes.md',
              '/fr/guide/essentials/navigation.md',
              '/fr/guide/essentials/named-routes.md',
              '/fr/guide/essentials/named-views.md',
              '/fr/guide/essentials/redirect-and-alias.md',
              '/fr/guide/essentials/passing-props.md',
              '/fr/guide/essentials/history-mode.md'
            ]
          },
          {
            title: 'Avancés',
            collapsable: false,
            children: [
              '/fr/guide/advanced/navigation-guards.md',
              '/fr/guide/advanced/meta.md',
              '/fr/guide/advanced/transitions.md',
              '/fr/guide/advanced/data-fetching.md',
              '/fr/guide/advanced/scroll-behavior.md',
              '/fr/guide/advanced/lazy-loading.md'
            ]
          }
        ]
      }
    }
  }
})
