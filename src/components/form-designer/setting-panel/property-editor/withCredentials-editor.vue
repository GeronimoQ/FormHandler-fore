<template>
  <el-form-item :label="i18nt('designer.setting.withCredentials')">
    <el-checkbox v-model="optionModel.withCredentials"></el-checkbox>
  </el-form-item>
</template>

<script>
  import i18n from "@/utils/i18n"

  export default {
    name: "withCredentials-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
  }
</script>

<style scoped>

</style>
