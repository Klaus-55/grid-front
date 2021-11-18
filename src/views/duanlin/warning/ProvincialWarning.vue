<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker :start="start" :end="end" @changeDate="changeDate"/>
        <el-button
                v-show="showType === '表格'"
                size="mini"
                type="primary"
                @click="exportExcel"
                style="margin-left: 30px">导出</el-button>
      </div>
      <hr />
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="warningType" @change="changeType">
              <el-radio-button
                v-for="item in typeItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.value }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="factory" @change="changeFactory">
              <el-radio-button
                v-for="item in factories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.value }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
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
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">{{title}}</div>
          <div class="highcharts-content" v-show="!isMask">
            <el-radio-group v-model="showType" size="mini" @change="changeShowType">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
              id="container"
              style="width: 100%; height: calc(100% - 50px)"
              v-show="showType === '图表'"
            ></div>
            <el-table
                    id="table"
                    v-show="showType === '表格'"
                    :data="tableData"
                    border
                    class="table-fixed"
                    height="calc(100% - 64px)"
                    style="width: calc(100% - 50px); margin: 0 auto; transform: translateY(10px)"
                    :header-cell-style="{'text-align': 'center'}">
<!--              <el-table-column-->
<!--                      prop="department"-->
<!--                      label="预报时段（小时）"-->
<!--                      align="center"-->
<!--              >-->
<!--              </el-table-column>-->
              <el-table-column
                      v-for="item in tableHeader"
                      :prop="item.prop"
                      :label="item.label"
                      align="center"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import {initRadios, initYears, toFix} from "../../../common/utils";
  import moment from "momnet";
  import {provincialWarning} from "../../../network/duanlin";
  import {exportExcelCom, initSaEcharts} from "../../../common/Base";

  export default {
    name: "ProvincialWarning",
    components: {
      DatePicker,
    },
    data() {
      return {
        warningType: "暴雨",
        typeItems: [
          { label: "暴雨", value: "暴雨" },
          { label: "雷雨大风", value: "雷雨大风" },
          { label: "雷电", value: "雷电" },
          { label: "冰雹", value: "冰雹" },
          { label: "综合", value: "综合" },
        ],
        factory: "ts",
        factories: [
          { label: "ts", value: "预报准确率" },
          { label: "far", value: "空报率" },
          { label: "po", value: "漏报率" },
          { label: "pod", value: "命中率" },
          { label: "t1", value: "t1" },
          { label: "t2", value: "t2" },
          { label: "t3", value: "t3" },
          { label: "zh", value: "综合成绩" },
        ],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        isMask: false,
        showType: "图表",
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        facTitle: '预报质量',
        data: {},
        tableHeader: [],
        tableData: []
      };
    },
    computed: {
      title() {
        return '湖南省' + this.titleTime + this.warningType + '预警' + this.facTitle
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getProvincialWarning()
      },
      changeFactory(val) {
        let item = this.factories.find(item => item.label === val);
        this.facTitle = item.value
        this.initChart()
      },
      changeType() {
        this.getProvincialWarning()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getProvincialWarning()
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YYYY年M月D日');
          let endStr = moment(this.end).format('YYYY年M月D日');
          this.titleTime = startStr + '~' + endStr
        } else {
          if (this.month == 'year') {
            this.titleTime = this.year + '年'
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
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '省级预警' + this.facTitle + '.xlsx'
        return exportExcelCom(document, id, title)
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getProvincialWarning()
      },
      getProvincialWarning() {
        let target = '#container'
        if (this.showType === '表格') target = '#table'
        let loading = this.openLoading(target);
        provincialWarning(this.start, this.end, this.warningType).then(res => {
          this.data = res.data
          this.initChart()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      changeShowType() {
        this.initChart()
      },
      initChart() {
        let rsData = {}
        let categories = []
        let {data, factory} = this
        let chartData = data['rs']
        let levels = ["不分级别", "所有级别", "红色", "橙色", "黄色", "蓝色"]
        if (factory === 'zh') {
          chartData = []
          data['zh'].map(item => chartData.push(Object.assign({}, item, {level: '综合成绩'})))
          levels = ["综合成绩"]
        }
        if (this.showType === '表格') {
          this.initTable(chartData)
          return
        }
        if (chartData.length === 0 || chartData.length === 1) levels = []
        for (let cd of chartData) {
          let forecaster = cd['forecaster']
          if (categories.indexOf(forecaster) === -1) categories.push(forecaster)
        }
        let series = []
        for (let level of levels) {
          let seriesItem = {}
          seriesItem.name = level
          let itemData = []
          for (let forecaster of categories) {
            let item = chartData.find(item => item.forecaster === forecaster && item.level === level);
            let val = NaN
            if (typeof item !== "undefined") val = item[factory]
            itemData.push(val)
          }
          seriesItem.data = itemData
          series.push(seriesItem)
        }
        rsData.categories = categories
        rsData.series = series
        initSaEcharts(rsData)
      },
      initTable(chartData) {
        let tableHeader = []
        let tableData = []
        if (chartData.length === 0 || chartData.length === 1) {
          this.tableHeader = tableHeader
          this.tableData = tableData
          return
        }
        let {factory} = this
        tableHeader = [
          {prop: 'forecaster', label: '预报员'},
          {prop: 'bfj', label: '不分级别'},
          {prop: 'all', label: '所有级别'},
          {prop: 'red', label: '红色'},
          {prop: 'orange', label: '橙色'},
          {prop: 'yellow', label: '黄色'},
          {prop: 'blue', label: '蓝色'}
        ]
        if (factory === 'zh') {
          tableHeader = [
            {prop: 'forecaster', label: '预报员'},
            {prop: 'zh', label: '综合成绩'}
          ]
        }
        let forecasters = []
        for (let cd of chartData) {
          let forecaster = cd['forecaster']
          if (forecasters.indexOf(forecaster) === -1) forecasters.push(forecaster)
        }
        for (let forecaster of forecasters) {
          let row = {}
          row['forecaster'] = forecaster
          for (let th of tableHeader) {
            if (th.prop === 'forecaster') continue
            let item = chartData.find(item => item.forecaster === forecaster && item.level === th.label);
            let val = null
            if (typeof item !== "undefined") val = item[factory]
            row[th.prop] = val
          }
          tableData.push(row)
        }
        this.tableHeader = tableHeader
        this.tableData = tableData
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getProvincialWarning()
      });
    }
};
</script>

<style lang="less">
  @import "../../../assets/less/common";
    .time-period-radio {
      margin-left: 20px;
      margin-top: 10px;
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
      .el-radio-button__inner:disabled:hover {
        color: #C0C4CC;
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
</style>