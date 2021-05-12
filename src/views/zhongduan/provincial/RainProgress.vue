<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
        <el-link target="_blank" @click="" style="float: right">评定方法</el-link>
      </div>
      <hr>

      <div class="rain-progress-middle">
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

      <div class="rain-progress-bottom">
        <h2>{{year}}年{{titleTime}}降水过程预报质量</h2>
        <div id="rs-container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker";
  import moment from "momnet";
  import Highcharts from "highcharts";
  export default {
    name: "RainProgress",
    components: {
      DatePicker
    },
    data() {
      return {
        years: [2021, 2020, 2019, 2018, 2017],
        year: 2021,
        month: moment().month() + 1,
        titleTime: moment().month() + 1 + '月'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        let startStr = moment(startTime).format("YYYY-MM-DD")
        let endStr = moment(endTime).format("YYYY-MM-DD")
        console.log(startStr)
        console.log(endStr)
      },
      changeTimePeriod(time) {
        if (time === 'year') {
          this.titleTime = '全年'
        } else if (time.indexOf('q') !== -1) {
          this.titleTime = '第' + time.charAt(time.length - 1) + '季度'
        } else {
          this.titleTime = this.month + '月'
        }
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
          legend: {
            enabled: false
          },
          colors: ['#59BDBE'],
          title: {
            text: ''
          },
          xAxis: {
            categories: ['湖南省','预报员1','预报员2','预报员3','预报员4','预报员5','预报员6', '预报员7'],
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
            name: '预报质量',
            data: [2.3, 2.3, 2.3, 2.3,3.1, 3.1, 3.1, 2.1]
          }]
        }
        Highcharts.chart('rs-container', options)
      },
      changeYear(year) {

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
  .rain-progress-middle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    background-color: @bgColor;
    margin-bottom: 20px;

    .time-period-radio {
      .el-select {
        vertical-align: middle;
      }
      .el-input__inner {
        width: 65px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        background-color: @bgColor;
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
        background: @bgColor;
        padding: 0;
      }
    }
  }
  .rain-progress-bottom {
    width: 100%;
    height: calc(100% - 150px);
    background-color: @bgColor;
    h2 {
      font-size: 1.3em;
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
    }
  }
</style>