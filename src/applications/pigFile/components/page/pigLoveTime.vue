<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dataTable.listing.pigOestrusRecords") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigloveTimeList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="loveTimeList"
            :loading="showloading"
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigloveTimeList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigloveTimeListApi } from "@/api/pigloveTime.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "pigOverView",
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
                    // 发情日期 开始
                    mapplyDateGte: "",
                    mapplyDateLte: "",
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    // 当前状态
                    pigStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                loveTimeList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取查情记录列表
            const getPigloveTimeList = async () => {
                state.search.mapplyDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.mapplyDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigloveTimeListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.loveTimeList = res.data.list
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
                            return t("dataTable.listing.recordDate")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.qestrusType")
                        },
                        key: "mapplyType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["mapplyType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "mapplyType",
                                row.mapplyType
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.currentState")
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
                            return t("dataTable.listing.Farm")
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
                            return t("dataTable.listing.Dorm")
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
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
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
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.qestrusDate")
                        },
                        key: "mapplyDate",
                        render(row) {
                            return helper.timestampToTime(row.mapplyDate)
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
                            return t("dataTable.listing.parity")
                        },
                        key: "breedingBatch"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "staffCode"
                    }
                ]
            }

            onMounted(() => {
                getPigloveTimeList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigloveTimeList,
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
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    if (options.sourceColumn.key == "mapplyType") {
                        state.search.mapplyTypeList = options.filters.mapplyType
                    }
                    state.search.page = 1
                    getPigloveTimeList()
                }
            }
        }
    })
</script>
<style lang=""></style>
