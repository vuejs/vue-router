<template>
  <div
    class="vs-blackfriday-coins">
    <img
      v-for="coin in coins"
      :key="coin.id"
      :alt="coin.id"
      :src="`/images/vueschool/tech-coin-${coin.id}.png`"
      :class="[coin.id, coin.inverse ? inverseDirection : direction]"
      :style="coin.style"
      class="vs-blackfriday-coin">
  </div>
</template>

<script>
const coins = [
  { id: 'js', inverse: true },
  { id: 'ts' },
  { id: 'vue', inverse: true },
  { id: 'vuex', inverse: true },
  { id: 'nuxt' }
]

export default {
  data () {
    return {
      coins,
      xPosition: 0,
      direction: 'left',
      inverseDirection: 'right',
      isAnimated: false
    }
  },
  mounted () {
    if (window.innerWidth < 1024) return
    this.isAnimated = true
    this.animationTarget = document.getElementById('vs')
    this.animationTarget.addEventListener('mousemove', this.animate)
  },
  beforeDestroy () {
    if (!this.isAnimated) return
    this.animationTarget.removeEventListener('mousemove', this.animate)
  },
  methods: {
    animate (e) {
      this.direction = e.pageX > this.xPosition ? 'right' : 'left'
      this.inverseDirection = this.direction === 'left' ? 'right' : 'left'
      this.xPosition = e.pageX
    }
  }
}
</script>

<style>
.vs-blackfriday-coins {
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  z-index: -1;
}

.vs-blackfriday-coin {
  display: none;
}

@media (min-width: 768px) {
  .vs-blackfriday-coins {
    background-image: url(/images/vueschool/vueschool_blackfriday_background_tablet.svg);
    background-position: center;
    background-size: cover;
  }
}

@media (min-width: 1024px) {
  .vs-blackfriday-coins {
    background: transparent;
  }

  #vs:hover .vs-blackfriday-coin.left {
    transform: translateX(-600px);
    transition: transform 30s linear;
  }

  #vs:hover .vs-blackfriday-coin.right {
    transform: translateX(600px);
    transition: transform 30s linear;
  }

  .vs-blackfriday-coin {
    display: inline-block;
    position: absolute;
    transition-property: transform;
    transition-timing-function: cubic-bezier(.17, .84, .44,1);
    transition-duration: 75ms;
    transform: translateX(0);
  }

  .vs-blackfriday-coin.js {
    width: 43px;
    top: 32px;
    left: calc(50% - 341px);
  }

  .vs-blackfriday-coin.ts {
    top: 0;
    left: 0;
    width: 54px;
    left: calc(50% + 457px);
  }

  .vs-blackfriday-coin.vue {
    top: 18px;
    width: 60px;
    left: calc(50% + 586px);
  }

  .vs-blackfriday-coin.vuex {
    top: 23px;
    left: 0;
    width: 56px;
    left: calc(50% - 620px);
  }

  .vs-blackfriday-coin.nuxt {
    top: 10px;
    width: 48px;
    left: calc(50% - 474px);
  }
}
</style>
