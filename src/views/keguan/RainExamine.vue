<template>
  <div class="rain-content">
    <side-bar :items="items" @changeFac="changeFac"/>
    <fl-monitor v-if="isMonitor" facname="rain"/>
    <div v-else class="side-content">
      <div class="content">
        <div class="head">
          <span>选择时段：</span>
          <el-date-picker
                  v-model="startDate"
                  type="date"
                  :pickerOptions="pickerOptions"
                  placeholder="选择日期">
          </el-date-picker>
          <span style="margin: 0 10px">至</span>
          <el-date-picker
                  v-model="endDate"
                  type="date"
                  :pickerOptions="pickerOptions"
                  placeholder="选择日期">
          </el-date-picker>
          <el-button type="primary" size="mini" @click="changeDate">确定</el-button>

          <span style="margin-left: 50px">检验项：</span>
          <el-select v-model="jyx" placeholder="请选择" @change="changJyx">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
          <el-checkbox-button label="zhuri" key="zhuri" @change="changeValue">逐日检验</el-checkbox-button>
        </div>
        <hr>
        <div class="middle">
          <el-menu mode="horizontal">
            <el-menu-item>
              <span>预报时次：</span>
              <el-radio-group v-model="ybsc" @change="changeYbsc">
                <el-radio-button label="zh">综合</el-radio-button>
                <el-radio-button label="08">08时</el-radio-button>
                <el-radio-button label="20">20时</el-radio-button>
              </el-radio-group>
            </el-menu-item>
            <el-menu-item>
              <span>检验时效：</span>
              <el-radio-group v-model="jysx" @change="changeJysx">
                <el-radio-button label="1">1H</el-radio-button>
                <el-radio-button label="3">3H</el-radio-button>
                <el-radio-button label="24">24H</el-radio-button>
              </el-radio-group>
            </el-menu-item>
            <el-menu-item>
              <span>检验产品：</span>
              <el-radio-group v-model="jycp" @change="changeJycp">
                <el-radio-button label="BBBUSI">业务评估</el-radio-button>
                <el-radio-button label="TECH">技术评估</el-radio-button>
                <el-radio-button label="57687">单站评分</el-radio-button>
              </el-radio-group>
            </el-menu-item>
            <el-menu-item>
              <span>检验要素：</span>
              <el-radio-group v-model="jyys" @change="changeJyys" v-show="isJq">
                <el-radio-button label="spc">晴雨预报质量技巧</el-radio-button>
                <el-radio-button label="sts">强降水预报TS技巧</el-radio-button>
                <el-radio-button label="sbi">强降水预报BIAS技巧</el-radio-button>
                <el-radio-button v-if="isShow" label="sme">降水量预报技巧</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="jyys" @change="changeJyys" v-show="!isJq">
                <el-radio-button label="pc">晴雨预报质量</el-radio-button>
                <el-radio-button label="ts">强降水预报TS评分</el-radio-button>
                <el-radio-button label="bi">强降水预报BIAS评分</el-radio-button>
                <el-radio-button v-if="isShow" label="me">降水量预报质量</el-radio-button>
              </el-radio-group>
            </el-menu-item>
          </el-menu>
<!--          <div class="tense-list-content">-->
<!--            <span style="vertical-align: top">检验时段：</span>-->
<!--            <tense-view></tense-view>-->
<!--          </div>-->

          <div class="jysd" v-show="!isZhuri">
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                      v-model="switchStatus"
                      @change="switchChange"
                      :active-text="active"
                      active-color="#03B452"
                      inactive-color="#7E7772">
              </el-switch>
              <el-checkbox-group v-model="ftime" @change="changeJysd">
                <el-checkbox v-for="item in ftimeView" :label="item" v-if="!isZhuri">{{item == '0' ? '综合' : item + '时'}}</el-checkbox>
<!--                <el-checkbox v-for="item in ftimeView" :label="item" v-if="isZhuri">{{item + '日'}}</el-checkbox>-->
              </el-checkbox-group>
            </div>
          </div>
        </div>

        <div class="footer">
            <div class="highcharts-title">
              <div class="maintitle">{{mainTitle}}</div>
              <div class="subtitle">{{subTitle}}</div>
            </div>
            <div class="highcharts-content">
