<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate"/>
        <el-link target="_blank" @click="" style="float: right">评定方法</el-link>
      </div>
      <hr>
      <div class="middle">
        <div class="time-period-radio">
          <span>检验时段：</span>
          <el-radio-group v-model="radio1" @change="changeTimePeriod">
            <el-radio-button label="2020">2020年</el-radio-button>
            <el-radio-button label="1">一月</el-radio-button>
            <el-radio-button label="2">二月</el-radio-button>
            <el-radio-button label="3">三月</el-radio-button>
            <el-radio-button label="season1">一季度</el-radio-button>
            <el-radio-button label="4">四月</el-radio-button>
            <el-radio-button label="5">五月</el-radio-button>
            <el-radio-button label="6">六月</el-radio-button>
            <el-radio-button label="season2">二季度</el-radio-button>
            <el-radio-button label="7">七月</el-radio-button>
            <el-radio-button label="8">八月</el-radio-button>
            <el-radio-button label="9">九月</el-radio-button>
            <el-radio-button label="season3">三季度</el-radio-button>
            <el-radio-button label="10">十月</el-radio-button>
            <el-radio-button label="11">十一月</el-radio-button>
            <el-radio-button label="12">十二月</el-radio-button>
            <el-radio-button label="season4">四季度</el-radio-button>
            <el-radio-button label="year">全年</el-radio-button>
          </el-radio-group>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker";
  import moment from "momnet"
  export default {
    name: "WarningMessage",
    components: {
      DatePicker
    },
    data() {
      return {
        radio1: '2020'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        let startStr = moment(startTime).format("YYYY-MM-DD")
        let endStr = moment(endTime).format("YYYY-MM-DD")
        console.log(startStr)
        console.log(endStr)
      },
      changeTimePeriod(val) {
        // alert(val)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .middle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: #F8F8F8;
    .el-radio-button__inner {
      width: 60px;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      background: #F8F8F8;
      padding: 0;

    }
  }
</style>