<template>
  <div class="task-manager">
    <el-container class="con-wrapper">
      <el-aside>
        <template v-for="(task,index) in taskList">
          <el-card class="task-card" v-if="!task.disabled" shadow="hover" @click.native="loadTaskModel(task,index)">

            <template slot="header">
              <span>{{ task.id }}</span>
            </template>
            <span>{{ task.title }}</span>
            <span>{{ task.instr }}</span>
            <span>{{ task.createTime }}</span>

          </el-card>
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

            <el-link class="head-but" type="danger" :underline="false">删除</el-link>
            <el-link class="head-but" type="warning" :underline="false">停止填报</el-link>
            <el-link class="head-but" type="primary" :underline="false" @click="QRshow">发布</el-link>

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
                <el-button type="text" size="mini" @click="showFillData(item.row.formData)" >查看</el-button>
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
        <v-form-widget ref="showDataDesigner" :designer="designer"  :form-config="designer.formConfig">
        </v-form-widget>
      </el-scrollbar>

    </el-dialog>

    <el-dialog
      :visible.sync="visibleConfig.QRDialogVA"
      append-to-body
      width="15%"
      destroy-on-close
      style="text-align: center;padding: 0px;border-radius: 15px"
      :show-close="false"
      >

      <el-image  fit="cover" :src="QRSrc" @click="QRdownload">

      </el-image>
      <span style="display:block;font-size: 10px;">点击下载</span>

    </el-dialog>
  </div>
</template>

<script>
import {dataFormat, deepClone} from "@/utils/util";
import {createDesigner} from "@/components/form-designer/designer";
import VFormWidget from "@/components/form-designer/form-widget";
import {QRImageAPI, queryTaskList} from "@/apis/taskAPI";
import {queryById} from "@/apis/formAPI";
import TableBody from "@/components/Geronimo/table/TableBody"
import FormDesigner from "@/components/form-designer"
import {fillDone, pageDone} from "@/apis/fillAPI";
import router from "@/router";

export default {
  name: "taskManager",
  components: {TableBody, VFormWidget},
  props: {
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
      filledInfos:[],
      curFillData:null,
      curTaskModel:null,
      visibleConfig:{
        showDataDialogVA:false,
        QRDialogVA:false
      },
      QRSrc:"",
      dialogDesigner:null
    }
  },
  methods: {
    //加载任务列表
    loadTaskList() {
      let params = {
        userId: '110'
      }
      const response = queryTaskList(params)
      response.then(res => {
        this.taskList = res.result
        this.taskModelList = new Array(this.taskList.length).fill(null)
      }).catch(_ => {

      })
    }
    ,

    //加载任务模板
    async loadTaskModel(task, index) {
      this.witchView=0
      this.curTaskInfo = task

      var modelInfo = null

      if (this.taskModelList[index] == null) {
        //API请求模板,测试数据不变，变量将覆盖
        let params = {
          id: task.modelId,
        }
        await queryById(params).then(res => {
          modelInfo = res.result
          this.curTaskModel=deepClone(res.result)
          let widgetList = JSON.parse(modelInfo.itemList)
          let formConfig = JSON.parse(modelInfo.formConfig)
          this.taskModelList[index] = {widgetList, formConfig}
        }).catch(_ => {
        })
      }

      let modifiedFlag = false
      modifiedFlag = this.designer.loadFormJson(this.taskModelList[index])
      //为toolbar-panel添加createTaskButton
      if (modifiedFlag) {
        this.designer.emitHistoryChange()
      }

    },

    async switchChange(viewId) {
      let isPass = await this.check();

      if (isPass && viewId==1) {
        let params = {
          taskId: this.curTaskInfo.id,
          pageSize:10,
          pageNo:1
        }
        pageDone(params).then(res => {
          // this.$message.success("")

          this.filledInfos=res.result.records

        }).catch(_ => {
        })

      } else {
        return;
      }
    },
    showFillData(fillData){
      this.curFillData=deepClone(JSON.parse(fillData))
      this.visibleConfig.showDataDialogVA=true
    },

    openedShowData(ref){

      this.$nextTick(_=>{
        let curFD=this.curFillData
        let designerWidgetList=this.$refs[ref].widgetRefList
        // let formConfig=this.curTaskModel.formConfig
        // let widgetList =[]
        // let widgetValueList=[]

        //  遍历原始数据，凭借widgetList，渲染后，设置组件的Value!
        for (let widgetData in curFD){

          //  分别提取值和表单配置
          let value=curFD[widgetData].value
          let widget=curFD[widgetData].widgetCopy

          // widgetList.push(widget)
          // widgetValueList.push(value)
          designerWidgetList[widget.id].$refs["fieldEditor"].value=value

        }

        // 不重新渲染只是设置值
      })



    },
    QRshow(){
      if (this.check()){
        this.QRSrc=this.$axios.defaults.baseURL+QRImageAPI.url+"?taskId="+this.curTaskInfo.id
        this.visibleConfig.QRDialogVA=true
      }else {
        this.$message.warning("请先选中任务加载！")
      }
    },
    QRdownload(){
        
    },
    loadDesigner(designer,modelJson){
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
    }
  },

  created() {
    this.loadTaskList()
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
  padding-top: 40px;
}

.el-card.task-card {
  width: 80%;
  margin-bottom: 20px;
  padding-left: 30px;

  span {
    display: inline-block;
  }
}

.el-card.task-card:hover {
  margin-left: 20px;
}

.header {
  border-left: #3f4d67 1px solid;
  border-right: #3f4d67 1px solid;
  padding: 20px 0px 0px 30px;
  height: 60px;
}

.head-but {
  float: right;
  margin-right: 20px;
}
.el-image{
  width: 80%;

}
.el-dialog{
  border-radius: 10px;
}
</style>