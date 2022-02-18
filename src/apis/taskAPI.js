/**
 *
 * @author VIVA LA VIDA
 * @date 1/12/2022 3:11 PM
 *
 *
 */

import {get, post} from './methods'

const base = "/platTaskTest"

const taskAddAPI = {
    url: '/platTaskTest/add',
    method: 'POST',
}

const taskListQueryAPI = {
    url: base + '/queryListByUserId',
    method: 'GET'
}

const taskInfoQueryAPI = {
    url: base + '/queryById',
    method: 'GET'
}

const QRImageAPI={
    url: base + '/taskQR',
    method: 'GET'
}


const addTask = taskInfo => post(taskAddAPI, taskInfo)
const queryTaskList = userId => get(taskListQueryAPI, userId)
const queryTaskInfo = id => get(taskInfoQueryAPI,id)

export {
    addTask,
    queryTaskList,
    queryTaskInfo,QRImageAPI
}
