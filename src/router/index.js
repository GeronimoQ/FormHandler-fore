import Vue from 'vue'
import Router from 'vue-router'
import doorLayout from "@/layout/doorLayout";
import login from "@/views/user/login";
import register from "@/views/user/register";
import groupManage from "@/views/groupManage"
Vue.use(Router)


const homePage = () => import("@/layout");
const formCreator = () => import("@/components/form-designer")
const welcomePage = () => import("@/views/welcome")
const user = {login: () => import("@/views/user/login.vue"), register: () => import("@/views/user/register.vue"),userPanel:()=>import("@/views/user/index.vue")}
const taskManager = () => import("@/components/Geronimo/task-manager")
const formFill = () => import("@/views/formFill")
const router = new Router({
    mode: 'history',
    routes: [

        {
            path: "/",
            component: doorLayout,
            meta: {
                title: "door"
            },
            children: [
                {
                    path: "/",
                    component: login,
                    meta: {
                        title: "login"
                    },
                },
                {
                    path: "/login",
                    component: login,
                    meta: {
                        title: "login"
                    },
                }, {
                    path: "/register",
                    component: register,
                    meta: {
                        title: "register"
                    },
                },
            ]
        },
        {
            path: "/helloWorld",
            component: homePage,
            meta: {
                title: "about forms"
            },
            children: [
                {
                    path: "/helloWorld",
                    component: welcomePage,
                    meta: {
                        title: "about forms"
                    },
                },
                {
                    path: "/user",
                    component:user.userPanel,
                    meta: {
                        title: "about user"
                    },
                },
                {
                    path: "/welcome",
                    name: "welcome",
                    meta: {
                        title: "欢迎页"
                    },
                    component: welcomePage
                },
                {
                    path: "/group",
                    name:"group",
                    meta:{
                      title: "group manage"
                    },
                    component: groupManage
                },

                {
                    path: "/form",
                    name: "form",
                    meta: {
                        title: "表单"
                    },
                    component: formCreator
                },
                {
                    path: "/task",
                    name: "task",
                    meta: {
                        title: "任务"
                    },
                    component: taskManager
                },
                {
                    path: "/formFill",
                    name: "formFill",
                    meta: {
                        title: "任务填报"
                    },
                    component: formFill
                }
            ]
        },
        // aboutForm()
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
