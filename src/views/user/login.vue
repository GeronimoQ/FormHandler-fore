<template>
  <div class="my-login-page">
    <el-row style="position:absolute;top: 40%;width: 100%;height: auto">
      <el-col :push="10" :span="4">
        <el-card>
          <el-form :model="loginInfo">

            <el-form-item label="name">
              <el-input v-model="loginInfo.username"></el-input>
            </el-form-item>


            <el-form-item label="password">
              <el-input type="password" v-model="loginInfo.password"></el-input>
            </el-form-item>


          </el-form>

          <el-button style="width: 100%;margin-top: 20px;word-spacing: 40px" type="primary" @click="loginBefore"
                     round>登 录
          </el-button>
        </el-card>

      </el-col>
    </el-row>
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
      this.login()
    },
    login() {
      const response = login(JSON.stringify(this.loginInfo))
      response.then(res => {

      }).catch(_ => {
      })
    }
  }
}
</script>

<style scoped>

</style>