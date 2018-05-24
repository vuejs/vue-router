# 이름을 가지는 뷰

때로는 여러 개의 뷰를 중첩하지 않고 동시에 표시해야 하는 경우가 있습니다. `sidebar` 뷰와 `main` 뷰로 레이아웃을 생성합니다. 이름이 지정된 뷰가 편리한 경우 입니다. 뷰에 하나의 outlet이 있는 대신 여러 개를 사용하여 각 outlet에 이름을 지정할 수 있습니다. 이름이 없는 `router-view`는 이름으로 `default`가 주어집니다.

``` html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

뷰는 컴포넌트를 사용하여 렌더링 되므로 여러 뷰에는 동일한 라우트에 대해 여러 컴포넌트가 필요합니다. `components`(s를 붙입니다) 옵션을 사용해야합니다.

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

이 예제는 [여기](https://jsfiddle.net/posva/6du90epg/)에서 확인할 수 있습니다.
