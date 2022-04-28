// 导出  相关APi
import request from '../utils/request'

const exExport = {
    // post接口
    getFileUrl: "/ms-masterdata-consummer/pigImport/{version}/getFileUrl",
    optionalExprot: '/ms-masterdata-consummer/pigExport/{version}/exportPigMatchRecord',
    exportPigSemenNeed: '/ms-masterdata-consummer/pigExport/{version}/exportPigSemenNeed',
    exportBreedingTask: '/ms-masterdata-consummer/pigExport/{version}/exportBreedingTask',
    exportPigSpFarmwean: '/ms-masterdata-consummer/pigExport/{version}/exportPigWithMilk',
    exportPigWithMilk: '/ms-masterdata-consummer/pigExport/{version}/exportPigWithMilk',
    exportPigPregnancyTest: '/ms-masterdata-consummer/pigExport/{version}/exportPigPregnancyTest',
    exportPigBedRecord: "/ms-masterdata-consummer/pigExport/{version}/exportPigBedRecord",
    exportPigOutOfBed: '/ms-masterdata-consummer/pigExport/{version}/exportPigOutOfBed',
    exportPigProductionRecord: '/ms-masterdata-consummer/pigExport/{version}/exportPigProductionRecord',
    exportPigVaccination: '/ms-masterdata-consummer/pigExport/{version}/exportPigVaccination',
    exportPigDormInRecord: '/ms-masterdata-consummer/pigExport/{version}/exportPigDormInRecord',
    exportPigDormOutRecord: '/ms-masterdata-consummer/pigExport/{version}/exportPigDormOutRecord',
    exportPigDie: '/ms-masterdata-consummer/pigExport/{version}/exportPigDie',
    exportPhysicalExaminationRecord: '/ms-masterdata-consummer/pigExport/{version}/exportPhysicalExaminationRecord',
    exportPigSpFarmdieRecord: '/ms-masterdata-consummer/pigExport/{version}/exportPigSpFarmdieRecord',
    exportPigAbortionRegister: '/ms-masterdata-consummer/pmPigAbortionRegister/{version}/exportPigAbortionRegister',
    exportPigArchives: "/ms-masterdata-consummer/pigExport/{version}/exportPigArchives",
    exportPigBatchPregnancyTest: "/ms-masterdata-consummer/PigBatchdetails/1/exportPigBatchPregnancyTest",
    exportPigBatchDetailPregnancy: "/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigBatchParticularsTest",
    exportPigBatchProductionRecord: "/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigProductionRecord",
    exportPigBatchAbnormalDynamic: "/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigBatchAbnormalDynamic",
    exportWeaningRecord: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigSpFarmwean',
    exportGotobed: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigBatchdeBedRecord',
    exportProductionRecords: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigProductionRecord',
    exportNursingRecord: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigBatchWithMilkRecord',
    exportOutbed: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportPigBatchOutOfBedRecord',
    exportSowInventory: '/ms-masterdata-consummer/PigBatchdetails/{version}/exportSowInventory',
    exportPigcastrationPlan: '/ms-masterdata-consummer/pigcastrationPlan/{version}/exportPigcastrationPlan',
    exportPigloveTime: '/ms-masterdata-consummer/pigExport/{version}/exportPigMatapplyRecord',
    exportLabelData: '/ms-masterdata-consummer/pigExport/{version}/exportLabelData',
    exportCarvingData: '/ms-masterdata-consummer/pigExport/{version}/exportCarvingData',
    exportDeliveryRecord: '/ms-masterdata-consummer/pigExport/{version}/exportDeliveryRecord',
    exportPedigree: '/ms-masterdata-consummer/pigExport/{version}/exportPedigree',
    exportInspectionSheetDetail: "/ms-masterdata-consummer/pigExport/{version}/exportInspectionSheetDetail",
    exportInspectionOptionValue: "/ms-masterdata-consummer/pigExport/{version}/exportInspectionOptionValue",
    exportSpSamplcollect: "/ms-masterdata-consummer/pigExport/{version}/exportSpSamplcollect",
    exportPigGradedRecord: "/ms-masterdata-consummer/PmPigForSaleRecord/{version}/exportPigGradedRecord",
    exportPigGroupHealthcare: '/ms-masterdata-consummer/pigExport/%7Bversion%7D/exportPigGroupHealthcare'

}

// 导出列表
export function exportPigloveTimeApi(data) {
    return request({
        url: exExport.exportPigloveTime,
        method: 'post',
        data: data
    })
}

// 上传、下载获取文件地址快捷接口
export function getFileUrl(data) {
    return request({
        url: exExport.getFileUrl,
        method: 'post',
        data: data
    })
}

