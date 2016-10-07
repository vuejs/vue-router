# `<router-view>`

`<router-view>` 组件是一个 functional 组件，渲染路径匹配到的视图组件。`<router-view>` 渲染的组件还可以内嵌自己的 `<router-view>`，根据嵌套路径，渲染嵌套组件。

### 属性

- **name**

  - 类型: `string`

  - 默认值: `"default"`

如果 `<router-view>`设置了名称，则会渲染对应的路由配置中 `components` 下的相应组件。查看 [命名视图](../essentials/named-views.md) 中的例子。

### 行为表现

其他属性（非 router-view 使用的属性）都直接传给渲染的组件，
很多时候，每个路由的数据都是包含在路由参数中。

因为它也是个组件，所以可以配合 `<transition>` 和 `<keep-alive>` 使用。如果两个结合一起用，要确保在内层使用 `<keep-alive>`：

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```
