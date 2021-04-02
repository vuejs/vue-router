<template>
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
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import CarbonAds from './components/CarbonAds.vue'
import BuySellAds from './components/BuySellAds.vue'

export default {
  name: 'Layout',

  components: {
    ParentLayout,
    CarbonAds,
    BuySellAds
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
