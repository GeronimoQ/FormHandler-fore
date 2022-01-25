/**
 *
 * @author VIVA LA VIDA
 * @date 1/8/2022 10:47 AM
 *
 *
 */

import {get, post} from "./methods"
import {addFormModel, getFormList} from "@/apis/apis";
//query Model List By userId
const queryModelListAPI={
    url:"/platFormmodelTest/queryListByUserId",
    method:"GET",
    // params:"userId",
}

const queryModelList=(userId) =>get(queryModelListAPI,userId);

function sendFormModel(formModel) {
    return post(addFormModel, formModel)
}

function queryFormList(userId) {
    return get(getFormList, userId)
}





export {
    sendFormModel,
    queryFormList,
    queryModelList
}