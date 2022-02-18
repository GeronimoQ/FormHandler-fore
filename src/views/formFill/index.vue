<template>
  <div class="formFill">
    <el-container>
      <el-header class="inner-header">
        <el-input class="search" v-model="taskId"></el-input>
        <el-button style="margin-left: 20px" @click.native="searchTask">
          Fill
        </el-button>

      </el-header>
      <el-container>

        <el-aside class="inner-aside">
          <el-row>
            <el-col>
              <span>ID:{{ taskInfo.id }}</span>
            </el-col>

          </el-row>

          <el-row>
            <el-col>
              <span>title:{{ taskInfo.title }}</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <span>填报简介:{{ taskInfo.instr }}</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col span="12">发布者:{{ taskInfo.userId }}</el-col>
            <el-col span="12">发布时间：{{ taskInfo.createTime }}</el-col>
          </el-row>

          <el-button type="primary" style="float: right;width: 100%;margin-top: 100px" @click.native="submitFillForm">
            提交
          </el-button>

        </el-aside>
        <el-main>
          <el-scrollbar class="container-scroll-bar" style="{height: 0}">
            <v-form-widget ref="formWidget" :designer="designer" :form-config="designer.formConfig">
            </v-form-widget>
          </el-scrollbar>
        </el-main>

      </el-container>

    </el-container>
  </div>
</template>

<script>
import {createDesigner} from "@/components/form-designer/designer";
import VFormWidget from "@/components/form-designer/form-widget";
import {queryTaskInfo} from "@/apis/taskAPI";
import {queryById} from "@/apis/formAPI";
import {dataFormat, deepClone} from "@/utils/util";
import {fillDone} from "@/apis/fillAPI";

export default {
  name: "formFill",
  components: {VFormWidget},
  comments: VFormWidget,
  data() {
    return {
      taskId: '',
      taskInfo: {
        id: '',
        createTime: '',
        userId: '',
        modelId: '',
        title: '',
        instr: ''
      },
      modelInfo: null,

      designer: createDesigner(this)
    }

  },

  methods: {

    async searchTask() {
      //  根据taskId获取TASK信息
      await this.getTaskInfo(this.taskId);
    },

    getTaskInfo(taskId) {
      let params = {
        id: taskId
      }
      queryTaskInfo(params).then(res => {
        this.taskInfo = res.result
        this.getModelInfo(this.taskInfo.modelId)
      }).catch(_ => {
        this.$message.error("任务不存在！")
      })
    },
    getModelInfo(modelId) {
      let params = {id: modelId}
      queryById(params).then(res => {
        this.modelInfo = res.result
        this.loadModel()
      }).catch(_ => {
      })
    },
    getAnnouncerInfo() {

    },

    loadModel() {
      let widgetList = JSON.parse(this.modelInfo.itemList)
      let formConfig = JSON.parse(this.modelInfo.formConfig)

      let model = {widgetList, formConfig}


      let modifiedFlag = false
      modifiedFlag = this.designer.loadFormJson(model)
      //为toolbar-panel添加createTaskButton
      if (modifiedFlag) {
        this.designer.emitHistoryChange()
      }
    },

    getFillData() {

      //获取到对象
      const listData = this.$refs.formWidget.widgetRefList
      //  获取原始表单对象
      let oriWidget = this.designer.widgetList
      let totalData = []
      for (let widgetIndex in oriWidget) {
        let widget = oriWidget[widgetIndex]
        let widgetCopy = deepClone(widget)

        //不同的组件取值方式可能略有不同！建议每个组件都使用同名provider方法向外提供数据
        let value = listData[widget.id].$refs["fieldEditor"].value
        let widgetData = {
          widgetCopy,
          value
        }
        //  注入到defaultValue中
        //   widget.options.defaultValue=value
        totalData.push(widgetData)
      }

      //  发送数据
      return totalData

    },
    submitFillForm() {
      if (this.taskId === '') {
        this.$message.error('请输入任务ID获取表单！')
        return;
      }
      let total = this.getFillData()

      //用户提交数据
      this.sendData(total)

    },

    sendData(totalData) {

      const params = {
        fillDate: dataFormat(new Date()),
        formData: JSON.stringify(totalData),
        id: '',
        taskId: this.taskId,
        userId: '120'
      }
      fillDone(params).then(res => {
        this.$message.success('填报完成')
        this.afterSend(res)
      }).catch(_ => {
      })
    },
    //数据发送后的处理
    afterSend() {
      // 清除task相关信息
      this.taskId = ''
      this.modelInfo = null
    }


  }
}
</script>

<style lang="scss" scoped>

.formFill {
  margin-top: 10px;
  margin-right: 10px;
}

.search {
  width: 200px;
}

.inner-header {
  position: relative;

  padding-left: 50px;
  padding-top: 13px;
  background-color: #8c99e0;
}

.inner-aside {
  padding-top: 20px;
  line-height: 40px;
}


</style>