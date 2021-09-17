<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker @changeDate="changeDate" :start="start" :end="end"/>
<!--        <span style="margin-left: 50px">发布单位：</span>-->
<!--        <el-select v-model="department" class="unitSelect" @change="changeDepartment">-->
<!--          <el-option-->
<!--                  v-for="item in departments"-->
<!--                  :key="item.value"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value"-->
<!--          >-->
<!--          </el-option>-->
<!--        </el-select>-->
      </div>
      <hr/>
      <div class="h-3rem rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="warningType" @change="changeWarningType">
              <el-radio-button v-for="item in warningTypes" :label="item" :key="item">{{
                item
                }}
              </el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>预警等级：</span>
            <el-radio-group v-model="level" @change="changeLevel">
              <el-radio-button
                      v-for="item in levels"
                      :label="item"
                      :key="item"
              >{{ item === 'all' ? '所有等级' : item + '预警'}}
              </el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验结果：</span>
            <el-radio-group v-model="rs" @change="changeRs">
              <el-radio-button
                      v-for="item in rss"
                      :label="item"
                      :key="item"
              >{{ item === 'all' ? '所有结果' : item }}
              </el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="table-style rain-examine-bottom">
        <el-table
                id="table"
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column label="预警信号">
            <el-table-column prop="department" label="发布单位" min-width="2">
            </el-table-column>
            <el-table-column prop="forecaster" label="发布人" min-width="2">
            </el-table-column>
            <el-table-column prop="inputtime" label="发布时间" min-width="2">
            </el-table-column>
            <el-table-column prop="warningtype" label="预警类型" min-width="1">
            </el-table-column>
            <el-table-column prop="level" label="预警等级" min-width="1">
            </el-table-column>
            <el-table-column prop="area" label="受影响地市" min-width="1">
            </el-table-column>
          </el-table-column>
          <el-table-column label="实况预警信号">
            <el-table-column prop="district" label="受影响县" min-width="1">
            </el-table-column>
            <el-table-column prop="facttype" label="类型" min-width="1">
            </el-table-column>
            <el-table-column prop="factlevel" label="等级" min-width="1">
            </el-table-column>
            <el-table-column prop="occtime" label="发生时间" min-width="2">
            </el-table-column>
            <el-table-column prop="farea" label="受影响地市" min-width="1">
            </el-table-column>
          </el-table-column>
          <el-table-column label="评定结果">
            <el-table-column prop="fdistrict" label="受影响县" min-width="1">
            </el-table-column>
            <el-table-column
                    prop="leadtime_bfj"
                    label="不分级提前量/分钟"
                    min-width="1"
            >
            </el-table-column>
            <el-table-column
                    prop="leadtime_fj"
                    label="分级提前量/分钟"
                    min-width="1"
            >
            </el-table-column>
            <el-table-column prop="warningp_bfj" label="不分级检验" min-width="1">
            </el-table-column>
            <el-table-column prop="warningp_fj" label="分级检验" min-width="1">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {provincialDetail} from "../../../network/duanlin";

  export default {
    name: "ProvincialDetail",
    components: {
      DatePicker,
    },
    data() {
      return {
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        department: "all",
        departments: [
          {label: "所有气象台", value: "all"},
          {label: "湖南省气象台", value: "湖南省气象台"},
          {label: "长沙市气象台", value: "长沙市气象台"},
          {label: "株洲市气象台", value: "株洲市气象台"},
          {label: "湘潭市气象台", value: "湘潭市气象台"},
          {label: "衡阳市气象台", value: "衡阳市气象台"},
          {label: "邵阳市气象台", value: "邵阳市气象台"},
          {label: "岳阳市气象台", value: "岳阳市气象台"},
          {label: "常德市气象台", value: "常德市气象台"},
          {label: "张家界市气象台", value: "张家界市气象台"},
          {label: "益阳市气象台", value: "益阳市气象台"},
          {label: "郴州市气象台", value: "郴州市气象台"},
          {label: "永州市气象台", value: "永州市气象台"},
          {label: "怀化市气象台", value: "怀化市气象台"},
          {label: "娄底市气象台", value: "娄底市气象台"},
          {label: "湘西州气象台", value: "湘西州气象台"},
        ],
        warningType: "暴雨",
        warningTypes: ["暴雨", "雷雨大风", "雷电", "冰雹"],
        level: "all",
        levels: ["all", "蓝色", "黄色", "橙色", "红色"],
        rs: "all",
        rss: ["all", "正确", "空报", "漏报"],
        tableTitle: ["预警信号", "实况预警信号", "评定结果"],
        tableData: [],
      };
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.getProvincialDetail()
      },
      changeDepartment() {
        this.getProvincialDetail()
      },
      changeWarningType() {
        this.getProvincialDetail()
      },
      changeLevel() {
        this.getProvincialDetail()
      },
      changeRs() {
        this.getProvincialDetail()
      },
      getProvincialDetail() {
        let loading = this.openLoading('#table');
        provincialDetail(this.start, this.end, this.warningType, this.level, this.rs).then(res => {
          this.tableData = res.data
          loading.close()
        })
      }
    },
    created() {
      this.$nextTick(() =>{
        this.getProvincialDetail()
      })
    },
  };
</script>

<style lang="less">
  .table-style {
    .el-table th,
    .el-table tr {
      height: 4rem;
    }

    .el-table tbody {
      tr:nth-child(2n + 1) {
        background-color: #f8f8f8 !important;
      }
    }

    .el-table__header tr:nth-child(1) {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;

      th {
        background-color: #39a5f8;
      }
    }

    .el-table__header tr:nth-child(2) {
      color: #717171;

      th {
        padding: 5px 0px;
        background-color: #fff;
      }
    }

    .el-table th,
    .el-table tr {
      height: 4rem;
    }

    .el-table tbody {
      tr:nth-child(2n + 1) {
        background-color: #f8f8f8 !important;
      }
    }
  }
</style>