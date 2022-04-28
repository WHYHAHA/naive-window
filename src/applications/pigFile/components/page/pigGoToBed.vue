<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.goToDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigGoToBedList()
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
            @update:search="getPigGoToBedList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigGoToBedListApi } from "@/api/pigGoToBed.js"
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
                    // 上床时间 （开始时间）
                    bedTimeGte: helper.formatStartTamp(
                        helper.formatStartTamp(new Date().setFullYear(new Date().getFullYear() - 1))
                    ),
                    // 上床时间 （结束时间）
                    bedTimeLte: helper.formatStartTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                bedList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取查情记录列表
            const getPigGoToBedList = async () => {
                state.search.bedTimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.bedTimeLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigGoToBedListApi(state.search).then(res => {
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
                        type: "selection"
                    },
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.pigStatus"),
                        key: "status",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["bedStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "bedStatus",
                                row.bedStatus
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
                        title: () => t("dataTable.listing.batchNumber"),
                        key: "batchNumber"
                    },
                    {
                        title: () => t("dataTable.listing.breedingDate"),
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.dueDate"),
                        key: "dueDate",
                        render(row) {
                            return helper.timestampToTime(row.dueDate)
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
                getPigGoToBedList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigGoToBedList,
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
                    if (options.sourceColumn.key == "status") {
                        state.search.bedStatusList = options.filters.status
                    }
                    state.search.page = 1
                    getPigGoToBedList()
                }
            }
        }
    })
</script>
<style lang=""></style>
