<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import ProvincialWarning from "./warning/ProvincialWarning";
  import ProvincialDetail from "./warning/ProvincialDetail";
  import CityWarning from "./warning/CityWarning";
  import CityDetail from "./warning/CityDetail";
  export default {
    name: "DisasterWarning",
    components: {
      "side-bar": MenuList,
      ProvincialWarning,
      ProvincialDetail,
      CityWarning,
      CityDetail
    },
    data() {
      return {
        conName: 'provincial-warning',
        items: [
          {img: require('assets/img/wms.png'), text: '省级预警预报质量', index: 'pw'},
          {img: require('assets/img/wmd.png'), text: '省级预警评定详情', index: 'pwd'},
          {img: require('assets/img/cw.png'), text: '市级预警预报质量', index: 'cw'},
          {img: require('assets/img/ybsk.png'), text: '市级预警评定详情', index: 'cwd'}
        ]
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'pw') {
          this.conName = 'provincial-warning'
        } else if (activeName === 'pwd') {
          this.conName = 'provincial-detail'
        } else if (activeName === 'cw') {
          this.conName = 'city-warning'
        } else {
          this.conName = 'city-detail'
        }
      }
    }
  }
</script>

<style scoped>

</style>