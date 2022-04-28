// 种猪档案  相关APi

import request from '../utils/request'

const pigFile = {
    // get接口
    pigFileList: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigArchivesPageList',
    pigFileDetail: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigArchivesById',
    PigFeedingList: '/ms-masterdata-consummer/pmPigCastFoodRecord/{version}/getPmPigCastFoodRecordPageList',
    pigDwellingList: '/ms-masterdata-consummer/pmPigDormRecord/{version}/getPmPigDormPageList',
    pigExaminationList: '/ms-masterdata-consummer/pmPhysicalExaminationRecord/{version}/getPmPigBodyPageList',
    pigVaccineList: '/ms-masterdata-consummer/pmPigVaccineRecord/{version}/getPmPigVaccPageList',
    pigMedicalList: '/ms-masterdata-consummer/pmPigMedicalRecord/{version}/getPmPigMedicalRecordPageList',
    pigSemenList: '/ms-masterdata-consummer/pmpigSemenCollection/{version}/getPmPigSemenCollectionList',
    pigHybridizationList: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getPmPigBreedingRecordList',
    pigFetationList: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getPmPregnancyTestPageList',
    pigMultiplyList: '/ms-masterdata-consummer/pmPigProductionRecord/{version}/getPmPigProductionRecordPageList',
    birthMeasure: '/ms-masterdata-consummer/pmPigArchives/{version}/getBirthDetermination',
    KgMeasure_100: '/ms-masterdata-consummer/pmPigArchives/{version}/getQuintalEstimated',
    KgMeasure_150: '/ms-masterdata-consummer/pmPigArchives/{version}/getEstimatedResult',
    pigOverview: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigFosterArchivesLists',
    getPmPigArchives: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigFosterArchivesWeights',
    getBirthDetermination: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigFosterArchivesFamily',
    PigHybridizationDetail: '/ms-masterdata-consummer/pmPigBreedingRecord/{version}/getPmPigBreedingRecordDetails',
    getPmPigFosterBreedingValue: '/ms-masterdata-consummer/pmPigArchives/{version}/getPmPigFosterBreedingValue',
    getMemorabilia: "/ms-masterdata-consummer/pmPigArchives/{version}/getMajorEvents",
    // post接口
    pigChangeLevel: '/ms-masterdata-consummer/pmPigArchives/{version}/updatePmPigArchivesBreedingLevel',
    batchAction: '/ms-masterdata-consummer/PmPigForSaleRecord/{version}/addPigForSaleRecordList',
    deleteAction: '/ms-masterdata-consummer/pmPigArchives/{version}/deletePmPigArchivesList',
    addPmPig: '/ms-masterdata-consummer/pmPigArchives/{version}/batchAddPigArchives',

}



// 种猪列表
export function getPigFileListApi(parameter) {
    return request({
        url: pigFile.pigFileList,
        method: 'get',
        params: parameter,
    })
}

// 种猪详情
export function getPigFileDetailApi(parameter) {
    return request({
        url: pigFile.pigFileDetail,
        method: 'get',
        params: parameter
    })
}

// 大事记
export function getMemorabiliaApi(parameter) {
    return request({
        url: pigFile.getMemorabilia,
        method: 'get',
        params: parameter
    })
}

// 种猪饲养记录
export function getPigFeedingListApi(parameter) {
    return request({
        url: pigFile.PigFeedingList,
        method: 'get',
        params: parameter
    })
}
// 种猪转舍记录
export function getPigDwellingListApi(parameter) {
    return request({
        url: pigFile.pigDwellingList,
        method: 'get',
        params: parameter
    })
}

// 种猪体检记录
export function getPigExaminationListApi(parameter) {
    return request({
        url: pigFile.pigExaminationList,
        method: 'get',
        params: parameter
    })
}
// 种猪疫苗记录
export function getPigVaccineListApi(parameter) {
    return request({
        url: pigFile.pigVaccineList,
        method: 'get',
        params: parameter
    })
}
// 种猪医疗记录
export function getPigMedicalListApi(parameter) {
    return request({
        url: pigFile.pigMedicalList,
        method: 'get',
        params: parameter
    })
}
// 种猪采精记录
export function getPigSemenListApi(parameter) {
    return request({
        url: pigFile.pigSemenList,
        method: 'get',
        params: parameter
    })
}
// 种猪配种记录
export function getPigHybridizationListApi(parameter) {
    return request({
        url: pigFile.pigHybridizationList,
        method: 'get',
        params: parameter
    })
}


// 种猪测孕记录
export function getPigFetationListApi(parameter) {
    return request({
        url: pigFile.pigFetationList,
        method: 'get',
        params: parameter
    })
}
// 种猪生产记录
export function getPigMultiplyListApi(parameter) {
    return request({
        url: pigFile.pigMultiplyList,
        method: 'get',
        params: parameter
    })
}


// 11.11更新接口

// 批量转群
export function pigChangeLevelApi(data) {
    return request({
        url: pigFile.pigChangeLevel,
        method: 'post',
        data: data
    })
}
// 批量待售
export function batchActionApi(data) {
    return request({
        url: pigFile.batchAction,
        method: 'post',
        data: data
    })
}
// 批量淘汰
export function deleteActionApi(data) {
    return request({
        url: pigFile.deleteAction,
        method: 'post',
        data: data
    })
}

// 添加仔猪
export function addPmPigApi(data) {
    return request({
        url: pigFile.addPmPig,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 出生检测
export function birthMeasureApi(parameter) {
    return request({
        url: pigFile.birthMeasure,
        method: 'get',
        params: parameter
    })
}
// 100kg检测
export function KgMeasure_100Api(parameter) {
    return request({
        url: pigFile.KgMeasure_100,
        method: 'get',
        params: parameter
    })
}
// 出生检测
export function KgMeasure_150Api(parameter) {
    return request({
        url: pigFile.KgMeasure_150,
        method: 'get',
        params: parameter
    })
}
// 种猪配种记录详情
export function getPigHybridizationDetailApi(parameter) {
    return request({
        url: pigFile.PigHybridizationDetail,
        method: 'get',
        params: parameter
    })
}
// 种猪生长状态
export function pigOverviewApi(parameter) {
    return request({
        url: pigFile.pigOverview,
        method: 'get',
        params: parameter
    })
}
// 种猪体重列表
export function getPmPigArchivesApi(parameter) {
    return request({
        url: pigFile.getPmPigArchives,
        method: 'get',
        params: parameter
    })
}
// 血系图谱
export function getBirthDeterminationApi(parameter) {
    return request({
        url: pigFile.getBirthDetermination,
        method: 'get',
        params: parameter
    })
}
// 育种值
export function getPmPigFosterBreedingValueApi(parameter) {
    return request({
        url: pigFile.getPmPigFosterBreedingValue,
        method: 'get',
        params: parameter
    })
}






