// 系统偏好设置-栋舍  相关APi
import request from '../utils/request'

const dormManage = {
    // get接口
    getDormListByCode: '/ms-masterdata-consummer/pmPigDorm/{version}/getPmDormListByCode',
    getColumnList: '/ms-masterdata-consummer/PmPigDormColumn/{version}/getPmPigDormColumnList',
    batchCreatePmPigDormColumn: '/ms-masterdata-consummer/PmPigDormColumn/{version}/batchCreatePmPigDormColumn',

    // post接口
    createPmDorm: '/ms-masterdata-consummer/pmPigDorm/{version}/createPmDorm',
    creatPmFarm: '/ms-masterdata-consummer/pmPigFarm/{version}/creatPmFarm',
    createPmPigDormColumn: "/ms-masterdata-consummer/PmPigDormColumn/{version}/createPmPigDormColumn",
    updatePmDorm: '/ms-masterdata-consummer/pmPigDorm/{version}/updatePmDorm',
    updatePmColumn: '/ms-masterdata-consummer/PmPigDormColumn/{version}/updatePmPigDormColumnById'
}


// 获取栋舍列表
export function getDormListByCodeApi(parameter) {
    return request({
        url: dormManage.getDormListByCode,
        method: 'get',
        params: parameter
    })
}
// 获取栏位列表
export function getColumnListApi(parameter) {
    return request({
        url: dormManage.getColumnList,
        method: 'get',
        params: parameter
    })
}

// 添加场区
export function creatPmFarmApi(data) {
    return request({
        url: dormManage.creatPmFarm,
        method: 'post',
        data: data
    })
}
// 添加栋舍
export function createPmDormApi(data) {
    return request({
        url: dormManage.createPmDorm,
        method: 'post',
        data: data
    })
}

// 添加栏位
export function createPmPigDormColumnApi(data) {
    return request({
        url: dormManage.createPmPigDormColumn,
        method: 'post',
        data: data
    })
}
// 添加栏位 new
export function batchCreatePmPigDormColumnApi(data) {
    return request({
        url: dormManage.batchCreatePmPigDormColumn,
        method: 'post',
        data: data
    })
}



// 修改栋舍信息
export function updatePmDormApi(data) {
    return request({
        url: dormManage.updatePmDorm,
        method: 'post',
        data: data
    })
}

// 修改栏位信息
export function updatePmColumnApi(data) {
    return request({
        url: dormManage.updatePmColumn,
        method: 'post',
        data: data
    })
}







