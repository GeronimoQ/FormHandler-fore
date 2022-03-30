<template>
  <div class="formFill">
    <el-container>
      <el-container>
        <el-aside class="inner-aside">
          <el-row style="padding-left: 20px;margin-bottom: 20px">
            <el-input class="search" v-model="taskId"></el-input>
            <el-button style="margin-left: 20px" @click.native="searchTask">
              Fill
            </el-button>
          </el-row>
          <transition name="asideShow" duration="{ enter: 1000, leave: 1000 }">
            <div v-show="visible.groupListAsideVB">
              <el-button v-show="curTaskInfo!==null" type="primary" style="float: right;font-size: 16px;width: 100%;margin-bottom: 20px" @click.native="submitFillForm_groupTask">
                提交
              </el-button>
              <template v-for="(task,index) in taskList">
                <transition name="fade" duration="{ enter: 500, leave: 1500 }">
                  <el-card class="task-card"
                           :class="{'checked-card':curTaskInfo===null?false:curTaskInfo.id===task.id}"
                           shadow="hover"
                           @click.native="getModelInfoFromTaskList(task,index)">
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
                    <span style="float: right;margin-top: 30px;padding-bottom: 10px;font-size: 10px;color: #B3C0D1">{{
                        task.createTime
                      }}</span>
                  </el-card>
                </transition>
              </template>
            </div>
          </transition>

          <transition name="asideShow" duration="{ enter: 1000, leave: 1000 }">
            <div v-show="visible.searchAsideVB">
              <el-row>
                <el-col>
                  <span>ID: {{ taskInfo.id }}</span>
                </el-col>

              </el-row>

              <el-row>
                <el-col>

                  <span>标题: {{ taskInfo.title }}</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col>
                  <span>填报简介: {{ taskInfo.instr }}</span>
                </el-col>
              </el-row>

<!--              <el-row>-->
<!--                <el-col span="12">发布者:{{ taskInfo.userId }}</el-col>-->
<!--                <el-col span="12">发布时间：{{ taskInfo.createTime }}</el-col>-->
<!--              </el-row>-->
              <el-button type="primary" style="float: right;width: 100%;margin-top: 100px;font-size: 16px" @click.native="submitFillForm">
                提交
              </el-button>

              <el-button type="text" style="float: bottom;width: 100%;font-size: 16px;margin-top: 20px;" @click="changeView(0)">
                团 体 任 务
              </el-button>
            </div>
          </transition>
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
import {getGroupTaskList, queryTaskInfo, queryTaskList} from "@/apis/taskAPI";
import {queryById} from "@/apis/formAPI";
import {dataFormat, deepClone} from "@/utils/util";
import {fillDone} from "@/apis/fillAPI";

export default {
  name: "formFill",
  components: {VFormWidget},
  comments: VFormWidget,
  data() {
    return {
      taskId: null,
      taskInfo: {
        id: '',
        createTime: '',
        userId: '',
        modelId: '',
        title: '',
        instr: ''
      },
      modelInfo: null,
      designer: createDesigner(this),
      visible: {
        searchAsideVB: false,
        groupListAsideVB: true,
      },
      curTaskInfo: null,
      taskList: []
    }

  },

  methods: {
    changeView(viewId){
      switch (viewId){
        case 0:{
          this.visible.searchAsideVB=false
          setTimeout(_=>{
            this.visible.groupListAsideVB=true
          },500)
          break;
        }
          case 1:{
            this.visible.groupListAsideVB=false
            setTimeout(_=>{
              this.visible.searchAsideVB=true
            },500)
            break;
          }
            default:
      }
    },

    async searchTask() {
      //  根据taskId获取TASK信息.
      await this.getTaskInfo(this.taskId);
    },

    getTaskInfo(taskId) {
      if (!taskId.trim()) {
        this.$message.warning("任务ID未填写!")
        return
      }
      this.changeView(1)
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
    getModelInfoFromTaskList(task, index) {
      let params = {id: task.modelId}
      this.curTaskInfo=task;
      queryById(params).then(res => {
        this.modelInfo = res.result
        this.loadModel()
      }).catch(_ => {
      })
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
      this.sendData(total,this.taskId)
      this.changeView(0)
    },

    submitFillForm_groupTask() {
      let total = this.getFillData()
      //用户提交数据
      this.sendData(total,this.curTaskInfo.id)

    },

    async sendData(totalData,taskId) {
      const params = {
        fillDate: dataFormat(new Date()),
        formData: JSON.stringify(totalData),
        id: '',
        taskId: taskId,
        userId: this.$store.state.userInfo.id
      }
      await fillDone(params).then(res => {
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
      this.curTaskInfo=null;
    },
    //加载任务列表
    loadTaskList() {
      let params = {
        groupId: this.$store.state.userInfo.group.id
      }
      const response = getGroupTaskList(params)
      response.then(res => {
        this.taskList = res.result
      }).catch(_ => {

      })
    },
  },
  created() {
    this.designer.clearDesigner()
    this.loadTaskList()
  }
}
</script>

<style lang="scss">

.formFill {
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
  //background:olive linear-gradient(to left, rgba(255, 255, 255, 255), rgba(87, 195, 194, 255));
  margin-left: 20px;
}

.checked-card {
  margin-left: 20px;
}

.header {
  border-left: #eef7f2 3px solid;
  //border-right:#3f4d67 1 px solid;
  padding: 20px 0px 0px 30px;
  height: 60px;
  vertical-align: middle;
}

.head-but {
  float: right;
  margin-right: 20px;
}

.head-but-icon {
  float: right;
}

.el-image {
  width: 80%;

}

.el-dialog {
  border-radius: 10px;
}

.disabled {
  // background:olive linear-gradient(to left, rgba(255, 255, 255, 255), rgba(240, 124, 130, 155));
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


.asideShow-enter-active {
  transition: all 1s ease;
}

.asideShow-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.asideShow-enter, .asideShow-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(-60px);
  transition-duration: 0.5s;
  opacity: 0;
}

#disabledTag {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background-color: #E9CCD3;
}

#disabledTag_line {
  /// / height:10 px;
  /// / width:5 px;
  /// / background-color:#E9CCD3;
}

#add-group-btn {
  width: 100%;
  height: 100%;
  letter-spacing: 4px;
  font-size: 15px;
  border-radius: 18px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

</style>
