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
  import RainDetail from "./provincial/RainDetail";
  import RainstormPublic from "./provincial/RainstormPublic";
  import RainstormDetail from "./provincial/RainstormDetail";
  import DailyForecast from "./provincial/DailyForecast";
  // import DailyComparision from "./provincial/DailyComparision";
  import QualityReport from "./provincial/QualityReport";
  export default {
    name: "Provincial",
    components: {
      "side-bar": MenuList,
      WarningMessage,
      WarningDetail,
      RainProgress,
      RainDetail,
      RainstormPublic,
      RainstormDetail,
      DailyForecast,
      // DailyComparision,
      QualityReport
    },
    data() {
      return {
        items: [
          {img: require('assets/img/wms.png'), text: '预警消息评分', index: 'warningMessage'},
          {img: require('assets/img/wmd.png'), text: '预警消息评定详情', index: 'warningDetail'},
          {img: require('assets/img/rain.png'), text: '降水过程评分', index: 'rainProcess'},
          {img: require('assets/img/ybsk.png'), text: '降水过程评定详情', index: 'rainDetail'},
          {img: require('assets/img/rainstorm.png'), text: '暴雨公众预报', index: 'rainstormPublic'},
          {img: require('assets/img/rsd.png'), text: '暴雨公众预报详情', index: 'rainstormDetail'},
          {img: require('assets/img/df.png'), text: '每日预报评分', index: 'dailyForecast'},
          // {img: require('assets/img/dlfc.png'), text: '每日实况预报对比', index: 'dailyComparision'},
          {img: require('assets/img/report.png'), text: '预报质量报表', index: 'qualityReport'},
        ],
        conName: 'warning-message'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'warningMessage') {  //预警消息评分
          this.conName = 'warning-message'
        } else if (activeName === 'warningDetail') {  //预警消息评定详情
          this.conName = 'warning-detail'
        } else if (activeName === 'rainProcess') {  //降水过程评分
          this.conName = 'rain-progress'
        } else if (activeName === 'rainDetail') { //降水过程评定详情
          this.conName = 'rain-detail'
        } else if (activeName === 'rainstormPublic') {  //暴雨公众预报
          this.conName = 'rainstorm-public'
        } else if (activeName === 'rainstormDetail') {  //暴雨公众预报详情
          this.conName = 'rainstorm-detail'
        } else if (activeName === 'dailyForecast') {  //每日预报评分
          this.conName = 'daily-forecast'
        }
        // else if (activeName === 'dailyComparision') { //每日实况预报对比
        //   this.conName = 'daily-comparision'
        // }
        else if (activeName === 'qualityReport') {  //预报质量报表
          this.conName = 'quality-report'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/common";
</style>