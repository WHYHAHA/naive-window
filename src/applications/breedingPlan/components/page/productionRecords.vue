<template>
    <div>
        <n-grid x-gap="12" :cols="2">
            <!-- 左侧 -->
            <n-gi>
                <div class="tabHeader">
                    <n-space align="center">
                        <div>{{ $t("dtables.listing.productionOfTheSow") }}：</div>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                    </n-space>
                </div>
                <tableComponents
                    :columns="columns"
                    :data="productionList"
                    :loading="showloading"
                    :scroll-x="1500"
                    v-model:search="search"
                    @update:filters="handleFiltersChange"
                    @update:search="getProductionRecordsList"
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
                        <!-- 母猪编码 -->
                        <n-descriptions-item :label="$t('dataTable.listing.sowCode')">{{
                            productionDetail.detail.pigCode
                        }}</n-descriptions-item>
                        <!-- 窝号 -->
                        <n-descriptions-item :label="$t('dataTable.listing.dens')">{{
                            productionDetail.detail.nestNumber
                        }}</n-descriptions-item>
                        <!-- 生产日期 -->
                        <n-descriptions-item :label="$t('dtables.listing.theDateOfProduction')">{{
                            productionDetail.detail.createDatetime
                        }}</n-descriptions-item>
                        <!-- 窝重： -->
                        <n-descriptions-item :label="$t('dataTable.listing.nestWeight')">{{
                            productionDetail.detail.nestWeight
                        }}</n-descriptions-item>
                        <!-- 助产： -->
                        <n-descriptions-item :label="$t('dataTable.listing.midwifery')">{{
                            productionDetail.detail.assist
                        }}</n-descriptions-item>
                        <!-- 接生人员： -->
                        <n-descriptions-item :label="$t('dataTable.listing.birthAttendants')">{{
                            productionDetail.detail.staffCode
                        }}</n-descriptions-item>
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
                                @update:page="getProductionRecordsDetail()"
                                @update:pageSize="getProductionRecordsDetail()"
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
            apiUrl="exportProductionRecordsApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getProductionRecordsListApi,
        getProductionRecordsDetailApi
    } from "@/api/breedingPlan.js"
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
            // 获取生产列表
            const getProductionRecordsList = async () => {
                state.showloading = true
                await getProductionRecordsListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.productionList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取生产详情
            const getProductionRecordsDetail = async row => {
                state.rightSearch.productionId = row.productionId
                await getProductionRecordsDetailApi(state.rightSearch).then(res => {
                    if (res.code == 0) {
                        state.productionDetail.list = res.data.list
                        state.productionDetail.detail = {
                            pigCode: row.pigCode,
                            nestNumber: row.nestNumber,
                            createDatetime: row.childbirthDate,
                            nestWeight: row.nestWeight,
                            assist: row.assist,
                            staffCode: row.staffCode
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
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.theProductionType")
                        },
                        key: "productionType",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "productionType",
                                row.productionType
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.litterSize")
                        },
                        key: "farrowingCount"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.theHealthyMan")
                        },
                        key: "good"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.stillbirth")
                        },
                        key: "stillbirthCount"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.theMummy")
                        },
                        key: "mummyCount"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.nestWeight")
                        },
                        key: "nestWeight"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.staffCode")
                        },
                        key: "staffCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        onClick: () => {
                                            getProductionRecordsDetail(row)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]
                state.detailColumns = [
                    {
                        title: "#",
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        title: t("dataTable.listing.dateOfBirth"),
                        key: "bornDate",
                        render(row) {
                            return helper.timestampToTime(row.bornDate)
                        }
                    },
                    {
                        title: t("dataTable.listing.gender"),
                        key: "gender",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        title: t("dataTable.listing.whetherTheMidwifery"),
                        key: "midwifery",
                        render(row) {
                            return row.midwifery == "1" ? "是" : "否"
                        }
                    },
                    {
                        // 体重
                        title: t("dataTable.listing.weight"),
                        key: "bwt"
                    },
                    {
                        // 状态
                        title: t("dtables.listing.status"),
                        key: "status",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "bornStatus",
                                row.status
                            )
                        }
                    }
                ]
            }
            onMounted(() => {
                setColumns()
                getProductionRecordsList()
            })
            return {
                ...toRefs(state),
                getProductionRecordsList,
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    state.search.page = 1
                    getProductionRecordsList()
                }
            }
        }
    })
</script>
<style lang=""></style>
