import Vue from 'vue'
import VueRouter from 'vue-router'

const BasicDefault = { template: '<div>basic-default</div>' }
const BasicFoo = { template: '<div>basic-foo</div>' }
const BasicBar = { template: '<div>basic-bar</div>' }

export const routes = [
  { path: '', component: BasicDefault },
  { path: 'foo', component: BasicFoo },
  { path: 'bar', component: BasicBar }
]
