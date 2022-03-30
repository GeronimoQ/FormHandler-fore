<template>
  <div class="task-manager">
    <el-container class="con-wrapper">
      <el-aside>
        <template v-for="(task,index) in taskList">
          <transition name="fade" duration="{ enter: 500, leave: 1500 }">
            <el-card class="task-card" :class="{'removed':!task,'checked-card':curTaskInfo===null?false:curTaskInfo.id===task.id}" shadow="hover"
                     @click.native="loadTaskModel(task,index)">
              <template slot="header">
                <div v-show="task.disabled" style="float: right">
                  <div id="disabledTag_line"></div>
                  <div id="disabledTag"></div>
                </div>
                <span style="display: block;width: 100%;font-size: 15px;font-weight: bold">{{ task.title }}</span>
                <span style="display: block;width:100%;text-align: right;padding-top:10px;font-size: 10px;">{{
                    task.id
                  }}</span>
              </template>
              <span>{{ task.instr }}</span>
              <span style="float: right;margin-top: 30px;padding-bottom: 10px;font-size: 10px;color: #B3C0D1">{{ task.createTime }}</span>
            </el-card>
          </transition>
        </template>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header">
            <el-switch v-model="witchView"
                       active-text="填报情况"
                       inactive-text="任务模板"
                       active-value="1"
                       inactive-value="0"
                       inactive-color="#13ce66"
                       @change="switchChange"
            >
            </el-switch>


            <!--            <el-link class="head-but" type="info">二维码</el-link>-->

            <el-link class="head-but" type="danger" :underline="false" @click="showRemoveDialog">删除</el-link>
            <svg-icon class="head-but-icon" icon-class="delete"></svg-icon>

            <el-link v-show="visibleConfig.disableLinkVA" class="head-but" type="warning" :underline="false"
                     @click="showDisabledDialog" style="color:#E9CCD3 ">停止填报
            </el-link>
            <svg-icon v-show="visibleConfig.disableLinkVA" class="head-but-icon" icon-class="disabled"></svg-icon>

<!--            <el-link v-show="visibleConfig.usableLinkVA" class="head-but" type="warning" :underline="false"-->
<!--                     @click="showDisabledDialog">启用填报-->
<!--            </el-link>-->
            <svg-icon v-show="visibleConfig.usableLinkVA" class="head-but-icon" icon-class="usable"></svg-icon>

            <el-link class="head-but" style="margin-left: 0px" type="primary" :underline="false" @click="QRshow">发布</el-link>
            <svg-icon class="head-but-icon" icon-class="publish"></svg-icon>

          </div>
        </el-header>
        <el-main>

          <!--        保证组件复用，希望通过插槽选择不同的组件-->
          <template v-if="witchView==0">
            <el-scrollbar class="container-scroll-bar" style="{height: 0}">
              <v-form-widget :designer="designer" :form-config="designer.formConfig">
              </v-form-widget>
            </el-scrollbar>
          </template>

          <template v-else-if="witchView==1">
            <table-body :table-options.sync="tableOption" :table-data="filledInfos">
              <template v-slot:menu="item">
                <el-button type="text" size="mini" @click="showFillData(item.row.formData)">查看</el-button>
              </template>
            </table-body>

          </template>

        </el-main>
      </el-container>

    </el-container>


    <!--    弹窗-->
    <el-dialog title="填报详情"
               :visible.sync="visibleConfig.showDataDialogVA"
               @open="openedShowData('showDataDesigner')"
               append-to-body
               destroy-on-close
    >

      <el-scrollbar class="container-scroll-bar" style="{height: 0}">
        <v-form-widget ref="showDataDesigner" :designer="designer" :form-config="designer.formConfig">
        </v-form-widget>
      </el-scrollbar>

    </el-dialog>

    <el-dialog
        id="qrShowDialog"
        :visible.sync="visibleConfig.QRDialogVA"
        append-to-body
        width="15%"
        destroy-on-close
        style="text-align: center;padding: 0px;border-radius: 15px"
        :show-close="false"
        @click="QRdownload"
    >

      <el-image fit="cover" :src="QRSrc" @click="QRdownload">

      </el-image>
      <span style="display:block;font-size: 10px;">点击下载</span>
    </el-dialog>


    <el-dialog
        :visible.sync="visibleConfig.disableVA"
        title="任务结束"
        append-to-body
        width="15%"
        destroy-on-close
        style="text-align: center;"
        :show-close="true"
    >
      <template v-slot:default>
        是否结束该任务的填报?
      </template>
      <template v-slot:footer>
        <el-button type="warning" @click="disableTaskLink" plain>确定</el-button>
        <el-button @click="visibleConfig.disableVA=false" plain>取消</el-button>
      </template>

    </el-dialog>


    <el-dialog
        :visible.sync="visibleConfig.removeVA"
        title="任务结束"
        append-to-body
        width="15%"
        destroy-on-close
        style="text-align: center;"
        :show-close="true"
    >
      <template v-slot:title>
        任务操作
      </template>
      <svg-icon style="font-size: 30px;vertical-align: middle" icon-class="alert"></svg-icon>
      是否删除该任务?
      <template v-slot:footer>
        <el-button type="danger" @click="deleteTaskLink" plain>确定</el-button>
        <el-button @click="visibleConfig.removeVA=false" plain>取消</el-button>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import {dataFormat, deepClone} from "@/utils/util";
