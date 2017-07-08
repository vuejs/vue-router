import Vue from 'vue'
import VueRouter from 'vue-router'

const DeepA = { template: '<div><router-view class="async-viewA"></router-view></div>' }

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
    path: 'a',
    component: DeepA,
    loadChildren: () => import('./deep-async-b').then(asyncConfig => asyncConfig.routes)
  }
]
