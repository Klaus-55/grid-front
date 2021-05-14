<template>
  <div class="body-content">
    <side-bar :items="items"/>
    <div class="side-content"></div>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  export default {
    name: "HeavyMonitoring",
    components: {
      "side-bar": MenuList
    },
    data() {
      return {
        conName: 'provincial-warning',
        items: [
          {img: require('assets/img/wms.png'), text: '强降水监测警报', index: 'pw'}
        ]
      }
    }
  }
</script>

<style scoped>

</style>