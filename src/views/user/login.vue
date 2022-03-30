<template>
  <div class="my-login-page">
    <el-card shadow="none" style="background-color: rgba(0,0,0,0);border: none">
      <el-form :model="loginInfo" style="border: none">

        <el-form-item label="学号">
          <el-input v-model="loginInfo.username" class="form-input"></el-input>
        </el-form-item>


        <el-form-item label="密码">
          <el-input type="password" v-model="loginInfo.password" class="form-input" ></el-input>
        </el-form-item>


      </el-form>
      <div style="width: 100%;height: auto;text-align: center">
        <el-button class="door-but" type="primary" @click="loginBefore"
                   round>登 录
        </el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
import {login} from "@/apis/userAPI";

export default {
  name: "login",
  data() {
    return {
      loginInfo: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    loginBefore() {
      // this.jumpToHomePage()
      // this.login()
      if (this.checkData()){
        this.login()
      }
    },
    checkData() {
      if (!this.loginInfo.username.trim()||!this.loginInfo.password.trim()){
        this.$message.warning("用户名和密码不可为空")
        return false
      }else{
        this.loginInfo.username=this.loginInfo.username.trim()
        this.loginInfo.password=this.loginInfo.password.trim()
        return  true
      }
    },
    async login() {
      // let loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      let params={
        groupId: "",
        id: "",
        joined: "",
        password: this.loginInfo.password,
        userId: this.loginInfo.username,
        userName: ""
      }
      await login(params).then(res => {
        // let userInf=JSON.parse(res.result)
        this.$store.commit('login',res.result)
        this.$router.push("/helloWorld")
      }).catch(_ => {

      })
    },
    jumpToHomePage(){
      this.$router.push("/helloWorld")
    }
  }
}
</script>

<style lang="scss">
@import "css/my-login.css";
</style>
