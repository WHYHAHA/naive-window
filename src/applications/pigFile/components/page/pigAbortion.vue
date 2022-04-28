<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.abortionForDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigAbortion()
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
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigAbortion"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigAbortionRegisterApi } from "@/api/pigAbortion.js"
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
                    // 下床记录日期开始时间abortionDatetime
                    abortionDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 下床记录日期结束时间
                    abortionDatetimeLte: helper.formatEndTamp(Date.now()),
                    nowFarmidList: [],
                    nowDormCodeList: [],
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigAbortionList: []
            })

            const changeMemorabilia = inject("changeMemorabilia")
            // 获取流产列表
            const getPigAbortion = async () => {
                state.search.abortionDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.abortionDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigAbortionRegisterApi(state.search).then(res => {
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
                        type: "selection"
                    },
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.Farm"),
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
                        title: () => t("dataTable.listing.Dorm"),
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
                        title: () => t("dataTable.listing.column"),
                        key: "nowColumnCode"
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
                        title: () => t("dataTable.listing.breedingDate"),
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.breedingBatch"),
                        key: "breedingBatchNumber"
                    },
                    {
                        title: () => t("dataTable.listing.parity"),
                        key: "parity"
                    },
                    {
                        title: () => t("dataTable.listing.abortionDate"),
                        key: "abortionDatetime",
                        render(row) {
                            return helper.timestampToTime(row.abortionDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.registrant"),
                        key: "createid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigAbortion()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigAbortion,
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
                handleFiltersChange(filters, sourceColumn) {
                    if (sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = filters.nowFarmid
                    }
                    if (sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = filters.nowDormCode
                    }
                    if (sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = filters.pigSources
                    }
                    state.search.page = 1
                    getPigAbortion()
                }
            }
        }
    })
</script>
<style lang=""></style>
