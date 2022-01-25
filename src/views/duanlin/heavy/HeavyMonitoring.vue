<template>
  <div class="side-content">
    <el-scrollbar style="height: 100%">
      <div class="content">
        <div class="head">
          <date-picker @changeDate="changeDate" :start="start" :end="end"/>

          <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
          <download file-type="heavy"></download>
        </div>
        <hr/>
        <div class="rain-examine-middle">
          <el-menu mode="horizontal">
            <el-menu-item>
              <span>检验指标：</span>
              <el-radio-group v-model="defIndicator" @change="changeIndicator">
                <el-radio-button
                        v-for="item in indItems"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                >{{ item.value }}
                </el-radio-button>
              </el-radio-group>
            </el-menu-item>

            <el-menu-item>
              <span>级别：</span>
              <el-radio-group v-model="regLevel" @change="changeRegLevel">
                <el-radio-button
                        v-for="item in regLevels"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                >{{ item.value }}
                </el-radio-button>
              </el-radio-group>
            </el-menu-item>
          </el-menu>
          <el-menu mode="horizontal" class="heavyelmenu">
            <el-menu-item>
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
            </el-menu-item>
          </el-menu>
        </div>
        <div class="nav-bottom rain-examine-bottom">
          <div id="map"></div>
          <div class="rain-examine-bottom-right">
            <span class="tableTitle">{{title}}</span>
            <el-table
                    id="table"
                    :data="tableData"
                    border
                    height="94%">
              <el-table-column
                      v-for="item in tableHeader"
                      :prop="item.prop"
                      :label="item.label"
                      align="center"
                      min-width="1"></el-table-column>
            </el-table>
          </div>
        </div>
        <div id="heavy-chart" style="height: 300px">

        </div>

      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import * as L from "leaflet";
  import data from "../../../assets/js/hunan";
  import {exportExcelCom, initHeavyChart} from "../../../common/Base";
  import {heavyRainMonitor} from "../../../network/duanlin";
  import Download from "../../../components/downFile/download";

  export default {
    name: "HeavyMonitoring",
    components: {
      Download,
      DatePicker,
    },
    data() {
      return {
        defIndicator: "ts",
        indItems: [
          {label: "ts", value: "TS评分"},
          {label: "far", value: "空报率"},
          {label: "po", value: "漏报率"},
          {label: "pod", value: "命中率"},
          {label: "t", value: "及时性"},
        ],
        regLevel: "area_district",
        regLevels: [
          {label: "area_district", value: "市区县"},
          {label: "area", value: "市级"},
          {label: "district", value: "区县"},
          {label: "country", value: "乡镇"}
        ],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        // start: '2021-05-01',
        end: moment(Date.now()).format('YYYY-MM-DD'),
        // end: '2021-08-01',
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        tableHeader: [],
        tableData: [],
        data: {},
        map: {},
        hunanLayer: {},
        isInitCity: true,
        area: '长沙市'
      };
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getHeavyMonitor()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '强降水检测警报质量.xlsx'
        return exportExcelCom(document, id, title)
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getHeavyMonitor()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.updateHunanLayer()
        this.getHeavyMonitor()
      },
      changeIndicator() {
        this.updateTableHeader()
        this.renderChart()
      },
      changeRegLevel() {
        this.updateHunanLayer()
        this.getHeavyMonitor()
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YY-M-D');
          let endStr = moment(this.end).format('YY-M-D');
          this.titleTime = startStr + "至" + endStr
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
      initMap() {
        let _this = this
        let baiduCustomMap = new L.tileLayer.baidu({
          layer: 'white-map'
        })
        let options = {
          crs: L.CRS.Baidu,
          zoomControl: false,
          attributionControl: false,
          layers: [baiduCustomMap],
          zoomSnap: 0.1,
          zoom: 10.2,
          minZoom: 4,
          maxZoom: 10,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          inertia: false,
          dragging: false,
          center: [27.4, 111.5],
        }
        _this.map = L.map('map', options);
        _this.map.fitBounds([[30.25, 108.6], [24.5, 114.4]])
        _this.updateHunanLayer()
      },
      updateHunanLayer() {
        let _this = this
        _this.hunanLayer = L.geoJSON(data, {
          style: {
              color: '#88AFDE',
              fillOpacity: 1,
              fillColor: '#C6DBF5',
              weight: 1
            },
          onEachFeature: onEachFeature
        }).addTo(_this.map)
        function highlightFeature(e) {
          let layer = e.target;
          if (typeof layer !== 'undefined') {
            layer.setStyle({
              weight: 1,
              color: '#3C8DC4',
              fillOpacity: 1
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          }
        }

        function resetHighlight(e) {
          _this.hunanLayer.setStyle({
            color: '#88AFDE'
          })
        }

        function onEachFeature(feature, layer) {
          let cityName = feature.properties.name;
          let citylnglat = feature.properties.centroid;
          if (_this.isInitCity) {
            let iconAnchor = [10, 10];
            let cityIcon = L.divIcon({
              className: 'cityname',
              iconAnchor: iconAnchor,
              html: "<div><span>" + cityName + "</span></div>"
            });
            L.marker([citylnglat[1], citylnglat[0]], {icon: cityIcon, interactive: false}).addTo(_this.map);
          }
          if (_this.regLevel === 'area_district' || _this.regLevel === 'area') return
          if (cityName === _this.area) {
            layer.setStyle({fillColor: '#65A4F0'})
          }
          function click() {
            return function (e) {
              _this.hunanLayer.setStyle({fillColor: '#C6DBF5'})
              layer.setStyle({fillColor: '#65A4F0'})
              _this.area = e.target.feature.properties.name
              _this.getHeavyMonitor()
            }
          }

          layer.on({
            click: click(),
            mouseover: highlightFeature,
            mouseout: resetHighlight
          });
        }
        if (_this.isInitCity) {
          _this.isInitCity = false
        }

      },
      updateTableHeader() {
        let ind = this.defIndicator
        let tableHeader = []
        tableHeader.push({prop: this.regLevel, label: '区域'})
        if (ind === 'ts') {
          tableHeader.push({prop: 'ts', label: 'TS评分'})
        } else if (ind === 'far') {
          tableHeader.push({prop: 'far', label: '空报率'})
        } else if (ind === 'po') {
          tableHeader.push({prop: 'po', label: '漏报率'})
        } else if (ind === 'pod') {
          tableHeader.push({prop: 'pod', label: '命中率'})
        } else {
          tableHeader.push({prop: 't', label: '及时性'})
        }
        this.tableHeader = tableHeader
      },
      renderChart() {
        let {data, defIndicator, title, regLevel} = this
        let regArr = data[regLevel]
        let forecasters = data['forecaster']
        let chartData = {}
        let seriesData = []
        let series = []
        let regs = []
        regArr.map(item => regs.push(item[regLevel]))
        for (let reg of regs) {
          let res = regArr.find(obj => obj[regLevel] === reg);
          if (typeof res === "undefined") continue
          let item = {}
          item.name = res[regLevel]
          item.y = res[defIndicator]
          item.drilldown = res[regLevel]
          seriesData.push(item)
          let seriesItem = {}
          seriesItem.id = reg
          let data = []
          let regForecasters = forecasters.filter(obj => obj[regLevel] === reg);
          for (let f of regForecasters) {
            let dataItem = {}
            dataItem.name = f['forecaster']
            dataItem.y = f[defIndicator]
            data.push(dataItem)
          }
          data.sort((a, b) => b.y - a.y)
          seriesItem.data = data
          series.push(seriesItem)
        }
        chartData.data = seriesData
        chartData.series = series
        initHeavyChart(chartData, title, regLevel, 'heavy-chart');
      },
      getHeavyMonitor() {
        let loading = this.openLoading('.rain-examine-bottom-right');
        heavyRainMonitor(this.start, this.end, this.area, this.regLevel).then(res => {
          this.data = res.data
          if (res.data[this.regLevel].length > 1) {
            this.tableData = res.data[this.regLevel]
          } else {
            this.tableData = []
          }
          this.updateTableHeader()
          this.renderChart()
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    computed: {
      title() {
        return "湖南省" + this.titleTime + "强降水监测警报质量"
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.initMap()
        this.getHeavyMonitor()
      });
    },
  };
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .heavyelmenu {
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

  .nav-bottom {
    display: flex;
    background-color: #ffffff;

    #map {
      /*background-color: #F8F8F8;*/
      width: 69%;
      height: 500px;
      margin-right: 1%;
    }

    .rain-examine-bottom-right {
      width: 30%;
      height: 500px;

      .tableTitle {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #46c6ef;
        color: #fff;
        width: 100%;
        height: 6%;
        font-size: 1.4rem;
        font-weight: 700;
      }

      .el-table__header tr,
      .el-table__header th {
        color: #005fb7;
        font-weight: 700;
        font-size: 1.2rem;
        padding: 0.4rem 0;
      }

      .el-table__body tr,
      .el-table__body td {
        color: #8b8b8b;
        padding: 0;
        height: 40px;
      }
    }

    .el-table tbody {
      tr:nth-child(2n + 1) {
        background-color: #f8f8f8 !important;
      }
    }
  }
</style>