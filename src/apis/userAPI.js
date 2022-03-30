/**
 *
 * @author VIVA LA VIDA
 * @date 1/23/2022 5:57 PM
 *
 *
 */
import {get, post, put} from './methods'
import groupInfo from "@/views/groupManage/common/groupInfo";

const table="/platFormUser";

const registerAPI = {
    url: table+'/add',
    method: 'POST',
    params:{
        "groupId": "",
        "id": "",
        "joined": true,
        "password": "",
        "userId": "",
        "userName": ""
    }
}

const loginAPI = {
    url: table+"/login",
    method: "POST",
    params:{
        "groupId": "",
        "id": "",
        "joined": true,
        "password": "",
        "userId": "",
        "userName": ""
    }
}
const addGroupForUserAPI={
    url:table+"/addGroup",
    method: 'PUT',
    param: {
        "groupId": "",
        "id": "",
        "joined": true,
        "password": "",
        "userId": "",
        "userName": ""
    }
}
///listGroupUser
const listGroupUserAPI={
    url:table+"/listGroupUser",
    method: 'GET',
    param: {
        "groupId": "",
    }
}
//
const userGroupOpAPI={
    url:table+"/groupOption",
    method: 'PUT',
    param: {
        "groupId": "",
        "id": "",
        "joined": true,
        //0：踢出 1：邀请；2：接受;3，申请退出
        "opType": 0,
        "userId": "",
        "userName": ""
    }
//
}
const register = (userInfo) => post(registerAPI, userInfo);
const login = (loginInfo) => post(loginAPI, loginInfo);
const addGroupForUser=userInfo=>put(addGroupForUserAPI,userInfo)
const listGroupPartner=groupId=>get(listGroupUserAPI,groupId)
const groupOption=optionInfo=>put(userGroupOpAPI,optionInfo)
export {
    register,
    login,addGroupForUser,listGroupPartner,groupOption
}

