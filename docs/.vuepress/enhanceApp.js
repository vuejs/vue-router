export default ({ router }) => {
  router.addRoutes([
    { path: '/guide/', redirect: '/guide/essentials/getting-started.html' },
    { path: '/:lang/guide/', redirect: '/:lang/guide/essentials/getting-started.html' },
    { path: '/api/', redirect: '/api/options.html' },
    { path: '/:lang/api/', redirect: '/:lang/api/options.html' }
  ])
}
