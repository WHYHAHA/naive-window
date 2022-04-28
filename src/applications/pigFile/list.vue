<template>
    <div class="p-2">
        <!-- 种猪列表 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dashboard.analysis.pigsFile") }}</div>
                    <div>
                        <!-- <n-button type="warning" class="col-2 mr-1" @click="confirmMultipleStatus">{{$t('dtables.listing.batchConfirmation')}}</n-button> -->
                        <!-- <n-button type="info" class="col-2" @click="showAdd=true;clearForm()">{{$t('dataTable.listing.btnRegistration')}}</n-button> -->
                        <!-- <n-button class="col-2 ml-1 mr-1" type="info" @click="showImport=true">导入</n-button> -->
                        <n-button type="info" class="col-2" @click="clickExportXp">{{
                            $t("dtables.listing.derivedPedigree")
                        }}</n-button>
                    </div>
                </n-space>
            </template>
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space justify="space-between">
                    <n-space>
                        <n-space align="center">
                            {{ $t("dataTable.listing.dateOfBirth") }}：
                            <n-date-picker
                                v-model:value="timeList"
                                type="daterange"
                                :shortcuts="rangeShortcuts"
                                :is-date-disabled="disablePreviousDate"
                                @update:value="
                                    () => {
                                        search.page = 1
                                        getPigFileList()
                                    }
                                "
                                actions="['confirm']"
                            />
                            <!-- <n-button type="info" @click="showExport=true">{{$t('button.export')}}</n-button> -->
                        </n-space>
                    </n-space>
                    <div>
                        <n-input
                            :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                            autosize
                            style="min-width: 300px"
                            clearable
                            v-model:value="search.pigCodeLike"
                            @keyup.enter="getPigFileList"
                            @clear="
                                () => {
                                    search.pigCodeLike = ''
                                    getPigFileList()
                                }
                            "
                        >
                            <template #prefix>
                                <n-icon>
                                    <searchIcon />
                                </n-icon>
                            </template>
                        </n-input>
                    </div>
                </n-space>
            </div>
            <tableComponents
                :columns="columns"
                :data="tabData"
                :loading="showloading"
                :scroll-x="2500"
                :checkedRowKeys="tableCheckList"
                rowKey="pigCode"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigFileList"
            ></tableComponents>
        </n-card>

        <!-- 导出 -->
        <exportComponents
            fileName="种猪档案"
            apiUrl="exportPigArchivesApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 导出系谱 -->
        <exportComponents
            fileName="种猪系谱"
            apiUrl="exportPedigreeApi"
            :search="{ pigCodeList: tableCheckList }"
            v-model:openExport="showExportXp"
        ></exportComponents>

        <!-- 打印母猪卡 -->
        <printPigCardComponents ref="printPigCardRef"></printPigCardComponents>
    </div>
