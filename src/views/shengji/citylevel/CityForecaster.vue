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

        <el-button size="mini" type="primary" @click="getForecasterScore2" style="margin-left: 30px">2021临时成绩</el-button>
      </div>
      <hr>

      <div class="forecaster-middle">
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

      <div class="forecaster-bottom">
        <h2>{{title}}</h2>
        <el-radio-group v-model="showType" size="mini">
          <el-radio-button label="图表"></el-radio-button>
          <el-radio-button label="表格"></el-radio-button>
        </el-radio-group>
        <div id="cityFore-container" style="width: 100%; height:calc(100% - 84px)" v-show="showType === '图表'"></div>
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
                  v-for="item in tableHeader"
                  :prop="item.prop"
                  :label="item.label"
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
  import {getForecasterScore, getForecasterScore2} from "../../../network/shengji";

  export default {
    name: "CityForecaster",
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
        showType: "图表",
        objArr: ['zh', 'warning_per', 'zhzl_per', 'zhjq_per', 'heavy_per'],
        // tableArr: ['forecaster', 'area', 'warning_per', 'zhzl_per', 'zhjq_per', 'warning', 'zhjq', 'zhzl', 'bc', 'zh', 'pm'],
        obj: {
          zh: '综合',
          warning_per: '预警信号',
          zhjq_per: '综合技巧',
          zhzl_per: '综合质量',
          heavy_per: '强降水监测',
        },
        tableHeader: [
          {prop: 'forecaster', label: '预报员'},
          {prop: 'area', label: '地市'},
          {prop: 'warning', label: '预警信号(实际成绩)'},
          {prop: 'zhzl', label: '网格预报TS(实际成绩)'},
          {prop: 'zhjq', label: '网格预报技巧(实际成绩)'},
          {prop: 'heavy', label: '强降水监测(实际成绩)'},
          {prop: 'warning_per', label: '预警信号(百分制成绩)'},
          {prop: 'warning_pm', label: '预警信号排名'},
          {prop: 'zhzl_per', label: '网格预报TS(百分制成绩)'},
          {prop: 'zhzl_pm', label: '网格预报TS排名'},
          {prop: 'zhjq_per', label: '网格预报技巧(百分制成绩)'},
          {prop: 'zhjq_pm', label: '网格预报技巧排名'},
          {prop: 'heavy_per', label: '强降水监测(百分制成绩)'},
          {prop: 'heavy_pm', label: '强降水监测排名'},
          {prop: 'bc', label: '班次'},
          {prop: 'zh', label: '综合成绩'},
          {prop: 'pm', label: '排名'},
        ]
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getForecasterScore()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getForecasterScore()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getForecasterScore()
      },
      getForecasterScore2() {
        let loading = this.openLoading('.forecaster-bottom');
        getForecasterScore2().then(res => {
          this.data = res.data
          this.tableData = res.data
          this.initChart()
          loading.close()
        })
      },
      getForecasterScore() {
        let loading = this.openLoading('.forecaster-bottom');
        getForecasterScore(this.start, this.end).then(res => {
          this.data = res.data
          this.tableData = res.data
          this.initChart()
          loading.close()
        })
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '市级预报员成绩.xlsx'
        return exportExcelCom(document, id, title)
      },
      initChart() {
        let chartData = {}
        let {data, objArr, obj} = this
        let forecasters = []
        let categories = []
        let series = []
        data.map(item => {
          forecasters.push(item['forecaster'] + '_' + item['area'])
          categories.push(item['forecaster'])
        })
        for (let item of objArr) {
          let seriesItem = {}
          seriesItem.name = obj[item]
          let seriesData = []
          for (let forecaster of forecasters) {
            let rs = data.find(item => item['forecaster'] + '_' + item['area'] === forecaster);
            seriesData.push(this.numToFixed(rs[item]))
          }
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        chartData['categories'] = categories
        chartData['series'] = series
        initProChart(chartData, 'cityFore-container')
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
        return this.titleTime + '市级预报员评分'
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getForecasterScore()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .forecaster-middle {
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
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: @mainColor
      }
    }
  }
  .forecaster-bottom {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 150px);
    background-color: @bgColor;
    padding-top: 10px;
    h2 {
      font-size: 1.3em;
      padding-top: 30px;
      text-align: center;
    }

    .el-radio-group {
      margin-left: 0 !important;
      float: right;
      margin-right: 10px;
      margin-top: 10px;
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

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
      background-color: #49afcd;
      border-radius: 12px 12px 12px 12px;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner:hover {
      color: #fff;
    }

    .el-radio-button__inner:hover {
      color: #49afcd;
    }
  }
</style>