<template>
  <div class="side-content">
    <div class="content">
      <div class="head"><DatePicker :start="start" :end="end" @changeDate="changeDate"/></div>
      <hr />
      <div class="rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="warningType" @change="changeType">
              <el-radio-button
                v-for="item in typeItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.value }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>检验要素：</span>
            <el-radio-group v-model="factory" @change="changeFactory">
              <el-radio-button
                v-for="item in factories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.value }}</el-radio-button
              >
            </el-radio-group>
          </el-menu-item>
        </el-menu>
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
      <div class="rain-examine-bottom">
        <div class="highcharts-title">
          <div class="maintitle">湖南省{{titleTime + warningType}}预警{{facTitle}}</div>
          <div class="highcharts-content" v-show="!isMask">
            <el-radio-group v-model="showType" size="mini" @change="changeShowType">
              <el-radio-button label="图表"></el-radio-button>
              <el-radio-button label="表格"></el-radio-button>
            </el-radio-group>
            <div
              id="container"
              style="width: 100%; height: calc(100% - 50px)"
              v-show="showType === '图表'"
            ></div>
            <el-table
                    id="table"
                    v-show="showType === '表格'"
                    :data="tableData"
                    border
                    class="table-fixed"
                    height="calc(100% - 64px)"
                    style="width: calc(100% - 50px); margin: 0 auto; transform: translateY(10px)"
                    :header-cell-style="{'text-align': 'center'}">
<!--              <el-table-column-->
<!--                      prop="department"-->
<!--                      label="预报时段（小时）"-->
<!--                      align="center"-->
<!--              >-->
<!--              </el-table-column>-->
              <el-table-column
                      v-for="(value, key) in tableHeader"
                      :prop="key"
                      :label="value"
                      align="center"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import {initRadios, initYears, toFix} from "../../../common/utils";
  import moment from "momnet";
  import {provincialWarning} from "../../../network/duanlin";
  import {initSaEcharts} from "../../../common/Base";

  export default {
    name: "ProvincialWarning",
    components: {
      DatePicker,
    },
    data() {
      return {
        warningType: "暴雨",
        typeItems: [
          { label: "暴雨", value: "暴雨" },
          { label: "雷雨大风", value: "雷雨大风" },
          { label: "雷电", value: "雷电" },
          { label: "冰雹", value: "冰雹" },
          { label: "综合", value: "综合" },
        ],
        factory: "ts",
        factories: [
          { label: "ts", value: "预报准确率" },
          { label: "leadtime", value: "预警提前量" },
          { label: "zh", value: "综合成绩" },
        ],
        year: moment().year(),
        years: [],
        month: moment().month() + 1,
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        isMask: false,
        showType: "图表",
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        facTitle: '预报质量',
        data: {},
        tableHeader: {},
        tableData: []
      };
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getProvincialWarning()
      },
      changeFactory(val) {
        if (val === 'ts') {
          this.facTitle = '预报质量'
        } else if (val === 'leadtime') {
          this.facTitle = '提前量'
        } else {
          this.facTitle = '综合成绩'
        }
        this.getProvincialWarning()
      },
      changeType() {
        this.getProvincialWarning()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getProvincialWarning()
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YYYY年M月D日');
          let endStr = moment(this.end).format('YYYY年M月D日');
          this.titleTime = startStr + '~' + endStr
        } else {
          if (this.month == 'year') {
            this.titleTime = this.year + '年'
            this.start = moment().year(this.year).month(0).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(11).endOf('month').format('YYYY-MM-DD')
          } else if ((this.month + '').indexOf('q') !== -1) {
            this.titleTime = this.year + '年第' + this.month.charAt(this.month.length - 1) + '季度'
            let q = parseInt(this.month.charAt(this.month.length - 1));
            this.start = moment().year(this.year).month(q * 3 - 3).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(q * 3 - 1).endOf('month').format('YYYY-MM-DD')
          } else {
            this.titleTime = this.year + '年' + this.month + '月'
            this.start = moment().year(this.year).month(this.month - 1).startOf('month').format('YYYY-MM-DD')
            this.end = moment().year(this.year).month(this.month - 1).endOf('month').format('YYYY-MM-DD')
            if (this.month == moment().month() + 1 && this.year === moment().year()) {
              this.end = moment(Date.now()).format('YYYY-MM-DD')
            }
          }
        }
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getProvincialWarning()
      },
      getProvincialWarning() {
        let target = '#container'
        if (this.showType === '表格') target = '#table'
        let loading = this.openLoading(target);
        provincialWarning(this.start, this.end, this.warningType, this.factory).then(res => {
          this.data = res.data
          if (this.showType === '图表') {
            initSaEcharts(this.data)
          } else {
            this.initTable()
          }
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      changeShowType() {
        this.getProvincialWarning()
      },
      initTable() {
        this.tableHeader = {}
        this.tableData = []
        let selectedFac = this.data['series']
        if (selectedFac.length === 0) return
        let departments = this.data['categories']
        this.tableHeader['department'] = '发布单位'
        for (let i = 0; i < selectedFac.length; i++) {
          this.tableHeader['name' + i] = selectedFac[i].name
        }
        for (let i = 0; i < departments.length; i++) {
          let data = {}
          data['department'] = departments[i]
          for (let j = 0; j < selectedFac.length; j++) {
            data['name' + j] = toFix(selectedFac[j]['data'][i], 2)
          }
          this.tableData.push(data)
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getProvincialWarning()
      });
    }
};
</script>

<style lang="less">
  @import "../../../assets/less/common";
    .time-period-radio {
      margin-left: 20px;
      margin-top: 10px;
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
      .el-radio-button__inner:disabled:hover {
        color: #C0C4CC;
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
</style>