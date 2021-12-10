<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
      </div>
      <hr>

      <div class="weather-public-middle">
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
            <el-radio-button v-for="item in radios"
                             :label="item.label"
                             :disabled="item.disabled">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="fac-select">
          <el-checkbox-group
                  v-model="checkedFacs"
                  @change="changeFacs">
            <el-checkbox v-for="fac in facs" :label="fac" :key="fac">{{facValue[fac]}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="weather-public-bottom">
<!--        <h2>{{title}}</h2>-->
        <div id="wp-chart" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {keyValue, weatherFac} from "../../../common/vars";
  import {initRadios, initYears} from "../../../common/utils";
  import {initMsEcharts} from "../../../common/Base";
  import {weatherPublic} from "../../../network/zhongduan";

  export default {
    name: "WeatherPublic",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        radios: [],
        facs: weatherFac,
        facValue: keyValue,
        checkedFacs: ['qyzql', 'qyts', 'genzql', 'stormzql', 'zhjs'],
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        data: {}
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getWeatherPublic()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getWeatherPublic()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getWeatherPublic()
      },
      changeFacs() {
        let {checkedFacs, facs} = this
        checkedFacs.sort((a, b) => facs.indexOf(a) - facs.indexOf(b))
        this.initChart()
      },
      getWeatherPublic() {
        let loading = this.openLoading('#wp-chart');
        let start = moment(this.start).format('YYYYMMDD');
        let end = moment(this.end).format('YYYYMMDD');
        weatherPublic(start, end).then(res => {
          this.data = res.data
          this.initChart()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      initChart() {
        let {data, checkedFacs, facValue} = this
        let chartData = {}
        let forecasters = []
        data.map(item => forecasters.push(item['forecaster']))
        let series = []
        for (let fac of checkedFacs) {
          let seriesItem = {}
          seriesItem.name = facValue[fac]
          let seriesData = []
          for (let forecaster of forecasters) {
            let obj = data.find(item => item['forecaster'] === forecaster);
            seriesData.push(this.numToFixed(obj[fac]))
          }
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        chartData.categories = forecasters
        chartData.series = series
        initMsEcharts(chartData, this.title, 'wp-chart')
      },
      numToFixed(num) {
        if (!isNaN(num) && num != null && num !== -999.0) {
          return Number(num.toFixed(1))
        } else if (num === -999.0) {
          return NaN
        } else {
          return num
        }
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
    },
    computed: {
      title() {
        return this.titleTime + '天气公报'
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getWeatherPublic()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .weather-public-middle {
    box-sizing: border-box;
    width: 100%;
    height: 200px;
    background-color: @bgColor;
    padding: 15px;
    margin-bottom: 20px;

    .time-period-radio {
      margin-bottom: 15px;
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

    .fac-select {
      .el-radio-group {
        vertical-align: top;
        padding-top: 5px;
      }
      .el-radio-button__inner {
        padding: 3px 13px;
      }
      .el-checkbox-group {
        display: inline-block;
        width: calc(100% - 200px);
        margin-left: 10px;
      }

      .el-checkbox {
        color: #303133;
        margin-right: 0;
        padding: 5px 0;
      }

      .el-checkbox__inner {
        width: 11px;
        height: 11px;
      }

      .el-checkbox__input {
        vertical-align: baseline;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: transparent;
        border-color: #dcdfe6;
      }

      .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #dcdfe6;
      }

      .el-checkbox__inner::after {
        border: 2px solid #03b452;
        border-left: 0;
        border-top: 0;
        left: 2px;
        top: -1px;
      }

      .el-checkbox__label {
        width: 251px;
        font-size: 14px;
        padding-left: 2px;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #303133;
      }

    }
  }
  .weather-public-bottom {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 300px);
    background-color: @bgColor;
    padding-top: 10px;
    h2 {
      font-size: 1.3em;
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
    }
  }
</style>