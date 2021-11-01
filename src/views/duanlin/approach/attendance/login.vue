<template>
  <div class="login">
    <div class="login-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pass">
          <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">登陆</el-button>
          <el-button @click="backToDetail">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {login} from "../../../../network/duanlin";

  export default {
    name: "login",
    data() {
      return {
        form: {
          name: '',
          pass: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login(this.form.name, this.form.pass).then(res => {
              this.$store.state.userName= this.form.name
              this.$emit('changeCom', 'detail')
            }).catch(err => {
              console.log(err)
            })
          } else {
            return false;
          }
        });
      },
      backToDetail() {
        this.$emit('changeCom', 'detail')
      }
    }
  }
</script>

<style lang="less">
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    .login-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>