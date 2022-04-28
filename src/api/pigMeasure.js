// 检测  相关APi
import request from '../utils/request'

const pigMeasure = {
    // get接口
    getPigloveTimeList: '/ms-masterdata-consummer/pmPhysicalExaminationRecord/{version}/getPmPhysicalExaminationPageList',
    getMeasureOptions: "/ms-masterdata-consummer/pmTypeSetting/{version}/getPmTypeSettings",
    getPigFileDetail: '/ms-masterdata-consummer/pmPigBedRecord/{version}/getPigInformation',

    getMeasureTypeList: '/ms-masterdata-consummer/pmTypeSetting/{version}/getPmTypeSettingList',
    getMeasureTemplate: '/ms-masterdata-consummer/pmPreferencesDictSetting/1/getPmPreferencesDictSetting',
    getMeasureTypeDetail: '/ms-masterdata-consummer/pmTypeSetting/{version}/getPmTypeSettingsById',
    getTableColumns: "/ms-masterdata-consummer/pmTypeSetting/1/getTableFileById",
    getDetailById: "/ms-masterdata-consummer/pmTypeSetting/{version}/getDetailById",
    getPmPigSpSamplcollectList: "/ms-masterdata-consummer/pmPigSpSamplcollect/{version}/getPmPigSpSamplcollectList",

    getPmInspectionSheetPageList: "/ms-masterdata-consummer/pmInspectionSheet/{version}/getPmInspectionSheetPageList",
    getPmInspectionSheetDetails: "/ms-masterdata-consummer/pmInspectionSheet/{version}/getPmInspectionSheetDetails",
    getPmPigSamplCollect: "/ms-masterdata-consummer/pmPigSpSamplcollect/{version}/getPmPigSamplCollect",
    getPmDictByName: "/ms-masterdata-consummer/pmPregnancyTest/{version}/getPmDictByName",


    // post接口
    deleteloveTime: "/ms-masterdata-consummer/pigMatapply/{version}/deletePigMatapplyList",
    addPigloveTime: "/ms-masterdata-consummer/pigMatapply/{version}/addPigMatapplyList",
    batchMatching: "/ms-masterdata-consummer/pigMatapply/{version}/updatePigMatapplyList",
    createPmPhysicalExamination: "/ms-masterdata-consummer/pmPhysicalExaminationRecord/{version}/createPmPhysicalExamination",
    batchCreatePmPhysicalExamination: "/ms-masterdata-consummer/pmPhysicalExaminationRecord/{version}/batchCreatePmPhysicalExamination",
    createPmPigSpSamplcollect: '/ms-masterdata-consummer/pmPigSpSamplcollect/{version}/createPmPigSpSamplcollect',
    updateBatchPmPigSpSamplcollect: '/ms-masterdata-consummer/pmPigSpSamplcollect/{version}/updateBatchPmPigSpSamplcollect',
    updatePmPigSpSamplcollect: '/ms-masterdata-consummer/pmPigSpSamplcollect/{version}/updatePmPigSpSamplcollect',
    updatePmPhysicalExamination: '/ms-masterdata-consummer/pmPhysicalExaminationRecord/{version}/updatePmPhysicalExamination',


    addMeasureType: "/ms-masterdata-consummer/pmTypeSetting/{version}/createPmTypeSetting",
    upDataMeasureType: "/ms-masterdata-consummer/pmTypeSetting/{version}/updatePmTypeSetting",
    upDataMeasureTypeStatus: "/ms-masterdata-consummer/pmTypeSetting/{version}/updatePmTypeSettingStatus",
    saveModel: "/ms-masterdata-consummer/pmInspectionSheet/{version}/saveModel",


    createPmInspectionSheet: "/ms-masterdata-consummer/pmInspectionSheet/{version}/createPmInspectionSheet",
    createPmInspectionSheetDetail: "/ms-masterdata-consummer/pmInspectionSheet/{version}/createPmInspectionSheetDetail",
    deletePmInspectionDetail: "/ms-masterdata-consummer/pmInspectionSheet/{version}/deletePmInspectionDetail",
    deleteBatchPmInspectionDetail: "/ms-masterdata-consummer/pmInspectionSheet/{version}/deleteBatchPmInspectionDetail",
    updatePmInspectionSheet: "/ms-masterdata-consummer/pmInspectionSheet/{version}/updatePmInspectionSheet",

}

//  --- 宋丹丹 ---


// 送检列表保存检测类型
export function saveModel(data) {
    return request({
        url: pigMeasure.saveModel,
        method: 'post',
        data
    })
}

// 多个移除样本
export function updatePmInspectionSheet(data) {
    return request({
        url: pigMeasure.updatePmInspectionSheet,
        method: 'post',
        data
    })
}

// 多个移除样本
export function deleteBatchPmInspectionDetail(data) {
    return request({
        url: pigMeasure.deleteBatchPmInspectionDetail,
        method: 'post',
        data
    })
}

