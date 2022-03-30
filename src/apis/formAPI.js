/**
 *
 * @author VIVA LA VIDA
 * @date 1/8/2022 10:47 AM
 *
 *
 */

import {get, post,delete_} from "./methods"
import {addFormModel, getFormList} from "@/apis/apis";

const base = "/platFormmodelTest"

//query Model List By userId
const queryModelListAPI = {
    url: "/platFormmodelTest/queryListByUserId",
    method: "GET",
    // params:"userId",
}
const queryByIdAPI = {
    url: base + "/queryById",
    method: "GET"
}

const deleteModelAPI={
    url:base+'/delete',
    method:'DELETE'
}

const queryModelList = (userId) => get(queryModelListAPI, userId);
const queryById = id => get(queryByIdAPI, id);
const deleteModel=id=>delete_(deleteModelAPI,id)


function sendFormModel(formModel) {
    return post(addFormModel, formModel)
}

function queryFormList(userId) {
    return get(getFormList, userId)
}


export {
    sendFormModel,
    queryFormList,
    queryModelList,
    queryById,
    deleteModel
}
