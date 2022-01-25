<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
<!--        <div class="download-file">-->
<!--          <a :href="fileName" download>评分办法文件</a>-->
<!--          <i class="el-icon-download"></i>-->
<!--        </div>-->
      </div>
      <hr/>
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预报时次：</span>
            <el-radio-group v-model="ftime" @change="changeFtime">
              <el-radio-button label="zh">综合</el-radio-button>
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="14">14时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验时效：</span>
            <el-radio-group v-model="wfinterval" @change="changeWfinterval">
              <el-radio-button label="1">逐1H</el-radio-button>
              <el-radio-button label="3">逐3H</el-radio-button>
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
              <el-radio-button label="me">平均误差</el-radio-button>
              <el-radio-button label="mae">平均绝对误差</el-radio-button>
              <el-radio-button label="pc">晴雨预报</el-radio-button>
              <el-radio-button label="k1">0.1-19.9mm</el-radio-button>
              <el-radio-button label="k2">{{wfinterval === '1' ? '≥20mm' : '20-49.9mm'}}</el-radio-button>
              <el-radio-button label="k3" v-show="wfinterval === '3'">≥50mm</el-radio-button>
              <el-radio-button label="zh">综合</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                      v-model="switchStatus"
                      @change="switchChange"
                      active-text="0~12小时"
                      active-color="#03B452"
                      inactive-color="#7E7772"
              >
              </el-switch>
              <el-checkbox-group v-model="fhour" @change="changeFhour">
                <el-checkbox
                        v-for="item in ftimeView"
                        :label="item"
                        :key="item"
                >{{ item == "0" ? "综合" : item + "时" }}
                </el-checkbox
                >
                <!--                <el-checkbox v-for="item in ftimeView" :label="item" v-if="isZhuri">{{item + '日'}}</el-checkbox>-->
              </el-checkbox-group>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">{{mainTitle}}</div>
          <div class="subtitle">{{subtitle}}</div>
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
                    id="container"
                    class="container"
                    style="width: 100%; height: calc(100% - 50px)"
                    v-show="showType === '图表'"></div>
            <el-table
                    v-show="showType === '表格'"
                    :data="tableData"
                    border
                    class="table-fixed"
                    height="calc(100% - 64px)"
                    style="width: calc(100% - 50px); margin: 0 auto; transform: translateY(10px)"
                    :header-cell-style="{'text-align': 'center'}">
              <el-table-column
                      prop="ftime"
                      label="预报时段（小时）"
                      align="center"
              >
              </el-table-column>
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
  import Highcharts from "highcharts";
  import {download, rainScore} from "../../../network/duanlin";
  import HighchartsNoData from "highcharts/modules/no-data-to-display";

  export default {
    name: "RainExamine",
    components: {
      DatePicker,
    },
    data() {
      return {
        start: moment(new Date()).subtract(8, 'd').format('YYYY-MM-DD'),
        // start: '2021-07-01',
        end: moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'),
        // end: '2021-07-31',
        inspectionItem: "skillScore",
        inspectionItems: [
          {value: "skillScore", label: "技巧评分"},
          {value: "quality", label: "分项质量"},
        ],
        ftime: "zh",
        wfinterval: "1",
        product: "BBBUSI",
        facname: "me",
        switchStatus: true,
        fhour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ftimeView: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        isMask: false,
        showType: "图表",
        models: ["BABJ", "PFSN", "DSDZ", "GGFS"],
        modelOptions: [
          {label: 'BABJ', value: '中央台'},
          {label: 'PFSN', value: '省台指导'},
          {label: 'DSDZ', value: '地市订正'},
          {label: 'GGFS', value: 'GRAPES_GFS'},
          {label: 'G3KM', value: 'GRAPES_3KM'},
          {label: 'GZHR', value: '华南模式'},
          {label: 'SHMR', value: '华东模式'},
          {label: 'STDL', value: '省台客观DL'},
          {label: 'ST24', value: '省台客观0-24小时'},
        ],
        data: [],
        series: [],
        mainTitle: '',
        subtitle: '',
        tableHeader: [],
        tableData: []
      };
    },
    methods: {
      changeDate(startDate, endDate) {
        this.start = moment(startDate).format("YYYY-MM-DD");
        this.end = moment(endDate).format("YYYY-MM-DD");
        this.getRainScore()
      },
      changItems(item) {
        // alert(item)
      },
      changeFtime() {
        this.getRainScore()
      },
      changeWfinterval(val) {
        this.facname = 'me'
        if (val === '1') {
          this.fhour = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          this.ftimeView = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        } else {
          this.fhour = [3, 6, 9, 12]
          this.ftimeView = [3, 6, 9, 12]
        }
        this.getRainScore()
      },
      changeProduct() {
        this.getRainScore()
      },
      changeFacname() {
        this.updateTitle()
        this.initCt()
      },
      switchChange() {
        let {switchStatus, wfinterval} = this
        if (switchStatus) {
          let fhour = []
          for (let i = 0; i < 12 / Number(wfinterval); i++) {
            fhour.push(i * Number(wfinterval) + Number(wfinterval))
          }
          this.fhour = fhour
        } else {
          this.fhour = []
        }
        this.initCt()
      },
      changeFhour(fhour) {
        this.fhour = fhour.sort((x, y) => x - y)
        fhour.length > 0 ? this.switchStatus = true : this.switchStatus = false
        this.initCt()
      },
      changeModes(models) {
        let modelOptions = this.modelOptions
        let sortedModels = []
        for (let i = 0; i < modelOptions.length; i++) {
          let model = modelOptions[i]['label']
          if (models.indexOf(model) !== -1) {
            sortedModels.push(model)
          }
        }
        this.models = sortedModels
        this.initCt()
      },
      changeType() {
        this.initCt()
      },
      initCt() {
        if (this.showType === '表格') {
          this.initTable()
        } else {
          this.initEcharts()
        }
      },
      updateTitle() {
        let {start, end, wfinterval, facname, ftime} = this
        let mainTitle = '湖南省逐' + wfinterval + '小时'
        if (facname === 'me') {
          mainTitle += '降水平均误差'
        } else if (facname === 'mae') {
          mainTitle += '降水平均绝对误差'
        } else if (facname === 'pc') {
          mainTitle += '晴雨预报准确率'
        } else if (facname === 'k1') {
          mainTitle += '降水0.1-19.9mmTS评分'
        } else if (facname === 'k2') {
          wfinterval === '1' ? mainTitle += '降水≥20mmTS评分' : mainTitle += '降水20-49.9mmTS评分'
        } else if (facname === 'k3') {
          mainTitle += '降水≥50mmTS评分'
        } else {
          mainTitle += '降水综合成绩'
        }
        this.mainTitle = mainTitle
        ftime === 'zh' ? ftime = '综合' : ftime = ftime + '(北京时)'
        this.subtitle = '起报时间：' + start + '至' + end + '逐' + wfinterval + '时 ' + ftime
      },
      initTable() {
        let tableHeader = []
        let tableData = []
        let {fhour, data, models, facname, modelOptions} = this
        for (let i = 0; i < modelOptions.length; i++) {
          if (models.indexOf(modelOptions[i]['label']) === -1) continue
          let header = {}
          header.prop = modelOptions[i]['label']
          header.label = modelOptions[i]['value']
          tableHeader.push(header)
        }
        for (let i = 0; i < fhour.length; i++) {
          let row = {}
          row['ftime'] = fhour[i]
          for (let j = 0; j < data.length; j++) {
            if (models.indexOf(data[j]['wfsrc']) === -1) continue
            if (data[j]['wfhour'] === fhour[i]) {
              row[data[j]['wfsrc']] = data[j][facname]
            }
          }
          tableData.push(row)
        }
        this.tableHeader = tableHeader
        tableHeader.length === 0 ? this.tableData = [] : this.tableData = tableData
      },
      initEcharts() {
        let {fhour, models, facname, data} = this
        let series = []
        for (let i = 0; i < models.length; i++) {
          let name = ''
          let seriesData = []
          for (let j = 0; j < fhour.length; j++) {
            for (let k = 0; k < data.length; k++) {
              if (fhour[j] === data[k]['wfhour'] && models[i] === data[k]['wfsrc']) {
                if (name === '') name = data[k]['zwname']
                seriesData.push(data[k][facname])
                break
              }
            }
          }
          let seriesItem = {}
          seriesItem.name = name
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        if (fhour.length === 0) series = []
        let options = {
          chart: {
            type: "column",
            backgroundColor: "#F8F8F8",
          },
          credits: {
            enabled: false,
          },
          colors: ["#5E8CEB", "#59BDBE", "#978EBA", "#EBC980"],
          title: {
            text: "",
          },
          lang: {
            downloadPNG: "下载PNG文件",
            downloadJPEG: "下载JPEG图片",
            downloadSVG: "下载SVG文件",
            noData: '暂无数据'
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030'
            }
          },
          exporting: {
            buttons: {
              contextButton: {
                menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
              }
            }
          },
          xAxis: {
            categories: fhour,
            crosshair: true,
          },
          yAxis: {
            min: 0,
            title: {
              text: "",
            },
          },
          tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat:
              '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
              '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: "</table>",
            shared: true,
            useHTML: true,
          },
          plotOptions: {
            column: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
              },
            },
          },
          series: series,
        };
        HighchartsNoData(Highcharts)
        Highcharts.chart("container", options);
      },
      initModels() {
        let data = this.data
        let models = []
        let modelOptions = []
        for (let i = 0; i < data.length; i++) {
          let model = data[i]['wfsrc'];
          if (models.indexOf(model) === -1) {
            models.push(model)
            let option = {}
            option['label'] = model
            option['value'] = data[i]['zwname']
            modelOptions.push(option)
          }
        }
        this.models = models
        this.modelOptions = modelOptions
      },
      getRainScore() {
        let loading = this.openLoading('.rain-examine-bottom');
        let start = moment(this.start).format('YYYYMMDD');
        let end = moment(this.end).format('YYYYMMDD');
        rainScore(start, end, this.ftime, this.wfinterval, this.product).then(res => {
          this.data = res.data
          this.updateTitle()
          this.initModels()
          this.initCt()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      fileName() {
        return 'http://10.111.102.28:9000/grid-server/api/duanlin/download/附件3：湖南省短时临近格点预报检验办法.docx';
      }
    },
    created() {
      this.$nextTick(() => {
        this.getRainScore()
      });
    },
  };
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .download-file{
    float: right;
    color: #fff;
    padding: 4px 4px;
    border-radius: 2px;
    cursor: pointer;
    background: linear-gradient(#28abe2, #2685d5);
    a{
      color: #fff;
      text-decoration: none
    }
    i{
      margin-left: .2rem;
    }
  }

  .rain-examine-middle {
    background-color: @bgColor;
    height: 100px;
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

  .rain-examine-bottom {
    height: calc(100% - 171px);
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

  .el-popper[x-placement^="bottom"] {
    margin-top: 5px !important;
  }
</style>