<template>
  <div id="app">
    <layout/>
  </div>
</template>

<script>
  import Layout from "./layout/Layout";
  export default {
    name: "App",
    components: {Layout},
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '2'
      }
    },
    methods: {
      handleSelect() {
      }
    }
  }
</script>

<style scoped>
  .head {
    position: relative;
    height: 80px;
    /*padding-left: 10px;*/
    /*display: flex;*/
  }
  .background-img {
    vertical-align: middle;
    height: 60px;
    /*width: 400px;*/
    /*transform: translateY(15%);*/
  }
  .el-menu-demo {
    position: absolute;
  }

  .header-menu-list {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .menu-item {
    /*display: flex;*/
    height: 50px;
    width: 200px;
    float: left;
    margin: 10px;
    color: white;
    background: url("./assets/img/notActive.png") no-repeat;
    text-align: center;
    cursor: pointer;
    /*transform: translateY(10px);*/
  }

</style>