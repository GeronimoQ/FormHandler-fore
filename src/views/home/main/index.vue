<template>
  <el-container>
    <el-aside>
      <el-menu>
        <el-menu-item-group>
          <span >
            <slot name="title">表格管理</slot>
          </span>

        </el-menu-item-group>

      </el-menu>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  name: "homeMain"
}
</script>

<style scoped>
@import "../container.css";
</style>