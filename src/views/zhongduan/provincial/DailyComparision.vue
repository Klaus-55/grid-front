<template>
  <div class="side-content">
    <div class="content">
      <div class="daily-comparision-head">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>选择日期：</span>
            <el-date-picker
                    v-model="dateValue"
                    @change="changDate"
                    type="date"
                    :pickerOptions="pickerOptions"
                    placeholder="选择日期">
            </el-date-picker>
            <div class="add-button">
              <el-button class="el-icon-arrow-up" @click="changDate('inc')"></el-button>
              <el-button class="el-icon-arrow-down" @click="changDate('dec')"></el-button>
            </div>
          </el-menu-item>
          <el-menu-item>
            <span>选择要素：</span>
            <el-select v-model="facValue" @change="changeFacValue">
              <el-option
                      v-for="item in facOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-menu-item>
          <el-menu-item>
            <span>选择时段：</span>
            <el-select v-model="intervalValue" @change="changeIntervalValue">
              <el-option
                      v-for="item in intervalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-menu-item>
        </el-menu>
      </div>
      <hr>
      <div class="daily-comparision-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>站点类型：</span>
            <el-radio-group v-model="type" @change="changeObtType">
              <el-radio-button label="国家站"></el-radio-button>
              <el-radio-button label="骨干站"></el-radio-button>
              <el-radio-button label="自动站"></el-radio-button>
              <el-radio-button label="格点"></el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>时次：</span>
            <el-radio-group v-model="ftvalue" @change="changeFtvalue">
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <el-checkbox v-model="isShowGribColor">颜色</el-checkbox>
            <el-checkbox v-model="isShowGribValue">数值</el-checkbox>
            <el-checkbox v-model="isDiffValue">差值</el-checkbox>
            <el-checkbox v-model="isShowObtname">站名</el-checkbox>
            <el-checkbox v-model="isShowLegend">图例</el-checkbox>
            <!--            <el-checkbox v-model="isShowDetailed">详情</el-checkbox>-->
          </el-menu-item>
          <el-menu-item>
            <span>放大：</span>
            <el-slider
                    v-model="sliderValue"
                    :show-tooltip="false"
                    :step="20">
            </el-slider>
          </el-menu-item>
          <el-menu-item>
            <el-button type="primary" size="mini" @click="backToCenter">居中地图</el-button>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="daily-comparision-bottom">
        <div id="left-map">
        </div>
        <div class="left-legend" v-show="isShowLegend">
          <div class="panel-title" v-html="leftPanelTitle"></div>
          <div class="panel-article" v-html="leftLegendHtml">

          </div>
        </div>
        <div class="left-info-panel">
          {{leftModelName + timeRangeHtml}}
        </div>
        <div id="right-map"></div>
        <div class="right-legend" v-show="isShowLegend">
          <div class="panel-title" v-html="rightPanelTitle"></div>
          <div class="panel-article" v-html="rightLegendHtml">

          </div>
        </div>
        <div class="right-info-panel">
          {{modelName + timeRangeHtml}}
        </div>
        <div class="model-select model-select-right">
          <el-select v-model="model" placeholder="请选择" :popper-append-to-body="false" @change="changeModel">
            <el-option
                    v-for="item in models"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="model-select model-select-left">
          <el-select v-model="leftModel" placeholder="请选择" :popper-append-to-body="false" @change="changeLeftModel">
            <el-option
                    v-for="item in leftModels"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="model-select model-select-fm" v-show="model === 'fm'">
          <el-select v-model="fm" placeholder="请选择" :popper-append-to-body="false" @change="changeFm">
            <el-option
                    v-for="item in fms"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="result-content" v-html="resultContent" v-show="isShowRsCon">
        </div>
