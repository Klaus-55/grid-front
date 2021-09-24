<template>
  <div class="model-body">
    <div class="wrapper">
      <div class="wf-cont">
        <div id="chartCon">
          <div style="text-align: center; font-size: 18px">
            {{this.year + '年' + this.titleMonth + ' ' + this.hour + '时段' + ' ' + this.sel3}}
          </div>
          <div id="chart" style="min-width: 100%; min-height:380px">

          </div>
        </div>
        <div style="width: 100%; height: 50px; text-align: center;">
          <div style="display: inline-block; padding: 5px">
            <div class="time-period-radio">
              <!--              <span>检验时段：</span>-->
              <el-radio-group v-model="month" @change="changeTimePeriod">
                <el-select v-model="year" @change="changeYear">
                  <el-option
                          v-for="item in years"
                          :key="item"
                          :label="item + '年'"
                          :value="item"></el-option>
                </el-select>
                <el-radio-button label="1">1月</el-radio-button>
                <el-radio-button label="2">2月</el-radio-button>
                <el-radio-button label="3">3月</el-radio-button>
                <el-radio-button label="s1">第1季度</el-radio-button>
                <el-radio-button label="4">4月</el-radio-button>
                <el-radio-button label="5">5月</el-radio-button>
                <el-radio-button label="6">6月</el-radio-button>
                <el-radio-button label="s2">第2季度</el-radio-button>
                <el-radio-button label="fy">上半年</el-radio-button>
                <el-radio-button label="7">7月</el-radio-button>
                <el-radio-button label="8">8月</el-radio-button>
                <el-radio-button label="9">9月</el-radio-button>
                <el-radio-button label="s3">第3季度</el-radio-button>
                <el-radio-button label="10">10月</el-radio-button>
                <el-radio-button label="11">11月</el-radio-button>
                <el-radio-button label="12">12月</el-radio-button>
                <el-radio-button label="s4">第4季度</el-radio-button>
                <el-radio-button label="sy">下半年</el-radio-button>
                <el-radio-button label="all">全年</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        <hr style="margin: 3px 0 10px 0;">
        <div id="chose">
          <div style="display: inline-block;  ">
            <div id="hourCon" style="width: 220px; text-align: center">
              <span @click="changeHour('0-72')" :class="{btOnOk: hour === '0-72'}" style="display: block">0-72时段</span>
              <span @click="changeHour('24')" :class="{btOnOk: hour === '24'}" style="display: inline-block; width: 70px">0-24时段</span>
              <span @click="changeHour('48')" :class="{btOnOk: hour === '48'}" style="display: inline-block; width: 70px">24-48时段</span>
              <span @click="changeHour('72')" :class="{btOnOk: hour === '72'}" style="display: inline-block; width: 70px">48-72时段</span>
            </div>

            <div style="margin: 2px 0">
              <!--<select name="fehou" id="fehou" style="width: 90px; font-size: 13px;">
                                <option value="24">0-24时段</option>
                <option value="48">24-48时段</option>
                <option value="72">60-72时段</option>
                <option value="0-72">60-72时段</option>
                            </select> -->

              <select name="sel1" id="sel1" style="width: 110px; font-size: 13px;" @change="changeSel1">
                <option value="1">国家站</option>
                <option value="4">格点</option>
                <option value="2">骨干站</option>
                <option value="3">自动站</option>
                <!--                <option value="1110" disabled>自选站</option>-->
              </select>

              <select name="sel3" id="sel3" style="width: 110px; font-size: 13px;" @change="changeSel3">
                <option value="1111" go="技巧评分">技巧评分</option>
                <option value="10000" go="分项质量">分项质量</option>
              </select>
            </div>
          </div>
          <div id="chosbox">
            <el-checkbox-group v-model="checkedFacs" @change="changeFactory">
              <el-checkbox v-for="fac in factories" :label="fac" :key="fac">{{facValue[fac]}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {keyValue, quality, skill} from "../../../common/vars";
  import moment from "momnet";
  import {modelScore} from "../../../network/zhongduan";
  import HighchartsNoData from "highcharts/modules/no-data-to-display";
  import Highcharts from "highcharts";
  import {initRadios, initYears} from "../../../common/utils";

  export default {
    name: "ModelExamination",
    data() {
      return {
        hour: '0-72',
        checkedFacs: skill,
        factories: skill,
        facValue: keyValue,
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        rMonth: moment().month() + 1,
        radios : [],
        titleMonth: (moment().month() + 1) + '月',
        sel1: '1',
        sel3: '技巧评分',
        rtc: '1',
        data: {}
      }
    },
    methods: {
      changeHour(hour) {
        this.hour = hour
        this.getModelScore()
      },
      changeSel1() {
        let doc = document.getElementById('sel1');
        let index = doc.selectedIndex
        this.sel1 = doc.options[index].value
        this.getModelScore()
      },
      changeFactory() {
        let orderArr
        if (this.sel3 == '技巧评分') {
          orderArr = skill
        } else {
          orderArr = quality
        }
        let checkedFac = []
        for (let i = 0; i < orderArr.length; i++) {
          if (this.checkedFacs.indexOf(orderArr[i]) !== -1) {
            checkedFac.push(orderArr[i])
          }
        }
        this.checkedFacs = checkedFac
        this.initEcharts()
      },
      changeSel3() {
        let doc = document.getElementById('sel3');
        let index = doc.selectedIndex;
        this.sel3 = doc.options[index].text
        if (this.sel3 === '技巧评分') {
          this.checkedFacs = skill
          this.factories = skill
        } else {
          this.checkedFacs = ["qyzql", "genzql", "stormzql", "tmaxtzql", "tmintzql"]
          this.factories = quality
        }
        this.getModelScore()
      },
      changeTimePeriod() {
        let doc = document.getElementsByClassName('el-radio-button');
        for (let i = 0; i < doc.length; i++) {
          if (doc[i].classList.contains('is-active')) {
            let text = doc[i].innerText;
            this.titleMonth = text
            if (text.search('季度') !== -1) {
              this.rtc = 2
              this.rMonth = parseInt(text.substr(1, 2)) * 3
            } else if (text.search('半年') !== -1) {
              this.rtc = 3
              if (text == '上半年') {
                this.rMonth = 6
              } else {
                this.rMonth = 12
              }
            } else if (text == '全年') {
              this.rtc = 4
              this.rMonth = 12
            } else {
              this.rtc = 1
              this.rMonth = this.month
            }
          }
        }
        this.getModelScore()
      },
      changeYear() {
        this.getModelScore()
      },
      getModelScore() {
        // console.log(this.year, this.rMonth, this.hour, this.sel1, this.rtc, this.sel3)
        modelScore(this.year, this.rMonth, this.hour, this.sel1, this.rtc, this.sel3).then(res => {
          this.data = res.data
          this.initEcharts()
        }).catch(err => {
          console.log(err)
        })
      },
      initEcharts() {
        let categories = this.data.categories
        let data = this.data.data
        let series = []
        if (data.length > 0) {
          for (const fac of this.checkedFacs) {
            let seriesItem = {}
            seriesItem.name = this.facValue[fac]
            seriesItem.data = []
            for (const username of categories) {
              for (const obj of data) {
                if (username == obj.username) {
                  seriesItem.data.push(obj[fac] > 100 ? NaN : obj[fac])
                }
              }
            }
            series.push(seriesItem)
          }
        }
        let options = {
          chart: {
            type: 'column',
            plotBackgroundColor: '#E2FCD5'
          },
          credits: {
            enabled: false
          },
          lang: {
            noData: '暂无数据'
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: categories,
            crosshair: true
          },
          yAxis: {
            // min: 0,
            title: {
              text: this.sel3
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
            },
            series: {
              dataLabels: {
                enabled: true
              }
            }
          },
          series: series
        }
        HighchartsNoData(Highcharts)
        Highcharts.chart('chart', options);
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getModelScore()
      })
    }
  }
