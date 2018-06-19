# 데이터 가져오기

때로는 라우트가 활성화될 때 서버에서 데이터를 가져와야 합니다. 예를 들어, 사용자 프로필을 렌더링하기 전에 서버에서 사용자의 데이터를 가져와야 합니다. 우리는 두 가지 방법을 사용할 수 있습니다.

- **탐색 후 가져오기**: 먼저 탐색하고 들어오는 컴포넌트의 라이프 사이클 훅에서 데이터를 가져옵니다. 데이터를 가져오는 동안 로드 상태를 표시합니다.

- **탐색하기 전에 가져오기**: 라우트 가드에서 경로를 탐색하기 전에 데이터를 가져오고 그 후에 탐색을 수행합니다.

엄밀히 말하면 두 가지 모두 유효한 선택입니다. 궁극적인 목표는 사용자 경험에 달려 있습니다.

## 탐색 후 가져오기

이 방법을 사용하면 들어오는 컴포넌트를 즉시 탐색하고 렌더링하며 컴포넌트의 `created` 훅에서 데이터를 가져옵니다. 네트워크를 통해 데이터를 가져 오는 동안 로드 상태를 표시 할 수 있는 기회를 제공하며 각 뷰 마다 로드를 다르게 처리 할 수도 있습니다.

`$route.params.id`를 기반으로 한 게시물의 데이터를 가져와야하는 `Post` 컴포넌트가 있다고 가정 해 봅시다 :

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
    // 뷰가 생성되고 데이터가 이미 감시 되고 있을 때 데이터를 가져온다.
    this.fetchData()
  },
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출됩니다.
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // `getPost`를 데이터 가져오기 위한 유틸리티/API 래퍼로 변경합니다.
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

## 탐색하기 전에 가져오기

이 접근 방식을 사용하면 실제로 새 경로로 이동하기 전에 데이터를 가져옵니다.
들어오는 컴포넌트에서 `beforeRouteEnter` 가드에서 데이터를 가져올 수 있으며 페치가 완료되면 `next`만 호출 할 수 있습니다.


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
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출합니다
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // `getPost`를 데이터 페치 유틸리티/API 래퍼로 바꿉니다.
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

다음 뷰에 대한 리소스를 가져 오는 동안 사용자는 현재 뷰를 유지합니다. 따라서 데이터를 가져 오는 동안 진행률 표시줄이나 일종의 표시기를 표시하는 것을 추천합니다. 데이터 가져오기가 실패하면 일종의 전역 경고 메시지를 표시해야합니다.
