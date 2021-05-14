<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import HeavyExamine from "./convection/HeavyExamine";
  import ThunderstormExamine from "./convection/ThunderstormExamine";
  import HailExamine from "./convection/HailExamine";
  import ForecasterExamine from "./convection/ForecasterExamine";
  export default {
    name: "StrongConvection",
    components: {
      "side-bar": MenuList,
      HeavyExamine,
      ThunderstormExamine,
      HailExamine,
      ForecasterExamine
    },
    data() {
      return {
        conName: 'heavy-examine',
        items: [
          {img: require('assets/img/rain.png'), text: '强降水检验', index: 'heavy'},
          {img: require('assets/img/smg.png'), text: '雷暴检验', index: 'smg'},
          {img: require('assets/img/tw.png'), text: '雷暴大风检验', index: 'tw'},
          {img: require('assets/img/hail.png'), text: '冰雹检验', index: 'hail'},
          {img: require('assets/img/ybsk.png'), text: '预报员评分检验', index: 'forecaster'}
        ]
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'heavy') {
          this.conName = 'heavy-examine'
        } else if (activeName === 'smg') {
          this.conName = 'thunderstorm-examine'
        } else if (activeName === 'tw') {
          this.conName = 'thunderstorm-examine'
        } else if (activeName === 'hail') {
          this.conName = 'hail-examine'
        } else {
          this.conName = 'forecaster-examine'
        }
      }
    }
  }
</script>

<style scoped>

</style>