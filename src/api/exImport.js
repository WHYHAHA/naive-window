// 导入  相关APi
import request from '../utils/request'

const exImport = {
    // post接口
    getFileUrl: "/ms-masterdata-consummer/pigImport/{version}/getFileUrl",
    batchAddPigMatapply: "/ms-masterdata-consummer/pigImport/{version}/batchAddPigMatapply",
    batchAddPigMatchRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigMatchRecord',
    batchAddPigpregnancyTestRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigpregnancyTestRecord',
    batchAddPigBedRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigBedRecord',
    batchAddPigOutOfBed: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigOutOfBed',
    batchAddPigWithMilk: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigWithMilk',
    batchAddPigSpFarmwean: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigSpFarmwean',
    batchAddPigBreedingRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigBreedingRecord',
    batchAddPigVaccination: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigVaccination',
    batchAddPigDormInRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigDormInRecord',
    batchAddPigDormOutRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigDormOutRecord',
    batchAddPigDieRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigDieRecord',
    batchAddPigSpFarmdieRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigSpFarmdieRecord',
    batchAddPmPigArchives: '/ms-masterdata-consummer/pigImport/{version}/batchAddPmPigArchives',
    batchPigAbortionRegister: '/ms-masterdata-consummer/pmPigAbortionRegister/{version}/batchPigAbortionRegister',
    batchAddPigProductionRecord: '/ms-masterdata-consummer/pigImport/{version}/batchAddPigProductionRecord'

}

// 上传、下载获取文件地址快捷接口
export function getFileUrl(data) {
    return request({
        url: exImport.getFileUrl,
        method: 'post',
        data: data
    })
}
// 建档批量导入
export function batchAddPmPigArchivesApi(data) {
    return request({
        url: exImport.batchAddPmPigArchives,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 查情 导入
export function batchAddPigMatapplyApi(data) {
    return request({
        url: exImport.batchAddPigMatapply,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 选配 导入
export function batchAddPigMatchRecordApi(data) {
    return request({
        url: exImport.batchAddPigMatchRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 配种 导入
export function batchAddPigSpFarmweanApi(data) {
    return request({
        url: exImport.batchAddPigSpFarmwean,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 测孕 导入
export function batchAddPigpregnancyTestRecordApi(data) {
    return request({
        url: exImport.batchAddPigpregnancyTestRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 上床 导入
export function batchAddPigBedRecordApi(data) {
    return request({
        url: exImport.batchAddPigBedRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 下床 导入
export function batchAddPigOutOfBedApi(data) {
    return request({
        url: exImport.batchAddPigOutOfBed,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 代奶 导入
export function batchAddPigWithMilkApi(data) {
    return request({
        url: exImport.batchAddPigWithMilkApi,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 断奶 导入
export function batchAddPigBreedingRecordApi(data) {
    return request({
        url: exImport.batchAddPigBreedingRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 疫苗 导入
export function batchAddPigVaccinationApi(data) {
    return request({
        url: exImport.batchAddPigVaccination,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 转入 导入
export function batchAddPigDormInRecordApi(data) {
    return request({
        url: exImport.batchAddPigDormInRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 转出 导入
export function batchAddPigDormOutRecordApi(data) {
    return request({
        url: exImport.batchAddPigDormOutRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 死亡 导入
export function batchAddPigDieRecordApi(data) {
    return request({
        url: exImport.batchAddPigDieRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 淘汰 导入
export function batchAddPigSpFarmdieRecordApi(data) {
    return request({
        url: exImport.batchAddPigSpFarmdieRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 流产 导入
export function batchPigAbortionRegisterApi(data) {
    return request({
        url: exImport.batchPigAbortionRegister,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 分娩 导入
export function batchAddPigProductionRecordApi(data) {
    return request({
        url: exImport.batchAddPigProductionRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

