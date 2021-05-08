<template>
  <div id="tense-list">
    <div class="tense-list-item">
      <el-switch
        v-model="switchStatus"
        @change="switchChange"
        active-text="综合"
        active-color="#03B452"
        inactive-color="#7E7772">
      </el-switch>
    </div>
    <div class="tense-list-item">
      <el-switch
              v-model="switchStatus"
              @change="switchChange"
              active-text="0~12时"
              active-color="#03B452"
              inactive-color="#7E7772">
      </el-switch>
      <el-checkbox-group v-model="checkValue">
        <el-checkbox v-for="t in ftime" :label="t" :key="t"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="tense-list-item">
      <el-switch
              v-model="switchStatus"
              @change="switchChange"
              active-text="0~12时"
              active-color="#03B452"
              inactive-color="#7E7772">
      </el-switch>
      <el-checkbox-group v-model="checkValue">
        <el-checkbox v-for="t in ftime" :label="t" :key="t"></el-checkbox>
      </el-checkbox-group>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Tense",
    data() {
      return {
        switchStatus: true,
        checkValue: [],
        ftime: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
          // 14, 15, 16, 17, 18, 19, 20,21, 22, 23, 24
        ],
      }
    },
    methods: {
      switchChange(val) {
        console.log(val);
      }
    }
  }
</script>

<style lang="less">
  #tense-list {
    display: inline-block;
    height: 20px;
    border: 1px solid #e4e4e4;
    transition: height .5s;
    overflow-y: hidden;
    &:hover {
      height: 100%;
    }
  }

  .tense-list-item {
    .el-switch {
      padding-left: 30px;
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
      /*width: 589px;*/
      height: 100%;
    }
    .el-checkbox {
      color: #303133;
      margin-top: 5px;
      margin-right: 6px;
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
</style>