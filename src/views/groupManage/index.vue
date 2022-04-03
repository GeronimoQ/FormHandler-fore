<template>
  <div class="task-manager">
    <el-container class="con-wrapper">
      <transition name="asideShow" duration="{ enter: 1000, leave: 1000 }">
        <el-aside v-show="visiable.asidePanelShow">
          <div style="width: 100%;height: 60px;margin-bottom: 20px;padding: 5px 10px 5px 10px">
            <el-button id="add-group-btn" @click="addGroupBtn">添加团体</el-button>
          </div>
          <template v-for="(group,index) in groupInfo.groupListInfo">
            <transition name="fade" duration="{ enter: 500, leave: 1500 }">
              <el-card class="task-card"
                       :class="{'removed':!group,'checked-card':curGroupInfo===null?false:curGroupInfo.id===group.id}"
                       shadow="hover"
                       @click.native="loadGroupInfo(group,index)">
                <template slot="header">
                  <span style="display: block;width: 100%;font-size: 15px;font-weight: bold">{{
                      group.groupName
                    }}</span>
                  <span style="display: block;width:100%;text-align: right;padding-top:10px;font-size: 10px;">{{
                      group.id
                    }}</span>
                </template>
                <span>{{ group.groupInstr }}</span>
                <span style="float: right;margin-top: 30px;padding-bottom: 10px;font-size: 10px;color: #B3C0D1">{{
                    group.createTime
                  }}</span>
              </el-card>
            </transition>
          </template>
          <!--        </el-drawer>-->
        </el-aside>
      </transition>
      <el-container>
        <el-header>
          <div class="header">
            <el-switch v-model="witchView"
                       active-text="团体任务"
                       inactive-text="团体成员"
                       active-value="1"
                       inactive-value="0"
                       inactive-color="#13ce66"
                       @change="switchChange"
            >
            </el-switch>


          </div>
        </el-header>
        <el-main>

          <!--        保证组件复用，希望通过插槽选择不同的组件-->
          <template v-if="curGroupIndex!==null">
            <template v-if="views.groupPartnerView">
              <div class="FTable">

                <el-table
                    :data="groupInfo.groupPartnerListInfo[curGroupIndex].partnerList"
                    :row-class-name="tableRowClassName"
                    border
                    style="width: 100%">

                  <el-table-column
                      type="index"
                      label="序号"
                      width="50"
                  >
                    <!--      注意分页 *页面大小*-->
                    <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
                  </el-table-column>
                  <template v-for="(item,index) in table.partnerTableOps">

                    <el-table-column
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        show-overflow-tooltip>


                    </el-table-column>

                  </template>

                  <el-table-column
                      label="操作"
                      align="center">
                    <template slot-scope="scope">
                      <el-popconfirm
                          title="确定踢出该成员？"
                          confirm-button-text="踢出"
                          cancel-button-text='取消'
                          icon-color="red"
                          @confirm="kickoutBtn(scope.row)"
                      >
                        <el-button type="warning" size="mini" slot="reference" plain>踢出</el-button>
                      </el-popconfirm>

                      <el-button style="margin-left: 20px" type="info" size="mini" @click="fillHistoryBtn(scope.row)"
                                 plain>历史填报
                      </el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <!--                添加新成员，需要验证是否已经加入了tuanti-->
                <el-button style="width:100%;height: 40px;margin-top: 10px" @click="visiable.addPartnerDiaVB=true">+
                </el-button>
                <!--    <Pagination />-->
              </div>
            </template>
            <template v-else-if="views.groupTaskView">
              <!--            任务-->
              <!--            不要使用 !curGroupIndex -->
              <task-manager :inject-task-list="groupInfo.groupTaskInfoList[curGroupIndex].taskListInfo"></task-manager>
            </template>
          </template>

          <template v-else>
            <span>请先加载团体!</span>
          </template>


        </el-main>
      </el-container>

    </el-container>
    <!--    弹窗-->

    <el-dialog
        :visible.sync="visiable.addPartnerDiaVB"
        width="450px"
        destroy-on-close
        append-to-body
    >

      <!--      <el-switch active-text="添加个人" inactive-text="群组添加" :value="true">-->
      <!--        <el-option value="true">单人</el-option>-->
      <!--        -->
      <!--        <el-option value="false">多人</el-option>-->
      <!--      </el-switch>-->

      <label>成员学号</label>
      <!--      确定以/为分隔符号-->
      <el-input v-model="addPartnerUserId"></el-input>

      <template v-slot:footer>
        <el-button @click="addPartner">添加成员</el-button>
      </template>
    </el-dialog>

    <el-dialog
        :visible.sync="visiable.addDialogVB"
        width="450px"
        destroy-on-close
        append-to-body
    >
      <template v-slot:title>
        新建团体
      </template>
      <el-form :model="newGroupInfo">
        <el-form-item label="团体名" prop="groupName">
          <el-input v-model="newGroupInfo.groupName"></el-input>
        </el-form-item>

        <el-form-item label="团体简介" prop="groupInstr">
          <el-input v-model="newGroupInfo.groupInstr"></el-input>
        </el-form-item>

      </el-form>
      <template v-slot:footer>
        <div style="width: 100%;text-align: center">
          <el-button style="width: 60%;height: 40px;font-size: 16px;letter-spacing: 3px" @click="addGroup">新建团体
          </el-button>
        </div>

      </template>
    </el-dialog>
  </div>
