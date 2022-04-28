// 医疗-用药登记  相关APi
import request from '../utils/request'

const PigDrugRegistration = {
    // get接口
    getPigDrugRegistrationList: '/ms-masterdata-consummer/PigDrugRegistration/{version}/getPigDrugRegistration',
    getConfirmedInformation:'/ms-masterdata-consummer/PigDrugRegistration/{version}/getConfirmedInformation',
    // post接口
    addMedicationDatatime: '/ms-masterdata-consummer/PigDrugRegistration/{version}/addMedicationDatatime',
    PigRegisterDetailsPigStatus: "/ms-masterdata-consummer/PigDrugRegistration/{version}/updatePigRegisterDetailsPigStatus"
}


// 用药登记列表
export function getPigDrugRegistrationListApi(parameter) {
    return request({
        url: PigDrugRegistration.getPigDrugRegistrationList,
        method: 'get',
        params: parameter
    })
}

//病情明细列表
export function getConfirmedInformationApi(parameter) {
    return request({
        url: PigDrugRegistration.getConfirmedInformation,
        method: 'get',
        params: parameter
    })
}

// 登记用药
export function addMedicationDatatimeApi(data) {
    return request({
        url: PigDrugRegistration.addMedicationDatatime,
        method: 'post',
        data: data
    })
}

// 登记病情
export function PigRegisterDetailsPigStatusApi(data) {
    return request({
        url: PigDrugRegistration.PigRegisterDetailsPigStatus,
        method: 'post',
        data: data
    })
}




