<template>
    <!--  body-->
    <div id="door-body">

        <div id="ball-one">

        </div>
        <!--  中间导航栏-->
        <div id="door-content">
            <el-card id="door-card" shadow="">
                <template v-slot:header>
                    <el-menu class="nav-menu" style="" mode="horizontal" router>
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
    padding-top: 10%;
    //background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='120' height='80' patternTransform='scale(4) rotate(115)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(201,100%,14.3%,1)'/><path d='M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='3' stroke='hsla(0,68.5%,49.8%,1)' fill='none'/><path d='M-50.129 32.685C-33.346 32.358-16.786 24.918 0 25c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='3' stroke='hsla(40,96.8%,63.7%,1)' fill='none'/><path d='M-50.129 52.685C-33.346 52.358-16.786 44.918 0 45c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='3' stroke='hsla(31,100%,48.4%,1)' fill='none'/><path d='M-50.129 72.685C-33.346 72.358-16.786 64.918 0 65c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='3' stroke='hsla(51,54.8%,81.8%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
    background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='120' height='80' patternTransform='scale(4) rotate(10)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(211,52.7%,10.8%,1)'/><path d='M-50.129 12.685C-33.346 12.358-16.786 4.918 0 5c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='1' stroke='hsla(219,37.2%,16.9%,1)' fill='none'/><path d='M-50.129 32.685C-33.346 32.358-16.786 24.918 0 25c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='1' stroke='hsla(212,29.3%,36.1%,1)' fill='none'/><path d='M-50.129 52.685C-33.346 52.358-16.786 44.918 0 45c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='1' stroke='hsla(214,22.5%,56.5%,1)' fill='none'/><path d='M-50.129 72.685C-33.346 72.358-16.786 64.918 0 65c16.787.082 43.213 10 60 10s43.213-9.918 60-10c16.786-.082 33.346 7.358 50.129 7.685'  stroke-width='1' stroke='hsla(75,6.2%,87.5%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");

    .el-form-item__label{
      color: white;
    }

    .el-menu--horizontal>.el-menu-item{
      color: #d0dfe6;
    }

    .el-menu--horizontal>.el-menu-item.is-active{
      background-color:#fff;
      color: black;
    }



    #door-content {
      width: 400px;
      //height: auto;
      margin: 0 auto;
      border-radius: 15%;

      #door-card {
        //background-color: #cccccc4a !important;
        background-color: #ffffff4a !important;
        backdrop-filter: blur(10px);
        border: none;
        height: 100%;
        width: 100%;
        border-radius: 10%;
        padding: 10px;
      }

    }

    #ball-one {

    }

    #ball-two {

    }

    .nav-menu {
      width: 100%;
      height: 20%;
      text-align: center;
      background-color: rgb(205 205 205 / 38%);
      border-radius: 25px;
      //background: rgba(0, 0, 0, 0);

      .nav-menu-item{
        width: 50%;
        border: none;
        border-radius: 25px;
        background: rgba(0, 0, 0, 0);
      }
    }

    .el-card__header {
      border: none;
      padding-bottom: 0px;
    }

    .el-card__body {
    }

  }

</style>
