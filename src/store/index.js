// 初始化一个vuex的实例（数据仓库） 导出即可
import Vuex from 'vuex'
import Vue from 'vue'

// 使用安装
Vue.use(Vuex)

const defaultUserInfo = {
    group: {
        id: '',
        groupName: 'BLUE WORLD',
        groupInstr: 'BLUE WORLD',
        owner: ''
    },
    id: "",
    joined: false,
    userId: "",
    userName: "Geronimo",
}
// 初始化
const store = new Vuex.Store({
    // 配置（state|mutations|actions）
    state: {
        userInfo: defaultUserInfo,
    },
    // mutations是固定的，用于定义修改数据的动作（函数）
    mutations: {
        // 定义一个mutation，用于累加count值
        // increment这个名字是自定义的
        login(state, userInfo) {
            // state表示Store中所有数据
            // payload表示组件中传递过来的数据
            state.userInfo = userInfo
        },
        logout(state, noUsable) {
            state.userInfo=defaultUserInfo
        },
        joinGroup(state, noUsable){
            state.userInfo.joined=true
        },
        outGroup(state, noUsable){
            state.userInfo.joined=false
        }
    }
})

export default store
