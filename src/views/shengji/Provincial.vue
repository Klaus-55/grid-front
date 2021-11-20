<template>
  <div class="body-content">
    <side-bar @changeFac="changeFac" :items="items"/>
    <component :is="conName"/>
  </div>
</template>

<script>
  import MenuList from "../../components/menu/MenuList";
  import Chief from "./provincial/Chief";
  import Foreman from "./provincial/Foreman";
  import NightShift from "./provincial/NightShift";
  import ShortTerm from "./provincial/ShortTerm";

  export default {
    name: "Provincial",
    components: {
      "side-bar": MenuList,
      Chief,
      Foreman,
      NightShift,
      ShortTerm
    },
    data() {
      return {
        items: [
          {img: require('assets/img/ybsk.png'), text: '首席岗预报员', index: 'chief'},
          {img: require('assets/img/ybsk.png'), text: '中短期领班预报员', index: 'foreman'},
          {img: require('assets/img/ybsk.png'), text: '中短期夜班预报员', index: 'nightShift'},
          {img: require('assets/img/ybsk.png'), text: '短临岗预报员', index: 'shortTerm'},
        ],
        conName: 'chief'
      }
    },
    methods: {
      changeFac(activeName) {
        if (activeName === 'chief') {  //首席岗预报员
          this.conName = 'chief'
        } else if (activeName === 'foreman') {  //中短期领班预报员
          this.conName = 'foreman'
        } else if (activeName === 'nightShift') {  //中短期夜班预报员
          this.conName = 'night-shift'
        } else if (activeName === 'shortTerm') { //短临岗预报员
          this.conName = 'short-term'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/common";
</style>