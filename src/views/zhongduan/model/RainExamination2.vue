<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <span style="margin-left: 50px">检验项：</span>
        <el-select v-model="inspectionItem" placeholder="" @change="changItems">
          <el-option
            v-for="item in inspectionItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px" v-show="showType === '表格'">导出</el-button>
      </div>
      <hr>

      <div class="model-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预报时次：</span>
            <el-radio-group v-model="ftime" @change="changeFtime">
              <el-radio-button label="zh">综合</el-radio-button>
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验时效：</span>
            <el-radio-group v-model="wfinterval">
              <el-radio-button label="24">逐24H</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验产品：</span>
            <el-radio-group v-model="product" @change="changeProduct">
              <el-radio-button label="BBBUSI">业务评估</el-radio-button>
              <el-radio-button label="TECH">技术评估</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="facname" @change="changeFacname">
              <el-radio-button v-for="fac in factories" :label="fac.label">{{fac.name}}</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                v-model="switchStatus"
                @change="switchChange"
                :active-text="activeText"
                active-color="#03B452"
                inactive-color="#7E7772"></el-switch>
              <el-checkbox-group v-model="fhour" @change="changeFhour">
                <el-checkbox
                        v-for="item in ftimeView"
                        :label="item"
                        :key="item">{{ item == "0" ? "综合" : item + "时" }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="model-examine-bottom">
        <div class="highcharts-title">
<!--          <div class="maintitle">{{mainTitle}}</div>-->
<!--          <div class="subtitle">{{subtitle}}</div>-->
          <div class="highcharts-content">
            <el-checkbox-group v-model="models" @change="changeModes">
              <el-checkbox v-for="item in modelOptions" :label="item.label" :key="item.label">{{item.value}}
              </el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="showType" size="mini" @change="changeType">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
                    id="model-rain-container2"
                    class="container"
                    style="width: 100%; height: calc(100% - 50px)"
                    v-show="showType === '图表'"></div>
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
<!--                      prop="ftime"-->
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
  import moment from "momnet";
  import HighchartsNoData from "highcharts/modules/no-data-to-display";
  import Highcharts from "highcharts";
  import {rainScore} from "../../../network/zhongduan";
  import {exportExcelCom, renderModelChart} from "../../../common/Base";

  export default {
    name: "RainExamination2",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(new Date()).subtract(8, 'd').format('YYYY-MM-DD'),
        end: moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'),
        inspectionItem: "quality",
        inspectionItems: [
          {value: "skillScore", label: "技巧评分"},
          {value: "quality", label: "分项质量"},
        ],
        ftime: "zh",
        wfinterval: "24",
        product: "BBBUSI",
        facname: "pc",
        factories: [
          {label: 'pc', name: '晴雨(雪)准确率'},
          {label: 'ybx_pc', name: '一般性降水准确率'},
          {label: 'by_pc', name: '暴雨以上准确率'},
          {label: 'qjs_pc', name: '强降水准确率'},
          {label: 'fj1_pc', name: '小雨'},
          {label: 'fj2_pc', name: '中雨'},
          {label: 'fj3_pc', name: '大雨'},
          {label: 'fj4_pc', name: '暴雨'},
          {label: 'fj5_pc', name: '大暴雨'},
          {label: 'fj6_pc', name: '特大暴雨'},
          {label: 'lj1_pc', name: '≥0.1mm'},
          {label: 'lj2_pc', name: '≥10.0mm'},
          {label: 'lj3_pc', name: '≥25.0mm'},
          {label: 'lj4_pc', name: '≥50.0mm'},
          {label: 'lj5_pc', name: '≥100.0mm'},
          {label: 'lj6_pc', name: '≥250.0mm'},
          {label: 'zhjs', name: '综合降水'},
        ],
        switchStatus: true,
        activeText: '0~72小时',
        fhour: [0, 24, 48, 72],
        ftimeView: [0, 24, 48, 72],
        mainTitle: '',
        subtitle: '',
        models: [],
        modelOptions: [

        ],
        showType: "图表",
        data: [],
        tableHeader: [],
        tableData: []

      }
    },
    methods: {
      changeDate(startDate, endDate) {
        this.start = moment(startDate).format("YYYY-MM-DD");
        this.end = moment(endDate).format("YYYY-MM-DD");
        this.getRainScore()
      },
      changItems(val) {
        if (val === 'skillScore') {
          this.facname = 'pc_jq'
          this.factories = [
            {label: 'pc_jq', name: '晴雨(雪)预报技巧'},
            {label: 'gen_jq', name: '一般性降水技巧'},
            {label: 'storm_jq', name: '暴雨以上技巧'},
            {label: 'heavy_jq', name: '强降水技巧'},
          ]
        } else {
          this.facname = 'pc'
          this.factories = [
            {label: 'pc', name: '晴雨(雪)准确率'},
            {label: 'ybx_pc', name: '一般性降水准确率'},
            {label: 'by_pc', name: '暴雨以上准确率'},
            {label: 'qjs_pc', name: '强降水准确率'},
            {label: 'fj1_pc', name: '小雨'},
            {label: 'fj2_pc', name: '中雨'},
            {label: 'fj3_pc', name: '大雨'},
            {label: 'fj4_pc', name: '暴雨'},
            {label: 'fj5_pc', name: '大暴雨'},
            {label: 'fj6_pc', name: '特大暴雨'},
            {label: 'lj1_pc', name: '≥0.1mm'},
            {label: 'lj2_pc', name: '≥10.0mm'},
            {label: 'lj3_pc', name: '≥25.0mm'},
            {label: 'lj4_pc', name: '≥50.0mm'},
            {label: 'lj5_pc', name: '≥100.0mm'},
            {label: 'lj6_pc', name: '≥250.0mm'},
            {label: 'zhjs', name: '综合降水'},
          ]
        }
        this.updateTitle()
        this.initEcharts()
      },
      changeFtime() {
        this.getRainScore()
      },
      changeProduct() {
        this.getRainScore()
      },
      changeFacname() {
        this.updateTitle()
        this.initEcharts()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '降水检验.xlsx'
        return exportExcelCom(document, id, title)
      },
      switchChange(val) {
        if (val) {
          this.fhour = [0, 24, 48, 72]
        } else {
          this.fhour = []
        }
        this.initEcharts()
      },
      changeFhour(val) {
        if (val.length === 0) {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
        this.fhour = val.sort((a, b) => a - b)
        this.initEcharts()
      },
      changeModes(val) {
        let models = []
        for (let i = 0; i < this.modelOptions.length; i++) {
          if (val.indexOf(this.modelOptions[i]['label']) !== -1) {
            models.push(this.modelOptions[i]['label'])
          }
        }
        this.models = models
        this.initEcharts()
      },
      changeType() {
        this.initEcharts()
      },
      initEcharts() {
        if (this.showType === '表格') {
          this.initTable()
          return
        }
        let obj = this.initEchData();
        obj.categories = ['202110010800', '202110012000', '202110020800', '202110022000', '202110030800', '202110032000']
        obj.series = [
          {
            name: '中央台',
            data: [80.4, 81.9, 81.3, 78.1, 77.9, 75.8]
          },
          {
            name: '地市融合',
            data: [77.8, 79.6, 77.9, 75.8, 81.3, 78.1]
          }
        ]
        renderModelChart(obj, this.mainTitle, this.subtitle, 'model-rain-container2')
      },
      initEchData() {
        let {fhour, models, modelOptions, facname, data} = this
        let categories = []
        for (let i = 0; i < fhour.length; i++) {
          if (fhour[i] === 0) {
            categories.push('综合')
          } else {
            categories.push(fhour[i])
          }
        }
        let series = []
        for (let i = 0; i < models.length; i++) {
          let seriesData = []
          for (let j = 0; j < categories.length; j++) {
            let sData = NaN
            for (let k = 0; k < data.length; k++) {
              let cat
              if (data[k]['wfhour'] === 0) {
                cat = '综合'
              } else {
                cat = data[k]['wfhour']
              }
              if (cat === categories[j] && models[i] === data[k]['wfsrc']) {
                sData = this.resolveData(data[k][facname])
                break
              }
            }
            seriesData.push(sData)
          }
          let modelOption = modelOptions.find(model => model.label === models[i]);
          let seriesItem = {}
          seriesItem.name = modelOption.value
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        if (categories.length === 0) series = []
        return {series, categories}
      },
      resolveData(num) {
        if (num == null) return NaN
        if (isNaN(num)) return NaN
        return Number(num.toFixed(2))
      },
      initModels() {
        let models = []
        let modelOptions = []
        for (let i = 0; i < this.data.length; i++) {
          let model = this.data[i]['wfsrc'];
          if (this.inspectionItem === 'skillScore' && model === 'BABJ') {
            continue
          }
          if (models.indexOf(model) === -1) {
            models.push(model)
            let modelOption = {}
            modelOption.label = model
            modelOption.value = this.data[i]['zwname']
            modelOptions.push(modelOption)
          }
        }

        this.models = models
        this.modelOptions = modelOptions
      },
      initTable() {
        let {models, modelOptions, fhour, data, facname} = this
        let tableHeader = []
        let tableData = []
        if (data.length === 0 || models.length === 0) {
          this.tableHeader = []
          this.tableData = []
          return
        }
        tableHeader.push({prop: 'ftime', label: '预报时段（小时）'})
        for (let i = 0; i < models.length; i++) {
          let option = modelOptions.find(model => model.label === models[i]);
          tableHeader.push({prop: models[i], label: option.value})
        }
        for (let i = 0; i < fhour.length; i++) {
          let row = {}
          fhour[i] === 0 ? row['ftime'] = '综合' : row['ftime'] = fhour[i]
          for (let j = 0; j < models.length; j++) {
            let colData = NaN
            for (let k = 0; k < data.length; k++) {
              if (fhour[i] === data[k]['wfhour'] && data[k]['wfsrc'] === models[j]) {
                colData = data[k][facname]
              }
            }
            row[models[j]] = isNaN(colData) ? '/' : colData.toFixed(2)
          }
          tableData.push(row)
        }
       this.tableHeader = tableHeader
       this.tableData = tableData
      },
      updateTitle() {
        let facname = this.facname
        let fac = this.factories.find(obj => obj['label'] === facname);
        let mainTitle = '湖南省24小时'
        if (this.inspectionItem === 'quality') {
          if (fac.name.indexOf('准确率') !== -1) {
            mainTitle += fac.name
          } else {
            mainTitle += fac.name + '准确率'
          }
        } else {
          mainTitle += fac.name
        }
        this.mainTitle = mainTitle
        let ftime = this.ftime
        ftime === 'zh' ? ftime = '综合' : ftime += '时'
        this.subtitle = '起报时间：' + this.start + '至' + this.end + '逐24时 ' + ftime
      },
      getRainScore() {
        this.updateTitle()
        let start = moment(this.start).format('YYYYMMDD')
        let end = moment(this.end).format('YYYYMMDD')
        rainScore(start, end, this.ftime, this.product).then(res => {
          this.data = res.data
          this.initModels()
          this.initEcharts()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.getRainScore()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .model-examine-bottom {
    background-color: @bgColor;
    height: 142px;
    margin-bottom: 20px;

    > span {
      margin-left: 20px;
      vertical-align: top;
    }

    .el-menu {
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
      font-size: 12px;
    }

    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }

    .el-radio-button__inner {
      font-size: 12px;
      padding: 2px 7px;
    }

    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
    }

    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0;
    }

    .el-radio-button__inner:hover {
      color: #49afcd;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #49afcd;
      border-color: #49afcd;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner:hover {
      color: #fff;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      box-shadow: none;
    }

    .border-content {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #e4e4e4;
      width: 1061px;
      height: 30px;

      .el-switch {
        padding-left: 20px;
      }

      .el-switch__core {
        width: 28px !important;
        height: 12.8px;
      }

      .el-switch__core:after {
        width: 9px;
        height: 9px;
      }

      .el-switch.is-checked .el-switch__core::after {
        margin-left: -10px;
      }

      .el-switch__label * {
        font-size: 13px;
      }

      .el-switch__label.is-active {
        color: #303133;
      }

      .el-checkbox-group {
        display: inline-block;
        margin-left: 30px;
        width: 921px;
        margin-right: 10px;
      }

      .el-checkbox {
        color: #303133;
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
        width: 30px;
        font-size: 12px;
        padding-left: 2px;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #303133;
      }
    }
  }

  .model-examine-bottom {
    height: calc(100% - 213px);
    background-color: @bgColor;

    .highcharts-title {
      text-align: center;
      padding-top: 15px;
      margin-bottom: 5px;
      height: 100%;

      .maintitle {
        font-size: 19px;
        font-weight: 700;
      }

      .subtitle {
        margin-top: 3px;
        font-size: 12px;
        color: #747171;
      }

      .highcharts-content {
        width: 100%;
        height: calc(100% - 58px);
        text-align: left !important;
      }
    }

    .el-checkbox-group {
      display: inline-block;
      width: calc(100% - 200px);
      box-sizing: border-box;
      margin-top: 10px !important;
      padding-left: 10px;
    }

    .el-checkbox {
      color: #303133;
    }

    .el-checkbox__inner {
      width: 11px;
      height: 11px;
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
      font-size: 12px;
      padding-left: 3px;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #303133;
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