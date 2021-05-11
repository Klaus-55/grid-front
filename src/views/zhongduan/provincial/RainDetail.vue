<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
      </div>
      <hr>
      <div class="rain-detail-content">
        <el-table
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center', backgroundColor: '#39A5F8', color: '#FFF'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column
                  prop="obtid"
                  label="站号">
          </el-table-column>
          <el-table-column
                  prop="issueTime"
                  label="发布时间">
          </el-table-column>
          <el-table-column
                  prop="startTime"
                  label="开始时间">
          </el-table-column>
          <el-table-column
                  prop="endTime"
                  label="结束时间">
          </el-table-column>
          <el-table-column
                  prop="forecastRainfall"
                  label="预报降雨量">
          </el-table-column>
          <el-table-column
                  prop="factRainfall"
                  label="实况降雨">
          </el-table-column>
          <el-table-column
                  prop="rs"
                  label="检验结果">
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
    name: "RainDetail",
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
          forecaster: '预报员1',
          obtid: 'P5463',
          issueTime: '2020-06-04 09:00',
          startTime: '2020-06-03 08:00',
          endTime: '2020-06-07 09:00',
          forecastRainfall: '50.0-100.0mm',
          factRainfall: '50.0-100.0mm',
          rs: 'NA',
        }
        this.tableData.push(data)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .rain-detail-content {
    height: calc(100% - 61px);
    background-color: @bgColor;
  }
</style>