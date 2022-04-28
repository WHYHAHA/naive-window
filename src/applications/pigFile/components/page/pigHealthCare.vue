<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dataTable.listing.communityCareForDetails") }}:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigHealthCareList()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigHealthCareList"
            :loading="showloading"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigHealthCareList"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, inject } from "vue"
    import { getPigHealthCareDetailApi } from "@/api/pigHealthCare.js"
    import { useStore } from "vuex"

    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"
    import { useI18n } from "vue-i18n"

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
                    // 开始时间
                    healthcareDateGte: helper.formatStartTamp(Date.now()),
                    // 结束时间
                    healthcareDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    healthcareScopeList: [],
                    healthcareGoalList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigHealthCareList: []
            })

            const changeMemorabilia = inject("changeMemorabilia")

            // 获取保健列表
            const getPigHealthCareList = async () => {
                state.search.healthcareDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.healthcareDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigHealthCareDetailApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigHealthCareList = res.data.list
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
                        // 种猪编码
                        title: () => t("dataTable.listing.pigCode"),
                        key: "pigCode"
                    },
                    {
                        // 保健用药
                        title: () => t("dataTable.listing.healthMedication"),
                        key: "healthcareMedication",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "healthcareMedication",
                                row.healthcareMedication
                            )
                        }
                    },
                    {
                        // 用药量
                        title: () => t("dataTable.listing.dosage"),
                        key: "medicationNumber"
                    },
                    {
                        // 操作人
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "operatorid"
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getPigHealthCareList()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigHealthCareList,
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
                    if (options.sourceColumn.key == "healthcareScope") {
                        state.search.healthcareScopeList = options.filters.healthcareScope
                    }
                    if (options.sourceColumn.key == "healthcareGoal") {
                        state.search.healthcareGoalList = options.filters.healthcareGoal
                    }
                    state.search.page = 1
                    getPigHealthCareList()
                }
            }
        }
    })
</script>
<style lang=""></style>
