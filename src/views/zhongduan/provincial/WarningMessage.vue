<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker2 @changeDate="changeDate" :start="start" :end="end"/>
<!--        <el-button type="text" @click="open">评定方法</el-button>-->
      </div>
      <hr>
      <div class="warning-message-middle">
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

      <div class="warning-message-bottom">
<!--        <h2>{{titleTime}}预警消息预报质量</h2>-->
        <div id="container" style="width: 100%; height:calc(100% - 84px)"></div>
      </div>

    </div>
  </div>
</template>

<script>
  import DatePicker2 from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {warningMessage} from "../../../network/zhongduan";
  import {initRadios, initYears} from "../../../common/utils";
  import {waringMessageVar} from "../../../common/vars";
  import {initMsEcharts} from "../../../common/Base";

  export default {
    name: "WarningMessage",
    components: {
      DatePicker2
    },
    data() {
      return {
        years: [],
        year: moment().year(),
        month: moment().month() + 1,
        titleTime: moment().year() + '年' + (moment().month() + 1) + '月',
        data: {},
        radios: [],
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
      }
    },
    computed: {
      title() {
        return this.titleTime + '预警消息预报质量'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.updateInfo('date')
        this.getWarningMessage()
      },
      changeTimePeriod() {
        this.updateInfo('month')
        this.getWarningMessage()
      },
      changeYear(year) {
        this.radios = initRadios(year)
        this.updateInfo('month')
        this.getWarningMessage()
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
      getWarningMessage() {
        let loading = this.openLoading('#container');
        warningMessage(this.start, this.end).then(res => {
          if (res.data.categories.length === 0) {
            res.data.series = []
            this.data = res.data
          } else {
            this.data = res.data
          }
          initMsEcharts(this.data, this.title)
          this.$nextTick(() => {
            loading.close()
          })
        }).catch(err => {
          console.log(err)
        })
      },
      open() {
        this.$alert(waringMessageVar, '评定办法', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        });
      }
    },
    created() {
      this.$nextTick(() =>{
        this.radios = initRadios(this.year)
        this.years = initYears(7)
        this.getWarningMessage()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";

  .warning-message-middle {
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
  .warning-message-bottom {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 150px);
    background-color: @bgColor;
    padding-top: 50px;
  }
</style>