// 医疗偏好设置  相关APi
import request from '../utils/request'

const pigDeath = {
    // get接口
    getSymptoms: '/ms-masterdata-consummer/pigSymptoms/{version}/getSymptoms',
    getPigDrugsBySymptomsId: '/ms-masterdata-consummer/pigDrugs/{version}/getPigDrugsBySymptomsId',
    getPigDrugs: '/ms-masterdata-consummer/pigDrugs/{version}/getPigDrugs',
    getMedicalForPigCode: '/ms-masterdata-consummer/PigDrugRegistration/{version}/getPigDrugRegistration',
    // post接口
    deleteSymptomsById: '/ms-masterdata-consummer/pigSymptoms/{version}/deleteSymptomsById',
    insertSymptoms: '/ms-masterdata-consummer/pigSymptoms/{version}/insertSymptoms ',
    updateSymptoms: '/ms-masterdata-consummer/pigSymptoms/{version}/updateSymptoms',
    updateState: '/ms-masterdata-consummer/pigSymptoms/{version}/updateState',
    createPigSymptomsDrugs: '/ms-masterdata-consummer/pigDrugs/{version}/createPigSymptomsDrugs',
    updatePigDrugs: '/ms-masterdata-consummer/pigDrugs/{version}/updatePigDrugs',
    deletePigDrugs: '/ms-masterdata-consummer/pigDrugs/{version}/deletePigDrugs'
}


// 病症列表
export function getSymptomsApi(parameter) {
    return request({
        url: pigDeath.getSymptoms,
        method: 'get',
        params: parameter
    })
}
export function getMedicalForPigCodeApi(parameter) {
    return request({
        url: pigDeath.getMedicalForPigCode,
        method: 'get',
        params: parameter
    })
}

// 病症添加
export function insertSymptomsApi(data) {
    return request({
        url: pigDeath.insertSymptoms,
        method: 'post',
        data: data
    })
}

// 病症编辑
export function updateSymptomsApi(data) {
    return request({
        url: pigDeath.updateSymptoms,
        method: 'post',
        data: data
    })
}


// 病症启用
export function updateStateApi(data) {
    return request({
        url: pigDeath.updateState,
        method: 'post',
        data: data
    })
}

// 病症删除
export function deleteSymptomsByIdApi(data) {
    return request({
        url: pigDeath.deleteSymptomsById,
        method: 'post',
        data: data
    })
}

// 药品的----------------------
// 药品列表
export function getPigDrugsBySymptomsIdApi(parameter) {
    return request({
        url: pigDeath.getPigDrugsBySymptomsId,
        method: 'get',
        params: parameter
    })
}

// 药品list
export function getPigDrugsApi(parameter) {
    return request({
        url: pigDeath.getPigDrugs,
        method: 'get',
        params: parameter
    })
}

// 药品添加
export function createPigSymptomsDrugsApi(data) {
    return request({
        url: pigDeath.createPigSymptomsDrugs,
        method: 'post',
        data: data
    })
}

// 药品编辑
export function updatePigDrugsApi(data) {
    return request({
        url: pigDeath.updatePigDrugs,
        method: 'post',
        data: data
    })
}

// 药品删除
export function deletePigDrugsApi(data) {
    return request({
        url: pigDeath.deletePigDrugs,
        method: 'post',
        data: data
    })
}


