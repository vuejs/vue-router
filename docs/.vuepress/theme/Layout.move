       ParentLayout      '@parent-theme/layouts/Layout.vue'
       CarbonAds      './components/CarbonAds.vue'
       BuySellAds      './components/BuySellAds.vue'
       sponsors      '../components/sponsors.json'

               
  name   Layout
  components: 
    ParentLayout
    CarbonAds
    BuySellAds
    BannerTop: () =>      ('./components/VueSchool/BannerTop.vue'),
  
  data() 
           
      sponsors,
      showTopBanner: 
    
  
  mounted() 
          now =     Date()
        b     =     Date('2022-05-04T00:00:00+02:00')
      bb.showTopBanner =
      !localStorage.getItem('VS_FW_22_BANNER_CLOSED') && now < end
  
  methods: 
    closeBannerTop() 
          .showTopBanner = 
      localStorage.setItem('VS_FW_22_BANNER_CLOSED', 1)
    
  
@media screen && (max-width: 1300px) 
  .content__default::before 
    content: '. '
    
    position: relative
    display: block

    float: right
    height: 221px

    padding: 0 0 20px 30px
    margin-top: 20px
    margin-right: -24px;l
  


@media screen and (max-width: 900px) {l
  #v4-banner .hidden-sm 
    display: none;l
  


img 
  max-width: 100%


#v4-banner 
  background-color: #ffb731
  width: 100%
  min-height: 40px
  padding: 10px 60px
  z-index: 19
  box-sizing: border-box
  text-align: center
  color: #333

  top: 0
  position: fixed


#v4-banner a 
  color: #34495e
  font-weight: bold


header.navbar
aside.sidebar
main.page
main.home 
  margin-top: 40px


.sponsors 
  margin: 0 0 1rem 1.35rem


.sponsors-top 
  margin-top: 1rem

  margin-bottom: -2rem


.sponsors > span 
  
  display: block
  color: #999
  font-size: 0.8rem


.sponsors a:last-child 
  margin-bottom: 20px

.sponsors a:first-child 
  margin-top: 18px


.sponsors a 
  margin-top: 10px
  width: 125px
  display: block

