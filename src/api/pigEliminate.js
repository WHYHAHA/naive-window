// 分级选淘-淘汰  相关APi
import request from '../utils/request'

const pigDiagnosis = {
    // get接口
    getPigSpFarmdieRecordPageList: '/ms-masterdata-consummer/pigSpFarmdie/{version}/getPigSpFarmdieRecordPageList',
    registerCheckPigSpFarmdie:'/ms-masterdata-consummer/pigSpFarmdie/{version}/getPigSpFarmdieByPigCode',
    getPigGradedRecordPageList:'/ms-masterdata-consummer/PmPigForSaleRecord/{version}/getPigGradedRecordPageList',
    getPigGradedRecordList:'/ms-masterdata-consummer/PmPigForSaleRecord/{version}/getPigGradedRecordList',


    // post接口
    applyPigSpFarmdie: '/ms-masterdata-consummer/pigSpFarmdie/{version}/applyPigSpFarmdie',
    approvePigSpFarmdie:'/ms-masterdata-consummer/pigSpFarmdie/{version}/approvePigSpFarmdie',
    registerPigSpFarmdie:'/ms-masterdata-consummer/pigSpFarmdie/{version}/registerPigSpFarmdie',
    revokePigSpFarmdie:'/ms-masterdata-consummer/pigSpFarmdie/{version}/revokePigSpFarmdie',
    editPigSpFarmdie:'/ms-masterdata-consummer/pigSpFarmdie/{version}/editPigSpFarmdie',
    addPigGradedRecordList:'/ms-masterdata-consummer/PmPigForSaleRecord/{version}/addPigGradedRecordList',
    updatePigGradedRecord:'/ms-masterdata-consummer/PmPigForSaleRecord/{version}/updatePigGradedRecord'

}


// 淘汰列表
export function getPigSpFarmdieRecordPageListApi(parameter) {
    return request({
        url: pigDiagnosis.getPigSpFarmdieRecordPageList,
        method: 'get',
        params: parameter
    })
}

// 淘汰登记中-查询单只猪信息
export function registerCheckPigSpFarmdieApi(parameter) {
    return request({
        url: pigDiagnosis.registerCheckPigSpFarmdie,
        method: 'get',
        params: parameter
    })
}


// 淘汰申请
export function applyPigSpFarmdieApi(data) {
    return request({
        url: pigDiagnosis.applyPigSpFarmdie,
        method: 'post',
        data: data
    })
}

// 编辑申请
export function editPigSpFarmdieApi(data) {
    return request({
        url: pigDiagnosis.editPigSpFarmdie,
        method: 'post',
        data: data
    })
}


// 淘汰审定
export function approvePigSpFarmdieApi(data) {
    return request({
        url: pigDiagnosis.approvePigSpFarmdie,
        method: 'post',
        data: data
    })
}


// 淘汰登记
export function registerPigSpFarmdieApi(data) {
    return request({
        url: pigDiagnosis.registerPigSpFarmdie,
        method: 'post',
        data: data
    })
}

// 淘汰撤销
export function revokePigSpFarmdieApi(data) {
    return request({
        url: pigDiagnosis.revokePigSpFarmdie,
        method: 'post',
        data: data
    })
}

// 评级
export function getPigGradedRecordPageListApi(parameter) {
    return request({
        url: pigDiagnosis.getPigGradedRecordPageList,
        method: 'get',
        params: parameter
    })
}

// 单只猪的信息
export function getPigGradedRecordListListApi(parameter) {
    return request({
        url: pigDiagnosis.getPigGradedRecordList,
        method: 'get',
        params: parameter
    })
}

//新增评级
export function addPigGradedRecordListApi(data) {
    return request({
        url: pigDiagnosis.addPigGradedRecordList,
        method: 'post',
        data: data
    })
}

//编辑

export function updatePigGradedRecordApi(data) {
    return request({
        url: pigDiagnosis.updatePigGradedRecord,
        method: 'post',
        data: data
    })
}







