<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
      </div>
      <hr>
      <div class="rain-detail-content">
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
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column
                  prop="obtid"
                  label="站号">
          </el-table-column>
          <el-table-column
                  prop="inputtime"
                  label="发布时间">
          </el-table-column>
          <el-table-column
                  prop="start"
                  label="开始时间">
          </el-table-column>
          <el-table-column
                  prop="end"
                  label="结束时间">
          </el-table-column>
          <el-table-column
                  prop="forerain"
                  label="预报降雨量">
          </el-table-column>
          <el-table-column
                  prop="factrain"
                  label="实况降雨">
          </el-table-column>
          <el-table-column
                  prop="rain"
                  label="检验结果">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {rainDetail} from "../../../network/zhongduan";
  import {exportExcelCom} from "../../../common/Base";

  export default {
    name: "RainDetail",
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
        this.getRainDetail()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '降水过程评定详情.xlsx'
        return exportExcelCom(document, id, title)
      },
      getRainDetail() {
        let loading = this.openLoading('#table');
        rainDetail(this.start, this.end).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.getRainDetail()
      })
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