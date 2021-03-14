<template>
  <div class="side-bar">
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect"
    >
      <el-menu-item v-for="item in items" :index="item.index">
        <div>
          <img :src="item.img" alt="">
          <span>{{item.text}}</span>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "MenuList",
    props: {
      items: Array
    },
    data() {
      return {
        activeIndex: this.items[0].index
      }
    },
    methods: {
      handleSelect(facname) {
        console.log("index->", facname)
        this.$emit('changeFac', facname)
      }
    }
  }
</script>

<style lang="less">
  .side-bar {
    float: left;
    width: 200px;
    height: 100%;
    background-color: #4c546c;
    .el-menu {
      border-right: none;
      background-color: #4c546c;
      margin-top: 30px;
      .el-menu-item {
        width: 180px;
        height: 40px;
        margin: 10px auto;
        color: white;
        div {
          height: 100%;
          width: 100%;
          line-height: 40px;
          img {
            height: 16px;
          }
          span {
            margin-left: 15px;
          }
        }
      }
      .el-menu-item:hover {
        background-color: transparent;
      }
      .el-menu-item.is-active {
        background-color: #359be0 !important;
        border-radius: 3px;
      }
      .el-menu-item:focus {
        background-color: transparent;
      }
    }
  }
</style>