<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
<!--        <el-link target="_blank" @click="" style="float: right">评定方法</el-link>-->
      </div>
      <hr>

      <div class="rain-progress-middle">
        <div class="time-period-radio">
          <span>检验时段：</span>
          <el-radio-group v-model="month" @change="changeTimePeriod">
            <el-select v-model="year" @change="changeYear">
              <el-option
                      v-for="item in years"
                      :key="item"
                      :label="item + '年'"
                      :value="item">
              </el-option>
            </el-select>
            <el-radio-button v-for="item in radios"
                             :label="item.label"
                             :disabled="item.disabled">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="rain-progress-bottom">
<!--        <h2>{{titleTime}}降水过程预报质量</h2>-->
        <div id="rp-chart" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {initRadios, initYears} from "../../../common/utils";
  import {rainProgress} from "../../../network/zhongduan";
  import {initMsEcharts} from "../../../common/Base";

  export default {
    name: "RainProgress",
    components: {
      DatePicker
    },
    data() {
      return {
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        data: {}
      }
    },
    computed: {
      title() {
        return this.titleTime + '降水过程预报质量'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getRainProgress()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getRainProgress()
      },
      updateInfo(type) {
        if (type === 'date') {
          let startStr = moment(this.start).format('YYYY年M月D日');
          let endStr = moment(this.end).format('YYYY年M月D日');
          this.titleTime = startStr + '~' + endStr
        } else {
          if (this.month == 'year') {
            this.titleTime = this.year + '年全年'
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
        this.getRainProgress()
      },
      getRainProgress() {
        let loading = this.openLoading('#rp-chart');
        rainProgress(this.start, this.end).then(res => {
          this.data = res.data
          initMsEcharts(this.data, this.title, 'rp-chart')
          this.$nextTick(() => {
            loading.close()
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getRainProgress()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .rain-progress-middle {
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
  .rain-progress-bottom {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 150px);
    background-color: @bgColor;
    padding-top: 50px;
    /*h2 {*/
    /*  font-size: 1.3em;*/
    /*  padding-top: 30px;*/
    /*  padding-bottom: 30px;*/
    /*  text-align: center;*/
    /*}*/
  }
</style>