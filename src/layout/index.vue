<template>
 <div id="home">
   <home-slide ></home-slide>
   <div class="con-wrap">
     <home-header class="conCollapse"></home-header>
       <router-view class="con-wrap conCollapse"></router-view>
   </div>
 </div>
</template>

<script>
import HomeHeader from "@/views/home/header";
import HomeSlide from "@/views/home/slide";
import formDesigner from "@/components/form-designer";
export default {
  name: "layout",
  components: {HomeSlide, HomeHeader,formDesigner},
}
</script>

<style lang="scss" scoped>
.con-wrap {
  padding-left: 180px;
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
  position: relative;
  padding-left: 64px;
  transition: all 0.3s;
}
</style>