<template>
  <div id="sponsors">
    <div class="inner">
      <HomeSponsorsGroup name="Platinum" size="160" />
      <HomeSponsorsGroup name="Gold" size="140" />
      <HomeSponsorsGroup name="Silver" size="120" />

      <a
        class="become-sponsor button white"
        href="https://github.com/sponsors/posva"
        >Become a Sponsor!</a
      >
    </div>
  </div>
</template>

<script>
import HomeSponsorsGroup from './HomeSponsorsGroup.vue'

export default {
  name: 'HomeSponsors',

  components: { HomeSponsorsGroup }
}
</script>

<style>
#sponsors {
  text-align: center;
  padding: 35px 30px 45px;
  background-color: #f6f6f6;
}

@media (min-width: 768px) {
  #sponsors {
    padding: 35px 40px 45px;
    margin: 0 -2rem;
  }
}

#sponsors h3 {
  color: #999;
  margin: 0 0 10px;
}

#sponsors a,
#sponsors img {
  width: 100px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 2px;
}

#sponsors img {
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.66;
}

#sponsors img:hover {
  filter: none;
  opacity: 1;
}

#sponsors .become-sponsor {
  margin-top: 40px;
  font-size: 0.9em;
  font-weight: 700;
  width: auto;
  background-color: transparent;
  padding: 0.75em 2em;
  border-radius: 2em;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

#sponsors .become-sponsor:hover {
  background-color: #4fc08d;
  color: white;
}
</style>
