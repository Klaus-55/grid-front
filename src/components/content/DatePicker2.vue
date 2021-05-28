<template>
  <div class="date-pick">
    <span>选择时段：</span>
    <el-date-picker
            v-model="startTime"
            type="date"
            :pickerOptions="pickerOptions"
            placeholder="选择日期">
    </el-date-picker>
    <span style="margin: 0 10px">至</span>
    <el-date-picker
            v-model="endTime"
            type="date"
            :pickerOptions="pickerOptions"
            placeholder="选择日期">
    </el-date-picker>
    <el-button type="primary" size="mini" @click="changeDate">确定</el-button>
  </div>
</template>

<script>
  export default {
    name: "DatePicker2",
    props: {
      start: String,
      end: String
    },
    data() {
      return {
        startTime: '',
        endTime: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    methods: {
      changeDate() {
        this.$emit('changeDate', this.startTime, this.endTime)
      }
    },
    watch: {
      start(newValue) {
        this.startTime = newValue
      },
      end(newValue) {
        this.endTime = newValue
      }
    },
    created() {
      this.startTime = this.start
      this.endTime = this.end
    }
  }
</script>

<style lang="less">
  .date-pick {
    display: inline-block;
    width: auto;
  }
  //日期选择器相关样式
  .el-date-editor {
    .el-input__icon {
      display: none;
    }
    .el-input__prefix {
      display: inline-block;
      width: 20px;
      height: 20px;
      padding-top: 5px;
      background: url("../../assets/img/time.png") no-repeat left center;
      background-size: 15px 15px;
    }
    .el-input__inner {
      border: 1px solid #e4e4e4;
      height: 25px;
      border-radius: 2px;
      font-size: 12px;
      padding-right: 0;
    }
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 120px;
  }
  .el-button {
    line-height: normal;
  }
</style>