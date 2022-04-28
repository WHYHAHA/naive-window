// 医疗-挂号  相关APi
import request from '../utils/request'

const pigRegistration = {
    // get接口
    getPigRegistrationList: '/ms-masterdata-consummer/pigRegister/{version}/getPigRegister',
    getEditinfo:'/ms-masterdata-consummer/fileUploads/{version}/getFileUploadsByPictureCode',
    // post接口
    addPigRegistration: '/ms-masterdata-consummer/pigRegister/{version}/createPigRegister',
    updatePigRegistration: '/ms-masterdata-consummer/pigRegister/{version}/updatePigRegister',
    deletePigRegister:'/ms-masterdata-consummer/pigRegister/{version}/deletePigRegister',
    pigSimpleMedicalProcess:'/ms-masterdata-consummer/pigRegister/{version}/pigSimpleMedicalProcess'
}


// 挂号列表
export function getPigRegistrationListApi(parameter) {
    return request({
        url: pigRegistration.getPigRegistrationList,
        method: 'get',
        params: parameter
    })
}


// 添加挂号
export function addPigRegistrationApi(data) {
    return request({
        url: pigRegistration.addPigRegistration,
        method: 'post',
        data: data
    })
}

// 修改挂号
export function updatePigRegistrationApi(data) {
    return request({
        url: pigRegistration.updatePigRegistration,
        method: 'post',
        data: data
    })
}


// 删除挂号
export function deletePigRegisterApi(data) {
    return request({
        url: pigRegistration.deletePigRegister,
        method: 'post',
        data: data
    })
}


// 根据id获取数据
export function getEditinfoApi(parameter) {
    return request({
        url: pigRegistration.getEditinfo,
        method: 'get',
        params: parameter
    })
}

// 简易挂号流程
export function pigSimpleMedicalProcessApi(data) {
    return request({
        url: pigRegistration.pigSimpleMedicalProcess,
        method: 'post',
        data: data
    })
}


