# Vue Router 源码解析

## 路径切换

主要梳理从一个路由导航到另一个路由发生了什么？

以 History API 为例: `/path/to/a` to `/path/to/b`

step 1. 调用 push，发生 transitionTo

step 2. 尝试根据 `/path/to/a` 匹配（创建）一个 route，发生 confirmTransition

step 3. 计算本次切换离开的组件、进入的组件和更新的组件

step 4. 依次执行路由守卫 beforeRouteLeave、beforeEach、beforeRouteUpdate、beforeEnter、resolve async components（解析异步组件）、beforeRouteEnter、beforeResolve、afterEach、DOM 更新、beforeRouteEnter 的 next 回调函数

依次执行的实现机制，基于一个 `runQueue` 函数，这个函数将依次执行 queue 里面的任务：


```js
function runQueue(queue, fn, cb) {
  const step = index => {
    if (index >= queue.length) {
      cb(); // 执行完后，调用回调
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1); // 按 queue 顺序执行
        })
      } else {
        step(index + 1);
      }
    }
  };

  step(0);
}
```

`runQueue` 就会按照上述机制依次执行 step 4 的路由守卫。

相同的路由守卫执行顺序：父组件 -> 子组件，这个由 `formatMatch` 函数控制：

```js
function formartMatch(record) {
  const res = [];
  while(record) {
    res.unshift(record);
    record = record.parent;
  }
  return res;
}
```

有特例：`beforeRouteLeave`，它的执行顺序是：子组件 -> 父组件。这是在 `extractGuards` 函数执行的时候传入了 `reverse: true` 翻转了守卫的顺序。
