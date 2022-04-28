<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>医疗详情:</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getpigDiagnosis()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigDiagnosisList"
            :loading="showloading"
            :scroll-x="2400"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getpigDiagnosis"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getMedicalForPigCodeApi } from "@/api/pigMedicalTreatment.js"

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
                    // 开始时间
                    registerDataGte: helper.formatStartTamp(Date.now()),
                    // 结束时间
                    registerDataLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    nowFarmidList: [],
                    // 栋舍
                    nowDormCodeList: [],
                    morbidityScopeList: [],
                    theIllnessDescribeList: [],
                    registerStateList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigDiagnosisList: []
            })

            const changeMemorabilia = inject("changeMemorabilia")
            // 获取诊疗列表
            const getpigDiagnosis = async () => {
                state.search.registerDataGte = helper.formatStartTamp(state.timeList[0])
                state.search.registerDataLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.listLoading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getMedicalForPigCodeApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.pigDiagnosisList = res.data.list
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
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.fileCoding")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "nowFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.nowFarmid) || "--"
                        }
                    },
                    {
                        // title: '栋舍',
                        title: () => {
                            return t("dataTable.listing.Dorm")
                        },
                        key: "nowDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getDormName"](row.nowDormCode) || "--"
                            )
                        }
                    },
                    {
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "nowColumnCode"
                    },
                    {
                        // title: '确诊病状',
                        title: () => {
                            return t("dataTable.listing.diagnosedDisease")
                        },
                        key: "confirmedCase",
                        ellipsis: {
                            tooltip: true
                        },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.symptomsList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getSymptomName"](row.confirmedCase) ||
                                "--"
                            )
                        }
                    },
                    {
                        // title: '用药名称',
                        title: () => {
                            return t("dataTable.listing.drugName")
                        },
                        key: "drugName",
                        ellipsis: {
                            tooltip: true
                        },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.allDrugsList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getAllDrugName"](row.drugName) || "--"
                            )
                        }
                    },
                    {
                        // title: '剂量/份',
                        title: () => {
                            return t("dataTable.listing.dose")
                        },
                        key: "dose"
                    },
                    {
                        // title: '频率（次/天）',
                        title: () => {
                            return t("dataTable.listing.frequency")
                        },
                        key: "frequency"
                    },
                    {
                        // title: '开始时间',
                        title: () => {
                            return t("dataTable.listing.startTime")
                        },
                        key: "startMedicationDatatime"
                    },
                    {
                        // title: '已用药量',
                        title: () => {
                            return t("dataTable.listing.usedDose")
                        },
                        key: "usedDose"
                    },
                    {
                        // title: '剩余用药量',
                        title: () => {
                            return t("dataTable.listing.residualDosage")
                        },
                        key: "residualDose"
                    },
                    {
                        // title: '本日已用',
                        title: () => {
                            return t("dataTable.listing.usedToday")
                        },
                        key: "usedToday"
                    },
                    {
                        // title: '上次用药时间',
                        title: () => {
                            return t("dataTable.listing.lastMedicationTime")
                        },
                        key: "medicationDatatime"
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
                getpigDiagnosis()
            })
            return {
                ...toRefs(state),
                formRef,
                getpigDiagnosis,
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
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = options.filters.nowDormCode
                    }
                    if (options.sourceColumn.key == "morbidityScope") {
                        state.search.morbidityScopeList = options.filters.morbidityScope
                    }
                    if (options.sourceColumn.key == "theIllnessDescribe") {
                        state.search.theIllnessDescribeList = options.filters.theIllnessDescribe
                    }
                    if (options.sourceColumn.key == "registerState") {
                        state.search.registerStateList = options.filters.registerState
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getpigDiagnosis()
                }
            }
        }
    })
</script>
<style lang=""></style>
