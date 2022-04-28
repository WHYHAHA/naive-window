// 疫苗  相关APi
import request from '../utils/request'

const pigVaccine = {
    // get接口
    getPigVaccineList: '/ms-masterdata-consummer/pigVaccination/{version}/readPigVaccinationMessage',
    getPigVaccineTypeList: '/ms-masterdata-consummer/pigVaccine/{version}/getVaccineLists',
    getPreferencesVaccineList: '/ms-masterdata-consummer/pigVaccine/{version}/getVaccineListsLimit',

    // post接口
    addPigVaccine: '/ms-masterdata-consummer/pigVaccination/{version}/createPigVaccination',
    updatePigVaccine: '/ms-masterdata-consummer/pigVaccination/{version}/updatePigVaccination',
    deletePigVaccine: '/ms-masterdata-consummer/pigVaccination/{version}/deletePigVaccinationById',
    addVaccineType: "/ms-masterdata-consummer/pigVaccine/{version}/createVaccine",
    updateVaccineType: '/ms-masterdata-consummer/pigVaccine/{version}/updateVaccination'
}


// 疫苗接种列表
export function getPigVaccineApi(parameter) {
    return request({
        url: pigVaccine.getPigVaccineList,
        method: 'get',
        params: parameter
    })
}

// 全部疫苗种类列表
export function getPigVaccineTypeApi(parameter) {
    return request({
        url: pigVaccine.getPigVaccineTypeList,
        method: 'get',
        params: parameter
    })
}

// 疫苗接种登记
export function addPigVaccineApi(data) {
    return request({
        url: pigVaccine.addPigVaccine,
        method: 'post',
        data: data
    })
}

// 疫苗接种登记修改
export function updatePigVaccineApi(data) {
    return request({
        url: pigVaccine.updatePigVaccine,
        method: 'post',
        data: data
    })
}

// 疫苗接种登记删除
export function deletePigVaccineApi(data) {
    return request({
        url: pigVaccine.deletePigVaccine,
        method: 'post',
        data: data
    })
}

// 偏好-疫苗列表
export function getPreferencesVaccineListApi(parameter) {
    return request({
        url: pigVaccine.getPreferencesVaccineList,
        method: 'get',
        params: parameter
    })
}
// 偏好-疫苗添加
export function addVaccineTypeApi(data) {
    return request({
        url: pigVaccine.addVaccineType,
        method: 'post',
        data: data
    })
}
// 偏好-疫苗修改
export function updateVaccineTypeApi(data) {
    return request({
        url: pigVaccine.updateVaccineType,
        method: 'post',
        data: data
    })
}










