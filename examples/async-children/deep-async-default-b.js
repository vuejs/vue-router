import Vue from 'vue'
import VueRouter from 'vue-router'

const DeepB = { template: '<div>deep-async-default-b</div>' }

export const routes = [
  {
    path: '',
    component: DeepB
  },
  {
    path: 'test',
    component: {},
    loadChildren: () => Promise.reject('Test async route loaded when it should not have been.')
  }
]
