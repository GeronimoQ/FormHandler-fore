<template>
  <div class="toolbar-container">
    <div class="left-toolbar">
      <el-button type="text" :disabled="undoDisabled" :title="i18nt('designer.toolbar.undoHint')" @click="undoHistory">
        <svg-icon icon-class="undo"/>
      </el-button>
      <el-button type="text" :disabled="redoDisabled" :title="i18nt('designer.toolbar.redoHint')" @click="redoHistory">
        <svg-icon icon-class="redo"/>
      </el-button>
      <el-button-group style="margin-left: 20px">
        <el-button :type="layoutType === 'PC' ? 'info': ''" @click="changeLayoutType('PC')">
          {{ i18nt('designer.toolbar.pcLayout') }}
        </el-button>
        <el-button :type="layoutType === 'Pad' ? 'info': ''" @click="changeLayoutType('Pad')">
          {{ i18nt('designer.toolbar.padLayout') }}
        </el-button>
        <el-button :type="layoutType === 'H5' ? 'info': ''" @click="changeLayoutType('H5')">
          {{ i18nt('designer.toolbar.mobileLayout') }}
        </el-button>
      </el-button-group>
      <el-button type="" style="margin-left: 20px" :title="i18nt('designer.toolbar.nodeTreeHint')"
                 @click="showNodeTreeDrawer">
        <svg-icon icon-class="node-tree"/>
      </el-button>
    </div>

    <el-drawer :title="i18nt('designer.toolbar.nodeTreeTitle')" direction="ltr" :visible.sync="showNodeTreeDrawerFlag"
               :modal="false" :size="280"
               :destroy-on-close="true" class="node-tree-drawer">
      <el-tree ref="nodeTree" :data="nodeTreeData" node-key="id" default-expand-all highlight-current class="node-tree"
               icon-class="el-icon-arrow-right" @node-click="onNodeTreeClick"></el-tree>
    </el-drawer>
    <!--首部右侧按钮（清空，预览...）-->
    <div class="right-toolbar">
      <el-button v-if="showToolButton('clearDesignerButton')" type="text" @click="clearFormWidget">
        <i class="el-icon-delete"/>{{ i18nt('designer.toolbar.clear') }}
      </el-button>

      <el-button v-if="showToolButton('previewFormButton')" type="text" @click="previewForm">
        <i class="el-icon-view"/>{{ i18nt('designer.toolbar.preview') }}
      </el-button>

      <el-button v-if="showToolButton('exportJsonButton')" type="text" @click="exportModelJson">
        <svg-icon icon-class="share"/>
        {{ i18nt('designer.toolbar.exportModelJson') }}
      </el-button>

      <el-button v-if="showToolButton('importJsonButton')" type="text" @click="importJson">
        <svg-icon icon-class="IMPORT"/>
        {{ i18nt('designer.toolbar.importJson') }}
      </el-button>

      <el-button v-if="showToolButton('exportJsonButton')" type="text" @click="exportJson">
        <svg-icon icon-class="export"/>
        {{ i18nt('designer.toolbar.exportJson') }}
      </el-button>
      <!--      <el-button v-if="showToolButton('exportCodeButton')" type="text" @click="exportCode">-->
      <!--        {{ i18nt('designer.toolbar.exportCode') }}-->
      <!--      </el-button>-->
      <!--      <el-button v-if="showToolButton('generateSFCButton')" type="text" @click="generateSFC">-->
      <!--        <svg-icon icon-class="vue-sfc"/>-->
      <!--        {{ i18nt('designer.toolbar.generateSFC') }}-->
      <!--      </el-button>-->
      <el-button v-if="showToolButton('createTaskButton')" type="text" @click="createTask">
        <svg-icon icon-class="rich-editor-field"/>
        {{ i18nt('designer.toolbar.createTaskButton') }}
      </el-button>

      <el-button v-if="showToolButton('deleteModelButton')" style="color: rgb(240,124,130)" type="text"
                 @click="deleteModel">
        <svg-icon icon-class="deleteFile"/>
        {{ i18nt('designer.toolbar.deleteModelButton') }}
      </el-button>


      <template v-for="(idx, slotName) in $slots">
        <slot :name="slotName"></slot>
      </template>
    </div>
    <!--预览对话框，将其替换为模板，便于后端拿出复用。-->
    <el-dialog :title="i18nt('designer.toolbar.preview')" :visible.sync="showPreviewDialogFlag"
               v-if="showPreviewDialogFlag"
               :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false" center v-dialog-drag
               :destroy-on-close="true" class="small-padding-dialog" width="75%" :fullscreen="layoutType === 'H5'">
      <div>
        <div class="form-render-wrapper" :class="[layoutType === 'H5' ? 'h5-layout' : '']">
          <!--         表格渲染组件 -->
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
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.importJson')" :visible.sync="showImportJsonDialogFlag"
               v-if="showImportJsonDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-alert type="info" :title="i18nt('designer.hint.importJsonHint')" show-icon class="alert-padding"></el-alert>
      <code-editor :mode="'json'" :readonly="false" v-model="importTemplate"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doJsonImport">
          {{ i18nt('designer.hint.import') }}
        </el-button>
        <el-button @click="showImportJsonDialogFlag = false">
          {{ i18nt('designer.hint.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.exportJson')" :visible.sync="showExportJsonDialogFlag"
               v-if="showExportJsonDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <code-editor :mode="'json'" :readonly="true" v-model="jsonContent"></code-editor>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-json-btn" :data-clipboard-text="jsonRawContent" @click="copyFormJson">
          {{ i18nt('designer.hint.copyJson') }}
        </el-button>
        <el-button @click="saveFormJson">{{ i18nt('designer.hint.saveFormJson') }}</el-button>
        <el-button type="" @click="showExportJsonDialogFlag = false">
          {{ i18nt('designer.hint.closePreview') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.exportCode')" :visible.sync="showExportCodeDialogFlag"
               v-if="showExportCodeDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               width="65%" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-tabs type="border-card" class="no-box-shadow no-padding" v-model="activeCodeTab">
        <el-tab-pane label="Vue" name="vue">
          <code-editor :mode="'html'" :readonly="true" v-model="vueCode" :user-worker="false"></code-editor>
        </el-tab-pane>
        <el-tab-pane label="HTML" name="html">
          <code-editor :mode="'html'" :readonly="true" v-model="htmlCode" :user-worker="false"></code-editor>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-vue-btn" :data-clipboard-text="vueCode" @click="copyVueCode">
          {{ i18nt('designer.hint.copyVueCode') }}
        </el-button>
        <el-button type="primary" class="copy-html-btn" :data-clipboard-text="htmlCode" @click="copyHtmlCode">
          {{ i18nt('designer.hint.copyHtmlCode') }}
        </el-button>
        <el-button @click="saveVueCode">{{ i18nt('designer.hint.saveVueCode') }}</el-button>
        <el-button @click="saveHtmlCode">{{ i18nt('designer.hint.saveHtmlCode') }}</el-button>
        <el-button type="" @click="showExportCodeDialogFlag = false">
          {{ i18nt('designer.hint.closePreview') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.hint.exportFormData')" :visible.sync="showFormDataDialogFlag"
               v-if="showFormDataDialogFlag" :show-close="true" class="dialog-title-light-bg" center v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true"
               :append-to-body="true">
      <div style="border: 1px solid #DCDFE6">
        <code-editor :mode="'json'" :readonly="true" v-model="formDataJson"></code-editor>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-form-data-json-btn" :data-clipboard-text="formDataRawJson"
                   @click="copyFormDataJson">
          {{ i18nt('designer.hint.copyFormData') }}
        </el-button>
        <el-button @click="saveFormData">{{ i18nt('designer.hint.saveFormData') }}</el-button>
        <el-button type="" @click="showFormDataDialogFlag = false">
          {{ i18nt('designer.hint.closePreview') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="i18nt('designer.toolbar.generateSFC')" :visible.sync="showExportSFCDialogFlag"
               v-if="showExportSFCDialogFlag" :show-close="true" class="small-padding-dialog" center v-dialog-drag
               width="65%" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
      <el-tabs type="border-card" class="no-box-shadow no-padding" v-model="activeSFCTab">
        <el-tab-pane label="Vue2" name="vue2">
          <code-editor :mode="'html'" :readonly="true" v-model="sfcCode" :user-worker="false"></code-editor>
        </el-tab-pane>
        <el-tab-pane label="Vue3" name="vue3">
          <code-editor :mode="'html'" :readonly="true" v-model="sfcCodeV3" :user-worker="false"></code-editor>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-vue2-sfc-btn" :data-clipboard-text="sfcCode" @click="copyV2SFC">
          {{ i18nt('designer.hint.copyVue2SFC') }}
        </el-button>
        <el-button type="primary" class="copy-vue3-sfc-btn" :data-clipboard-text="sfcCodeV3" @click="copyV3SFC">
          {{ i18nt('designer.hint.copyVue3SFC') }}
        </el-button>
        <el-button @click="saveV2SFC">{{ i18nt('designer.hint.saveVue2SFC') }}</el-button>
        <el-button @click="saveV3SFC">{{ i18nt('designer.hint.saveVue3SFC') }}</el-button>
        <el-button type="" @click="showExportSFCDialogFlag = false">
          {{ i18nt('designer.hint.closePreview') }}
        </el-button>
      </div>
    </el-dialog>

    <!--    创建任务抽屉-->
    <el-dialog
        title="创建任务"
        append-to-body
        :visible.sync="showCreateTaskDialogFlag"
        v-if="showCreateTaskDialogFlag"
        show-close
        :destroy-on-close="true"
        :before-close="closeTaskCreate"
    >


      <el-form ref="form" :model="taskCreation" label-width="80px">
        <!--      任务类型-->
        <el-form-item label="任务类型">
          <el-select :value="visiable.TaskTypeTransferVB" v-model="visiable.TaskTypeTransferVB"
                     @change="TaskTypeSelectChange">
            <el-option
                :value="false" label="公共">

            </el-option>

            <el-option :value="true" label="团体">

            </el-option>

          </el-select>
        </el-form-item>

        <!--团体任务穿梭框-->
        <el-form-item v-show="visiable.TaskTypeTransferVB" label="填报团体">
          <el-transfer

              :data="transferGroupData"
              v-model="newTaskCheckedGroups"
              :titles="['拥有团体', '下发团体']"
          >
          </el-transfer>
        </el-form-item>


        <el-form-item label="标题">
          <el-input v-model="taskCreation.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="taskCreation.instr"></el-input>
        </el-form-item>

      </el-form>
      <template v-slot:footer>
        <div style="width: 100%;height: auto;text-align: center">

          <el-button style="width: 20%;height:40px" type="primary" @click="taskAdd">确定</el-button>
          <el-button style="width: 20%;height:40px" @click="showCreateTaskDialogFlag=false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import VFormRender from '@/components/form-render/index'
import CodeEditor from '@/components/code-editor/index'
import Clipboard from 'clipboard'
import {
  deepClone,
  copyToClipboard,
  generateId,
  getQueryParam,
  traverseAllWidgets, dataFormat
} from "@/utils/util";
import i18n from '@/utils/i18n'
import {generateCode} from "@/utils/code-generator";
import {genSFC} from "@/utils/sfc-generator";
import loadBeautifier from "@/utils/beautifierLoader";
import {saveAs} from 'file-saver'

// api
import {deleteModel, sendFormModel} from "@/apis/formAPI";
import {addGroupTask, addTask} from "@/apis/taskAPI";
import useClipboard from 'vue-clipboard3'
import {listGroup} from "@/apis/groupAPI";
import groupInfo from "@/views/groupManage/common/groupInfo";

export default {
  name: "ToolbarPanel",
  mixins: [i18n],
  components: {
    VFormRender,
    CodeEditor,
    Clipboard,
  },
  props: {
    designer: Object
  },
  inject: ['getDesignerConfig'],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      showPreviewDialogFlag: false,
      showImportJsonDialogFlag: false,
      showExportJsonDialogFlag: false,
      showExportCodeDialogFlag: false,
      showFormDataDialogFlag: false,
      showExportSFCDialogFlag: false,
      showNodeTreeDrawerFlag: false,
      showCreateTaskDialogFlag: false,

      visiable: {
        TaskTypeTransferVB: false
      },


      transferGroupData: [],
      //请求到数据后立即生成上一条数据
      groupList: null,
      newTaskCheckedGroups: [],

      nodeTreeData: [],

      testFunc: '',
      importTemplate: '',
      jsonContent: '',
      jsonRawContent: '',

      formDataJson: '',
      formDataRawJson: '',

      vueCode: '',
      htmlCode: '',

      sfcCode: '',
      sfcCodeV3: '',

      activeCodeTab: 'vue',
      activeSFCTab: 'vue2',

      testFormData: {
        // 'userName': '666888',
        // 'productItems': [
        //   {'pName': 'iPhone12', 'pNum': 10},
        //   {'pName': 'P50', 'pNum': 16},
        // ]

        'select62173': 2,
      },
      testOptionData: {
        'select62173': [
          {label: '01', value: 1},
          {label: '22', value: 2},
          {label: '333', value: 3},
        ]
      },

      //  任务数据对象
      taskCreation: {
        //之后从vuex中拿
        id: "",
        userId: this.$store.state.userInfo.id,
        createTime: dataFormat(new Date()),
        title: "",
        instr: "",
        disabled: false,
        modelId: ""
      }


    }
  },
  computed: {
    formJson() {
      return {
        widgetList: this.designer.widgetList,
        formConfig: this.designer.formConfig
      }
    },

    undoDisabled() {
      return !this.designer.undoEnabled()
    },

    redoDisabled() {
      return !this.designer.redoEnabled()
    },

    layoutType() {
      return this.designer.getLayoutType()
    },

  },
  watch: {
    'designer.widgetList': {
      deep: true,
      handler(val) {
        //console.log('test-----', val)
        //this.refreshNodeTree()
      }
    },


  },
  methods: {
    showToolButton(configName) {
      if (this.designerConfig[configName] === undefined) {
        return true
      }

      return !!this.designerConfig[configName]
    },
    async TaskTypeSelectChange(value) {
      if (value) {
        //为真时候才是团体模式
        if (this.groupList === null) {
          await this.loadGroupList();
          await this.generateTransferData();
        }
      }
      // return
    },
    /**
     * 当selectchange到true,加载任务模板API
     */
    async loadGroupList() {
      if (this.groupList === null) {
        let params = {
          userId: this.$store.state.userInfo.id
        }
        await listGroup(params).then(res => {
          this.groupList = res.result
        }).catch()
      }

    },
    /**
     * 生成transfer数据
     * @param groupList
     */
    generateTransferData() {
      for (let index in this.groupList) {
        let group = this.groupList[index]
        let one = {
          key: group.id,
          label: group.groupName,
          disable: false
        }
        this.transferGroupData.push(one)
      }
    },
    //发送任务
    async taskAdd() {
      if (this.visiable.TaskTypeTransferVB) {
        //团体模式
        //["123456"]记录的是key
        // alert(JSON.stringify(checkedGroups))
        try {
          this.taskCreation.modelId = this.designer.remoteFormModel.id

          this.taskCreation.userId =JSON.parse(JSON.stringify(this.newTaskCheckedGroups));

          await addGroupTask(this.taskCreation).then(res => {
            this.$message.success("任务创建成功")
            this.showCreateTaskDialogFlag = false;
            this.$confirm("若继续创建任务请重新加载模板").then(_ => {
              this.designerConfig['createTaskButton'] = false;
              this.designerConfig['deleteModelButton'] = false;
              done();
            }).catch()
          }).catch(_ => {

          })
        } catch (e) {

        }


      } else {
        this.taskCreation.modelId = this.designer.remoteFormModel.id
        const response = addTask(this.taskCreation)
        response.then(res => {
          this.$message.success("任务创建成功")
          this.showCreateTaskDialogFlag = false;
          this.$confirm("若继续创建任务请重新加载模板").then(_ => {
            this.designerConfig['createTaskButton'] = false;
            this.designerConfig['deleteModelButton'] = false;
            done();
          }).catch(_ => {

          })
        }).catch(_ => {
        })
      }

    },

    //关闭CreateTaskDrawer前
    closeTaskCreate(done) {

      //  1.去除TaskButton
      //  2.去除远程模板信息.
      //  3.提示若要继续创建任务需要重新加载模板
      this.$confirm("若继续创建任务请重新加载模板").then(_ => {
        this.designerConfig['createTaskButton'] = false;
        this.designerConfig['deleteModelButton'] = false;
        done();
      }).catch(_ => {

      })
    },

    // //发送任务数据
    // sendTaskInfo() {
    //   const params = {}
    //   let response = addTask(params)
    //
    //   this.$confirm("确认提交?").then(_ => {
    //     response.then(res => {
    //
    //       this.$message({
    //         type: "success", message: res.result
    //       })
    //     }).catch(_ => {
    //
    //     })
    //     //  关闭drawer
    //     $refs.drawer.closeDrawer()
    //   }).catch(err => {
    //     this.$message({type: "error", message: "请重试"})
    //   })
    // },


    buildTreeNodeOfWidget(widget, treeNode) {
      let curNode = {
        id: widget.id,
        label: widget.options.label || widget.type,
        //selectable: true,
      }
      treeNode.push(curNode)

      if (widget.category === undefined) {
        return
      }

      curNode.children = []
      if (widget.type === 'grid') {
        widget.cols.map(col => {
          let colNode = {
            id: col.id,
            label: col.options.name || widget.type,
            children: []
          }
          curNode.children.push(colNode)
          col.widgetList.map(wChild => {
            this.buildTreeNodeOfWidget(wChild, colNode.children)
          })
        })
      } else if (widget.type === 'table') {
        //TODO: 需要考虑合并单元格！！
        widget.rows.map(row => {
          let rowNode = {
            id: row.id,
            label: 'table-row',
            selectable: false,
            children: [],
          }
          curNode.children.push(rowNode)

          row.cols.map(cell => {
            if (!!cell.merged) {  //跳过合并单元格！！
              return
            }

            let rowChildren = rowNode.children
            let cellNode = {
              id: cell.id,
              label: 'table-cell',
              children: []
            }
            rowChildren.push(cellNode)

            cell.widgetList.map(wChild => {
              this.buildTreeNodeOfWidget(wChild, cellNode.children)
            })
          })
        })
      } else if (widget.type === 'tab') {
        widget.tabs.map(tab => {
          let tabNode = {
            id: tab.id,
            label: tab.options.name || widget.type,
            selectable: false,
            children: []
          }
          curNode.children.push(tabNode)
          tab.widgetList.map(wChild => {
            this.buildTreeNodeOfWidget(wChild, tabNode.children)
          })
        })
      } else if (widget.type === 'sub-form') {
        widget.widgetList.map(wChild => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      } else if (widget.category === 'container') {  //自定义容器
        widget.widgetList.map(wChild => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      }
    },

    refreshNodeTree() {
      this.nodeTreeData.length = 0
      this.designer.widgetList.forEach(wItem => {
        this.buildTreeNodeOfWidget(wItem, this.nodeTreeData)
      })
    },

    showNodeTreeDrawer() {
      this.refreshNodeTree()
      this.showNodeTreeDrawerFlag = true
      this.$nextTick(() => {
        if (!!this.designer.selectedId) {  //同步当前选中组件到节点树！！！
          this.$refs.nodeTree.setCurrentKey(this.designer.selectedId)
        }
      })
    },

    undoHistory() {
      this.designer.undoHistoryStep()
    },

    redoHistory() {
      this.designer.redoHistoryStep()
    },

    changeLayoutType(newType) {
      this.designer.changeLayoutType(newType)
    },

    clearFormWidget() {
      this.designer.clearDesigner()
    },

    previewForm() {
      this.showPreviewDialogFlag = true
    },

    saveAsFile(fileContent, defaultFileName) {
      this.$prompt(this.i18nt('designer.hint.fileNameForSave'), this.i18nt('designer.hint.saveFileTitle'), {
        inputValue: defaultFileName,
        closeOnClickModal: false,
        inputPlaceholder: this.i18nt('designer.hint.fileNameInputPlaceholder')
      }).then(({value}) => {
        if (!value) {
          value = defaultFileName
        }

        if (getQueryParam('vscode') == 1) {
          this.vsSaveFile(value, fileContent)
          return
        }

        const fileBlob = new Blob([fileContent], {type: 'text/plain;charset=utf-8'})
        saveAs(fileBlob, value)
      }).catch(() => {
        //
      })
    },

    vsSaveFile(fileName, fileContent) {
      const msgObj = {
        cmd: 'writeFile',
        data: {
          fileName,
          code: fileContent
        }
      }
      window.parent.postMessage(msgObj, '*')
    },

    importJson() {
      this.importTemplate = JSON.stringify(this.designer.getImportTemplate(), null, '  ')
      this.showImportJsonDialogFlag = true
    },

    doJsonImport() {
      try {
        let importObj = JSON.parse(this.importTemplate)
        this.designer.loadFormJson(importObj)

        this.showImportJsonDialogFlag = false
        this.$message.success(this.i18nt('designer.hint.importJsonSuccess'))

        this.designer.emitHistoryChange()

        this.designer.emitEvent('form-json-imported', [])
      } catch (ex) {
        this.$message.error(ex + '')
      }
    },
    async exportModelJson() {
      let widgetList = deepClone(this.designer.widgetList)//表单元素配置
      let formConfig = deepClone(this.designer.formConfig)//表单配置

      this.jsonContent = JSON.stringify({widgetList, formConfig}, null, '  ')
      this.jsonRawContent = await JSON.stringify({widgetList, formConfig})
      try {
        //复制
        await useClipboard().toClipboard(this.jsonRawContent)
        this.$notify({type: "success", title: "模板分析", message: "数据已经复制到粘贴板"})
        //下面可以设置复制成功的提示框等操作
        //...
      } catch (e) {
        //复制失败
        this.$notify({type: "error", title: "模板分析", message: "数据复制失败!"})
      }

    },

    //导出JSON，我们将对代码发送到服务器端（sendToServer(api/form/add)）
    exportJson() {
      let widgetList = deepClone(this.designer.widgetList)//表单元素配置
      let formConfig = deepClone(this.designer.formConfig)//表单配置

      this.jsonContent = JSON.stringify({widgetList, formConfig}, null, '  ')
      this.jsonRawContent = JSON.stringify({widgetList, formConfig})

      //拒绝预览框的出现，直接上传数据，但建议添加提示对话框！
      // this.showExportJsonDialogFlag = true
      //  封装数据，发送请求
      //
      const formModel = {
        createTime: dataFormat(new Date()),
        formConfig: JSON.stringify(formConfig),
        formInstr: "",
        id: "",
        itemList: JSON.stringify(widgetList),
        userId: this.$store.state.userInfo.id
      }
      //  测试数据
      // console.log(JSON.stringify(formObj))
      //  发送，此模块建议放入确认对话框
      const response = sendFormModel(formModel)
      response.then(res => {
        this.$message({type: "success", message: res.message})
      }).catch(err => {
        //预留，对请求失败的数据进行处理
        // this.$notify({title: "上传失败", type: "error", message: err.data.message})
      })
    },

    copyFormJson(e) {
      copyToClipboard(this.jsonRawContent, e,
          this.$message,
          this.i18nt('designer.hint.copyJsonSuccess'),
          this.i18nt('designer.hint.copyJsonFail')
      )
    },

    saveFormJson() {
      this.saveAsFile(this.jsonContent, `vform${generateId()}.json`)
    },

    exportCode() {
      this.vueCode = generateCode(this.formJson)
      this.htmlCode = generateCode(this.formJson, 'html')
      this.showExportCodeDialogFlag = true
    },

    copyVueCode(e) {
      copyToClipboard(this.vueCode, e,
          this.$message,
          this.i18nt('designer.hint.copyVueCodeSuccess'),
          this.i18nt('designer.hint.copyVueCodeFail')
      )
    },

    copyHtmlCode(e) {
      copyToClipboard(this.htmlCode, e,
          this.$message,
          this.i18nt('designer.hint.copyHtmlCodeSuccess'),
          this.i18nt('designer.hint.copyHtmlCodeFail')
      )
    },

    saveVueCode() {
      this.saveAsFile(this.vueCode, `vform${generateId()}.vue`)
    },

    saveHtmlCode() {
      this.saveAsFile(this.htmlCode, `vform${generateId()}.html`)
    },

    generateSFC() {
      loadBeautifier(beautifier => {
        this.sfcCode = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier)
        this.sfcCodeV3 = genSFC(this.designer.formConfig, this.designer.widgetList, beautifier, true)
        this.showExportSFCDialogFlag = true
      })
    },
    //任务创建按钮，使得创建抽屉展现
    createTask() {
      this.showCreateTaskDialogFlag = true;
    },

    copyV2SFC(e) {
      copyToClipboard(this.sfcCode, e,
          this.$message,
          this.i18nt('designer.hint.copySFCSuccess'),
          this.i18nt('designer.hint.copySFCFail')
      )
    },

    copyV3SFC(e) {
      copyToClipboard(this.sfcCodeV3, e,
          this.$message,
          this.i18nt('designer.hint.copySFCSuccess'),
          this.i18nt('designer.hint.copySFCFail')
      )
    },

    saveV2SFC() {
      this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`)
    },

    saveV3SFC() {
      this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`)
    },

    getFormData() {
      this.$refs['preForm'].getFormData().then(formData => {
        this.formDataJson = JSON.stringify(formData, null, '  ')
        this.formDataRawJson = JSON.stringify(formData)

        this.showFormDataDialogFlag = true
      }).catch(error => {
        this.$message.error(error)
      })
    },

    copyFormDataJson(e) {
      copyToClipboard(this.formDataRawJson, e,
          this.$message,
          this.i18nt('designer.hint.copyJsonSuccess'),
          this.i18nt('designer.hint.copyJsonFail')
      )
    },

    saveFormData() {
      this.saveAsFile(this.htmlCode, `formData${generateId()}.json`)
    },

    resetForm() {
      this.$refs['preForm'].resetForm()
    },

    setFormDisabled() {
      this.$refs['preForm'].disableForm()
    },

    setFormEnabled() {
      this.$refs['preForm'].enableForm()
    },

    handleFormChange(fieldName, newValue, oldValue, formModel) {
      /*
      console.log('---formChange start---')
      console.log('fieldName', fieldName)
      console.log('newValue', newValue)
      console.log('oldValue', oldValue)
      console.log('formModel', formModel)
      console.log('---formChange end---')
      */
    },

    testOnAppendButtonClick(clickedWidget) {
      console.log('test', clickedWidget)
    },

    testOnButtonClick(button) {
      console.log('test', button)
    },

    findWidgetById(wId) {
      let foundW = null
      traverseAllWidgets(this.designer.widgetList, (w) => {
        if (w.id === wId) {
          foundW = w
        }
      })

      return foundW
    },

    onNodeTreeClick(nodeData, node, nodeEl) {
      //console.log('test', JSON.stringify(nodeData))

      if ((nodeData.selectable !== undefined) && !nodeData.selectable) {
        this.$message.info(this.i18nt('designer.hint.currentNodeCannotBeSelected'))
      } else {
        const selectedId = nodeData.id
        const foundW = this.findWidgetById(selectedId)
        if (!!foundW) {
          this.designer.setSelected(foundW)
        }
      }
    },
    deleteModel() {

      this.$alert('是否删除当前模板!', '模板操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
        callback: action => {
          if (action === 'confirm') {
            let params = {
              id: this.designer.remoteFormModel.id
            }
            deleteModel(params).then(res => {
              this.$message.success(res.result)
              // 退出模板预览 等待重新选择，覆盖旧模板信息
              this.$alert("请点击模板列表刷新,若继续创建任务请重新加载模板", {
                confirmButtonText: '确定',
                type: "success",
                callback: action => {
                  this.designerConfig['createTaskButton'] = false;
                  this.designerConfig['deleteModelButton'] = false;
                  this.reloadModelList()
                }
              })
            }).catch()
          }

        }
      });
    },
    inject: ['reloadModelList']
  }
}
</script>

<style lang="scss" scoped>
div.toolbar-container {
  min-width: 728px; /* 解决工具按钮栏换行的问题！！ */
}

.left-toolbar {
  float: left;
  font-size: 16px;
}

.right-toolbar {
  float: right;

  ::v-deep .el-button--text {
    font-size: 14px !important;
  }
}

.el-button i {
  margin-right: 3px;
}

.small-padding-dialog {
  ::v-deep .el-dialog__header {
    //padding-top: 3px;
    //padding-bottom: 3px;
    background: #f1f2f3;
  }

  ::v-deep .el-dialog__body {
    padding: 12px 15px 12px 15px;

    .el-alert.alert-padding {
      padding: 0 10px;
    }
  }

  ::v-deep .ace-container {
    border: 1px solid #DCDFE6;
  }
}

.dialog-title-light-bg {
  ::v-deep .el-dialog__header {
    background: #f1f2f3;
  }
}

.no-box-shadow {
  box-shadow: none;
}

.no-padding.el-tabs--border-card {
  ::v-deep .el-tabs__content {
    padding: 0;
  }
}

.form-render-wrapper {
  //height: calc(100vh - 142px);
  all: revert !important; /* 防止表单继承el-dialog等外部样式，未生效，原因不明？？ */
}

.form-render-wrapper.h5-layout {
  margin: 0 auto;
  width: 420px;
  border-radius: 15px;
  //border-width: 10px;
  box-shadow: 0 0 1px 10px #495060;
  height: calc(100vh - 142px);
}

.node-tree-drawer ::v-deep {
  .el-drawer {
    padding: 10px;
    overflow: auto;
  }

  .el-drawer__header {
    margin-bottom: 12px;
    padding: 5px 5px 0;
  }

  .el-drawer__body {
    padding-left: 5px;
  }
}

/*.node-tree-scroll-bar {*/
/*  height: 100%;*/
/*  overflow: auto;*/
/*}*/

.node-tree ::v-deep {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node {
    position: relative;
    padding-left: 12px;
  }

  .el-tree-node__content {
    padding-left: 0 !important;
  }

  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .el-tree-node__children {
    padding-left: 12px;
    overflow: visible !important; /* 加入此行让el-tree宽度自动撑开，超出宽度el-draw自动出现水平滚动条！ */
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -10px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 16px;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background: #c2d6ea !important;
  }

  .el-tree-node__expand-icon {
    margin-left: -3px;
    padding: 6px 6px 6px 0px;
    font-size: 16px;
  }

}
</style>
