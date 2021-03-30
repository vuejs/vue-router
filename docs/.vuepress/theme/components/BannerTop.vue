<template>
  <a id="vs" href="https://vueschool.io/sales/flashsale21/?friend=vuerouter" target="_blank" rel="noreferrer">
    <div class="vs-iso">
      <img src="/images/vueschool/vs-iso.svg" alt="Vue School logo">
    </div>
    <div class="vs-logo">
      <img src="/images/vueschool/vs-logo.svg" alt="Vue School logo">
    </div>
    <div class="vs-core">
      <div class="vs-illustration">
        <img src="/images/vueschool/vs-backpack.svg" alt="backpack illustration">
      </div>
      <div class="vs-slogan">
        <span class="vs-slogan-main">Flash Sale -</span> Less than <span style="color: #1fdb69">48hrs left</span> to get 20% OFF!
      </div>
      <div class="vs-button">
        GET OFFER
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

#vs
  align-items: center
  background-color: #202A5A
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
  height: $topBannerHeightMobile
  @media (min-width: 680px)
    height: $topBannerHeight
  &:hover
    .vs-core
      .vs-button
        background-color: #364fde

  .vs-iso
      position: absolute
      left: 20px
      height: 26px
      img
        height: 26px
      @media (min-width: 680px)
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

    .vs-illustration
      display: none
      @media (min-width: 680px)
        display: inline-block
        margin-right: 8px
      @media (min-width: 900px)
        margin-right: 20px

    .vs-slogan
      text-align: center
      font-size: 14px
      @media (min-width: 680px)
        font-size: 20px
      @media (min-width: 900px)
        font-size: 22px
      .vs-slogan-main
        font-weight: bold
        display: none
        @media (min-width: 680px)
          display: inline

    .vs-button
      margin-left: 8px
      color: #fff
      background: #667dff
      padding: 2px
      border-radius: 40px
      display: none
      padding: 17px 24px
      font-weight: bold
      @media (min-width: 680px)
        display: inline-block
      @media (min-width: 900px)
        margin-left: 20px

  .vs-close
      right: 10px
      position: absolute
      padding: 10px
      @media (min-width: 680px)
        right: 0px
      @media (min-width: 900px)
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
