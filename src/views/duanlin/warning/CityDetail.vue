<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker />
        <span style="margin-left: 50px">发布单位：</span>
        <el-select v-model="defUnit" class="unitSelect">
          <el-option
            v-for="item in unitItem"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <hr />
      <div class="h-3rem rain-examine-middle">
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
            <span>预警等级：</span>
            <el-radio-group v-model="defLevel">
              <el-radio-button
                v-for="item in level"
                :label="item"
                :key="item"
                >{{ item }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验结果：</span>
            <el-radio-group v-model="defResult">
              <el-radio-button
                v-for="item in result"
                :label="item"
                :key="item"
                >{{ item }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="table-style rain-examine-bottom">
        <el-table
          :data="tableData"
          height="100%"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="预警信号">
            <el-table-column prop="l_unit" label="发布单位" min-width="2">
            </el-table-column>
            <el-table-column prop="l_name" label="发布人" min-width="2">
            </el-table-column>
            <el-table-column prop="l_time" label="发布时间" min-width="2">
            </el-table-column>
            <el-table-column prop="l_type" label="预警类型" min-width="1">
            </el-table-column>
            <el-table-column prop="l_level" label="预警等级" min-width="1">
            </el-table-column>
            <el-table-column prop="l_city" label="受影响地市" min-width="1">
            </el-table-column>
          </el-table-column>
          <el-table-column label="实况预警信号">
            <el-table-column prop="m_county" label="受影响县" min-width="1">
            </el-table-column>
            <el-table-column prop="m_type" label="类型" min-width="1">
            </el-table-column>
            <el-table-column prop="m_level" label="等级" min-width="1">
            </el-table-column>
            <el-table-column prop="m_time" label="发生时间" min-width="2">
            </el-table-column>
            <el-table-column prop="m_city" label="受影响地市" min-width="1">
            </el-table-column>
          </el-table-column>
          <el-table-column label="评定结果">
            <el-table-column prop="r_county" label="受影响县" min-width="1">
            </el-table-column>
            <el-table-column
              prop="r_nograding"
              label="不分级提前量/分钟"
              min-width="1"
            >
            </el-table-column>
            <el-table-column
              prop="r_grading"
              label="分级提前量/分钟"
              min-width="1"
            >
            </el-table-column>
            <el-table-column prop="r_notest" label="不分级检验" min-width="1">
            </el-table-column>
            <el-table-column prop="r_test" label="分级检验" min-width="1">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../../components/content/DatePicker";
export default {
  name: "ProvincialDetail",
  components: {
    DatePicker,
  },
  data() {
    return {
      defUnit: "所有气象台",
      unitItem: [
        { label: "所有气象台", value: "all" },
        { label: "气象台", value: "one" },
        { label: "气象台", value: "two" },
      ],
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
      defLevel: "所有等级",
      level: ["所有等级", "蓝色预警", "黄色预警", "橙色预警", "红色预警"],
      defResult: "所有结果",
      result: ["所有结果", "正确", "空报", "漏报"],
      tableTitle: ["预警信号", "实况预警信号", "评定结果"],
      tableData: [],
    };
  },
  created() {
    for (let i = 0; i < 10; i++) {
      if (i < 1) {
        let data = {
          l_unit: "湖南省气象台",
          l_name: "湖南省气象台",
          l_time: "2020-07-03 16:31",
          l_type: "暴雨",
          l_level: "橙色",
          l_city: "长沙市",
          m_county: "浏阳市",
          m_type: "类型",
          m_level: "黄色",
          m_time: "2020-07-09 05:00",
          m_city: "长沙市",
          r_county: "浏阳市",
          r_nograding: "0",
          r_grading: "0",
          r_notest: "NB",
          r_test: "NB",
        };
        this.tableData.push(data);
      } else {
        let data = {
          l_unit: "",
          l_name: "",
          l_time: "",
          l_type: "",
          l_level: "",
          l_city: "",
          m_county: "",
          m_type: "",
          m_level: "",
          m_time: "",
          r_city: "",
          r_county: "",
          r_mnograding: "",
          r_grading: "",
          r_notest: "",
          r_test: "",
        };
        this.tableData.push(data);
      }
    }
  },
};
</script>

<style lang="less">
</style>