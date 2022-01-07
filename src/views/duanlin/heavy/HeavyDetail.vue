<template>
  <div class="side-content">
    <div class="content">
      <div class="head">
        <DatePicker @changeDate="changeDate" :start="start" :end="end"/>
        <span style="margin-left: 30px">地市：</span>
        <el-select v-model="filters.value1" placeholder="请选择" @change="getDistricts($event)">
          <el-option
                  v-for="item in select1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
        <span style="margin-left: 10px">区县：</span>
        <el-select v-model="filters.value2" placeholder="请选择" :loading="loading" @change="getList($event)">
          <el-option
                  v-for="item in select2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="exportExcel" style="margin-left: 30px">导出</el-button>
      </div>
      <hr/>
      <div class="h-3rem rain-examine-middle">
        <el-menu mode="horizontal">
          <el-menu-item>
            <span>预警等级：</span>
            <el-radio-group v-model="level" @change="changeLevel">
              <el-radio-button
                      v-for="item in levels"
                      :label="item"
                      :key="item">{{ item === 'all' ? '所有等级' : item + '预警'}}
              </el-radio-button>
            </el-radio-group>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="rain-examine-bottom">
        <el-table
                id="table"
                :data="tableData"
                height="100%"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{ background: '#39A5F8', color: '#fff', 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }">
          <el-table-column prop="department" label="发布单位"/>
          <el-table-column prop="forecaster" label="发布人"/>
          <el-table-column prop="inputtime" label="发布时间"/>
          <el-table-column prop="level" label="预警等级"/>
          <el-table-column prop="district" label="受影响县"/>
          <el-table-column prop="leadtime_fj" label="提前量"/>
          <el-table-column prop="test_level" label="实况等级"/>
          <el-table-column prop="fact_starttime_fj" label="实况时间"/>
          <el-table-column prop="warningp_fj" label="检验结果"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "../../../components/content/DatePicker2";
  import moment from "momnet";
  import {getHeavyDistrict, heavyDetail} from "../../../network/duanlin";
  import {exportExcelCom} from "../../../common/Base";

  export default {
    name: "HeavyMonitoring",
    components: {
      DatePicker,
    },
    data() {
      return {
        start: moment(Date.now()).startOf('month').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        select1: [
          {value: '长沙市', label: '长沙市'},
          {value: '株洲市', label: '株洲市'},
          {value: '湘潭市', label: '湘潭市'},
          {value: '衡阳市', label: '衡阳市'},
          {value: '邵阳市', label: '邵阳市'},
          {value: '岳阳市', label: '岳阳市'},
          {value: '常德市', label: '常德市'},
          {value: '张家界市', label: '张家界市'},
          {value: '益阳市', label: '益阳市'},
          {value: '郴州市', label: '郴州市'},
          {value: '永州市', label: '永州市'},
          {value: '怀化市', label: '怀化市'},
          {value: '娄底市', label: '娄底市'},
          {value: '湘西州', label: '湘西州'},
        ],
        allDistricts: [],
        loading: false,
        filters: {
          value1: '长沙市',
          value2: '岳麓区'
        },
        select2: [
          {value: '岳麓区', label: '岳麓区'},
          {value: '开福区', label: '开福区'},
          {value: '浏阳市', label: '浏阳市'},
          {value: '望城区', label: '望城区'},
          {value: '长沙县', label: '长沙县'},
          {value: '天心区', label: '天心区'},
          {value: '宁乡市', label: '宁乡市'},
          {value: '雨花区', label: '雨花区'},
        ],
        department: "all",
        departments: [
          {label: "所有气象台", value: "all"},
          // {label: "湖南省气象台", value: "湖南省气象台"},
          {label: "长沙市气象台", value: "长沙市气象台"},
          {label: "株洲市气象台", value: "株洲市气象台"},
          {label: "湘潭市气象台", value: "湘潭市气象台"},
          {label: "衡阳市气象台", value: "衡阳市气象台"},
          {label: "邵阳市气象台", value: "邵阳市气象台"},
          {label: "岳阳市气象台", value: "岳阳市气象台"},
          {label: "常德市气象台", value: "常德市气象台"},
          {label: "张家界市气象台", value: "张家界市气象台"},
          {label: "益阳市气象台", value: "益阳市气象台"},
          {label: "郴州市气象台", value: "郴州市气象台"},
          {label: "永州市气象台", value: "永州市气象台"},
          {label: "怀化市气象台", value: "怀化市气象台"},
          {label: "娄底市气象台", value: "娄底市气象台"},
          {label: "湘西州气象台", value: "湘西州气象台"},
        ],
        level: "all",
        levels: ["all", "蓝色", "黄色", "橙色", "红色"],
        tableData: [],
      };
    },
    methods: {
      changeDate(startTime, endTime) {
        this.start = moment(startTime).format("YYYY-MM-DD")
        this.end = moment(endTime).format("YYYY-MM-DD")
        this.getHeavyDetail()
      },
      getDistricts(prov) {
        let districts = []
        this.select2 = []
        for (let val of this.allDistricts) {
          if (prov === val['pro']) {
            console.log(val)
            districts.push({label: val.label, value: val.label})
          }
          this.select2 = districts
        }
        this.filters.value2 = districts[0]['label']
        this.getHeavyDetail()
      },
      getList() {
        this.getHeavyDetail()
      },
      changeDepartment() {
        this.getHeavyDetail()
      },
      changeWarningType() {
        this.getHeavyDetail()
      },
      changeLevel() {
        this.getHeavyDetail()
      },
      changeRs() {
        this.getHeavyDetail()
      },
      exportExcel() {
        let id = '#table'
        let title = this.start + '至' + this.end + '日' + '强降水评定详情.xlsx'
        return exportExcelCom(document, id, title)
      },
      getHeavyDetail() {
        let loading = this.openLoading('.rain-examine-bottom');
        let area = this.filters.value1
        let district = this.filters.value2
        heavyDetail(this.start, this.end, area, district, this.level).then(res => {
          this.tableData = res.data
          loading.close()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.$nextTick(() => {
        getHeavyDistrict().then(res => {
          this.allDistricts = res.data
          this.getHeavyDetail()
        })
      })
    },
  };
</script>

<style lang="less">
</style>