<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <date-picker @changeDate="changeDate" :start="start" :end="end"/>
        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
<!--        <el-button type="text" @click="open">评定方法</el-button>-->
<!--        <el-button type="primary" size="mini" @click="" style="float: right; margin-right: 80px">预警详细信息</el-button>-->
      </div>
      <hr>
      <div class="warning-detail-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警类型：</span>
            <el-radio-group v-model="type" @change="changeType">
              <el-radio-button label="all">所有类型</el-radio-button>
              <el-radio-button label="暴雨">暴雨</el-radio-button>
              <el-radio-button label="暴雪">暴雪</el-radio-button>
              <el-radio-button label="寒潮">寒潮</el-radio-button>
              <el-radio-button label="低温雨雪冰冻">低温雨雪冰冻</el-radio-button>
              <el-radio-button label="高温">高温</el-radio-button>
              <el-radio-button label="强对流">强对流</el-radio-button>
              <el-radio-button label="大雾">大雾</el-radio-button>
              <el-radio-button label="霾">霾</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>预警等级：</span>
            <el-radio-group v-model="level" @change="changeLevel">
              <el-radio-button label="all">所有等级</el-radio-button>
              <el-radio-button label="蓝色">蓝色</el-radio-button>
              <el-radio-button label="黄色">黄色</el-radio-button>
              <el-radio-button label="橙色">橙色</el-radio-button>
              <el-radio-button label="红色">红色</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>时次：</span>
            <el-radio-group v-model="fdate" @change="changeFdate">
              <el-radio-button label="08">08时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="warning-detail-bottom">
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
                  prop="checkdate"
                  label="日期">
          </el-table-column>
          <el-table-column
                  prop="warntype"
                  label="类型">
          </el-table-column>
          <el-table-column
                  prop="forecaster"
                  label="预报员">
          </el-table-column>
          <el-table-column
                  prop="area"
                  label="实况地市">
          </el-table-column>
          <el-table-column
                  prop="district"
                  label="实况县">
          </el-table-column>
          <el-table-column
                  prop="forelevel"
                  label="预警等级">
          </el-table-column>
          <el-table-column
                  prop="factlevel"
                  label="实况等级">
          </el-table-column>
          <el-table-column
                  prop="testlevel"
                  label="检验等级">
          </el-table-column>
          <el-table-column
                  prop="graded"
                  label="检验结果">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {warningDetail} from "../../../network/zhongduan";
  import {warningDetailVar} from "../../../common/vars";
  import {exportExcelCom} from "../../../common/Base";

  export default {
    name: "WarningDetail",
    components: {
      DatePicker
    },
    data() {
      return {
        start: moment(Date.now()).add(-7, 'd').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        type: 'all',
        level: 'all',
        tableData: [],
        fdate: '08'
      }
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.getWarningDetail()
      },
      changeType() {
        this.getWarningDetail()
      },
      changeLevel() {
        this.getWarningDetail()
      },
      changeFdate() {
        this.getWarningDetail()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '预警消息评定详情.xlsx'
        return exportExcelCom(document, id, title)
      },
      getWarningDetail() {
        let loading = this.openLoading('#table');
        warningDetail(this.start, this.end, this.type, this.level, this.fdate).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      },
      open() {
        this.$alert(warningDetailVar, '评定办法', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        });
      }
    },
    created() {
      this.$nextTick(() => {
        this.getWarningDetail()
      })
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .warning-detail-middle {
    position: relative;
    height:100px;
    background-color: @bgColor;
    margin-bottom: 20px;
    >span {
      margin-left: 20px;
      vertical-align: top;
    }
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
      height: 45px;
      line-height: 45px;
    }
    .el-menu-item {
      cursor: default;
      font-size: 14px;
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }
    .el-radio-button__inner {
      font-size: 14px;
      padding: 3px 19px;
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
  }
  .warning-detail-bottom {
    height: calc(100% - 181px);
    background-color: @bgColor;

  }
</style>