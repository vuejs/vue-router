<template>
  <div
    class="main-container"
    :class="{ 'has-top-banner': showTopBanner }"
  >
    <ParentLayout>
      <template #page-top>
        <CarbonAds
          v-if="$site.themeConfig.carbonAds"
          :key="'ca:' + $page.path"
          :code="$site.themeConfig.carbonAds.carbon"
          :placement="$site.themeConfig.carbonAds.placement"
        />
      </template>
      <template #page-bottom>
        <BuySellAds
          v-if="$site.themeConfig.carbonAds"
          :key="'bsa:' + $page.path"
          :code="$site.themeConfig.carbonAds.custom"
          :placement="$site.themeConfig.carbonAds.placement"
        />
      </template>
      <template #sidebar-bottom>
        <div class="sponsors">
          <a
            href="https://github.com/sponsors/posva"
            target="_blank"
            rel="noopener"
            >Sponsors</a
          >

          <a
            v-for="sponsor in sponsors.gold"
            :href="sponsor.href"
            :key="sponsor.href"
            target="_blank"
            rel="noopener"
          >
            <img :src="sponsor.imgSrcLight" :alt="sponsor.alt" />
          </a>
        </div>
      </template>
    </ParentLayout>
  </div>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from './components/CarbonAds.vue'
import BuySellAds from './components/BuySellAds.vue'
import sponsors from '../components/sponsors.json'

export default {
  name: 'Layout',
  components: {
    ParentLayout,
    CarbonAds,
    BuySellAds
  },
  data () {
    return {
      sponsors,
      showTopBanner: false
    }
  }
}
</script>

<style>
@media screen and (max-width: 1300px) {
  .content__default::before {
    content: '';
    /* background-color: red; */
    position: relative;
    display: block;
    /* top: 87px; */
    /* right: -12px; */
    float: right;
    height: 221px;
    /* width: 0; */
    padding: 0 0 20px 30px;
    margin-top: 20px;
    margin-right: -24px;
  }
}
</style>

<style scoped>
.sponsors {
  padding: 0 1.5rem 2rem;
  font-size: 0.8rem;
}

.sponsors a {
  color: #999;
  display: inline;
}

.sponsors img {
  max-width: 200px;
  max-height: 40px;
  display: block;
  margin: 1.25rem 0;
}
</style>
