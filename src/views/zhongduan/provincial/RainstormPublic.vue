<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <span>选择年份：</span>
        <el-date-picker
                v-model="year"
                type="year"
                :pickerOptions="pickerOptions">
        </el-date-picker>
        <el-button type="primary" size="mini" @click="changeDate">确定</el-button>
      </div>
      <hr>
      <div class="rainstorm-public-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>检验产品：</span>
            <el-radio-group v-model="product" @change="changeProduct">
              <el-radio-button label="技巧评分"></el-radio-button>
              <el-radio-button label="分项质量"></el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验模式：</span>
            <el-radio-group v-model="model" @change="changeModel">
              <el-radio-button label="中央台" v-show="product === '分项质量'">中央台</el-radio-button>
              <el-radio-button label="湖南省气象台">省台</el-radio-button>
              <el-radio-button label="地市">地市</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rainstorm-public-bottom">
<!--        <h2>{{titleYear}}年暴雨分级预报质量</h2>-->
        <div id="rain-public-chart" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "momnet"
  import {rainstormPublic} from "../../../network/zhongduan";
  import {initMsEcharts} from "../../../common/Base";

  export default {
    name: "RainstormPublic",
    data() {
      return {
        year: moment(Date.now()).format('YYYY'),
        pickerOptions: {
          disabledDate(time) {
            let year = parseInt(moment(time).format('YYYY'))
            return year > moment().year()

          }
        },
        product: '技巧评分',
        model: '湖南省气象台',
        titleYear: moment(Date.now()).year(),
        data: {}
      }
    },
    computed: {
      title() {
        return this.titleYear + '年暴雨分级预报质量'
      }
    },
    methods: {
      changeDate() {
        this.titleYear = moment(this.year).year()
        this.getRainstormPublic()
      },
      changeProduct(product) {
        if (product === '技巧评分') {
          this.model = '湖南省气象台'
        } else {
          this.model = '中央台'
        }
        this.getRainstormPublic()
      },
      changeModel() {
        this.getRainstormPublic()
      },
      getRainstormPublic() {
        let loading = this.openLoading('#rain-public-chart');
        rainstormPublic(this.titleYear, this.product, this.model).then(res => {
          this.data = res.data
          initMsEcharts(this.data, this.title, 'rain-public-chart')
          loading.close()
        })
      }
    },
    created() {
      this.$nextTick(() =>{
        this.getRainstormPublic()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .rainstorm-public-middle {
    position: relative;
    height:60px;
    background-color: @bgColor;
    margin-bottom: 20px;
    >span {
      margin-left: 20px;
      vertical-align: top;
    }
    .el-menu {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: none;
      background-color: transparent;
    }
    .el-menu--horizontal > .el-menu-item {
      border-bottom: none;
      color: #303133;
      height: 45px;
      line-height: 45px;
    }
    .el-menu-item {
      cursor: default;
      font-size: 14px;
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }
    .el-radio-button__inner {
      font-size: 12px;
      padding: 0;
      width: 80px;
      height: 18px;
      line-height: 18px;
      background-color: #F8F8F8;
      border-left: 1px solid #DCDFE6;
      box-sizing: content-box;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #49afcd;
      border-color: #49afcd;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover {
      color: #fff;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      box-shadow: none;
    }
  }
  .rainstorm-public-bottom {
    box-sizing: border-box;
    height: calc(100% - 141px);
    background-color: @bgColor;
    padding-top: 50px;
  }
</style>