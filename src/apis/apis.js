/**
 *
 * @author VIVA LA VIDA
 * @date 1/7/2022 7:05 PM
 *
 *各种请求的数据要求，对应swagger
 * 要传入数据时候，获取到对象后更改params值即可！
 * method只起到提示方法的作用
 */

/**
 * 欢迎页请求API
 * @type {{method: string, url: string}}
 */
const hello = {
    url: "/hello",
    method: "GET",
}

const addFormModel = {
    url:"/platFormmodelTest/add",
    method: "POST",
//    data:   请求体使用data放入数据，只适用于PUT,POST,DELETE..
// {
//     "createTime": "",
//     "formConfig": "",
//     "formInstr": "",
//     "id": "",
//     "itemList": "",
//     "userId": ""
// }
}

const getFormList={
    url:"/platFormmodelTest/list",
    method: "GET",
}

//表格处理相关API


export {
    hello,
    addFormModel,
    getFormList
}