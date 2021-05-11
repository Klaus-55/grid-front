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
              <el-radio-button label="skillScore">技巧评分</el-radio-button>
              <el-radio-button label="quality">分项质量</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验模式：</span>
            <el-radio-group v-model="model" @change="changeModel">
              <el-radio-button label="BABJ">中央台</el-radio-button>
              <el-radio-button label="GIFTZD">省台</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rainstorm-public-bottom">
        <h2>{{titleYear}}年暴雨分级预报质量</h2>
        <div id="container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "momnet"
  import Highcharts from "highcharts";
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
        product: 'skillScore',
        model: 'BABJ',
        titleYear: moment(Date.now()).format('YYYY')
      }
    },
    methods: {
      changeDate() {
        this.titleYear = moment(this.year).format('YYYY')
      },
      changeProduct(product) {
        // alert(product)
      },
      changeModel(model) {
        // alert(model)
      },
      initEcharts() {
        let options = {
          chart: {
            type: 'column',
            backgroundColor: '#F8F8F8',
          },
          credits: {
            enabled: false
          },
          colors: ['#5E8CEB', '#59BDBE', '#EBC56A'],
          title: {
            text: ''
          },
          xAxis: {
            categories: ['一月','二月','三月','四月', '五月', '六月'],
            crosshair: true
          },
          yAxis: {
            title: {
              text: ''
            }
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [{
            name: '50MM级技巧评分',
            data: [3.1, 3.1, 3.1, 3.1, 3.1, 3.1]
          }, {
            name: '100MM级技巧评分',
            data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1]
          }, {
            name: '250MM级技巧评分',
            data: [-3.1, -3.1, -3.1, -3.1, -3.1, -3.1]
          }]
        }
        Highcharts.chart('container', options)
      },
    },
    created() {
      this.$nextTick(() =>{
        this.initEcharts()
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
    height: calc(100% - 141px);
    background-color: @bgColor;
    h2 {
      font-size: 1.5em;
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
    }
  }
</style>