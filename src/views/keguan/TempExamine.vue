<template>
  <div class="tmp-content">
    <side-bar :items="items"/>
    <div class="side-content">
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
          </el-menu>
          <div style="padding-left: 20px">
            <span>检验要素：</span>
            <el-radio-group v-model="jyys" @change="changeJyys" v-show="jysx == '24'">
              <el-radio-button label="maxtsst" v-show="jyx === 'jqpf'">最高温平均绝对误差技巧</el-radio-button>
              <el-radio-button label="mintsst" v-show="jyx === 'jqpf'">最低温平均绝对误差技巧</el-radio-button>
              <el-radio-button label="maxtok2" v-show="jyx === 'fxzl'">最高小于2度准确率</el-radio-button>
              <el-radio-button label="maxtok1" v-show="jyx === 'fxzl'">最高小于1度准确率</el-radio-button>
              <el-radio-button label="mintok2" v-show="jyx === 'fxzl'">最低小于2度准确率</el-radio-button>
              <el-radio-button label="mintok1" v-show="jyx === 'fxzl'">最低小于1度准确率</el-radio-button>
              <el-radio-button label="maxtmae" v-show="jyx === 'fxzl'">最高温平均绝对误差</el-radio-button>
              <el-radio-button label="maxtrmse" v-show="jyx === 'fxzl'">最高温均方根误差</el-radio-button>
              <el-radio-button label="mintmae" v-show="jyx === 'fxzl'">最低温平均绝对误差</el-radio-button>
              <el-radio-button label="mintrmse" v-show="jyx === 'fxzl'">最低温均方根误差</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="jyys" @change="changeJyys" v-show="jysx != '24'">
              <el-radio-button label="sst" v-show="jyx === 'jqpf'">平均绝对误差技巧</el-radio-button>
              <el-radio-button label="ok2" v-show="jyx === 'fxzl'">小于2度准确率</el-radio-button>
              <el-radio-button label="ok1" v-show="jyx === 'fxzl'">小于1度准确率</el-radio-button>
              <el-radio-button label="mae" v-show="jyx === 'fxzl'">平均绝对误差</el-radio-button>
              <el-radio-button label="rmse" v-show="jyx === 'fxzl'">均方根误差</el-radio-button>
            </el-radio-group>
          </div>
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
              <!--            <span style="vertical-align: middle; margin-left: 10px">0~24时</span>-->
              <el-checkbox-group v-model="ftime" @change="changeJysd">
                <el-checkbox v-for="item in ftimeView" :label="item">{{item == '0' ? '综合' : item + '时'}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>

        <div class="footer"
             v-loading="loading"
             element-loading-text="加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(248, 248, 248, 0.8)"
             custom-class="loading-class-custom"
        >
          <div class="highcharts-title">
            <div class="maintitle">{{mainTitle}}</div>
            <div class="subtitle">{{subTitle}}</div>
          </div>
          <div class="highcharts-content" v-show="isMask" style="text-align: center;line-height: 312px;">
            暂无评分
          </div>
          <div class="highcharts-content" v-show="!isMask">
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
  import * as Basic from "../../common/Base"
  import moment from "momnet"
  import {getTempHttp} from "../../network/keguan";
  import * as Utils from "../../common/utils";
  import * as types from "../../store/mutation-types";

  let placeName = {
    maxtok2: '最高小于2度准确率',
    maxtok1: '最高小于1度准确率',
    mintok2: '最低小于2度准确率',
    mintok1: '最低小于1度准确率',
    maxtmae: '最高温平均绝对误差',
    maxtrmse: '最高温均方根误差',
    mintmae: '最低温平均绝对误差',
    mintrmse: '最低温均方根误差',
    ok2: '小于2度准确率',
    ok1: '小于1度准确率',
    sst: '平均绝对误差技巧',
    maxtsst: '最高温平均绝对误差技巧',
    mintsst: '最低温平均绝对误差技巧',
    rmse: '均方根误差',
    mae: '平均绝对误差'
  }
  export default {
    name: "RainScore",
    components: {
      "side-bar": MenuList
    },
    data() {
      return {
        items: [
          {img: require('../../assets/img/tem.png'), text: '温度评分', index: 'tmpScore'},
          {img: require('../../assets/img/ybsk.png'), text: '预报及实况监测', index: 'monitor'}
        ],
        isMask: false,
        isJq: true,
        mainTitle: '',
        subTitle: '',
        startDate: Date.now() - 24 * 60 * 60 * 1000 * 7,
        endDate: Date.now() - 24 * 60 * 60 * 1000,
        // startDate: '2021-03-01',
        // endDate: '2021-03-15',
        jyx: 'jqpf',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        options: [
          {value: 'jqpf', label: '技巧评分'},
          {value: 'fxzl', label: '分项质量'}
        ],
        ybsc: 'zh',
        jysx: 1,
        jycp: 'BBBUSI',
        jyys: 'sst',
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
        loading: true,
        data: null,
        active: '',
        isZhuri: false,
        tableHeader: {},
        tableData: []
      }
    },
    methods: {
      changeDate() {
        this.isMask = false
        this.getTempData()
      },
      changeValue(isZhuri) {
        this.isZhuri = isZhuri
        if (isZhuri) {
          this.getTempData()
        } else {
          this.initFtime()
          this.active = '0~24时'
          this.getTempData()
        }
      },
      changJyx(val) {
        if (val === 'fxzl') {
          if (this.jysx != '24') {
            this.jyys = 'ok2'
          } else {
            this.jyys = 'maxtok2'
          }
          this.isJq = false
        } else {
          if (this.jysx != '24') {
            this.jyys = 'sst'
          } else {
            this.jyys = 'maxtsst'
          }
          this.isJq = true
        }
        this.updateTitle()
        this.getTempData()
      },
      changeJysd(val) {
        if (val.length === 0) {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
        this.initEcharts()
      },
      changeJycp(val) {
        this.isMask = false

        this.getTempData()
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
        this.getTempData()
      },
      changeJysx(val) {
        this.switchStatus = true
        if (this.jyx === 'fxzl') {
          if (val != '24') {
            this.jyys = 'ok2'
          } else {
            this.jyys = 'maxtok2'
          }
        } else {
          if (val != '24') {
            this.jyys = 'sst'
          } else {
            this.jyys = 'maxtsst'
          }
        }
        this.ftime = []
        let ftimes = 24 / val
        for (let i = 0; i <= ftimes; i++) {
          if (i === 0 && val === '24') continue
          this.ftime.push(i * val)
        }
        this.ftimeView = this.ftime
        this.getTempData()
      },
      changeJyys() {
        this.loading = true
        this.updateTitle()
        this.getTempData()
        this.loading = false
      },
      changeModes(modes) {
        this.$store.commit(types.changeModes, modes)
        this.initEcharts()
      },
      getTempData() {
        this.isMask = false
        this.loading = true
        let {startDate, endDate, jysx, jyys, ybsc, ftime, jycp, isZhuri} = this
        this.updateTitle()
        getTempHttp(startDate, endDate, ybsc, ftime, jysx, jyys, jycp, isZhuri).then(res => {
          console.log(res.data)
          if (res.data.length === 0) {
            this.isMask = true
            return
          }
          this.$store.commit({type: types.updateModes, data: res.data, jyx: this.jyx})
          this.data = res.data
          this.initFtime()
          this.initEcharts()
        }).catch(err => {
          console.log(err);
        })
        this.loading = false
      },
      updateTitle() {
        let {startDate, endDate, jysx, jyys, ybsc} = this
        let startStr = moment(startDate).format("YYYY-MM-DD")
        let endStr = moment(endDate).format("YYYY-MM-DD")
        let ybscName = ''
        ybsc === 'zh' ? ybscName = '综合' : ybscName = ybsc + '(北京时)'
        this.mainTitle = '湖南省' + jysx + '小时' + placeName[jyys]
        this.subTitle = '起报时间：' + startStr + '至' + endStr + '逐' + jysx + '时 ' + ybscName
      },
      changeType() {
        this.initEcharts()
      },
      initTable() {
        this.ftime.sort((a, b) => a - b)
        this.tableHeader = {}
        this.tableData = []
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
        this.getTempData()
      }
    },
    created() {
      this.initFtime()
      this.$store.state.modelViews = []
      this.$nextTick(() => {
        this.getTempData()
      })
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/tmp";
</style>