<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import TownForecast from "./citylevel/TownForecast";
  import TownDetail from "./citylevel/TownDetail";
  export default {
    name: "CityLevel",
    components: {
      'side-bar': MenuList,
      TownForecast,
      TownDetail
    },
    data() {
      return {
        items: [
          {img: require('assets/img/tf.png'), text: '城镇预报评分', index: 'townForecast'},
          // {img: require('assets/img/tfd.png'), text: '城镇预报评定详情', index: 'townDetail'}
        ],
        conName: 'town-forecast'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'townForecast') {
          this.conName = 'town-forecast'
        } else {
          this.conName = 'town-detail'
        }
      }
    }
  }
</script>

<style scoped>

</style>