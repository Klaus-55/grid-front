<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
      </div>
      <hr/>
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预报时次：</span>
            <el-radio-group v-model="ftime" @change="changeFtime">
              <el-radio-button label="zh">综合</el-radio-button>
              <el-radio-button label="08">08时</el-radio-button>
              <!--              <el-radio-button label="14">14时</el-radio-button>-->
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="facname" @change="changeFacname">
              <el-radio-button label="ts">TS评分</el-radio-button>
              <el-radio-button label="po">漏报率</el-radio-button>
              <el-radio-button label="far">空报率</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="heavy-examine border-content">
              <el-checkbox-group v-model="fhour" class="heavy-examine-group" @change="changeFhour">
                <el-checkbox label="006">0~6小时</el-checkbox>
                <el-checkbox label="012">6~12小时</el-checkbox>
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
            <div id="container"
                 style="width: 100%; height: calc(100% - 20px)"></div>
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
  import HighchartsNoData from "highcharts/modules/no-data-to-display";
  import {thunderstormScore} from "../../../network/duanlin";

  export default {
    name: "ThunderstormExamine",
    components: {
      DatePicker,
    },
    data() {
      return {
        start: moment(Date.now()).subtract(10, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).subtract(1, 'd').format('YYYY-MM-DD'),
        ftime: "zh",
        facname: "ts",
        fhour: ["006", "012"],
        data: [],
        mainTitle: '',
        subtitle: ''
      };
    },
    methods: {
      initEcharts() {
        let categories = []
        let {data, fhour, facname} = this
        for (let i = 0; i < data.length; i++) {
          let forecaster = data[i]['forecaster']
          if (categories.indexOf(forecaster) === -1) categories.push(forecaster)
        }
        let series = []
        for (let i = 0; i < fhour.length; i++) {
          let seriesItem = {}
          seriesItem.name = (Number(fhour[i]) - 6) + '-' + Number(fhour[i])
          let seriesData = []
          for (let j = 0; j < categories.length; j++) {
            for (let k = 0; k < data.length; k++) {
              if (categories[j] === data[k]['forecaster'] && fhour[i] === data[k]['effetime']) {
                seriesData.push(data[k][facname])
                break
              }
            }
          }
          seriesItem.data = seriesData
          series.push(seriesItem)
        }
        if (data.length === 0) series = []
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
            categories: categories,
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
              '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
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
      changeDate(startDate, endDate) {
        this.start = moment(startDate).format("YYYY-MM-DD");
        this.end = moment(endDate).format("YYYY-MM-DD");
        this.getThunderstormScore()
      },
      changeFtime() {
        this.getThunderstormScore()
      },
      changeFacname() {
        this.updateTitle()
        this.initEcharts()
      },
      changeFhour(val) {
        this.fhour = val.sort((a, b) => Number(a) - Number(b))
        this.initEcharts()
      },
      updateTitle() {
        let {start, end, ftime, facname} = this
        // 湖南省雷暴大风预报质量
        let mainTitle = '湖南省雷暴大风'
        if (facname === 'ts') {
          mainTitle += '预报质量'
        } else if (facname === 'po') {
          mainTitle += '漏报率'
        } else {
          mainTitle += '空报率'
        }
        this.mainTitle = mainTitle
        // 起报时间：2020-10-12至2020-10-13逐时 08(北京时)
        ftime = ftime === 'zh' ? '综合' : (ftime + '(北京时)')
        this.subtitle = '起报时间：' + start + '至' + end + '逐6时 ' + ftime
      },
      getThunderstormScore() {
        let loading = this.openLoading('.rain-examine-bottom');
        thunderstormScore(this.start, this.end, this.ftime).then(res => {
          this.data = res.data
          this.updateTitle()
          this.initEcharts()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.getThunderstormScore()
      });
    },
  };
</script>

<style lang="less">
  .rain-examine-middle {
    .thunderstorm-examine {
      width: 32rem;
    }
  }

  .el-menu-item,
  .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }
</style>