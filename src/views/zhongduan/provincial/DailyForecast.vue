<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <div class="head-time-period">
          <span>检验时段：</span>
          <el-radio-group v-model="period" @change="changePeriod">
            <el-radio-button label="24">24小时</el-radio-button>
            <el-radio-button label="48">48小时</el-radio-button>
            <el-radio-button label="72">72小时</el-radio-button>
            <el-radio-button label="96">96小时</el-radio-button>
            <el-radio-button label="120">120小时</el-radio-button>
            <el-radio-button label="h72">0-72小时</el-radio-button>
            <el-radio-button label="h120">0-120小时</el-radio-button>
          </el-radio-group>
        </div>

        <span style="margin-left: 50px">站点类型：</span>
        <el-select v-model="obtType" placeholder="" @change="changeObtTypes">
          <el-option
                  v-for="item in obtTypes"
                  :key="item"
                  :label="item"
                  :value="item"
          >
          </el-option>
        </el-select>

        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
      </div>
      <hr>
      <div class="daily-forecast-middle">
        <div class="time-period-radio">
          <span>检验时段：</span>
          <el-radio-group v-model="month" @change="changeTimePeriod">
            <el-select v-model="year" @change="changeYear">
              <el-option
                      v-for="item in years"
                      :key="item"
                      :label="item + '年'"
                      :value="item"></el-option>
            </el-select>
            <el-radio-button v-for="item in radios"
                             :label="item.label"
                             :disabled="item.disabled">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
<!--      <div>降水站点类型：{{rainType}};温度站点类型：{{tempType}}</div>-->
      <div class="daily-forecast-bottom">
        <el-table
                id="table"
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center', 'backgroundColor': '#F5F7FA'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  fixed
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column label="晴雨" prop="qy"></el-table-column>
          <el-table-column label="一般性降水" prop="ybx"></el-table-column>
          <el-table-column label="暴雨及以上" prop="by"></el-table-column>
          <el-table-column label="暴雨分级" prop="byfj"></el-table-column>
          <el-table-column label="综合降水" prop="zhjs"></el-table-column>
          <el-table-column label="最高温" prop="maxt"></el-table-column>
          <el-table-column label="最低温" prop="mint"></el-table-column>
          <el-table-column label="班次" prop="bc"></el-table-column>
          <el-table-column label="实际成绩" prop="act_zh"></el-table-column>
          <el-table-column label="百分制成绩" prop="per_zh"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {dailyForecast, getScoreByYear} from "../../../network/zhongduan";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import {initRadios, initYears} from "../../../common/utils";

  export default {
    name: "DailyForecast",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        period: '24',
        obtType: 'S1912',
        obtTypes: ['S99', 'S322', 'S421', 'S1912'],
        rainType: 'S1912',
        tempType: 'S421',
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        radios: [],
        types: {
          qy: '晴雨准确率',
          ybx: '一般性降水准确率',
          by: '暴雨及以上准确率',
          maxt_pc: '最高温准确率',
          mint_pc: '最低温准确率'
        },
        tableData: [],
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYYMMDD")
        this.end = moment(endTime).format("YYYYMMDD")
        this.rainType = this.obtType
        this.tempType = this.obtType
        this.updateInfo('date')
        this.getDailyForecast()
      },
      changePeriod() {
        if (this.month == 'year') {
          this.getScoreByYear()
        } else {
          this.getDailyForecast()
        }
      },
      changeObtTypes(val) {
        this.rainType = val
        this.tempType = val
        this.getDailyForecast()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.initObtType()
        if (this.month == 'year') {
          this.getScoreByYear()
        } else {
          this.getDailyForecast()
        }
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.initObtType()
        if (this.month == 'year') {
          this.getScoreByYear()
        } else {
          this.getDailyForecast()
        }
      },
      getDailyForecast() {
        let loading = this.openLoading('#table');
        dailyForecast(this.start, this.end, this.period, this.rainType, this.tempType).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      getScoreByYear() {
        let loading = this.openLoading('#table');
        getScoreByYear(this.start, this.end, this.period).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      initObtType() {
        let month = this.month
        if (month == 12 || month == 1 || month == 2 || month == 'q1') {
          this.rainType = 'S99'
          this.tempType = 'S421'
        } else {
          this.rainType = 'S1912'
          this.tempType = 'S421'
        }
      },
      exportExcel() {
        let id = '#table'
        let period = this.period
        if (period.indexOf('h') !== -1) {
          period = period.replace('h', '0-')
        }
        let title = this.titleTime + ' ' + period + '时评分结果.xlsx'
        /* 从表生成工作簿对象 */
        let fix = document.querySelector('.el-table__fixed');
        let wb;
        if (fix) {
          wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fix));
          document.querySelector(id).appendChild(fix);
        } else {
          wb = XLSX.utils.table_to_book(document.querySelector(id));
        }
        /* 获取二进制字符串作为输出 */
        let wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            title
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YYYY年M月D日');
          let endStr = moment(this.end).format('YYYY年M月D日');
          this.titleTime = startStr + '~' + endStr
        } else {
          if (this.month == 'year') {
            this.titleTime = this.year + '年全年'
            this.start = moment().year(this.year).month(0).startOf('month').subtract(1, 'months').format('YYYYMMDD')
            this.end = moment().year(this.year).month(11).endOf('month').subtract(1, 'months').format('YYYYMMDD')
          } else if ((this.month + '').indexOf('q') !== -1) {
            this.titleTime = this.year + '年第' + this.month.charAt(this.month.length - 1) + '季度'
            let q = parseInt(this.month.charAt(this.month.length - 1));
            this.start = moment().year(this.year).month(q * 3 - 3).startOf('month').subtract(1, 'months').format('YYYYMMDD')
            this.end = moment().year(this.year).month(q * 3 - 1).endOf('month').subtract(1, 'months').format('YYYYMMDD')
          } else {
            this.titleTime = this.year + '年' + this.month + '月'
            this.start = moment().year(this.year).month(this.month - 1).startOf('month').format('YYYYMMDD')
            this.end = moment().year(this.year).month(this.month - 1).endOf('month').format('YYYYMMDD')
          }
        }
      },
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.initObtType()
        this.getDailyForecast()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .head-time-period {
    display: inline-block;
    margin-left: 50px;

    .el-radio-button__inner {
      padding: 2px 15px;
    }
  }

  .daily-forecast-middle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70px;
    background-color: @bgColor;
    margin-bottom: 20px;

    .time-period-radio {
      .el-select {
        vertical-align: middle;
      }
      .el-input__inner {
        width: 65px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        background-color: @bgColor;
        border-radius: 0;
        padding: 0 0 0 6px;

      }
      .el-input__suffix {
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .el-select .el-input .el-select__caret {
        font-size: 12px;
        color: @mainColor;
      }
      .el-input__icon {
        width: 20px;
        line-height: 25px;
      }
      .el-icon-arrow-up:before {
        content: "\e78f";
      }
      .el-radio-button__inner {
        width: 65px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        background: @bgColor;
        padding: 0;
      }
    }
  }

  .daily-forecast-bottom {
    /*height: calc(100% - 131px);*/
    height: calc(100% - 141px);
    background-color: @bgColor;
  }
</style>