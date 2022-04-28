
// 测孕  相关APi
import request from '../utils/request'

const pigPregnancy = {
    // get接口
    getPigPregnancyList: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getPigPregnancyTestPageList',
    getPigFileDetail: '/ms-masterdata-consummer/pmPigArchives/{version}/getPigRecordList',
    // post接口
    addPigPregnancy: "/ms-masterdata-consummer/pmPregnancyTest/{version}/addPigPregnancyTestList",
    updatePigPregnancy: '/ms-masterdata-consummer/pmPregnancyTest/{version}/updatePigPregnancyTestList',
    addBatchPigPregnancy: '/ms-masterdata-consummer/pmPregnancyTest/{version}/batchAddPregnancyTestRecord'
}

// 测孕列表
export function getPigPregnancyListApi(parameter) {
    return request({
        url: pigPregnancy.getPigPregnancyList,
        method: 'get',
        params: parameter
    })
}
// 查询接口
export function getPigFileDetailApi(parameter) {
    return request({
        url: pigPregnancy.getPigFileDetail,
        method: 'get',
        params: parameter
    })
}
// 添加测孕
export function addPigPregnancyApi(data) {
    return request({
        url: pigPregnancy.addPigPregnancy,
        method: 'post',
        data: data
    })
}
// 批量添加测孕
export function addBatchPigPregnancyApi(data) {
    return request({
        url: pigPregnancy.addBatchPigPregnancy,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 编辑测孕
export function updatePigPregnancyApi(data) {
    return request({
        url: pigPregnancy.updatePigPregnancy,
        method: 'post',
        data: data
    })
}






