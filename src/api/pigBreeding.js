// 配种  相关APi
import request from '../utils/request'

const pigBreeding = {
    // get接口
    getPigBreedingList: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getWithTheSowLists',
    getPigBreedingListforPigCode: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getPmPigBreedingRecordList',
    getBoarDetail: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getSowsAndBoarsMessage',
    getInseminationOrders: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getInseminationOrders',
    // post接口
    registerBreeding: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/addSowsAndBoarsMessage'
}

// 配种列表
export function getPigBreedingListApi(parameter) {
    return request({
        url: pigBreeding.getPigBreedingList,
        method: 'get',
        params: parameter
    })
}
// 配种列表 带code查询
export function getPigBreedingListforPigCodeApi(parameter) {
    return request({
        url: pigBreeding.getPigBreedingListforPigCode,
        method: 'get',
        params: parameter
    })
}

// 配种校验
export function getBoarDetailApi(parameter) {
    return request({
        url: pigBreeding.getBoarDetail,
        method: 'get',
        params: parameter
    })
}

// 登记配种
export function registerBreedingApi(data) {
    return request({
        url: pigBreeding.registerBreeding,
        method: 'post',
        data: data
    })
}

// 根据母猪编码查询输精次数
export function getInseminationOrdersApi(parameter) {
    return request({
        url: pigBreeding.getInseminationOrders,
        method: 'get',
        params: parameter
    })
}


