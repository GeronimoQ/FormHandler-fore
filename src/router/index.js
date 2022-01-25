import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const homePage = () => import("@/layout");
const formCreator = () => import("@/components/form-designer")
const welcomePage = () => import("@/views/welcome")
const user = {login: ()=>import("@/views/user/login.vue"), register: () => import("@/views/user/register.vue")}
const taskManager = () => import("@/components/Geronimo/task-manager")

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
                    path: "welcome",
                    name: "welcome",
                    meta: {
                        title: "欢迎页"
                    },
                    component: welcomePage
                }, {
                    path: "/form/creator",
                    meta: {
                        title: "模板组件"
                    },
                    component: formCreator
                },
                {
                    path:"/task",
                    name:"task",
                    component:taskManager
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
