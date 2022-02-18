/**
 *
 * @author VIVA LA VIDA
 * @date 2/13/2022 5:20 PM
 *
 *
 */

import {get, post} from './methods'

const base = "/platFillTest"

const add = {
    url: base + '/add',
    method: 'POST'
}

const list = {
    url: base + '/list',
    method: 'GET'
}


// 任务填报
const fillDone = fillData => post(add, fillData)
const pageDone = listData => get(list,listData)

//分页数据格式
// {
//     "records": [
//
// ],
//     "total": 1,
//     "size": 10,
//     "current": 1,
//     "orders": [],
//     "optimizeCountSql": true,
//     "searchCount": true,
//     "countId": null,
//     "maxLimit": null,
//     "pages": 1
// }
export {
    fillDone,
    pageDone
}

