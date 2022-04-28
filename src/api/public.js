import request from '../utils/request'

const publicApis = {
    // get接口
    getPigInfo: '/ms-masterdata-consummer/pmPigArchives/{version}/getPigInfoBySearch',
    pigDictionaries: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getPmDictListByValue',
    getPmFarmList: '/ms-masterdata-consummer/pmPigFarm/{version}/getPmFarmListByCode',
    getPmDormList: '/ms-masterdata-consummer/pmPigDorm/{version}/getPmDormListByCode',
    getVaccineTypes: '/ms-masterdata-consummer/pigVaccine/{version}/getVaccineLists',
    getExcelRecord: '/ms-masterdata-consummer/pigImport/{version}/getExcelRecord',
    getpigSymptoms: '/ms-masterdata-consummer/pigSymptoms/{version}/getPigSymptoms',
    getPigDrugsById: '/ms-masterdata-consummer/pigSymptoms/{version}/getPigDrugsById',
    getUserListByTid: '/ms-tenant-consummer/user/{version}/getUserListByTid',
    getLog: '/ms-tenant-consummer/sysLog/{version}/getSyslogList',
    getPigInfoByRuttingCode: "/ms-masterdata-consummer/pmPigArchives/{version}/getPigInfoByRuttingCode",
    getAllDictionaries: "/ms-masterdata-consummer/pmPigDorm/{version}/getAllDictionaries",
    batchPrintSowCard: '/ms-masterdata-consummer/pmPigArchives/{version}/batchPrintSowCard',
    getUserToDo: '/ms-tenant-consummer/messageRecord/{version}/getMessageListByType',
    bulkModifyTheMessage: "/ms-tenant-consummer/messageRecord/{version}/updateMessageListByIds",
    fuzzyQuery: "/ms-masterdata-consummer/pmPigArchives/{version}/getSearchInfoBy6",

    // post接口


}

// 查询母猪基本信息
export function getPigInfoApi(parameter) {
    return request({
        url: publicApis.getPigInfo,
        method: 'get',
        params: parameter
    })
}

// 获取全量字典表
export function getAllDictionariesApi(params) {
    return request({
        url: publicApis.getAllDictionaries,
        method: 'get',
        params
    })
}

// 字典表
export function getPigDictionariesApi(parameter) {
    return request({
        url: publicApis.pigDictionaries,
        method: 'get',
        params: parameter
    })
}

// 种猪场区
export function getPmFarmListApi(parameter) {
    return request({
        url: publicApis.getPmFarmList,
        method: 'get',
        params: parameter
    })
}

// 种猪栋舍
export function getPmDormListApi(parameter) {
    return request({
        url: publicApis.getPmDormList,
        method: 'get',
        params: parameter
    })
}

// 文件传输列表
export function getExcelRecordApi(parameter) {
    return request({
        url: publicApis.getExcelRecord,
        method: 'get',
        params: parameter
    })
}

// 疫苗种类
export function getVaccineTypesApi(parameter) {
    return request({
        url: publicApis.getVaccineTypes,
        method: 'get',
        params: parameter
    })
}

// 获取对应症状字典
export function getpigSymptomsApi(parameter) {
    return request({
        url: publicApis.getpigSymptoms,
        method: 'get',
        params: parameter
    })
}

// 根据参数 获取对应药品
export function getPigDrugsByIdApi(parameter) {
    return request({
        url: publicApis.getPigDrugsById,
        method: 'get',
        params: parameter
    })
}

// 根据角色获取应用用户下拉列表
export function getUserListByTidApi(parameter) {
    return request({
        url: publicApis.getUserListByTid,
        method: 'get',
        params: parameter
    })
}

// 获取日志
export function getLogApi(parameter) {
    return request({
        url: publicApis.getLog,
        method: 'get',
        params: parameter
    })
}

// 根据母编码与性别 获取pigCode列表数据
export function getPigInfoByRuttingCodeApi(parameter) {
    return request({
        url: publicApis.getPigInfoByRuttingCode,
        method: 'get',
        params: parameter
    })
}

// 母猪卡打印
export function batchPrintSowCard(data) {
    return request({
        url: publicApis.batchPrintSowCard,
        method: 'post',
        data
    })
}
// 获取用户待办
export function getUserMessageApi(parameter) {
    return request({
        url: publicApis.getUserToDo,
        method: 'get',
        params: parameter
    })
}

// 批量更改消息状态
export function bulkModifyTheMessageApi(data) {
    return request({
        url: publicApis.bulkModifyTheMessage,
        method: 'post',
        data: data
    })
}

// 模糊查询6位
export function getfuzzyQuery(parameter) {
    return request({
        url: publicApis.fuzzyQuery,
        method: 'get',
        params: parameter
    })
}