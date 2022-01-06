<template>
  <div>
    <div class="form-render-wrapper" :class="[layoutType === 'H5' ? 'h5-layout' : '']">
      <VFormRender ref="preForm" :form-json="formJson" :form-data="testFormData" :preview-state="true"
                   :option-data="testOptionData"
                   @appendButtonClick="testOnAppendButtonClick" @buttonClick="testOnButtonClick"
                   @formChange="handleFormChange">
        <!--
        <div slot="testSlot">aaaa</div>
        -->
      </VFormRender>
    </div>
  </div>
  <code-editor v-model="testFunc" style="display: none"></code-editor>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="getFormData">{{ i18nt('designer.hint.getFormData') }}</el-button>
    <el-button type="primary" @click="resetForm">{{ i18nt('designer.hint.resetForm') }}</el-button>
    <el-button type="primary" @click="setFormDisabled">{{ i18nt('designer.hint.disableForm') }}</el-button>
    <el-button type="primary" @click="setFormEnabled">{{ i18nt('designer.hint.enableForm') }}</el-button>
    <el-button type="" @click="showPreviewDialogFlag = false">{{ i18nt('designer.hint.closePreview') }}</el-button>
  </div>
</template>

<script>
export default {
  name: "formPreview"
}
</script>

<style scoped>

</style>