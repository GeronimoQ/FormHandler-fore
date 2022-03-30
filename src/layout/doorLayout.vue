<template>
  <!--  body-->
  <div id="door-body">

    <div id="ball-one">

    </div>
    <!--  中间导航栏-->
    <div id="door-content">
      <el-card id="door-card" shadow="hover" >
        <template v-slot:header>
          <el-menu class="nav-menu" style="text-align: center" mode="horizontal" router>
            <el-menu-item index="/login" class="nav-menu-item">
              登录
            </el-menu-item>
            <el-menu-item index="/register" class="nav-menu-item">
              注册
            </el-menu-item>
          </el-menu>
        </template>
        <template v-slot:default>
          <router-view></router-view>
        </template>

      </el-card>
    </div>
    <div id="ball-two">

    </div>

  </div>


</template>

<script>
export default {
  name: "doorLayout"
}
</script>

<style lang="scss">
#door-body {
  width: 100%;
  height: 100%;
  background-color: rgb(233,204,211);
  padding-top: 15%;

  #door-content {
    width: 25%;
    height: auto;
    margin: 0px auto;
    border-radius: 10%;
    #door-card {
      background-color: rgba(147,181,207,.6);
      border: none;
      height: 100%;
      width: 100%;
      border-radius: 10%;
      padding: 10px;
    }

  }
  #ball-one{

  }

  #ball-two{

  }
  .nav-menu{
    width: 100%;
    height: 20%;
    background:rgba(0,0,0,0);
    .nav-menu-item{
      width: 50%;
      border: none;
      background:rgba(0,0,0,0);
    }
  }
  .el-card__header{
    border: none;
    padding-bottom: 0px;
  }
  .el-card__body{
  }

}

</style>
