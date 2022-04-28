// 种猪转出  相关APi
import request from '../utils/request'

const pigRollOut = {
    // get接口
    getPigRollOutList: '/ms-masterdata-consummer/pmPigDormRecord/{version}/getPigRollOutRecordPageList',
    // post接口
    addPigRollOut: '/ms-masterdata-consummer/pmPigDormRecord/{version}/addPigRollOutDormRecord',
    updatePigRollOut: '/ms-masterdata-consummer/pmPigDormRecord/{version}/updatePigRollOutDormRecord',
    deletePigRollOut: '/ms-masterdata-consummer/pmPigDormRecord/{version}/deletePigRollOutDormRecord',
}


// 转出列表
export function getPigRollOutListApi(parameter) {
    return request({
        url: pigRollOut.getPigRollOutList,
        method: 'get',
        params: parameter
    })
}
// 添加转出
export function addPigRollOutApi(data) {
    return request({
        url: pigRollOut.addPigRollOut,
        method: 'post',
        data: data
    })
}

// 编辑转出
export function updatePigRollOutApi(data) {
    return request({
        url: pigRollOut.updatePigRollOut,
        method: 'post',
        data: data
    })
}

// 删除转出
export function deletePigRollOutApi(data) {
    return request({
        url: pigRollOut.deletePigRollOut,
        method: 'post',
        data: data
    })
}




