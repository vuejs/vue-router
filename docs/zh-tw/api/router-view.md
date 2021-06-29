
# `<router-view>`

`<router-view>` 組件是一個 functional 組件，渲染路徑匹配到的視圖組件。`<router-view>` 渲染的組件還可以內嵌自己的 `<router-view>`，根據嵌套路徑，渲染嵌套組件。

### 屬性

- **name**

  - 類型: `string`

  - 默認值: `"default"`

如果 `<router-view>`設置了名稱，則會渲染對應的路由配置中 `components` 下的相應組件。查看 [命名視圖](../essentials/named-views.md) 中的例子。

### 行為表現

其他屬性（非 router-view 使用的屬性）都直接傳給渲染的組件，
很多時候，每個路由的數據都是包含在路由參數中。

因為它也是個組件，所以可以配合 `<transition>` 和 `<keep-alive>` 使用。如果兩個結合一起用，要確保在內層使用 `<keep-alive>`：

``` html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```