<!--        <div class="result-content">-->
<!--          <tbody style='border:1px solid black'>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>≤1℃个数</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>count1</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>≤2℃个数</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>count2</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>总数</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>total</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>≤1℃预报准确率</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>ar1</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>≤2℃预报准确率</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>ar2</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>均方根误差</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>rmse</td>-->
<!--          </tr>-->
<!--          <tr style='border:1px solid black'>-->
<!--            <td style='text-align: center;font-size:15px;border:1px solid black'>平均绝对误差</td>-->
<!--            <td style='padding-left: 5px;font-size:15px;border:1px solid black'>mae</td>-->
<!--          </tr>-->
<!--          </tbody>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import * as PIXI from 'pixi.js'
  import 'leaflet-pixi-overlay';
  import L from "leaflet";
  import $ from "jquery";
  import moment from "momnet";
  import data from "../../../assets/js/hunan"
  import {liveObtData, wfData, chartData, liveGribData} from "../../../network/zhongduan";
  import * as echarts from "echarts"

  // require('../../../assets/libs/pixi/pixi.js')
  // require('../../../assets/plugs/PixiOverlay/L.PixiOverlay.js')
  require('proj4')
  require('proj4leaflet')
  require('../../../assets/plugs/map/tileLayer.baidu')
  // require('../../../assets/plugs/map/rbush')
  require('../../../assets/plugs/map/Leaflet.LayerGroup.Collision')

  export default {
    name: "DailyComparision",
    data() {
      return {
        dateValue: new Date(moment().subtract(2, 'days').format('YYYY/MM/DD')),
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        facValue: 'TMAX',
        //预报要素
        facOptions: [
          {value: 'ER03', label: '逐3小时降雨'},
          {value: 'ER12', label: '逐12小时降雨'},
          {value: 'ER24', label: '逐24小时降雨'},
          {value: 'TMP', label: '逐3小时温度'},
          {value: 'TMAX', label: '逐24小时最高温度'},
          {value: 'TMIN', label: '逐24小时最低温度'},
          {value: 'EDA10', label: '逐3小时风'},
        ],
        intervalValue: '0-24',
        type: '国家站',
        ftvalue: '08',
        isShowGribColor: true,
        isShowGribValue: true,
        isDiffValue: true,
        isShowObtname: false,
        isShowLegend: true,
        isShowDetailed: true,
        sliderValue: 80,
        models: [
          {value: 'ECMT', label: '欧洲中心'},
          {value: 'GGFS', label: 'GRAPES_GFS'},
          {value: 'G3KM', label: 'GRAPES_3KM'},
          {value: 'GZHR', label: '华南模式'},
          {value: 'SHMR', label: '华东模式'},
          {value: 'BABJ', label: '央台预报'},
          {value: 'SOTS', label: '省台(客观)'},
          {value: 'PFSN', label: '省台(融合前)'},
          {value: 'BECS', label: '省台(融合后)'},
          {value: 'fm', label: '四种模式'},
        ],
        model: 'BECS',
        modelName: '省台(融合后)',
        leftModels: [
          {value: 'LIVE', label: '实况'},
          {value: 'ECMT', label: '欧洲中心'},
          {value: 'GGFS', label: 'GRAPES_GFS'},
          {value: 'G3KM', label: 'GRAPES_3KM'},
          {value: 'GZHR', label: '华南模式'},
          {value: 'SHMR', label: '华东模式'},
          {value: 'BABJ', label: '央台预报'},
          {value: 'SOTS', label: '省台(客观)'},
          {value: 'PFSN', label: '省台(融合前)'},
          {value: 'BECS', label: '省台(融合后)'}
        ],
        leftModel: 'LIVE',
        leftModelName: '实况',
        fms: [
          {value: 'SOTS', label: '省台客观'},
          {value: 'PFSN', label: '省台指导'},
          {value: 'BECS', label: '地市订正'},
          {value: 'BABJ', label: '中央台'},
          {value: 'ECMT', label: '欧洲中心'}
        ],
        fm: 'PFSN',
        fmName: '省台指导',
        liveData: [],
        leftMap: {},
        rightMap: {},
        leftPanelTitle: '温度(℃)',
        rightPanelTitle: '误差(℃)',
        getDataColor: '',
        getTooltipContent: '',
        openTooltips: [],
        popups: [],
        obtpopups: {
          obt: {},
          grib: {}
        },
        leftLegendHtml: '',
        rightLegendHtml: '',
        resultContent: '',
        isShowRsCon: true,
        data: [],
        uppperLeft: [],
        lowerright: [],
        width: 0,
        height: 0,
        stepx: 0,
        stepy: 0,
        timeRangeHtml: '',
        wfMaps: [],
        scale: 5,
        hunanLayer: {}
      }
    },
    methods: {
      getIntervalOpt(wfhours, interval) {
        let optionArr = [];
        for (let i = 0; i < wfhours; i += interval) {
          let value = i + '-' + (i + interval);
          let label = '';
          if (this.instantFac()) {
            label = (i + interval) + '时';
          } else {
            label = value + '时';
          }
          optionArr.push({value: value, label: label})
        }
        return optionArr;
      },
      // 是否是瞬时要素，瞬时要素的时间不显示范围只显示瞬时时间。
      instantFac() {
        if (this.facValue === 'TMP' || this.facValue === 'EDA10') {
          return true;
        } else {
          return false;
        }
      },
      changDate(val) {
        if (val === 'inc') {
          this.dateValue = moment(this.dateValue).add(1, 'd')
        } else if (val === 'dec') {
          this.dateValue = moment(this.dateValue).add(-1, 'd')
        }
        this.submit()
      },
      changeFacValue(val) {
        if (val === 'ER03' || val === 'TMP' || val === 'EDA10') {
          this.intervalValue = '0-3';
        } else if (val === 'ER12') {
          this.intervalValue = '0-12';
        } else {
          this.intervalValue = '0-24';
        }
        this.submit()
      },
      changeIntervalValue() {
        this.submit()
      },
      changeObtType() {
        this.submit()
      },
      changeFtvalue() {
        this.submit()
      },
      changeModel(val) {
        let obj = this.models.find(item => val === item.value);
        if(val === 'fm') {
          this.modelName = this.fmName
          this.rightMap.dataSrcCode = this.fm
        } else {
          this.modelName = obj.label
          this.rightMap.dataSrcCode = val
        }
        this.renderMap(this.rightMap)
      },
      changeLeftModel(val) {
        let obj = this.leftModels.find(item => val === item.value);
        this.leftModelName = obj.label
        this.leftMap.dataSrcCode = this.leftModel
        this.renderMap(this.leftMap)
      },
      changeFm(val) {
        let obj = this.fms.find(item => val === item.value);
        this.modelName = obj.label
        this.rightMap.dataSrcCode = val
        this.renderMap(this.rightMap)
      },
      async getLiveObtData() {
        // 如果是国家站的降水，那么可以使用er3， er12字段
        // 如果不是，降水，逐24温度都要后台计算。
        let url = '/getLiveObtData';
        // 这些要素都无法直接从站点实况表中获取，需要通过自己累加实现；
        if (this.isNeedCal()) {
          url = '/getLiveObtData_cal';
        }
        let data = this.getObtLiveReqParam();
        await liveObtData(url, data).then(res => {
          // console.log(res.data)
          this.liveData = res.data
        })
      },
      isNeedCal() {
        let liveFacname = this.getLiveObtFacname();
        let calFac = ['tem_max_24h', 'tem_min_24h', 'pre_3h', 'pre_12h', 'pre_24h', 'er3', 'er12', 'er24'];
        return calFac.indexOf(liveFacname) > -1;
      },
      getLiveObtFacname() {
        let wfFacname = this.facValue;
        let isCountryObt = this.type === '国家站';
        switch (wfFacname) {
          case 'TMP':
            return 'tem';
          case 'TMAX':
            return 'tem_max_24h';
          case 'TMIN':
            return 'tem_min_24h';
          case 'ER03':
            return isCountryObt ? 'er3' : 'pre_3h';
          case 'ER12':
            return isCountryObt ? 'er12' : 'pre_12h';
          case 'ER24':
            return isCountryObt ? 'er24' : 'pre_24h';
          case 'EDA10':
            return 'win_s_inst';
        }
      },
      getObtLiveReqParam() {
        let ddatetime;
        let obtFacname = this.getLiveObtFacname();

        //预报时段数组
        let intervalArr = this.intervalValue.split('-');
        //预报时次预报时段相加
        let foreHours = Number(intervalArr[1]) + Number(this.ftvalue);
        //小时数据
        let mddatetime = moment(this.dateValue).add(foreHours, 'hours');
        ddatetime = mddatetime.format('YYYYMMDDHH');

        let obtType;
        let type = this.type;
        switch (type) {
          case '国家站':
            obtType = 'and b.level = \'1\'';
            break;
          case '自动站':
            obtType = 'and b.level = \'2\'';
            break;
          case '骨干站':
            obtType = 'and b.isbbstation2 = true';
            break;
          case '自选站':
            obtType = 'and b.isolstation = true';
        }

        let begin_ddatetime;
        let cal_facname;
        let cal_fun;
        switch (obtFacname) {
          case 'tem_max_24h':
            cal_fun = 'max(tem_max)';
            cal_facname = 'tem_max';
            begin_ddatetime = mddatetime.subtract(24, 'hours').format('YYYYMMDDHH');
            break;
          case 'tem_min_24h':
            cal_fun = 'min(tem_min)';
            cal_facname = 'tem_max';
            begin_ddatetime = mddatetime.subtract(24, 'hours').format('YYYYMMDDHH');
            break;
          case 'pre_3h':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(3, 'hours').format('YYYYMMDDHH');
            break;
          case 'pre_12h':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(12, 'hours').format('YYYYMMDDHH');
            break;
          case 'pre_24h':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(24, 'hours').format('YYYYMMDDHH');
            break;
          case 'er3':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(3, 'hours').format('YYYYMMDDHH');
            break;
          case 'er12':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(12, 'hours').format('YYYYMMDDHH');
            break;
          case 'er24':
            cal_fun = 'sum(pre_1h)';
            cal_facname = 'pre_1h';
            begin_ddatetime = mddatetime.subtract(24, 'hours').format('YYYYMMDDHH');
            break;
        }
        // console.log({
        //   ddatetime: ddatetime,
        //   obtFacname: obtFacname,
        //   obtType: obtType,
        //   "begin_ddatetime": begin_ddatetime,
        //   "cal_facname": cal_facname,
        //   "cal_fun": cal_fun
        // });
        return {
          ddatetime: ddatetime,
          obtFacname: obtFacname,
          obtType: obtType,
          "begin_ddatetime": begin_ddatetime,
          "cal_facname": cal_facname,
          "cal_fun": cal_fun
        };
      },
      getWFData(map) {
        let data = this.getWFRequestData(map);
        wfData(data).then(res => {
          if (res.code === 1 && res["data"].length > 0) {
            this.renderGribValue(res['data'][0], map);
          } else {
            map.clearAll();
            this.$message.warning('查无该模式格点预报数据');
          }
        }).catch(err => {
          console.log(err)
        })
      },
      renderGribValue(wfData, map) {
        this.resolveOrginData(wfData, map)
        if (this.type === '格点') { //格点
          //resolveGribToObt();
          this.renderColorOverlay(map);
        } else {  //站点
          this.resolveGribToObt()
          this.renderObtValue(map, this.data, 'zd');
        }
      },
      renderColorOverlay(map) {
        let _this = this
        // pixi初始化部分
        var pixiContainer = new PIXI.Container();
        var graphics = new PIXI.Graphics();
        pixiContainer.addChild(graphics);

        // 标记部分
        var firstDraw = true;
        var preZoom;
        var scale = _this.scale;

        //格点文本的颜色
        var textStyle;
        var baseTextStyle = {
          fontSize: 1,
          lineHeiht: 0,
          align: 'center'
        }
        if (this.isShowGribColor) {
          textStyle = $.extend(true, {fill: '#ffffff'}, baseTextStyle);
        } else {
          textStyle = $.extend(true, {fill: '#000000'}, baseTextStyle);
        }

        let legendContent = {}

        var colorOverlay = L.pixiOverlay(function (utils) {
          var container = utils.getContainer();
          var renderer = utils.getRenderer();
          var projected = utils.latLngToLayerPoint;
          var zoom = utils.getMap().getZoom();
          // var scale = utils.getScale();

          var tempPosition = _this.uppperLeft.slice(0);

          // 里面的图像默认会使用 * scale 进行处理保证图像的缩放, 但是如果我们不需要缩放图像, 那么我们可以对图像进行 / scale那么图像始终会保持原来的尺寸
          //  || preZoom !== zoom
          if (firstDraw) {
            graphics.clear();

            console.time('newtext');
            for (var y = 0; y < _this.height; y++) {
              tempPosition[1] = _this.uppperLeft[1];
              for (var x = 0; x < _this.width; x++) {
                //获得当前网格数据
                var gribData = _this.getGribDataByXY(x, y);
                // 排除异常值, 降水比较特殊的,值比较大
                if (gribData > -998 && gribData < 998) {
                  //稀疏功能
                  if (scale === 1 || x % scale === 0 && y % scale === 0) {
                    var color = _this.getDataColor(gribData, legendContent);
                    //----------------------
                    graphics.beginFill(color, 0.9);
                    var widthHeigh = _this.getGribWidthHeigh(projected, tempPosition, scale);
                    var projectedPaintPos = projected(tempPosition);

                    if (_this.isShowGribColor) {
                      graphics.drawRect(projectedPaintPos.x, projectedPaintPos.y, widthHeigh[0], widthHeigh[1]);
                    }

                    graphics.endFill();

                    if (_this.isShowGribValue) {
                      var text = new PIXI.Text(Number(gribData).toFixed(1), textStyle);

                      text.x = projectedPaintPos.x + 2;
                      text.y = projectedPaintPos.y + widthHeigh[1] / 4;
                      text.height = 4 * scale;
                      text.scale.x = text.scale.y;
                      pixiContainer.addChild(text);
                    }
                  }
                }

                tempPosition[1] += _this.stepx;
              }
              tempPosition[0] -= _this.stepy;
            }

            console.timeEnd('newtext');
          }
          if (firstDraw) {
            map.clearAll()
            _this.renderLegend(map, legendContent);
          }
          firstDraw = false;

          preZoom = zoom;

          renderer.render(container);
        }, pixiContainer);

        colorOverlay.addTo(map);

        map.colorOverlay = colorOverlay;
      },
      getGribDataByXY(x, y) {
        let index = y * this.width + x;
        return this.data[index];
      },
      getGribWidthHeigh(projected, uppperLeft, scale) {
        let projectedUpperLeft = projected(uppperLeft);
        let lowerRight = [Number(uppperLeft[0]) - this.stepy * scale, Number(uppperLeft[1]) + this.stepx * scale];
        let projectedLowerRight = projected(lowerRight);
        return [projectedLowerRight.x - projectedUpperLeft.x, projectedLowerRight.y - projectedUpperLeft.y];
      },
      resolveOrginData(originalData, map) {
        if (map.dataSrcCode !== 'LIVE') {
          //解析
          originalData = this.parseOriginalData(originalData);

          //是否差值
          if (this.type === '格点' && this.isDiffValue) {
            if (this.liveData) {
              originalData = this.subtractGribData(this.liveData, originalData);
            } else {
              map.clearAll()
              return;
            }
          }
        } else {
          // resolveResult(undefined, wfMap)
          if (!this.liveData) {
            map.clearAll()
            return;
          }
        }
        this.data = eval(originalData["data"]["value"]);
        this.uppperLeft.push(originalData["upperleft"].y);
        this.uppperLeft.push(originalData["upperleft"].x);
        this.lowerright.push(originalData["lowerright"].y);
        this.lowerright.push(originalData["lowerright"].x);
        this.width = originalData["width"];
        this.height = originalData["height"];
        this.stepx = originalData["stepx"];
        this.stepy = originalData["stepy"];
      },
      subtractGribData(liveData, wfData) {
        let retData = [];
        let cz;
        let count1 = 0;
        let count2 = 0;
        let rmse = 0;
        let mae = 0;
        let liveGribData = eval(liveData["data"]["value"]);
        let wfGribData = eval(wfData["data"]["value"]);
        for (let i = 0; i < liveGribData.length; i++) {
          cz = (Number(wfGribData[i]) - Number(liveGribData[i])).toFixed(1);
          retData.push(cz);
          if (cz <= 1) count1++;
          if (cz <= 2) count2++;
        }
        for (let n in retData) {
          rmse += (retData[n] - retData[0]) * (retData[n] - retData[0]);
          mae += Math.abs(retData[n]);
        }
        wfData["data"]["value"] = retData;
        let resultTable = "<span>检验结果</span>";

        if (this.facValue == 'TMP' || this.facValue == 'TMAX' || this.facValue == 'TMIN') {
          resultTable += "<div>" + "<span>≤1℃个数：</span>" + "<span>" + count1 + "</span>" + "</div>" +
            "<div>" + "<span>≤2℃个数：</span>" + "<span>" + count2 + "</span>" + "</div>" +
            "<div>" + "<span>≤1℃预报准确率：</span>" + "<span>" + (count1 * 100 / liveGribData.length).toFixed(2) + "</span>" + "</div>" +
            "<div>" + "<span>≤2℃预报准确率：</span>" + "<span>" + (count2 * 100 / liveGribData.length).toFixed(2) + "</span>" + "</div>" +
            "<div>" + "<span>均方根误差：</span>" + "<span>" + Math.sqrt(rmse / retData.length).toFixed(2) + "</span>" + "</div>" +
            "<div>" + "<span>平均绝对误差：</span>" + "<span>" + (mae / retData.length).toFixed(2) + "</span>" + "</div>"
          this.isShowRsCon = true
          this.resultContent = resultTable
        } else {
          this.isShowRsCon = false
        }
        return wfData;
      },
      parseOriginalData(data) {
        let v = this.facValue;
        if (v === 'TMP' || v === 'TMAX' || v === 'TMIN') {
          return this.convertTempArray(data);
        } else if (v === 'EDA10') {
          return this.convertWindArray(data);
        } else {
          return data;
        }
      },
      convertTempArray(data) {
        let retData = [];
        let gribData = eval(data["data"]["value"]);
        for (let i = 0; i < gribData.length; i++) {
          retData.push(Number(gribData[i]) - 273.15);
        }
        data["data"]["value"] = retData;
        return data;
      },
      convertWindArray(data) {
        let retData = [];
        let gribDataU = eval(data["data"]["value"]);
        let gribDataV = eval(data["data1"]["value"]);
        for (let i = 0; i < gribDataU.length; i++) {
          let u = gribDataU[i];
          let v = gribDataV[i];
          retData.push(this.convertUVtoWindSpeed(u, v));
        }
        data["data"]["value"] = retData;
        return data;
      },
      convertUVtoWindSpeed(u, v) {
        return Math.sqrt(Math.pow(u, 2) + Math.pow(v, 2));
      },
      resolveGribToObt() {
        let obtFacname = this.getLiveObtFacname();
        let obtWfDataInGrib = [];
        let rmse1 = 0;
        let mae1 = 0;
        let total = 0;
        let count1 = 0;
        let count2 = 0;
        let qy_na = 0;
        let qy_nb = 0;
        let qy_nc = 0;
        let qy_nd = 0;
        let ybx_na = 0;
        let ybx_nb = 0;
        let ybx_nc = 0;
        let by_na = 0;
        let by_nb = 0;
        let by_nc = 0;
        let x = 0;
        for (let i = 0; i < this.liveData.length; i++) {
          let obt = this.liveData[i];
          let index = this.getIndexBylatlng(obt['grid_lat'], obt['grid_lon']);

          //站点对应的格点数据
          let obtV = obt[obtFacname];
          let gribV = this.data[index];
          let v = gribV - obtV; //vm.isDiffValue ? (gribV - obtV) : gribV;
          let obtWfData = {};
          obtWfData['lat'] = obt['grid_lat'];
          obtWfData['lon'] = obt['grid_lon'];
          obtWfData['obtname'] = obt['obtname'];
          obtWfData['index'] = (index + 1); //语言中的array 索引0开始、postgresql里面的array 索引是1开始
          obtWfData['obtid'] = obt['obtid'];
          obtWfData[obtFacname] = v.toFixed(1);

          if (this.facValue == 'TMP' || this.facValue == 'TMAX' || this.facValue == 'TMIN') {
            if (i == 0) x = obtWfData[obtFacname];
            total++;
            if (Math.abs(obtWfData[obtFacname]) <= 1) count1++;
            if (Math.abs(obtWfData[obtFacname]) <= 2) count2++;
            rmse1 += (obtWfData[obtFacname] - x) * (obtWfData[obtFacname] - x);
            mae1 += Math.abs(obtWfData[obtFacname]);
          }

          if (obtV >= 0.1 && gribV >= 0.1) qy_na++;
          if (obtV < 0.1 && gribV >= 0.1) qy_nb++;
          if (obtV >= 0.1 && gribV < 0.1) qy_nc++;
          if (obtV < 0.1 && gribV < 0.1) qy_nd++;
          if (this.facValue == 'ER03') {
            if ((obtV >= 0.1 && obtV <= 19.9) && (gribV >= 0.1 && gribV <= 19.9)) ybx_na++;
            if ((obtV < 0.1) && (gribV >= 0.1 && gribV <= 19.9)) ybx_nb++;
            if ((obtV >= 0.1 && obtV <= 19.9) && (gribV < 0.1)) ybx_nc++;
            if (obtV >= 20 && gribV >= 20) by_na++;
            if (obtV < 20 && gribV >= 20) by_nb++;
            if (gribV < 20 && obtV >= 20) by_nc++;
          } else if (this.facValue == 'ER12' || this.facValue == 'ER24') {
            if ((obtV >= 0.1 && obtV <= 49.9) && (gribV >= 0.1 && gribV <= 49.9)) ybx_na++;
            if ((obtV == 0) && (gribV >= 0.1 && gribV <= 49.9)) ybx_nb++;
            if ((obtV >= 0.1 && obtV <= 49.9) && (gribV == 0)) ybx_nc++;
            if (obtV >= 50 && gribV >= 50) by_na++;
            if (obtV < 50 && gribV >= 50) by_nb++;
            if (gribV < 50 && obtV >= 50) by_nc++;
          }
          v = this.isDiffValue ? (gribV - obtV) : gribV;
          obtWfData[obtFacname] = v.toFixed(1);
          obtWfDataInGrib.push(obtWfData);
        }
        this.data = obtWfDataInGrib;
        let resultTable = "<span>检验结果</span>";
        this.isShowRsCon = false
        if (this.model != 'fm' && (this.facValue == 'TMP' || this.facValue == 'TMAX' || this.facValue == 'TMIN')) {
          //均方根误差
          let rmse = Math.sqrt(rmse1 / obtWfDataInGrib.length).toFixed(1);
          //平均绝对误差
          let mae = (mae1 / obtWfDataInGrib.length).toFixed(1);
          //≤1℃准确率
          let ar1 = (count1 * 100 / obtWfDataInGrib.length).toFixed(1);
          //≤2℃准确率
          let ar2 = (count2 * 100 / obtWfDataInGrib.length).toFixed(1);
          resultTable += "<div>" + "<span>≤1℃个数：</span>" + "<span>" + count1 + "</span>" + "</div>" +
            "<div>" + "<span>≤2℃个数：</span>" + "<span>" + count2 + "</span>" + "</div>" +
            "<div>" + "<span>总数：</span>" + "<span>" + total + "</span>" + "</div>" +
            "<div>" + "<span>≤1℃预报准确率：</span>" + "<span>" + ar1 + "</span>" + "</div>" +
            "<div>" + "<span>≤2℃预报准确率：</span>" + "<span>" + ar2 + "</span>" + "</div>" +
            "<div>" + "<span>均方根误差：</span>" + "<span>" + rmse + "</span>" + "</div>" +
            "<div>" + "<span>平均绝对误差：</span>" + "<span>" + mae + "</span>" + "</div>"
          this.isShowRsCon = true
          this.resultContent = resultTable
        } else if (this.model != 'fm' && (this.facValue == 'ER03' || this.facValue == 'ER12' || this.facValue == 'ER24')) {

          resultTable += '<table border="1" style="border-collapse: collapse;">'+
            '<tr style="border:1px solid black">\n' +
            '<td style="text-align: center;">要素</td>\n' +
            '<td style="text-align: center;">正确站点数</td>\n' +
            '<td style="text-align: center;">总站点数</td>\n' +
            '<td style="text-align: center;">TS</td>\n' +
            '<td style="text-align: center;">准确率</td>\n' +
            '</tr>'+
            '<tr style="border:1px solid black;">\n' +
            '<td style="text-align: center;">晴雨(雪)</td>\n' +
            '<td style="text-align: center;">'+(qy_na+qy_nd)+'</td>\n' +
            '<td style="text-align: center;">'+(qy_na+qy_nb+qy_nc+qy_nd)+'</td>\n' +
            '<td style="text-align: center;">'+this.calPre(qy_na,qy_na+qy_nb+qy_nc)+'</td>\n' +
            '<td style="text-align: center;">'+this.calPre(qy_na+qy_nd,qy_na+qy_nb+qy_nc+qy_nd)+'</td>\n' +
            '</tr>'+
            '<tr>\n' +
            '<td style="text-align: center;">一般性降水</td>\n' +
            '<td style="text-align: center;">'+ybx_na+'</td>\n' +
            '<td style="text-align: center;">'+(ybx_na+ybx_nb+ybx_nc)+'</td>\n' +
            '<td style="text-align: center;">'+this.calPre(ybx_na,ybx_na+ybx_nb+ybx_nc)+'</td>\n' +
            '<td style="text-align: center;">-</td>\n' +
            '</tr>' +
            '<tr style="border:1px solid black;">\n' +
            '<td style="text-align: center;">暴雨及以上</td>\n' +
            '<td style="text-align: center;">'+by_na+'</td>\n' +
            '<td style="text-align: center;">'+(by_na+by_nb+by_nc)+'</td>\n' +
            '<td style="text-align: center;">'+this.calPre(by_na,by_na+by_nb+by_nc)+'</td>\n' +
            '<td style="text-align: center;">-</td>\n' +
            '</tr></table>';
          this.isShowRsCon = true
          this.resultContent = resultTable
        } else if(this.model == 'fm'&&(this.facValue == 'ER24' ||this.facValue == 'TMAX' ||this.facValue == 'TMIN')){
          this.resolveFm();
        }
      },
      async resolveFm(){
        var obtFacname = this.getLiveObtFacname();
        if(this.facValue == "ER24"){
          let arr = ["SOTS","PFSN","BECS","BABJ","ECMT"];
          let resultTable = "<span>检验结果</span>"+
            "<table border='1' style='border-collapse: collapse;'"+
            "<tr style='background-color:#e9edf4'>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>数据源</td>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>晴雨准确率</td>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>一般性降水TS</td>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>暴雨及以上TS</td>\n" +
            "</tr>";
          let qyid = "";
          let ybxid = "";
          let byid = "";
          let qy_p = 0;
          let ybx_ts = 0;
          let by_ts = 0;
          for(let i = 0; i < arr.length; i++){
            let data2 = await this.getWFData2(arr[i]);
            let qy_na = 0;
            let qy_nb = 0;
            let qy_nc = 0;
            let qy_nd = 0;
            let ybx_na = 0;
            let ybx_nb = 0;
            let ybx_nc = 0;
            let by_na = 0;
            let by_nb = 0;
            let by_nc = 0;
            for (let j = 0; j < this.liveData.length; j++) {
              let obt = this.liveData[j];
              let index = this.getIndexBylatlng(obt['grid_lat'], obt['grid_lon']);

              //站点对应的格点数据
              let obtV = obt[obtFacname];
              let gribV = data2[index];
              let v = gribV - obtV;//vm.isDiffValue ? (gribV - obtV) : gribV;
              if(obtV >= 0.1 && gribV >= 0.1) qy_na++;
              if(obtV < 0.1 && gribV >= 0.1) qy_nb++;
              if(obtV >= 0.1 && gribV < 0.1) qy_nc++;
              if(obtV < 0.1 && gribV < 0.1) qy_nd++;
              if((obtV >= 0.1 && obtV <= 49.9) && (gribV >= 0.1 && gribV <= 49.9)) ybx_na++;
              if((obtV == 0) && (gribV >= 0.1 && gribV <= 49.9)) ybx_nb++;
              if((obtV >= 0.1 && obtV <= 49.9) && (gribV == 0)) ybx_nc++;
              if(obtV >= 50 && gribV >= 50) by_na++;
              if(obtV < 50 && gribV >= 50) by_nb++;
              if(gribV < 50 && obtV >= 50) by_nc++;
            }
            let qy_p1 = this.calPre(qy_na+qy_nd,qy_na+qy_nb+qy_nc+qy_nd);
            let ybx_ts1 = this.calPre(ybx_na,ybx_na+ybx_nb+ybx_nc);
            let by_ts1 = this.calPre(by_na,by_na+by_nb+by_nc);
            if(parseFloat(qy_p1) > parseFloat(qy_p)){
              qy_p = qy_p1;
              qyid = "qy" + (i+1);
            }
            if(parseFloat(ybx_ts1) > parseFloat(ybx_ts)){
              ybx_ts = ybx_ts1;
              ybxid = "ybx" + (i+1);
            }
            if(parseFloat(by_ts1) > parseFloat(by_ts)){
              by_ts = by_ts1;
              byid = "by" + (i+1);
            }
            let model = this.fms.find(item => item.value === arr[i]);
            if(data2.length > 0){
              resultTable += "<tr>\n" +
                "<td style='text-align: center;background-color:#dce6f2'>"+model.label+"</td>\n" +
                "<td style='text-align: center;background-color:#dce6f2'><span id='qy"+(i+1)+"'>"+qy_p1+"%</span><br>（"+(qy_na+qy_nd)+"/"+(qy_na+qy_nb+qy_nc+qy_nd)+"）</td>\n" +
                "<td style='text-align: center;background-color:#dce6f2'><span id='ybx"+(i+1)+"'>"+ybx_ts1+"%</span><br>（"+ybx_na+"/"+(ybx_na+ybx_nb+ybx_nc)+"）</td>\n" +
                "<td style='text-align: center;background-color:#dce6f2'><span id='by"+(i+1)+"'>"+(by_ts1=="-"?"/":(by_ts1+"%</span><br>（"+by_na+"/"+(by_na+by_nb+by_nc)+"）"))+"</td>\n" +
                "</tr>";
            }else{
              resultTable += "<tr style='border:1px solid #4f81bd;background-color:#e9edf4'>\n" +
                "<td style='text-align: center;border:1px solid #4f81bd;background-color:#dce6f2'>"+model.label+"</td>\n" +
                "<td style='text-align: center;border:1px solid #4f81bd;background-color:#dce6f2'>/</td>\n" +
                "<td style='text-align: center;border:1px solid #4f81bd;background-color:#dce6f2'>/</td>\n" +
                "<td style='text-align: center;border:1px solid #4f81bd;background-color:#dce6f2'>/</td>\n" +
                "</tr>";
            }
          }
          resultTable += "</table>";
          this.isShowRsCon = true
          this.resultContent = resultTable
          $('#'+qyid).css("color","red");
          $('#'+ybxid).css("color","red");
          $('#'+byid).css("color","red");
        }else if(this.facValue == "TMIN" || this.facValue == "TMAX"){
          let tem;
          if(this.facValue == "TMIN") tem = "最低气温";
          if(this.facValue == "TMAX") tem = "最高气温";
          let arr = ["SOTS","PFSN","BECS","BABJ","ECMT"];
          let resultTable = "<span>检验结果</span>"+
            "<table border='1' style='border-collapse: collapse;'"+
            "<tr>\n" +
            "<td style='text-align: center;background-color:#e9edf4' rowspan='2'>数据源</td>\n" +
            "<td style='text-align: center;background-color:#e9edf4' colspan='2'>"+tem+"</td>\n" +
            "</tr>"+
            "<tr>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>≤2℃准确率</td>\n" +
            "<td style='text-align: center;background-color:#e9edf4'>≤1℃准确率</td>\n" +
            "</tr>";
          let p1 = 0;
          let p2 = 0;
          let p1id = "";
          let p2id = "";
          for(let i = 0; i < arr.length; i++){
            let data2 = await this.getWFData2(arr[i]);
            console.log(data2)
            let count1 = 0;
            let count2 = 0;
            for (let j = 0; j < this.liveData.length; j++) {
              let obt = this.liveData[j];
              let index = this.getIndexBylatlng(obt['grid_lat'], obt['grid_lon']);

              //站点对应的格点数据
              let obtV = obt[obtFacname];
              let gribV = data2[index];
              let v = gribV - obtV;//vm.isDiffValue ? (gribV - obtV) : gribV;
              if(Math.abs(v.toFixed(1)) <= 1) count1++;
              if(Math.abs(v.toFixed(1)) <= 2) count2++;
            }
            let p1_1 = (count1*100/this.liveData.length).toFixed(1);
            let p2_1 = (count2*100/this.liveData.length).toFixed(1);
            console.log((i+1)+"**"+p1_1+'****'+p1+'*****');

            if(parseFloat(p1_1) > parseFloat(p1)){
              p1 = p1_1;
              p1id = "p1" + (i+1);
            }
            if(parseFloat(p2_1) > parseFloat(p2)){
              p2 = p2_1;
              p2id = "p2" + (i+1);
            }
            let model = this.fms.find(item => item.value === arr[i]);
            if(data2.length > 0){
              resultTable += "<tr>\n" +
                "<td style='text-align: center;background-color:#e9edf4'>"+model.label+"</td>\n" +
                "<td style='text-align: center;background-color:#e9edf4'><span id='p2"+(i+1)+"'>"+
                p2_1+"%</span>（"+count2+"/"+this.liveData.length+"）</td>\n" +
                "<td style='text-align: center;background-color:#e9edf4'><span id='p1"+(i+1)+"'>" +
                p1_1+"%</span>（"+count1+"/"+this.liveData.length+"）</td>\n" +
                "</tr>";
            }else{
              resultTable += "<tr>\n" +
                "<td style='text-align: center;background-color:#e9edf4'>"+model.label+"</td>\n" +
                "<td style='text-align: center;background-color:#e9edf4'>/</td>\n" +
                "<td style='text-align: center;background-color:#e9edf4'>/</td>\n" +
                "</tr>";
            }

          }
          resultTable += "</table>";
          this.isShowRsCon = true
          this.resultContent = resultTable
          $('#'+p1id).css("color","red");
          $('#'+p2id).css("color","red");
        }
      },
      async getWFData2(model){
        let data1 = this.getWFRequestData2(model);
        let data2;
        await wfData(data1).then(res => {
          data2 = []
          if (res.code === 1 && res["data"].length > 0) {
            data2 = this.parseOriginalData(res['data'][0]);
            data2 = eval(data2["data"]["value"]);
          }
        }).catch(err => {
          console.log(err)
        })
        return data2;
      },
      getWFRequestData2(model) {
        let wfinterval, wfhours, wfhour, facname, wfsrc, wfdatetime;

        let intervalArr = this.intervalValue.split('-');
        //预报时段
        wfhour = intervalArr[1];
        //预报间隔
        wfinterval = intervalArr[1] - intervalArr[0];
        //预报总时次
        // wfhours = 240;
        //预报要素
        facname = this.facValue;
        //预报主体
        wfsrc = model;
        //预报时间
        wfdatetime = moment(this.dateValue).format('YYYYMMDD') + this.ftvalue + '00';

        let datatype = '';
        if (wfsrc === 'PFSN' && this.ftvalue === '20') {
          datatype = ' and datatype = ' + this.datatype;
        }
        return {
          wfinterval: wfinterval,
          // wfhours: wfhours,
          wfhour: wfhour,
          facname: facname,
          wfsrc: wfsrc,
          wfdatetime: wfdatetime,
          datatype: datatype
        }
      },
      calPre(a,b) {
        if(a == 0 && b != 0) return 0;
        if(a != 0 && b == 0) return 0;
        if(a == 0 && b == 0) return '-';
        return (a*100/b).toFixed(1);
      },
      getIndexBylatlng(lat, lng) {
        let oriLon = this.uppperLeft[1];
        let oriLat = this.uppperLeft[0];

        let x = Math.round(Math.abs(oriLat - lat) / 0.05);
        let y = Math.round(Math.abs(lng - oriLon) / 0.05);

        //这里要先确认
        return x * 116 + y;
      },
      getWFRequestData(map) {
        let wfinterval, wfhour, facname, wfsrc, wfdatetime;

        let intervalArr = this.intervalValue.split('-');
        //预报时段
        wfhour = intervalArr[1];
        //预报间隔
        wfinterval = intervalArr[1] - intervalArr[0];
        //预报总时次
        // wfhours = 240;
        //预报要素
        facname = this.facValue;
        //预报主体
        wfsrc = map.dataSrcCode;
        //预报时间
        wfdatetime = moment(this.dateValue).format('YYYYMMDD') + this.ftvalue + '00';

        let datatype = '';
        // if (wfsrc === 'PFSN' && vm.ftvalue === '20') {
        //   datatype = ' and datatype = ' + vm.datatype;
        // }
        // console.log({
        //   wfinterval: wfinterval,
        //   // wfhours: wfhours,
        //   wfhour: wfhour,
        //   facname: facname,
        //   wfsrc: wfsrc,
        //   wfdatetime: wfdatetime,
        //   datatype: datatype
        // });
        return {
          wfinterval: wfinterval,
          // wfhours: wfhours,
          wfhour: wfhour,
          facname: facname,
          wfsrc: wfsrc,
          wfdatetime: wfdatetime,
          datatype: datatype
        }
      },
      initMap(mapId) {
        let myStyle = {
          color: '#AFC7E5',
          weight: 1.5,
          fillColor: '#D5E2F3',
          fillOpacity: 0,
        }
        let baiduCustomMap = L.tileLayer.baidu({
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
          // scrollWheelZoom: false,
          inertia: false,
          // dragging: false,
          center: [27.4, 111.5],
        }
        let map = L.map(mapId, options)
        map.collisionLayer = L.layerGroup.collision({margin: 2})
        map.collisionLayer.addTo(map)
        map.clearAll = function () {
          this.collisionLayer.clearLayers();
          if (this.colorOverlay) {
            this.removeLayer(this.colorOverlay);
          }
          // this.map.off('popupopen');
        }
        this.hunanLayer = L.geoJSON(data, {
          style: myStyle
        })
        this.hunanLayer.addTo(map)
        return map
      },
      linkMap(wfMaps) {
        //地图联动静态方法
        function mapLink() {
          wfMaps.map(wfMap => wfMap.setView(this.getCenter(), this.getZoom()))
        }

        //绑定
        wfMaps.map(wfMap => wfMap.on({drag: mapLink, zoom: mapLink}))
      },
      getTmpColor(tem, legendContent) {
        let arr = [
          ['#0a25c2', -20, '-20'],
          ['#1a3ac2', -18, '-18'],
          ['#2257be', -15, '-15'],
          ['#207CFD', -12, '-12'],
          ['#189DFD', -10, '-10'],
          ['#09b8fc', -8, '-8'],
          ['#5bd8fb', -5, '-5'],
          ['#91e5fb', -2, '2'],
          ['#dcf7fb', 0, '0'],
          ['#8de0bb', 2, '2'],
          ['#4ce0ae', 5, '5'],
          ['#3ce07d', 8, '8'],
          ['#08e015', 10, '10'],
          ['#54e03e', 12, '12'],
          ['#93e04b', 15, '15'],
          ['#b0e048', 18, '18'],
          ['#eef143', 20, '20'],
          ['#FFD322', 22, '22'],
          ['#FFA318', 25, '25'],
          ['#F7814E', 28, '28'],
          ['#FF5818', 30, '30'],
          ['#ff3010', 32, '32'],
          ['#ff0003', 35, '35'],
          ['#c30003', 38, '38'],
        ]

        let ret;
        for (let i = 0; i < arr.length; i++) {
          let arrV = arr[i];
          if (tem < arrV[1]) {
            arrV.push(i);
            ret = arrV;
            break;
          }
        }
        ret || (ret = ['#9f0001', 38, '>38', arr.length]);

        let c = ret[0];
        legendContent && (legendContent[c] = ret);
        return c.replace(/#/, "0x");
      },
      getTmpContent(data) {
        return "温度：" + Number(data).toFixed(1) + "℃";
      },
      getDiffTmpColor(diff, legendContent) {
        let arr = [
          ['#0100ED', -2, '<-2'],
          ['#CBCCCE', 2.1, '-2-2']

        ]
        let ret;
        for (let i = 0; i < arr.length; i++) {
          let arrV = arr[i];
          if (diff < arrV[1]) {
            arrV.push(i);
            ret = arrV;
            break;
          }
        }
        ret || (ret = ['#ff0000', 2, '>2', arr.length]);
        let c = ret[0];
        legendContent && (legendContent[c] = ret);
        return c.replace(/#/, "0x");
      },
      getDiffTmpContent(data) {
        return "误差：" + Number(data).toFixed(1) + "℃";
      },
      getRainColor(rain, legendContent) {
        let arr = [
          ['#C2CDF8', 0, '无降水'],
          ['#A6F28E', 0, '小雨'],
          ['#3DB93D', 0, '中雨'],
          ['#61B8FF', 0, '大雨'],
          ['#0100ED', 0, '暴雨'],
          ['#FA00FA', 0, '大暴雨'],
          ['#810040', 0, '特大暴雨'],
        ]
        let wfInterval = this.wfInterval;
        let i;
        // 降水根据降水等级来划分
        if (rain < 0.1) {
          i = 0;
        } else if (wfInterval === 3) {
          i = this.getRain3Level(rain)
        } else if (wfInterval === 12) {
          i = this.getRain24Level(rain)
        } else if (wfInterval === 24) {
          i = this.getRain24Level(rain)
        }

        let arrV = arr[i];
        arrV.push(i);
        let c = arrV[0];
        legendContent && (legendContent[c] = arrV);
        return c.replace(/#/, "0x");
      },
      getRainContent(data) {
        return "累计雨量：" + Number(data).toFixed(1) + "mm";
      },
      getDiffRainColor(diff, legendContent) {
        let arr = [
          ['#1A1AE6', -20, '-20'],
          ['#5757ED', -15, '-15'],
          ['#8585F2', -10, '-10'],
          ['#C2C2F8', -5, '-5'],
          ['#e0f3f8', 5, '5'],
          ['#fcf4d2', 10, '10'],
          ['#fff29f', 15, '15'],
          ['#FED976', 20, '20'],
          ['#fdae61', 30, '30'],
          ['#FD8D3C', 40, '40'],
          ['#f46d43', 50, '50'],
          ['#d73027', 60, '60'],
          ['#a50026', 70, '70'],
        ]

        let ret;
        for (let i = 0; i < arr.length; i++) {
          let arrV = arr[i];
          if (diff <= arrV[1]) {
            arrV.push(i);
            ret = arrV;
            break;
          }
        }
        ret || (ret = ['#9f0001', 9, '>60', arr.length]);

        let c = ret[0];
        legendContent && (legendContent[c] = ret);
        return c.replace(/#/, "0x");
      },
      getDiffRainContent(data) {
        return "误差：" + Number(data).toFixed(1) + "mm";
      },
      getWindColor(wind, legendContent) {
        let arr = [
          ['#e3f3e4', 0, '0级'],
          ['#c0e6b8', 0, '1级'],
          ['#8fcc8f', 0, '2级'],
          ['#6db377', 0, '3级'],
          ['#4d9965', 0, '4级'],
          ['#348059', 0, '5级'],
          ['#1ba8fc', 0, '6级'],
          ['#207CFD', 0, '7级'],
          ['#d7d061', 0, '8级'],
          ['#FED976', 0, '9级'],
          ['#fdae61', 0, '10级'],
          ['#FD8D3C', 0, '11级'],
          ['#f46d43', 0, '12级'],
          ['#d73027', 0, '>12级'],
        ]

        let level = this.windLevel(wind);

        let arrV = arr[level];
        arrV.push(level);
        let c = arrV[0];
        legendContent && (legendContent[c] = arrV);
        return c.replace(/#/, "0x");
      },
      getWindContent(data) {
        let arr = ['0级', '1级', '2级', '3级', '4级', '5级', '6级', '7级', '8级', '9级', '10级', '11级', '12级', '>12级']
        return "风速：" + Number(data).toFixed(2) + "m/s (等级: " + arr[this.windLevel(data)] + ")";
      },
      getDiffWindColor(diff, legendContent) {
        let arr = [
          ['#2c6e4d', -13, '<-13'],
          ['#348059', -11, '-13'],
          ['#4d9965', -9, '-11'],
          ['#6db377', -7, '-9'],
          ['#8fcc8f', -5, '-7'],
          ['#c0e6b8', -3, '-5'],
          ['#d6efc9', -1, '-3'],
          ['#fcf4d2', 0, '-1'],
          ['#fff4ce', 1, '1'],
          ['#FED976', 3, '3'],
          ['#FEB24C', 5, '5'],
          ['#FD8D3C', 7, '7'],
          ['#fc6738', 9, '9'],
          ['#d73027', 11, '11'],
          ['#a50026', 13, '13'],
        ]

        let ret;
        for (let i = 0; i < arr.length; i++) {
          let arrV = arr[i];
          if (diff < arrV[1]) {
            arrV.push(i);
            ret = arrV;
            break;
          }
        }
        ret || (ret = ['#9f0001', 13, '>13', arr.length]);

        let c = ret[0];
        legendContent && (legendContent[c] = ret);
        return c.replace(/#/, "0x");
      },
      getDiffWindContent(data) {
        return "误差：" + Number(data).toFixed(2) + "m/s";
      },
      getRain3Level(v) {
        if (v >= 0.1 && v <= 2.9) { //小雨
          return 1;
        } else if (v > 2.9 && v <= 9.9) { //中雨
          return 2;
        } else if (v > 9.9 && v <= 19.9) { //大雨
          return 3;
        } else if (v > 19.9 && v <= 49.9) { //暴雨
          return 4;
        } else if (v > 49.9 && v <= 69.9) { //大暴雨
          return 5;
        } else if (v > 69.9) { //特大暴雨
          return 6;
        }
      },
      getRain24Level(v) {
        if (v >= 0.1 && v <= 9.9) { //小雨
          return 1;
        } else if (v > 9.9 && v <= 24.9) { //中雨
          return 2;
        } else if (v > 24.9 && v <= 49.9) { //大雨
          return 3;
        } else if (v > 49.9 && v <= 99.9) { //暴雨
          return 4;
        } else if (v > 99.9 && v <= 249.9) { //大暴雨
          return 5;
        } else if (v > 249.9) { //特大暴雨
          return 6;
        }
      },
      windLevel(ws) {
        if (ws >= 0 && ws <= 0.2) {
          return 0;
        } else if (ws >= 0.2 && ws < 1.6) {
          return 1;
        } else if (ws >= 1.6 && ws < 3.4) {
          return 2;
        } else if (ws >= 3.4 && ws < 5.5) {
          return 3;
        } else if (ws >= 5.5 && ws < 8.0) {
          return 4;
        } else if (ws >= 8.0 && ws < 10.8) {
          return 5;
        } else if (ws >= 10.8 && ws < 13.9) {
          return 6;
        } else if (ws >= 13.9 && ws < 17.2) {
          return 7;
        } else if (ws >= 17.2 && ws < 20.8) {
          return 8;
        } else if (ws >= 20.8 && ws < 24.5) {
          return 9;
        } else if (ws >= 24.5 && ws < 28.5) {
          return 10;
        } else if (ws >= 28.5 && ws < 32.6) {
          return 11;
        } else if (ws >= 32.6 && ws < 37.0) {
          return 12;
        } else if (ws >= 37.0) {
          return 13;
        }
      },
      renderMap(map) {
        this.uppperLeft = [];
        this.lowerright = [];
        this.width = 0;
        this.height = 0;
        this.stepx = 0;
        this.stepy = 0;
        this.data = [];
        if (this.type === '站点') {
          map.off('click');
        } else {
          map.on('click', this.mapClick);
        }
        //legend 和 content
        let facType = this.getFacType(this.facValue);
        if (map.dataSrcCode === 'LIVE' || !this.isDiffValue) {
          if (facType === 'tem') {
            this.getDataColor = this.getTmpColor;
            this.getTooltipContent = this.getTmpContent;
            this.leftPanelTitle = '温度(℃)'
            this.rightPanelTitle = '温度(℃)';
          } else if (facType === 'rain') {
            this.getDataColor = this.getRainColor;
            this.getTooltipContent = this.getRainContent;
            this.leftPanelTitle = '降雨(mm)'
            this.rightPanelTitle = '降雨(mm)';
          } else if (facType === 'wind') {
            this.getDataColor = this.getWindColor;
            this.getTooltipContent = this.getWindContent;
            this.leftPanelTitle = '风速<small>(等级)</small>';
            this.rightPanelTitle = '风速<small>(等级)</small>';
          }
          //差值
        } else {
          if (facType === 'tem') {
            this.getDataColor = this.getDiffTmpColor;
            this.getTooltipContent = this.getDiffTmpContent;
            this.rightPanelTitle = '误差(℃)';
          } else if (facType === 'rain') {
            this.getDataColor = this.getDiffRainColor;
            this.getTooltipContent = this.getDiffRainContent;
            this.rightPanelTitle = '误差(mm)';
          } else if (facType === 'wind') {
            this.getDataColor = this.getDiffWindColor;
            this.getTooltipContent = this.getDiffWindContent;
            this.rightPanelTitle = '误差(m/s)';
          }
        }
        /**
         * 地图格点点击事件
         */
        let _this = this
        let popup = new L.Popup();
        this.popups.push(popup);
        popup.on('remove', function () {
          _this.popupClose();
        });
        this.openTooltips.push(function (e) {
          let lat = e.latlng.lat;
          let lng = e.latlng.lng;
          if (lat < _this.uppperLeft[0] && lat > _this.lowerright[0] - _this.stepy && lng > _this.uppperLeft[1] && lng < _this.lowerright[1] + _this.stepx) {
            let gribData = _this.getGribDataBylatlng(lat, lng).toFixed(2);
            let content = _this.getTooltipContent(gribData);
            let index = _this.getIndexBylatlng(lat, lng);
            if (map.dataSrcCode !== 'LIVE') {
              content += '<div class="valuechart" onclick="drawSeries(\'' + (index) + '\', \'' + _this.model + '\')">查看趋势</div>'
            }
            popup.setLatLng(e.latlng).setContent(content).openOn(map);
          }
        });
        // 如果是实况
        if (map.dataSrcCode === 'LIVE') {
          if (this.type === '格点') {
            this.renderGribValue(this.liveData, this.leftMap);
          } else {
            this.renderObtValue(map, this.liveData, 'sk');
          }
        } else {//预报
          this.getWFData(map);
        }
      },
      getGribDataBylatlng(lat, lng) {
        let x = Math.abs(Math.floor(Math.abs(this.uppperLeft[0] - lat) / this.stepy));
        let y = Math.abs(Math.floor(Math.abs(lng - this.uppperLeft[1]) / this.stepx));
        let index = x * width + y;
        return this.data[index];
      },
      popupClose() {
        for (let i = 0; i < this.popups.length; i++) {
          this.popups[i].removeFrom(this.leftMap);
          this.popups[i].removeFrom(this.rightMap);
        }
      },
      mapClick(e) {
        for (let i = 0; i < this.openTooltips.length; i++) {
          this.openTooltips[i](e);
        }
      },
      drawSeries(index, model, obtid, obtname) {
        let title = obtname + "（" + obtid + "）" + " " + this.modelName + " " + this.getFacShortName() + ' 72小时 各预报时段值'
        this.$msgbox({
          title: '时序图',
          message: '<div id="valuechart" style="width: 600px; height: 400px"></div>',
          showConfirmButton: false,
          dangerouslyUseHTMLString: true
        }).then(res => {
          console.log("box")
        }).catch(err => {

        })
        let _this = this
        this.$nextTick(() => {
          document.getElementById('valuechart').innerHTML = ""
          document.getElementById("valuechart").removeAttribute("_echarts_instance_");
          let liveUrl;
          let liveReqData;
          if (obtid) {
            liveUrl = '/chart_live_hour_obt';
            if (this.isNeedCal()) {
              liveUrl = '/chart_live_hour_obt_cal';
            }
            liveReqData = this.obtLiveReqData(obtid);
          } else {
            liveUrl = '/chart_live_hour_grib';
            liveReqData = this.gribLiveReqData(index);
          }
          Promise.all([chartData(liveUrl, liveReqData), chartData("/chart_wf_grib", this.wfReqData(index))]).then(res => {
            if (res[0].code === 1 && res[1].code === 1) {
              //数据处理
              let liveData = res[0].data;
              let wfData = res[1].data;

              let xData = [];
              let liveSeries = [];
              let wfSeries = [];
              let diffSeries = [];

              let wfInterval = this.wfInterval;
              // 72小时  分逐三 和逐 24
              for (let h = wfInterval; h <= 72; h += wfInterval) {
                xData.push(h);

                let liveV = undefined;
                let wfV = undefined;
                // 遍历实况数据
                for (let i = 0; i < liveData.length; i++) {
                  let liveMilliseconds = liveData[i]['ddatetime'];

                  if (moment(this.dateValue)
                    .add(Number(this.ftvalue), 'hour')
                    .add(h, 'hour')
                    .isSame(moment(liveMilliseconds))) {
                    liveV = liveData[i]['data'];

                  }
                }

                for (let i = 0; i < wfData.length; i++) {
                  if (wfData[i]['wfhour'] === h) {
                    wfV = wfData[i]['data'];
                  }
                }

                typeof liveV !== 'undefined' ? liveSeries.push(Number(liveV)) : liveSeries.push(undefined);
                typeof wfV !== 'undefined' ? wfSeries.push(Number(wfV)) : wfSeries.push(undefined);
                if (typeof liveV !== 'undefined' && typeof wfV !== 'undefined') {
                  diffSeries.push((Number(wfV) - Number(liveV)).toFixed(2))
                } else {
                  diffSeries.push(undefined);
                }
              }

              //图表
              let option = {
                title: {
                  text: title,
                  top: 5,
                  right: 'center',
                },
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  transitionDuration: 0,
                  backgroundColor: '#F1F3F4',
                  borderColor: '#7CB5EC',
                  borderWidth: '1',
                  textStyle: {
                    color: '#161616',
                    fontSize: 13
                  },
                  extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);',
                  formatter: function (params) {
                    let ret = '';
                    if (params) {
                      ret += '<span style="font-size: 13px">' + _this.getIntervalName(params[0].name) + ' 时段</span><br>';

                      for (let key in params) {
                        if (params.hasOwnProperty(key)) {
                          let series = params[key];
                          let v = series.value;
                          if (typeof v !== 'undefined' && v !== '-' && !isNaN(v)) {
                            ret += '<span style="font-size: 13px;color: ' + series.color + '"> \u25cf </span>' + series.seriesName + ': <b>' + v + '  ' + _this.getUnit() + '</b><br/>';
                          }
                        }
                      }
                    }
                    return ret;
                  },
                },
                grid: {
                  left: 30,
                  right: 30,
                  bottom: 30,
                  containLabel: true,
                },
                legend: {
                  data: ['实况', '预报', '误差'],
                  top: 35,
                  right: 30,
                },
                xAxis: {
                  type: 'category',
                  data: xData,
                },
                yAxis: {},
                series: [
                  {
                    name: '实况',
                    type: 'line',
                    data: liveSeries,
                    symbol: 'rect',
                    symbolSize: 5,
                    itemStyle: {
                      normal: {
                        color: '#1883e5',
                      }
                    },
                    label: {
                      show: true,
                      fontSize: 10,
                      distance: 3,
                      formatter: function (o) {
                        return Number(o.value).toFixed(1);
                      }
                    },
                    lineStyle: {
                      normal: {
                        width: 2,
                      }
                    },
                    zLevel: 10,
                  },
                  {
                    name: '预报',
                    type: 'line',
                    data: wfSeries,
                    symbol: 'triangle',
                    symbolSize: 5,
                    itemStyle: {
                      normal: {
                        color: '#54b99e',
                      }
                    },
                    lineStyle: {
                      normal: {
                        width: 2,
                      }
                    }
                  },
                  {
                    name: '误差',
                    type: 'line',
                    data: diffSeries,
                    symbol: 'circle',
                    symbolSize: 5,
                    itemStyle: {
                      normal: {
                        color: '#cd2221',
                      }
                    },
                    label: {
                      show: true,
                      fontSize: 10,
                      distance: 3,
                      formatter: function (o) {
                        return Number(o.value).toFixed(1);
                      }
                    },
                    lineStyle: {
                      normal: {
                        width: 2,
                      }
                    }
                  },
                ]
              };

              let myChart = echarts.init(document.getElementById('valuechart'));
              myChart.setOption(option);
            }
          }).catch(err => {
            console.log(err)
          })
        })
      },
      obtLiveReqData(obtid) {
        let obtFacname = this.getLiveObtFacname();

        let satrtDatetimeMoment = moment(this.dateValue).add(this.ftvalue, 'hour');
        let startDatetime = satrtDatetimeMoment.format('YYYYMMDDHH');
        let endDatetime = satrtDatetimeMoment.add(72, 'hour').format('YYYYMMDDHH');

        let cal_fun = '';
        let cal_hour = '';
        let data = '';

        switch (obtFacname) {
          case 'tem':
            data = 'tem';
          case 'tem_max_24h':
            data = 'tem_max';
            cal_fun = 'max(tem_max)'
            cal_hour = 24;
            break;
          case 'tem_min_24h':
            data = 'tem_min';
            cal_fun = 'min(tem_min)';
            cal_hour = 24;

            break;
          case 'pre_3h':
            cal_fun = 'sum(pre_1h)';
            cal_hour = 3;
            break;
          case 'pre_12h':
            cal_fun = 'sum(pre_1h)';
            cal_hour = 12;
            break;
          case 'pre_24h':
            cal_fun = 'sum(pre_1h)';
            cal_hour = 24;
            break;
        }

        return {
          "obtFacname": obtFacname,
          obtid: obtid,
          startDatetime: startDatetime,
          endDatetime: endDatetime,
          "cal_fun": cal_fun,
          "cal_hour": cal_hour,
          "data": data,
        };
      },
      gribLiveReqData(index) {
        let facname;
        let table;
        let startDatetime;
        let endDatetime;

        //预报时次
        let ftvalue = this.ftvalue;
        //预报时段数组
        let intervalArr = this.intervalValue.split('-');

        //预报时次预报时段相加
        let foreHours = Number(intervalArr[1]) + Number(ftvalue);

        let satrtDatetimeMoment = moment(this.dateValue).add(ftvalue, 'hour');
        startDatetime = satrtDatetimeMoment.format('YYYYMMDDHH');
        endDatetime = satrtDatetimeMoment.add(72, 'hour').format('YYYYMMDDHH');

        //小时数据
        if ((intervalArr[1] - intervalArr[0]) === 3 || (intervalArr[1] - intervalArr[0]) === 12) {
          table = '"live"."tb_grib_hourd"';
        } else if ((intervalArr[1] - intervalArr[0]) === 24) {
          table = '"live"."tb_grib_dayd"';
        }

        //获取实况要素名称
        facname = this.getLiveGribFacname();
        return {
          table: table,
          facname: facname,
          index: index,
          startDatetime: startDatetime,
          endDatetime: endDatetime
        };
      },
      getLiveGribFacname() {
        let liveFacname = this.facValue;
        switch (liveFacname) {
          case 'TMP':
            return 'TEM';
          case 'TMAX':
            return 'MXT';
          case 'TMIN':
            return 'MNT';
          case 'ER03':
            return 'PRE03';
          case 'ER12':
            return 'PRE12';
          case 'ER24':
            return 'PRE';
          case 'EDA10':
            return 'WIN';
          default:
            return liveFacname;
        }
      },
      wfReqData(index) {
        let wfdatetime = moment(this.dateValue).add(Number(this.ftvalue), 'hour').format('YYYYMMDDHHmm');
        let facname = this.facValue;

        return {
          index: index,
          facname: facname,
          srcCode: this.model,
          wfdatetime: wfdatetime
        };
      },
      getIntervalName(i) {
        let interval = this.wfInterval;
        i = Number(i);
        if (this.instantFac()) {
          return i;
        } else {
          return (i - interval) + '~' + i;
        }
      },
      getUnit() {
        let v = this.facValue;
        if (v === 'TMP' || v === 'TMAX' || v === 'TMIN') {
          return '°C';
        } else if (v === 'ER03' || v === 'ER24' || v === 'ER12') {
          return 'mm';
        } else if (v === 'EDA10') {
          return 'm/s';
        }
      },
      renderObtValue(map, data, type) {
        map.clearAll()
        if (!data) return
        let obtFacname = this.getLiveObtFacname();
        let legendContent = {}
        //实况要素
        let tmp35 = 0;
        let tmp37 = 0;
        let tmp39 = 0;
        let tmp1 = 0;
        let tmpf1_0 = 0;
        let tmpf1 = 0;
        let er50 = 0;
        let er100 = 0;
        let er250 = 0;
        //差值
        let tmp2 = 0;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          let v = obj[obtFacname];
          // 过滤异常数据
          if (v == undefined || v >= 999 || v <= -999) {
            continue;
          }
          let latlng = [];
          latlng.push(obj.lat);
          latlng.push(obj.lon);
          let toPopup = {};

          let index = Number(obj["index"]);
          toPopup["index"] = index;
          toPopup["obtid"] = obj.obtid;

          let color = this.getDataColor(obj[obtFacname], legendContent).replace(/0x/, "#");

          let html = '<div class="point-div">';
          if (this.isShowGribColor) {
            if (map.dataSrcCode === 'LIVE') {
              html += '<span class="obt-color" style="background-color: ' + color + '"></span>';
            } else {
              html += '<span class="grid-color" style="background-color: ' + color + '"></span>';
            }
          }
          if (this.isShowGribValue) {
            let st
            let st1 = obj[obtFacname];
            html += '<span class="obt-count" ';
            if (type == 'sk') {

              if (obtFacname == 'tem_min_24h') {
                if (st1 > 0 && st1 <= 1) {
                  st = 'style="color:#00FF08" ';
                  tmp1++;
                } else if (st1 < 0 && st1 > -1) {
                  st = 'style="color:#00FF94" ';
                  tmpf1_0++;
                } else if (st1 <= -1) {
                  st = 'style="color:#00CBFF" ';
                  tmpf1++;
                } else {
                  st = 'style="color:#333333" ';
                }
                html += st;
              }
              if (obtFacname == 'tem_max_24h') {

                if (st1 >= 35 && st1 < 37) {
                  st = 'style="color:#FF3010" ';
                  tmp35 = tmp35 + 1;
                } else if (st1 >= 37 && st1 < 39) {
                  st = 'style="color:#FF0003" ';
                  tmp37 = tmp37 + 1;
                } else if (st1 >= 39) {
                  st = 'style="color:#C30003" ';
                  tmp39 = tmp39 + 1;
                } else {
                  st = 'style="color:#333333" ';
                }
                html += st;
              }

              if (obtFacname == 'er3' || obtFacname == 'pre_3h') {
                if (st1 >= 0.1 && st1 <= 2.9) {
                  st = 'style="color:#a6f28e"';
                } else if (st1 > 2.9 && st1 <= 9.9) {
                  st = 'style="color:#3db93d"';
                } else if (st1 > 9.9 && st1 <= 19.9) {
                  st = 'style="color:#61b8ff"';
                } else if (st1 > 19.9 && st1 <= 49.9) {
                  st = 'style="color:#0100ed"';
                } else if (st1 > 49.9 && st1 <= 69.9) {
                  st = 'style="color:#fa00fa"';
                } else if (st1 > 69.9) {
                  st = 'style="color:#810041"';
                } else if (st1 == 0) {
                  st = 'style="color:#FFFFFF" hidden';
                } else {
                  st = 'style="color:#333333" ';
                }
                html += st;
              }
              if (obtFacname == 'er12' || obtFacname == 'er24' || obtFacname == 'pre_12h' || obtFacname == 'pre_24h') {
                if (st1 >= 0.1 && st1 <= 9.9) {
                  st = 'style="color:#a6f28e"';
                } else if (st1 > 9.9 && st1 <= 24.9) {
                  st = 'style="color:#3db93d"';
                } else if (st1 > 24.9 && st1 <= 49.9) {
                  st = 'style="color:#61b8ff"';
                } else if (st1 > 49.9 && st1 <= 99.9) {
                  st = 'style="color:#0100ed"';

                } else if (st1 > 99.9 && st1 <= 249.9) {
                  st = 'style="color:#fa00fa"';

                } else if (st1 > 249.9) {
                  st = 'style="color:#810041"';

                } else if (st1 == 0) {
                  st = 'style="color:#FFFFFF" hidden';
                } else {
                  st = 'style="color:#333333" ';
                }
                if (obtFacname == 'er24') {
                  if (st1 > 49.9 && st1 <= 99.9) {
                    er50++;
                  } else if (st1 > 99.9 && st1 <= 249.9) {
                    er100++;
                  } else if (st1 > 249.9) {
                    er250++;
                  }
                }
                if (obtFacname == 'pre_24h') {
                  if (st1 > 49.9 && st1 <= 99.9) {
                    er50++;
                  } else if (st1 > 99.9 && st1 <= 249.9) {
                    er100++;
                  } else if (st1 > 249.9) {
                    er250++;
                  }
                }
                html += st;
              }
            }
            if (this.isDiffValue) {
              if (type == 'zd') {
                if (obtFacname == 'tem_max_24h' || obtFacname == 'tem_min_24h' || obtFacname == 'tem') {

                  if (st1 > 2) {
                    st = 'style="color:#ff0000" ';
                    tmp2++;
                  } else if (st1 < -2) {
                    st = 'style="color:#1111FF" ';
                  } else {
                    st = 'style="color:#000000" ';
                  }
                  html += st;
                }
              }
            } else {
              if (obtFacname == 'tem_min_24h') {
                if (st1 > 0 && st1 <= 1) {
                  st = 'style="color:#00FF08" ';
                } else if (st1 < 0 && st1 > -1) {
                  st = 'style="color:#00FF94" ';
                } else if (st1 <= -1) {
                  st = 'style="color:#00CBFF" ';
                } else {
                  st = 'style="color:#333333" ';
                }
                html += st;
              }
              if (obtFacname == 'tem_max_24h') {
                //alert(obtFacname);
                if (st1 >= 35 && st1 < 37) {
                  st = 'style="color:#FF3010" ';
                } else if (st1 >= 37 && st1 < 39) {
                  st = 'style="color:#FF0003" ';

                } else if (st1 >= 39) {
                  st = 'style="color:#C30003" ';

                } else {
                  st = 'style="color:#333333" ';
                }
                html += st;
              }
            }
            html += '>' + (obj[obtFacname] * 1).toFixed(1) + '</span>';
          }
          if (this.isShowObtname) {
            html += '<div class="obt-name" 	>' + obj['obtname'] + '</div>'
          }
          html += '</div>';
          let m = L.marker(latlng, {icon: L.divIcon({className: 'obt-value', html: html})});
          // tooltip 内容.
          let content = "";
          if (map.dataSrcCode === 'LIVE') {
            content += "<table class='label-obt-info'>" +
              "<tbody>" +
              "   <tr><td style='text-align: right'>站名：</td><td>" + obj.obtname + "（" + obj.obtid + "）</td></tr>" +
              "   <tr><td style='text-align: right'>位置：</td><td>" + this.formatDegree(obj.lon) + "," + this.formatDegree(obj.lat) + "</td></tr>" +
              "   <tr><td style='text-align: right'>高度：</td><td>" + Number(obj.high).toFixed(1) + "米</td></tr>" +
              "</tbody>" +
              "</table>" +
              "<hr style='margin: 3px'/>";
          }
          content += this.getTooltipContent(v);
          if (map.dataSrcCode === 'LIVE') {
            m.bindTooltip(content, {direction: "top", offset: [0, -8]});
          }
          if (map.dataSrcCode !== 'LIVE') {
            content += '<div class="valuechart" onclick="drawSeries(\'' + index + '\', \'' + this.model + '\', \'' + obj.obtid + '\', \'' + obj.obtname + '\')">查看趋势</div>';
          }
          m.bindPopup(content, {toPopup: toPopup});
          map.collisionLayer.addLayer(m);
          // 联动
          if (obj["index"]) {
            this.obtpopups.grib[obj.obtid] = m;
          } else {
            this.obtpopups.obt[obj.obtid] = m;
          }
        }
        this.renderLegend(map, legendContent);
        let _this = this
        map.on('popupopen', function (e) {
          let toPopup = e.popup.options.toPopup;
          if (toPopup.index) {
            _this.obtpopups.obt[toPopup.obtid].openPopup();
          } else {
            _this.obtpopups.grib[toPopup.obtid].openPopup();
          }
        });
        map.on('popupclose', function (e) {
          let toPopup = e.popup.options.toPopup;
          if (toPopup && toPopup.index) {
            _this.obtpopups.obt[toPopup.obtid].closePopup();
          }
        });
      },
      getFacType(facValue) {
        if (facValue === 'TMP' || facValue === 'TMAX' || facValue === 'TMIN') {
          return 'tem';
        } else if (facValue === 'ER03' || facValue === 'ER24' || facValue === 'ER12') {
          return 'rain';
        } else if (facValue === 'EDA10') {
          return 'wind';
        }
      },
      formatDegree(value) {
        value = Math.abs(value);
        var v1 = Math.floor(value);//度
        var v2 = Math.floor((value - v1) * 60);//分
        var v3 = Math.round((value - v1) * 3600 % 60);//秒
        return v1 + '°' + v2 + '\'' + v3 + '"';
      },
      renderLegend(map, legendContent) {
        let single = "";
        //排序
        let values = Object.keys(legendContent).map(function (key) {
          return legendContent[key];
        });

        values.sort(function (a, b) {
          return Number(b[3]) - Number(a[3]);
        });

        for (let i = 0; i < values.length; i++) {
          let value = values[i];
          single += '<div><span style="background-color: ' + value[0] + '"></span><span>' + value[2] + '</span></div>';
        }
        if (map.boxZoom._container.id === 'left-map') {
          this.leftLegendHtml = single
        } else {
          this.rightLegendHtml = single
        }
      },
      updateInfoLabel() {
        let baseTime = moment(this.dateValue).add(this.ftvalue, 'hours');
        let iValArr = this.intervalValue.split('-');
        let iStart = iValArr[0];
        let iEnd = iValArr[1];
        let i = Number(iEnd) - Number(iStart);

        let startTimeValue = baseTime.add(iStart, 'hours').format('M月D日HH时');
        let endTimeValue = baseTime.add(i, 'hours').format('M月D日HH时');
        let timeRangeHtml = '';
        if (this.instantFac()) {
          timeRangeHtml = endTimeValue;
        } else {
          timeRangeHtml = startTimeValue + " ~ " + endTimeValue;
        }
        this.timeRangeHtml = timeRangeHtml + this.getFacShortName()
      },
      getFacShortName() {
        let facValue = this.facValue;
        if (facValue === 'TMP') {
          return '温度';
        } else if (facValue === 'TMAX') {
          return '24小时最高温';
        } else if (facValue === 'TMIN') {
          return '24小时最低温';
        } else if (facValue === 'ER03') {
          return '3小时累计降雨';
        } else if (facValue === 'ER12') {
          return '12小时累计降雨';
        } else if (facValue === 'ER24') {
          return '24小时累计降雨';
        } else if (facValue === 'EDA10') {
          return '风';
        }
      },
      async submit() {
        this.openTooltips = [];
        this.popups = [];
        this.updateInfoLabel();

        if (this.type === '格点') {
          await this.getLiveGribData();
        } else {
          await this.getLiveObtData();
        }
        this.renderMap(this.leftMap);
        this.renderMap(this.rightMap);
        // updateDataType();
      },
      backToCenter() {
        this.fitBounds(this.wfMaps)
      },
      async getLiveGribData() {
        let data = this.getGribLiveRequestData();
        await liveGribData(data).then(res => {
          if (res.code === 1 && res["data"].length > 0) {
            this.liveData = this.parseOriginalData(res["data"][0]);
          } else {
            this.liveData = null;
            this.$message.warning('查无此时段格点实况数据');
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getGribLiveRequestData() {
        let ddatetime;
        let facname;
        let table;

        //预报时次
        let ftvalue = this.ftvalue;
        //预报时段数组
        let intervalArr = this.intervalValue.split('-');

        //预报时次预报时段相加
        let foreHours = Number(intervalArr[1]) + Number(ftvalue);

        //小时数据
        if ((intervalArr[1] - intervalArr[0]) === 3 || (intervalArr[1] - intervalArr[0]) === 12) {
          table = 'live.tb_grib_hourd';
          ddatetime = moment(this.dateValue).add(foreHours, 'hours').format('YYYYMMDDHH');
          //天数据
        } else if ((intervalArr[1] - intervalArr[0]) === 24) {
          table = 'live.tb_grib_dayd';
          ddatetime = moment(this.dateValue).add(foreHours, 'hours').format('YYYYMMDDHH');
        }

        //获取实况要素名称
        facname = this.getLiveGribFacname();

        return {
          table: table,
          ddatetime: ddatetime,
          facname: facname,
        };
      },
      fitBounds(wfmaps) {
        let hnbounds = L.latLngBounds(new L.LatLng(30.25, 108.65), new L.LatLng(24.5, 114.4));
        for (let key in wfmaps) {
          if (wfmaps.hasOwnProperty(key)) {
            let wfmap = wfmaps[key];
            wfmap.invalidateSize();
            wfmap.fitBounds(hnbounds);
          }
        }
      }
    },
    computed: {
      // 不同要素不同的时段间隔
      intervalOptions() {
        let f = this.facValue;
        if (f === 'ER03' || f === 'TMP' || f === 'EDA10') {
          return this.getIntervalOpt(240, 3);
        } else if (f === 'ER12') {
          return this.getIntervalOpt(240, 12);
        } else {
          return this.getIntervalOpt(240, 24);
        }
      },
      wfInterval() {
        let intervalArr = this.intervalValue.split('-');
        return intervalArr[1] - intervalArr[0];
      }
    },
    watch: {
      isShowGribColor() {
        this.submit()
      },
      isShowGribValue() {
        this.submit()
      },
      isDiffValue() {
        this.submit()
      },
      isShowObtname() {
        this.submit()
      }
    },
    created() {
      this.$nextTick(() => {

        window.drawSeries = this.drawSeries
        this.leftMap = this.initMap('left-map')
        this.leftMap.dataSrcCode = this.leftModel
        this.rightMap = this.initMap('right-map')
        this.rightMap.dataSrcCode = this.model
        this.wfMaps.push(this.leftMap)
        this.wfMaps.push(this.rightMap)
        this.linkMap(this.wfMaps)
        this.fitBounds(this.wfMaps)
        this.submit()
        // this.getLiveObtData()
        // this.getWFData()
        // this.renderMap(this.leftMap)


        // let leftBottom = L.control({
        //   position: 'bottomleft'
        // })
        // leftBottom.onAdd = function() {
        //   this._div = L.DomUtil.create('div', 'left-legend');
        //   this._div.innerText = "55555\n66666"
        //   return this._div
        // }
        // leftBottom.addTo(left)

      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .daily-comparision-head {
    position: relative;
    height: 25px;

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100px;
    }

    .el-date-editor .el-input__inner {
      border-radius: 2px 0 0 2px;
    }

    .el-menu {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: none;
      background-color: transparent;

      .el-menu-item:first-child {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 30px 0 0;

        > .add-button {
          display: flex;
          flex-direction: column;
          height: 100%;

          .el-button {
            width: 20px;
            height: 50%;
            line-height: 50%;
            font-size: 12px;
            padding: 0;
            margin-left: -1px;
            border-radius: 0 0 2px 0;
          }

          .el-button:focus {
            border-color: #DCDFE6;
          }

          .el-button:first-child {
            border-bottom: none;
            border-radius: 0 2px 0 0;
          }
        }
      }

      .el-menu-item:nth-child(n + 2) {
        .el-input__inner {
          width: 125px;
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
      }

      .el-menu-item:nth-child(3) {
        .el-input__inner {
          width: 82px;
        }
      }
    }

    .el-menu--horizontal > .el-menu-item {
      border-bottom: none;
      color: #303133;
      height: 25px;
      line-height: 25px;
    }

    .el-menu-item {
      cursor: default;
      font-size: 14px;
      padding: 0 30px;
    }

    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }

  }

  .daily-comparision-middle {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    background-color: @bgColor;
    margin-bottom: 20px;

    > span {
      margin-left: 20px;
      vertical-align: top;
    }

    .el-menu {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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
      font-size: 14px;
    }

    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }

    .el-radio-button__inner {
      padding: 0;
      width: 58px;
      height: 20px;
      line-height: 20px;
      box-sizing: content-box;
    }

    .el-checkbox__label {
      padding-left: 1px;
    }

    .el-slider {
      display: inline-block;
      margin-left: 10px;
      width: 150px;
    }

    .el-button {
      padding: 3px 10px;
    }
  }

  .daily-comparision-bottom {
    position: relative;
    height: calc(100% - 131px);

    #left-map {
      float: left;
      width: 49.8%;
      height: 100%;
    }

    .left-legend, .right-legend {
      position: absolute;
      display: inline-block;
      left: 10px;
      bottom: 10px;
      z-index: 1000;
      border: 1px solid #b0b0b0;
      background-color: #ffffff;
      border-radius: 3px;
      box-shadow: 0px 0px 10px #F8F8F8;

      .panel-title {
        text-align: center;
        color: @mfColor;
        font-size: 13px;
        padding: 5px;
      }

      .panel-article > div {
        text-align: center;
        margin: 3px 0;
        padding: 0 5px;
        overflow: hidden;
        font-size: 12px;
        height: 15px;
        white-space: nowrap;
      }

      .panel-article > div span:first-child {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        width: 15px;
        height: 15px;
        float: left;
      }

      .panel-article > div span:last-child {
        margin-left: 5px;
        color: @mfColor;
        line-height: 15px;
        vertical-align: middle;
      }
    }

    #right-map {
      float: right;
      width: 49.8%;
      height: 100%;
    }

    .right-legend {
      left: auto;
      right: 10px;
    }

    .left-info-panel, .right-info-panel {
      position: absolute;
      color: @mfColor;
      z-index: 1000;
      top: 20px;
    }

    .left-info-panel {
      left: 1%;
    }

    .right-info-panel {
      left: 51%;
    }

    .model-select {

      .el-input__inner {
        border: 1px solid #409EFF;
        height: 25px;
        line-height: 25px;
        padding: 0 0 0 10px;
        color: #409EFF;
        font-size: 12px;
        border-radius: 2px;
      }

      .el-input__icon {
        width: auto;
        line-height: 25px;
      }

      .el-icon-arrow-up:before {
        content: "\e790";
        color: #409EFF;
        font-size: 12px;
      }

      .el-popper[x-placement^=bottom] {
        margin-top: 5px;
      }

      .el-select-dropdown__item {
        font-size: 12px;
        color: #000;
        padding: 0 10px;
        height: 28px;
        line-height: 28px;
      }

      .el-select-dropdown {
        border: 1px solid #409EFF;
        border-radius: 2px;
        left: 0 !important;
      }

      .el-popper .popper__arrow, .el-popper .popper__arrow::after {
        display: none;
      }

      .el-select-dropdown__wrap {
        max-height: none;
      }

      .el-scrollbar__bar {
        display: none;
      }

      .el-select-dropdown__item.hover {
        background-color: #fff;
      }

      .el-select-dropdown__item:hover {
        width: 90%;
        margin: 0 auto;
        color: #fff;
        background-color: #409EFF;
      }

      .el-select-dropdown__item.selected {
        width: 90%;
        margin: 0 auto;
        background-color: #409EFF;
        color: #fff;
        font-weight: normal;
        border-radius: 2px;
      }
    }

    .model-select-right {
      position: absolute;
      top: 20px;
      right: 10px;
      z-index: 1000;
      width: 115px;
    }

    .model-select-left {
      position: absolute;
      top: 20px;
      right: 51%;
      z-index: 1000;
      width: 115px;
    }

    .model-select-fm {
      position: absolute;
      top: 53%;
      right: 10px;
      z-index: 1000;
      width: 115px;
    }

    .result-content {
      position: absolute;
      left: 51%;
      bottom: 10px;
      z-index: 1000;
      border-radius: 4px;
      padding: 6px;
      background-color: #fff;
      box-shadow: 0 0 4px #b0b0b0;

      > span {
        display: inline-block;
        font-weight: 700;
        color: #409EFF;
        margin: 0 0 8px 8px;
      }

      > div {
        font-size: 12px;
        background-color: #F8F8F8;
        margin-bottom: 5px;

        > span:first-child {
          display: inline-block;
          margin-left: 8px;
        }

        > span:last-child {
          display: inline-block;
          float: right;
          color: @mfColor;
          margin-right: 8px;
        }
      }

    }
  }

  .point-div {
    text-align: center;
    white-space: nowrap;
  }

  .obt-color {
    width: 8px;
    height: 8px;
    display: inline-block;
    white-space: nowrap;
    border-radius: 100%;
    transition: all 0.2s;
  }

  .point-div:hover .obt-color, .point-div:hover .grid-color {
    width: 10px;
    height: 10px;
  }

  .grid-color {
    width: 8px;
    height: 8px;
    display: inline-block;
    white-space: nowrap;
    transition: all 0.2s;
  }

  .obt-value {
    white-space: nowrap;
    line-height: 100%;
    width: auto !important;
    height: auto !important;
  }

  .obt-name {
    color: #1974d8;
    font-size: 8px;
    -webkit-transform: scale(0.8);
  }

  .obt-count {
    -webkit-transform: scale(0.8);
    font-size: 14px
  }

  .valuechart {
    display: inline-block;
    border-radius: 2px;
    padding: 3px;
    color: white;
    line-height: 14px;
    background-color: #0a73c2;
    cursor: pointer;
    margin: 0 5px;
  }

  .valuechart:hover {
    background-color: #0a8fde;
  }

  .el-message-box__header {
    background-color: #F9F7F9;
  }

  .el-message-box {
    width: min-content;
  }

</style>