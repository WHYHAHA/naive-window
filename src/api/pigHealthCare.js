// 保健  相关APi
import request from '../utils/request'

const pigHealthCare = {
    // get接口
    getPigHealthCareList: '/ms-masterdata-consummer/pigGroupHealthcare/{version}/readPigGroupHealthcare',
    getPigHealthCareDetail: '/ms-masterdata-consummer/pigHealthcareMedication/{version}/readPigHealthcareMedication',
    getHealthCareSettings: "/ms-masterdata-consummer/healthCarePurpose/{version}/getHealthCarePurpose",
    getHealthCareSettingsList: '/ms-masterdata-consummer/healthCareSettings/{version}/getHealthCareSettingsList',
    getHealthCarePurposeList: '/ms-masterdata-consummer/healthCarePurpose/{version}/getHealthCarePurposeList',
    // post接口
    addMedicine: '/ms-masterdata-consummer/pigHealthcareMedication/{version}/createPigHealthcareMedication',
    deleteMedicine: "/ms-masterdata-consummer/pigHealthcareMedication/{version}/deletePigHealthcareMedication",
    updateMedicine: '/ms-masterdata-consummer/pigHealthcareMedication/{version}/updatePigHealthcareMedication',
    addPigHealthCare: '/ms-masterdata-consummer/pigGroupHealthcare/{version}/createPigGroupHealthcare',
    updateAllMedication: '/ms-masterdata-consummer/pigHealthcareMedication/{version}/batchPigHealthcareMedication',
    addHealthCareSettings: '/ms-masterdata-consummer/healthCarePurpose/{version}/createHealthCarePurpose',
    updateHealthCareSettings: '/ms-masterdata-consummer/healthCarePurpose/{version}/updateHealthCarePurpose',
    updateAvailable: '/ms-masterdata-consummer/healthCarePurpose/{version}/updateAvailable',
    getHealthCareSettingsByPurposeId: '/ms-masterdata-consummer/healthCareSettings/{version}/getHealthCareSettingsByPurposeId',
    addbatchNo: '/ms-masterdata-consummer/pigGroupHealthcare/{version}/getAllBatchNumber',

}


// 群体保健列表
export function getPigHealthCareListApi(parameter) {
    return request({
        url: pigHealthCare.getPigHealthCareList,
        method: 'get',
        params: parameter
    })
}


// 创建群体保健
export function addPigHealthCareApi(data) {
    return request({
        url: pigHealthCare.addPigHealthCare,
        method: 'post',
        data: data,
        timeout: 0
    })
}

// 获取用药详情
export function getPigHealthCareDetailApi(parameter) {
    return request({
        url: pigHealthCare.getPigHealthCareDetail,
        method: 'get',
        params: parameter
    })
}


// 添加用药记录
export function addMedicineApi(data) {
    return request({
        url: pigHealthCare.addMedicine,
        method: 'post',
        data: data
    })
}

// 删除用药记录
export function deleteMedicineApi(data) {
    return request({
        url: pigHealthCare.deleteMedicine,
        method: 'post',
        data: data
    })
}

// 编辑用药记录
export function updateMedicineApi(data) {
    return request({
        url: pigHealthCare.updateMedicine,
        method: 'post',
        data: data
    })
}

// 一键全改
export function updateAllMedicationApi(data) {
    return request({
        url: pigHealthCare.updateAllMedication,
        method: 'post',
        data: data
    })
}

// 偏好设置-保健品列表
export function getHealthCareSettingsApi(parameter) {
    return request({
        url: pigHealthCare.getHealthCareSettings,
        method: 'get',
        params: parameter
    })
}

// 偏好设置-保健品新建
export function addHealthCareSettingsApi(data) {
    return request({
        url: pigHealthCare.addHealthCareSettings,
        method: 'post',
        data: data
    })
}

// 偏好设置-保健品编辑
export function updateHealthCareSettingsApi(data) {
    return request({
        url: pigHealthCare.updateHealthCareSettings,
        method: 'post',
        data: data
    })
}

// 偏好设置-状态修改
export function updateAvailableApi(data) {
    return request({
        url: pigHealthCare.updateAvailable,
        method: 'post',
        data: data
    })
}


// 偏好设置-保健品下拉
export function getHealthCareSettingsListApi(parameter) {
    return request({
        url: pigHealthCare.getHealthCareSettingsList,
        method: 'get',
        params: parameter
    })
}


//所有保健目的
export function getHealthCarePurposeListApi(parameter) {
    return request({
        url: pigHealthCare.getHealthCarePurposeList,
        method: 'get',
        params: parameter
    })
}


// 保健目的的对应药品
export function getHealthCareSettingsByPurposeIdApi(parameter) {
    return request({
        url: pigHealthCare.getHealthCareSettingsByPurposeId,
        method: 'get',
        params: parameter
    })
}

// 按批次号进行搜索
export function addbatchNoApi(parameter) {
    return request({
        url: pigHealthCare.addbatchNo,
        method: 'get',
        params: parameter

    })
}


