<template>
  <div class="body-content">
    <side-bar :items="items" />
    <div class="side-content">
      <div class="content">
        <div class="head">
          <date-picker @changeDate="changeDate" />
        </div>
        <hr />
        <div class="rain-examine-middle">
          <el-menu mode="horizontal">
            <el-menu-item>
              <span>检验指标：</span>
              <el-radio-group v-model="defIndicator" @change="changeIndicator">
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
          <el-menu mode="horizontal" class="heavyelmenu">
            <el-menu-item>
              <span>检验时段：</span>
              <el-select v-model="defYear" @change="changItems">
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
        <div class="nav-bottom rain-examine-bottom">
          <div class="rain-examine-bottom-left">地图</div>
          <div class="rain-examine-bottom-right">
            <span class="tableTitle">{{ tableTitle }}</span>
            <el-table :data="tableData" border>
              <el-table-column
                prop="area"
                label="区域"
                align="center"
                min-width="1"
              >
              </el-table-column>
              <el-table-column
                prop="ts"
                label="TS评分"
                align="center"
                min-width="1"
              >
              </el-table-column>
              <el-table-column
                prop="empty"
                label="空报率"
                align="center"
                min-width="1"
              >
              </el-table-column>
              <el-table-column
                prop="fail"
                label="漏报率"
                align="center"
                min-width="1"
              >
              </el-table-column>
              <el-table-column
                prop="hit"
                label="命中率"
                align="center"
                min-width="1"
              >
              </el-table-column>
              <el-table-column
                prop="intime"
                label="及时性"
                align="center"
                min-width="1"
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
import DatePicker from "../../components/content/DatePicker";
export default {
  name: "HeavyMonitoring",
  components: {
    "side-bar": MenuList,
    DatePicker,
  },
  data() {
    return {
      conName: "provincial-warning",
      items: [
        {
          img: require("assets/img/wms.png"),
          text: "强降水监测警报",
          index: "pw",
        },
      ],
      defIndicator: "TS评分",
      indItems: [
        { label: "TS评分", value: "ts" },
        { label: "空报率", value: "kb" },
        { label: "漏报率", value: "lb" },
        { label: "命中率", value: "mz" },
        { label: "及时性", value: "js" },
      ],
      levelItems: [
        { label: "市级", value: "city" },
        { label: "县级", value: "county" },
      ],
      defLevel: ["市级"],
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
        { value: "q6", label: "下半年" },
        { value: "q7", label: "全年" },
      ],
      defMonth: "一月",
      tableTitle: "湖南省2020年1月强降水监测警报质量",
      tableData: [],
    };
  },
  created() {
    for (let i = 0; i < 12; i++) {
      if (i < 5) {
        let data = {
          area: "常德",
          ts: "36.2",
          empty: "20.3",
          fail: "10.2",
          hit: "79.3",
          intime: "20.6",
        };
        this.tableData.push(data);
      } else {
        let data = {
          area: "",
          ts: "",
          empty: "",
          fail: "",
          hit: "",
          intime: "",
        };
        this.tableData.push(data);
      }
    }
  },
  methods: {
    changeDate() {},
    changeIndicator() {},
    changItems(item) {},
  },
};
</script>

<style lang="less">
@import "../../assets/less/common";
.heavyelmenu {
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
.nav-bottom {
  display: flex;
  .rain-examine-bottom-left {
    width: 70%;
    height: 100%;
  }
  .rain-examine-bottom-right {
    width: 30%;
    height: 100%;
    .tableTitle {
      display: block;
      background-color: #46c6ef;
      color: #fff;
      width: 100%;
      height: 10%;
      font-size: 1.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-table__header tr,
    .el-table__header th {
      color: #005fb7;
      font-weight: 700;
      font-size: 1.2rem;
      padding: 0.4rem 0;
    }
    .el-table__body tr,
    .el-table__body td {
      color: #8b8b8b;
      padding: 0;
      height: 40px;
    }
  }
  .el-table tbody {
    tr:nth-child(2n + 1) {
      background-color: #f8f8f8 !important;
    }
  }
}
</style>