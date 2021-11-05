export default {
  data() {
    return {
      dialog: {
        name: '',
        args: null,
        visible: false
      }
    }
  },
  watch: {
    'dialog.visible': function (val) {
      !val && this.$$dialogClose()
    }
  },
  methods: {
    $$dialogOpen(name, args = {}) {
      Object.assign(this.dialog, {
        name,
        args,
        visible: true
      })
    },
    $$dialogClose() {
      const {name} = this.dialog
      this.$refs[name] = null
      Object.assign(this.dialog, {
        name: '',
        args: null,
      })
    }
  }
}