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
      <el-link target="_blank" @click="changeLink">{{linkName}}</el-link>
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
        conName: 'rain-examine',
        linkName: '测试版'
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
      },
      changeLink() {
        let path = this.$route.path
        if (path.indexOf('test') === -1) {
          this.linkName = '返回'
          let lastChar = path.charAt(path.length - 1)
          let name = 'test'
          if (lastChar !== '/') name = '/' +name
          this.$router.push(path + name)
        } else {
          this.linkName = '测试版'
          this.$router.push(path.substr(0, path.indexOf('test') - 1))
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/headMenu";

</style>