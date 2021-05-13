<template>
  <div class="side-content">
    <div class="content">
      <div class="town-forecast-head">
        <div class="time-period-radio">
          <span>检验时段：</span>
          <el-radio-group v-model="month" @change="changeTimePeriod">
            <el-select v-model="year" @change="changeYear">
              <el-option
                      v-for="item in years"
                      :key="item"
                      :label="item + '年'"
                      :value="item">
              </el-option>
            </el-select>
            <el-radio-button label="1">一月</el-radio-button>
            <el-radio-button label="2">二月</el-radio-button>
            <el-radio-button label="3">三月</el-radio-button>
            <el-radio-button label="q1">一季度</el-radio-button>
            <el-radio-button label="4">四月</el-radio-button>
            <el-radio-button label="5">五月</el-radio-button>
            <el-radio-button label="6">六月</el-radio-button>
            <el-radio-button label="q2">二季度</el-radio-button>
            <el-radio-button label="7">七月</el-radio-button>
            <el-radio-button label="8">八月</el-radio-button>
            <el-radio-button label="9">九月</el-radio-button>
            <el-radio-button label="q3">三季度</el-radio-button>
            <el-radio-button label="10">十月</el-radio-button>
            <el-radio-button label="11">十一月</el-radio-button>
            <el-radio-button label="12">十二月</el-radio-button>
            <el-radio-button label="q4">四季度</el-radio-button>
            <el-radio-button label="year">全年</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <hr>
      <div class="town-forecast-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <el-radio-group v-model="product" @change="changeProduct">
              <el-radio-button label="skillScore">技巧评分</el-radio-button>
              <el-radio-button label="quality">分项质量</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <el-radio-group v-model="type" @change="changeType">
              <el-radio label="zh">综合技巧</el-radio>
              <el-radio label="qy">晴雨(雪)预报技巧</el-radio>
              <el-radio label="ybx">一般性降水技巧</el-radio>
              <el-radio label="by">暴雨以上技巧</el-radio>
              <el-radio label="maxt">最高温技巧</el-radio>
              <el-radio label="mint">最低温技巧</el-radio>
              <el-radio label="wind">风向风速技巧</el-radio>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="town-forecast-bottom">
        <h2>{{year}}年{{titleTime}}乡镇天气预报质量评分报表</h2>
        <div id="container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "momnet";
  import Highcharts from "highcharts";

  export default {
    name: "TownForecast",
    data() {
      return {
        years: [2021, 2020, 2019, 2018, 2017],
        year: 2021,
        month: moment().month() + 1,
        product: 'skillScore',
        type: 'zh',
        titleTime: moment().month() + 1 + '月'
      }
    },
    methods: {
      changeTimePeriod(time) {
        if (time === 'year') {
          this.titleTime = '全年'
        } else if (time.indexOf('q') !== -1) {
          this.titleTime = '第' + time.charAt(time.length - 1) + '季度'
        } else {
          this.titleTime = this.month + '月'
        }
      },
      changeYear(year) {
        // alert(year)
      },
      changeProduct(product) {
        // alert(product)
      },
      changeType(type) {
        // alert(type)
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
          colors: ['#59BDBE'],
          title: {
            text: ''
          },
          xAxis: {
            categories: ['全乡镇','吉首','娄底','岳阳', '常德', '张家界', '怀化', '株洲',
            '永州', '湘潭', '益阳', '衡阳', '邵阳', '郴州', '长沙'],
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
            data: [3.1, 3.1, -3.1, 3.1, 3.1, 3.1, 3.1, -3.1, -3.1, -3.1, -3.1, -3.1, -3.1, 3.1, 3.1]
          }]
        }
        Highcharts.chart('container', options)
      }
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
  .town-forecast-head{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 25px;

    .time-period-radio {
      .el-select {
        vertical-align: middle;
      }
      .el-input__inner {
        width: 65px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        border-radius: 0;
        padding: 0 0 0 6px;

      }
      .el-input__suffix {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .el-select .el-input .el-select__caret {
        font-size: 12px;
        color: @mainColor;
      }
      .el-input__icon {
        width: 20px;
        line-height: 25px;
      }
      .el-icon-arrow-up:before {
        content: "\e78f";
      }
      .el-radio-button__inner {
        width: 65px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding: 0;
      }
    }
  }
  .town-forecast-middle {
    position: relative;
    height: 70px;
    background-color: @bgColor;
    margin-bottom: 20px;
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
      padding: 0 40px;
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
    .el-radio__input.is-checked .el-radio__inner {
      border-color: @mainColor;
      background-color: @mainColor;
    }
    .el-radio__input.is-checked+.el-radio__label {
      color: #606266;
    }
  }
  .town-forecast-bottom {
    height: calc(100% - 140px);
    background-color: @bgColor;
    h2 {
      font-size: 1.5em;
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
    }
  }
</style>