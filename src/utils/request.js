/**
 *
 * @author VIVA LA VIDA
 * @date 1/8/2022 1:33 PM
 *
 * response状态码都是200，以code区分不同
 */
import axios from "axios";

//Vue对象,使用原型链
import Vue from "vue";
import message from "element-ui/packages/message";
import da from "element-ui/src/locale/lang/da";

//创建AXIOS实例，配置默认值
const service = axios.create({
    //api接口
    baseURL: "http://127.0.0.1:8088/jeecg-boot/geronimo",
    // baseURL: "http://localhost:8910/",
    //请求超时的默认值
    timeout: 20000,
})

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//环境切换
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = 'http://127.0.0.1:8088/jeecg-boot/geronimo';
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = 'https://www.ceshi.com';
// } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = 'https://www.production.com';
// }


// 设置请求拦截器
service.interceptors.request.use(
    // config=>{
    //     // 判断当前是否有TOKEN
    //     if (localStorage.getItem('token')) {
    //         config.headers.Authorization = localStorage.getItem('token')
    //     }
    //     return config
    // }，

    // 请求错误拦截，并返回错误信息。
    // error => {
    //     console.log("request ERROR!")
    //     return Promise.reject(error)
    // }
)

// 设置响应器
service.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        //后端POST-》200，get->0
        if (response.data.code === 200 || response.data.code === 0) {
            const res = response.data
            return Promise.resolve(res);
        } else {
            //将返回的reject返回给组件caught
            return codeHandler(response)
        }
    },
    // 服务器状态码不是2开头的的情况
    // 协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    //     error函数触发的原因：非2xx的status！
    error => {
        // console.error(error.response.data)
        if (error.response.status) {
            return errorHandler(error)
        }
    }
)

//code处理器,等同于error，但是基于code判断的
function codeHandler(error) {
    switch (error.data.code) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
            // router.replace({
            //     path: '/login',
            //     query: {
            //         redirect: router.currentRoute.fullPath
            //     }
            // });
            break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
            // Toast({
            //     message: '登录过期，请重新登录',
            //     duration: 1000,
            //     forbidClick: true
            // });
            // // 清除token
            // localStorage.removeItem('token');
            // store.commit('loginSuccess', null);
            // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            // setTimeout(() => {
            //     router.replace({
            //         path: '/login',
            //         query: {
            //             redirect: router.currentRoute.fullPath
            //         }
            //     });
            // }, 1000);
            break;
        // 404请求不存在
        case 404:
            Vue.prototype.$message({
                type: "error",
                message: '网络请求不存在',
                duration: 1500,
                forbidClick: true
            });
            break;
        // 其他错误，直接抛出错误提示
        default:
            Vue.prototype.$notify.error({
                title: "请求错误",
                type: "error",
                message: error.data.message
            });
    }
    // return null; 我们还是将错误相应返回便于，在VUE组件中进行针对性的caught!
    return Promise.reject(error.data)
}

//非2xx状态码的相应处理
function errorHandler(error) {
    switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
            // router.replace({
            //     path: '/login',
            //     query: {
            //         redirect: router.currentRoute.fullPath
            //     }
            // });
            break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
            // Toast({
            //     message: '登录过期，请重新登录',
            //     duration: 1000,
            //     forbidClick: true
            // });
            // // 清除token
            // localStorage.removeItem('token');
            // store.commit('loginSuccess', null);
            // // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            // setTimeout(() => {
            //     router.replace({
            //         path: '/login',
            //         query: {
            //             redirect: router.currentRoute.fullPath
            //         }
            //     });
            // }, 1000);
            break;
        // 404请求不存在
        case 404:
            Vue.prototype.$message({
                type: "error",
                message: '网络请求不存在',
                duration: 1500,
                forbidClick: true
            });
            break;
        // 其他错误，直接抛出错误提示
        default:
            Vue.prototype.$notify.error({
                title: "请求错误",
                type: "error",
                message: error.response.data.message
            });
    }
    return Promise.reject(error.response);
}


export {service as axios}




