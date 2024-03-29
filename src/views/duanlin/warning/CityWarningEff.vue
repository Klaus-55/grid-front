<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker @changeDate="changeDate" :start="start" :end="end"/>
      </div>
      <hr/>
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="warningType" @change="changeType">
              <el-radio-button
                      v-for="item in warningTypes"
                      :label="item"
                      :key="item">{{item}}</el-radio-button>
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
        <div class="top">
          <div id="map"></div>
          <div class="table">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    stripe
                    border
                    height="100%">
              <el-table-column
                      v-for="item in tableHeader"
                      :prop="item.prop"
                      :label="item.label"
                      align="center"/>
            </el-table>
          </div>
        </div>
        <div class="center"></div>
        <div class="bottom">
          <div id="bottom-highcharts"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import data from "../../../assets/js/hunan"
  import * as L from "leaflet"
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import {initCityEcharts} from "../../../common/Base";
  import {cityWarningEff, districtWarningEff} from "../../../network/duanlin";
  require('proj4')
  require('proj4leaflet')
  require('../../../assets/plugs/map/tileLayer.baidu')

  export default {
    name: "CityWarningEff",
    components: {
      DatePicker,
    },
    data() {
      return {
        warningType: "暴雨",
        warningTypes: ["暴雨", "雷雨大风"],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        tableHeader: {},
        tableData: [],
        mapData: {},
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        facTitle: '有效性评分',
        data: {},
        map: {},
        hunanLayer: {},
        layerGroup: [],
        title: '',
        isInitCity: true
      };
    },
    methods: {
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
          // dragging: false,
          center: [27.4, 111.5],
        }
        _this.map = L.map('map', options);
        _this.updateHunanLayer()
      },
      fitBounds(map) {
        let hnbounds = L.latLngBounds(new L.LatLng(30.25, 108.65), new L.LatLng(24.5, 114.4));
        map.invalidateSize();
        map.fitBounds(hnbounds);
      },
      updateHunanLayer() {
        let _this = this
        _this.hunanLayer = L.geoJSON(data, {
          style: feature => {
            return {
              color: '#88AFDE',
              fillOpacity: 1,
              fillColor: '#C6DBF5',
              weight: 1
            }
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
          if (cityName === '长沙市') {
            layer.setStyle({fillColor: '#78D7FF'})
            _this.updatePopup(layer.feature)
          }
          function click() {
            return function (e) {
              _this.hunanLayer.setStyle({fillColor: '#C6DBF5'})
              layer.setStyle({fillColor: '#78D7FF'})
              _this.updatePopup(e.target.feature)
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
        this.fitBounds(this.map)
      },
      async updatePopup(feature) {
        let area = feature.properties.name;
        await this.districtWarningEff(area)
        let content = "<span>" + this.titleTime + "</span><br>" +
          "<span style='font-weight: 700;color: #0591DB'>" + this.warningType + "</span><br>"
        content += "<span>预报得分：" + (this.mapData['score'] == null ? '/' : this.mapData['score'] + '') + "</span>"
        let centroid = feature.properties.centroid;
        L.popup()
          .setLatLng([centroid[1], centroid[0]])
          .setContent(content)
          .openOn(this.map)
      },
      updateTableHeader() {
        let tableHeader = []
        tableHeader.push({prop: 'district', label: '地区'})
        tableHeader.push({prop: 'score', label: '预报得分'})
        this.tableHeader = tableHeader
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
      getWarningEff() {
        let title = '湖南省' + this.titleTime + this.warningType + '预警信号' + this.facTitle
        if (this.title !== '') title = '湖南省' + this.title + this.warningType + '预警信号' + this.facTitle
        cityWarningEff(this.start, this.end, this.warningType).then(res => {
          this.data = res.data
          initCityEcharts(this.data, title)
        }).catch(err => {
          console.log(err)
        })
      },
      async districtWarningEff(area) {
        await districtWarningEff(this.start, this.end, this.warningType, this.factory, area).then(res => {
          this.tableData = res.data.tableData
          this.mapData = res.data.mapData
        }).catch(err => {
          console.log(err)
        })
      },
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateHunanLayer()
        this.title = this.start + '~' + this.end
        this.getWarningEff()
      },
      changeType() {
        this.updateHunanLayer()
        this.getWarningEff()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.updateHunanLayer()
        this.getWarningEff()
      },
      changeTimePeriod() {
        this.title = ''
        this.updateInfo('month')
        this.updateHunanLayer()
        this.getWarningEff()
      },
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.initMap()
        this.updateTableHeader()
        this.getWarningEff()
      });
    },
  };
</script>

<style lang="less">

  .cityname {
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    width: auto !important;
    height: auto !important;
  }
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
      background-color: white;
    }

    .bottom {
      width: 100%;
      height: 33%;

      .h-10 {
        height: 100%;

        #bottom-highcharts {
          height: 100%;
        }
      }
    }

    .bottom {
      width: 100%;
      height: 40%;
      #bottom-highcharts {
        height: 100%;
      }
    }
  }
</style>