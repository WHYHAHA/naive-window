// 系统偏好设置-栋舍  相关APi
import request from '../utils/request'

const dictionariesManage = {
    // get接口
    getFatherDictList: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getFatherDictList',
    getDictByFatherCode: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getDictByFatherCode',
    // post接口
    createFatherDict: '/ms-masterdata-consummer/pmPregnancyTest/{version}/createFatherDict',
    updateFatherDict: '/ms-masterdata-consummer/pmPregnancyTest/{version}/updateFatherDict',
    createChildDict: '/ms-masterdata-consummer/pmPregnancyTest/{version}/createChildDict',
    updateChildDict: '/ms-masterdata-consummer/pmPregnancyTest/{version}/updateChildDict'



}


// 获取父级字典列表
export function getFatherDictListApi(parameter) {
    return request({
        url: dictionariesManage.getFatherDictList,
        method: 'get',
        params: parameter
    })
}


// 新增父级字典信息
export function createFatherDictApi(data) {
    return request({
        url: dictionariesManage.createFatherDict,
        method: 'post',
        data: data
    })
}
// 新增子级字典信息
export function createChildDictApi(data) {
    return request({
        url: dictionariesManage.createChildDict,
        method: 'post',
        data: data
    })
}



// 修改父级字典信息
export function updateFatherDictApi(data) {
    return request({
        url: dictionariesManage.updateFatherDict,
        method: 'post',
        data: data
    })
}

// 修改子级字典信息
export function updateChildDictApi(data) {
    return request({
        url: dictionariesManage.updateChildDict,
        method: 'post',
        data: data
    })
}



// 获取子集字典信息
export function getDictByFatherCodeApi(parameter) {
    return request({
        url: dictionariesManage.getDictByFatherCode,
        method: 'get',
        params: parameter
    })
}






