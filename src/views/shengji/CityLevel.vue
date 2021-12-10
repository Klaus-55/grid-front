<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import City from "./citylevel/City";
  import CityForecaster from "./citylevel/CityForecaster";

  export default {
    name: "CityLevel",
    components: {
      'side-bar': MenuList,
      City,
      CityForecaster
    },
    data() {
      return {
        items: [
          {img: require('assets/img/ybsk.png'), text: '市级评分', index: 'city'},
          {img: require('assets/img/ybsk.png'), text: '预报员评分', index: 'forecaster'},
        ],
        conName: 'city'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'city') {
          this.conName = 'city'
        } else if (activeName === 'forecaster') {
          this.conName = 'city-forecaster'
        }
      }
    }
  }
</script>

<style scoped>

</style>