// 死亡登记  相关APi
import request from '../utils/request'

const pigDeath = {
    // get接口
    getPigDeathList: '/ms-masterdata-consummer/pmPigCodePigDie/{version}/getPigCodePigDiePageList',
    // post接口
    addPigDeath: '/ms-masterdata-consummer/pmPigCodePigDie/{version}/addPigDieRecord',
    updatePigDeath: '/ms-masterdata-consummer/pmPigCodePigDie/{version}/updatePigDieRecord',
    deletePigDeath: '/ms-masterdata-consummer/pmPigCodePigDie/{version}/deletePigDieRecord',
}


// 死亡登记列表
export function getPigDeathListApi(parameter) {
    return request({
        url: pigDeath.getPigDeathList,
        method: 'get',
        params: parameter
    })
}
// 添加死亡登记
export function addPigDeathApi(data) {
    return request({
        url: pigDeath.addPigDeath,
        method: 'post',
        data: data
    })
}

// 编辑死亡登记
export function updatePigDeathApi(data) {
    return request({
        url: pigDeath.updatePigDeath,
        method: 'post',
        data: data
    })
}

// 删除死亡登记
export function deletePigDeathApi(data) {
    return request({
        url: pigDeath.deletePigDeath,
        method: 'post',
        data: data
    })
}




