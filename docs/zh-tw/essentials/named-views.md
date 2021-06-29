
# 命名視圖

有時候想同時（同級）展示多個視圖，而不是嵌套展示，例如創建一個佈局，有 `sidebar`（側導航） 和 `main`（主內容） 兩個視圖，這個時候命名視圖就派上用場了。你可以在界面中擁有多個單獨命名的視圖，而不是只有一個單獨的出口。如果 `router-view` 沒有設置名字，那麼默認為 `default`。

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

一個視圖使用一個組件渲染，因此對於同個路由，多個視圖就需要多個組件。確保正確使用 `components` 配置（帶上 s）：

``` js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

以上案例相關的可運行代碼請[移步這裡](https://jsfiddle.net/posva/6du90epg/)。

