<template>
  <el-row class="head">
    <template v-for="(header,index) in headers" >
      <el-col class="header">{{ header }}</el-col>
    </template>
  </el-row>
</template>

<script>
export default {
  name: "TableHeader",
  props: {
    headers: {
      type: "array",
      default: ["用户ID", "用户名", "填报时间", "查看"]
    },
    // height: {
    //   type: "string",
    //   default: "40px"
    // }
  }
}
</script>

<style scoped>
.head {
  background-color: #8896B3;
  height: 50px;
}

.header {
  font-size: 25px;
  font-weight: bold;
}
</style>