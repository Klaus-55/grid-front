<template>
  <div class="head">
    <span>选择时段：</span>
    <el-date-picker
            v-model="date1"
            type="date"
            :pickerOptions="pickerOptions"
            placeholder="选择日期">
    </el-date-picker>
    <span style="margin: 0 10px">至</span>
    <el-date-picker
            v-model="date2"
            type="date"
            :pickerOptions="pickerOptions"
            placeholder="选择日期">
    </el-date-picker>
    <el-button type="primary" size="mini">确定</el-button>

    <span style="margin-left: 50px">检验项：</span>
    <el-select v-model="value" placeholder="请选择">
      <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import moment from "momnet"
  export default {
    name: "Header",
    data() {
      return {
        date1: Date.now() - 24 * 60 * 60 * 1000 * 10,
        date2: Date.now() - 24 * 60 * 60 * 1000,
        value: 'jqpf',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        options: [
          {value: 'jqpf', label: '技巧评分'}
        ]
      }
    }
  }
</script>

<style lang="less">

</style>