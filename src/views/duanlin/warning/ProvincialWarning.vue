<template>
  <div class="side-content">
    <div class="content">
      <div class="head"><DatePicker /></div>
      <hr />
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>检验指标：</span>
            <el-radio-group v-model="defIndicator">
              <el-radio-button
                v-for="item in indItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>地区级别：</span>
            <el-radio-group v-model="defLevel">
              <el-radio-button
                v-for="item in levelItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
        <el-menu mode="horizontal" class="inspection-time">
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
          </el-menu-item>
          <el-menu-item>
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
        <div class="highcharts-title">
          <div class="maintitle">{{ title }}</div>
          <div class="highcharts-content" v-show="!isMask">
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
import Highcharts from "highcharts";
export default {
  name: "ProvincialWarning",
  components: {
    DatePicker,
  },
  data() {
    return {
      defIndicator: "TS评分",
      indItems: [
        { label: "TS评分", value: "ts" },
        { label: "空报率", value: "kb" },
        { label: "漏报率", value: "lb" },
        { label: "命中率", value: "mz" },
        { label: "及时性", value: "js" },
      ],
      defLevel: "市级",
      levelItems: [
        { label: "市级", value: "city" },
        { label: "县级", value: "county" },
      ],
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
        { value: "q3", label: "上半年" },
        { value: "m7", label: "七月" },
        { value: "m8", label: "八月" },
        { value: "m9", label: "九月" },
        { value: "q4", label: "三季度" },
        { value: "m10", label: "十月" },
        { value: "m11", label: "十一月" },
        { value: "m12", label: "十二月" },
        { value: "q5", label: "四季度" },
        { value: "q6", label: "全年" },
      ],
      defMonth: "一月",
      isMask: false,
      showType: "图表",
      title: "湖南省2020年9月暴雨预警预报质量",
    };
  },
  created() {
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
        colors: [
          "#8FCACB",
          "#C1BAD8",
          "#EA7B7B",
          "#F6A467",
          "#F9CE73",
          "#83A8F2",
        ],
        title: {
          text: "",
        },
        xAxis: {
          categories: [
            "湖南省气象台",
            "预报员1",
            "预报员2",
            "预报员3",
            "预报员4",
            "预报员5",
            "预报员6",
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
            name: "不分级别",
            data: [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
          },
          {
            name: "所有级别",
            data: [3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1],
          },
          {
            name: "红色",
            data: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
          },
          {
            name: "橙色",
            data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
          },
          {
            name: "黄色",
            data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
          },
          {
            name: "蓝色",
            data: [2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4, 2.4],
          },
        ],
      };
      Highcharts.chart("container", options);
    },
  },
};
</script>

<style lang="less">
.inspection-time {
  .el-menu-item {
    .el-select .el-input .el-input__inner {
      width: 90px;
      height: 18px;
      font-size: 12px;
      margin-top: -2px;
      border-radius: 0;
    }
    .el-radio-group {
      margin-left: -41px;
    }
  }
}
</style>