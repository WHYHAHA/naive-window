<template>
    <div class="p-1">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{ $t("dtables.listing.vaccinesForDetails") }}：</div>
                <n-date-picker
                    v-model:value="timeList"
                    type="daterange"
                    :shortcuts="rangeShortcuts"
                    :is-date-disabled="disablePreviousDate"
                    @update:value="
                        () => {
                            search.page = 1
                            getPigVaccine()
                        }
                    "
                    actions="['confirm']"
                />
            </n-space>
        </div>
        <tableComponents
            :columns="columns"
            :data="pigVaccineList"
            :loading="showloading"
            :scroll-x="1800"
            v-model:search="search"
            @update:checked-row-keys="handleCheck"
            @update:filters="handleFiltersChange"
            @update:search="getPigVaccine"
        ></tableComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, inject } from "vue"
    import { getPigVaccineApi } from "@/api/pigVaccine.js"
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
                    // 开始时间
                    vaccinationDateGte: helper.formatStartTamp(Date.now()),
                    // 结束时间
                    vaccinationDateLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    vaccinationList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigVaccineList: []
            })
            const changeMemorabilia = inject("changeMemorabilia")
            // 获取疫苗接种列表
            const getPigVaccine = async () => {
                state.search.vaccinationDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.vaccinationDateLte = helper.formatEndTamp(state.timeList[1])
                state.search.pigCode = props.pigDetail.pigCode
                state.showloading = true
                // 动态id 查询(大事纪)
                const memorabilia = inject("memorabilia")
                state.search.id = memorabilia.value.id

                await getPigVaccineApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigVaccineList = res.data.list
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
                        title: () => t("dataTable.listing.vaccinationDate"),
                        key: "vaccinationDate",
                        render(row) {
                            return helper.timestampToTime(row.vaccinationDate)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.vaccineType"),
                        key: "vaccineCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.vaccineTypeList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getVaccineTypeName"](row.vaccineCode)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.pigCode"),
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
                        title: () => t("dataTable.listing.column"),
                        key: "columnCode"
                    },
                    {
                        title: () => t("dataTable.listing.registrant"),
                        key: "createid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
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
                getPigVaccine()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigVaccine,
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["input"]
                    },
                    staffCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["input"]
                    },
                    mapplyDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectADateOfEstrus")
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
                    if (options.sourceColumn.key == "vaccineCode") {
                        state.search.vaccinationList = options.filters.vaccineCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigVaccine()
                }
            }
        }
    })
</script>
<style lang=""></style>
