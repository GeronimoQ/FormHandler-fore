import {axios} from "@/utils/request.js"

/**
 *
 * @author VIVA LA VIDA
 * @date 1/7/2022 7:00 PM
 *
 *
 */

//封装Get POST
function get(config,req) {
    //对请求的特殊处理

    return axios({
        url:config.url,
        method: config.method,
        params:req
    })
}

function post(config,req) {
    return   axios({
        url:config.url,
        method: config.method,
        data:req,
    })
}


function formPost(config,req){
    axios()
}

export {get, post}