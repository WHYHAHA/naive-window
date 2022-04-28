<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.pregnancyTestDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigPregnancyList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="bedList"
            :loading="showloading"
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigPregnancyList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigPregnancyListApi } from "@/api/pigPregnancy.js"
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
            const store = useStore()
            const formRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                showloading: false,
                timeList: [new Date().setFullYear(new Date().getFullYear() - 1), Date.now()],
                columns: [],
                search: {
                    // 测孕记录日期开始时间
                    pregnnancyDateGte: helper.formatStartTamp(
                        new Date().setFullYear(new Date().getFullYear() - 1)
                    ),
                    // 测孕记录日期结束时间
                    pregnnancyDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: "",
                    // 栋舍
                    dormCodeList: "",
                    // 品种
                    pigSourcesList: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                bedList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取查情记录列表
            const getPigPregnancyList = async () => {
                state.search.pregnnancyDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.pregnnancyDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigPregnancyListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.bedList = res.data.list
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
                        title: () => t("dataTable.listing.batchNumber"),
                        key: "batchNumber"
                    },
                    {
                        title: () => t("dataTable.listing.typeOfPregnancyTest"),
                        key: "pregnancyCheckType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnancyCheckType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnancyCheckType",
                                row.pregnancyCheckType
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.pregnancyTestResults"),
                        key: "pregnnancyType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnnancyType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyType",
                                row.pregnnancyType
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.currentState"),
                        key: "nowState",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnnancyStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyStatus",
                                row.nowState
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.Farm"),
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
                        title: () => t("dataTable.listing.Dorm"),
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
                        title: () => t("dataTable.listing.column"),
                        key: "columnCode"
                    },
                    {
                        title: () => t("dataTable.listing.species"),
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
                        title: () => t("dataTable.listing.strain"),
                        key: "strain"
                    },
                    {
                        title: () => t("dataTable.listing.pregnancyTestDate"),
                        key: "pregnnancyDate",
                        render(row) {
                            return helper.timestampToTime(row.pregnnancyDate)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.registrant"),
                        key: "createid"
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "staffCode"
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigPregnancyList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigPregnancyList,
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: "请输入种猪编号",
                        trigger: ["input"]
                    },
                    staffCode: {
                        required: true,
                        message: "请输入操作人",
                        trigger: ["input"]
                    },
                    mapplyDate: {
                        required: true,
                        message: "请选择发情日期"
                    }
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
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "pregnancyCheckType") {
                        state.search.pregnancyCheckTypeList = options.filters.pregnancyCheckType
                    }
                    if (options.sourceColumn.key == "pregnnancyType") {
                        state.search.pregnnancyTypeList = options.filters.pregnnancyType
                    }
                    if (options.sourceColumn.key == "nowState") {
                        state.search.pregnnancyStatusList = options.filters.nowState
                    }
                    state.search.page = 1
                    getPigPregnancyList()
                }
            }
        }
    })
</script>
<style lang=""></style>
