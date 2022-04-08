<template>
  <a
    id="vs"
    href="https://vueschool.io/free-weekend?friend=vuerouter"
    target="_blank"
    rel="noreferrer"
  >
    <div class="vs-logo">
      <img src="/images/vueschool/vs-iso.svg" class="logo-small">
      <img src="/images/vueschool/vs-logo.svg" class="logo-big">
    </div>
    <div class="vs-core">
      <div class="vs-slogan">
        <div class="vs-slogan-subtitle">
          VUE 3 MASTERCLASS - FREE WEEKEND
        </div>
        <div class="vs-slogan-title">
          Register at <strong>vueschool.io/free-weekend</strong>
        </div>
      </div>
      <div class="vs-button">
        Free Access
      </div>
    </div>
    <div id="vs-close" class="vs-close" @click.stop.prevent="$emit('close')">
      <img src="/images/vueschool/vs-close.svg" alt="Close">
    </div>
  </a>
</template>

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
  background-image: url(/images/vueschool/vs-fw-bg.svg)
  background-size: cover
  background-repeat: no-repeat
  @media (min-width: 680px)
    height: $topBannerHeight
    justify-content: center

  &:hover
    .vs-core
      .vs-button
        background: linear-gradient(261deg, #e61463 100%, #db5248 3%)
        border-color: #e61463

  .vs-logo {
    position: absolute
    left: 20px
    top: 20px

    .logo-small {
      display: none
      @media (min-width: 680px) {
        display: inline-block
      }
      @media (min-width: 1024px) {
        display: none
      }
    }

    .logo-big {
      display: none
      @media (min-width: 1024px) {
        display: inline-block
      }
    }
  }

  .vs-core
    display: flex
    align-items: center

    .vs-slogan
      font-family: Archivo
      color: #FFF
      margin-left: 8px
      text-align: center
      @media (min-width: 680px)
        margin-left: 24px
      .vs-slogan-subtitle
        font-size: 14px
        color: #47b785
        font-weight: bold
        @media (min-width: 680px)
          font-size: 19px
      .vs-slogan-title
        margin-top: 6px
        font-size: 16px
        font-weight: 400
        @media (min-width: 680px)
          font-size: 18px
        strong
          color: #48a0ff
          font-weight: 400

    .vs-button
      color: #fff
      padding: 7px 10px
      font-weight: 600
      white-space: nowrap
      margin-right: 18px
      margin-left: 16px
      font-family: 'Archivo', sans-serif
      object-fit: contain
      border-radius: 30px
      border-style: solid
      border-width: 2px
      background-image: linear-gradient(255deg, #d457d0 98%, #ed81eb 2%), linear-gradient(to bottom, #b349b0, #db61d9)
      text-transform: uppercase
      border-color: #B349B0
      display: none
      @media (min-width: 680px)
        display: inline-block
        margin-right: 0
        padding: 8px 24px
        margin-left: 22px
      @media (min-width: 1024px)
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
