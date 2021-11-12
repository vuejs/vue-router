<template>
  <a id="vs" href="https://vueschool.io/sales/blackfriday?friend=vuerouter" target="_blank" rel="noreferrer">
    <BannerCoins />
    <div class="vs-core">
      <div class="vs-logo">
        <img src="/images/vueschool/vueschool_blackfriday_logo.svg">
      </div>
      <div class="vs-slogan">
        <div class="vs-slogan-subtitle">
          Access to all Vue Courses at Vue School
        </div>
        <div class="vs-slogan-title">
          Black Friday <strong>40% OFF</strong>
        </div>
      </div>
      <div class="vs-button">
        Get Discount
      </div>
    </div>
    <div id="vs-close" class="vs-close" @click.stop.prevent="$emit('close')">
      <img src="/images/vueschool/vueschool_close.svg" alt="Close">
    </div>
  </a>
</template>

<script>
import BannerCoins from './BannerCoins.vue'

export default {
  components: {
    BannerCoins
  }
}
</script>

<style lang="stylus">
$topBannerHeight ?= 5rem
$topBannerHeightMobile ?= 5rem
$navbarHeight ?= 3.6rem
$contentClass = '.theme-default-content'

@import url('https://fonts.googleapis.com/css?family=Archivo:400,600')

// Banner
#vs
  align-items: center
  background-color: #000c19
  box-sizing: border-box
  color: #fff
  display: none
  font-family 'Inter', Roboto, Oxygen, Fira Sans, Helvetica Neue, sans-serif
  justify-content: center
  position: fixed
  padding: 0 10px
  left: 0
  right: 0
  top: 0
  z-index: 100
  line-height: 1
  height: $topBannerHeightMobile
  @media (min-width: 680px)
    height: $topBannerHeight
    justify-content: center

  &:hover
    .vs-core
      .vs-button
        background: linear-gradient(261deg, #e61463 100%, #db5248 3%)

  .vs-core
    display: flex
    align-items: center

    .vs-slogan
      font-family: Archivo
      color: #FFF
      margin-left: 8px
      @media (min-width: 680px)
        margin-left: 24px
      .vs-slogan-subtitle
        font-size: 12px
        @media (min-width: 680px)
          font-size: 14px
      .vs-slogan-title
        margin-top: 6px
        font-size: 16px
        font-weight: 600
        @media (min-width: 680px)
          font-size: 18px
        strong
          color: #ffae29
          font-weight: 600

    .vs-button
      color: #FFF
      padding: 7px 10px
      border-radius: 4px
      background: linear-gradient(to left, #e61b60, #dd4a4c)
      font-weight: 600
      font-family: 'Archivo', sans-serif
      white-space: nowrap
      margin-right: 22px
      margin-left: 16px
      @media (min-width: 680px)
        margin-right: 0
        padding: 8px 24px
        margin-left: 32px
      @media (min-width: 680px)
        margin-left: 69px

  .vs-close
      right: 6px
      position: absolute
      @media (min-width: 680px)
        padding: 10px
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
