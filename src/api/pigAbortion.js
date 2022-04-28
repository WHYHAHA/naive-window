// 流产  相关APi
import request from '../utils/request'

const pigBreeding = {
    // get接口
    getPigAbortionRegister: '/ms-masterdata-consummer/pmPigAbortionRegister/{version}/getPigAbortionRegister',
    // post接口
    addPigAbortionRegister: '/ms-masterdata-consummer/pmPigAbortionRegister/{version}/addPigAbortionRegister',
    deletePigAbortionRegister:'/ms-masterdata-consummer/pmPigAbortionRegister/{version}/deletePigAbortionRegister'
}

// 流产列表
export function getPigAbortionRegisterApi(parameter) {
    return request({
        url: pigBreeding.getPigAbortionRegister,
        method: 'get',
        params: parameter
    })
}

// 流产登记
export function addPigAbortionRegisterApi(data) {
    return request({
        url: pigBreeding.addPigAbortionRegister,
        method: 'post',
        data: data
    })
}

// 流产删除
export function deletePigAbortionRegisterApi(data) {
    return request({
        url: pigBreeding.deletePigAbortionRegister,
        method: 'post',
        data: data
    })
}

