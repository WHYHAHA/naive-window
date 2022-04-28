// 批次  相关APi

import request from '../utils/request'

const breedingPlan = {
    //get接口
    getPigBreedingList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getBreedingBatchesBatchLists',
    getPigBreedingDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchDetails',
    getExceptionRecordList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchabnormalDynamicLists',
    getExceptionRecordDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchAbnormalDynamicDetails',
    getPregnancyRecordList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPregnancyBatchTestRecordPage',
    getPregnancyRecordDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPregnancyBatchDetailsPage',
    getDonePlanList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getSowInventoryPageLists',
    getProductionRecordsList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigProductionRecordPages',
    getProductionRecordsDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBirthRecordsPages',
    deleteProductionRecord: '/ms-masterdata-consummer/pigBirthRecords/{version}/deletePigBirthRecords',
    getGoToBedRecordList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getBatchdeBedPageLists',
    getGoToBedRecordDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getBatchdeBedById',
    getOutBedRecordList: "/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchOutOfBedsPages",

    getWeaningRecord: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchletsWeanedList',
    getWeaningRecordDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchletsWeanedParticulars',
    getNursingRecordsList: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchWithMilkPages',
    getNursingRecordDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBatchWithMilkChildPigPages',
    getCurrentBatch: '/ms-masterdata-consummer/PigBatchdetails/{version}/getCurrentBatch',
    getTargetDetail: '/ms-masterdata-consummer/PigBatchdetails/{version}/getPigBreedingrRecordList',
    anOverviewOfTheBatch:'/ms-masterdata-consummer/PigBatchdetails/{version}/getbreedingBatches',

    // post接口
    addBatch: '/ms-masterdata-consummer/PigBatchdetails/{version}/createBreedingBatches',
    saveTarger: '/ms-masterdata-consummer/PigBatchdetails/{version}/createPigBatchDetails'
}
// 新建批次
export function addBatchApi(data) {
    return request({
        url: breedingPlan.addBatch,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 获取当前批次
export function getCurrentBatchApi(parameter) {
    return request({
        url: breedingPlan.getCurrentBatch,
        method: 'get',
        params: parameter,
    })
}


// 批次列表
export function getPigBreedingListApi(parameter) {
    return request({
        url: breedingPlan.getPigBreedingList,
        method: 'get',
        params: parameter,
    })
}
// 批次详情
export function getPigBreedingDetailApi(parameter) {
    return request({
        url: breedingPlan.getPigBreedingDetail,
        method: 'get',
        params: parameter,
    })
}


// 已配母猪清单
export function getDonePlanListApi(parameter) {
    return request({
        url: breedingPlan.getDonePlanList,
        method: 'get',
        params: parameter,
    })
}




// 测情列表
export function getPregnancyRecordListApi(parameter) {
    return request({
        url: breedingPlan.getPregnancyRecordList,
        method: 'get',
        params: parameter,
    })
}
// 测情详情
export function getPregnancyRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getPregnancyRecordDetail,
        method: 'get',
        params: parameter,
    })
}

// 批次概览
export function anOverviewOfTheBatchApi(parameter){
    return request({
        url: breedingPlan.anOverviewOfTheBatch,
        method: 'get',
        params: parameter,
    })
}






// 异动列表
export function getExceptionRecordListApi(parameter) {
    return request({
        url: breedingPlan.getExceptionRecordList,
        method: 'get',
        params: parameter,
    })
}
// 异动详情
export function getExceptionRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getExceptionRecordDetail,
        method: 'get',
        params: parameter,
    })
}




// 生产列表
export function getProductionRecordsListApi(parameter) {
    return request({
        url: breedingPlan.getProductionRecordsList,
        method: 'get',
        params: parameter,
    })
}
// 生产详情
export function getProductionRecordsDetailApi(parameter) {
    return request({
        url: breedingPlan.getProductionRecordsDetail,
        method: 'get',
        params: parameter,
    })
}
// 删除生产记录
export function deleteProductionRecordApi(data) {
    return request({
        url: breedingPlan.deleteProductionRecord,
        method: 'post',
        params: data,
    })
}

// 上床列表
export function getGoToBedRecordListApi(parameter) {
    return request({
        url: breedingPlan.getGoToBedRecordList,
        method: 'get',
        params: parameter,
    })
}
// 上床详情
export function getGoToBedRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getGoToBedRecordDetail,
        method: 'get',
        params: parameter,
    })
}
// 下床列表
export function getOutBedRecordListApi(parameter) {
    return request({
        url: breedingPlan.getOutBedRecordList,
        method: 'get',
        params: parameter,
    })
}
// 下床详情
export function getOutBedRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getOutBedRecordDetail,
        method: 'get',
        params: parameter,
    })
}


// 断奶列表
export function getWeaningRecordApi(parameter) {
    return request({
        url: breedingPlan.getWeaningRecord,
        method: 'get',
        params: parameter,
    })
}
// 断奶详情
export function getWeaningRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getWeaningRecordDetail,
        method: 'get',
        params: parameter,
    })
}


// 代奶列表
export function getNursingRecordsListApi(parameter) {
    return request({
        url: breedingPlan.getNursingRecordsList,
        method: 'get',
        params: parameter,
    })
}

// 代奶详情
export function getNursingRecordDetailApi(parameter) {
    return request({
        url: breedingPlan.getNursingRecordDetail,
        method: 'get',
        params: parameter,
    })
}

// 设置目标时获取 对应栋舍及母猪数量
export function getTargetDetailApi(parameter) {
    return request({
        url: breedingPlan.getTargetDetail,
        method: 'get',
        params: parameter,
    })
}

// 保存目标
export function saveTargerApi(data) {
    return request({
        url: breedingPlan.saveTarger,
        method: 'post',
        data: data
    })
}


