<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
        <el-link target="_blank" @click="" style="float: right;">评定方法</el-link>
        <el-button type="primary" size="mini" @click="" style="float: right; margin-right: 80px">预警详细信息</el-button>
      </div>
      <hr>
      <div class="warning-detail-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="type" @change="changeType">
              <el-radio-button label="all">所有类型</el-radio-button>
              <el-radio-button label="rainstorm">暴雨</el-radio-button>
              <el-radio-button label="blizzard">暴雪</el-radio-button>
              <el-radio-button label="codeWave">寒潮</el-radio-button>
              <el-radio-button label="lowTemp">低温雨雪冰冻</el-radio-button>
              <el-radio-button label="highTemp">高温</el-radio-button>
              <el-radio-button label="strongConvection">强对流</el-radio-button>
              <el-radio-button label="heavyFog">大雾</el-radio-button>
              <el-radio-button label="haze">霾</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>预警等级：</span>
            <el-radio-group v-model="level" @change="changeLevel">
              <el-radio-button label="all">所有等级</el-radio-button>
              <el-radio-button label="blue">蓝色</el-radio-button>
              <el-radio-button label="yellow">黄色</el-radio-button>
              <el-radio-button label="orange">橙色</el-radio-button>
              <el-radio-button label="red">红色</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="warning-detail-bottom">
        <el-table
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center', backgroundColor: '#39A5F8', color: '#FFF'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  prop="date"
                  label="日期">
          </el-table-column>
          <el-table-column
                  prop="type"
                  label="类型">
          </el-table-column>
          <el-table-column
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column
                  prop="factCity"
                  label="实况地市">
          </el-table-column>
          <el-table-column
                  prop="factDistrict"
                  label="实况县">
          </el-table-column>
          <el-table-column
                  prop="forecastLevel"
                  label="预警等级">
          </el-table-column>
          <el-table-column
                  prop="factLevel"
                  label="实况等级">
          </el-table-column>
          <el-table-column
                  prop="examineLevel"
                  label="检验等级">
          </el-table-column>
          <el-table-column
                  prop="rs"
                  label="检验结果">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker";
  import moment from "momnet";
  export default {
    name: "WarningDetail",
    components: {
      DatePicker
    },
    data() {
      return {
        type: 'all',
        level: 'all',
        tableData: [{
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员1',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
            date: '2018-10-13',
            type: '大雾',
            forecaster: '预报员2',
            factCity: '湘西州',
            factDistrict: '龙山县',
            forecastLevel: '黄色',
            factLevel: '黄色',
            examineLevel: '黄色',
            rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }, {
          date: '2018-10-13',
          type: '大雾',
          forecaster: '预报员2',
          factCity: '湘西州',
          factDistrict: '龙山县',
          forecastLevel: '黄色',
          factLevel: '黄色',
          examineLevel: '黄色',
          rs: 'NA',
        }]
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        let startStr = moment(startTime).format("YYYY-MM-DD")
        let endStr = moment(endTime).format("YYYY-MM-DD")
        console.log(startStr)
        console.log(endStr)
      },
      changeType(type) {
        alert(type)
      },
      changeLevel(level) {
        alert(level)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .warning-detail-middle {
    position: relative;
    height:60px;
    background-color: @bgColor;
    margin-bottom: 20px;
    >span {
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
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }
    .el-radio-button__inner {
      font-size: 14px;
      padding: 3px 19px;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
    }
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0;
    }
    .el-radio-button__inner:hover {
      color: #49afcd;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #49afcd;
      border-color: #49afcd;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover {
      color: #fff;
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      box-shadow: none;
    }
  }
  .warning-detail-bottom {
    height: calc(100% - 141px);
    background-color: @bgColor;

  }
</style>