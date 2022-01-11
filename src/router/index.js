import Vue from 'vue'
import Router from 'vue-router'
import formList from "@/components/form-list/form-list";

Vue.use(Router)


const homePage = () => import("@/layout");
const formCreator = () => import("@/components/form-designer")
const welcomePage = () => import("@/views/welcome")

const router = new Router({
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
                    path: "/form/list",
                    meta: {
                        title: "模板列表"
                    },
                    component: formList
                },
            ]
        },


    ]
})

export default router
