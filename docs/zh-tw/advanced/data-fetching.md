
# 數據獲取

有時候，進入某個路由後，需要從服務器獲取數據。例如，在渲染用戶信息時，你需要從服務器獲取用戶的數據。我們可以通過兩種方式來實現：

- **導航完成之後獲取**：先完成導航，然後在接下來的組件生命週期鈎子中獲取數據。在數據獲取期間顯示『加載中』之類的指示。

- **導航完成之前獲取**：導航完成前，在路由進入的守衛中獲取數據，在數據獲取成功後執行導航。

從技術角度講，兩種方式都不錯 —— 就看你想要的用戶體驗是哪種。

## 導航完成後獲取數據

當你使用這種方式時，我們會馬上導航和渲染組件，然後在組件的 `created` 鈎子中獲取數據。這讓我們有機會在數據獲取期間展示一個 loading 狀態，還可以在不同視圖間展示不同的 loading 狀態。

假設我們有一個 `Post` 組件，需要基於 `$route.params.id` 獲取文章數據：

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>
```

``` js
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 組件創建完後獲取數據，
    // 此時 data 已經被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有變化，會再次執行該方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```

## 在導航完成前獲取數據

通過這種方式，我們在導航轉入新的路由前獲取數據。我們可以在接下來的組件的  `beforeRouteEnter` 守衛中獲取數據，當數據獲取成功後只調用 `next` 方法。

``` js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改變前，組件就已經渲染完了
  // 邏輯稍稍不同
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}
```

在為後面的視圖獲取數據時，用戶會停留在當前的界面，因此建議在數據獲取期間，顯示一些進度條或者別的指示。如果數據獲取失敗，同樣有必要展示一些全局的錯誤提醒。

