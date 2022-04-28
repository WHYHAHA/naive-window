// 代奶  相关APi
import request from '../utils/request'

const pigAblactation = {
    // get接口
    getPigFormulaList: '/ms-masterdata-consummer/PigWithMilk/{version}/getPigWithMilk',
    getPigChildDetail: '/ms-masterdata-consummer/PigWithMilk/{version}/pigWithMilkPigletCheck',
    getPigMotherDetail: '/ms-masterdata-consummer/PigWithMilk/{version}/pigWithMilkMotherCheck',
    // post接口
    addPigFormula: '/ms-masterdata-consummer/PigWithMilk/{version}/insertPigWithMilk',
    updatePigFormula: "/ms-masterdata-consummer/PigWithMilk/{version}/updatePigWithMilk"
}


// 代奶列表
export function getPigFormulaListApi(parameter) {
    return request({
        url: pigAblactation.getPigFormulaList,
        method: 'get',
        params: parameter
    })
}

// 查询单个母猪详情
export function getPigMotherDetailApi(parameter) {
    return request({
        url: pigAblactation.getPigMotherDetail,
        method: 'get',
        params: parameter
    })
}

// 查询单个仔猪详情
export function getPigChildDetailApi(parameter) {
    return request({
        url: pigAblactation.getPigChildDetail,
        method: 'get',
        params: parameter
    })
}

// 添加登记
export function addPigFormulaApi(data) {
    return request({
        url: pigAblactation.addPigFormula,
        method: 'post',
        data: data
    })
}

// 修改登记
export function updatePigFormulaApi(data) {
    return request({
        url: pigAblactation.updatePigFormula,
        method: 'post',
        data: data
    })
}



