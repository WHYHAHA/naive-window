import request from '../utils/request'
const varietiesOfStrain = {
    // get接口
    speciesList: '/ms-masterdata-consummer/PigSourcesStrain/{version}/getBySource',
    strainList: '/ms-masterdata-consummer/PigSourcesStrain/{version}/getPigSourcesStrainPage',
    withStrain: '/ms-masterdata-consummer/pmPregnancyTest/{version}/getAllDic',
    getMotherStrain: '/ms-masterdata-consummer/PigSourcesStrain/{version}/getMonther',


    // post接口
    withStrainData: '/ms-masterdata-consummer/PigSourcesStrain/{version}/createPigSourcesStrain',
    allSave: '/ms-masterdata-consummer/PigSourcesStrain/{version}/updatePigSourcesStrainComposite',
    deleteStrain: '/ms-masterdata-consummer/PigSourcesStrain/{version}/deletePigSourcesStrain'


}
// 新增品系
export function addwithStrainData(data) {
    return request({
        url: varietiesOfStrain.withStrainData,
        method: 'post',
        data: data
    })
}
// 获取父级字典列表
export function getspeciesList(parameter) {
    return request({
        url: varietiesOfStrain.speciesList,
        method: 'get',
        params: parameter
    })
}

// 获取父级字典列表
export function getstrainList(parameter) {
    return request({
        url: varietiesOfStrain.strainList,
        method: 'get',
        params: parameter
    })
}
// 获取父级品系
export function getwithStrain(parameter) {
    return request({
        url: varietiesOfStrain.withStrain,
        method: 'get',
        params: parameter
    })
}
// 获取母级品系
export function getMotherStrainApi(parameter) {
    return request({
        url: varietiesOfStrain.getMotherStrain,
        method: 'get',
        params: parameter
    })
}

// 全部保存提交
export function sendAllSave(data) {
    return request({
        url: varietiesOfStrain.allSave,
        method: 'post',
        data
    })
}

// 删除品系
export function deleteStrainList(data) {
    return request({
        url: varietiesOfStrain.deleteStrain,
        method: 'post',
        data
    })
}