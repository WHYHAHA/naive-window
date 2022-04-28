<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.rollOutTheDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigRollOutList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigAbortionList"
            :loading="showloading"
            :scroll-x="2500"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigRollOutList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigRollOutListApi } from "@/api/pigRollOut.js"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"

    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        props: {
            pigDetail: Object
        },
        components: {
            tableComponents
        },
        setup(props) {
            const { t } = useI18n()
            const store = useStore()
            const formRef = ref(null)
            const state = reactive({
                showloading: false,
                timeList: [new Date().setFullYear(new Date().getFullYear() - 1), Date.now()],
                columns: [],
                search: {
                    // 转舍时间 （开始时间）
                    recordDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 转舍时间 （结束时间）
                    recordDatetimeLte: helper.formatStartTamp(Date.now()),
                    // 转出场区
                    inFarmidList: [],
                    // 转出栋舍
                    inDormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    // 性别
                    genderList: [],
                    // 育种等级
                    breedingLevelList: [],
                    // 当前状态
                    pigStatusList: [],
                    // 来自场区
                    outFarmidList: [],
                    // 来自栋舍
                    dormCodeList: [],
                    // 转出来源
                    rollOutTypeList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigAbortionList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取流产列表
            const getPigRollOutList = async () => {
                state.search.recordDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.recordDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigRollOutListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigAbortionList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                        changeMemorabilia("")
                    }
                })
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.pigCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // 耳标编码
                        title: () => {
                            return t("dataTable.listing.studEarringsCoding")
                        },
                        key: "earTagCode"
                    },
                    {
                        // 耳牌
                        title: () => {
                            return t("dataTable.listing.earCard")
                        },
                        key: "earBrandCode"
                    },
                    {
                        // 状态
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
                        // 转出场区
                        title: () => {
                            return t("dataTable.listing.outFarm")
                        },
                        key: "outFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.outFarmid)
                        }
                    },
                    {
                        // 转出栋舍
                        title: () => {
                            return t("dataTable.listing.outDorm")
                        },
                        key: "outDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.outDormCode)
                        }
                    },
                    {
                        // 转出栏/床位
                        title: () => {
                            return t("dataTable.listing.outColumn")
                        },
                        key: "outColumnCode"
                    },
                    {
                        // 品种
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
                        // 品系
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // 性别
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
                        // 转出类型
                        title: () => {
                            return t("dataTable.listing.outType")
                        },
                        key: "rollOutType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["rollOutType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "rollOutType",
                                row.rollOutType
                            )
                        }
                    },
                    {
                        // 去向场区
                        title: () => {
                            return t("dataTable.listing.goFarm")
                        },
                        key: "inFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.inFarmid)
                        }
                    },
                    {
                        // 去向栋舍
                        title: () => {
                            return t("dataTable.listing.goDorm")
                        },
                        key: "inDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.inDormCode)
                        }
                    },
                    {
                        // 去向栏位/床位
                        title: () => {
                            return t("dataTable.listing.goColumn")
                        },
                        key: "inColumnCode"
                    },
                    {
                        // 出生日期
                        title: () => {
                            return t("dataTable.listing.dateOfBirth")
                        },
                        key: "pigBornDate",
                        render(row) {
                            return helper.timestampToTime(row.pigBornDate)
                        }
                    },
                    {
                        // 育种等级
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "breedingLevel",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedingLevel"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingLevel",
                                row.breedingLevel
                            )
                        }
                    },
                    {
                        // 育种值
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },
                    {
                        // 体重/kg
                        title: () => {
                            return t("dataTable.listing.weight") + "/kg"
                        },
                        key: "weightValue",
                        render(row) {
                            return row.weightValue || "--"
                        }
                    },
                    {
                        // 记录人
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    },
                    {
                        // 操作人
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "staffCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigRollOutList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigRollOutList,
                bodyStyle: {
                    width: "800px"
                },
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ]
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "inFarmid") {
                        state.search.inFarmidList = options.filters.inFarmid
                    }
                    if (options.sourceColumn.key == "inDormCode") {
                        state.search.inDormCodeList = options.filters.inDormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "gender") {
                        state.search.genderList = options.filters.gender
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    if (options.sourceColumn.key == "outFarmid") {
                        state.search.outFarmidList = options.filters.outFarmid
                    }
                    if (options.sourceColumn.key == "outDormCode") {
                        state.search.dormCodeList = options.filters.outDormCode
                    }
                    if (options.sourceColumn.key == "rollOutType") {
                        state.search.rollOutTypeList = options.filters.rollOutType
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigRollOutList()
                }
            }
        }
    })
</script>
<style lang=""></style>
