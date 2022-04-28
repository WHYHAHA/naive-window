import { getPigDictionariesApi, getPmFarmListApi, getPmDormListApi, getVaccineTypesApi, getpigSymptomsApi, getPigDrugsByIdApi, getUserListByTidApi, getAllDictionariesApi } from '@/api/public.js'
import helper from '../utils/helper.js'

export default {
    namespaced: true,

    state: {
        // 所有无联级关系的字典
        // 根据2-22日修改 目前获取全部字典包含 基础数据字典及场区(farmList)、栋舍(dormList)、栏位(columnList)、用户(userSelectList)
        // 不包含 症状、药品
        dictionaries: {},
        // 场区 list
        farmList: [],
        // 栋舍 list
        dormList: [],
        // 疫苗 list
        vaccineTypeList: [],
        // 症状 list
        symptomsList: [],
        // 对应症状的药品 List
        drugsList: [],
        // 全部药品
        allDrugsList: [],
        // 用户列表
        userSelectList: []

    },
    getters: {
        // 根据dictionaryKey获取对应字典列表
        getDictionaries: (state) => (dictionaryKey) => {
            return state.dictionaries[dictionaryKey]
        },
        // 根据dictionaryKey获取对应字典名称（特殊判断为症状，保健目的，保健品） 中英文转换对应页面显示
        getDictionarieName: (state) => (dictionaryKey, id) => {
            // 获取全局language
            const language = helper.getLocalstorage('language') || 'zh-CN'
            let name = ''
            if (state.dictionaries[dictionaryKey]) {
                state.dictionaries[dictionaryKey].forEach(element => {
                    if (dictionaryKey == 'pigSymptomsList') {
                        if (element.id == id) language == 'zh-CN' ? name = element.name : name = element.dictEngName || element.name
                    } else if (dictionaryKey == 'healthCarePurposeList') {
                        if (element.id == id) language == 'zh-CN' ? name = element.healthCarePurposeName : name = element.dictEngName || element.healthCarePurposeName
                    } else if (dictionaryKey == 'healthCareSettingsList') {
                        if (element.id == id) language == 'zh-CN' ? name = element.nameOfHealthProducts : name = element.dictEngName || element.nameOfHealthProducts
                    } else {
                        if (element.dictCode == id) language == 'zh-CN' ? name = element.dictName : name = element.dictEngName || element.dictName
                    }
                })
            }
            return name
        },
        getDictionarieZhName: (state) => (dictionaryKey, id) => {
            let name = ''
            state.dictionaries[dictionaryKey].forEach(element => {
                if (dictionaryKey == 'pigSymptomsList') {
                    if (element.id == id) name = element.name
                } else if (dictionaryKey == 'healthCarePurposeList') {
                    if (element.id == id) name = element.healthCarePurposeName
                } else if (dictionaryKey == 'healthCareSettingsList') {
                    if (element.id == id) name = element.nameOfHealthProducts
                } else {
                    if (element.dictCode == id) name = element.dictName
                }
            })
            return name
        },
        // 根据dictionaryKey获取对应字典Id
        getDictionarieId: (state) => (dictionaryKey, name) => {
            let id = ''
            if (state.dictionaries[dictionaryKey]) {
                state.dictionaries[dictionaryKey].forEach(element => {
                    if (element.dictName == name) id = element.dictCode
                })
            }
            return id
        },
        // 根据id获取对应 场区名称
        getFarmName: (state) => (id) => {
            let name = ''
            if (state.farmList.length > 0) {
                state.farmList.forEach(element => {
                    if (element.farmCode == id) name = element.farmName
                })
            }
            return name
        },
        // 根据id获取对应 栋舍名称
        getDormName: (state) => (id) => {
            let name = ''
            if (state.dormList.length > 0) {
                state.dormList.forEach(element => {
                    if (element.dormCode == id) name = element.dormName
                })
            }
            return name
        },
        // 根据FarmId获取对应 栋舍列表
        getDormListForFarmId: (state) => (farmId) => {
            let dormList = JSON.parse(JSON.stringify(state.dictionaries['dormList']))
            if (farmId) {
                return dormList.filter((item) => {
                    return item.farmCode == farmId
                })
            }
            return dormList
        },
        // 根据DormId获取对应 栋舍列表
        getColumnListForDormId: (state) => (dormId) => {
            let columnList = JSON.parse(JSON.stringify(state.dictionaries['columnList']))
            if (dormId) {
                return columnList.filter((item) => {
                    return item.dormCode == dormId
                })
            }
            return columnList
        },
        // 根据id获取对应 疫苗名称
        getVaccineTypeName: (state) => (id) => {
            let name = ''
            if (state.vaccineTypeList.length > 0) {
                state.vaccineTypeList.forEach(element => {
                    if (element.vaccineCode == id) name = element.vaccineCommonName
                })
            }
            return name
        },
        // 根据id获取对应 症状
        getSymptomName: (state) => (id) => {
            let name = ''
            if (state.symptomsList.length > 0) {
                state.symptomsList.forEach(element => {
                    if (element.id == id) name = element.name
                })
            }
            return name
        },
        // 根据id获取对应 症状中的药品名称
        getDrugName: (state) => (id) => {
            let name = ''
            if (state.drugsList.length > 0) {
                state.drugsList.forEach(element => {
                    if (element.id == id) name = element.commonName
                })
            }
            return name
        },
        // 根据id获取对应 药品(所有药品中)
        getAllDrugName: (state) => (id) => {
            let name = ''
            if (state.allDrugsList.length > 0) {
                state.allDrugsList.forEach(element => {
                    if (element.id == id) name = element.commonName
                })
            }
            return name
        },

        // 根据用户名字获取对应Id
        getUserId: (state) => (name) => {
            let id = ''
            if (state.userSelectList.length > 0) {
                state.userSelectList.forEach(element => {
                    if (element.name == name) id = element.id
                })
            }
            return id
        },

        // 根据用户id获取对应Name
        getUserName: (state) => (id) => {
            let name = ''
            if (state.userSelectList.length > 0) {
                state.userSelectList.forEach(element => {
                    if (element.id == id) name = element.name
                })
            }
            return name
        },

    },

    mutations: {
        SET_DICTIONARIES: (state, item) => {
            state.dictionaries[item.dictionaryKey] = item.dictionary
        },
        SET_FARMLIST: (state, result) => {
            state.farmList = result
        },
        SET_DORMLIST: (state, result) => {
            state.dormList = result
        },
        SET_VACCINETYPELIST: (state, result) => {
            state.vaccineTypeList = result
        },
        SET_SYMPTOMSLIST: (state, result) => {
            state.symptomsList = result
        },
        SET_DRUGSLIST: (state, result) => {
            state.drugsList = result
        },
        SET_ALLDRUGSLIST: (state, result) => {
            state.allDrugsList = result
        },
        SET_USERSELECTLIST: (state, result) => {
            state.userSelectList = result
        },
        SET_ALLDICTIONARIES: (state, result) => {
            state.dictionaries = result
        },
        SET_USERSELECTLISTTOALLDICTIONARIES: (state, result) => {
            state.dictionaries['userSelectList'] = result
        },

    },
    actions: {
        // 获取字典
        getPigDictionaries(context, key) {
            return new Promise((resolve, reject) => {
                getPigDictionariesApi({ dictLogo: key }).then(response => {
                    if (response.data.length > 0) {
                        response.data.forEach(element => {
                            element.label = element.dictName
                            element.value = element.dictCode
                        })
                        const result = response.data
                        context.commit("SET_DICTIONARIES", { dictionary: result, dictionaryKey: key })
                        resolve(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取猪场信息
        getPmFarmList(context) {
            return new Promise((resolve, reject) => {
                getPmFarmListApi().then(response => {
                    if (response.data.length > 0) {
                        response.data.forEach(element => {
                            element.label = element.farmName
                            element.value = element.farmCode
                        })
                        const result = response.data
                        context.commit("SET_FARMLIST", result)
                        resolve(response)
                    }

                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取栋舍信息
        getDormList(context) {
            return new Promise((resolve, reject) => {
                getPmDormListApi().then(response => {
                    response.data.forEach(element => {
                        element.label = element.dormName
                        element.value = element.dormCode
                    })
                    const result = response.data
                    context.commit("SET_DORMLIST", result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取疫苗种类信息
        getVaccineTypeList(context) {
            return new Promise((resolve, reject) => {
                getVaccineTypesApi().then(response => {
                    response.data.forEach(element => {
                        element.label = element.vaccineCommonName
                        element.value = element.vaccineCode
                    })
                    const result = response.data
                    context.commit("SET_VACCINETYPELIST", result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取所有字典 (window 自动获取)
        getAllDictionaries(context) {
            return new Promise((resolve, reject) => {
                getAllDictionariesApi().then(response => {
                    if (response.data) {
                        // 获取全局language
                        const language = helper.getLocalstorage('language') || 'zh-CN'
                        for (const key in response.data) {
                            if (Object.hasOwnProperty.call(response.data, key)) {
                                const element = response.data[key]
                                // 因为 dormList 与 dormList 在库表中不一致 导致label和val 需要做单独处理
                                switch (key) {
                                    case 'pigSymptomsList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.name : dicItem.label = dicItem.dictEngName || dicItem.name
                                            dicItem.value = dicItem.id
                                        })
                                        break
                                    case 'farmList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.farmName : dicItem.label = dicItem.dictEngName || dicItem.farmName
                                            dicItem.value = dicItem.farmCode
                                        })
                                        break
                                    case 'dormList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.dormName : dicItem.label = dicItem.dictEngName || dicItem.dormName
                                            dicItem.value = dicItem.dormCode
                                        })
                                        break
                                    case 'columnList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.columnCode : dicItem.label = dicItem.dictEngName || dicItem.columnCode
                                            dicItem.value = dicItem.columnCode
                                        })
                                        break

                                    case 'healthCarePurposeList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.healthCarePurposeName : dicItem.label = dicItem.dictEngName || dicItem.healthCarePurposeName
                                            dicItem.value = dicItem.id
                                        })
                                        break

                                    case 'healthCareSettingsList':
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.nameOfHealthProducts : dicItem.label = dicItem.dictEngName || dicItem.nameOfHealthProducts
                                            dicItem.value = dicItem.id
                                        })
                                        break

                                    default:
                                        element.forEach(dicItem => {
                                            language == 'zh-CN' ? dicItem.label = dicItem.dictName : dicItem.label = dicItem.dictEngName || dicItem.dictName
                                            dicItem.value = dicItem.dictCode
                                        })
                                        break
                                }

                            }
                        }
                        const result = response.data
                        context.commit("SET_ALLDICTIONARIES", result)
                        context.commit("SET_FARMLIST", result['farmList'])
                        context.commit("SET_DORMLIST", result['dormList'])
                        // context.commit("SET_VACCINETYPELIST", result['vaccineTypeList'])
                        resolve(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 根据type 获取对应症状列表
        // 1=目的,2=症状
        getPigSymptomsList(context, type) {
            return new Promise((resolve, reject) => {
                getpigSymptomsApi({ symptomsType: type }).then(response => {
                    response.data.forEach(element => {
                        element.label = element.name
                        element.value = element.id
                    })
                    const result = response.data
                    context.commit("SET_SYMPTOMSLIST", result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据id 获取对应症状的 用药列表  空id为全部药品
        // 1=目的,2=症状
        getPigDrugsList(context, data) {
            return new Promise((resolve, reject) => {
                getPigDrugsByIdApi({ symptomsType: data.symptomsType, id: data.id }).then(response => {
                    response.data.forEach(element => {
                        element.label = element.commonName
                        element.value = element.id
                    })
                    const result = response.data
                    data.id ? context.commit("SET_DRUGSLIST", result) : context.commit("SET_ALLDRUGSLIST", result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取下拉用户列表 
        getUserList(context) {
            return new Promise((resolve, reject) => {
                getUserListByTidApi().then(response => {
                    response.data.forEach(element => {
                        element.label = element.name
                        element.value = element.id
                    })
                    const result = response.data
                    context.commit("SET_USERSELECTLIST", result)
                    context.commit("SET_USERSELECTLISTTOALLDICTIONARIES", result)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

    }
}