<template>
  <div class="side-content">
    <div class="content">
      <div class="quality-report-head">
        <el-menu mode="horizontal">
          <el-menu-item>
            <el-select v-model="type" @change="changeType">
              <el-option
                      v-for="item in types"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="fhour" @change="changeFhours">
              <el-option
                      v-for="item in fhours"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>

          </el-menu-item>
          <el-menu-item>
            <el-select v-model="area" @change="changeArea">
              <el-option
                      v-for="item in areas"
                      :key="item"
                      :label="item"
                      :value="item">
              </el-option>
            </el-select>
            <el-select v-model="reportType" @change="changeReportType">
              <el-option
                      v-for="item in reportTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-menu-item>
          <el-menu-item>
            <el-select v-model="year" @change="changeYear">
              <el-option
                      v-for="item in years"
                      :key="item"
                      :label="item + '年'"
                      :value="item">
              </el-option>
            </el-select>
            <el-select v-model="month" @change="changeMonth">
              <el-option
                      v-for="item in months"
                      :key="item"
                      :label="item + '月'"
                      :value="item">
              </el-option>
            </el-select>
          </el-menu-item>
          <el-menu-item>
            <el-button type="primary" size="mini">查询</el-button>
          </el-menu-item>
          <el-menu-item>
            <date-picker @changeDate="changeDate"></date-picker>
          </el-menu-item>
        </el-menu>
      </div>
      <hr>
      <div class="quality-report-table">
        <el-table
                :data="tableData"
                border
                height="100%"
                stripe
                :span-method="spanMethod"
                :header-cell-style="{'text-align': 'center'}"
                :cell-style="{'text-align': 'center'}">
          <el-table-column label="检验方法" prop="c1" fixed></el-table-column>
          <el-table-column label="检验量级" prop="c2" fixed></el-table-column>
          <el-table-column label="0~12小时">
            <el-table-column label="TS" prop="TS12"></el-table-column>
            <el-table-column label="SS" prop="SS12"></el-table-column>
            <el-table-column label="空报率" prop="FAR12"></el-table-column>
            <el-table-column label="漏报率" prop="PO12"></el-table-column>
          </el-table-column>
          <el-table-column label="12~24小时">
            <el-table-column label="TS" prop="TS24"></el-table-column>
            <el-table-column label="SS" prop="SS24"></el-table-column>
            <el-table-column label="空报率" prop="FAR24"></el-table-column>
            <el-table-column label="漏报率" prop="PO24"></el-table-column>
          </el-table-column>
          <el-table-column label="24~36小时">
            <el-table-column label="TS" prop="TS36"></el-table-column>
            <el-table-column label="SS" prop="SS36"></el-table-column>
            <el-table-column label="空报率" prop="FAR36"></el-table-column>
            <el-table-column label="漏报率" prop="PO36"></el-table-column>
          </el-table-column>
          <el-table-column label="36~48">
            <el-table-column label="TS" prop="TS48"></el-table-column>
            <el-table-column label="SS" prop="SS48"></el-table-column>
            <el-table-column label="空报率" prop="FAR48"></el-table-column>
            <el-table-column label="漏报率" prop="PO48"></el-table-column>
          </el-table-column>
          <el-table-column label="48~72">
            <el-table-column label="TS" prop="TS72"></el-table-column>
            <el-table-column label="SS" prop="SS72"></el-table-column>
            <el-table-column label="空报率" prop="FAR72"></el-table-column>
            <el-table-column label="漏报率" prop="PO72"></el-table-column>
          </el-table-column>
          <el-table-column label="72~84">
            <el-table-column label="TS" prop="TS84"></el-table-column>
            <el-table-column label="SS" prop="SS84"></el-table-column>
            <el-table-column label="空报率" prop="FAR84"></el-table-column>
            <el-table-column label="漏报率" prop="PO84"></el-table-column>
          </el-table-column>
          <el-table-column label="84~96">
            <el-table-column label="TS" prop="TS96"></el-table-column>
            <el-table-column label="SS" prop="SS96"></el-table-column>
            <el-table-column label="空报率" prop="FAR96"></el-table-column>
            <el-table-column label="漏报率" prop="PO96"></el-table-column>
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
    name: "QualityReport",
    components: {
      DatePicker
    },
    data() {
      return {
        type: 'czjxh',
        types: [
          {value: 'czjxh', label: '城镇精细化'}
        ],
        fhour: '72',
        fhours: [
          {value: '72', label: '0~72'},
          {value: '120', label: '0~120'}
        ],
        area: '湖南省',
        areas: ['湖南省'],
        reportType: 'month',
        reportTypes: [
          {value: 'month', label: '按月度报表'}
        ],
        year: '2020',
        years: ['2021', '2020', '2019'],
        month: 1,
        months: [1, 2, 3, 4, 5],
        tableData: []
      }
    },
    methods: {
      changeType(type) {
        alert(type)
      },
      changeFhours(fhour) {
        alert(fhour)
      },
      changeArea(area) {
        alert(area)
      },
      changeReportType(reportType) {
        alert(reportType)
      },
      changeYear(year) {
        alert(year)
      },
      changeMonth(month) {
        alert(month)
      },
      changeDate(startDate, endDate) {
        let startStr = moment(startDate).format('YYYY-MM-DD')
        let endStr = moment(endDate).format('YYYY-MM-DD')
        console.log(startStr)
        console.log(endStr)
      },
      spanMethod({rowIndex, columnIndex}) {
        if (columnIndex === 0 && rowIndex !== 16) {
          if (rowIndex === 0) {
            return {rowspan: 12, colspan: 1}
          } else if (rowIndex === 12) {
            return {rowspan: 4, colspan: 1}
          } else {
            return {rowspan: 0, colspan: 0}
          }
        } else if (rowIndex === 16) {
          if (columnIndex === 0) {
            return {rowspan: 1, colspan: 2}
          } else if (columnIndex === 1) {
            return {rowspan: 0, colspan: 0}
          }
        }
      }
    },
    created() {
      this.$nextTick(() => {
        let arr = ['小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨', '小雪', '中雪', '大雪', '暴雪', '一般性降水',
          '暴雨(雪)以上', '≥0.0mm降水', '≥10mm降水', '≥25mm降水', '≥50mm降水', '晴(雨)检验(PC)']
        for (let i = 0; i < arr.length; i++) {
          let data = {
            TS12: 78,
            SS12: 78,
            FAR12: 85,
            PO12: 59,
            TS24: 78,
            SS24: 78,
            FAR24: 85,
            PO24: 59,
            TS36: 78,
            SS36: 78,
            FAR36: 85,
            PO36: 59,
            TS48: 78,
            SS48: 78,
            FAR48: 85,
            PO48: 59,
            TS72: 78,
            SS72: 78,
            FAR72: 85,
            PO72: 59,
            TS84: 78,
            SS84: 78,
            FAR84: 85,
            PO84: 59,
            TS96: 78,
            SS96: 78,
            FAR96: 85,
            PO96: 59
          }
          if (i <= 11) {
            data['c1'] = '分级检验'
          } else if (i > 11 && i < 16) {
            data['c1'] = '累加检验'
          } else {
            data['c1'] = '晴(雨)检验(PC)'
          }
          data['c2'] = arr[i]
          this.tableData.push(data)
        }
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .quality-report-head {
    position: relative;
    height: 25px;
    .el-menu {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: none;
      background-color: transparent;
    }
    .el-menu--horizontal > .el-menu-item {
      border-bottom: none;
      color: #303133;
      height: 25px;
      line-height: 25px;
    }
    .el-menu-item {
      cursor: default;
      font-size: 14px;
      padding: 0 20px;
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }

    .el-input__inner {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      border-radius: 0;
      padding: 0 0 0 6px;
    }
    .el-menu-item:first-child {
      padding: 0 20px 0 0;
      .el-select:first-child {
        width: 100px;
        margin-right: 10px;
      }
      .el-select:last-child {
        width: 60px;
      }
    }
    .el-menu-item:nth-child(2) {
      .el-select:first-child {
        width: 70px;
        margin-right: 10px;
      }
      .el-select:last-child {
        width: 90px;
      }
    }
    .el-menu-item:nth-child(3) {
      .el-select:first-child {
        width: 70px;
        margin-right: 10px;
      }
      .el-select:last-child {
        width: 50px;
      }
    }
    .el-button--mini {
      padding: 3px 19px;
    }
    .el-input__suffix {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .el-select .el-input .el-select__caret {
      font-size: 12px;
      color: #39A5F8;
    }
    .el-input__icon {
      width: 20px;
      line-height: 25px;
    }
    .el-icon-arrow-up:before {
      content: "\e78f";
    }
    .el-menu-item:last-child {
      .el-input__inner {
        padding: 0 20px;
      }
      .el-button {
        margin-left: 20px;
      }
    }
  }
  .quality-report-table {
    height: calc(100% - 51px);
    background-color: @bgColor;
  }
</style>