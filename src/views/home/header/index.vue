<template>
  <div id="homeHeader">
      <svg-icon class="collapseIcon" icon-class="collapseMenu" v-show="!isCollapsed" @click.native="isCollapseMenu"></svg-icon>
      <svg-icon class="collapseIcon" icon-class="openMenu" v-show="isCollapsed" @click.native="isCollapseMenu"></svg-icon>
      <el-button v-if="this.$store.state.userInfo.id==='123abcd'" type="text" style="float: right;margin-right: 100px;font-size: 18px;padding-top: 18px" @click="jumpToLogin">请登录</el-button>
  </div>
</template>

<script>
export default {
  name: "homeHeader",
  data(){
    return{
      isCollapsed:false
    };
  },
  methods:{
     isCollapseMenu(){
       let isCollapsed=!this.isCollapsed
      this.$emit("collapseMenu",isCollapsed)
       this.isCollapsed=isCollapsed
    },
    jumpToLogin(){
       this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
#homeHeader{
  width: 100%;
  height: 60px;
  /*padding: 0px 26px 0px 15px;*/
  background: #eef7f2;
}
.collapseIcon{
  font-size: 30px;
  vertical-align: middle;
}
</style>
