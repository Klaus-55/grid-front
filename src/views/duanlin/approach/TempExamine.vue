<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <!--        <span style="margin-left: 50px">检验项：</span>-->
        <!--        <el-select v-model="tempItem" placeholder="" @change="changItems">-->
        <!--          <el-option-->
        <!--            v-for="item in tempItems"-->
        <!--            :key="item.value"-->
        <!--            :label="item.label"-->
        <!--            :value="item.value"-->
        <!--          >-->
        <!--          </el-option>-->
        <!--        </el-select>-->
      </div>
      <hr/>
      <div class="rain-examine-middle">
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
              <el-radio-button label="mae">平均绝对误差</el-radio-button>
              <el-radio-button label="tt">预报准确率</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                      v-model="switchStatus"
                      @change="switchChange"
                      active-text="0-12小时"
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
                <!-- <el-checkbox v-for="item in ftimeView" :label="item" v-if="isZhuri">{{item + '日'}}</el-checkbox> -->
              </el-checkbox-group>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">{{mainTitle}}</div>
          <div class="subtitle">
            {{subtitle}}
          </div>
          <div class="highcharts-content">
            <el-checkbox-group v-model="models" @change="changeModels">
              <el-checkbox v-for="item in modelOptions" :label="item.label" :key="item.label">
                {{item.value}}
              </el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="showType" size="mini" @change="changeType">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
                    id="container"
                    style="width: 100%; height: calc(100% - 50px)"
                    v-show="showType === '图表'"
            ></div>
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
  import {temScore} from "../../../network/duanlin";
  import HighchartsNoData from "highcharts/modules/no-data-to-display";

  export default {
    name: "TempExamine",
    components: {
      DatePicker,
    },
    data() {
      return {
        // start: moment(new Date()).subtract(8, 'd').format('YYYY-MM-DD'),
        start: '2021-01-01',
        // end: moment(new Date()).subtract(1, 'd').format('YYYY-MM-DD'),
        end: '2021-04-30',
        tempItem: "skillScore",
        tempItems: [
          {value: "skillScore", label: "技巧评分"},
          {value: "quality", label: "分项质量"},
        ],
        ftime: "zh",
        wfinterval: "1",
        product: "BBBUSI",
        facname: "mae",
        switchStatus: true,
        fhour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],//, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
        ftimeView: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
        this.getTemScore()
      },
      changItems(item) {

      },
      changeFtime() {
        this.getTemScore()
      },
      changeWfinterval(val) {
        if (val === '1') {
          this.fhour = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          this.ftimeView = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        } else {
          this.fhour = [3, 6, 9, 12]
          this.ftimeView = [3, 6, 9, 12]
        }
        this.getTemScore()
      },
      changeProduct() {
        this.getTemScore()
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
      changeModels(models) {
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
      changeType(type) {
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
        if (facname === 'mae') {
          mainTitle += '温度平均绝对误差'
        } else {
          mainTitle += '温度预报准确率'
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
      getTemScore() {
        let loading = this.openLoading('.rain-examine-bottom');
        let start = moment(this.start).format('YYYYMMDD');
        let end = moment(this.end).format('YYYYMMDD');
        temScore(start, end, this.ftime, this.wfinterval, this.product).then(res => {
          this.data = res.data
          this.updateTitle()
          this.initModels()
          this.initCt()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
    },
    created() {
      this.$nextTick(() => {
        this.getTemScore();
      });
    },
  };
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .rain-examine-bottom {
    .highcharts-content {
      width: 100%;
      height: calc(100% - 58px);
      text-align: left !important;
    }
  }
</style>