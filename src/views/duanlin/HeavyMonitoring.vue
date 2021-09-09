<template>
  <div class="body-content">
    <side-bar :items="items"/>
    <div class="side-content">
      <div class="content">
        <div class="head">
          <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        </div>
        <hr/>
        <div class="rain-examine-middle">
          <el-menu mode="horizontal">
            <el-menu-item>
              <span>检验指标：</span>
              <el-radio-group v-model="defIndicator" @change="changeIndicator">
                <el-radio-button
                        v-for="item in indItems"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                >{{ item.label }}
                </el-radio-button
                >
              </el-radio-group>
            </el-menu-item>
<!--            <el-menu-item>-->
<!--              <span>地区级别：</span>-->
<!--              <el-radio-group v-model="defLevel">-->
<!--                <el-radio-button-->
<!--                        v-for="item in levelItems"-->
<!--                        :key="item.value"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value"-->
<!--                >{{ item.label }}-->
<!--                </el-radio-button-->
<!--                >-->
<!--              </el-radio-group>-->
<!--            </el-menu-item>-->
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
                                 :disabled="item.disabled">{{item.name}}</el-radio-button>>
              </el-radio-group>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="nav-bottom rain-examine-bottom">
          <div id="map"></div>
          <div class="rain-examine-bottom-right">
            <span class="tableTitle">{{ tableTitle }}</span>
            <el-table
                    :data="tableData"
                    border
                    height="94%">
              <el-table-column
                      prop="area"
                      label="区域"
                      align="center"
                      min-width="1"
              >
              </el-table-column>
              <el-table-column
                      prop="ts"
                      label="TS评分"
                      align="center"
                      min-width="1"
              >
              </el-table-column>
              <el-table-column
                      prop="empty"
                      label="空报率"
                      align="center"
                      min-width="1"
              >
              </el-table-column>
              <el-table-column
                      prop="fail"
                      label="漏报率"
                      align="center"
                      min-width="1"
              >
              </el-table-column>
              <el-table-column
                      prop="hit"
                      label="命中率"
                      align="center"
                      min-width="1"
              >
              </el-table-column>
              <el-table-column
                      prop="intime"
                      label="及时性"
                      align="center"
                      min-width="1"
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
  import MenuList from "../../components/menu/MenuList";
  import DatePicker from "../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../common/utils";
  import * as L from "leaflet";
  import data from "../../assets/js/hunan";

  export default {
    name: "HeavyMonitoring",
    components: {
      "side-bar": MenuList,
      DatePicker,
    },
    data() {
      return {
        conName: "provincial-warning",
        items: [
          {
            img: require("assets/img/wms.png"),
            text: "强降水监测警报",
            index: "pw",
          },
        ],
        defIndicator: "TS评分",
        indItems: [
          {label: "TS评分", value: "ts"},
          {label: "空报率", value: "kb"},
          {label: "漏报率", value: "lb"},
          {label: "命中率", value: "mz"},
          {label: "及时性", value: "js"},
        ],
        levelItems: [
          {label: "市级", value: "city"},
          {label: "县级", value: "county"},
        ],
        defLevel: ["市级"],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        tableTitle: "湖南省2020年1月强降水监测警报质量",
        tableData: [],
        map: {},
        hunanLayer: {},
        isInitCity: true
      };
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
      },
      changeTimePeriod() {
        this.updateInfo('month')
      },
      changeIndicator() {
      },
      changItems(item) {
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
          if (cityName === '长沙市') {
            layer.setStyle({fillColor: '#65A4F0'})
          }
          function click() {
            return function (e) {
              _this.hunanLayer.setStyle({fillColor: '#C6DBF5'})
              layer.setStyle({fillColor: '#65A4F0'})
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
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.initMap()
      });
    },
  };
</script>

<style lang="less">
  @import "../../assets/less/common";

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
      height: 100%;
      margin-right: 1%;
    }

    .rain-examine-bottom-right {
      width: 30%;
      height: 100%;

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