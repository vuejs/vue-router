<template>
  <div class="post">
    <div v-if="error" style="color: red;">
      {{ error }}
    </div>
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_ROOT = 'http://jsonplaceholder.typicode.com'

export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route' () { this.fetchData() }
  },
  methods: {
    fetchData () {
      axios.get(`${API_ROOT}/posts/${this.$route.params.id}`)
        .then(res => { this.post = res.data })
        .catch(err => { this.error = err.toString() })
    }
  }
}
</script>
