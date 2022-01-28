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
                  v-for="item in tableHeader"
                  :prop="item.prop"
                  :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {getSnowFact} from "../../../network/zhongduan";
  import {exportExcelCom} from "../../../common/Base";

  export default {
    name: "SnowFall",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(Date.now()).add(-1, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        tableData: [],
        tableHeader: [
          {prop: 'station_id_c', label: '站号'},
          {prop: 'datetime', label: '时间'},
          {prop: 'obtname', label: '站名'},
          {prop: 'area', label: '地市'},
          {prop: 'district5', label: '区县'},
          {prop: 'pre_1h', label: '1小时降水量'},
          {prop: 'pre_before_1', label: '降水量(前3小时)'},
          {prop: 'pre_before_2', label: '降水量(前2小时)'},
          {prop: 'pre_1h', label: '降水量(前1小时)'},
          {prop: 'pre_before_3h', label: '前3小时降水量'},
          {prop: 'pre_1h', label: '降水量(后1小时)'},
          {prop: 'pre_after_2', label: '降水量(后2小时)'},
          {prop: 'pre_after_3', label: '降水量(后3小时)'},
          {prop: 'pre_after_3h', label: '后3小时降水量'},
          {prop: 'snow_depth', label: '积雪深度'},
          {prop: 'wep_now_zw', label: '现在天气现象'},
          {prop: 'wep_past_1_zw', label: '过去天气现象1'},
          {prop: 'wep_past_2_zw', label: '过去天气现象2'},
        ]
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.getSnowFact()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '降雪实况.xlsx'
        return exportExcelCom(document, id, title)
      },
      getSnowFact() {
        let loading = this.openLoading('#table');
        getSnowFact(this.start, this.end).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.getSnowFact()
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