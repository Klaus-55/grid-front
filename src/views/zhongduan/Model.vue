<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import ModelExamination from "./model/ModelExamination";
  import RainExamination from "./model/RainExamination";

  export default {
    name: "Model",
    components: {
      'side-bar': MenuList,
      ModelExamination,
      RainExamination
    },
    data() {
      return {
        items: [
          {img: require('assets/img/tf.png'), text: '模式检验', index: 'modelExamination'},
          {img: require('assets/img/rain.png'), text: '降水检验', index: 'rainExamination'}
        ],
        conName: 'model-examination'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'modelExamination') {
          this.conName = 'model-examination'
        } else {
          this.conName = 'rain-examination'
        }
      }
    }
  }

</script>

<style scoped>


</style>