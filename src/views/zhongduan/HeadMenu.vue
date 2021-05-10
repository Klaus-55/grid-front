<template>
  <div class="el-main-body">
    <div class="head-menu">
      <el-menu mode="horizontal"
               default-active="provincial"
               active-text-color="#fff"
               @select="handleSelect"
      >
        <el-menu-item index="provincial">
          省级评分
        </el-menu-item>
        <el-menu-item index="city">
          市级评分
        </el-menu-item>
      </el-menu>
    </div>
    <component :is="conName"/>
  </div>
</template>

<script>
  import Provincial from "./Provincial";
  export default {
    name: "HeadMenu",
    components: {
      Provincial
    },
    data() {
      return {
        conName: 'provincial'
      }
    },
    methods: {
      handleSelect(val) {

      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/headMenu";
</style>