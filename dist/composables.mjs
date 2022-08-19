/*!
  * vue-router v3.5.4
  * (c) 2022 Evan You
  * @license MIT
  */
import { getCurrentInstance, effectScope, shallowReactive, onUnmounted } from 'vue';

function useRouter () {
  var i = getCurrentInstance();
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('useRouter');
  }

  return i.proxy.$root.$router
}

function useRoute () {
  var i = getCurrentInstance();
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('useRoute');
  }

  var root = i.proxy.$root;
  if (!root._$route) {
    var route = effectScope(true).run(
      function () { return shallowReactive(Object.assign({}, root.$router.currentRoute)); }
    );
    root._$route = route;

    root.$router.afterEach(function (to) {
      Object.assign(route, to);
    });
  }

  return root._$route
}

// TODO:
// export function useLink () {}

function onBeforeRouteUpdate (guard) {
  var i = getCurrentInstance();
  if (process.env.NODE_ENV !== 'production' && !i) {
    throwNoCurrentInstance('onBeforeRouteUpdate');
  }

  var router = useRouter();

  var target = i.proxy;
  // find the nearest routerview to know the depth
  while (target && target.$vnode && target.$vnode.data && target.$vnode.data.routerViewDepth == null) {
    target = target.$parent;
  }

  var depth = target && target.$vnode && target.$vnode.data ? target.$vnode.data.routerViewDepth : null;

  console.log('found depth', depth);

  // TODO: allow multiple guards?
  i.proxy.$options.beforeRouteUpdate = guard;

  var removeGuard = router.beforeEach(function (to, from, next) {
    // TODO: check it's an update
    return guard(to, from, next)
  });

  onUnmounted(removeGuard);

  return removeGuard
}

// TODO:
// export function onBeforeRouteLeave () {}

function throwNoCurrentInstance (method) {
  throw new Error(
    ("[vue-router]: Missing current instance. " + method + "() must be called inside <script setup> or setup().")
  )
}

export { onBeforeRouteUpdate, useRoute, useRouter };