// 档案导出
export function exportPigArchivesApi(data) {
    return request({
        url: exExport.exportPigArchives,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 系谱 PDF导出
export function exportPedigreeApi(data) {
    return request({
        url: exExport.exportPedigree,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 选配 导出
export function optionalExprotApi(data) {
    return request({
        url: exExport.optionalExprot,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 精液出库 导出
export function exportPigSemenNeedApi(data) {
    return request({
        url: exExport.exportPigSemenNeed,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 配种记录 导出
export function exportBreedingTaskApi(data) {
    return request({
        url: exExport.exportBreedingTask,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 断奶 导出
export function exportPigSpFarmweanApi(data) {
    return request({
        url: exExport.exportPigSpFarmwean,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 代奶 导出
export function exportPigWithMilkApi(data) {
    return request({
        url: exExport.exportPigWithMilk,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 测孕 导出
export function exportPigPregnancyTestApi(data) {
    return request({
        url: exExport.exportPigPregnancyTest,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 上床 导出
export function exportPigBedRecordApi(data) {
    return request({
        url: exExport.exportPigBedRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}



// 下床 导出
export function exportPigOutOfBedApi(data) {
    return request({
        url: exExport.exportPigOutOfBed,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 分娩 导出
export function exportPigProductionRecordApi(data) {
    return request({
        url: exExport.exportPigProductionRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 分娩---标贴数据表导出
export function exportLabelDataApi(data) {
    return request({
        url: exExport.exportLabelData,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 分娩---雕刻数据表导出
export function exportCarvingDataApi(data) {
    return request({
        url: exExport.exportCarvingData,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 分娩---分娩记录表导出
export function exportDeliveryRecordApi(data) {
    return request({
        url: exExport.exportDeliveryRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 疫苗 导出
export function exportPigVaccinationApi(data) {
    return request({
        url: exExport.exportPigVaccination,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 转入 导出
export function exportPigDormInRecordApi(data) {
    return request({
        url: exExport.exportPigDormInRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 转出 导出
export function exportPigDormOutRecordApi(data) {
    return request({
        url: exExport.exportPigDormOutRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 死亡 导出
export function exportPigDieApi(data) {
    return request({
        url: exExport.exportPigDie,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 检测导出
export function exportPhysicalExaminationRecord(data) {
    return request({
        url: exExport.exportPhysicalExaminationRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 淘汰导出
export function exportPigSpFarmdieRecordApi(data) {
    return request({
        url: exExport.exportPigSpFarmdieRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 分级选淘 导出
export function exportPigGradedRecord(data) {
    return request({
        url: exExport.exportPigGradedRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}



// 流产导出
export function exportPigAbortionRegisterApi(data) {
    return request({
        url: exExport.exportPigAbortionRegister,
        method: 'post',
        data: data,
        timeout: 0
    })
}


/**
 * 
 * 批次导出
 * 
 * 
 * */


// 测孕导出
export function exportPigBatchPregnancyApi(data) {
    return request({
        url: exExport.exportPigBatchPregnancyTest,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 测孕详情导出
export function exportPigBatchDetailPregnancyApi(data) {
    return request({
        url: exExport.exportPigBatchDetailPregnancy,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 生产导出
export function exportPigBatchProductionRecordApi(data) {
    return request({
        url: exExport.exportPigBatchProductionRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 异动导出
export function exportPigBatchAbnormalDynamicApi(data) {
    return request({
        url: exExport.exportPigBatchAbnormalDynamic,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 断奶列表导出
export function exportWeaningRecordApi(data) {
    return request({
        url: exExport.exportWeaningRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 上床列表导出
export function exportGotobedApi(data) {
    return request({
        url: exExport.exportGotobed,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 下床列表导出
export function exportOutbedApi(data) {
    return request({
        url: exExport.exportOutbed,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 生产列表导出
export function exportProductionRecordsApi(data) {
    return request({
        url: exExport.exportProductionRecords,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 代奶列表导出
export function exportNursingRecordApi(data) {
    return request({
        url: exExport.exportNursingRecord,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 已配母猪导出 
export function exportSowInventoryApi(data) {
    return request({
        url: exExport.exportSowInventory,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 阉割计划导出
export function exportPigcastrationPlanApi(data) {
    return request({
        url: exExport.exportPigcastrationPlan,
        method: 'post',
        data: data,
        timeout: 0
    })
}


// 送检单导出送检单 1代表采样  2代表耳样
export function exportInspectionSheetDetail(data) {
    return request({
        url: exExport.exportInspectionSheetDetail,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 送检报告导出 1代表采样  2代表耳样
export function exportInspectionOptionValue(data) {
    return request({
        url: exExport.exportInspectionOptionValue,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 耳样导出 1代表采样  2代表耳样
export function exportSpSamplcollect(data) {
    return request({
        url: exExport.exportSpSamplcollect,
        method: 'post',
        data: data,
        timeout: 0
    })
}
// 群体保健导出
export function exportPigGroupHealthcareApi(data) {
    return request({
        url: exExport.exportPigGroupHealthcare,
        method: 'post',
        data: data,
        timeout: 0
    })
}

