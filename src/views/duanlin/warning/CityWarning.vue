<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker/>
      </div>
      <hr/>
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="warningType" @change="changeType">
              <el-radio-button v-for="item in warningTypes" :label="item" :key="item">{{
                item
                }}
              </el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="factory" @change="changeFactory">
              <el-radio-button
                      v-for="item in factories"
                      :label="item.label"
                      :key="item.label"
              >{{ item.value }}
              </el-radio-button
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
<!--        <el-menu class="year-select" mode="horizontal">-->
<!--          <el-menu-item>-->
<!--            <span>检验时段：</span>-->
<!--            <el-select v-model="defYear">-->
<!--              <el-option-->
<!--                      v-for="item in yearItem"-->
<!--                      :key="item.value"-->
<!--                      :label="item.label + '年'"-->
<!--                      :value="item.value"-->
<!--              >-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--            <el-radio-group v-model="defMonth">-->
<!--              <el-radio-button-->
<!--                      v-for="item in monthItem"-->
<!--                      :key="item.value"-->
<!--                      :label="item.label"-->
<!--                      :value="item.value"-->
<!--              >-->
<!--              </el-radio-button>-->
<!--            </el-radio-group>-->
<!--          </el-menu-item>-->
<!--        </el-menu>-->
      </div>
      <div class="rain-examine-bottom">
        <div class="top">
          <div id="map"></div>
          <div class="table">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    stripe
                    border
                    height="100%">
              <el-table-column prop="type" align="center" label="预警类型">
              </el-table-column>
              <el-table-column
                      prop="precision"
                      align="center"
                      label="预报准确率"
              >
              </el-table-column>
              <el-table-column prop="lead" align="center" label="预警提前量">
              </el-table-column>
              <el-table-column prop="score" align="center" label="总额成绩">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="center"></div>
        <div class="bottom">
          <div class="h-10 highcharts-title">
            <div class="maintitle">湖南省{{titleTime + warningType + facTitle}}</div>
            <div id="bottom-highcharts"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker";
  import Highcharts from "highcharts";
  import data from "../../../assets/js/hunan"
  import * as L from "leaflet"
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";

  export default {
    name: "CityWarning",
    components: {
      DatePicker,
    },
    data() {
      return {
        warningType: "暴雨",
        warningTypes: [
          "暴雨",
          "雷雨大风",
          "雷电",
          "冰雹",
          "暴雪",
          "大风",
          "大雾",
          "霾",
          "综合",
        ],
        factory: "ts",
        factories: [
          { label: "ts", value: "预报准确率" },
          { label: "leadtime", value: "预警提前量" },
          { label: "zh", value: "综合成绩" },
        ],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        tableData: [],
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        facTitle: '预报质量'
      };
    },
    created() {
      for (let i = 0; i < this.warningTypes.length; i++) {
        let data = {
          type: this.warningTypes[i],
          precision: "66%",
          lead: "",
          score: "",
        };
        this.tableData.push(data);
      }
      this.$nextTick(() => {
        this.initEcharts();
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        // this.initMap()
      });
    },
    methods: {
      initEcharts() {
        let options = {
          chart: {
            type: "column",
            backgroundColor: "#F8F8F8",
          },
          credits: {
            enabled: false,
          },
          colors: ["#88B5EB"],
          title: {
            text: "",
          },
          legend: {
            enabled: false
          },
          xAxis: {
            categories: [
              "长沙",
              "株洲",
              "湘潭",
              "衡阳",
              "岳阳",
              "张家界",
              "娄底",
              "郴县",
              "益阳",
              "邵阳",
              "永州",
              "怀化",
              "湘西土家族自治州",
            ],
            crosshair: true,
          },
          yAxis: {
            min: 0,
            title: {
              text: "",
            },
          },
          tooltip: {
            headerFormat:
              '<span style="font-size:10px"><b>{point.key}:{point.y:.1f}</b></span>',
            pointFormat: "",
            footerFormat: "",
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
          series: [
            {
              name: "",
              data: [
                3.2,
                3.1,
                3.0,
                2.9,
                2.8,
                2.7,
                3.1,
                3.0,
                2.8,
                3.3,
                2.9,
                3.1,
                2.6,
              ],
            },
          ],
        };
        Highcharts.chart("bottom-highcharts", options);
      },
      initMap() {
        let myStyle = {
          color: '#719ED5',
          weight: 1.5,
          fillColor: '#C6DBF5',
          fillOpacity: 1
        }
        let options = {
          zoomControl: false,
          attributionControl: false,
          center: [27.4, 111.5],
          zoom: 6
        }
        let map = L.map('map', options);
        map.fitBounds([
          [30.75835871256449, 110.98685778410079],
          [23.772777722631233, 111.60223460743953]
        ])
        let divIcon = L.divIcon({className: 'divIcon'});
        let divIcon2 = L.divIcon({className: 'divIcon2'});
        function onEachFeature(feature, layer) {
          // L.marker({
          //   lon: feature.properties.center[0],
          //   lat: feature.properties.center[1]
          // }, {icon: divIcon2}).addTo(map)
          layer.on('click', e => {
            L.marker(e.latlng, {icon: divIcon}).addTo(map).bindPopup(feature.properties.name).openPopup()
          })
        }
        L.geoJSON(data, {
          style: feature => {
            let option = {
              color: '#719ED5',
              weight: 1.5,
              fillColor: '#C6DBF5',
              fillOpacity: 1
            }
            if (feature.properties.name === '长沙市') {
              option['fillColor'] = '#78D7FF'
            }
            return option
          },
          pointToLayer: (feature, latlng) => {
            console.log(latlng)
            let myIcon = L.divIcon({
              iconSize: new L.Point(50, 50),
              //iconAnchor:[50, 50],
              className: "divIcon2",
              html: '<span>' +feature.properties.name + '</span>'
            })
            return L.marker(latlng, {icon: myIcon})
          },
          onEachFeature: onEachFeature
        }).addTo(map)
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
      changeType() {

      },
      changeFactory(val) {
        if (val === 'ts') {
          this.facTitle = '预报质量'
        } else if (val === 'leadtime') {
          this.facTitle = '提前量'
        } else {
          this.facTitle = '综合成绩'
        }
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
      },
      changeTimePeriod() {
        this.updateInfo('month')
      },
    },
  };
</script>

<style lang="less">
  .divIcon {

  }

  .divIcon2 {
    width: 2px;
    border: 1px solid red;
    border-radius: 50%;
  }
  .rain-examine-middle {
    .year-select .el-input .el-input__inner {
      width: 90px;
      height: 18px;
      font-size: 12px;
      margin-top: -3px;
      border-radius: 0;
    }
  }

  .rain-examine-bottom {
    margin-bottom: 10px;
    .top {
      width: 100%;
      height: 60%;

      #map {
        float: left;
        background-color: #E6F1F9;
        width: 73%;
        height: 100%;
      }

      .table {
        float: right;
        width: 27%;
        height: 100%;

        .el-table__header tr,
        .el-table__header th {
          background-color: #39a5f8;
          color: #ffffff;
          font-weight: 700;
          /*font-size: 1.2rem;*/
          padding: 0;
          height: 2.5rem;
        }

        .el-table__body tr,
        .el-table__body td {
          color: #8b8b8b;
          padding: 0;
          height: 2.5rem;
        }
      }
    }

    .center {
      width: 100%;
      height: 2%;
    }

    .bottom {
      width: 100%;
      height: 33%;

      .h-10 {
        height: 100%;

        #bottom-highcharts {
          height: 90% !important;
        }
      }
    }
  }
</style>