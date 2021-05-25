<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" />
        <span style="margin-left: 50px">检验项：</span>
        <el-select v-model="inspectionItem" placeholder="">
          <el-option
            v-for="item in inspectionItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <hr />
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预报时次：</span>
            <el-radio-group v-model="ftime">
              <el-radio-button label="zh">综合</el-radio-button>
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="14">14时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验时效：</span>
            <el-radio-group v-model="finterval">
              <el-radio-button label="3">逐3H</el-radio-button>
              <el-radio-button label="6">逐6H</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验产品：</span>
            <el-radio-group v-model="product">
              <el-radio-button label="BBBUSI">业务评估</el-radio-button>
              <el-radio-button label="TECH">技术评估</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="facname">
              <el-radio-button label="ts">TS评分</el-radio-button>
              <el-radio-button label="lb">漏报率</el-radio-button>
              <el-radio-button label="kb">空报率</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
        <el-menu>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="thunderstorm-examine border-content">
              <el-switch
                v-model="switchStatus"
                active-text="0~12小时"
                active-color="#03B452"
                inactive-color="#7E7772"
              >
              </el-switch>
              <el-checkbox-group v-model="fhour">
                <el-checkbox
                  v-for="item in ftimeView"
                  :label="item"
                  :key="item"
                  >{{ item == "0" ? "综合" : item + "时" }}</el-checkbox
                >
                <!--                <el-checkbox v-for="item in ftimeView" :label="item" v-if="isZhuri">{{item + '日'}}</el-checkbox>-->
              </el-checkbox-group>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">湖南省逐1小时温度平均绝对误差</div>
          <div class="subtitle">
            起报时间：2020-10-12至2020-10-13逐时 08(北京时)
          </div>
          <div class="highcharts-content" v-show="!isMask">
            <!--              <div style="width: 100%;height: 100%;background-color: red" v-show="true"></div>-->
            <el-checkbox-group v-model="modes">
              <el-checkbox v-for="item in items" :label="item" :key="item">{{
                item.toUpperCase()
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
  name: "ThunderstormExamine",
  components: {
    DatePicker,
  },
  data() {
    return {
      inspectionItem: "skillScore",
      inspectionItems: [
        { value: "skillScore", label: "技巧评分" },
        { value: "quality", label: "分项质量" },
      ],
      ftime: "zh",
      finterval: "3",
      product: "BBBUSI",
      facname: "ts",
      switchStatus: true,
      fhour: ["0~3", "3~6", "6~9", "9~12"],
      ftimeView: ["0~3", "3~6", "6~9", "9~12"],
      isMask: false,
      showType: "图表",
      items: [
        "中央台",
        "省台指导",
        "地市订正",
        "欧洲中心",
        "grapes_gfs",
        "grapes_3km",
        "华南模式",
        "华东模式",
        "省台客观DL",
        "省台客观0-24小时",
      ],
      modes: ["中央台", "省台指导", "地市订正", "欧洲中心"],
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
        colors: ["#5E8CEB", "#59BDBE", "#978EBA", "#EBC980"],
        title: {
          text: "",
        },
        xAxis: {
          categories: ["01", "02", "03", "04", "05", "06", "07", "08"],
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
            name: "中央台",
            data: [2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3, 2.3],
          },
          {
            name: "省台指导",
            data: [3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1, 3.1],
          },
          {
            name: "地市订正",
            data: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
          },
          {
            name: "欧洲中心",
            data: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1],
          },
        ],
      };
      Highcharts.chart("container", options);
    },
    changeDate(startDate, endDate) {
      let startStr = moment(startDate).format("YYYY-MM-DD");
      let endstr = moment(endDate).format("YYYY-MM-DD");
    },
  },
};
</script>

<style lang="less">
.rain-examine-middle {
  .thunderstorm-examine {
    width: 32rem;
  }
}
.el-menu-item,
.el-submenu__title {
  height: 45px;
  line-height: 45px;
}
</style>