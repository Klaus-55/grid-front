<template>
  <div class="download-file">
    <a :href="fileName" download>评分办法文件</a>
    <i class="el-icon-download"></i>
  </div>
</template>

<script>
  export default {
    name: "download",
    props: ['fileType', 'area'],
    data() {
      return {
        iconFile: '',
        fileList: {
          approach: '/duanlin/download/附件3：湖南省短时临近格点预报检验办法.docx',
          convection: '/duanlin/download/附件7：湖南省强对流天气分类落区预报检验办法（试行）.docx',
          warning: '/duanlin/download/附件4：湖南省气象灾害预警信号质量检验办法.docx',
          heavy: '/duanlin/download/附件5：湖南省强降水监测警报质量检验办法.docx',
          provincial_pro: '/provincial/download/2021年短中期预报质量评定办法（初稿）.docx',
          provincial_city: '/provincial/download/附件：湖南省2021年度智能网格预报竞赛办法 (1).doc',
        },
        place: '',
      }
    },
    computed: {
      fileName() {
        return this.baseUrl + this.getFileName();
      },
      baseUrl() {
        let baseURL
        if (process.env.NODE_ENV === 'development') {
          baseURL = 'http://10.111.102.28:9000/grid-server/api'
        } else {
          baseURL = 'http://10.111.100.216:9000/grid-server/api'
        }
        return baseURL
      }
    },
    methods: {
      getFileName() {
          return this.fileList[this.fileType]
      },
    },
    watch: {
      fileType: {
        handler: function (val) {
          // console.log(val)
          this.getFileName();
        },
        immediate: true
      },
      area: {
        handler: function (area) {
          this.getFileName();
        },
        immediate: true,
      }
    },
  }
</script>

<style scoped>

</style>