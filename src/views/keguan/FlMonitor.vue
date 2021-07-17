<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker style="margin-right: 20px" :start="start" :end="end" @changeDate="changeDate"/>
        <el-radio-group v-model="type" @change="changeForeOrFact">
          <el-radio-button label="forecast">预报</el-radio-button>
          <el-radio-button label="fact">实况</el-radio-button>
        </el-radio-group>
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
      facname: String
    },
    data() {
      return {
        start: moment(Date.now()).add(-7, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).add(-1, 'd').format('YYYY-MM-DD'),
        tableHeader: {},
        tableData: [],
        type: 'forecast'
      }
    },
    methods: {
      changeForeOrFact() {
        this.foreAndLiveMonitor()
      },
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
        foreAndLiveMonitor(this.start, this.end, this.facname, this.type).then(res => {
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

<style lang="less">
  .el-radio-button__inner {
    font-size: 12px;
    padding: 6px 15px;
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
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #49afcd;
    border-color: #49afcd;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner:hover {
    color: #fff;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    box-shadow: none;
  }
</style>