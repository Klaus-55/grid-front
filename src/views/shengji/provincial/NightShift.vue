<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
      </div>
      <hr>

      <div class="chief-middle">
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
      </div>

      <div class="chief-bottom">
        <h2>{{title}}</h2>
        <div id="container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import {initProChart} from "../../../common/Base";
  import {getNightShiftScore} from "../../../network/shengji";

  export default {
    name: "NightShift",
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
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        data: {},
        objArr: ['zh', 'zhjq', 'zhzl'],
        obj: {
          zh: '综合',
          zhjq: '综合技巧',
          zhzl: '综合质量',
        }
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getNightShiftScore()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getNightShiftScore()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getNightShiftScore()
      },
      getNightShiftScore() {
        let loading = this.openLoading('#container');
        let start = moment(this.start).format('YYYYMMDD')
        let end = moment(this.end).format('YYYYMMDD')
        getNightShiftScore(start, end).then(res => {
          this.data = res.data
          this.initChart()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      initChart() {
        let chartData = {}
        let {data, objArr, obj} = this
        let forecasters = []
        let series = []
        data.map(item => forecasters.push(item['forecaster']))
        for (let item of objArr) {
          let seriesItem = {}
          seriesItem.name = obj[item]
          let seriesData = []
          for (let forecaster of forecasters) {
            let rs = data.find(item => item['forecaster'] === forecaster);
            seriesData.push(this.numToFixed(rs[item]))
          }
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        chartData['categories'] = forecasters
        chartData['series'] = series
        initProChart(chartData)
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
        return this.titleTime + '中短期夜班预报员评分'
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        initProChart(this.data)
        this.getNightShiftScore()
      })
    }
  }
</script>

<style scoped>

</style>