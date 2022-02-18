import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const homePage = () => import("@/layout");
const formCreator = () => import("@/components/form-designer")
const welcomePage = () => import("@/views/welcome")
const user = {login: ()=>import("@/views/user/login.vue"), register: () => import("@/views/user/register.vue")}
const taskManager = () => import("@/components/Geronimo/task-manager")
const formFill=()=>import("@/views/formFill")
const router = new Router({
    mode: 'history',
    routes: [
        // aboutForm()
        {
            path: "/",
            component: homePage,
            meta: {
                title: "about forms"
            },
            children: [
                {
                    path: "/",
                    component: welcomePage,
                    meta: {
                        title: "about forms"
                    },
                },
                {
                    path: "welcome",
                    name: "welcome",
                    meta: {
                        title: "欢迎页"
                    },
                    component: welcomePage
                },

                {
                    path:"/form",
                    name:"form",
                    meta:{
                        title:"表单"
                    },
                    component:formCreator
                },
                {
                    path:"/task",
                    name:"task",
                    meta:{
                        title:"任务"
                    },
                    component:taskManager
                },
                // {
                //     path: "manager",
                //     meta: {
                //         title: "管理"
                //     },
                //     children:[
                //         {
                //             path:"form",
                //             name:"form",
                //             meta:{
                //                 title:"表单"
                //             },
                //             component:formCreator
                //         },
                //         {
                //             path:"task",
                //             name:"task",
                //             meta:{
                //                 title: "任务"
                //             },
                //             component:taskManager
                //         }
                //     ]
                //
                // },
                {
                    path:"/formFill",
                    name:"formFill",
                    meta:{
                        title: "任务填报"
                    },
                    component:formFill
                }
            ]
        },
        // {
        //     path: "/user",
        //     component: user.login,
        //     children: [
        //         {
        //             path: "register",
        //             name: "register",
        //             component: user.register
        //         },
        //         {
        //             path: "login",
        //             name: "login",
        //         }
        //     ]
        // }
        {
            path: "/register",
            name: "register",
            component: user.register
        },
        {
            path: "/login",
            name: "login",
            component: user.login
        }
    ]
})



export default router
