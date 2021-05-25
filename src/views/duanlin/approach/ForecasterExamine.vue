<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" />
      </div>
      <hr />
      <div class="warning-message-middle">
        <div class="time-period-radio">
          <span>预报时次：</span>
          <el-radio-group v-model="ftime">
            <el-radio-button label="zh">综合</el-radio-button>
            <el-radio-button label="08">08时</el-radio-button>
            <el-radio-button label="14">14时</el-radio-button>
            <el-radio-button label="20">20时</el-radio-button> </el-radio-group
          >&nbsp;
          <span>检验时段：</span>
          <el-radio-group v-model="month" @change="changeTimePeriod">
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
            <el-radio-button label="q1">一季度</el-radio-button>
            <el-radio-button label="4">4月</el-radio-button>
            <el-radio-button label="5">5月</el-radio-button>
            <el-radio-button label="6">6月</el-radio-button>
            <el-radio-button label="q2">二季度</el-radio-button>
            <el-radio-button label="q3">上半年</el-radio-button>
            <el-radio-button label="7">7月</el-radio-button>
            <el-radio-button label="8">8月</el-radio-button>
            <el-radio-button label="9">9月</el-radio-button>
            <el-radio-button label="q4">三季度</el-radio-button>
            <el-radio-button label="10">10月</el-radio-button>
            <el-radio-button label="11">11月</el-radio-button>
            <el-radio-button label="12">12月</el-radio-button>
            <el-radio-button label="q5">四季度</el-radio-button>
            <el-radio-button label="q6">下半年</el-radio-button>
            <el-radio-button label="year">全年</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">
            {{ year }}年{{ titleTime }}湖南省逐1小时温度平均绝对误差
          </div>
          <div class="subtitle">
            起报时间：2020-10-12至2020-10-13逐时 08(北京时)
          </div>
          <div class="forecaster highcharts-content" v-show="!isMask">
            <span class="span">{{ title[0] + "：" }}</span>
            <el-checkbox-group v-model="defRain">
              <el-checkbox
                v-for="item in rainScore"
                :label="item"
                :key="item"
                >{{ item }}</el-checkbox
              >
            </el-checkbox-group>
            <span class="sep">|</span>
            <span class="span">{{ title[1] + "：" }}</span>
            <el-checkbox-group v-model="defAir">
              <el-checkbox v-for="item in airScore" :label="item" :key="item">{{
                item
              }}</el-checkbox>
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
            <!--            <el-table-->
            <!--                    v-show="showType === '表格'"-->
            <!--                    :data="tableData"-->
            <!--                    border-->
            <!--                    class="table-fixed"-->
            <!--                    height="calc(100% - 64px)"-->
            <!--                    style="width: calc(100% - 50px); margin: 0 auto; transform: translateY(10px)"-->
            <!--                    :header-cell-style="{'text-align': 'center'}">-->
            <!--              <el-table-column-->
            <!--                      prop="ftime"-->
            <!--                      label="预报时段（小时）"-->
            <!--                      align="center"-->
            <!--              >-->
            <!--              </el-table-column>-->
            <!--              <el-table-column-->
            <!--                      v-for="(value, key) in tableHeader"-->
            <!--                      :prop="key"-->
            <!--                      :label="value"-->
            <!--                      align="center"-->
            <!--              >-->
            <!--              </el-table-column>-->
            <!--            </el-table>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../../components/content/DatePicker";
import moment from "momnet";
import Highcharts from "highcharts";
export default {
  name: "ForecasterExamine",
  components: {
    DatePicker,
  },
  data() {
    return {
      ftime: "zh",
      years: [2021, 2020, 2019, 2018, 2017],
      year: 2021,
      month: moment().month() + 1,
      titleTime: moment().month() + 1 + "月",
      rainScore: [
        "晴雨预报准确率",
        "<20mm准确率",
        "<50mm准确率",
        ">50mm准确率",
        "降水综合成绩",
      ],
      title: ["降水评分", "气温评定"],
      defRain: ["晴雨预报准确率", "<20mm准确率", "<50mm准确率", ">50mm准确率"],
      airScore: ["平均绝对误差", "准确率"],
      defAir: ["平均绝对误差", "准确率"],
      isMask: false,
      showType: "图表",
      modes: ["item"],
    };
  },
  created() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  methods: {
    changeDate(startDate, endDate) {
      let startStr = moment(startDate).format("YYYY-MM-DD");
      let endstr = moment(endDate).format("YYYY-MM-DD");
    },
    changeTimePeriod(time) {
      if (time === "year") {
        this.titleTime = "全年";
      } else if (time.indexOf("q") !== -1) {
        this.titleTime = "第" + time.charAt(time.length - 1) + "季度";
      } else {
        this.titleTime = this.month + "月";
      }
    },
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
</style>