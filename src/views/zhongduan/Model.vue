<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  // import ModelExamination from "./model/ModelExamination";
  import DailyComparision from "./provincial/DailyComparision";
  import RainExamination from "./model/RainExamination";
  import RainExamination2 from "./model/RainExamination2";
  import TempExamination from "./model/TempExamination";
  import SnowFall from "./model/SnowFall";

  export default {
    name: "Model",
    components: {
      'side-bar': MenuList,
      // ModelExamination,
      DailyComparision,
      RainExamination,
      RainExamination2,
      TempExamination,
      SnowFall
    },
    data() {
      return {
        items: [
          // {img: require('assets/img/tf.png'), text: '模式检验', index: 'modelExamination'},
          {img: require('assets/img/dlfc.png'), text: '每日实况预报对比', index: 'dailyComparision'},
          {img: require('assets/img/rain.png'), text: '降水检验', index: 'rainExamination'},
          {img: require('assets/img/rain.png'), text: '降水检验2', index: 'rainExamination2'},
          {img: require('assets/img/tem.png'), text: '温度检验', index: 'tempExamination'},
          {img: require('assets/img/rain.png'), text: '降雪实况', index: 'snowFall'}
        ],
        conName: 'daily-comparision'
      }
    },
    methods: {
      changeFac(activeName) {
        // if (activeName === 'modelExamination') {
        //   this.conName = 'model-examination'
        // }
        if (activeName === 'dailyComparision') {
          this.conName = 'daily-comparision'
        } else if (activeName === 'rainExamination') {
          this.conName = 'rain-examination'
        } else if (activeName === 'rainExamination2') {
          this.conName = 'rain-examination2'
        } else if (activeName === 'tempExamination') {
          this.conName = 'temp-examination'
        } else if (activeName === 'snowFall') {
          this.conName = 'snow-fall'
        }
      }
    }
  }

</script>

<style scoped>


</style>