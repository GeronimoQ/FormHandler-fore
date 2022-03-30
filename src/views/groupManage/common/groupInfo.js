// store模式---存储group的相关数据，数据只有刷新更新，不重复请求
export default function groupInfo(instance){

    return{
        groupListInfo: [
            {
                id: '123456',
                groupName: '测试',
                groupInstr: '测试用团体',
                createTime: '创建时间',
                partnerNum: '12',
                ownerId: '120'
            }
        ],


        //拿到groupListInfo即开始初始化
        groupPartnerListInfo:[
            {
                groupId:'',
                partnerList:null
            }
        ],

        groupTaskInfoList:[
            {
                groupId:'',
                taskListInfo:null
            }
        ]



    }
}
