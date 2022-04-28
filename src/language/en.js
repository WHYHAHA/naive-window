
import global from './en-US/global'

// 用户相关
import user from './en-US/user/user'
// 列表列头
import dataTable from './en-US/dataTable/listing'
// 仪表盘
import dashboard from './en-US/dashboard/analysis'
// 表单
import form from './en-US/form/basicForm'
// 确认弹框
import result from './en-US/result'
// 账户
import account from './en-US/account/settings'
// button
import button from './en-US/button/button'
// login
import login from './en-US/login/login'
// message
import message from './en-US/message/message'

export default {
    ...login,
    ...message,
    ...button,
    ...dataTable,
    ...global,
    ...user,
    ...dashboard,
    ...form,
    ...result,
    ...account
}

// module.exports = {
//     // 种猪管理档案
//     pigFile: {
//         page_title: 'Breeding pig management file',
//         clearFilters: 'Clear all filters',
//         actions: 'action',
//         viewDetail: 'View detail',
//         // 所有列表列名
//         fileCoding: 'File Coding',
//         studEarringsCoding: 'Stud Earrings Coding',
//         dateOfBirth: 'Date of birth',
//         species: 'Species',
//         hybridGeneration: 'Hybrid Generation',
//         gender: 'Gender',
//         fatherId: 'Father ID',
//         motherId: 'Mother ID',
//         batchNumber: 'Batch Number',
//         nestNumber: 'Nest Number',
//         breedingValue: 'Breeding Value',
//         breedingLevel: 'Breeding Level',
//         dormCode: 'Dorm Code',
//         pigStatus: 'Pig Status',
//         date: 'Date',
//         inPiggery: 'In Piggery',
//         inFence: 'In Fence',
//         troughCode: 'Trough Code',
//         beforeFeedingWeight: 'Before Feeding Weight',
//         afterFeedingWeight: 'After Feeding Weight',
//         scaleOfFeeding: 'Scale of feeding',
//         feedType: 'Feed Type',
//         dormType: 'Dorm Type',
//         reason: 'Reason',
//         registrant: 'Registrant',
//         physicalExaminationItem: 'Physical Examination Item',
//         equipmentNumber: 'Equipment Number',
//         itemValue: 'Value/Record',
//         operatingPersonnel: 'Operating Personnel',
//         remark: 'remark',
//         programCode: 'Program Code',
//         vaccineCommonType: 'Vaccine Common Type',
//         vaccineBrand: 'Vaccine Brand',
//         vaccineSpecCount: 'vaccine Spec Count',
//         symptom: 'symptom',
//         diagnosis: 'diagnosis',
//         drugCommonName: 'Drug Common Name',
//         drugSpecCount: 'DrugSpecCount',
//         studPlanCode: 'Stud Plan Code',
//         breedingStatus: 'Breeding Status',
//         dueDate: 'Due Date',
//         semenCode: 'Semen Code',
//         pregnnancyType: 'Pregnnancy Type',
//         parity: 'Parity',
//         bedDate: 'Bed Date',
//         bedNumber: 'Bed Number',
//         productionStatus: 'Production Status',
//         farrowingCount: 'Farrowing Count',
//         farrowingMaleCount: 'Farrowing Male Count',
//         farrowingFemaleCount: 'Farrowing Female Count',
//         stillbirthCount: 'Still Birth Count',
//         mummyCount: 'Mummy Count',
//         nestWeight: 'Nest Weight',
//         semenType: 'Semen Type',
//         containerCode: 'Container Code',
//         semenCount: 'Semen Count',


//         // 详情部分字段
//         pigCode: 'Pig code',
//         earTagCode: 'Ear tag code',
//         earBrandCode: 'Ear brand code',
//         noseColor: 'Nose color',
//         pigKeepStatus: 'Pig keep status',
//         overview: 'Over view',

//         // 所有记录
//         feedingRecords: 'Feeding records',
//         turnUpRecord: 'Turn up record',
//         physicalExaminationRecord: 'Physical examination record',
//         vaccineRecord: 'Vaccine record',
//         medicalRecord: 'Medical record',
//         breedingRecords: 'Breeding records',
//         pregnancyTestRecord: 'Pregnancy test record',
//         productionRecords: 'Production records',
//         semenCollectionRecords: 'Semen collection records'
//     }
// }