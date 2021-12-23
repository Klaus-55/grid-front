<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import HeavyMonitoring from "./heavy/HeavyMonitoring";
  import HeavyDetail from "./heavy/HeavyDetail";

  export default {
    name: "HeavyPre",
    components: {
      "side-bar": MenuList,
      HeavyMonitoring,
      HeavyDetail
    },
    data() {
      return {
        conName: 'heavy-monitoring',
        items: [
          {img: require('assets/img/wms.png'), text: '强降水监测警报', index: 'hm'},
          {img: require('assets/img/wmd.png'), text: '强降水监测警报详情', index: 'hd'},
        ]
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'hm') {
          this.conName = 'heavy-monitoring'
        } else if (activeName === 'hd') {
          this.conName = 'heavy-detail'
        }
      }
    }
  }
</script>

<style scoped>

</style>