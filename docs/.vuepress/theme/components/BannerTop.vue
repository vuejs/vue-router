<template>
  <a id="vs" href="https://vueschool.io/the-vuejs-master-class/?friend=vuerouter#plans" target="_blank" rel="noreferrer">
    <div class="vs-iso">
      <img src="/images/vueschool/vs-iso.svg" alt="Vue School Logo">
    </div>
    <div class="vs-logo">
      <img src="/images/vueschool/vs-logo.svg" alt="Vue School Logo">
    </div>
    <div class="vs-core">
      <div class="vs-slogan">
        <div class="vs-slogan-up">
           LEARN VUE AT VUE SCHOOL
        </div>
        <div class="vs-slogan-down">
          Register today and get <strong>20% OFF</strong>
        </div>
      </div>
      <div class="vs-button">
        <div class="vs-button-inside">
          <img src="/images/vueschool/learn-more.svg" alt="Learn More">
        </div>
      </div>
    </div>
    <div
      id="vs-close"
      class="vs-close"
      @click.stop.prevent="$emit('close')">
      <img src="/images/vueschool/close.svg" alt="Close">
    </div>
  </a>
</template>


<style lang="stylus">
$topBannerHeight ?= 5rem
$topBannerHeightMobile ?= 3.125rem
$navbarHeight ?= 3.6rem
$contentClass = '.theme-default-content'

@import url('https://fonts.googleapis.com/css?family=Roboto')

// Banner
#vs
  align-items: center
  background-color: #1E204D
  background-position: top right
  background-repeat: no-repeat
  background-size: cover
  box-sizing: border-box
  color: #fff
  display: none
  font-family 'Roboto', Oxygen, Fira Sans, Helvetica Neue, sans-serif
  justify-content: center
  position: fixed
  padding: 0 10px
  left: 0
  right: 0
  top: 0
  z-index: 100
  background-image: url(/images/vueschool/vs-banner-bg-mobile-2.svg)
  height: $topBannerHeightMobile
  @media (min-width: 680px)
    height: $topBannerHeight
    background-image: url(/images/vueschool/vs-banner-bg-tablet-2.svg)
  @media (min-width: 900px)
    background-image: url(/images/vueschool/vs-banner-bg-desktop-2.svg)
  &:hover
    .vs-core
      .vs-button
        .vs-button-inside
          background: linear-gradient(#ed81eb, #d457d0)

  .vs-iso
      position: absolute
      left: 20px
      height: 26px
      img
        height: 26px
      @media (min-width: 680px)
        left: 40px
        height: 40px
        img
          height: 40px
      @media (min-width: 900px)
        display: none

  .vs-logo
    position: absolute
    display: none
    left: 40px
    @media (min-width: 900px)
      display: block

  .vs-core
    display: flex
    align-items: center

    .vs-slogan
      text-align: center

      .vs-slogan-up
        color: #47b785
        font-size: 14px
        font-weight: bold
        @media (min-width: 680px)
          font-size: 18px

      .vs-slogan-down
        color: #fff
        font-size: 12px
        padding-top: 2px
        @media (min-width: 680px)
          font-size: 16px
        strong
          color: #fff
          font-weight: bold

    .vs-button
      margin-left: 43px
      color: #fff
      background: linear-gradient(to bottom, #b349b0, #dc61da)
      padding: 2px
      border-radius: 40px
      display: none
      @media (min-width: 680px)
        display: inline-block
      .vs-button-inside
        border-radius: 40px
        background: linear-gradient(#dc61da, #b349b0)
        transition: all .25s ease-in
        padding: 12px 24px 8px
        line-height: 0
        @media (min-width: 680px)
          padding: 12px 24px 8px
      &.vs-button-alt
        background: linear-gradient(to bottom, #ffcc38, #ffd13d)
        .vs-button-inside
          background: linear-gradient(to bottom, #ffe24f, #ffa40e)

  .vs-close
    right: 10px
    position: absolute
    padding: 10px
    @media (min-width: 680px)
      right: 20px
    &:hover
      color: #56D8FF

/************************************/

// Show banner only if the container has class "has-top-banner"
.theme-container.has-top-banner
  #vs
    display: flex

// Add margin top to body, navbar and sidebar
.theme-container.has-top-banner
  margin-top: $topBannerHeightMobile
  .navbar
    margin-top: $topBannerHeightMobile
  .sidebar
    margin-top: $topBannerHeightMobile
@media (min-width: 680px)
  .theme-container.has-top-banner
    margin-top: $topBannerHeight
    .navbar
      margin-top: $topBannerHeight
    .sidebar
      margin-top: $topBannerHeight

// Adjust titles margin and padding for anchor links
.theme-container.has-top-banner
  {$contentClass}:not(.custom)
    h1, h2, h3, h4, h5, h6
      margin-top (2.5rem - $topBannerHeightMobile - $navbarHeight)
      padding-top ($navbarHeight + $topBannerHeightMobile + 1rem)
@media (min-width: 680px)
  .theme-container.has-top-banner
    {$contentClass}:not(.custom)
      h1, h2, h3, h4, h5, h6
        margin-top (2.5rem - $topBannerHeight - $navbarHeight)
        padding-top ($navbarHeight + $topBannerHeight + 1rem)
</style>
