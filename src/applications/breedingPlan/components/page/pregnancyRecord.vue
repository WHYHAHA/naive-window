<template>
    <n-grid x-gap="12" :cols="2">
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dataTable.listing.pregnancyTestRecord") }}：</div>
                    <n-button type="info" class="col-2" @click="showExport = true">{{
                        $t("button.export")
                    }}</n-button>
                </n-space>
            </div>
            <n-space vertical>
                <tableComponents
                    :columns="columns"
                    :data="pregnancyList"
                    :loading="showloading"
                    :scroll-x="1000"
                    :clickIndex="leftClickIndex"
                    v-model:search="leftSearch"
                    @update:filters="handleFiltersChange"
                    @update:search="getPregnancyRecordList"
                ></tableComponents>
            </n-space>
        </n-gi>
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dtables.listing.recordDetails") }}：</div>
                    <n-button
                        v-if="pregnancyDetail.length > 0"
                        type="info"
                        class="col-2"
                        @click="showDetailExport = true"
                        >{{ $t("button.export") }}</n-button
                    >
                </n-space>
            </div>
            <n-space vertical v-if="pregnancyDetail.length > 0">
                <tableComponents
                    :columns="columns2"
                    :data="pregnancyDetail"
                    :loading="rightShowloading"
                    :scroll-x="1000"
                    v-model:search="rightSearch"
                    @update:search="getPregnancyRecordDetail"
                ></tableComponents>
            </n-space>
            <n-empty
                class="mt-3"
                :description="
                    $t('dtables.listing.no record, please click on the left to see details')
                "
                v-else
            ></n-empty>
        </n-gi>
    </n-grid>
    <!-- 列表导出 -->
    <exportComponents
        apiUrl="exportPigBatchPregnancyApi"
        :search="leftSearch"
        v-model:openExport="showExport"
    ></exportComponents>
    <!-- 详情导出 -->
    <exportComponents
        apiUrl="exportPigBatchDetailPregnancyApi"
        :search="rightSearch"
        v-model:openExport="showDetailExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { getPregnancyRecordListApi, getPregnancyRecordDetailApi } from "@/api/breedingPlan.js"
    import { NButton, useMessage, NSpace, NEllipsis } from "naive-ui"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"
    import helper from "@/utils/helper.js"

    import tableComponents from "@/components/table.vue"
    import exportComponents from "@/components/exExport.vue"

    export default defineComponent({
        name: "pregnancyRecord",
        props: {
            pageData: Object
        },
        components: {
            tableComponents,
            exportComponents
        },
        setup(props) {
            const store = useStore()
            const { t } = useI18n()
            const message = useMessage()
            const formRef = ref(null)
            const addformRef = ref(null)
            const state = reactive({
                showloading: false,
                showDetailExport: false,
                rightShowloading: false,
                showExport: false,
                columns: [],
                columns2: [],
                leftSearch: {
                    dormCodeList: [],
                    batchNumber: props.pageData.id,
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                rightSearch: {
                    pregnnancyDate: "",
                    dormCode: "",
                    batchNumber: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                leftClickIndex: -1,
                pregnancyList: [],
                pregnancyDetail: [],
                updateForm: {
                    id: undefined,
                    pigCode: undefined,
                    // 测孕类型
                    pregnancyCheckType: undefined,
                    //  测孕状态
                    pregnnancyType: undefined
                },
                addForm: {
                    id: undefined,
                    pigCode: undefined,
                    // 测孕类型
                    pregnancyCheckType: undefined,
                    //  测孕状态
                    pregnnancyType: undefined,
                    farmid: undefined,
                    dormCode: undefined,
                    columnCode: undefined
                }
            })
            // 获取测孕列表
            const getPregnancyRecordList = async () => {
                state.showloading = true
                await getPregnancyRecordListApi(state.leftSearch).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pregnancyList = res.data.list
                        state.leftSearch.page = res.data.pageNo
                        state.leftSearch.limit = res.data.limit
                        state.leftSearch.total = res.data.total
                    }
                })
            }

            // 获取测孕详情
            const getPregnancyRecordDetail = async (row, index) => {
                state.rightShowloading = true
                state.rightSearch.pregnnancyDate = row.pregnnancyDate
                state.rightSearch.dormCode = row.dormCode
                state.rightSearch.batchNumber = props.pageData.id

                await getPregnancyRecordDetailApi(state.rightSearch).then(res => {
                    state.rightShowloading = false
                    if (res.code == 0) {
                        message.info(t("dtables.listing.detailsDataHasBeenUpdated"))
                        if (index >= 0) state.leftClickIndex = index
                        state.pregnancyDetail = res.data.list
                    }
                })
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.date")
                        },
                        key: "pregnnancyDate",
                        render(row) {
                            return helper.timestampToTime(row.pregnnancyDate)
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
                            return t("dtables.listing.pregnancyTestNumberOfSows")
                        },
                        key: "sowPig"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.haveBeenPregnant")
                        },
                        key: "positive"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.suspected")
                        },
                        key: "negative"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.negative")
                        },
                        key: "emptyTire"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.executor")
                        },
                        key: "staffCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        onClick: () => {
                                            getPregnancyRecordDetail(row, index)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]
                state.columns2 = [
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.Farm"),
                        key: "farmid",
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmid)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.Dorm"),
                        key: "dormCode",
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.dormCode)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.column"),
                        key: "columnCode"
                    },
                    {
                        title: () => t("dataTable.listing.typeOfPregnancyTest"),
                        key: "pregnancyCheckType",
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
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyType",
                                row.pregnnancyType
                            )
                        }
                    }
                ]
            }
            onMounted(() => {
                setColumns()
                getPregnancyRecordList()
            })
            return {
                ...toRefs(state),
                formRef,
                addformRef,
                getPregnancyRecordList,
                getPregnancyRecordDetail,
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheSowEncoding"),
                        trigger: ["input"]
                    }
                },
                bodyStyle: {
                    width: "600px"
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "dormCode") {
                        state.leftSearch.dormCodeList = options.filters.dormCode
                    }
                    state.leftSearch.page = 1
                    getPregnancyRecordList()
                },
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                }
            }
        }
    })
</script>
<style lang=""></style>
