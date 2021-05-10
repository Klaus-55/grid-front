<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import WarningMessage from "./provincial/WarningMessage";
  import WarningDetail from "./provincial/WarningDetail";
  import RainProgress from "./provincial/RainProgress";
  export default {
    name: "Provincial",
    components: {
      "side-bar": MenuList,
      WarningMessage,
      WarningDetail,
      RainProgress
    },
    data() {
      return {
        items: [
          {img: require('assets/img/wms.png'), text: '预警消息评分', index: 'warningMessage'},
          {img: require('assets/img/wmd.png'), text: '预警消息评定详情', index: 'warningDetail'},
          {img: require('assets/img/rain.png'), text: '降水过程评分', index: 'rainProcess'},
          {img: require('assets/img/ybsk.png'), text: '降水过程评定详情', index: 'rainDetail'},
          {img: require('assets/img/rainstorm.png'), text: '暴雨公众预报', index: 'rainstorm'},
          {img: require('assets/img/rsd.png'), text: '暴雨公众预报详情', index: 'rainstormDetail'},
          {img: require('assets/img/df.png'), text: '每日预报评分', index: 'dailyForecast'},
          {img: require('assets/img/dlfc.png'), text: '每日实况预报对比', index: 'dailyComparision'},
          {img: require('assets/img/report.png'), text: '预报质量报表', index: 'qualityReport'},
        ],
        conName: 'warning-message'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'warningMessage') {
          this.conName = 'warning-message'
        } else if (activeName === 'warningDetail') {
          this.conName = 'warning-detail'
        } else if (activeName === 'rainProcess') {
          this.conName = 'rain-progress'
        } else if (activeName === 'rainDetail') {
          this.conName = 'rain-detail'
        } else if (activeName === 'rainstorm') {
          this.conName = 'rainstorm'
        } else if (activeName === 'rainstormDetail') {
          this.conName = 'rainstorm-detail'
        } else if (activeName === 'dailyForecast') {
          this.conName = 'daily-forecast'
        } else if (activeName === 'dailyComparision') {
          this.conName = 'daily-comparision'
        } else if (activeName === 'qualityReport') {
          this.conName = 'quality-report'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/common";
</style>