// 单个移除样本
export function deletePmInspectionDetail(data) {
    return request({
        url: pigMeasure.deletePmInspectionDetail,
        method: 'post',
        data
    })
}

// 确认添加样本
export function createPmInspectionSheetDetail(data) {
    return request({
        url: pigMeasure.createPmInspectionSheetDetail,
        method: 'post',
        data
    })
}

// 查询添加样本
export function getPmPigSamplCollect(params) {
    return request({
        url: pigMeasure.getPmPigSamplCollect,
        method: 'get',
        params
    })
}

// 送检查看详情
export function getPmInspectionSheetDetails(params) {
    return request({
        url: pigMeasure.getPmInspectionSheetDetails,
        method: 'get',
        params
    })
}
// 创建送检单
export function createPmInspectionSheet(data) {
    return request({
        url: pigMeasure.createPmInspectionSheet,
        method: 'post',
        data
    })
}


// 送检单列表
export function getPmInspectionSheetPageList(params) {
    return request({
        url: pigMeasure.getPmInspectionSheetPageList,
        method: 'get',
        params
    })
}

//  --- 采样 ---

// 采样列表的单个编辑
export function updateBatchPmPigSpSamplcollect(data) {
    return request({
        url: pigMeasure.updateBatchPmPigSpSamplcollect,
        method: 'post',
        data
    })
}

// 采样列表的批量编辑
export function updatePmPigSpSamplcollect(data) {
    return request({
        url: pigMeasure.updatePmPigSpSamplcollect,
        method: 'post',
        data
    })
}

// 采样登记
export function createPmPigSpSamplcollect(data) {
    return request({
        url: pigMeasure.createPmPigSpSamplcollect,
        method: 'post',
        data
    })
}

// 采样列表
export function getPmPigSpSamplcollectList(params) {
    return request({
        url: pigMeasure.getPmPigSpSamplcollectList,
        method: 'get',
        params
    })
}


//  ---  检测 ---
// 编辑
export function updatePmPhysicalExamination(data) {
    return request({
        url: pigMeasure.updatePmPhysicalExamination,
        method: 'post',
        data
    })
}

// 登记
export function createPmPhysicalExamination(data) {
    return request({
        url: pigMeasure.createPmPhysicalExamination,
        method: 'post',
        data
    })
}
// 多个单独登记
export function batchCreatePmPhysicalExamination(data) {
    return request({
        url: pigMeasure.batchCreatePmPhysicalExamination,
        method: 'post',
        data
    })
}

// 登记获取猪猪详情
export function getDetailById(params) {
    return request({
        url: pigMeasure.getDetailById,
        method: 'get',
        params
    })
}


// 检测列表
export function getPigMeasureListApi(parameter) {
    return request({
        url: pigMeasure.getPigloveTimeList,
        method: 'get',
        params: parameter
    })
}

// 检测选项
export function getMeasureOptionsApi(parameter) {
    return request({
        url: pigMeasure.getMeasureOptions,
        method: 'get',
        params: parameter
    })
}

// 检测表头
export function getTableColumnsApi(parameter) {
    return request({
        url: pigMeasure.getTableColumns,
        method: 'get',
        params: parameter
    })
}
// 保存
export function addPigloveTimeApi(data) {
    return request({
        url: pigMeasure.addPigloveTime,
        method: 'post',
        data: data
    })
}

// 删除单个配种
export function deleteloveTimeApi(data) {
    return request({
        url: pigMeasure.deleteloveTime,
        method: 'post',
        data: data
    })
}

// 批量选配
export function batchMatchingApi(data) {
    return request({
        url: pigMeasure.batchMatching,
        method: 'post',
        data: data
    })
}

// 查询单个母猪信息
export function getPigFileDetailApi(parameter) {
    return request({
        url: pigMeasure.getPigFileDetail,
        method: 'get',
        params: parameter
    })
}



/**
 * 偏好设置相关
 * 
 * 
 */

// 偏好设置-检测类型列表
export function getMeasureTypeListApi(parameter) {
    return request({
        url: pigMeasure.getMeasureTypeList,
        method: 'get',
        params: parameter
    })
}

export function getMeasureTemplateApi(parameter) {
    return request({
        url: pigMeasure.getMeasureTemplate,
        method: 'get',
        params: parameter
    })
}
export function getMeasureTypeDetailApi(parameter) {
    return request({
        url: pigMeasure.getMeasureTypeDetail,
        method: 'get',
        params: parameter
    })
}

export function getPmDictByName(params) {
    return request({
        url: pigMeasure.getPmDictByName,
        method: 'get',
        params
    })
}

export function addMeasureTypeApi(data) {
    return request({
        url: pigMeasure.addMeasureType,
        method: 'post',
        data: data
    })
}

export function upDataMeasureTypeApi(data) {
    return request({
        url: pigMeasure.upDataMeasureType,
        method: 'post',
        data: data
    })
}
export function upDataMeasureTypeStatusApi(data) {
    return request({
        url: pigMeasure.upDataMeasureTypeStatus,
        method: 'post',
        data: data
    })
}






