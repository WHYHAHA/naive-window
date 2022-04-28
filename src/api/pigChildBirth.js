// 分娩  相关APi
import request from '../utils/request'

const pigChildBirth = {
    // get接口
    getPigChildBirthList: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/getPigProductionRecordPageLists',
    getPigFileDetail: '/ms-masterdata-consummer/pmPigBedRecord/{version}/getPigInformation',
    getPigChildBirthDetail: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/getPigProductionRecordParticulars',
    getearBrand: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/getPigletEarBrandCode',

    // post接口
    addPigChildBirth: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/addProductionRecord',
    updateChildBirth: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/updatePigletParticulars',
    updatePigGoToBed: "/ms-masterdata-consummer/PigOutOfBed/{version}/updatePigOutOfBed",
    deletePigChildBirth: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/deletePigletParticulars',
    modifyTheBatchs: '/ms-masterdata-consummer/pmPigBedRecord/{version}/updateEditProductionBatchs'
}


// 分娩列表
export function getPigChildBirthListApi(parameter) {
    return request({
        url: pigChildBirth.getPigChildBirthList,
        method: 'get',
        params: parameter
    })
}
// 查询单个母猪信息
export function getPigFileDetailApi(parameter) {
    return request({
        url: pigChildBirth.getPigFileDetail,
        method: 'get',
        params: parameter
    })
}
// 添加登记
export function addPigChildBirthApi(data) {
    return request({
        url: pigChildBirth.addPigChildBirth,
        method: 'post',
        data: data
    })
}

// 登记详情
export function getPigChildBirthDetailApi(parameter) {
    return request({
        url: pigChildBirth.getPigChildBirthDetail,
        method: 'get',
        params: parameter
    })
}
// 查询母猪耳牌号
export function gegetearBrandtApi(parameter) {
    return request({
        url: pigChildBirth.getearBrand,
        method: 'get',
        params: parameter
    })
}
// 更改母猪对应仔猪信息
export function updateChildBirthApi(data) {
    return request({
        url: pigChildBirth.updateChildBirth,
        method: 'post',
        data: data
    })
}


// 单个产仔记录删除

export function deletePigChildBirthApi(data) {
    return request({
        url: pigChildBirth.deletePigChildBirth,
        method: 'post',
        data: data
    })
}

// 修改生产批次
export function modifyThemodifyTheBatchs(data) {
    return request({
        url: pigChildBirth.modifyTheBatchs,
        method: 'post',
        data: data
    })
}

