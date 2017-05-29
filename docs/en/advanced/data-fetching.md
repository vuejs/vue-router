# Data Fetching

Sometimes you need to fetch data from the server when a route is activated. For example, before rendering a user profile, you need to fetch the user's data from the server. We can achieve this in two different ways:

- **Fetching After Navigation**: perform the navigation first, and fetch data in the incoming component's lifecycle hook. Display a loading state while data is being fetched.

- **Fetching Before Navigation**: Fetch data before navigation in the route enter guard, and perform the navigation after data has been fetched.

Technically, both are valid choices - it ultimately depends on the user experience you are aiming for.

## Fetching After Navigation

When using this approach, we navigate and render the incoming component immediately, and fetch data in the component's `created` hook. It gives us the opportunity to display a loading state while the data is being fetched over the network, and we can also handle loading differently for each view.

Let's assume we have a `Post` component that needs to fetch the data for a post based on `$route.params.id`:

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
      // replace `getPost` with your data fetching util / API wrapper
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

## Fetching Before Navigation

With this approach we fetch the data before actually navigating to the new
route. We can perform the data fetching in the `beforeRouteEnter` guard in the incoming component, and only call `next` when the fetch is complete:

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
  // when route changes and this component is already rendered,
  // the logic will be slightly different.
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

The user will stay on the previous view while the resource is being fetched for the incoming view. It is therefore recommended to display a progress bar or some kind of indicator while the data is being fetched. If the data fetch fails, it's also necessary to display some kind of global warning message.
