// 选配  相关APi

import request from '../utils/request'

const pigOptionalApis = {
    // get接口
    getPigOptionalList: '/ms-masterdata-consummer/pigMatchRecord/{version}/getRecords',
    getPigOptionalDetail: '/ms-masterdata-consummer/pigMatchRecord/{version}/getRecordsByPigCode',
    getMatchMessage: "/ms-masterdata-consummer/pigMatchRecord/{version}/getMatchMessage",
    getMatchMessagelists: "/ms-masterdata-consummer/pigMatchRecord/{version}/getMatchMessagelists",
    // post接口
    deletePigOptional: "/ms-masterdata-consummer/pigMatchRecord/{version}/deleteMatchMessage",
    addMatchMessage: "/ms-masterdata-consummer/pigMatchRecord/{version}/addMatchMessage",
    finshOptional: '/ms-masterdata-consummer/pigMatchRecord/{version}/addCompleteMatching',
    syntheticStrains: '/ms-masterdata-consummer/pigMatchRecord/{version}/checkMatch'
}

// 合成品系
export function addsyntheticStrains(data) {
    return request({
        url: pigOptionalApis.syntheticStrains,
        method: 'post',
        data: data
    })
}
// 选配列表
export function getPigOptionalListApi(parameter) {
    return request({
        url: pigOptionalApis.getPigOptionalList,
        method: 'get',
        params: parameter
    })
}
// 选配详情
export function getPigOptionalDetailApi(parameter) {
    return request({
        url: pigOptionalApis.getPigOptionalDetail,
        method: 'get',
        params: parameter
    })
}
// 详情获取育种值和精液库存
export function getMatchMessageApi(parameter) {
    return request({
        url: pigOptionalApis.getMatchMessage,
        method: 'get',
        params: parameter
    })
}
// 获取主备信息
export function getMatchMessagelistsApi(parameter) {
    return request({
        url: pigOptionalApis.getMatchMessagelists,
        method: 'get',
        params: parameter
    })
}

// 放弃选配
export function deletePigOptionalApi(data) {
    return request({
        url: pigOptionalApis.deletePigOptional,
        method: 'post',
        data: data
    })
}

// 保存选配
export function addMatchMessageApi(data) {
    return request({
        url: pigOptionalApis.addMatchMessage,
        method: 'post',
        data: data
    })
}

// 完成选配
export function finshOptionalApi(data) {
    return request({
        url: pigOptionalApis.finshOptional,
        method: 'post',
        data: data
    })
}

