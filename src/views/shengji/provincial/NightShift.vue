<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <el-button v-show="showType === '表格'"
                   size="mini"
                   type="primary"
                   @click="exportExcel"
                   style="margin-left: 30px">导出表格数据</el-button>
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
        <el-radio-group v-model="showType" size="mini">
          <el-radio-button label="图表"></el-radio-button>
          <el-radio-button label="表格"></el-radio-button>
        </el-radio-group>
        <div id="night-container" style="width: 100%; height:calc(100% - 84px)" v-show="showType === '图表'"></div>
        <el-table
                id="table"
                v-show="showType === '表格'"
                :data="tableData"
                border
                class="table-fixed"
                height="calc(100% - 140px)"
                style="width: calc(100% - 50px); margin: 0 auto; transform: translateY(10px)"
                :header-cell-style="{'text-align': 'center'}">
          <el-table-column
                  prop="forecaster"
                  label="预报员"
                  align="center"/>
          <el-table-column
                  prop="zhzl"
                  label="综合质量(实际成绩)"
                  align="center"/>
          <el-table-column
                  prop="zhjq"
                  label="综合技巧(实际成绩)"
                  align="center"/>
          <el-table-column
                  prop="zhzl_per"
                  label="综合质量(百分制成绩)"
                  align="center"/>
          <el-table-column
                  prop="zhjq_per"
                  label="综合技巧(百分制成绩)"
                  align="center"/>
          <el-table-column
                  prop="zh"
                  label="综合成绩"
                  align="center"/>
          <el-table-column
                  prop="pm"
                  label="排名"
                  align="center"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import {exportExcelCom, initProChart} from "../../../common/Base";
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
        tableData: [],
        objArr: ['zh', 'zhjq_per', 'zhzl_per'],
        obj: {
          zh: '综合',
          zhjq_per: '综合技巧',
          zhzl_per: '综合质量',
        },
        showType: "图表",
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getNightShiftScore()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '中短期夜班预报员成绩.xlsx'
        return exportExcelCom(document, id, title)
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
        let loading = this.openLoading('.chief-bottom');
        let start = moment(this.start).format('YYYYMMDD')
        let end = moment(this.end).format('YYYYMMDD')
        getNightShiftScore(start, end).then(res => {
          this.data = res.data
          this.tableData = res.data
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
        initProChart(chartData, 'night-container')
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
        this.getNightShiftScore()
      })
    }
  }
</script>

<style scoped>

</style>