<template>
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
</template>

<script>
  export default {
    name: "HeadMenu",
    data() {
      return {

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