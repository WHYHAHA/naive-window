// 种猪转入  相关APi
import request from '../utils/request'

const pigRollIn = {
    // get接口
    getPigRollInList: '/ms-masterdata-consummer/pmPigDormRecord/{version}/getPigRollInRecordPageList',
    judge: '/ms-masterdata-consummer/pmPigDorm/{version}/getColumnNumPercentage',

    // post接口
    addPigRollIn: '/ms-masterdata-consummer/pmPigDormRecord/{version}/addPigTransferDormRecord',
    updatePigRollIn: '/ms-masterdata-consummer/pmPigDormRecord/{version}/updatePigTransferDormRecord',
    deletePigRollIn: '/ms-masterdata-consummer/pmPigDormRecord/{version}/deletePigTransferDormRecord',

}

// 判断是否进入栋舍
export function intoJudge(parameter) {
    return request({
        url: pigRollIn.judge,
        method: 'get',
        params: parameter
    })
}

// 转入列表
export function getPigRollInListApi(parameter) {
    return request({
        url: pigRollIn.getPigRollInList,
        method: 'get',
        params: parameter
    })
}
// 添加转入
export function addPigRollInApi(data) {
    return request({
        url: pigRollIn.addPigRollIn,
        method: 'post',
        data: data
    })
}

// 编辑转入
export function updatePigRollInApi(data) {
    return request({
        url: pigRollIn.updatePigRollIn,
        method: 'post',
        data: data
    })
}

// 删除转入
export function deletePigRollInApi(data) {
    return request({
        url: pigRollIn.deletePigRollIn,
        method: 'post',
        data: data
    })
}




