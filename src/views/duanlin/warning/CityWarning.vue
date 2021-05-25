<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker />
      </div>
      <hr />
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="defType">
              <el-radio-button v-for="item in type" :label="item" :key="item">{{
                item
              }}</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="defelement">
              <el-radio-button
                v-for="item in element"
                :label="item"
                :key="item"
                >{{ item }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
        <el-menu class="year-select" mode="horizontal">
          <el-menu-item>
            <span>检验时段：</span>
            <el-select v-model="defYear">
              <el-option
                v-for="item in yearItem"
                :key="item.value"
                :label="item.label + '年'"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-radio-group v-model="defMonth">
              <el-radio-button
                v-for="item in monthItem"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rain-examine-bottom">
        <div class="top">
          地图
          <div class="table">
            <el-table :data="tableData" style="width: 100%" border="">
              <el-table-column prop="type" align="center" label="预警类型">
              </el-table-column>
              <el-table-column
                prop="precision"
                align="center"
                label="预报准确率"
              >
              </el-table-column>
              <el-table-column prop="lead" align="center" label="预警提前量">
              </el-table-column>
              <el-table-column prop="score" align="center" label="总额成绩">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="center"></div>
        <div class="bottom">
          <div class="h-10 highcharts-title">
            <div class="maintitle">{{ title }}</div>
            <div id="bottom-highcharts"></div>
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
  name: "CityWarning",
  components: {
    DatePicker,
  },
  data() {
    return {
      defType: "暴雨",
      type: [
        "暴雨",
        "雷电大风",
        "雷电",
        "冰雹",
        "暴雪",
        "大风",
        "大雾",
        "霾",
        "综合",
      ],
      defelement: "预报准确率",
      element: ["预报准确率", "预报提前量", "总额成绩"],
      yearItem: [
        { value: "y2020", label: "2021" },
        { value: "y2021", label: "2020" },
        { value: "y2019", label: "2019" },
        { value: "y2018", label: "2018" },
      ],
      defYear: "2020年",
      monthItem: [
        { value: "m1", label: "一月" },
        { value: "m2", label: "二月" },
        { value: "m3", label: "三月" },
        { value: "q1", label: "一季度" },
        { value: "m4", label: "四月" },
        { value: "m5", label: "五月" },
        { value: "m6", label: "六月" },
        { value: "q2", label: "二季度" },
        { value: "m7", label: "七月" },
        { value: "m8", label: "八月" },
        { value: "m9", label: "九月" },
        { value: "q3", label: "三季度" },
        { value: "m10", label: "十月" },
        { value: "m11", label: "十一月" },
        { value: "m12", label: "十二月" },
        { value: "q4", label: "四季度" },
        { value: "q5", label: "全年" },
      ],
      defMonth: "一月",
      tableData: [],
      title: "湖南省2020年9月暴雨预报质量",
    };
  },
  created() {
    for (let i = 0; i < this.type.length; i++) {
      let data = {
        type: this.type[i],
        precision: "66%",
        lead: "",
        score: "",
      };
      this.tableData.push(data);
    }
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
  methods: {
    initEcharts() {
      let options = {
        chart: {
          type: "column",
          backgroundColor: "#F8F8F8",
        },
        credits: {
          enabled: false,
        },
        colors: ["#88B5EB"],
        title: {
          text: "",
        },
        xAxis: {
          categories: [
            "长沙",
            "株洲",
            "湘潭",
            "衡阳",
            "岳阳",
            "张家界",
            "娄底",
            "郴县",
            "益阳",
            "邵阳",
            "永州",
            "怀化",
            "湘西土家族自治州",
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
          headerFormat:
            '<span style="font-size:10px"><b>{point.key}:{point.y:.1f}</b></span>',
          pointFormat: "",
          footerFormat: "",
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
            name: "预报质量",
            data: [
              3.2,
              3.1,
              3.0,
              2.9,
              2.8,
              2.7,
              3.1,
              3.0,
              2.8,
              3.3,
              2.9,
              3.1,
              2.6,
            ],
          },
        ],
      };
      Highcharts.chart("bottom-highcharts", options);
    },
  },
};
</script>

<style lang="less">
.rain-examine-middle {
  .year-select .el-input .el-input__inner {
    width: 90px;
    height: 18px;
    font-size: 12px;
    margin-top: -3px;
    border-radius: 0;
  }
}
.rain-examine-bottom {
  .top {
    width: 100%;
    height: 65%;
    .table {
      float: right;
      width: 27%;
      height: 100%;
      .el-table__header tr,
      .el-table__header th {
        background-color: #39a5f8;
        color: #ffffff;
        font-weight: 700;
        font-size: 1.2rem;
        padding: 0;
        height: 4rem;
      }
      .el-table__body tr,
      .el-table__body td {
        color: #8b8b8b;
        padding: 0;
        height: 2.7rem;
      }
    }
  }
  .center {
    width: 100%;
    height: 2%;
  }
  .bottom {
    width: 100%;
    height: 33%;

    .h-10 {
      height: 100%;
      #bottom-highcharts {
        height: 90% !important;
      }
    }
  }
}
</style>