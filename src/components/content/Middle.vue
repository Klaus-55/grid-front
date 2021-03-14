<template>
  <div class="middle">
    <el-menu mode="horizontal">
      <el-menu-item>
        <span>预报时次：</span>
        <el-radio-group v-model="ybsc">
          <el-radio-button label="zh">综合</el-radio-button>
          <el-radio-button label="08">08时</el-radio-button>
          <el-radio-button label="20">20时</el-radio-button>
        </el-radio-group>
      </el-menu-item>
      <el-menu-item>
        <span>检验时效：</span>
        <el-radio-group v-model="jysx">
          <el-radio-button label="1">1H</el-radio-button>
          <el-radio-button label="24">24H</el-radio-button>
        </el-radio-group>
      </el-menu-item>
      <el-menu-item>
        <span>检验产品：</span>
        <el-radio-group v-model="jycp">
          <el-radio-button label="ywpg">业务评估</el-radio-button>
          <el-radio-button label="jspg">技术评估</el-radio-button>
          <el-radio-button label="dzpf">单站评分</el-radio-button>
        </el-radio-group>
      </el-menu-item>
      <el-menu-item>
        <span>检验要素：</span>
        <el-radio-group v-model="jyys">
          <el-radio-button label="qy">晴雨预报质量技巧</el-radio-button>
          <el-radio-button label="TS">强降水预报TS技巧</el-radio-button>
          <el-radio-button label="BIAS">强降水预报BIAS技巧</el-radio-button>
        </el-radio-group>
      </el-menu-item>
    </el-menu>
    <div class="jysd">
      <span style="vertical-align: top">检验时段：</span>
      <div class="border-content">
        <el-switch
                v-model="switchStatus"
                @change="switchChange"
                active-text="0~24时"
                active-color="#03B452"
                inactive-color="#7E7772">
        </el-switch>
        <!--            <span style="vertical-align: middle; margin-left: 10px">0~24时</span>-->
        <el-checkbox-group v-model="ftime" @change="checkboxChange">
          <el-checkbox v-for="item in ftimeView" :label="item">{{item}}时</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Middle",
    data() {
      return {
        ybsc: 'zh',
        jysx: 1,
        jycp: 'ywpg',
        jyys: 'qy',
        switchStatus: true,
        ftime: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
          14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
        ],
        ftimeView: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
          14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
        ]
      }
    },
    methods: {
      checkboxChange(val) {
        if (val.length === 0) {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
      },
      switchChange(val) {
        if (!val) {
          this.ftime = []
        } else {
          this.ftime = []
          let ftimes = 24 / this.jysx;
          for (let i = 1; i <= ftimes; i++) {
            this.ftime.push(i * this.jysx)
          }
        }
      }
    },
    watch: {
      jysx(val) {
        this.ftime = []
        let ftimes = 24 / val
        for (let i = 1; i <= ftimes; i++) {
          this.ftime.push(i * val)
        }
        this.ftimeView = this.ftime
      }
    }
  }
</script>

<style lang="less">
  .middle {
    height: 120px;
    margin-bottom: 40px;
    background-color: #f8f8f8;
    font-size: 12px !important;
    >span {
      margin-left: 20px;
      vertical-align: top;
    }
    .el-menu {
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
      font-size: 12px;
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }
    .el-radio-button__inner {
      font-size: 12px;
      padding: 2px 7px;
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
    .jysd {
      padding-left: 20px;
      margin-top: 8px;
      .border-content {
        display: inline-flex;
        align-items: center;
        border: 1px solid #e4e4e4;
        width: 1061px;
        height: 50px;
        .el-switch {
          padding-left: 30px;
          /*height: 100%;*/
          /*vertical-align: baseline;*/
        }
        .el-switch__core {
          width: 28px !important;
          height: 12.8px;
        }
        .el-switch__core:after {
          width: 9px;
          height: 9px;
        }
        .el-switch.is-checked .el-switch__core::after {
          margin-left: -10px;
        }
        .el-switch__label * {
          font-size: 13px;
        }
        .el-switch__label.is-active {
          color: #303133;
        }
        .el-checkbox-group {
          display: inline-block;
          margin-left: 30px;
          width: 900px;
          height: 100%;
        }
        .el-checkbox {
          color: #303133;
          margin-top: 5px;
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
          width: 30px;
          font-size: 12px;
          padding-left: 2px;
        }
        .el-checkbox__input.is-checked+.el-checkbox__label {
          color: #303133;
        }
      }
    }
  }
</style>