</template>
<script>
    import {
        h,
        defineComponent,
        reactive,
        toRefs,
        onMounted,
        onBeforeMount,
        computed,
        ref
    } from "vue"
    import { NButton, NSpace } from "naive-ui"
    import { getPigFileListApi } from "@/api/pigFile.js"
    import { getPigDictionariesApi } from "@/api/public.js"

    import { useI18n } from "vue-i18n"
    import { SearchOutlined as searchIcon } from "@vicons/antd"
    import { useStore } from "vuex"
    import { batchPrintSowCard } from "@/api/public.js"

    import helper from "@/utils/helper"
    import exportComponents from "@/components/exExport.vue"
    import tableComponents from "@/components/table.vue"
    import printPigCardComponents from "@/components/printPigCard.vue"

    export default defineComponent({
        name: "pigFileList",
        emits: ["gopage"],
        components: {
            searchIcon,
            exportComponents,
            tableComponents,
            printPigCardComponents
        },
        setup(props, { emit }) {
            const store = useStore()
            // const dialog = useDialog()
            const { t } = useI18n()
            const pigDictionaries = reactive({})
            const printPigCardRef = ref()
            const state = reactive({
                tableCheckList: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pigCodeLike: "",
                    genderList: [],
                    pigTypeList: [],
                    pigSourcesList: [],
                    pigStatusList: [],
                    breedingLevelList: [],
                    pigBornDateGteStr: "",
                    pigBornDateLteStr: ""
                },
                timeList: null,
                filterPigBornDate: "",
                tabData: [],
                columns: [],
                showloading: false,
                showExport: false,
                showExportXp: false,
                showBatchOut: false
            })
            const tagStr = computed(() => {
                return function (type) {
                    let searchData = state.search[type]
                    let typeRomeList = type.replace("List", "")
                    let tagStr = pigDictionaries[typeRomeList].filter(item =>
                        searchData.some(x => x == item.dictCode)
                    )
                    tagStr = tagStr.map(item => {
                        return item.dictName
                    })
                    return tagStr.toString() || t("dataTable.listing.notYet")
                }
            })
            // 获取字典
            const getPigDictionaries = async code => {
                await getPigDictionariesApi({ dictLogo: code }).then(res => {
                    if (res.code == 0) {
                        res.data.forEach(element => {
                            element.label = element.dictName
                            element.value = element.dictCode
                        })
                        pigDictionaries[code] = res.data
                        // table动态筛选
                        // 性别
                        if (code == "gender") {
                            let index = state.columns.findIndex(item => item.key == "gender")
                            state.columns[index].filterOptions = res.data.map(item => {
                                return { label: item.label, value: item.value }
                            })
                        }
                        //杂交带
                        if (code == "pigType") {
                            let index = state.columns.findIndex(item => item.key == "pigType")
                            state.columns[index].filterOptions = res.data.map(item => {
                                return { label: item.label, value: item.value }
                            })
                        }
                        //状态
                        if (code == "pigStatus") {
                            let index = state.columns.findIndex(item => item.key == "pigStatus")
                            state.columns[index].filterOptions = res.data.map(item => {
                                return { label: item.label, value: item.value }
                            })
                        }
                        //品种
                        if (code == "pigSources") {
                            let index = state.columns.findIndex(item => item.key == "pigSources")
                            state.columns[index].filterOptions = res.data.map(item => {
                                return { label: item.label, value: item.value }
                            })
                        }
                        //种猪等级
                        if (code == "breedingLevel") {
                            let index = state.columns.findIndex(item => item.key == "breedingLevel")
                            state.columns[index].filterOptions = res.data.map(item => {
                                return { label: item.label, value: item.value }
                            })
                        }
                    }
                })
            }
            // 获取列表
            const getPigFileList = async () => {
                state.showloading = true
                state.timeList
                    ? (state.search.pigBornDateGteStr = helper.formatStartTamp(state.timeList[0]))
                    : ""
                state.timeList
                    ? (state.search.pigBornDateLteStr = helper.formatEndTamp(state.timeList[1]))
                    : ""
                await getPigFileListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.search.total = res.data.total
                        state.tabData = res.data.list
                        state.showloading = false
                    }
                })
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        type: "selection",
                        fixed: "left",
                        width: 10
                    },
                    {
                        // 个体号
                        title: () => {
                            return t("dataTable.listing.theIndividual")
                        },
                        key: "pigCode"
                    },
                    {
                        // 电子耳标号
                        title: () => {
                            return t("dtables.listing.electronicEarLabel")
                        },
                        key: "earTagCode"
                    },
                    {
                        // 场内编号
                        title: () => {
                            return t("dtables.listing.basedOnTheNumber")
                        },
                        key: "earBrandCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "pigStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                row.pigStatus
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.breedingStatus")
                        },
                        key: "breedingStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedingStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingStatus",
                                row.breedingStatus
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.KeepStatus")
                        },
                        key: "pigKeepStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigKeepStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigKeepStatus",
                                row.pigKeepStatus
                            )
                        }
                    },
                    {
                        // 当前场
                        title: () => {
                            return t("dtables.listing.theCurrentField")
                        },
                        key: "nowFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.nowFarmid)
                        }
                    },
                    {
                        // 当前栋舍
                        title: () => {
                            return t("dataTable.listing.nowDorm")
                        },
                        key: "nowDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.nowDormCode)
                        }
                    },
                    {
                        // 当前栏位
                        title: () => {
                            return t("dataTable.listing.nowColumn")
                        },
                        key: "nowColumnCode"
                    },

                    {
                        title: () => {
                            return t("dataTable.listing.species")
                        },
                        key: "pigSources",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigSources"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigSources",
                                row.pigSources
                            )
                        }
                    },
                    {
                        // 品种品系
                        title: () => {
                            return t("dataTable.listing.varietiesOfStrain")
                        },
                        key: "strain",
                        filter: true
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["gender"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.dateOfBirth")
                        },
                        key: "pigBornDate",
                        render(row) {
                            return helper.timestampToTime(row.pigBornDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedingLevel"]
                        }),
                        key: "breedingLevel",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingLevel",
                                row.breedingLevel
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },

                    {
                        title: () => {
                            return t("dataTable.listing.BornFarm")
                        },
                        key: "farmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmid)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.BornDorm")
                        },
                        key: "dormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.dormCode)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.BornColumn")
                        },
                        key: "columnCode"
                    },

                    {
                        title: () => {
                            return t("dataTable.listing.nestNumber")
                        },
                        key: "nestNumber"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        fixed: "right",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            const data = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                name: "种猪详情",
                                                pageUrl: "pigFile/detail"
                                            }
                                            emit("gopage", data)
                                        }
                                    },
                                    { default: () => t("button.viewDetail") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "success",
                                        text: true,
                                        onClick: async () => {
                                            // 在此获取已勾选的数据，与后台交互后获得打印的实体数据，直接通过print方法传入组件
                                            let res = await batchPrintSowCard({
                                                pigCodeList: [row.pigCode]
                                            })
                                            printPigCardRef.value.print(res.data || [])
                                        }
                                    },
                                    { default: () => t("dataTable.listing.printSowCard") }
                                )
                            ])
                        }
                    }
                ]
            }
            onBeforeMount(() => {
                //设置列表
                setTableColumns()
            })
            onMounted(() => {
                getPigFileList()
            })
            return {
                ...toRefs(state, pigDictionaries),
                tagStr,
                getPigFileList,
                printPigCardRef,
                getPigDictionaries,
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ],
                    近十年: [
                        new Date().setFullYear(new Date().getFullYear() - 10),
                        new Date().getTime()
                    ],
                    近二十年: [
                        new Date().setFullYear(new Date().getFullYear() - 20),
                        new Date().getTime()
                    ],
                    近五十年: [
                        new Date().setFullYear(new Date().getFullYear() - 50),
                        new Date().getTime()
                    ]
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(list) {
                    state.tableCheckList = list
                },

                // 导出系谱
                clickExportXp() {
                    if (!state.tableCheckList[0]) {
                        return window.$message.error(
                            t("dtables.listing.pleaseSelectAtLeastOneItem")
                        )
                    }

                    state.showExportXp = true
                },
                // 所有列表筛选
                handleFiltersChange(options) {
                    // 性别
                    if (options.sourceColumn.key == "gender") {
                        state.search.genderList = options.filters.gender
                    }
                    // 品种
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    // 状态
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    //杂交代
                    if (options.sourceColumn.key == "pigType") {
                        state.search.pigTypeList = options.filters.pigType
                    }
                    //种猪等级
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.dormCodeList = options.filters.nowDormCode
                    }
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.nowDormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "pigKeepStatus") {
                        state.search.pigKeepStatusList = options.filters.pigKeepStatus
                    }
                    if (options.sourceColumn.key == "breedingStatus") {
                        state.search.breedingStatusList = options.filters.breedingStatus
                    }
                    state.search.page = 1
                    getPigFileList()
                },
                handleCloseTag(tagName) {
                    state.search[tagName] = []
                    let typeRomeList = tagName.replace("List", "")
                    let findIndex = state.columns.findIndex(item => item.key == typeRomeList)
                    state.columns[findIndex].filterOptionValues = []
                    getPigFileList()
                }
            }
        }
    })
</script>
<style lang=""></style>
