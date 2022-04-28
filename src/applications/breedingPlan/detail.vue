<template>
    <div class="p-2 breedingPlanDetail">
        <n-space vertical :size="20">
            <n-card>
                <n-breadcrumb>
                    <n-breadcrumb-item
                        v-for="(item, index) in pageData.breadcrumbList"
                        :key="index"
                        @click="goFatherPage(index, item)"
                        >{{ item.name }}</n-breadcrumb-item
                    >
                </n-breadcrumb>
            </n-card>
            <!-- 配种计划信息 -->
            <n-card>
                <div class="flex">
                    <div>
                        <img
                            :style="{ width: '150px' }"
                            src="https://cdn.bestgenetics.com.cn/common/bg/pigPlan.png"
                            alt
                            srcset
                        />
                    </div>
                    <div class="flex-1 ml-2">
                        <n-descriptions
                            label-placement="left"
                            :title="detail.batchNumber || $t('Table.listing.notYet')"
                        >
                            <n-descriptions-item :label="$t('datatable.listing.startDate')">{{
                                detail.startTime
                            }}</n-descriptions-item>
                            <n-descriptions-item :label="$t('datatable.listing.endDate')">{{
                                detail.endTime
                            }}</n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.planStatus')">{{
                                detail.planStatus
                            }}</n-descriptions-item>
                        </n-descriptions>
                    </div>
                </div>
            </n-card>
            <!-- 详细记录 -->
            <n-tabs :tab-style="tabStyle" :pane-style="paneStyle" size="large">
                <n-tab-pane :tab="$t('dtables.listing.anOverviewOfTheBatch')" name="1">
                    <planOverview
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></planOverview>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dtables.listing.hasForListing')" name="2">
                    <donePlan :pageData="pageData" :pigDictionaries="pigDictionaries"></donePlan>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dataTable.listing.pregnancyTestRecord')" name="3">
                    <pregnancyRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></pregnancyRecord>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dtables.listing.productionRecords')" name="4">
                    <productionRecords
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></productionRecords>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dtables.listing.moveRecord')" name="5">
                    <exceptionRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></exceptionRecord>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dataTable.listing.goToBedRecords')" name="6">
                    <toBedRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></toBedRecord>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dataTable.listing.outOfBedRecords')" name="7">
                    <outBedRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></outBedRecord>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dataTable.listing.pigFormulaRecords')" name="8">
                    <nursingRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></nursingRecord>
                </n-tab-pane>

                <n-tab-pane :tab="$t('dataTable.listing.pigAblactationRecords')" name="9">
                    <weaningRecord
                        :pageData="pageData"
                        :pigDictionaries="pigDictionaries"
                    ></weaningRecord>
                </n-tab-pane>
            </n-tabs>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, reactive, onMounted, toRefs } from "vue"
    import { getPigBreedingDetailApi } from "@/api/breedingPlan.js"

    // 批次概览
    import planOverview from "./components/page/planOverview.vue"
    // 已配母猪清单
    import donePlan from "./components/page/donePlan.vue"
    // 测孕记录
    import pregnancyRecord from "./components/page/pregnancyRecord.vue"
    // 生产记录
    import productionRecords from "./components/page/productionRecords.vue"
    // 异动记录
    import exceptionRecord from "./components/page/exceptionRecord.vue"
    // 代奶记录
    import nursingRecord from "./components/page/nursingRecord.vue"
    // 断奶记录
    import weaningRecord from "./components/page/weaningRecord.vue"
    // 上床记录
    import toBedRecord from "./components/page/goToBedRecord.vue"
    // 下床记录
    import outBedRecord from "./components/page/outBedRecord.vue"

    // 国际化
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            planOverview,
            donePlan,
            pregnancyRecord,
            productionRecords,
            exceptionRecord,
            nursingRecord,
            weaningRecord,
            toBedRecord,
            outBedRecord
        },
        setup(props, { emit }) {
            const state = reactive({
                search: {
                    pigCodeLike: ""
                },
                // 字典
                pigDictionaries: {},
                detail: {
                    batchNumber: props.pageData.id
                }
            })
            const { t } = useI18n()

            // 获取批次详情
            const getPigBreedingDetail = async () => {
                await getPigBreedingDetailApi({
                    batchNumber: props.pageData.id
                }).then(res => {
                    if (res.code == 0) {
                        state.detail = res.data
                    }
                })
            }
            onMounted(() => {
                getPigBreedingDetail()
            })
            return {
                ...toRefs(state),
                tabStyle: {
                    background: "#169BD5",
                    color: "white",
                    padding: "10px 20px",
                    borderColor: "#169BD5"
                },
                paneStyle: {
                    padding: "10px 20px",
                    background: "white"
                },
                contentStyle: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                },
                tabVal: "栋舍计划分配",
                // 去往配种登记(三级页面)
                goHybridization(item) {
                    const data = {
                        id: item.id,
                        name: "配种详情",
                        pageUrl: "breedingPlan/detail",
                        grandchildrenName: "登记配种",
                        grandchildrenPage: "breedingPlan/hybridization"
                    }
                    emit("gopage", data)
                },
                // 去往异动登记(三级页面)
                goException(item) {
                    const data = {
                        id: item.id,
                        name: "配种详情",
                        pageUrl: "breedingPlan/detail",
                        grandchildrenName: "异动登记",
                        grandchildrenPage: "breedingPlan/exception"
                    }
                    emit("gopage", data)
                },
                // 去往代奶登记(三级页面)
                goNursing(item) {
                    const data = {
                        id: item.id,
                        name: "配种详情",
                        pageUrl: "breedingPlan/detail",
                        grandchildrenName: "代奶登记",
                        grandchildrenPage: "breedingPlan/nursing"
                    }
                    emit("gopage", data)
                },

                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index == 0) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl
                        }
                        this.$emit("gopage", data)
                    } else {
                        window.$message.warning(t("dtables.listing.youHaveBeenInTheCurrentPage"))
                    }
                }
            }
        }
    })
</script>

<style lang="less" scoped>
    .breedingPlanDetail {
        padding-bottom: 40px;
        h2 {
            margin-bottom: 0;
        }
        .bg01 {
            background: #73d4f6;
        }
        .bg02 {
            background: #ffcc96;
        }
        .bg03 {
            background: #f27f8d;
        }
        .bg04 {
            background: #fffe8d;
        }
        .bg05 {
            background: #c082fa;
        }
        .n-tabs {
            border-width: 2px;
            :deep(.n-tabs-tab-pad) {
                width: 0 !important;
            }
            :deep(.n-tabs-nav) {
                background: #169bd5;
            }
            :deep(.n-tabs-bar) {
                background: white;
            }
            :deep(.n-tabs-tab--active) {
                background: white !important;
                color: #169bd5 !important;
            }
        }
        .statisticBox {
            border-radius: 8px;
            cursor: pointer;
        }
    }
</style>
