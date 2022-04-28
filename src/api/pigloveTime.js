// 查情  相关APi
import request from '../utils/request'

const pigloveTime = {
    // get接口
    getPigloveTimeList: '/ms-masterdata-consummer/pigMatapply/{version}/getPigMatapplyLists',
    getPigDetail: "/ms-masterdata-consummer/pmPigArchives/{version}/getPigInfoBySearch",
    // post接口
    deleteloveTime: "/ms-masterdata-consummer/pigMatapply/{version}/deletePigMatapplyList",
    addPigloveTime: "/ms-masterdata-consummer/pigMatapply/{version}/addPigMatapplyList",
    batchMatching: "/ms-masterdata-consummer/pigMatapply/{version}/updatePigMatapplyList",
    addBatchPigloveTime: "/ms-masterdata-consummer/pigMatapply/{version}/batchAddPigMatapplyList",

}


// 查情列表
export function getPigloveTimeListApi(parameter) {
    return request({
        url: pigloveTime.getPigloveTimeList,
        method: 'get',
        params: parameter
    })
}

// 查情单个母猪
export function getPigDetailApi(parameter) {
    return request({
        url: pigloveTime.getPigDetail,
        method: 'get',
        params: parameter
    })
}



// 保存
export function addPigloveTimeApi(data) {
    return request({
        url: pigloveTime.addPigloveTime,
        method: 'post',
        data: data
    })
}
// 多条保存
export function addBatchPigloveTimeApi(data) {
    return request({
        url: pigloveTime.addBatchPigloveTime,
        method: 'post',
        data: data
    })
}

// 删除单个配种
export function deleteloveTimeApi(data) {
    return request({
        url: pigloveTime.deleteloveTime,
        method: 'post',
        data: data
    })
}

// 批量选配
export function batchMatchingApi(data) {
    return request({
        url: pigloveTime.batchMatching,
        method: 'post',
        data: data
    })
}



