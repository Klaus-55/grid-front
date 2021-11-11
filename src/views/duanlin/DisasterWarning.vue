<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName" :index="index"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import ProvincialWarning from "./warning/ProvincialWarning";
  import ProvincialDetail from "./warning/ProvincialDetail";
  import CityWarning from "./warning/CityWarning";
  import CityDetail from "./warning/CityDetail";
  import CityWarningEff from "./warning/CityWarningEff";
  import CityEffDetail from "./warning/CityEffDetail";

  export default {
    name: "DisasterWarning",
    components: {
      "side-bar": MenuList,
      ProvincialWarning,
      ProvincialDetail,
      CityWarning,
      CityDetail,
      CityWarningEff,
      CityEffDetail
    },
    data() {
      return {
        conName: 'provincial-warning',
        items: [
          {img: require('assets/img/wms.png'), text: '省级预警预报质量', index: 'pw'},
          {img: require('assets/img/wmd.png'), text: '省级预警评定详情', index: 'pwd'},
          {img: require('assets/img/cw.png'), text: '市级预警预报质量', index: 'cw'},
          {img: require('assets/img/ybsk.png'), text: '市级预警评定详情', index: 'cwd'},
          {img: require('assets/img/cw.png'), text: '预警有效性评定', index: 'cwe'},
          {img: require('assets/img/ybsk.png'), text: '预警有效性评定详情', index: 'cwed'},
        ],
        index: 'pw'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'pw') {
          this.index = 'pw'
          this.conName = 'provincial-warning'
        } else if (activeName === 'pwd') {
          this.index = 'pwd'
          this.conName = 'provincial-detail'
        } else if (activeName === 'cw') {
          this.index = 'cw'
          this.conName = 'city-warning'
        } else if (activeName === 'cwd') {
          this.index = 'cwd'
          this.conName = 'city-detail'
        } else if (activeName === 'cwe') {
          this.index = 'cwe'
          this.conName = 'city-warning-eff'
        } else if (activeName === 'cwed') {
          this.index = 'cwed'
          this.conName = 'city-eff-detail'
        }
      }
    }
  }
</script>

<style scoped>

</style>