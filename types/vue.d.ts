/**
 * Augment the typings of Vue.js
 */

import Vue = require("vue");
import VueRouter = require("./index");
import { Route, RawLocation } from "./index";

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;

    beforeRouteEnter?: (
      this: never,
      route: Route,
      redirect: (location: RawLocation) => void,
      next: (callback: (vm: V) => any) => void
    ) => any;

    beforeRouteLeave?: (
      this: V,
      route: Route,
      redirect: (location: RawLocation) => void,
      next: () => void
    ) => any;
  }
}
