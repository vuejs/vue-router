const DeepB = { template: '<div>deep-async-b</div>' }

export const routes = [
  {
    path: '',
    component: {},
    loadChildren: () => Promise.reject('Default async route loaded when it should not have been.')
  },
  {
    path: 'test',
    component: {},
    loadChildren: () => Promise.reject('Test async route loaded when it should not have been.')
  },
  {
    path: 'b',
    component: DeepB
  }
]
