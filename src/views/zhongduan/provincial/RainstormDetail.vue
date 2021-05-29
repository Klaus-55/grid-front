<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
      </div>
      <hr>
      <div class="rainstorm-detail-content">
        <el-table
                id="table"
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center', backgroundColor: '#39A5F8', color: '#FFF'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  prop="inputtime"
                  label="预报时间">
          </el-table-column>
          <el-table-column
                  prop="obtid"
                  label="站点">
          </el-table-column>
          <el-table-column
                  prop="rain"
                  label="预报降雨量">
          </el-table-column>
          <el-table-column
                  prop="factrain"
                  label="实况降雨量">
          </el-table-column>
          <el-table-column
                  prop="bestobtid"
                  label="临近最高分站站点">
          </el-table-column>
          <el-table-column
                  prop="factrainbest"
                  label="最高分站点雨量">
          </el-table-column>
          <el-table-column
                  prop="rain50"
                  label="50mm检验">
          </el-table-column>
          <el-table-column
                  prop="rain100"
                  label="100mm检验">
          </el-table-column>
          <el-table-column
                  prop="rain250"
                  label="250mm检验">
          </el-table-column>
          <el-table-column
                  prop="score"
                  label="得分">
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {rainstormDetail} from "../../../network/zhongduan";

  export default {
    name: "RainstormDetail",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(Date.now()).add(-7, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        tableData: []
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.getRainstormDetail()
      },
      getRainstormDetail() {
        let loading = this.openLoading('#table')
        rainstormDetail(this.start, this.end).then(res => {
          this.tableData = res.data
          loading.close()
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.getRainstormDetail()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .rainstorm-detail-content {
    height: calc(100% - 61px);
    background-color: @bgColor;
    .el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
      padding-left: 0;
    }
    .el-table .cell {
      padding-left: 0;
      padding-right: 0;
    }
  }
</style>