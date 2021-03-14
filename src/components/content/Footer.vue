<template>
  <div class="footer"
       v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(248, 248, 248, 0.8)"
  >
    <div class="highcharts-title">
      <div class="maintitle">湖南省1小时晴雨预报质量技巧</div>
      <div class="subtitle">起报时间：2018-10-12至2018-10-13逐1时 08(北京时)</div>
    </div>
    <el-checkbox-group v-model="modes">
      <el-checkbox v-for="mode in modeViews" :label="mode"></el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-model="showType" size="mini">
      <el-radio-button label="图表"></el-radio-button>
      <el-radio-button label="表格"></el-radio-button>
    </el-radio-group>

    <div id="grid-chart" style="width: 100%; height: calc(100% - 112px)">

    </div>
  </div>
</template>

<script>
  import Highcharts from "highcharts";

  export default {
    name: "Footer",
    data() {
      return {
        modes: [
          '中央台','省台指导', '地市订正', '欧洲中心', 'GRAPES_GFS', 'GRAPES_3KM',
          '华南模式', '华东模式', '省台客观DL', '省台客观0-24小时'
        ],
        modeViews: [
          '中央台','省台指导', '地市订正', '欧洲中心', 'GRAPES_GFS', 'GRAPES_3KM',
          '华南模式', '华东模式', '省台客观DL', '省台客观0-24小时'
        ],
        showType: '图表',
        loading: false
      }
    },
    mounted() {
      let option = {
        chart: {
          type: 'column',
          backgroundColor: '#f8f8f8',
          spacingBottom: 0
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [
            '01','02','03','04','05','06','07','08'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            borderWidth: 0
          }
        },
        series: [{
          name: '中央台',
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
        }, {
          name: '省台指导',
          data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3]
        }, {
          name: '地市订正',
          data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6]
        }, {
          name: '欧洲中心',
          data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4]
        }]
      }
      Highcharts.chart('grid-chart', option)
    }
  }
</script>

<style lang="less">
  .footer {
    height: calc(100% - 201px);
    width: 100%;
    background-color: #f8f8f8;
    .highcharts-title {
      text-align: center;
      padding-top: 15px;
      .maintitle {
        font-size: 19px;
        font-weight: 700;
      }
      .subtitle {
        margin-top: 3px;
        font-size: 12px;
        color: #747171;
      }
    }
    .el-checkbox-group {
      display: inline-block;
      margin-top: 20px;
      padding-left: 10px;
    }
    .el-checkbox {
      color: #303133;
    }
    .el-checkbox__inner {
      width: 11px;
      height: 11px;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: transparent;
      border-color: #DCDFE6;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #DCDFE6;
    }
    .el-checkbox__inner::after {
      border: 2px solid #03b452;
      border-left: 0;
      border-top: 0;
      left: 2px;
      top: -1px;
    }
    .el-checkbox__label {
      font-size: 12px;
      padding-left: 3px;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
      color: #303133;
    }

    .el-radio-group {
      margin-left: calc(100% - 1128px);
      background-color: #dfdfdf;
      border-radius: 12px;
    }
    .el-radio-button__inner {
      background-color: transparent;
      border: none;
    }
    .el-radio-button--mini .el-radio-button__inner {
      padding: 5px 13px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 12px 0 0 12px;
      border-left: none;
    }
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 12px 12px 0;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      box-shadow: none;
      background-color: #49afcd;
      border-radius: 12px 12px 12px 12px;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover {
      color: #fff;
    }
    .el-radio-button__inner:hover {
      color: #49afcd;
    }
  }
</style>