<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
        <div class="head-time-period">
          <span>检验时段：</span>
          <el-radio-group v-model="period" @change="changePeriod">
            <el-radio-button label="24">24小时</el-radio-button>
            <el-radio-button label="48">48小时</el-radio-button>
            <el-radio-button label="72">72小时</el-radio-button>
            <el-radio-button label="h72">0-72小时</el-radio-button>
            <el-radio-button label="120">0-120小时</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <hr>
      <div class="daily-forecast-middle">
        <span>评分类型：</span>
        <el-checkbox-group v-model="scoreType" @change="changeType">
          <el-checkbox v-for="(value, index) in types" :label="index" :key="index">{{value}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="daily-forecast-bottom">
        <el-table
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  fixed
                  prop="forecaster"
                  label="用户名">
          </el-table-column>
          <el-table-column label="晴雨准确率技巧">
            <el-table-column label="国家站">
              <el-table-column prop="qy_gj_st" label="省"></el-table-column>
              <el-table-column prop="qy_gj_yt" label="央"></el-table-column>
              <el-table-column prop="qy_gj_jq" label="技"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="qy_gg_st" label="省"></el-table-column>
              <el-table-column prop="qy_gg_yt" label="央"></el-table-column>
              <el-table-column prop="qy_gg_jq" label="技"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="一般性降水技巧">
            <el-table-column label="国家站">
              <el-table-column prop="ybx_gj_st" label="省"></el-table-column>
              <el-table-column prop="ybx_gj_yt" label="央"></el-table-column>
              <el-table-column prop="ybx_gj_jq" label="技"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="ybx_gg_st" label="省"></el-table-column>
              <el-table-column prop="ybx_gg_yt" label="央"></el-table-column>
              <el-table-column prop="ybx_gg_jq" label="技"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="暴雨及以上技巧">
            <el-table-column label="国家站">
              <el-table-column prop="by_gj_st" label="省"></el-table-column>
              <el-table-column prop="by_gj_yt" label="央"></el-table-column>
              <el-table-column prop="by_gj_jq" label="技"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="by_gg_st" label="省"></el-table-column>
              <el-table-column prop="by_gg_yt" label="央"></el-table-column>
              <el-table-column prop="by_gg_jq" label="技"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最高温技巧">
            <el-table-column label="国家站">
              <el-table-column prop="maxt_gj_st" label="省"></el-table-column>
              <el-table-column prop="maxt_gj_yt" label="央"></el-table-column>
              <el-table-column prop="maxt_gj_jq" label="技"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="maxt_gg_st" label="省"></el-table-column>
              <el-table-column prop="maxt_gg_yt" label="央"></el-table-column>
              <el-table-column prop="maxt_gg_jq" label="技"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最低温技巧">
            <el-table-column label="国家站">
              <el-table-column prop="mint_gj_st" label="省"></el-table-column>
              <el-table-column prop="mint_gj_yt" label="央"></el-table-column>
              <el-table-column prop="mint_gj_jq" label="技"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="mint_gg_st" label="省"></el-table-column>
              <el-table-column prop="mint_gg_yt" label="央"></el-table-column>
              <el-table-column prop="mint_gg_jq" label="技"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最高温准确率">
            <el-table-column label="国家站">
              <el-table-column prop="maxt_gj_pc" label="省"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="maxt_gg_pc" label="省"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最低温准确率">
            <el-table-column label="国家站">
              <el-table-column prop="mint_gj_pc" label="省"></el-table-column>
            </el-table-column>
            <el-table-column label="骨干站">
              <el-table-column prop="mint_gg_pc" label="省"></el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column label="技巧">
            <el-table-column prop="gj_zh" label="国家站"></el-table-column>
            <el-table-column prop="gg_zh" label="骨干站"></el-table-column>
            <el-table-column prop="zh" label="综合技巧"></el-table-column>
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
    name: "DailyForecast",
    components: {
      DatePicker
    },
    data() {
      return {
        period: '24',
        scoreType: ['qy', 'ybx', 'by', 'maxt_jq', 'mint_jq', 'maxt_pc', 'mint_pc', 'zh'],
        types: {
          qy: '晴雨准确率技巧',
          ybx: '一般性降水技巧',
          by: '暴雨及以上技巧',
          maxt_jq: '最高温技巧',
          mint_jq: '最低温技巧',
          maxt_pc: '最高温准确率',
          mint_pc: '最低温准确率',
          zh: '综合技巧',
        },
        tableData: []
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        let startStr = moment(startTime).format("YYYY-MM-DD")
        let endStr = moment(endTime).format("YYYY-MM-DD")
        console.log(startStr)
        console.log(endStr)
      },
      changePeriod(period) {

      },
      changeType(type) {
        alert(type)
      }
    },
    created() {
      for (let i = 0; i < 20; i++) {
        let data = {
          qy_gj_st: 87.9,
          qy_gj_yt: -999,
          qy_gj_jq: -999,
          qy_gg_st: 83.4,
          qy_gg_yt: -999,
          qy_gg_jq: -999,
          ybx_gj_st: 87.9,
          ybx_gj_yt: -999,
          ybx_gj_jq: -999,
          ybx_gg_st: 83.4,
          ybx_gg_yt: -999,
          ybx_gg_jq: -999,
          by_gj_st: 87.9,
          by_gj_yt: -999,
          by_gj_jq: -999,
          by_gg_st: 83.4,
          by_gg_yt: -999,
          by_gg_jq: -999,
          maxt_gj_st: 87.9,
          maxt_gj_yt: -999,
          maxt_gj_jq: -999,
          maxt_gg_st: 83.4,
          maxt_gg_yt: -999,
          maxt_gg_jq: -999,
          mint_gj_st: 87.9,
          mint_gj_yt: -999,
          mint_gj_jq: -999,
          mint_gg_st: 83.4,
          mint_gg_yt: -999,
          mint_gg_jq: -999,
          maxt_gj_pc: 77.8,
          maxt_gg_pc: 77.8,
          mint_gj_pc: 77.8,
          mint_gg_pc: 77.8,
          gj_zh: -999,
          gg_zh: -999,
          zh: -999,
        }
        let forecaster = '预报员' + (i + 1)
        data['forecaster'] = forecaster
        this.tableData.push(data)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .head-time-period {
    display: inline-block;
    margin-left: 50px;

    .el-radio-button__inner {
      padding: 2px 15px;
    }
  }

  .daily-forecast-middle {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    font-size: 12px;
    background-color: @bgColor;
    margin-bottom: 20px;

    .el-checkbox-group {
      display: inline-block;
      width: calc(100% - 200px);
      box-sizing: border-box;
      padding-left: 10px;
    }

    .el-checkbox {
      color: #303133;
      margin-right: 40px;
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

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #303133;
    }
  }

  .daily-forecast-bottom {
    height: calc(100% - 131px);
    background-color: @bgColor;
  }
</style>