import {createDesigner} from "@/components/form-designer/designer";
import VFormWidget from "@/components/form-designer/form-widget";
import {downloadQRAPI, QRdownload, QRImageAPI, queryTaskList, editTask, deleteTask} from "@/apis/taskAPI";
import {queryById} from "@/apis/formAPI";
import TableBody from "@/components/Geronimo/table/TableBody"
import {fillDone, pageDone} from "@/apis/fillAPI";
import {Vue} from "vue";

export default {
  name: "taskManager",
  components: {TableBody, VFormWidget},
  props: {
    //外部传入数据
    injectTaskList:{
      type: Array,
      default: null,
    },
    /* 后端字段列表API */
    fieldListApi: {
      type: Object,
      default: null,
    },
    /* 禁止显示的组件名称数组 */
    bannedWidgets: {
      type: Array,
      default: () => []
    },

    designerConfig: {
      type: Object,
      default: () => {
        return {
          languageMenu: true,  //是否显示语言切换菜单
          externalLink: true,  //是否显示GitHub、文档等外部链接
          formTemplates: true,  //是否显示表单模板
          eventCollapse: true,  //是否显示组件事件属性折叠面板
          clearDesignerButton: true,  //是否显示清空设计器按钮
          previewFormButton: true,  //是否显示预览表单按钮
          importJsonButton: true,  //是否显示导入JSON按钮
          exportJsonButton: true,  //是否显示导出JSON器按钮
          exportCodeButton: true,  //是否显示导出代码按钮
          generateSFCButton: true,  //是否显示生成SFC按钮
          createTaskButton: false, //是否显示创建任务按钮
          presetCssCode: '',  //设计器预设CSS样式代码
        }
      }
    },

  },
  data() {
    return {
      taskList: [
        // {
        //   id: '',
        //   userId: '',
        //   createTime: dataFormat(new Date()),
        //   title: 'test',
        //   instr: 'v data',
        //   model_id: '1485972052745650177',
        //   disabled: false,
        //   modelJson: null,
        // }
      ],
      taskListIndexMap: new Map(),
      designer: createDesigner(this),
      taskModelList: null,
      // curTaskInfo:
      //     {
      //       id: '',
      //       userId: '',
      //       createTime: dataFormat(new Date()),
      //       title: 'test',
      //       instr: 'v data',
      //       model_id: '1485972052745650177',
      //       disabled: false,
      //       modelJson: null,
      //     },

      curTaskInfo: null,
      witchView: 0,
      tableOption: [
        {
          label: '用户ID',
          prop: 'userId'
        },
        {
          label: '姓名',
          prop: 'username'
        },
        {
          label: '填报时间',
          prop: 'fillDate'
        }
      ],
      filledInfos: [],
      curFillData: null,
      curTaskModel: null,
      visibleConfig: {
        showDataDialogVA: false,
        QRDialogVA: false,
        disableVA: false,
        removeVA: false,
        disableLinkVA: false,
        usableLinkVA: false,
      },
      QRSrc: "",
      dialogDesigner: null,
      isDisabled: false,
      isRemoved: false

    }
  },
  methods: {
    //加载任务列表
    loadTaskList() {
      let params = {
        userId: this.$store.state.userInfo.id
      }
      const response = queryTaskList(params)
      response.then(res => {
        this.taskList = res.result
        this.taskModelList = new Array(this.taskList.length).fill(null)
        this.initListIndexMap(res.result)
      }).catch(_ => {

      })
    },

    initListIndexMap(taskList) {
      for (let index in taskList) {
        this.taskListIndexMap.set(taskList[index].id, index)
      }
    },

    //加载任务模板
    async loadTaskModel(task, index) {
      this.witchView = 0
      this.curTaskInfo = task

      this.visibleConfig.disableLinkVA=!task.disabled;

      var modelInfo = null
      if (this.taskModelList[index] === null) {
        if (!task.disabled) {
          this.visibleConfig.disableLinkVA = true
        } else {
          this.visibleConfig.disableLinkVA = false
        }
        //API请求模板,测试数据不变，变量将覆盖
        let params = {
          id: task.modelId,
        }
        await queryById(params).then(res => {
          modelInfo = res.result
          this.curTaskModel = deepClone(res.result)
          let widgetList = JSON.parse(modelInfo.itemList)
          let formConfig = JSON.parse(modelInfo.formConfig)
          this.taskModelList[index] = {widgetList, formConfig}
        }).catch(_ => {
        })
      }
      //
      let modifiedFlag = false
      modifiedFlag = this.designer.loadFormJson(this.taskModelList[index])
      //为toolbar-panel添加createTaskButton
      if (modifiedFlag) {
        this.designer.emitHistoryChange()
      }

    },

    async switchChange(viewId) {
      let isPass = await this.check();

      if (isPass && viewId == 1) {
        let params = {
          taskId: this.curTaskInfo.id,
          pageSize: 10,
          pageNo: 1
        }
        pageDone(params).then(res => {
          // this.$message.success("")

          this.filledInfos = res.result.records

        }).catch(_ => {
        })

      } else {
        return;
      }
    },
    showFillData(fillData) {
      this.curFillData = deepClone(JSON.parse(fillData))
      this.visibleConfig.showDataDialogVA = true
    },

    openedShowData(ref) {
      this.$nextTick(_ => {
        let curFD = this.curFillData
        let designerWidgetList = this.$refs[ref].widgetRefList
        // let formConfig=this.curTaskModel.formConfig
        // let widgetList =[]
        // let widgetValueList=[]

        //  遍历原始数据，凭借widgetList，渲染后，设置组件的Value!
        for (let widgetData in curFD) {

          //  分别提取值和表单配置
          let value = curFD[widgetData].value
          let widget = curFD[widgetData].widgetCopy

          // widgetList.push(widget)
          // widgetValueList.push(value)
          designerWidgetList[widget.id].$refs["fieldEditor"].value = value

        }

        // 不重新渲染只是设置值
      })
    },
    async QRshow() {
      if (this.check()) {
        if (this.curTaskInfo.disabled){
        //  启用已经禁用的任务
          this.$confirm("重新启用该任务?","任务操作",{
            confirmButtonText:"启用",
            cancelButtonText:"取消",
            showCancelButton:true,
            iconClass:'usable',
            callback:action => {
              if (action==='confirm'){
                let params = {
                  "createTime": "",
                  "disabled": false,
                  "id": this.curTaskInfo.id,
                  "instr": "",
                  "modelId": "",
                  "title": "",
                  "userId": ""
                }
                editTask(params).then(res => {
                  this.taskDisableDOMChange(false)
                  Vue.prototype.$message({
                    title: '操作成功',
                    message: res.result,
                    type: "success"
                  })
                  done();
                }).catch(_ => {
                })
              }
            }
          })
        }else{
        //  正常启用
          this.QRSrc =this.$axios.defaults.baseURL + QRImageAPI.url + "?taskId=" + this.curTaskInfo.id
          this.visibleConfig.QRDialogVA = true
        }

      } else {
        this.$message.warning("请先选中任务加载！")
      }
    },
    QRdownload() {
      let alink = document.createElement('a')
      let QRsrc = this.$axios.defaults.baseURL + downloadQRAPI.url + "?taskId=" + this.curTaskInfo.id
      alink.href = QRsrc
      alink.download = name || 'pic'
      alink.click()
//       注意：这里有一个坑。如果你的图片是从后台请求过来的，如果你的a标签的href是IP地址的话，此时a标签的download属性会失效，a会被当成一个普通的链接使用。
//
// 解决方法一：将IP地址换成域名。
//
// 解决方法二：通过后端转发，后端请求第三方资源，返回给前端，前端再保存文件。

//       // let params={
      //   taskId:this.curTaskInfo.id
      // }
      //   QRdownload(params).then(res=>{
      //     this.message.success("使用相关APP扫描即可填报！")
      //   }).catch(_=>{})
    },
    loadDesigner(designer, modelJson) {
      let modifiedFlag = false
      modifiedFlag = designer.loadFormJson(modelJson)
      //为toolbar-panel添加createTaskButton
      if (modifiedFlag) {
        designer.emitHistoryChange()
      }
    },

    check() {
      if (this.curTaskInfo == null) {
        this.$message.warning("请先点击加载任务！")
        this.witchView = 0
        return false
      }
      return true
    },
    showDisabledDialog() {
      if (this.check()) {
        this.visibleConfig.disableVA = true
      }
    },
    showRemoveDialog() {
      if (this.check()) {
        this.visibleConfig.removeVA = true
      }
    },
    disableTaskLink() {
      if (this.check()) {
        let params = {
          "createTime": "",
          "disabled": true,
          "id": this.curTaskInfo.id,
          "instr": "",
          "modelId": "",
          "title": "",
          "userId": ""
        }
        editTask(params).then(res => {
          this.taskDisableDOMChange(true)
          Vue.prototype.$message({
            title: '操作成功',
            message: res.result,
            type: "success"
          })
        }).catch(_ => {
        })
      }
    },
    async deleteTaskLink() {
      if (! await this.check()){
        return
      }
      let params = {
        id: this.curTaskInfo.id
      }
      deleteTask(params).then(res => {
        this.designer.clearDesigner()
        this.taskRemoveDOMChange()
        this.$message({
          title: '操作成功',
          message: res.result,
          type: "success"
        })
      }).catch()
    },

    async taskRemoveDOMChange() {
      this.visibleConfig.removeVA = false

      let index = this.taskListIndexMap.get(this.curTaskInfo.id)
      //删除列表中的task项目
      setTimeout(() => {
        this.taskList.splice(index, 1)
      }, 800)

      this.taskModelList.splice(index, 1)
    },

    async taskDisableDOMChange(isDisabled) {
      if (isDisabled){
        //被禁用
        this.visibleConfig.disableVA = false
        this.visibleConfig.disableLinkVA=false
        setTimeout(() => {
          this.curTaskInfo.disabled = true
          let index = this.taskListIndexMap.get(this.curTaskInfo.id)
          this.taskList[index].disable = true
        }, 500)
      }else{
      //  启用
        setTimeout(() => {
          this.curTaskInfo.disabled = false
          this.visibleConfig.disableLinkVA=true
          let index = this.taskListIndexMap.get(this.curTaskInfo.id)
          this.taskList[index].disable = false
        }, 500)
      }


    },
    usableTask(){
      this.$confirm("任务操作","是否启用该任务?",{
        confirmButtonText:"启用",
        callback:action => {
          if (action==="confirm"){
            let params = {
              "createTime": "",
              "disabled": false,
              "id": this.curTaskInfo.id,
              "instr": "",
              "modelId": "",
              "title": "",
              "userId": ""
            }
            editTask(params).then(res => {
              this.taskDisableDOMChange(false)
              Vue.prototype.$message({
                title: '操作成功',
                message: res.result,
                type: "success"
              })
            }).catch(_ => {
            })
          }
        }
      })
    }
  },

  created() {
    if (this.injectTaskList===null){
      this.loadTaskList()
    }else{
      this.taskList=this.injectTaskList;
      this.taskModelList = new Array(this.taskList.length).fill(null)
      this.initListIndexMap(this.injectTaskList)
    }
    this.designer.clearDesigner()
  }
  ,
// mounted() {
//   this.witchView = this.$route.params.viewId
// }
}
</script>

<style lang="scss" scoped>
.con-wrapper {
  height: 100%;
  padding-top: 20px;
}

.el-card.task-card {
  width: 90%;
  margin-bottom: 20px;
  border-radius: 20px;
  background-color: #dfecd5;
}

.el-card.task-card:hover {
  //background: olive linear-gradient(to left, rgba(255, 255, 255, 255), rgba(87, 195, 194, 255));
  margin-left: 20px;
}

.checked-card{
  margin-left: 20px;
}
.header {
  border-left: #eef7f2 3px solid;
  //border-right: #3f4d67 1px solid;
  padding: 20px 0px 0px 30px;
  height: 60px;
  vertical-align: middle;
}

.head-but {
  float: right;
  margin-right: 20px;
}

.head-but-icon{
  float: right;
}

.el-image {
  width: 80%;

}

.el-dialog {
  border-radius: 10px;
}

.disabled {
  //background: olive linear-gradient(to left, rgba(255, 255, 255, 255), rgba(240, 124, 130, 155));
}

.removed {

}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

#disabledTag{
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background-color: #E9CCD3;
}
#disabledTag_line{
  //height: 10px;
  //width: 5px;
  //background-color: #E9CCD3 ;

}

</style>
