/**
 *
 * @author VIVA LA VIDA
 * @date 1/7/2022 5:14 PM
 *
 *
 */
import {get,post} from "./methods"


//apis need
import {hello} from "@/apis/apis";


/**
 * 欢迎页请求API
 * @param req 若有请求数据则添加
 * @returns {Promise<unknown>}
 */
const welcome =req=>get(hello,req)


export {
    welcome
}

