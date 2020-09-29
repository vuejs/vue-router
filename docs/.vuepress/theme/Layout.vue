<template>
  <ParentLayout>
    <template #sidebar-top>
      <CarbonAds
        v-if="$site.themeConfig.carbonAds"
        :key="$page.path"
        :code="$site.themeConfig.carbonAds.carbon"
        :placement="$site.themeConfig.carbonAds.placement"
      />
    </template>
    <template #page-bottom>
      <BuySellAds
        v-if="$site.themeConfig.carbonAds"
        :key="$page.path"
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
