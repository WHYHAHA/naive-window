<template>
    <n-grid x-gap="12" :cols="2">
        <!-- 左侧 -->
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dtables.listing.generationOfSowMilk") }}：</div>
                    <n-button type="info" class="col-2" @click="showExport = true">{{
                        $t("button.export")
                    }}</n-button>
                </n-space>
            </div>
            <tableComponents
                :columns="columns"
                :data="productionList"
                :loading="showloading"
                :scroll-x="1000"
                v-model:search="search"
                @update:filters="handleFiltersChange"
                @update:search="getNursingRecordsList"
            ></tableComponents>
        </n-gi>
        <!-- 右侧 -->
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dtables.listing.details") }}：</div>
                </n-space>
            </div>
            <n-space vertical>
                <n-descriptions
                    label-placement="left"
                    bordered
                    :column="3"
                    size="small"
                    v-if="productionDetail.detail.pigCode"
                >
                    <n-descriptions-item :label="$t('dataTable.listing.sowCode')">{{
                        productionDetail.detail.pigCode
                    }}</n-descriptions-item>
                    <n-descriptions-item :label="$t('dtables.listing.ownNumberOfPiglets')">{{
                        productionDetail.detail.biologicalCount
                    }}</n-descriptions-item>
                    <n-descriptions-item
                        :label="$t('dtables.listing.generationOfPigletsMilkQuantity')"
                        >{{ productionDetail.detail.withMilkCount }}</n-descriptions-item
                    >
                </n-descriptions>

                <n-space vertical v-if="productionDetail.list.length > 0">
                    <n-data-table
                        size="small"
                        :columns="detailColumns"
                        :data="productionDetail.list"
                    />
                    <n-space justify="end">
                        <n-pagination
                            v-model:page="search.page"
                            v-model:pageSize="search.limit"
                            :item-count="search.total"
                            show-size-picker
                            :page-sizes="[10, 20, 30, 40]"
                            show-quick-jumper
                            @update:page="getNursingRecordDetail()"
                            @update:pageSize="getNursingRecordDetail()"
                        />
                    </n-space>
                </n-space>
                <n-empty
                    class="mt-3"
                    :description="
                        $t('dtables.listing.no record, please click on the left to see details')
                    "
                    v-else
                ></n-empty>
            </n-space>
        </n-gi>
    </n-grid>

    <!-- 列表导出 -->
    <exportComponents
        apiUrl="exportNursingRecordApi"
        :search="search"
        v-model:openExport="showExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import { getNursingRecordsListApi, getNursingRecordDetailApi } from "@/api/breedingPlan.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"
    import tableComponents from "@/components/table.vue"
    import exportComponents from "@/components/exExport.vue"
    import helper from "@/utils/helper.js"

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
            const { t } = useI18n()
            const store = useStore()
            const message = useMessage()
            const state = reactive({
                showExport: false,
                showloading: false,
                columns: [],
                detailColumns: [],
                search: {
                    batchNumber: props.pageData.id,
                    dormCode: undefined,
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                rightSearch: {
                    productionId: undefined,
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                productionList: [],
                productionDetail: {
                    detail: {},
                    list: []
                }
            })
            // 获取代奶列表
            const getNursingRecordsList = async () => {
                state.showloading = true
                await getNursingRecordsListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.productionList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取代奶详情
            const getNursingRecordDetail = async row => {
                state.rightSearch.ruttingCode = row.ruttingCode
                await getNursingRecordDetailApi(state.rightSearch).then(res => {
                    if (res.code == 0) {
                        state.productionDetail.list = res.data.list
                        state.productionDetail.detail = {
                            pigCode: row.pigCode,
                            biologicalCount: row.biologicalCount,
                            withMilkCount: row.withMilkCount
                        }
                        state.rightSearch.page = res.data.pageNo
                        state.rightSearch.limit = res.data.limit
                        state.rightSearch.total = res.data.total
                        // message.success('已导入左侧数据！')
                    }
                })
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.date")
                        },
                        key: "childbirthDate",
                        render(row) {
                            return helper.timestampToTime(row.childbirthDate)
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
                        title: () => t("dataTable.listing.sowCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.dens"),
                        key: "nestNumber"
                    },
                    {
                        title: () => t("dtables.listing.biologicalPiglets"),
                        key: "biologicalCount"
                    },
                    {
                        title: () => t("dtables.listing.generationOfPigletsMilk"),
                        key: "withMilkCount"
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "staffCode"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        onClick: () => {
                                            getNursingRecordDetail(row)
                                        }
                                    },
                                    // 查看
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]
                state.detailColumns = [
                    {
                        title: () => t("dataTable.listing.pigletCode"),
                        key: "childPigCode"
                    },
                    {
                        title: () => t("dtables.listing.birthNest"),
                        key: "nestNumber"
                    },
                    {
                        title: () => t("dtables.listing.whetherTheGenerationOfMilk"),
                        key: "ifFormula",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "ifFormula",
                                row.ifFormula
                            )
                        }
                    },
                    {
                        title: () => t("dtables.listing.motherCoding"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.gender"),
                        key: "gender",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.formulaDate"),
                        key: "intoBarTime",
                        render(row) {
                            return helper.timestampToTime(row.intoBarTime)
                        }
                    },
                    {
                        title: () => t("dataTable.listing.operatingPersonnel"),
                        key: "staffCode"
                    }
                ]
            }
            onMounted(() => {
                setColumns()
                getNursingRecordsList()
            })
            return {
                ...toRefs(state),
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    state.search.page = 1
                    getNursingRecordsList()
                }
            }
        }
    })
</script>
<style lang=""></style>
