import {get, post, delete_, put} from "./methods"

const table="/platFormGroup"
const addGroupAPI={
    url:table+"/add",
    method:'POST',
    param:{
        "groupInstr": "",
        "groupName": "",
        "id": "",
        "owner": ""
    }
}

const listGroupAPI={
    url:table+"/listOwnerGroups",
    method: 'GET',
    param: {
        userId:''
    }
}



const addGroup=groupInfo=>post(addGroupAPI,groupInfo)
const listGroup=userId=>get(listGroupAPI,userId)

export {
    addGroup,listGroup
}
