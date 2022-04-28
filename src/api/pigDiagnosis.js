// 医疗-诊疗  相关APi
import request from '../utils/request'

const pigDiagnosis = {
    // get接口
    getpigDiagnosisList: '/ms-masterdata-consummer/pigRegister/{version}/getPigRegister',
    getPigConfirmedInformation:'/ms-masterdata-consummer/pigConfirmedInformation/{version}/getPigConfirmedInformation',
    getPigConfirmedInformationList:'/ms-masterdata-consummer/pigConfirmedInformation/{version}/getPigConfirmedInformationLists',
    getPigMedicalInformation:'/ms-masterdata-consummer/pigMedicalInformation/{version}/getPigMedicalInformation',
    deletePigMedicalInformationById:'/ms-masterdata-consummer/pigMedicalInformation/{version}/deletePigMedicalInformationById',
    getPigDrugsBySymptomsId:'/ms-masterdata-consummer/pigDrugs/{version}/getPigDrugsBySymptomsId',
    getSymptomsList:'/ms-masterdata-consummer/pigSymptoms/{version}/getSymptomsList',

    // post接口
    pigDiagnosis: '/ms-masterdata-consummer/pigConfirmedInformation/{version}/updatePigConfirmedInformation',
    createPigMedicalInformation: "/ms-masterdata-consummer/pigConfirmedInformation/{version}/createPigMedicalInformation",
    medicalUploadPictures:'/ms-masterdata-consummer/pigConfirmedInformation/{version}/uploadPictures',
    updatePigMedicalInformationById:'/ms-masterdata-consummer/pigMedicalInformation/{version}/updatePigMedicalInformationById'
}


// 诊疗列表
export function getpigDiagnosisApi(parameter) {
    return request({
        url: pigDiagnosis.getpigDiagnosisList,
        method: 'get',
        params: parameter
    })
}

// 查看详情
export function getPigConfirmedInformationApi(parameter) {
    return request({
        url: pigDiagnosis.getPigConfirmedInformation,
        method: 'get',
        params: parameter
    })
}

// 查看详情--没有分页的全部数据
export function getPigConfirmedInformationListApi(parameter) {
    return request({
        url: pigDiagnosis.getPigConfirmedInformationList,
        method: 'get',
        params: parameter
    })
}

// 确诊
export function pigDiagnosisApi(data) {
    return request({
        url: pigDiagnosis.pigDiagnosis,
        method: 'post',
        data: data
    })
}

//开药
export function createPigMedicalInformationApi(data) {
    return request({
        url: pigDiagnosis.createPigMedicalInformation,
        method: 'post',
        data: data
    })
}


//化验单上传
export function medicalUploadPicturesApi(data) {
    return request({
        url: pigDiagnosis.medicalUploadPictures,
        method: 'post',
        data: data
    })
}


// 获取单个猪的开药回显
export function getPigMedicalInformationApi(parameter) {
    return request({
        url: pigDiagnosis.getPigMedicalInformation,
        method: 'get',
        params: parameter
    })
}

// 药品删除
export function deletePigMedicalInformationByIdApi(parameter) {
    return request({
        url: pigDiagnosis.deletePigMedicalInformationById,
        method: 'get',
        params: parameter
    })
}

//开药编辑
export function updatePigMedicalInformationByIdApi(data) {
    return request({
        url: pigDiagnosis.updatePigMedicalInformationById,
        method: 'post',
        data: data
    })
}


// 获取所有症状
export function getSymptomsListApi(parameter) {
    return request({
        url: pigDiagnosis.getSymptomsList,
        method: 'get',
        params: parameter
    })
}


// 根据症状查询药品
export function getPigDrugsBySymptomsIdApi(parameter) {
    return request({
        url: pigDiagnosis.getPigDrugsBySymptomsId,
        method: 'get',
        params: parameter
    })
}




