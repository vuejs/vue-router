# データ取得

<div class="vueschool"><a href="https://vueschool.io/courses/vue-router-for-everyone?friend=vuejs" target="_blank" rel="sponsored noopener" title="Learn how to build powerful Single Page Applications with the Vue Router on Vue School">Watch a free video course about Vue Router on Vue School</a></div>

ルートが有効化された時にサーバーからデータを取得する必要がしばしばあります。例えば、ユーザープロフィールを描画する前に、サーバーからユーザーデータを取得する必要があります。これを実現するためには 2 種類の方法があります。

- **ナビゲーション後の取得**: ナビゲーションを先に実行し、その後次に入ってくるコンポーネントのライフサイクルフック内でデータを取得します。データ取得中にローディングを表示します。

- **ナビゲーション前の取得**: ルートに入るガード内でナビゲーション前にデータ取得をします。そして、データ取得後にナビゲーションを実行します。

技術的にはどちらも正当な選択肢です。究極的にはあなたが目指しているユーザーエクスペリエンスに依存します。

## ナビゲーション後の取得

このアプローチを取る時は次に来るコンポーネントが即座にナビゲーションされ、描画されます。そして、コンポーネントの `created` フックの中でデータを取得します。この方法ではネットワーク越しにデータを取得している間にローディング状態を表示する機会があります。また、各 view に対して、異なるローディングの対応をすることもできます。

`$route.params.id` を元にポストのデータを取得する必要がある `Post` コンポーネントを想定してみましょう。

``` html
<template>
  <div class="post">
    <div v-if="loading" class="loading">
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
    // view が作られた時にデータを取得し、
    // そのデータは既に監視されています
    this.fetchData()
  },
  watch: {
    // ルートが変更されたらこのメソッドを再び呼び出します
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // `getPost` をあなたのデータ取得用 util や API ラッパーに置き換えてください
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

## ナビゲーション前の取得

こちらのアプローチでは新しいルートへ実際にナビゲーションする前にデータを取得します。次に入ってくるコンポーネント内の  `beforeRouteEnter` ガードでデータ取得を実行できます。データ取得が完了したら `next` を呼ぶだけです。

``` js
export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (route, redirect, next) {
    getPost(route.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // コンポーネントが既に描画されている際のルート変更時は
  // ロジックが少し異なります
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

次に入ってくる view へのリソースを取得している間、ユーザーは前の view に滞在します。したがって、データ取得中にプログレスバーや何らかの指標を表示することをオススメします。また、もしデータ取得が失敗した場合、何かグローバルな警告メッセージのようなものを表示する必要があります。
