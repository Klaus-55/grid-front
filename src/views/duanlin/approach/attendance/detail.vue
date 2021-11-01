<template>
  <div class="content">
    <div class="attendance-show">
      <div class="attendance-top">
        <div class="left">
          <el-button type="primary" size="small">登记值班信息</el-button>
        </div>
        <div class="right">
          <i class="el-icon-s-custom" style="margin-right: 6px"></i>
          <el-link type="primary" @click="login" v-if="$store.state.userName === ''">登陆</el-link>
          <span v-else>{{$store.state.userName}}</span>
        </div>
      </div>
      <el-table
              :data="tableData"
              border
              stripe
              :header-cell-style="{backgroundColor: '#FAFAFA','text-align': 'center'}"
              style="width: 100%">
        <el-table-column
                prop="date"
                label="日期"
                align="center">
        </el-table-column>
        <el-table-column
                prop="department"
                label="科室"
                align="center">
        </el-table-column>
        <el-table-column
                prop="forecaster"
                label="值班人"
                align="center">
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[10, 15, 20]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="40">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {attendanceList} from "../../../../network/duanlin";

  export default {
    name: "detail",
    data() {
      return {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        tableData: [{
          date: '2016-05-02',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-01',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-03',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }, {
          date: '2016-05-04',
          department: '短临',
          forecaster: '刘剑科'
        }]
      }
    },
    methods: {
      login() {
        this.$emit('changeCom', 'login')
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    created() {
      attendanceList({current: 1, size: 10}).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
</script>

<style lang="less">
  .attendance-top {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 55px;
    /*box-shadow: 0 0 5px #888888;*/
    margin-bottom: 10px;
    /*border: 1px red solid;*/
    .right {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
  }

  .block {
    float: right;
    margin-top: 10px;
  }

</style>