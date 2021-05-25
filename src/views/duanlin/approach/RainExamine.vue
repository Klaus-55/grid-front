<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" />
        <span style="margin-left: 50px">检验项：</span>
        <el-select v-model="inspectionItem" placeholder="" @change="changItems">
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
            <el-radio-group v-model="ftime" @change="changeFtime">
              <el-radio-button label="zh">综合</el-radio-button>
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="14">14时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验时效：</span>
            <el-radio-group v-model="finterval">
              <el-radio-button label="1">逐1H</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验产品：</span>
            <el-radio-group v-model="product" @change="changeProduct">
              <el-radio-button label="BBBUSI">业务评估</el-radio-button>
              <el-radio-button label="TECH">技术评估</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="facname" @change="changeFacname">
              <el-radio-button label="ave">平均误差</el-radio-button>
              <el-radio-button label="abs">平均绝对误差</el-radio-button>
              <el-radio-button label="qy">晴雨预报</el-radio-button>
              <el-radio-button label="r1">0.1-19.9mm</el-radio-button>
              <el-radio-button label="r2">20-49.9mm</el-radio-button>
              <el-radio-button label="r3">50mm</el-radio-button>
              <el-radio-button label="zh">综合</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span style="vertical-align: top">检验时段：</span>
            <div class="border-content">
              <el-switch
                v-model="switchStatus"
                @change="switchChange"
                active-text="0~12小时"
                active-color="#03B452"
                inactive-color="#7E7772"
              >
              </el-switch>
              <el-checkbox-group v-model="fhour" @change="changeFhour">
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
          <div class="maintitle">湖南省逐1小时降水平均误差</div>
          <div class="subtitle">
            起报时间：2020-10-12至2020-10-13逐时 08(北京时)
          </div>
          <div class="highcharts-content" v-show="!isMask">
            <!--              <div style="width: 100%;height: 100%;background-color: red" v-show="true"></div>-->
            <el-checkbox-group v-model="modes" @change="changeModes">
              <el-checkbox label="item">sss</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="showType" size="mini" @change="changeType">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
              id="container"
              class="container"
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
  name: "RainExamine",
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
      finterval: "1",
      product: "BBBUSI",
      facname: "ave",
      switchStatus: true,
      fhour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ftimeView: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      isMask: false,
      showType: "图表",
      modes: ["item"],
    };
  },
  methods: {
    changeDate(startDate, endDate) {
      let startStr = moment(startDate).format("YYYY-MM-DD");
      let endstr = moment(endDate).format("YYYY-MM-DD");
    },
    changItems(item) {
      // alert(item)
    },
    changeFtime(ftime) {
      // alert(ftime)
    },
    changeProduct(product) {
      // alert(product)
    },
    changeFacname(facname) {
      // alert(facname)
    },
    switchChange() {},
    changeFhour(fhour) {
      // alert(fhour)
    },
    changeModes(modes) {},
    changeType(type) {},
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
          categories: ["湖南省", "预报员1", "预报员2", "预报员3"],
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
            name: "综合得分",
            data: [2.3, 2.3, 2.3, 2.3],
          },
          {
            name: "大雾",
            data: [3.1, 3.1, 3.1, 3.1],
          },
          {
            name: "寒潮",
            data: [1.8, 1.8, 1.8, 1.8],
          },
          {
            name: "低温雨雪冰冻",
            data: [2.1, 2.1, 2.1, 2.1],
          },
        ],
      };
      Highcharts.chart("container", options);
    },
  },
  created() {
    this.$nextTick(() => {
      this.initEcharts();
    });
  },
};
</script>

<style lang="less">
@import "../../../assets/less/common";
.rain-examine-middle {
  background-color: @bgColor;
  height: 100px;
  margin-bottom: 20px;
  > span {
    margin-left: 20px;
    vertical-align: top;
  }
  .el-menu {
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
    font-size: 12px;
  }
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
    background-color: transparent;
  }
  .el-radio-button__inner {
    font-size: 12px;
    padding: 2px 7px;
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
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #49afcd;
    border-color: #49afcd;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner:hover {
    color: #fff;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    box-shadow: none;
  }
  .border-content {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e4e4e4;
    width: 1061px;
    height: 30px;
    .el-switch {
      padding-left: 20px;
    }
    .el-switch__core {
      width: 28px !important;
      height: 12.8px;
    }
    .el-switch__core:after {
      width: 9px;
      height: 9px;
    }
    .el-switch.is-checked .el-switch__core::after {
      margin-left: -10px;
    }
    .el-switch__label * {
      font-size: 13px;
    }
    .el-switch__label.is-active {
      color: #303133;
    }
    .el-checkbox-group {
      display: inline-block;
      margin-left: 30px;
      width: 921px;
    }
    .el-checkbox {
      color: #303133;
    }
    .el-checkbox__inner {
      width: 11px;
      height: 11px;
    }
    .el-checkbox__input {
      vertical-align: baseline;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: transparent;
      border-color: #dcdfe6;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #dcdfe6;
    }
    .el-checkbox__inner::after {
      border: 2px solid #03b452;
      border-left: 0;
      border-top: 0;
      left: 2px;
      top: -1px;
    }
    .el-checkbox__label {
      width: 30px;
      font-size: 12px;
      padding-left: 2px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #303133;
    }
  }
}
.rain-examine-bottom {
  height: calc(100% - 171px);
  background-color: @bgColor;
  .highcharts-title {
    text-align: center;
    padding-top: 15px;
    margin-bottom: 5px;
    height: 100%;

    .maintitle {
      font-size: 19px;
      font-weight: 700;
    }
    .subtitle {
      margin-top: 3px;
      font-size: 12px;
      color: #747171;
    }
    .highcharts-content {
      width: 100%;
      height: calc(100% - 58px);
    }
  }

  .el-checkbox-group {
    display: inline-block;
    width: calc(100% - 200px);
    box-sizing: border-box;
    margin-top: 10px !important;
    padding-left: 10px;
  }
  .el-checkbox {
    color: #303133;
  }
  .el-checkbox__inner {
    width: 11px;
    height: 11px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: transparent;
    border-color: #dcdfe6;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #dcdfe6;
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

  .el-radio-group {
    margin-left: 0 !important;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    background-color: #dfdfdf;
    border-radius: 12px;
  }
  .el-radio-button__inner {
    background-color: transparent;
    border: none;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 5px 13px;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 12px 0 0 12px;
    border-left: none;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 12px 12px 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    background-color: #49afcd;
    border-radius: 12px 12px 12px 12px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner:hover {
    color: #fff;
  }
  .el-radio-button__inner:hover {
    color: #49afcd;
  }
}

.el-popper[x-placement^="bottom"] {
  margin-top: 5px !important;
}
</style>