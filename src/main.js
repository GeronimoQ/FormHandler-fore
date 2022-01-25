import 'babel-polyfill'
import './utils/debug-console'
import Vue from 'vue'
import axios from "axios";
import App from './App.vue'
import router from "@/router";
import ElementUI from 'element-ui'
import './utils/directive'
import './icons'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/iconfont/iconfont.css'

import {loadExtension} from '@/extension/extension-loader'

//引入jquery
import $ from "jquery"
Vue.prototype.$=$

//引入bootstrap
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

loadExtension()

Vue.use(ElementUI, { size: 'small' })

//原型链的更改
import {Message} from "element-ui"
import {Notification} from "element-ui"
Vue.prototype.$message=Message
Vue.prototype.$notify=Notification




if (typeof window !== 'undefined') {
  window.axios = axios

}

Vue.config.productionTip = false

new Vue({
  el: "#app",
  router,
  comments:{
    App
  },
  render: h => h(App),
})
