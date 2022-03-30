<template>
  <div class="my-login-page">
        <el-card shadow="none" style="background-color: rgba(0,0,0,0);border: none">
          <el-form :model="userRegistration" style="border: none">

            <el-form-item label="学号">
              <el-input  v-model="userRegistration.userId" class="form-input" ></el-input>
            </el-form-item>


            <el-form-item label="姓名">
              <el-input v-model="userRegistration.name" class="form-input"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input type="password" v-model="userRegistration.password" class="form-input"></el-input>
            </el-form-item>

            <el-form-item label="确认密码">
              <el-input type="password" v-model="userRegistration.password_b" class="form-input" @blur="checkPassword"></el-input>
              <span v-show="passwordWrong" style="color: #eb507e">{{passwordCheckText}}</span>
            </el-form-item>


          </el-form>
          <div style="width: 100%;height: auto;text-align: center">
          <el-button class="door-but" type="primary" @click.native="beforeRegister"
                     round>注 册
          </el-button>
          </div>
        </el-card>
  </div>
</template>

<script>
import login from "./js/my-login"
//API
import {register} from "@/apis/userAPI";

export default {
  name: "register",
  created() {
    login;
  },
  data() {
    return {
      userRegistration: {
        name: '',
        password: '',
        password_b:'',
        userId: ''
      },
      passwordWrong:false,
      passwordCheckText:''
    }
  },
  methods: {
    //注册按钮回调
    beforeRegister() {
      console.log(JSON.stringify(this.userRegistration))
      if (this.checkData()){
        this.register()
      }
    },
    checkData(){
      if (!this.userRegistration.userId.trim()||!this.userRegistration.name.trim()||!this.userRegistration.password.trim()){
        this.$message.error("注册信息不可为空!")
        return false;
      }else{
        if (this.checkPassword()){
          return true
        }
        return  false
      }
    },
    formatData(data){
      data=data.trim();
    },
    checkPassword(){
      if (!this.userRegistration.password.trim()||!this.userRegistration.password_b.trim()){
        this.passwordCheckText='密码不可为空!'
        this.passwordWrong=true
        return false
      }else{
        if (this.userRegistration.password.trim()!==this.userRegistration.password_b.trim()){
          this.passwordCheckText='密码不一致!'
          this.passwordWrong=true
          return false
        }
        this.passwordWrong=false
        return true
      }
    },
    //发送注册信息
    async register() {
      let params={
        groupId: "",
        id: "",
        joined: false,
        password: this.userRegistration.password.trim(),
        userId: this.userRegistration.userId.trim(),
        userName: this.userRegistration.name.trim()
      }
      const response =await register(params);
      response.then(
          // 由于berg的API的result code不是封装在result，而是以status code反应。因此直接跳转
          res => {
            this.$message.success("注册成功")
            setTimeout(_=>{
              this.$router.push({path: "/login"})
            },1000)
          }
      ).catch(_ => {

      })
    },


  }
}
</script>

<style >

 @import "css/my-login.css";

</style>
