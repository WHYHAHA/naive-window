<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.generationOfMilkDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigFormulaList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="formulaList"
            :loading="showloading"
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigFormulaList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigFormulaListApi } from "@/api/pigFormula.js"
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
                    // 代奶记录日期开始时间
                    milkDateGte: helper.formatStartTamp(
                        helper.formatStartTamp(new Date().setFullYear(new Date().getFullYear() - 1))
                    ),
                    // 代奶记录日期结束时间
                    milkDateLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                formulaList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取断奶列表
            const getPigFormulaList = async () => {
                state.search.milkDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.milkDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigFormulaListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.formulaList = res.data.list
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
                        title: () => t("dataTable.listing.dateOfRegistration"),
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.sowBatch"),
                        key: "batchNumber"
                    },
                    {
                        title: () => t("dataTable.listing.pigletCode"),
                        key: "childPigCode"
                    },
                    {
                        title: () => t("dataTable.listing.PigletBatch"),
                        key: "productionBatch"
                    },
                    {
                        title: () => t("dataTable.listing.formulaDate"),
                        key: "milkDate",
                        render(row) {
                            return helper.timestampToTime(row.milkDate)
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
                getPigFormulaList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigFormulaList,
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
                    state.search.page = 1
                    getPigFormulaList()
                }
            }
        }
    })
</script>
<style lang=""></style>
