<template>
  <div class="side-content">
    <div class="content">
      <div class="navhead head">
        <div>
          <el-tabs v-model="active">
            <el-tab-pane label="年度" name="1"></el-tab-pane>
            <el-tab-pane label="季度" name="2"></el-tab-pane>
            <el-tab-pane label="月度" name="3"></el-tab-pane>
          </el-tabs>
        </div>
        <date-picker class="date-picker" />
      </div>
      <hr class="hr" />
      <div class="warning-message-middle">
        <div class="time-period-radio">
          <span>预报时次：</span>
          <el-radio-group v-model="ftime">
            <el-radio-button label="zh">综合</el-radio-button>
            <el-radio-button label="08">08时</el-radio-button>
            <el-radio-button label="20">20时</el-radio-button> </el-radio-group
          >&nbsp;
          <span>检验时段：</span>
          <el-radio-group v-model="month">
            <el-select v-model="year">
              <el-option
                v-for="item in years"
                :key="item"
                :label="item + '年'"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-radio-button label="1">1月</el-radio-button>
            <el-radio-button label="2">2月</el-radio-button>
            <el-radio-button label="3">3月</el-radio-button>
            <el-radio-button label="4">4月</el-radio-button>
            <el-radio-button label="5">5月</el-radio-button>
            <el-radio-button label="6">6月</el-radio-button>
            <el-radio-button label="7">7月</el-radio-button>
            <el-radio-button label="8">8月</el-radio-button>
            <el-radio-button label="9">9月</el-radio-button>
            <el-radio-button label="10">10月</el-radio-button>
            <el-radio-button label="11">11月</el-radio-button>
            <el-radio-button label="12">12月</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">湖南省逐1小时温度平均绝对误差</div>
          <div class="subtitle">
            起报时间：2020-10-12至2020-10-13逐时 08(北京时)
          </div>
          <div class="highcharts-content" v-show="!isMask">
            <el-select v-model="defSelect" class="select" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-checkbox-group v-model="defCheckbox" class="checkbox">
              <el-checkbox
                v-for="item in checkoutItem"
                :label="item.label"
                :key="item.value"
                >{{ item.label }}</el-checkbox
              >
            </el-checkbox-group>
            <el-radio-group v-model="showType" size="mini">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
              id="container"
              style="width: 100%; height: calc(100% - 50px)"
              v-show="showType === '图表'"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../../components/content/DatePicker";
import Highcharts from "highcharts";
export default {
  name: "ForecasterExamine",
  components: {
    DatePicker,
  },
  data() {
    return {
      active: undefined,
      ftime: "zh",
      years: [2021, 2020, 2019, 2018, 2017],
      year: 2021,
      month: "1",
      options: [
        { label: "TS评分", value: "ts" },
        { label: "空报率", value: "kb" },
        { label: "漏报率", value: "lb" },
        { label: "命中率", value: "mz" },
        { label: "及时性", value: "js" },
      ],
      defSelect: "ts",
      checkoutItem: [
        { label: "强降水检验", value: "heavyRainfall" },
        { label: "雷暴检验", value: "thunderstorm" },
        { label: "雷暴大风检验", value: "blustery" },
        { label: "冰雹检验", value: "hail" },
      ],
      defCheckbox: ["强降水检验", "雷暴检验", "雷暴大风检验", "冰雹检验"],
      isMask: false,
      showType: "图表",
      modes: ["item"],
    };
  },
  watch: {
    active: function (val) {
      if (val == 1) {
        console.log("年度");
      } else if (val == 2) {
        console.log("季度");
      } else if (val == 3) {
        console.log("月度");
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  methods: {
    changeFtime() {},
    changeItems() {},
    initEcharts() {
      let options = {
        chart: {
          type: "column",
          backgroundColor: "#F8F8F8",
        },
        credits: {
          enabled: false,
        },
        colors: ["#5E8CEB", "#59BDBE", "#978EBA", "#EBC980", "#7ACBFF"],
        title: {
          text: "",
        },
        xAxis: {
          categories: [
            "预报员1",
            "预报员2",
            "预报员3",
            "预报员4",
            "预报员5",
            "预报员6",
            "预报员7",
            "预报员8",
          ],
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
          },
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: "晴雨预报准确率",
            data: [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
          },
          {
            name: "<20mm准确率",
            data: [3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1],
          },
          {
            name: "<50mm准确率",
            data: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
          },
          {
            name: ">50mm准确率",
            data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
          },
          {
            name: "降水综合成绩",
            data: [2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2],
          },
        ],
      };
      Highcharts.chart("container", options);
    },
  },
};
</script>

<style lang="less">
@import "../../../assets/less/common";
.navhead {
  width: 40%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .el-tabs__active-bar {
    background-color: #5fb878;
    height: 4px;
  }
  .date-picker {
    margin-top: -1rem;
  }
}
.hr {
  margin-top: -1rem;
}
.warning-message-middle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  background-color: @bgColor;
  margin-bottom: 20px;

  .time-period-radio {
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
    .el-input__icon {
      width: 20px;
      line-height: 25px;
    }
    .el-icon-arrow-up:before {
      content: "\e78f";
    }
    .el-radio-button__inner {
      width: 60px;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      background: @bgColor;
      padding: 0;
    }
  }
}
.select {
  .el-input {
    width: 60%;
    font-size: 10px;
    margin-left: 20px;
  }
}
.checkbox {
  width: 25% !important;
}
</style>