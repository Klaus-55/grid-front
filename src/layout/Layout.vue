<template>
  <div class="grid-score">
    <el-header height="55px">
        <header-view/>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </div>
</template>

<script>
  import Header from "./Header";
  export default {
    name: "layout",
    components: {
      "header-view": Header
    }
  }
</script>

<style lang="less">
  .grid-score {
    height: 100%;
    .el-header {
      position: relative;
      padding: 0;
    }
    .el-main {
      height: calc(100% - 55px);
      padding: 0;
    }
  }
</style>