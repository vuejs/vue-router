<template>
  <div class="post">
    <div v-if="error" style="color: red;">
      {{ error }}
    </div>
    <div class="loading" v-if="loading">Loading...</div>
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
import request from 'superagent'

const API_ROOT = 'http://jsonplaceholder.typicode.com'

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.loading = true
      request
        .get(`${API_ROOT}/posts/${this.$route.params.id}`)
        .end((err, res) => {
          this.loading = false
          if (err) {
            this.error = err.toString()
          } else {
            this.post = res.body
          }
        })
    }
  }
}
</script>

<style>
.loading {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
