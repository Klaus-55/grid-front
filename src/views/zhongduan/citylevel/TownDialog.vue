<template>
  <el-dialog
          :title="dialogTitle"
          :visible.sync="isShow"
          width="70%"
          class="pub_dialog">
    <div class="head">
      <date-picker @changeDate="changeDate" :start="start" :end="end"/>
      <span style="margin-left: 50px">检验时段：</span>
      <el-select v-model="period" placeholder="" @change="changePeriod">
        <el-option
                v-for="item in periods"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
      </el-select>
      <span style="margin-left: 50px">站点类型：</span>
      <el-select v-model="obtType" placeholder="" @change="changeObtTypes">
        <el-option
                v-for="item in obtTypes"
                :key="item"
                :label="item"
                :value="item"/>
      </el-select>
      <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出数据表格</el-button>
    </div>
    <hr>
    <div class="town-forecast-middle">
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
                           :disabled="item.disabled">{{item.name}}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="fac-select">
        <el-radio-group v-model="product" @change="changeProduct">
          <el-radio-button label="skillScore">技巧评分</el-radio-button>
          <el-radio-button label="quality">分项质量</el-radio-button>
        </el-radio-group>
        <el-checkbox-group
                v-model="checkedFacs"
                @change="changeFacs">
          <el-checkbox v-for="fac in facs" :label="fac" :key="fac">{{facValue[fac]}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="town-forecast-bottom">
      <div id="dialogContainer" style="width: 100%; height:100%"></div>
    </div>
    <hr>
    <h3 style="margin-bottom: 10px">预报质量评分数据表格：</h3>
    <el-table
            id="table"
            :data="tableData"
            border
            stripe
            style="width: 100%"
            :header-cell-style="{'text-align': 'center', backgroundColor: '#39A5F8', color: '#FFF', fontFamily: 'LatoBold', fontWeight: 'normal'}"
            :cell-style="{'text-align': 'center'}">
      <el-table-column
              v-for="item in tableHeader"
              :prop="item"
              :label="item">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import {keyValue, skill, townQuality} from "../../../common/vars";
  import HighCharts from "highcharts";
  import {townForecasterScore} from "../../../network/zhongduan";
  import {exportExcelCom} from "../../../common/Base";

  export default {
    name: "TownDialog",
    components: {
      DatePicker
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      attrs: {
        type: Object
      },
      city: {
        type: String
      }
    },
    data() {
      return {
        dialogTitle: this.city + '预报员成绩',
        start: '',
        end: '',
        period: '',
        periods: [
          {value: '24', label: '24小时'},
          {value: '48', label: '48小时'},
          {value: '72', label: '72小时'},
          {value: '96', label: '96小时'},
          {value: '120', label: '120小时'},
          {value: 'h72', label: '0-72小时'},
          {value: 'h120', label: '0-120小时'},
        ],
        obtType: '',
        obtTypes: ['S99', 'S322', 'S421', 'S1912'],
        month: '',
        year: '',
        years: [],
        radios: [],
        product: '',
        checkedFacs: [],
        currentFacs: [],
        facs: [],
        facValue: {},
        titleTime: '',
        wfsrc: '',
        data: [],
        tableHeader: [],
        tableData: [],
      }
    },
    computed: {
      isShow: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('input', v)
        }
      },
      title() {
        return this.titleTime + '乡镇天气预报员质量评分报表'
      }
    },
    watch: {
      isShow: {
        handler: 'handleShow',
        immediate: true
      },
    },
    methods: {
      handleShow() {
        let attrs = this.attrs
        this.start = attrs.start
        this.end = attrs.end
        this.period = attrs.period
        this.obtType = attrs.obtType
        this.month = attrs.month
        this.year = attrs.year

        this.radios = attrs.radios
        this.years = attrs.years
        this.product = attrs.product
        this.checkedFacs = attrs.checkedFacs
        this.currentFacs = attrs.currentFacs
        this.facs = attrs.facs
        this.facValue = attrs.facValue
        this.titleTime = attrs.titleTime
        this.towns = attrs.towns
        let town = attrs.towns.find(obj => obj.name === this.city);
        this.wfsrc = town.wfsrc
        this.getTownForecasterScore()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '网格预报员质量评分.xlsx'
        return exportExcelCom(document, id, title)
      },
      initTable() {
        let tableHeader = []
        let tableData = []
        for (let i = 0; i < this.data.length; i++) {
          if (i === 0) tableHeader.push('要素')
          tableHeader.push(this.data[i]['forecaster'])
        }
        this.tableHeader = tableHeader
        let facs = []
        facs.push(...skill)
        facs.push(...townQuality)
        for (let fac of facs) {
          let obj = {}
          for (let th of tableHeader) {
            if (th === '要素') {
              obj[th] = keyValue[fac]
              continue
            }
            let res = this.data.find(obj => obj.forecaster === th);
            obj[th] = this.unmDigits(res[fac])
          }
          tableData.push(obj)
        }
        this.tableData = tableData
      },
      unmDigits(num) {
        if (typeof num === undefined) return "-"
        if (isNaN(num)) return "-"
        if (num == null || num === -999) return "-"
        return num.toFixed(2)
      },
      getTownForecasterScore() {
        let loading = this.openLoading('#dialogContainer');
        townForecasterScore(this.start, this.end, this.period, this.obtType, this.wfsrc).then(res => {
          this.data = res.data
          this.initEcharts()
          this.initTable()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      resolveEchartData() {
        let {currentFacs, data} = this
        if (data.length === 0) return {categories: [], series: []}
        let categories = []
        for (const d of data) {
          categories.push(d.forecaster)
        }
        let series = []
        for (let i = 0; i < currentFacs.length; i++) {
          let seriesItem = {}
          seriesItem.name = keyValue[currentFacs[i]]
          let seriesData = []
          for (let j = 0; j < categories.length; j++) {
            let res = data.find(obj => obj['forecaster'] === categories[j])
            if (!res) {
              seriesData.push(NaN)
            } else {
              seriesData.push(this.numToFixed(res[currentFacs[i]]))
            }
          }
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        return {categories, series}
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
      initEcharts() {
        let obj = this.resolveEchartData();
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
            text: this.title,
            margin: 5,
            style: {
              color: '#000',
              font: 'bold 20px "Trebuchet MS", Verdana, sans-serif'
            }
          },
          lang: {
            downloadPNG: "下载PNG文件",
            downloadJPEG: "下载JPEG图片",
            downloadSVG: "下载SVG文件",
            noData: '暂无数据'
          },
          exporting: {
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
              }
            }
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
          },
          xAxis: {
            categories: obj.categories,
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
          series: obj.series
        }
        HighCharts.chart('dialogContainer', options);
      },
      changePeriod() {
        this.getTownForecasterScore()
      },
      changeObtTypes() {
        this.getTownForecasterScore()
      },
      changeTimePeriod() {
        this.updateInfo()
        this.getTownForecasterScore()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getTownForecasterScore()
      },
      changeProduct(product) {
        if (product === 'skillScore') {
          this.facs = skill
        } else {
          this.facs = townQuality
        }
        this.updateCurrentFacs()
        this.initEcharts()
      },
      changeFacs() {
        this.updateCurrentFacs()
        this.initEcharts()
      },
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getTownForecasterScore()
      },
      updateCurrentFacs() {
        let {checkedFacs, facs} = this
        let currentFacs = checkedFacs.filter(fac => facs.indexOf(fac) !== -1);
        currentFacs.sort((a, b) => facs.indexOf(a) - facs.indexOf(b))
        this.currentFacs = currentFacs
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
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .pub_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;

    .el-dialog {
      margin: 0 auto !important;
      height: 90%;
      overflow: hidden;

      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 55px;
        bottom: 0;
        right: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
    }
    .town-forecast-middle {
      box-sizing: border-box;
      width: 100%;
      height: 240px;
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

    .town-forecast-bottom {
      box-sizing: border-box;
      height: calc(100% - 260px);
      background-color: @bgColor;
    }
  }
</style>