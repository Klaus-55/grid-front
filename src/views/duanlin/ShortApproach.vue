<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import RainExamine from "./approach/RainExamine";
  import TempExamine from "./approach/TempExamine";
  import ForecasterExamine from "./approach/ForecasterExamine";
  import Attendance from "./approach/Attendance";

  export default {
    name: "ShortApproach",
    components: {
      "side-bar": MenuList,
      RainExamine,
      TempExamine,
      ForecasterExamine,
      Attendance
    },
    data() {
      return {
        conName: 'rain-examine',
        items: [
          {img: require('assets/img/rain.png'), text: '降水检验', index: 'rain'},
          {img: require('assets/img/tem.png'), text: '温度检验', index: 'temp'},
          {img: require('assets/img/ybsk.png'), text: '预报员评分检验', index: 'forecast'},
          {img: require('assets/img/ybsk.png'), text: '值班登记', index: 'attendance'},
        ]
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'rain') {
          this.conName = 'rain-examine'
        } else if (activeName === 'temp') {
          this.conName = 'temp-examine'
        } else if (activeName === 'forecast') {
          this.conName = 'forecaster-examine'
        } else {
          this.conName = 'attendance'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/common";
</style>