</template>

<script>


import groupInfo from "@/views/groupManage/common/groupInfo";
import TaskManager from "@/components/Geronimo/task-manager";
import {addGroup, listGroup} from "@/apis/groupAPI";
import {addGroupForUser, groupOption, listGroupPartner} from "@/apis/userAPI"
import {queryTaskList} from "@/apis/taskAPI";
import message from "element-ui/packages/message";


export default {
  name: "groupManage",
  components: {TaskManager},
  data() {
    return {
      groupInfo: groupInfo(this),
      curGroupInfo: null,
      curGroupIndex: null,
      addPartnerUserId: '',
      newGroupInfo: {
        groupName: '',
        groupInstr: ''
      },
      views: {
        groupTaskView: false,
        groupPartnerView: true
      },
      visiable: {
        groupListDrawerVB: true,
        asidePanelShow: true,
        addDialogVB: false,
        addPartnerDiaVB: false
      },
      witchView: 0,
      table: {
        partnerTableOps: [
          {
            label: '用户ID',
            prop: 'userId',
          },
          {
            label: '用户名',
            prop: 'userName'
          },
          // {
          //   label: '是否加入',
          //   prop: 'joined'
          // },
        ]
      }
    };
  },

  methods: {
    async loadGroupList() {
      let params = {
        userId: this.$store.state.userInfo.id
      }
      await listGroup(params).then(res => {
        this.groupInfo.groupListInfo = res.result;
        this.initGroupInfo(res.result)
      }).catch()
    },
    async loadGroupInfo(group, index) {
      // this.witchView = 0
      this.curGroupInfo = group
      this.curGroupIndex = index

      //API
      this.loadPartnerInfo();
    },
    initGroupInfo(groupListInfo) {
      for (let index in groupListInfo) {
        let group = groupListInfo[index]
        let oneTask = {
          groupId: group.id,
          taskListInfo: []
        }
        let onePartnerList = {
          groupId: group.id,
          partnerList: []
        }
        this.groupInfo.groupTaskInfoList.push(JSON.parse(JSON.stringify(oneTask)))
        this.groupInfo.groupPartnerListInfo.push(JSON.parse(JSON.stringify(onePartnerList)))
      }
    },
    /**
     * 是否已经入团
     * @param row
     * @param rowIndex
     * @returns {string}
     */
    tableRowClassName({row, rowIndex}) {
      if (row.joined) {
        return 'success-row';
      } else {
        return 'warning-row';
      }
    },

    /**
     * 提出群体Btn
     * @param user
     */
    kickoutBtn(user) {


      let params = {
        groupId: this.curGroupInfo.id,
        id: user.id,
        joined: false,
        //0：踢出 1：邀请；2：接受
        opType: 0,
        userId: user.userId,
        userName: ""
      }
      groupOption(params).then(res => {
        this.$message.success(res.result);
        this.loadPartnerInfo()
      }).catch()
    },
    /**
     * 团体成员对本团体任务的填报历史
     * @param user
     */
    fillHistoryBtn(user) {

    },
    /**
     * 向当前团体添加新成员 后端检查成员是否已经加入了团体
     */
    async addPartner() {

      // 对输入数据格式化为数组一个一个添加，返回失败的数组
      let userIds = this.addPartnerUserId;
      let userIdList = userIds.split(",");
      let failUserAddId=[]
      if (
          userIdList.length >= 1
      ) {
        for (var idInd=0; idInd <userIdList.length;idInd++) {
          let id=userIdList[idInd];
          let params = {
            groupId: this.curGroupInfo.id,
            id: "",
            joined: true,
            password: "",
            userId: id,
            userName: ""
          }
          await addGroupForUser(params).then(res => {
            this.$message.success(res.result);
            this.addPartnerUserId = '';
            this.visiable.addPartnerDiaVB = false;
            this.loadPartnerInfo()
            close();
          }).catch(_=>{
            failUserAddId.push(id)
          })
        }else{

        }


      }


      //
      // let params = {
      //   groupId: this.curGroupInfo.id,
      //   id: "",
      //   joined: true,
      //   password: "",
      //   userId: this.addPartnerUserId,
      //   userName: ""
      // }
      // await addGroupForUser(params).then(res => {
      //   this.$message.success(res.result);
      //   this.addPartnerUserId = '';
      //   this.visiable.addPartnerDiaVB = false;
      //   this.loadPartnerInfo()
      //   close();
      // }).catch()
    },


    /**
     *
     * @param viewId
     * @returns {Promise<void>}
     */
    // async switchAddPartnerChange(viewId){
    //   switch (viewId){
    //
    //   }
    // },
    /**
     * 选择侧栏视图
     * @param viewId
     * @returns {Promise<void>}
     */
    async switchChange(viewId) {
      if (!await this.check()) {
        return;
      }

      if (viewId === 1) {
        if (this.groupInfo.groupPartnerListInfo[this.curGroupIndex].partnerList === null) {
          await this.loadPartnerInfo();
        }
        //  团体任务视图
        this.views.groupTaskView = this.views.groupPartnerView;
        this.views.groupPartnerView = !this.views.groupPartnerView;
        //展开aside
        this.visiable.asidePanelShow = !this.visiable.asidePanelShow
        //  请求团体成员

      } else {
        if (this.groupInfo.groupTaskInfoList[this.curGroupIndex].taskListInfo === null) {
          await this.loadTaskInfo();
        }
        //团体视图
        this.views.groupPartnerView = this.views.groupTaskView;
        this.views.groupTaskView = !this.views.groupTaskView;
        //关闭aside
        this.visiable.asidePanelShow = !this.visiable.asidePanelShow
        //  请求任务
      }
    },


    /**
     * 加载当前团体的成员API
     */
    async loadPartnerInfo() {
      let params = {
        groupId: this.curGroupInfo.id
      }
      await listGroupPartner(params).then(res => {
        this.groupInfo.groupPartnerListInfo[this.curGroupIndex].partnerList = res.result
      }).catch()

    },
    /**
     * 加载当前团体的任务列表API
     */
    async loadTaskInfo() {
      let params = {
        userId: this.curGroupInfo.id
      }
      await queryTaskList(params).then(res => {
            this.groupInfo.groupTaskInfoList[this.curGroupIndex].taskListInfo = res.result
          }
      ).catch()
    },

    /**
     * 添加团体按钮点击回调
     */
    addGroupBtn() {
      this.visiable.addDialogVB = true
    },

    /**
     * 添加团体API
     */
    addGroup() {
      if (!this.newGroupInfo.groupName.trim() || !this.newGroupInfo.groupInstr.trim()) {
        this.$message.warning("表项不可为空");
      } else {
        let params = {
          groupInstr: this.newGroupInfo.groupInstr,
          groupName: this.newGroupInfo.groupName,
          id: "",
          owner: this.$store.state.userInfo.id
        }
        addGroup(params).then(res => {
          this.$message.success("团体添加成功");
          //  重新加载团体列表
          this.loadGroupList();
          this.visiable.addDialogVB = false
        }).catch()
      }
    },

    /**
     * 检查
     * @returns {boolean}
     */
    check() {
      if (this.curGroupInfo == null) {
        this.$message.warning("请先点击加载团体信息！")
        this.witchView = 0
        return false
      }
      return true
    },
  },
  created() {
    this.loadGroupList();
  }

}
</script>

<style lang="scss">
.con-wrapper {
  height: 100%;
  padding-top: 20px;
}

.el-card.task-card {
  width: 90%;
  margin-bottom: 20px;
  border-radius: 20px;
  background-color: #d0dfe6;
}

.el-card.task-card:hover {
  //background: olive linear-gradient(to left, rgba(255, 255, 255, 255), rgba(87, 195, 194, 255));
  margin-left: 20px;
}

.checked-card {
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
  //height: 10px;
  //width: 5px;
  //background-color: #E9CCD3 ;
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
