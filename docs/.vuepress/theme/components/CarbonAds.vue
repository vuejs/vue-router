<template>
  <div class="carbon-ads"></div>
</template>

<script>
export default {
  name: 'CarbonAds',
  props: {
    code: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      required: true
    }
  },

  mounted() {
    const s = document.createElement('script')
    s.id = '_carbonads_js'
    s.src = `//cdn.carbonads.com/carbon.js?serve=${this.code}&placement=${this.placement}`
    this.$el.appendChild(s)
  }
}
</script>

<style>
.carbon-ads {
  min-height: 102px;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: -0.5rem;
  font-size: 0.75rem;

  width: 125px;
  position: fixed;
  z-index: 1;
  bottom: 22px;
  right: 14px;
  padding: 10px;
  /* background-color: #fff; */
  /* border-radius: 3px; */
  /* font-size: 13px; */
}

@media screen and (max-width: 1300px) {
  .carbon-ads {
    position: relative;
    top: 87px;
    right: 12px;
    float: right;
    padding: 0 0 20px 30px;
  }
}

.carbon-ads a {
  color: #444;
  font-weight: normal;
  display: inline;
}

.carbon-ads .carbon-img {
  float: left;
  margin-right: 1rem;
  border: 1px solid var(--border-color);
}

.carbon-ads .carbon-img img {
  display: block;
}

.carbon-ads .carbon-poweredby {
  color: #999;
  display: block;
  margin-top: 0.5em;
}

@media (max-width: 719px) {
  .carbon-ads .carbon-img img {
    width: 100px;
    height: 77px;
  }
}
</style>
