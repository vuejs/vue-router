<template>
  <div class="main-container">
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

      <template #sidebar-top>
        <div class="sponsors sponsors-top">
          <span>Platinum Sponsors</span>

          <a
            v-for="sponsor in sponsors.platinum"
            :href="sponsor.href"
            :key="sponsor.href"
            target="_blank"
            rel="noopener"
          >
            <img :src="sponsor.imgSrcLight" :alt="sponsor.alt" />
          </a>
        </div>
      </template>

      <template #sidebar-bottom>
        <div class="sponsors">
          <span>Sponsors</span>

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
  data() {
    return {
      sponsors
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

img {
  max-width: 100%;
}
</style>

<style scoped>
.sponsors {
  margin: 0 0 1rem 1.35rem;
}

.sponsors-top {
  margin-top: 1rem;
  /* workaround padding in vitepress */
  margin-bottom: -2rem;
}

.sponsors > span {
  /* margin: 1.25rem 0; */
  display: block;
  color: #999;
  font-size: 0.8rem;
}

.sponsors a:last-child {
  margin-bottom: 20px;
}
.sponsors a:first-child {
  margin-top: 18px;
}

.sponsors a {
  margin-top: 10px;
  width: 125px;
  display: block;
}
</style>