</script>

<style lang="less">
  .model-body {
    float: left;
    width: calc(100% - 226px);
    height: calc(100% - 26px);
    border: 13px solid #ececec;
  }

  .wrapper {
    background-color: white;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0 0 15px rgba(43, 134, 219, 0.15);
  }

  #home {
    background-color: #FFFFFF;
  }

  .wf-cont {
    margin: 10px;
    /*margin-top:50px;*/
    /*height:80%;*/
    background-color: #ffff;
  }

  #hourCon {
    color: #2A6496;
  }

  #hourCon span {
    background-color: #f6f6f6;
    display: inline-block;
    font-size: 13px;
    padding: 4px;
    border-radius: 4px;
    margin: 2px 0px;
    box-sizing: border-box;
  }

  #hourCon span:hover {
    /*color: black;*/
    cursor: pointer;
    background-color: #EEEEEE;
  }

  #hourCon span:focus {
    outline: none;
  }

  #buttonGroup button {
    padding: 0 12px;
  }

  #chose {
    color: #585858 !important;
    overflow: hidden;
    /*margin-left: 65px;*/

    text-align: center;
  }
  #chose select {
    color: #585858 !important;
  }

  #chosbox {
    display: inline-block;
    width: 40%;
    vertical-align: top;
    padding-left: 20px;
    text-align: left;
  .el-checkbox {
    color: #303133;
  }
  .el-checkbox__inner {
    width: 11px;
    height: 11px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: transparent;
    border-color: #DCDFE6;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #DCDFE6;
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
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #303133;
  }
  }

  #chosbox label {
    height: 25px;
    line-height: 25px;
    /*width: 200px;*/
    font-size: 13px;
    white-space: nowrap;
    margin: 0 5px 4px 5px;
    float: left;
  }
  #chosbox label > input {
    vertical-align: middle;
    margin-right: 3px;
  }

  select {
    border: solid 1px #EEEEEE;
    border-radius: 3px;
    padding: 5px 14px 5px 5px;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: url("../../../assets/img/select.png") no-repeat scroll right center transparent;
  }

  select::-ms-expand {
    display: none;
  }

  .layui-btn-group button:hover {
    color: #FFFF;
    background-color: #EEDD78;
  }

  .btOnOk {
    color: #FFFF;
    background-color: #428BCA !important;
  }

  .btOnOk2 {
    color: black;
    background-color: #F49F42;
  }

  .time-period-radio {
  .el-select {
    vertical-align: middle;
  }
  .el-input__inner {
    width: 65px;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    background-color: #F8F8F8;
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
    color: #49AFCD;
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
    background: #F8F8F8;
    padding: 0;
  }
  }
</style>