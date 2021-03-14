<template>
  <div class="qdl-content">
    <side-bar @changeFac="changeFac" :items="items"/>
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
        </div>
        <hr>
        <div class="middle">
          <el-menu mode="horizontal">
            <el-menu-item>
              <span>预报时次：</span>
              <el-radio-group v-model="ybsc" @change="changeYbsc">
                <el-radio-button label="zh">综合</el-radio-button>
                <el-radio-button label="02">02时</el-radio-button>
                <el-radio-button label="08">08时</el-radio-button>
                <el-radio-button label="14">14时</el-radio-button>
                <el-radio-button label="20">20时</el-radio-button>
              </el-radio-group>
            </el-menu-item>
            <el-menu-item>
              <span>检验时效：</span>
              <el-radio-group v-model="jysx">
                <el-radio-button label="1">1H</el-radio-button>
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
              <el-radio-group v-model="jyys" @change="changeJyyx" v-show="jyx === 'jqpf'">
                <el-radio-button label="spo">命中率技巧</el-radio-button>
                <el-radio-button label="sfa">空报率技巧</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="jyys" @change="changeJyyx" v-show="jyx === 'fxzl'">
                <el-radio-button label="pod">命中率</el-radio-button>
                <el-radio-button label="far">空报率</el-radio-button>
              </el-radio-group>
            </el-menu-item>
          </el-menu>
          <div class="jysd">
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                      v-model="switchStatus"
                      @change="switchChange"
                      active-text="0~12时"
                      active-color="#03B452"
                      inactive-color="#7E7772">
              </el-switch>
              <!--            <span style="vertical-align: middle; margin-left: 10px">0~24时</span>-->
              <el-checkbox-group v-model="ftime" @change="changeJysd">
                <el-checkbox v-for="item in ftimeView" :label="item">{{item}}时</el-checkbox>
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
            <el-checkbox-group v-model="modes" @change="changeModes">
              <el-checkbox v-for="(zwname, mode) in modeViews" :label="mode">{{zwname}}</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="showType" size="mini">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div id="grid-chart" style="width: 100%; height: calc(100% - 50px)">

            </div>
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
  import {getHeavyHttp} from "../../network/keguan";

  let placeName = {
    spo: '短时强降水命中率技巧',
    sfa: '短时强降水空报率技巧',
    pod: '短时强降水空报率',
    far: '短时强降水空报率',
  }
  export default {
    name: "RainScore",
    components: {
      "side-bar": MenuList
    },
    data() {
      return {
        items: [
          {img: require('../../assets/img/rain.png'), text: '短时强降水评分', index: 'RAT'},
          {img: require('../../assets/img/rain.png'), text: '雷暴大风', index: 'SMG'},
          {img: require('../../assets/img/ybsk.png'), text: '预报及实况监测', index: 'monitor'}
        ],
        isMask: false,
        mainTitle: '',
        subTitle: '',
        startDate: Date.now() - 24 * 60 * 60 * 1000 * 7,
        endDate: Date.now() - 24 * 60 * 60 * 1000,
        // startDate: '2020-04-02',
        // endDate: '2020-04-10',
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
        facname: 'RAT',
        ybsc: 'zh',
        jysx: 1,
        jycp: 'BBBUSI',
        jyys: 'spo',
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
        modes: [
          // '中央台','省台指导', '地市订正', '欧洲中心', 'GRAPES_GFS', 'GRAPES_3KM',
          // '华南模式', '华东模式', '省台客观DL', '省台客观0-24小时'
        ],
        modeViews: {
          // '中央台','省台指导', '地市订正', '欧洲中心', 'GRAPES_GFS', 'GRAPES_3KM',
          // '华南模式', '华东模式', '省台客观DL', '省台客观0-24小时'
        },
        showType: '图表',
        loading: true,
        data: null
      }
    },
    methods: {
      changeDate() {
        this.getHeavyData()
      },
      changJyx(val) {
        if (val === 'fxzl') {
          this.jyys = 'pod'
        } else {
          this.jyys = 'spo'
        }
        this.updateTitle()
        Basic.initEcharts(this.data, this.modes, this.modeViews, this.ftime, this.jyys)

      },
      changeJysd(val) {
        if (val.length === 0) {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
        Basic.initEcharts(this.data, this.modes, this.modeViews, val, this.jyys)
      },
      changeJycp(val) {
        this.isMask = false
        this.getHeavyData()
      },
      switchChange(val) {
        if (!val) {
          this.ftime = []
        } else {
          this.ftime = []
          let ftimes = 24 / this.jysx;
          for (let i = 1; i <= ftimes; i++) {
            this.ftime.push(i * this.jysx)
          }
        }
      },
      changeYbsc() {
        console.log(process.env.NODE_ENV)
        this.getHeavyData()
      },
      changeJysx(val) {
        this.switchStatus = true
        this.jyys = 'spc'
        if (val == 1) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.ftime = []
        let ftimes = 24 / val
        for (let i = 1; i <= ftimes; i++) {
          this.ftime.push(i * val)
        }
        this.ftimeView = this.ftime
        this.getHeavyData()
      },
      changeJyyx(val) {
        let {startDate, endDate, jysx, jyys, ybsc, ftime} = this
        let startStr = moment(startDate).format("YYYY-MM-DD")
        let endStr = moment(endDate).format("YYYY-MM-DD")
        let ybscName = ''
        ybsc === 'zh' ? ybscName = '综合' : ybscName = ybsc + '(北京时)'
        this.mainTitle = '湖南省' + jysx + '小时' + placeName[jyys]
        this.subTitle = '起报时间：' + startStr + '至' + endStr + '逐' + jysx + '时 ' + ybscName
        Basic.initEcharts(this.data, this.modes, this.modeViews, this.ftime, val)
      },
      changeModes(modes) {
        Basic.initEcharts(this.data, modes, this.modeViews, this.ftime, this.jyys)
      },
      getHeavyData() {
        this.loading = true
        let {startDate, endDate, jysx, facname, ybsc, ftime, jycp} = this
        this.updateTitle()
        getHeavyHttp(startDate, endDate, ybsc, ftime, jysx, facname, jycp).then(res => {
          console.log(res.data)
          if (res.data.length === 0) {
            this.isMask = true
            return
          }
          this.modes = []
          this.modeViews = {}
          this.data = res.data
          for (let i = 0; i < this.data.length; i++) {
            if (this.modes.indexOf(this.data[i]['wfsrc']) === -1) {
              this.modes.push(this.data[i]['wfsrc'])
              this.modeViews[this.data[i]['wfsrc']] = this.data[i]['zwname']
            }
          }
          this.modes = this.modes.splice(0, 4)
          Basic.initEcharts(this.data, this.modes, this.modeViews, this.ftime, this.jyys)
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
      changeFac(facname) {
        this.facname = facname
        this.jyx = 'jqpf'
        this.ybsc = 'zh'
        this.jycp = 'BBBUSI'
        this.jyys = 'spo'
        if (facname === 'RAT') {
          placeName = {
            spo: '短时强降水命中率技巧',
            sfa: '短时强降水空报率技巧',
            pod: '短时强降水空报率',
            far: '短时强降水空报率',
          }
        } else {
          placeName = {
            spo: '雷暴大风命中率技巧',
            sfa: '雷暴大风空报率技巧',
            pod: '雷暴大风空报率',
            far: '雷暴大风空报率',
          }
        }
        this.updateTitle()
        this.getHeavyData()
      }
    },
    watch: {

    },
    created() {
      let ftimes = 12 / this.jysx;
      for (let i = 1; i <= ftimes; i++) {
        this.ftime.push(i * this.jysx)
        this.ftimeView.push(i * this.jysx)
      }
      this.$nextTick(() =>{
        this.getHeavyData()
      })
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/qdl";
</style>