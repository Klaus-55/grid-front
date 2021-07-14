<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker :start="start" :end="end" @changeDate="changeDate"/>
      </div>
      <hr>
      <el-table
              id="table"
              :data="tableData"
              :header-cell-style="{'text-align': 'center'}"
              :cell-style="isRed"
              height="calc(100% - 64px)"
              border
              style="width: 100%;">
        <el-table-column
                v-for="item in tableHeader"
                :prop="item.prop"
                :label="item.label"
                align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../components/content/DatePicker2";
  import moment from "momnet"
  import {foreAndLiveMonitor} from "../../network/keguan";

  export default {
    name: "FlMonitor",
    components: {
      DatePicker
    },
    props: {
      type: String
    },
    data() {
      return {
        start: moment(Date.now()).add(-7, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).add(-1, 'd').format('YYYY-MM-DD'),
        tableHeader: {},
        tableData: []
      }
    },
    methods: {
      changeDate(start, end) {
        this.start = moment(start).format("YYYY-MM-DD")
        this.end = moment(end).format("YYYY-MM-DD")
        this.foreAndLiveMonitor()
      },
      isRed({row, column, rowIndex, columnIndex}) {
        if (row[column['property']] === 0) {
          return {
            backgroundColor: 'red'
          }
        }
      },
      foreAndLiveMonitor() {
        let loading = this.openLoading('#table');
        foreAndLiveMonitor(this.start, this.end, this.type).then(res => {
          this.tableHeader = res.data.tableHeader
          this.tableData = res.data.tableData
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.foreAndLiveMonitor()
      })
    }
  }
</script>

<style scoped>

</style>