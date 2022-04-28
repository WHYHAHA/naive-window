// 下床  相关APi
import request from '../utils/request'

const pigOutOfBed = {
    // get接口
    getPigOutOfBedList: '/ms-masterdata-consummer/PigOutOfBed/{version}/getPigOutOfBedPageLists',
    // post接口
    addPigOutOfBed: '/ms-masterdata-consummer/PigOutOfBed/{version}/addPigOutOfBed',
    updatePigOutOfBed: "/ms-masterdata-consummer/PigOutOfBed/{version}/updatePigOutOfBed"
}


// 下床列表
export function getPigOutOfBedListApi(parameter) {
    return request({
        url: pigOutOfBed.getPigOutOfBedList,
        method: 'get',
        params: parameter
    })
}
// 添加登记
export function addPigOutOfBedApi(data) {
    return request({
        url: pigOutOfBed.addPigOutOfBed,
        method: 'post',
        data: data
    })
}

// 修改登记
export function updatePigOutOfBedApi(data) {
    return request({
        url: pigOutOfBed.updatePigOutOfBed,
        method: 'post',
        data: data
    })
}




