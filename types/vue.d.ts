/**
 * Augment the typings of Vue.js
 */

import Vue from "vue";
import VueRouter, { Route, RawLocation, NavigationGuard } from "./index";

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<Data, Methods, Computed, Props> {
    router?: VueRouter;
    beforeRouteEnter?: NavigationGuard;
    beforeRouteLeave?: NavigationGuard;
    beforeRouteUpdate?: NavigationGuard;
  }
}
