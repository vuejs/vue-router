<template>
  <div class="bsa-cpc-wrapper">
    <div class="bsa-cpc"></div>
  </div>
</template>

<script>
/* global _bsa */
const ID = 'bsa-cpc-script'

export default {
  name: 'BuySellAds',
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

  methods: {
    load() {
      if (typeof _bsa !== 'undefined' && _bsa) {
        _bsa.init('default', this.code, `placement:${this.placement}`, {
          target: '.bsa-cpc',
          align: 'horizontal',
          disable_css: 'true'
        })
      }
    }
  },

  mounted() {
    if (!document.getElementById(ID)) {
      const s = document.createElement('script')
      s.id = ID
      s.src = `//m.servedby-buysellads.com/monetization.js`
      document.head.appendChild(s)
      s.onload = () => {
        this.load()
      }
    } else {
      this.load()
    }
  }
}
</script>

<style>
.bsa-cpc-wrapper {
  font-size: 0.95rem;
  /* from Page.vue */
  max-width: 50rem;
  margin: 0px auto;
  padding: 1rem 2rem 0;
  margin-bottom: -1rem;
}
@media (max-width: 419px) {
  .bsa-cpc-wrapper {
    padding: 0 1.5rem;
  }
}
.bsa-cpc {
  font-size: 0.9em;
  background-color: #f8f8f8;
  border-radius: 6px;
}

.bsa-cpc .default-text {
  display: inline;
}

.bsa-cpc a._default_ {
  text-align: left;
  display: block;
  text-decoration: none;
  padding: 10px 15px 12px;
  margin-bottom: 20px;
  color: #666;
  font-weight: 400;
  line-height: 18px;
}
.bsa-cpc a._default_ .default-image img {
  height: 20px;
  border-radius: 3px;
  vertical-align: middle;
  position: relative;
  top: -1px;
}
.bsa-cpc a._default_ .default-title {
  font-weight: 600;
}
.bsa-cpc a._default_ .default-description:after {
  font-size: 0.85em;
  content: 'Sponsored';
  color: #1c90f3;
  border: 1px solid #1c90f3;
  border-radius: 3px;
  padding: 0 4px 1px;
  margin-left: 6px;
}
.bsa-cpc .default-ad {
  display: none;
}
.bsa-cpc a._default_ .default-image,
.bsa-cpc a._default_ .default-title,
.bsa-cpc a._default_ .default-description {
  display: inline;
  vertical-align: middle;
  margin-right: 6px;
}
</style>
