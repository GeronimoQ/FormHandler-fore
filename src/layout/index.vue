<template>
  <el-container style="height: 100%">
    <el-aside style="width: auto">
      <home-slide ref="homeSlide"></home-slide>
    </el-aside>
    <el-container>
      <el-header>
        <home-header v-on:collapseMenu="collapseMenu"></home-header>
      </el-header>
      <el-main style="padding: 10px">
        <router-view ></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import HomeHeader from "@/views/home/header";
import HomeSlide from "@/views/home/slide";
export default {
  name: "layout",
  components: {HomeSlide, HomeHeader},
  methods:{
    collapseMenu(isColl){
      this.$refs.homeSlide.$data.isCollapse=isColl;
    }
  }
}
</script>

<style lang="scss" scoped>
.con-wrap {

  transition: all 0.3s;
h3 {
  margin-top: 0;
  color: #324157;
}
.page-component-wrap {
  padding: 10px;
}
}
.con-wrap.conCollapse {
  padding-left: 10px;
  transition: all 0.3s;
}

.el-header {
  background-color: #eef7f2;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
