<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
      </div>
      <hr>
      <div class="rainstorm-detail-content">
        <el-table
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center', backgroundColor: '#39A5F8', color: '#FFF'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  prop="forecastTime"
                  label="预报时间">
          </el-table-column>
          <el-table-column
                  prop="obtid"
                  label="站点">
          </el-table-column>
          <el-table-column
                  prop="forecastRainfall"
                  label="预报降雨量">
          </el-table-column>
          <el-table-column
                  prop="factRainfall"
                  label="实况降雨量">
          </el-table-column>
          <el-table-column
                  prop="nearObt"
                  label="临近最高分站站点">
          </el-table-column>
          <el-table-column
                  prop="nearObtRainfall"
                  label="最高分站点雨量">
          </el-table-column>
          <el-table-column
                  prop="ins50"
                  label="50mm检验">
          </el-table-column>
          <el-table-column
                  prop="ins100"
                  label="100mm检验">
          </el-table-column>
          <el-table-column
                  prop="ins250"
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
  import DatePicker from "../../../components/content/DatePicker";
  import moment from "momnet";
  export default {
    name: "RainstormDetail",
    components: {
      DatePicker
    },
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        let startStr = moment(startTime).format("YYYY-MM-DD")
        let endStr = moment(endTime).format("YYYY-MM-DD")
        console.log(startStr)
        console.log(endStr)
      }
    },
    created() {
      for (let i = 0; i < 20; i++) {
        let data = {
          forecastTime: '2020-01-21 12:00',
          obtid: '57585',
          forecastRainfall: '50.0',
          factRainfall: '21.8',
          nearObt: 'P3536',
          nearObtRainfall: '53.1',
          ins50: 'NF',
          ins100: '-',
          ins250: '-',
          score: '100.0',
        }
        this.tableData.push(data)
      }
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