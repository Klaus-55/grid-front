<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
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

        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
      </div>
      <hr>
      <div class="daily-forecast-middle" v-show="false">
        <span>评分类型：</span>
        <el-checkbox-group v-model="scoreType" @change="changeType">
          <el-checkbox v-for="(value, index) in types" :label="index" :key="index">{{value}}</el-checkbox>
        </el-checkbox-group>
      </div >
      <div class="daily-forecast-bottom">
        <el-table
                id="table"
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{'text-align': 'center'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column
                  fixed
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column label="S99">
            <el-table-column label="晴雨" prop="qy_S99"></el-table-column>
            <el-table-column label="一般性降水" prop="ybx_S99"></el-table-column>
            <el-table-column label="暴雨及以上" prop="by_S99"></el-table-column>
            <el-table-column label="综合降水" prop="zh_S99"></el-table-column>
            <el-table-column label="最高温" prop="maxt_S99"></el-table-column>
            <el-table-column label="最低温" prop="mint_S99"></el-table-column>
          </el-table-column>
          <el-table-column label="S322">
            <el-table-column label="晴雨" prop="qy_S322"></el-table-column>
            <el-table-column label="一般性降水" prop="ybx_S322"></el-table-column>
            <el-table-column label="暴雨及以上" prop="by_S322"></el-table-column>
            <el-table-column label="综合降水" prop="zh_S322"></el-table-column>
            <el-table-column label="最高温" prop="maxt_S322"></el-table-column>
            <el-table-column label="最低温" prop="mint_S322"></el-table-column>
          </el-table-column>
          <el-table-column label="S421">
            <el-table-column label="晴雨" prop="qy_S421"></el-table-column>
            <el-table-column label="一般性降水" prop="ybx_S421"></el-table-column>
            <el-table-column label="暴雨及以上" prop="by_S421"></el-table-column>
            <el-table-column label="综合降水" prop="zh_S421"></el-table-column>
            <el-table-column label="最高温" prop="maxt_S421"></el-table-column>
            <el-table-column label="最低温" prop="mint_S421"></el-table-column>
          </el-table-column>
          <el-table-column label="S1912">
            <el-table-column label="晴雨" prop="qy_S1912"></el-table-column>
            <el-table-column label="一般性降水" prop="ybx_S1912"></el-table-column>
            <el-table-column label="暴雨及以上" prop="by_S1912"></el-table-column>
            <el-table-column label="综合降水" prop="zh_S1912"></el-table-column>
            <el-table-column label="最高温" prop="maxt_S1912"></el-table-column>
            <el-table-column label="最低温" prop="mint_S1912"></el-table-column>
          </el-table-column>
          <el-table-column label="班次" prop="bc"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker";
  import moment from "momnet";
  import {dailyForecast} from "../../../network/zhongduan";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";

  export default {
    name: "DailyForecast",
    components: {
      DatePicker
    },
    data() {
      return {
        // start: moment(moment(Date.now()).add(-7,'days')).format('YYYYMMDD'),
        start: '20210501',
        // end: moment(moment(Date.now()).add(-1,'days')).format('YYYYMMDD'),
        end: '20210510',
        period: '24',
        scoreType: ['qy', 'ybx', 'by', 'maxt_pc', 'mint_pc'],
        types: {
          qy: '晴雨准确率',
          ybx: '一般性降水准确率',
          by: '暴雨及以上准确率',
          maxt_pc: '最高温准确率',
          mint_pc: '最低温准确率'
        },
        tableData: []
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYYMMDD")
        this.end = moment(endTime).format("YYYYMMDD")
        this.getDailyForecast(this.start, this.end, this.period)
      },
      changePeriod() {
        this.getDailyForecast(this.start, this.end, this.period)
      },
      changeType(type) {
        alert(type)
      },
      getDailyForecast(start, end, fTime) {
        let loading = this.openLoading('#table');
        dailyForecast(start, end, fTime).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      exportExcel() {
        let id = '#table'
        let period = this.period
        if (period.indexOf('h') !== -1) {
          period = period.replace('h', '0-')
        }
        let title = this.start + '-' + this.end + '日' + period + '时评分结果.xlsx'
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
      }
    },
    created() {
      this.$nextTick(() => {
        this.getDailyForecast(this.start, this.end, this.period)
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
    height: 60px;
    font-size: 12px;
    background-color: @bgColor;
    margin-bottom: 20px;

    .el-checkbox-group {
      display: inline-block;
      width: calc(100% - 200px);
      box-sizing: border-box;
      padding-left: 10px;
    }

    .el-checkbox {
      color: #303133;
      margin-right: 40px;
    }

    .el-checkbox__inner {
      width: 11px;
      height: 11px;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: transparent;
      border-color: #DCDFE6;
    }

    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: #DCDFE6;
    }

    .el-checkbox__inner::after {
      border: 2px solid #03b452;
      border-left: 0;
      border-top: 0;
      left: 2px;
      top: -1px;
    }

    .el-checkbox__label {
      font-size: 12px;
      padding-left: 3px;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #303133;
    }
  }

  .daily-forecast-bottom {
    /*height: calc(100% - 131px);*/
    height: calc(100% - 71px);
    background-color: @bgColor;
  }
</style>