<!--              <div style="width: 100%;height: 100%;background-color: red" v-show="true"></div>-->
              <el-checkbox-group v-model="$store.state.modes" @change="changeModes">
                <el-checkbox v-for="item in $store.state.modelViews" :label="item">{{$store.getters.unitName(item)}}</el-checkbox>
              </el-checkbox-group>
              <el-radio-group v-model="showType" size="mini" @change="changeType">
                <el-radio-button label="图表"></el-radio-button>
                <el-radio-button label="表格"></el-radio-button>
              </el-radio-group>
              <div id="grid-chart" style="width: 100%; height: calc(100% - 50px)" v-show="showType === '图表'">

              </div>
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
                        v-for="(value, key) in tableHeader"
                        :prop="key"
                        :label="value"
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
  import MenuList from "../../components/menu/MenuList";
  import Tense from "../../components/tense/Tense";
  import * as Basic from "../../common/Base"
  import moment from "momnet"
  import {getAllModels, getAllModelsTest, getRainHttp} from "../../network/keguan";
  import * as Utils from "../../common/utils"
  import * as types from "../../store/mutation-types"
  import FlMonitor from "./FlMonitor";

  let placeName = {
    sme: '降水量预报技巧',
    spc: '晴雨预报质量技巧',
    sts: '强降水预报TS技巧',
    sbi: '强降水预报BIAS技巧',
    me: '降水量预报质量',
    pc: '晴雨预报质量',
    ts: '强降水预报TS评分',
    bi: '强降水预报BIAS评分'
  }
  export default {
    name: "RainScore",
    components: {
      "side-bar": MenuList,
      "tense-view": Tense,
      FlMonitor
    },
    data() {
      return {
        items: [
          {img: require('../../assets/img/rain.png'), text: '降水评分', index: 'rainScore'},
          {img: require('../../assets/img/ybsk.png'), text: '预报及实况监测', index: 'monitor'}
        ],
        isJq: false,
        mainTitle: '',
        subTitle: '',
        startDate: Date.now() - 24 * 60 * 60 * 1000 * 7,
        endDate: Date.now() - 24 * 60 * 60 * 1000,
        // startDate: '2020-04-02',
        // endDate: '2020-04-10',
        jyx: 'fxzl',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        options: [
          {value: 'jqpf', label: '技巧评分'},
          {value: 'fxzl', label: '分项质量'}
        ],
        active: '0~24时',
        ybsc: 'zh',
        jysx: 1,
        jycp: 'BBBUSI',
        jyys: 'pc',
        isShow: true,
        switchStatus: true,
        ftime: [
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
          // 14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
        ],
        ftimeView: [
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
          // 14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
        ],
        showType: '图表',
        isZhuri: false,
        data: null,
        tableHeader: {},
        tableData: [],
        isMonitor: false
      }
    },
    methods: {
      changeFac(facname) {
        if (facname === 'monitor') {
          if (!this.isMonitor) this.isMonitor = !this.isMonitor
        } else {
          if (this.isMonitor) this.isMonitor = !this.isMonitor
          this.getRainData()
        }
      },
      changeValue(isZhuri) {
        this.isZhuri = isZhuri
        if (isZhuri) {
          this.getRainData()
        } else {
          this.initFtime()
          this.active = '0~24时'
          this.getRainData()
        }
      },
      changeDate() {
        this.initFtime()
        this.getRainData()
      },
      changJyx(val) {
        if (val === 'fxzl') {
          this.isJq = false
          this.jyys = 'pc'
        } else {
          this.isJq = true
          this.jyys = 'spc'
        }
        this.updateTitle()
        this.$store.commit({type: types.updateModes, data: this.data, jyx: val})
        this.initEcharts()
      },
      changeJysd(val) {
        if (val.length === 0) {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
        this.initEcharts()
      },
      changeJycp() {
        this.getRainData()
      },
      switchChange(val) {
        if (!val) {
          this.ftime = []
        } else {
          this.initFtime()
        }
        this.initEcharts()
      },
      changeYbsc() {
        this.getRainData()
      },
      changeJysx(val) {
        this.switchStatus = true
        if (this.jyx === 'fxzl') {
          this.jyys = 'pc'
        } else {
          this.jyys = 'spc'
        }

        if (val == 1) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.initFtime()
        this.getRainData()
      },
      changeJyys() {
        this.updateTitle()
        this.initEcharts()
      },
      changeModes(modes) {
        this.$store.commit(types.changeModes, modes)
        this.initEcharts()
      },
      getRainData() {
        let loading = this.openLoading('.footer');
        let {startDate, endDate, jysx, ybsc, ftime, jycp, isZhuri} = this
        this.updateTitle()
        if (window.location.pathname.indexOf('test') === -1) {
          getAllModels().then(res => {
            this.$store.commit({type: types.initUnits, units: res.data})
            getRainHttp(startDate, endDate, ybsc, ftime, jysx, jycp, isZhuri).then(res => {
              this.$store.commit({type: types.updateModes, data: res.data, jyx: this.jyx})
              this.data = res.data
              this.initFtime()
              this.initEcharts()
              loading.close()
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          getAllModelsTest().then(res => {
            this.$store.commit({type: types.initUnits, units: res.data})
            getRainHttp(startDate, endDate, ybsc, ftime, jysx, jycp, isZhuri).then(res => {
              this.$store.commit({type: types.updateModes, data: res.data, jyx: this.jyx})
              this.data = res.data
              this.initFtime()
              this.initEcharts()
              loading.close()
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
            console.log(err)
          })
        }
      },
      updateTitle() {
        let {startDate, endDate, jysx, jyys, ybsc} = this
        let startStr = moment(startDate).format("YYYY-MM-DD")
        let endStr = moment(endDate).format("YYYY-MM-DD")
        let ybscName = ''
        ybsc === 'zh' ? ybscName = '综合' : ybscName = ybsc + '(北京时)'
        this.mainTitle = '湖南省' + jysx + '小时' + placeName[jyys]
        if (jysx === 'zh') {
          this.mainTitle = '湖南省1小时综合' + placeName[jyys]
        }
        this.subTitle = '起报时间：' + startStr + '至' + endStr + '逐' + jysx + '时 ' + ybscName
      },
      initTable() {
        this.ftime.sort((a, b) => a - b)
        this.tableData = []
        this.tableHeader = {}
        let modes = this.$store.state.modes
        for (let i = 0; i < modes.length; i++) {
          this.tableHeader[modes[i]] = this.$store.getters.unitName(modes[i])
        }
        for (let i = 0; i < this.ftime.length; i++) {
          let item = {}
          item['ftime'] = this.ftime[i] === 0 ? '综合' : this.ftime[i]
          for (let j = 0; j < modes.length; j++) {
            let res = []
            if (this.isZhuri) {
              res = this.data.filter(res => res['wfsrc'] === modes[j] && res['wfdatetime'] === this.ftime[i])
            } else {
              res = this.data.filter(res => res['wfsrc'] === modes[j] && res['wfhour'] === this.ftime[i])
            }
            if (res.length > 0) {
              item[modes[j]] = Utils.toFix(res[0][this.jyys], 3)
            } else {
              item[modes[j]] = -999.0
            }
          }
          this.tableData.push(item)
        }
      },
      initEcharts() {
        if (this.showType === '图表') {
          if (this.isZhuri) {
            Basic.initZhuri(this.data, this.ftime, this.jyys)
          } else {
            Basic.initEcharts(this.data, this.ftime, this.jyys)
          }
        } else {
          this.initTable()
        }

      },
      changeType() {
        this.initEcharts()
      },
      initFtime() {
        if (this.isZhuri) {
          this.ftime = []
          for (const dataItem of this.data) {
            if (this.ftime.indexOf(dataItem['wfdatetime']) === -1) {
              this.ftime.push(dataItem['wfdatetime'])
            }
          }
        } else {
          this.ftime = []
          this.ftimeView = []
          let ftimes = 24 / this.jysx;
          let i = 0
          if (this.jysx == 24) i = 1
          for (i; i <= ftimes; i++) {
            this.ftime.push(i * this.jysx)
            this.ftimeView.push(i * this.jysx)
          }
        }
      }
    },
    watch: {
      '$route' (to, from) {
        this.initFtime()
        this.$store.state.modelViews = []
        this.$nextTick(() =>{
          this.getRainData()
        })
      }
    },
    created() {
      this.initFtime()
      this.$store.state.modelViews = []
      this.$nextTick(() =>{
        this.getRainData()
      })
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/content";
  .tense-list-content {
    margin-left: 20px;
  }
  .table-fixed {
    /deep/.el-table__body-wrapper {
      height: calc(100% - 47px) !important;
    }
  }
</style>