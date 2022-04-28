<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.intoTheDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigRollInList()
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
            @update:search="getPigRollInList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigRollInListApi } from "@/api/pigRollIn.js"
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
                    // 转入场区
                    inFarmidList: [],
                    // 转入栋舍
                    dormCodeList: [],
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
                    outDormCodeList: [],
                    // 转入来源
                    rollInSourceList: [],
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
            const getPigRollInList = async () => {
                state.search.recordDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.recordDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigRollInListApi(state.search).then(res => {
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
                            return t("dataTable.listing.fileCoding")
                        },
                        key: "pigCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.studEarringsCoding")
                        },
                        key: "earTagCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.earCard")
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
                        // title: '转入场区',
                        title: () => {
                            return t("dataTable.listing.inFarm")
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
                        // title: '转入栋舍',
                        title: () => {
                            return t("dataTable.listing.inDorm")
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
                        // title: '转入栏位',
                        title: () => {
                            return t("dataTable.listing.inColumn")
                        },
                        key: "inColumnCode"
                    },
                    {
                        // title: '品种',
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
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '性别',
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
                        // title: '转入来源',
                        title: () => {
                            return t("dataTable.listing.rollInSource")
                        },
                        key: "rollInSource",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["rollInSource"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "rollInSource",
                                row.rollInSource
                            )
                        }
                    },
                    {
                        // title: '来自场区',
                        title: () => {
                            return t("dataTable.listing.fromFarm")
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
                        // title: '来自栋舍',
                        title: () => {
                            return t("dataTable.listing.fromDorm")
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
                        // title: '来自栏位/床位',
                        title: () => {
                            return t("dataTable.listing.fromColumn")
                        },
                        key: "outColumnCode"
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
                getPigRollInList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigRollInList,
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
                        state.search.dormCodeList = options.filters.inDormCode
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
                        state.search.outDormCodeList = options.filters.outDormCode
                    }
                    if (options.sourceColumn.key == "rollInSource") {
                        state.search.rollInSourceList = options.filters.rollInSource
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigRollInList()
                }
            }
        }
    })
</script>
<style lang=""></style>
