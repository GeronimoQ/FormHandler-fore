/**
 *
 * @author VIVA LA VIDA
 * @date 1/12/2022 3:11 PM
 *
 *
 */

import {get, post} from './methods'

const taskAddAPI = {
    url: '/platTaskTest/add',
    method: 'POST',
}


const addTask=taskInfo=> post(taskAddAPI,taskInfo)


export {
    addTask
}
