// 断奶  相关APi
import request from '../utils/request'

const pigAblactation = {
    // get接口
    getPigAblactationList: '/ms-masterdata-consummer/pigSpFarmwean/{version}/getPigletsWeanedList',
    // post接口
    addPigAblactation: '/ms-masterdata-consummer/pigSpFarmwean/{version}/addPigletsInformation',
    updatePigAblactation: "/ms-masterdata-consummer/pigSpFarmwean/{version}/updatePigletsInformation"
}


// 断奶列表
export function getPigAblactationListApi(parameter) {
    return request({
        url: pigAblactation.getPigAblactationList,
        method: 'get',
        params: parameter
    })
}

// 添加登记
export function addPigAblactationApi(data) {
    return request({
        url: pigAblactation.addPigAblactation,
        method: 'post',
        data: data
    })
}

// 修改登记
export function updatePigAblactationApi(data) {
    return request({
        url: pigAblactation.updatePigAblactation,
        method: 'post',
        data: data
    })
}



