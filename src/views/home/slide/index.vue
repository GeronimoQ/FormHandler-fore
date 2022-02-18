<template>
  <div id="sidebar-wrap" :class="{ collapsed: toggSiderBar }">
    <!-- 顶部图标 -->
    <h3 class="logo">
      <span class="rythm twist1">{{ toggSiderBar ? 'VUE' : 'Geronimo' }}</span>
    </h3>

    <!-- 循环生成侧栏菜单 -->
    <el-menu  background-color="#3f4d67" text-color="#fff" :default-active="this.$route.path" :unique-opened="true"
             mode="vertical"
             router
    >
      <el-menu-item  index="/">
        <template #title>
          <span>欢迎页</span>
        </template>
      </el-menu-item>
      <el-submenu index="/" >
        <template v-slot:title>
          <!--              <i :class="item.icon"></i>-->
          <span>表单管理</span>
        </template>

        <el-menu-item index="/form">
          <template #title>
            <span>表单设计</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/task">
          <template #title>
            <span>任务管理</span>
          </template>
        </el-menu-item>

      </el-submenu>

      <el-menu-item index="/formFill">
        <template #title>
          <span>表单填报</span>
        </template>
      </el-menu-item>
      <!--      <template v-for="item in menu">-->

      <!--        &lt;!&ndash; 多级菜单外壳 &ndash;&gt;-->
      <!--        <el-submenu v-if="item.children.length !== 0" :index="item.router" :key="item.router">-->

      <!--          &lt;!&ndash; 一级菜单包裹层 &ndash;&gt;-->
      <!--          <template slot="title">-->
      <!--            <i :class="item.icon"></i>-->
      <!--            <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>-->
      <!--          </template>-->

      <!--          &lt;!&ndash; 二级菜单选项 &ndash;&gt;-->
      <!--          <el-menu-item v-for="child in item.children" :index="child.router" :key="child.router">-->
      <!--            <i class="fa fa-long-arrow-right"></i>-->
      <!--            <span slot="title">{{langType === 'en'? child.name_en: child.name}}</span>-->
      <!--          </el-menu-item>-->
      <!--        </el-submenu>-->

      <!--        &lt;!&ndash; 单级菜单 &ndash;&gt;-->
      <!--        <el-menu-item v-else :index="item.router" :key="item.router">-->
      <!--          <i :class="item.icon"></i>-->
      <!--          <span slot="title">{{langType === 'en'? item.name_en: item.name}}</span>-->
      <!--        </el-menu-item>-->
      <!--      </template>-->
    </el-menu>


  </div>
</template>

<script>
import router from "@/router";
import aboutForm from "@/router/modules/form";

export default {
  name: "homeSlide",
  // created:()=>{
  //   router.addRoute(aboutForm())
  // }
}
</script>

<style scoped lang="scss">
@import "./slider.scss";
</style>