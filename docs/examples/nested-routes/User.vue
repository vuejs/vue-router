<template>
  <div>
    <h2>User {{ $route.params.id }}</h2>
    <ul>
      <li>
        <router-link :to="'/user/' + $route.params.id + '/profile'">/user/{{ $route.params.id }}/profile</router-link>
      </li>
      <li>
        <router-link :to="'/user/' + $route.params.id + '/posts'">/user/{{ $route.params.id }}/posts</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>
