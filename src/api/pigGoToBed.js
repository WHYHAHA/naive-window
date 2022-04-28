// 上床  相关APi
import request from '../utils/request'

const pigGoToBed = {
    // get接口
    getPigGoToBedList: '/ms-masterdata-consummer/pmPigBedRecord/{version}/getPmPigBedPageLists',
    ToProductionBatch: '/ms-masterdata-consummer/pmPigBedRecord/{version}/selectEditProductionBatch',
    // post接口
    addPigGoToBed: '/ms-masterdata-consummer/pmPigBedRecord/{version}/addPigBed',
    updatePigGoToBed: "/ms-masterdata-consummer/pmPigBedRecord/{version}/updatePigBed",
    modifyTheBatch: '/ms-masterdata-consummer/pmPigBedRecord/{version}/updateEditProductionBatch'
}


// 上床列表
export function getPigGoToBedListApi(parameter) {
    return request({
        url: pigGoToBed.getPigGoToBedList,
        method: 'get',
        params: parameter
    })
}
// 添加登记
export function addPigGoToBedApi(data) {
    return request({
        url: pigGoToBed.addPigGoToBed,
        method: 'post',
        data: data
    })
}

// 修改登记
export function updatePigGoToBedApi(data) {
    return request({
        url: pigGoToBed.updatePigGoToBed,
        method: 'post',
        data: data
    })
}

// 获取生产批次
export function getToProductionBatch(parameter) {
    return request({
        url: pigGoToBed.ToProductionBatch,
        method: 'get',
        params: parameter
    })
}

// 修改生产批次
export function modifyThemodifyTheBatch(data) {
    return request({
        url: pigGoToBed.modifyTheBatch,
        method: 'post',
        data: data
    })
}



