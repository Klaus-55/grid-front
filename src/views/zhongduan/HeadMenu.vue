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
        <el-menu-item index="model">
          模式检验评分
        </el-menu-item>
      </el-menu>
    </div>
    <component :is="conName"/>
  </div>
</template>

<script>
  import Provincial from "./Provincial";
  import CityLevel from "./CityLevel";
  import ModelExamination from "./ModelExamination";

  export default {
    name: "HeadMenu",
    components: {
      Provincial,
      CityLevel,
      ModelExamination
    },
    data() {
      return {
        conName: 'provincial'
      }
    },
    methods: {
      handleSelect(val) {
        if (val === 'provincial') {
          this.conName = 'provincial'
        } else if (val === 'city') {
          this.conName = 'city-level'
        } else if (val === 'model') {
          this.conName = 'model-examination'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/headMenu";
</style>