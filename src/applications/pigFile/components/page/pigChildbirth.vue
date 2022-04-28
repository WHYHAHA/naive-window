<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.deliveryDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigChildBirthList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigChildBirthList"
            :loading="showloading"
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigChildBirthList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigChildBirthListApi } from "@/api/pigChildBirth.js"
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
            const { t } = useI18n()
            const formRef = ref(null)
            const state = reactive({
                showloading: false,
                timeList: [new Date().setFullYear(new Date().getFullYear() - 1), Date.now()],
                columns: [],
                search: {
                    childbirthDateGte: "",
                    childbirthDateLte: "",
                    farmidList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    breedingLevelList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigChildBirthList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取分娩列表
            const getPigChildBirthList = async () => {
                state.search.childbirthDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.childbirthDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id
                await getPigChildBirthListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigChildBirthList = res.data.list
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
                        title: () => t("dataTable.listing.productionTime"),
                        key: "childbirthDate",
                        render(row) {
                            return helper.timestampToTime(row.childbirthDate)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
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
                        title: () => t("dtables.listing.getACode"),
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
                        title: () => t("dataTable.listing.quality"),
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
                        title: () => t("dataTable.listing.breedingBatch"),
                        key: "batchNumber"
                    },
                    {
                        title: () => t("dataTable.listing.dueDate"),
                        key: "dueDate",
                        render(row) {
                            return helper.timestampToTime(row.dueDate)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.deliveryType"),
                        key: "productionType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["productionType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "productionType",
                                row.productionType
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.litterSize"),
                        key: "litterSize"
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "staffCode"
                    },
                    {
                        title: () => t("dataTable.listing.registrant"),
                        key: "createid"
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigChildBirthList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigChildBirthList,
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
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "productionType") {
                        state.search.productionTypeList = options.filters.productionType
                    }
                    state.search.page = 1
                    getPigChildBirthList()
                }
            }
        }
    })
</script>
<style lang=""></style>
