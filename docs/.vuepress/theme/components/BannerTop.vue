<template>
  <a id="vs" href="https://vueschool.io/sales/summer-vue?friend=vuerouter" target="_blank" rel="noreferrer">
    <div class="vs-iso">
      <img src="/images/vueschool/vs-iso.svg" alt="Vue School Logo">
    </div>
    <div class="vs-logo">
      <img src="/images/vueschool/vs-logo.svg" alt="Vue School Logo">
    </div>
    <div class="vs-core">
      <div class="vs-backpack">
        <img src="/images/vueschool/vs-backpack.png" alt="Backpack">
      </div>
      <div class="vs-slogan">
        Extended! <span class="vs-slogan-light">Last few hours</span> for the Vue School offer
      </div>
      <div class="vs-button">
        GET ACCESS
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
  background-color: #202A5A
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
  height: $topBannerHeightMobile
  @media (min-width: 680px)
    height: $topBannerHeight
  &:hover
    .vs-core
      .vs-button
        background: #f22606

  .vs-iso
    position: absolute
    left: 20px
    height: 26px
    display: none
    img
      height: 26px
    @media (min-width: 680px)
      display: block
      left: 20px
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
    margin-right: 20px
    @media (min-width: 680px)
      margin-right: 0

    .vs-backpack
      margin-right: 6px
      @media (min-width: 680px)
        margin-right: 2px
      img
        height: 50px
        @media (min-width: 680px)
          height: 74px

    .vs-slogan
      color: #FFF
      font-weight: bold
      font-size: 14px
      text-align: center
      padding: 0 60px
      @media (min-width: 680px)
        padding: 0
        text-align: left
        margin-right: 26px
        margin-right: 0
        font-size: 18px
      > .vs-slogan-light
        color: #ff5338
        text-align: left
        @media (min-width: 900px)
          text-align: center
          display: inline

    .vs-button
      margin-left: 13px
      color: #FFF
      padding: 13px 24px
      border-radius: 40px
      display: none
      background: #ff5338
      font-weight: bold
      @media (min-width: 680px)
        display: inline-block

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
.main-container.has-top-banner
  #vs
    display: flex

// Add margin top to body, navbar and sidebar
.main-container.has-top-banner
  margin-top: $topBannerHeightMobile
  .navbar
    margin-top: $topBannerHeightMobile
  .sidebar
    margin-top: $topBannerHeightMobile
@media (min-width: 680px)
  .main-container.has-top-banner
    margin-top: $topBannerHeight
    .navbar
      margin-top: $topBannerHeight
    .sidebar
      margin-top: $topBannerHeight

// Adjust titles margin and padding for anchor links
.main-container.has-top-banner
  {$contentClass}:not(.custom)
    h1, h2, h3, h4, h5, h6
      margin-top (2.5rem - $topBannerHeightMobile - $navbarHeight)
      padding-top ($navbarHeight + $topBannerHeightMobile + 1rem)
@media (min-width: 680px)
  .main-container.has-top-banner
    {$contentClass}:not(.custom)
      h1, h2, h3, h4, h5, h6
        margin-top (2.5rem - $topBannerHeight - $navbarHeight)
        padding-top ($navbarHeight + $topBannerHeight + 1rem)
</style>
