<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import City from "./citylevel/City";

  export default {
    name: "CityLevel",
    components: {
      'side-bar': MenuList,
      City
    },
    data() {
      return {
        items: [
          {img: require('assets/img/ybsk.png'), text: '市级评分', index: 'city'},
        ],
        conName: 'city'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'city') {
          this.conName = 'city'
        }
      }
    }
  }
</script>

<style scoped>

</style>