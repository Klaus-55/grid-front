<template>
  <div class="head-menu">
    <el-menu mode="horizontal"
             default-active="approaching"
             active-text-color="#fff"
             @select="handleSelect"
    >
      <el-menu-item index="approaching">
        湖南省短时临近格点预报检验
      </el-menu-item>
      <el-menu-item index="convection">
        湖南省强对流天气分类落区预报检验
      </el-menu-item>
      <el-menu-item index="warning">
        湖南省气象灾害预警信号检验
      </el-menu-item>
      <el-menu-item index="heavy">
        湖南省强降水监测警报质量检验
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