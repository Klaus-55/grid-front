<template>
  <div class="header-content">
    <div>
      <img src="./headBack.png" alt="">
    </div>
    <div class="header-menu-list">
      <el-menu mode="horizontal">
        <el-menu-item index="zhongduan">
          <router-link to="/zhongduan">
            <span>中短期预报质量评分</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="duanlin">
          <router-link to="/duanlin">
            <span>短临预报质量评分</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="keguan">
          <router-link to="/keguan">
            <span>客观预报竞赛</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="shengji">
          <router-link to="/shengji">
            <span>省级预报竞赛</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  let zhongduan = [
    {text: '省级评分', path: '/zhongduan/shengji'},
    {text: '市级评分', path: '/zhongduan/shiji'}
  ]
  let duanlin = [
    {text: '湖南省短时临近格点预报检验', path: '/duanlin/linjin'},
    {text: '湖南省强对流天气分类落区预报检验', path: '/duanlin/strong'},
    {text: '湖南省气象灾害预警信号检验', path: '/duanlin/warning'},
    {text: '湖南省强降水监测警报质量检验', path: '/duanlin/heavy'}
  ]
  let keguan = [
    {text: '降水预报检验', path: '/keguan/rain'},
    {text: '温度预报检验', path: '/keguan/temp'},
    {text: '强对流预报检验', path: '/keguan/qdl'}
  ]
  let shengji = [
    {text: '省级评分', path: '/shengji/shengji'},
    {text: '市级评分', path: '/shengji/shiji'}
  ]
  export default {
    name: "Header",
    data() {
      return {
        isActive: true,
        headDetail: keguan
      }
    },
    methods: {
      changeHandle(val) {
        if (val === 'zhongduan') {
          this.headDetail = zhongduan
        } else if (val === 'duanlin') {
          this.headDetail = duanlin
        } else if (val === 'keguan') {
          this.headDetail = keguan
        } else if (val === 'shengji') {
          this.headDetail = shengji
        }
      }
    }
  }
</script>

<style lang="less">
  .header-content {
    /*height: 93px;*/
    div > img {
      height: 55px;
      width: 100%;
      vertical-align: middle;
    }
    .el-menu {
      background: transparent;
      border-bottom: none !important;
    }
    .header-menu-list {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 50px;
      .el-menu--horizontal > .el-menu-item {
        height: 55px;
        width: 160px;
        color: white;
        border-bottom: none;
        line-height: 55px;
        text-align: center;
      }
      .el-menu-item:focus, .el-menu-item:hover {
        background-color: transparent !important;
        color: #fff !important;
      }
      span {
        display: inline-block;
        background-image: url("../assets/img/notActive.png");
        background-repeat: no-repeat;
        width: 160px;
        background-size: 140px 25px;
        background-position: center;
      }
      .router-link-active {
        >span {
          background-image: url("../assets/img/active.png");
          font-weight: bold;
        }
      }
    }
  }
</style>