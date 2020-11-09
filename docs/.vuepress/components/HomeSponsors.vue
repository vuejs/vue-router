<template>
  <div id="sponsors">
    <div class="inner">
      <template v-if="sponsors.platinum">
        <h3>Platinum Sponsors</h3>

        <a
          v-for="sponsor in sponsors.platinum"
          :key="sponsor.href"
          :href="sponsor.href"
          target="_blank"
          rel="sponsored noopener"
          style="width: 160px;"
        >
          <img :src="sponsor.imgSrc" style="width: 160px;" :alt="sponsor.alt" />
        </a>
        <br />
        <br />
      </template>

      <template v-if="sponsors.silver">
        <h3>Silver Sponsors</h3>

        <a
          v-for="sponsor in sponsors.silver"
          :href="sponsor.href"
          target="_blank"
          rel="sponsored noopener"
          style="width: 120px;"
        >
          <img :src="sponsor.imgSrc" style="width: 120px;" :alt="sponsor.alt" />
        </a>

        <br />
        <br />
      </template>

      <a
        class="become-sponsor button white"
        href="https://github.com/sponsors/posva"
        >Become a Sponsor!</a
      >
    </div>
  </div>
</template>

<script>
import sponsors from './sponsors.json'

export default {
  name: 'HomeSponsors',

  created() {
    this.sponsors = sponsors
  }
}
</script>

<style>
#sponsors {
  text-align: center;
  padding: 35px 40px 45px;
  margin: 0 -2rem;
  background-color: #f6f6f6;
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
