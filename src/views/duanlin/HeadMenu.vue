<template>
  <div class="el-main-body">
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
    <component :is="conName"></component>
  </div>

</template>

<script>
  import ShortApproach from "./ShortApproach";
  import StrongConvection from "./StrongConvection";
  import DisasterWarning from "./DisasterWarning";
  import HeavyMonitoring from "./HeavyMonitoring";
  export default {
    name: "HeadMenu",
    components: {
      ShortApproach,
      StrongConvection,
      DisasterWarning,
      HeavyMonitoring
    },
    data() {
      return {
        conName: 'short-approach'
      }
    },
    methods: {
      handleSelect(val) {
        if (val === 'approaching') {
          this.conName = 'short-approach'
        } else if (val === 'convection') {
          this.conName = 'strong-convection'
        } else if (val === 'warning') {
          this.conName = 'disaster-warning'
        } else {
          this.conName = 'heavy-monitoring'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/headMenu";
</style>