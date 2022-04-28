import request from '../utils/request'
import qs from "qs";

const userApi = {
  Login: '/ms-sso-auth-server/oauth/token',
  loginOut: '/ms-sso-auth-server/oauth/removeToken',
  userInfo: '/ms-tenant-consummer/user/{version}/getUserInfo',
  application: '/ms-tenant-consummer/app/{version}/getAppListByUser',
  AppMenu: '/ms-tenant-consummer/permission/{version}/getMenuList'
}

/**
 *  用户登录
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function userlogin(data) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: qs.stringify(data),
    contentType: 'application/x-www-form-urlencoded'
  })
}

// export function userlogin(parameter) {
//   return request({
//     url: userApi.Login,
//     method: 'post',
//     params: parameter
//   })
// }
/**
 *  用户退登
 * parameter: {
 * }
 * @param parameter
 * @returns {*}
 */
export function userloginOutApi(data) {
  return request({
    url: userApi.loginOut,
    method: 'delete',
    data: data
  })
}


// 用户信息
export function getUserInfo(parameter) {
  return request({
    url: userApi.userInfo,
    method: 'get',
    params: parameter
  })
}

/**
 *  获取用户app
 * parameter: {
 *     rid: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function getApplication(parameter) {
  return request({
    url: userApi.application,
    method: 'get',
    params: parameter
  })
}

/**
 *  获取app对应Menu
 * parameter: {
 *     rid: '',
 * }
 * @param parameter
 * @returns {*}
 */
export function GetAppMenuAPi(parameter) {
  return request({
    url: userApi.AppMenu,
    method: 'get',
    params: parameter
  })
}