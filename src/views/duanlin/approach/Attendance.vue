<template>
  <div class="side-content">
    <component :is="comName" @changeCom="changeCom"/>
  </div>
</template>

<script>
  import detail from "./attendance/detail";
  import login from "./attendance/login";
  export default {
    name: "Attendance",
    components: {
      detail,
      login
    },
    data() {
      return {
       comName: 'detail'
      }
    },
    methods: {
      changeCom(com) {
        this.comName = com
      }
    }
  }
</script>

<style lang="less">

</style>