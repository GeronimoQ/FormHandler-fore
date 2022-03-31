/**
 *
 * @author VIVA LA VIDA
 * @date 1/12/2022 3:11 PM
 *
 *
 */

import {get, post, put, delete_} from './methods'

const base = "/platTaskTest"

const taskAddAPI = {
    url: '/platTaskTest/add',
    method: 'POST',
}

const addGroupTaskAPI={
    url:base+"/addGroupTask",
    method:'POST'
}

const taskListQueryAPI = {
    url: base + '/queryListByUserId',
    method: 'GET'
}

const taskInfoQueryAPI = {
    url: base + '/queryById',
    method: 'GET'
}

const QRImageAPI = {
    url: base + '/taskQR',
    method: 'GET'
}

const downloadQRAPI = {
    url: base + '/downloadTaskQR',
    method: 'GET'
}

const editTaskAPI = {
    url: base + '/editState',
    method: 'PUT'
}

const deleteTaskAPI = {
    url: base + '/delete',
    method: 'DELETE'
}
//getGroupTaskList

const getGroupTaskListAPI = {
    url: base + '/getGroupTaskList',
    method: 'GET',
    param:{
        groupId:''
    }
}


const addTask = taskInfo => post(taskAddAPI, taskInfo)
const queryTaskList = userId => get(taskListQueryAPI, userId)
const queryTaskInfo = id => get(taskInfoQueryAPI, id)
const QRdownload = taskId => get(downloadQRAPI, taskId)
const editTask = params => put(editTaskAPI, params)
const deleteTask = taskId => delete_(deleteTaskAPI, taskId)
const getGroupTaskList=groupId=>get(getGroupTaskListAPI,groupId)
const addGroupTask=groupTaskInfo=>post(addGroupTaskAPI,groupTaskInfo)


export {
    addTask,
    queryTaskList,
    queryTaskInfo, QRImageAPI, downloadQRAPI, editTask, deleteTask,getGroupTaskList,addGroupTask
}
