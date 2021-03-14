<template>
  <div class="el-main-body">
    <div class="head-menu">
      <el-menu mode="horizontal"
               default-active="rain"
               active-text-color="#fff"
               @select="handleSelect"
      >
        <el-menu-item index="rain">
          降水预报检验
        </el-menu-item>
        <el-menu-item index="tmp">
          温度预报检验
        </el-menu-item>
        <el-menu-item index="qdl">
          强对流预报检验
        </el-menu-item>
      </el-menu>
    </div>
    <component :is="conName"></component>
  </div>
</template>

<script>
  import RainExamine from "./RainExamine";
  import TempExamine from "./TempExamine";
  import QdlExamine from "./QdlExamine";
  export default {
    name: "HeadMenu",
    components: {
      RainExamine,
      "tmp-examine": TempExamine,
      QdlExamine
    },
    data() {
      return {
        conName: 'rain-examine'
      }
    },
    methods: {
      handleSelect(val) {
        if (val === 'rain') {
          this.conName = 'rain-examine'
        } else if (val === 'tmp') {
          this.conName = 'tmp-examine'
        } else {
          this.conName = 'qdl-examine'
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/headMenu";
</style>