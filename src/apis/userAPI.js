/**
 *
 * @author VIVA LA VIDA
 * @date 1/23/2022 5:57 PM
 *
 *
 */
import {get, post} from './methods'

const registerAPI = {
    url: '/register',
    method: 'POST',
}

const loginAPI = {
    url: "/login",
    method: "POST",
}

const register = (userInfo) => post(registerAPI, userInfo);
const login = (loginInfo) => post(loginAPI, loginInfo);


export {
    register,
    login
}

