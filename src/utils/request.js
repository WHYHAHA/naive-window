import axios from "axios"
import storage from 'store'
import router from '../router'
import { VueAxios } from './axios'
import qs from "qs"

import app from '../main'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    // 状态码
    switch (error.response.status) {
      case 404:
        window.$message.error('客户端请求错误!')
        break
      case 400:
        window.$message.error('客户端请求有语法错误，不能被服务器所理解!')
        break
      case 403:
        window.$message.error({ message: '权限不足,请联系管理员!' })
        break
      case 500:
        window.$message.error('服务器发生不可预期的错误!')
        break
      default:
        window.$message.error('未知错误!')
    }
  } else if (String(error).includes('timeout')) {
    window.$message.error('接口请求超时，请联系管理员或稍后再试')

  }
  storage.remove('access_token')
  router.push('/500')
  return Promise.reject(error)
}

// request interceptor 请求监听
request.interceptors.request.use(config => {
  const token = storage.get('access_token')
  const language = storage.get('language')
  //设置post默认 Content-Type  
  // 除登录接口及导出 其余post接口都为 'application/json;charset=UTF-8'
  if (config.method == 'post' && config.url != '/ms-sso-auth-server/oauth/token') {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  if (language) {
    // Accept-Language
    config.headers['Accept-Language'] = language
  }

  config.headers['platform'] = '2'

  if (config.method === 'get') {
    //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, errorHandler)

// request interceptor 返回监听
request.interceptors.response.use((response) => {
  const isPord = process.env.NODE_ENV === "prod" || process.env.NODE_ENV == "uat"

  //公共接口 500后将会清除token
  const publicApis = ['/ms-sso-auth-server/oauth/token', '/ms-sso-auth-server/oauth/removeToken', '/ms-tenant-consummer/user/{version}/getUserInfo', '/ms-tenant-consummer/app/{version}/getAppListByUser', '/ms-tenant-consummer/permission/{version}/getMenuList']


  let responseState = 'error'
  switch (response.data.code) {
    case 0:
      responseState = 'ok'
      break

    case 1:
      // 逻辑错误 (接口校验等)
      window.$message.error(response.data.msg, { duration: 5000 })
      // 也返回数据 可自定义  逻辑错误时业务逻辑
      responseState = 'ok'
      break

    case 500:
      // 业务层500
      window.$message.destroyAll()
      window.$message.error(response.data.msg, { duration: 5000 })

      if (publicApis.includes(response.config.url)) {
        // 清除token 跳转500
        storage.remove('access_token')
        router.push('/500')
      } else {
        // wiondows内跳转500 
        // eslint-disable-next-line vue/custom-event-name-casing
        app.config.globalProperties.$observer.$emit('GOERRORPAGE', 'asd')
      }

      // 此处返回为了 部分弹框正确关闭 包括导入、导出
      responseState = 'ok'

      break

    case 1001:
      // 异地登出逻辑
      window.$message.destroyAll()
      window.$message.error('异地登录，已登出!', { duration: 5000 })
      storage.remove('access_token')
      router.push('/')
      break
    case 1002:
      // 超时登出逻辑
      window.$message.destroyAll()
      window.$message.error('登录超时，已登出!', { duration: 5000 })
      storage.remove('access_token')
      router.push('/')
      break

    default:
      window.$message.error(response.data.msg, { duration: 5000 })
      break
  }

  if (responseState == 'ok') {
    // 正常返回
    return response.data
  }

  // 服务层错误
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
