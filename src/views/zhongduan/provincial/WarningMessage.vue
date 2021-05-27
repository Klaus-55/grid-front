<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker2 @changeDate="changeDate" :start="start" :end="end"/>
        <el-button type="text" @click="open">评定方法</el-button>
      </div>
      <hr>
      <div class="warning-message-middle">
        <div class="time-period-radio">
          <span>检验时段：</span>
          <el-radio-group v-model="month" @change="changeTimePeriod">
            <el-select v-model="year" @change="changeYear">
              <el-option
                      v-for="item in years"
                      :key="item"
                      :label="item + '年'"
                      :value="item"></el-option>
            </el-select>
            <el-radio-button v-for="item in radios"
                             :label="item.label"
                             :disabled="item.disabled">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="warning-message-bottom">
        <h2>{{titleTime}}预警消息预报质量</h2>
        <div id="wm-container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>

    </div>
  </div>
</template>

<script>
  import DatePicker2 from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import Highcharts from "highcharts";
  import HighchartsNoData from 'highcharts/modules/no-data-to-display'
  import {warningMessage} from "../../../network/zhongduan";
  import {initRadios, initYears} from "../../../common/utils";
  import {waringMessageVar} from "../../../common/vars";

  export default {
    name: "WarningMessage",
    components: {
      DatePicker2
    },
    data() {
      return {
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        data: {},
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD')
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getWarningMessage()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getWarningMessage()
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
          colors: ['#5E8CEB', '#59BDBE', '#978EBA', '#EBC980'],
          title: {
            text: ''
          },
          lang: {
            noData: '暂无数据'
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
          },
          xAxis: {
            // categories: ['湖南省','预报员1','预报员2','预报员3'],
            categories: this.data.categories,
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
          series: this.data.series
        }
        Highcharts.chart('wm-container', options)
        HighchartsNoData(Highcharts)
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getWarningMessage()
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YYYY年M月D日');
          let endStr = moment(this.end).format('YYYY年M月D日');
          this.titleTime = startStr + '~' + endStr
        } else {
          if (this.month == 'year') {
            this.titleTime = this.year + '年全年'
            this.start = moment().year(this.year).month(0).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(11).endOf('month').format('YYYY-MM-DD')
          } else if ((this.month + '').indexOf('q') !== -1) {
            this.titleTime = this.year + '年第' + this.month.charAt(this.month.length - 1) + '季度'
            let q = parseInt(this.month.charAt(this.month.length - 1));
            this.start = moment().year(this.year).month(q * 3 - 3).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(q * 3 - 1).endOf('month').format('YYYY-MM-DD')
          } else {
            this.titleTime = this.year + '年' + this.month + '月'
            this.start = moment().year(this.year).month(this.month - 1).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(this.month - 1).endOf('month').format('YYYY-MM-DD')
            if (this.month == moment().month() + 1 && this.year === moment().year()) {
              this.end = moment(Date.now()).format('YYYY-MM-DD')
            }
          }
        }
      },
      getWarningMessage() {
        let loading = this.openLoading('#wm-container');
        warningMessage(this.start, this.end).then(res => {
          if (res.data.categories.length === 0) {
            res.data.series = []
            this.data = res.data
          } else {
            this.data = res.data
          }
          this.initEcharts()
          this.$nextTick(() => {
            loading.close()
          })
        }).catch(err => {
          console.log(err)
        })
      },
      open() {
        this.$alert(waringMessageVar, '评定办法', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        });
      }
    },
    created() {
      this.$nextTick(() =>{
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getWarningMessage()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .warning-message-middle {
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
  .warning-message-bottom {
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