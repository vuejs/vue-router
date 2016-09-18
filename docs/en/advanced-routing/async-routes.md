# Async Routes

Sometimes you need to fetch data from the server before rendering a route. For
example, before visiting a user profile, you have to fetch his data from the
server. We can achieve this in two different ways. Each way provide a different
UX approach and both of them are valid designs.


## Fetching before navigation

This method consists on fetching the data before actually navigating to the new
route. For those using vue-router 1, this works as the `activate` hook. In
vue-router 2 you use the `beforeRouteEnter` hook to control the navigation flow.
You get access to the `route`, a `redirect` function and a `next` callback to
let the navigation end. Not calling the `next` callback will simply cancel the
navigation. Note that this hook is

``` js
export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  beforeRouteEnter (route, redirect, next) {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData(route.params.id, next)
  },
  watch: {
    // call again the method if the route changes
    $route () {
      this.fetchData(this.$route.params.id)
    }
  },
  methods: {
    fetchData (id, cb) {
      this.error = this.post = null
      this.loading = true
      getPost(id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
        cb && cb()
      })
    }
  }
}
```

The user still can use the application while the resource is being fetched. It
is therefore recommended to show him with a progress bar or any other indicator
that the web site is waiting for data. If, during this time, the user navigates
somewhere else by clicking on a link, the navigation waiting for data will never
take place.

## Fetching inside the view

This method consists on fetching data during the component lifecycle. It allows
you to define how the content of your view is presented while the resources are
loading. Using this approach let you handle how loading in handled differently
for each view.

Replacing `beforeRouteEnter` with `created` is almost all you need to do to
switch to the other fetching method.

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
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
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

The component lifecycle will go on and once the data is fetched, the view will update acordingly. This way you can choose what to show while the data is being fetched. Here we're just displaying _Loading..._:

``` html
<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <transition name="slide">
      <!--
        giving the post container a unique key triggers transitions
        when the post id changes.
      -->
      <div v-if="post" class="content" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
      </div>
    </transition>
  </div>
</template>
```
