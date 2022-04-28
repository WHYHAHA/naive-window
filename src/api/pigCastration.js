// 阉割计划和列表  相关APi
import request from '../utils/request'

const pigBreeding = {
    // get接口
    getPigcastrationPlan: '/ms-masterdata-consummer/pigcastrationPlan/{version}/getPigcastrationPlan',
    getPigcastrationPlanAndBreedingRecord: '/ms-masterdata-consummer/pigcastrationPlan/{version}/getPigcastrationPlanAndBreedingRecord',
    getPigcastrationPlanAndBreedingBoar:'/ms-masterdata-consummer/pigcastrationPlan/{version}/getPigcastrationPlanAndBreedingBoar',
    getSecondaryCastrationRecord:'/ms-masterdata-consummer/pigcastrationPlan/{version}/getSecondaryCastrationRecord',
    getPigBreedingBoar:'/ms-masterdata-consummer/pigBreedingBoar/{version}/getPigBreedingBoar',
    // post接口
    updatePigcastrationPlan: '/ms-masterdata-consummer/pigcastrationPlan/{version}/updatePigcastrationPlan',
    addPigBreedingBoar:'/ms-masterdata-consummer/pigBreedingBoar/{version}/addPigBreedingBoar',
    addSecondaryPigBreedingBoar:'/ms-masterdata-consummer/pigBreedingBoar/{version}/addSecondaryPigBreedingBoar'
}

// 阉割列表
export function getPigcastrationPlanApi(parameter) {
    return request({
        url: pigBreeding.getPigcastrationPlan,
        method: 'get',
        params: parameter
    })
}

// 阉割编辑的查询
export function getPigcastrationPlanAndBreedingRecordApi(parameter) {
    return request({
        url: pigBreeding.getPigcastrationPlanAndBreedingRecord,
        method: 'get',
        params: parameter
    })
}

// 阉割编辑
export function updatePigcastrationPlanApi(data) {
    return request({
        url: pigBreeding.updatePigcastrationPlan,
        method: 'post',
        data: data
    })
}

// 阉割记录登记的查询信息
export function getPigcastrationPlanAndBreedingBoarApi(parameter) {
    return request({
        url: pigBreeding.getPigcastrationPlanAndBreedingBoar,
        method: 'get',
        params: parameter
    })
}

// 阉割记录登记
export function addPigBreedingBoarApi(data) {
    return request({
        url: pigBreeding.addPigBreedingBoar,
        method: 'post',
        data: data
    })
}

// 二次阉割查询
export function getSecondaryCastrationRecordApi(parameter) {
    return request({
        url: pigBreeding.getSecondaryCastrationRecord,
        method: 'get',
        params: parameter
    })
}

// 二次阉割记录登记
export function addSecondaryPigBreedingBoarApi(data) {
    return request({
        url: pigBreeding.addSecondaryPigBreedingBoar,
        method: 'post',
        data: data
    })
}

// 留种列表查询
export function getPigBreedingBoarApi(parameter) {
    return request({
        url: pigBreeding.getPigBreedingBoar,
        method: 'get',
        params: parameter
    })
}
