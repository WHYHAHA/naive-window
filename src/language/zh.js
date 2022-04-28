

import global from './zh-CN/global'

// 用户相关
import user from './zh-CN/user/user'
// 列表列头
import dataTable from './zh-CN/dataTable/listing'
// 仪表盘
import dashboard from './zh-CN/dashboard/analysis'
// 表单
import form from './zh-CN/form/basicForm'
// 确认弹框
import result from './zh-CN/result'
// 账户
import account from './zh-CN/account/settings'
// button
import button from './zh-CN/button/button'
// login
import login from './zh-CN/login/login'
// message
import message from './zh-CN/message/message'

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
//         page_title: '种猪管理档案',
//         clearFilters: '清空所有筛选',
//         actions: '操作',
//         viewDetail: '详情',
//         // 所有列表列名
//         fileCoding: '档案编码',
//         studEarringsCoding: '耳标编码',
//         dateOfBirth: '出生日期',
//         species: '品种',
//         hybridGeneration: '杂交代',
//         gender: '性别',
//         fatherId: '父亲ID',
//         motherId: '母亲ID',
//         batchNumber: '批次',
//         nestNumber: '窝号',
//         breedingValue: '育种值',
//         breedingLevel: '育种等级',
//         dormCode: '猪舍编号',
//         pigStatus: '状态',
//         date: '日期',
//         inPiggery: '所在栋舍',
//         inFence: '所在栏位',
//         troughCode: '料槽编码',
//         beforeFeedingWeight: '饲喂前体重',
//         afterFeedingWeight: '饲喂后体重',
//         scaleOfFeeding: '饲喂量',
//         feedType: '饲料型号',
//         dormType: '出入类型',
//         reason: '原因',
//         registrant: '登记人',
//         physicalExaminationItem: '体检项目',
//         equipmentNumber: '设备编号',
//         itemValue: "数值记录",
//         operatingPersonnel: '操作人员',
//         remark: '备注',
//         programCode: '计划编号',
//         vaccineCommonType: '疫苗类型',
//         vaccineBrand: '疫苗品牌',
//         vaccineSpecCount: "注射量",
//         symptom: '症状',
//         diagnosis: '确诊',
//         drugCommonName: '用药',
//         drugSpecCount: '药量',
//         studPlanCode: '配种计划编码',
//         breedingStatus: '怀孕状态',
//         dueDate: '预产期',
//         semenCode: '精液编码',
//         pregnnancyType: '怀孕状态',
//         parity: '胎次',
//         bedDate: '上床日期',
//         bedNumber: '产床编号',
//         productionStatus: '状态',
//         farrowingCount: '产仔数量',
//         farrowingMaleCount: '产仔（公）',
//         farrowingFemaleCount: '产仔（母）',
//         stillbirthCount: '死胎数',
//         mummyCount: '木乃伊胎',
//         nestWeight: '窝重',
//         semenType: '精液类型',
//         containerCode: '容器编码',
//         semenCount: '精液数量',






//         // 详情部分字段
//         pigCode: '编号',
//         earTagCode: '耳标号',
//         earBrandCode: '耳牌号',
//         noseColor: '鼻头颜色',
//         pigKeepStatus: '选留',
//         overview: '概览',

//         // 所有记录
//         feedingRecords: '饲喂记录',
//         turnUpRecord: '转舍记录',
//         physicalExaminationRecord: '体检记录',
//         vaccineRecord: '疫苗记录',
//         medicalRecord: '医疗记录',
//         breedingRecords: '配种记录',
//         pregnancyTestRecord: '测孕记录',
//         productionRecords: '生产记录',
//         semenCollectionRecords: '采精记录',
//     }
// }