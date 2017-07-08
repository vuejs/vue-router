const DeepA = { template: '<div><router-view class="async-viewA"></router-view></div>' }

export const routes = [
  {
    path: '',
    component: DeepA,
    loadChildren: () => import('./deep-async-default-b').then(asyncConfig => asyncConfig.routes)
  },
  {
    path: 'test',
    component: {},
    loadChildren: () => Promise.reject('Test async route loaded when it should not have been.')
  }
]
