<template>
  <div class="my-login-page">
    <el-row style="position:absolute;top: 40%;width: 100%;height: auto">
      <el-col :push="10" :span="4">
        <el-card>
          <el-form :model="userRegistration">

            <el-form-item label="name">
              <el-input v-model="userRegistration.name"></el-input>
            </el-form-item>


            <el-form-item label="password">
              <el-input type="password" v-model="userRegistration.password"></el-input>
            </el-form-item>


            <el-form-item label="userId">
              <el-input v-model="userRegistration.userId"></el-input>
            </el-form-item>


          </el-form>

          <el-button style="width: 100%;margin-top: 20px;word-spacing: 40px" type="primary" @click="beforeRegister"
                     round>注 册
          </el-button>
        </el-card>

      </el-col>
    </el-row>
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
        userId: ''
      }
    }
  },
  methods: {
    //注册按钮回调
    beforeRegister() {
      console.log(JSON.stringify(this.userRegistration))
      // this.register()
    },
    //发送注册信息
    register() {
      let params={
        name:this.userRegistration.name,
        password:this.userRegistration.password,
        userId:this.userRegistration.userId
      }
      const response = register(JSON.stringify(params));
      response.then(
          // 由于berg的API的result code不是封装在result，而是以status code反应。因此直接跳转
          res => {
            this.$router.push({path: "/login"})
          }
      ).catch(_ => {

      })
    }

  }
}
</script>

<style scoped>
@import "./css/my-login.css";
@import "~bootstrap/dist/css/bootstrap.min.css";

</style>