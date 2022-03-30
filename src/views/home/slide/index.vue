<template>
  <!--  <div id="sidebar-wrap" :class="{ collapsed: toggSiderBar }">-->


  <!-- 循环生成侧栏菜单 -->
  <div style="width: 100%;height: 100%">
    <el-menu id="sidebar-wrap" background-color="#eef7f2" text-color="#93d5dc" active-text-color="#847C74"
             :default-active="this.$route.path" :unique-opened="true"
             @open="handleOpen" @close="handleClose" :collapse="isCollapse"
             mode="vertical"
             router
    >
      <!-- 顶部图标 -->
      <!--              <span class="rythm twist1">{{ toggSiderBar ? 'VUE' : 'Geronimo' }}</span>-->
      <el-menu-item v-show="!isCollapse" class="logo" style="height: 160px;padding: 0px"
                    @click="visible.userPanelVB=true">
        <div class="logo">
          <svg-icon icon-class="headAva" style="color: black;font-size: 50px"></svg-icon>
          <span class="rythm twist1">{{ userInfo.userName }}</span>
        </div>
      </el-menu-item>

      <el-menu-item index="/helloWorld" style="width: 180px">
        <svg-icon style="font-size: 19px;vertical-align:middle" icon-class="welcome"/>
        <span style="margin-left: 5px;vertical-align:middle;font-weight: 500;letter-spacing: 4px">首页</span>
      </el-menu-item>
      <el-menu-item index="/group">
        <svg-icon style="font-size: 19px;vertical-align:middle" icon-class="group"/>
        <span style="margin-left: 5px;vertical-align:middle;font-weight: 500;letter-spacing: 4px">团体管理</span>
      </el-menu-item>
      <el-submenu index="/group">
        <template v-slot:title>
          <svg-icon style="font-size: 22px;vertical-align:middle;" icon-class="userManage"/>
          <span style="margin-left: 5px;">表单管理</span>
        </template>
        <el-menu-item index="/form">
          <template #title>
            <svg-icon style="font-size: 16px;vertical-align:middle;margin-left: 20px" icon-class="designe"/>
            <span style="margin-left: 5px;">表单设计</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/task">
          <template #title>
            <svg-icon style="font-size: 16px;vertical-align:middle;margin-left: 20px" icon-class="manage"/>
            <span style="margin-left: 5px">任务管理</span>
          </template>
        </el-menu-item>

      </el-submenu>

      <el-menu-item index="/formFill">
        <svg-icon style="font-size: 22px;vertical-align:middle" icon-class="fill"/>
        <span style="margin-left: 5px">表单填报</span>
      </el-menu-item>
    </el-menu>
    <div>
      <el-dialog id="user-panel" :visible.sync="visible.userPanelVB" width="400px" append-to-body>
        <div id="user-head">
          <svg-icon icon-class="headAva" style="color: black;font-size: 100px"></svg-icon>
          <span style="font-size: 25px;font-weight: bold;color: #A7A8BD;margin-top: 30px">{{ userInfo.userName }}</span>
          <span style="float: right;font-size: 10px;color: #A7A8BD">{{ userInfo.id }}</span>
        </div>
        <div id="user-info">
         <el-form id="user-info-form" label-width="150px">
           <el-form-item class="user-info-formItem" label="学号">
            <span>{{userInfo.userId}}</span>
           </el-form-item>
           <el-form-item class="user-info-formItem"  label="所属团体">
              <span>{{userInfo.group.groupName}}</span>

<!--             <el-button style="margin-left: 10px">查看</el-button>-->

             <el-popconfirm
                 style="margin-left: 20px"
                 v-if="!userInfo.joined"
                 confirm-button-text="加入"
                 title="是否加入该团体？"
                 @confirm="confirmJoinGroup"
             >
               <el-button type="warning" slot="reference">加入</el-button>
             </el-popconfirm>

             <el-popconfirm
                 style="margin-left: 20px"
                 v-if="userInfo.joined"
                 confirm-button-text="退出"
                 title="是否退出该团体？"
                 @confirm="outGroup"
             >
               <el-button type="danger" slot="reference">退出</el-button>
             </el-popconfirm>

           </el-form-item>

         </el-form>
        </div>
        <template v-slot:footer>
          <div style="width: 100%;height:auto;text-align: center">
            <el-button @click="logout" style="width: 70%;height:40px;background-color: #93b5cf;color:#eef7f2;font-size: 18px;font-weight: 600; ">退&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp出</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>


import {groupOption} from "@/apis/userAPI";

export default {
  name: "homeSlide",
  data() {
    return {
      isCollapse: false,
      showLogo: true,
      visible: {
        userPanelVB: false
      },
    };
  },
  // created:()=>{
  //   router.addRoute(aboutForm())
  // }
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    async confirmJoinGroup(){
        let params={
          groupId: this.userInfo.group.id,
          id: this.userInfo.id,
          joined: true,
          //0：踢出 1：邀请；2：接受
          opType: 2,
          userId: this.userInfo.userId,
          userName: ""
        }
       await groupOption(params).then(res=>{
         this.$message.success(res.result)
         this.$store.commit('joinGroup',null)
       }).catch()
    },

    async outGroup(){
      let params={
        groupId: this.userInfo.group.id,
        id: this.userInfo.id,
        joined: true,
        //0：踢出 1：邀请；2：接受
        opType: 3,
        userId: this.userInfo.userId,
        userName: ""
      }
      await groupOption(params).then(res=>{
        this.$message.success(res.result)
        this.$store.commit('outGroup',null)
      }).catch()
    },

    async logout(){
      await this.$store.commit("logout",null)
      this.$router.push("/login");
    }

  },
  computed: {
    userInfo: function (){
      return this.$store.state.userInfo // 动态计算属性，相当于this.$store.getters.userInfo
    }
  }
  // watch:{
  //   isCollapse:function (val,oldVal){
  //     if (val){
  //     //  收起
  //     //   先消失LOGO
  //       this.showLogo=false
  //       setTimeout(null,2000)
  //     }else{
  //     //  展开
  //
  //     }
  //   }
  // }
}
</script>

<style lang="scss">
@import "./slider.scss";

.root-menu-item {
  width: 160px;
}

#user-panel {
  #user-head {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-bottom:#93b5cf 5px solid ;
    padding-bottom: 10px;
  }

  #user-info {
  }

  #user-info-form{

    margin-top:20px;
  }

  .el-form-item .user-info-formItem{
      width: 100px;
  }

  .el-form-item__label .user-info-formItem{

  }
}


</style>
