<template>
  <div class="side-content">
    <div class="content">
      <div class="daily-comparision-head">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>选择日期：</span>
            <el-date-picker
                    v-model="date"
                    @change="changDate"
                    type="date"
                    :pickerOptions="pickerOptions"
                    placeholder="选择日期">
            </el-date-picker>
            <div class="add-button">
              <el-button class="el-icon-arrow-up" @click="changDate('inc')"></el-button>
              <el-button class="el-icon-arrow-down" @click="changDate('dec')"></el-button>
            </div>
          </el-menu-item>
          <el-menu-item>
            <span>选择要素：</span>
            <el-select v-model="facname" @change="changeFacname">
              <el-option
                      v-for="item in facnames"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-menu-item>
          <el-menu-item>
            <span>选择时段：</span>
            <el-select v-model="fhour" @change="changeFhour">
              <el-option
                      v-for="item in fhours"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-menu-item>
        </el-menu>
      </div>
      <hr>
      <div class="daily-comparision-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>站点类型：</span>
            <el-radio-group v-model="obtType" @change="changeObtType">
              <el-radio-button label="gj">国家站</el-radio-button>
              <el-radio-button label="gg">骨干站</el-radio-button>
              <el-radio-button label="zd">自动站</el-radio-button>
              <el-radio-button label="gd">格点</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <span>时次：</span>
            <el-radio-group v-model="ftime" @change="changeFtime">
              <el-radio-button label="8">08时</el-radio-button>
              <el-radio-button label="20">20时</el-radio-button>
            </el-radio-group>
          </el-menu-item>
          <el-menu-item>
            <el-checkbox-group v-model="checkedOptions" @change="changeOption">
              <el-checkbox v-for="(value, key) in options" :label="key" :key="key">{{value}}</el-checkbox>
            </el-checkbox-group>
          </el-menu-item>
          <el-menu-item>
            <span>放大：</span>
            <el-slider
                    v-model="sliderValue"
                    :show-tooltip="false"
                    :step="20">
            </el-slider>
          </el-menu-item>
          <el-menu-item>
            <el-button type="primary" size="mini">居中地图</el-button>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="daily-comparision-bottom">
        <div class="left-map">111</div>
        <div class="right-map">222</div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "momnet";
  export default {
    name: "DailyComparision",
    data() {
      return {
        date: Date.now() - 24 * 60 * 60 * 1000,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        facname: 'maxt',
        facnames: [
          {value: 'maxt', label: '逐24小时最高温度'},
          {value: 'mint', label: '逐24小时最低温度'},
        ],
        fhour: '24',
        fhours: [
          {value: '24', label: '0-24时'},
          {value: '48', label: '0-48时'},
          {value: '120', label: '0-120时'},
        ],
        obtType: 'gj',
        ftime: 8,
        checkedOptions: ['color', 'value', 'diff', 'legend', 'detail'],
        options: {color: '颜色', value: '数值', diff: '差值', obtName: '站名', legend: '图例', detail: '详细'},
        sliderValue: 80
      }
    },
    methods: {
      changDate(val) {
        if (val === 'inc') {
          this.date = moment(this.date).add(1, 'd')
        } else if (val === 'dec') {
          this.date = moment(this.date).add(-1, 'd')
        }
        // alert(moment(this.date).format('YYYY-MM-DD'))
      },
      changeFacname(val) {
        // alert(val)
      },
      changeFhour(val) {
        // alert(val)
      },
      changeObtType(val) {
        // alert(val)
      },
      changeFtime(val) {
        // alert(val)
      },
      changeOption(val) {
        // alert(val)
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/less/common";
  .daily-comparision-head {
    position: relative;
    height: 25px;
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100px;
    }
    .el-date-editor .el-input__inner {
      border-radius: 2px 0 0 2px;
    }
    .el-menu {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border-bottom: none;
      background-color: transparent;
      .el-menu-item:first-child {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 30px 0 0;
        >.add-button {
          display: flex;
          flex-direction: column;
          height: 100%;
          .el-button {
            width: 20px;
            height: 50%;
            line-height: 50%;
            font-size: 12px;
            padding: 0;
            margin-left: -1px;
            border-radius: 0 0 2px 0;
          }
          .el-button:focus {
            border-color: #DCDFE6;
          }
          .el-button:first-child {
            border-bottom: none;
            border-radius: 0 2px 0 0;
          }
        }
      }
      .el-menu-item:nth-child(n + 2) {
        .el-input__inner {
          width: 125px;
          height: 25px;
          line-height: 25px;
          font-size: 12px;
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
      }
      .el-menu-item:nth-child(3) {
        .el-input__inner {
          width: 70px;
        }
      }
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
      padding: 0 30px;
    }
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
      background-color: transparent;
    }

  }
  .daily-comparision-middle {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height:60px;
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
      padding: 0;
      width: 58px;
      height: 20px;
      line-height: 20px;
      box-sizing: content-box;
    }
    .el-checkbox__label {
      padding-left: 1px;
    }
    .el-slider {
      display: inline-block;
      margin-left: 10px;
      width: 150px;
    }
    .el-button {
      padding: 3px 10px;
    }
  }
  .daily-comparision-bottom {
    height: calc(100% - 131px);
    .left-map {
      float: left;
      width: 49.8%;
      height: 100%;
      background-color: #F8F8F8;
    }
    .right-map {
      float: right;
      width: 49.8%;
      height: 100%;
      background-color: #F8F8F8;
    }

  }
</style>