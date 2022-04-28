<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.matingRecordDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigBreedingList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigBreedingList"
            :loading="showloading"
            :scroll-x="2400"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigBreedingList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigBreedingListforPigCodeApi } from "@/api/pigBreeding.js"

    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

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
                    // 发情日期 开始
                    breedingDatetimeGte: helper.formatStartTamp(
                        helper.formatStartTamp(new Date().setFullYear(new Date().getFullYear() - 1))
                    ),
                    breedingDatetimeLte: helper.formatEndTamp(Date.now()),
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
                pigBreedingList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取选配列表
            const getPigBreedingList = async () => {
                state.search.breedingDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.breedingDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true

                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id
                await getPigBreedingListforPigCodeApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigBreedingList = res.data.list
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
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
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
                            return t("dataTable.listing.breedingMode")
                        },
                        key: "breedMode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedMode"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedMode",
                                row.breedMode
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.breedingBatch")
                        },
                        key: "batchNumber"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.qestrusDate")
                        },
                        key: "matapplyDate",
                        render(row) {
                            return helper.timestampToTime(row.matapplyDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.optionalBoarMaster")
                        },
                        key: "semenCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.timesOfSpermInfusion")
                        },
                        key: "inseminationOrder",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["inseminationOrder"]
                        })
                    },
                    {
                        title: () => t("dataTable.listing.dateOfFirstInsemination"),
                        key: "firstbreedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.firstbreedingDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.lastInseminationDate"),
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.inseminationBoarCode"),
                        key: "semenCodeFair"
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "staffCode"
                    },
                    {
                        title: () => t("dataTable.listing.remark"),
                        key: "remark",
                        width: 100,
                        ellipsis: {
                            tooltip: true
                        }
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigBreedingList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigBreedingList,
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
                    getPigBreedingList()
                }
            }
        }
    })
</script>
<style lang=""></style>
