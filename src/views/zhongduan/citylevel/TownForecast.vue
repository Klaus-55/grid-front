<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <span style="margin-left: 50px">站点类型：</span>
        <el-select v-model="obtType" placeholder="" @change="changeObtTypes">
          <el-option
                  v-for="item in obtTypes"
                  :key="item"
                  :label="item"
                  :value="item"
          >
          </el-option>
        </el-select>
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
                             :disabled="item.disabled">{{item.name}}</el-radio-button>
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
        <h2>{{titleTime}}乡镇天气预报质量评分报表</h2>
        <div id="container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
      <component :is="dialog.name" :ref="dialog.name" v-model="dialog.visible" v-bind="dialog.args"/>
    </div>
  </div>
</template>

<script>
  import moment from "momnet";
  import Highcharts from "highcharts";
  import DatePicker from "../../../components/content/DatePicker2";
  import TownDialog from "./TownDialog";
  import dialogMix from "../../../common/mixins/dialog"
  import {keyValue, skill, townQuality} from "../../../common/vars";
  import {initRadios, initYears} from "../../../common/utils";
  import {townForecastScore} from "../../../network/zhongduan";

  export default {
    name: "TownForecast",
    components: {
      DatePicker,
      TownDialog
    },
    data() {
      return {
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        obtType: 'S99',
        obtTypes: ['S99', 'S322', 'S421', 'S1912', 'S3000'],
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        product: 'skillScore',
        type: 'zh',
        titleTime: moment().month() + 1 + '月',
        checkedFacs: ['zhjq', 'qyjq', 'genjq', 'baoyujq', 'maxtjq', 'mintjq', 'qyzql', 'genzql', 'stormzql', 'tmaxtzql', 'tmintzql'],
        currentFacs: ['zhjq', 'qyjq', 'genjq', 'baoyujq', 'maxtjq', 'mintjq'],
        facs: skill,
        facValue: keyValue,
        radios: [],
        data: [],
        towns: [
          {wfsrc: 'BECS', name: '湖南省'},
          {wfsrc: 'BFXK', name: '湘潭市'},
          {wfsrc: 'BFJO', name: '湘西自治州'},
          {wfsrc: 'BFDA', name: '张家界市'},
          {wfsrc: 'BFYE', name: '永州市'},
          {wfsrc: 'BFZU', name: '株洲市'},
          {wfsrc: 'BFYY', name: '益阳市'},
          {wfsrc: 'BFHW', name: '怀化市'},
          {wfsrc: 'BFUY', name: '岳阳市'},
          {wfsrc: 'BFSB', name: '邵阳市'},
          {wfsrc: 'BFHA', name: '衡阳市'},
          {wfsrc: 'BFCA', name: '常德市'},
          {wfsrc: 'BFCE', name: '郴州市'},
          {wfsrc: 'BFCS', name: '长沙市'},
          {wfsrc: 'BFLD', name: '娄底市'},
        ]
      }
    },
    mixins: [dialogMix],
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getTownForecast()
      },
      changeObtTypes() {
        this.getTownForecast()
      },
      changeTimePeriod() {
        this.updateInfo()
        this.getTownForecast()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getTownForecast()
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
      updateCurrentFacs() {
        let {checkedFacs, facs} = this
        let currentFacs = checkedFacs.filter(fac => facs.indexOf(fac) !== -1);
        currentFacs.sort((a, b) => facs.indexOf(a) - facs.indexOf(b))
        this.currentFacs = currentFacs
      },
      getTownForecast() {
        let loading = this.openLoading('.town-forecast-bottom');
        let {start, end, obtType} = this
        start = moment(start).format('YYYYMMDD')
        end = moment(end).format('YYYYMMDD')
        townForecastScore(start, end, obtType).then(res => {
          this.data = res.data
          this.initEcharts()
          loading.close()
        })
      },
      resolveEchartData() {
        let {currentFacs, towns, product, data} = this
        if (data.length === 0) return {categories: [], series: []}
        let townType = []
        for (const town of towns) {
          if (town.wfsrc === 'BECS' && product === 'skillScore') continue
          townType.push(town.wfsrc)
        }
        let categories = []
        for (let i = 0; i < townType.length; i++) {
          let obj = towns.find(town => town.wfsrc === townType[i]);
          categories.push(obj.name)
        }
        let series = []
        for (let i = 0; i < currentFacs.length; i++) {
          let seriesItem = {}
          seriesItem.name = keyValue[currentFacs[i]]
          let seriesData = []
          for (let j = 0; j < townType.length; j++) {
            let res = data.find(obj => obj['model'] === townType[j])
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
        if (!isNaN(num) && num != null) {
          return Number(num.toFixed(1))
        } else {
          return num
        }
      },
      initEcharts() {
        let rs = this.resolveEchartData();
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
            categories: rs.categories,
            labels: {
              style: {
                cursor: 'pointer'
              }
            }
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
          series: rs.series
        }
        let _this = this
        let chart = Highcharts.chart('container', options, function(c) {
          // 给坐标轴标签 DOM 添加点击事件， 并根据事件坐标计算出 x 下标值
          if (typeof c.xAxis[0].labelGroup == 'undefined') return
          Highcharts.addEvent(c.xAxis[0].labelGroup.element, 'click', e => {
            e = c.pointer.normalize(e);
            let index = Math.round(c.xAxis[0].toValue(e.chartX));
            _this.$$dialogOpen('TownDialog', {
              attrs: _this,
              city: c.xAxis[0].categories[index]
            })
          });
        })
      }
    },
    created() {
      this.$nextTick(() =>{
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getTownForecast()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .town-forecast-middle {
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
  .town-forecast-bottom {
    height: calc(100% - 270px);
    background-color: @bgColor;
    h2 {
      font-size: 1.5em;
      padding-top: 30px;
      padding-bottom: 30px;
      text-align: center;
    }
  }

</style>