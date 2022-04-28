<template>
    <n-grid x-gap="12" :cols="2">
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dataTable.listing.pigAblactationRecords") }}：</div>
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
                    @update:search="getWeaningRecord"
                ></tableComponents>
            </n-space>
        </n-gi>
        <n-gi>
            <div class="tabHeader">
                <n-space align="center">
                    <div>{{ $t("dtables.listing.recordDetails") }}：</div>
                </n-space>
            </div>
            <n-space vertical v-if="pregnancyDetail.length > 0">
                <tableComponents
                    :columns="columns2"
                    :data="pregnancyDetail"
                    :loading="rightShowloading"
                    :scroll-x="1000"
                    v-model:search="rightSearch"
                    @update:search="getWeaningRecordDetail"
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
        apiUrl="exportWeaningRecordApi"
        :search="leftSearch"
        v-model:openExport="showExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { getWeaningRecordApi, getWeaningRecordDetailApi } from "@/api/breedingPlan.js"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"
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
            const { t } = useI18n()
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const addformRef = ref(null)
            const state = reactive({
                showloading: false,
                showDetailExport: false,
                rightShowloading: false,
                showExport: false,
                leftSearch: {
                    batchNumber: props.pageData.id,
                    dormCodeList: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                rightSearch: {
                    weaningDateLike: "",
                    dormCode: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                leftClickIndex: -1,
                pregnancyList: [],
                pregnancyDetail: [],
                columns: [],
                columns2: [],
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
            const getWeaningRecord = async () => {
                state.showloading = true
                await getWeaningRecordApi(state.leftSearch).then(res => {
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
            const getWeaningRecordDetail = async (row, index) => {
                state.rightShowloading = true
                state.rightSearch.weaningDateLike = row.weaningDate
                state.rightSearch.dormCode = row.dormCode
                await getWeaningRecordDetailApi(state.rightSearch).then(res => {
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
                        title: () => t("dataTable.listing.weaningDate"),
                        key: "weaningDate",
                        render(row) {
                            return helper.timestampToTime(row.weaningDate)
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
                        title: () => t("dtables.listing.numberOfWeanedPiglets"),
                        key: "sowPig"
                    },
                    {
                        title: () => t("dtables.listing.boar"),
                        key: "boar"
                    },
                    {
                        title: () => t("dtables.listing.theSow"),
                        key: "sow"
                    },
                    {
                        title: () => t("dtables.listing.Landrace"),
                        key: "landrace"
                    },
                    {
                        title: () => t("dtables.listing.theGreatWhite"),
                        key: "large"
                    },
                    {
                        title: () => t("dtables.listing.turok"),
                        key: "duroc"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        onClick: () => {
                                            getWeaningRecordDetail(row, index)
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
                        title: () => t("dataTable.listing.pigletCode"),
                        key: "pigCode"
                    },
                    {
                        title: () => t("dataTable.listing.earCard"),
                        key: "earBrandCode"
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
                        title: () => t("dataTable.listing.dens"),
                        key: "nestNumber"
                    },
                    {
                        title: () => t("dataTable.listing.species"),
                        key: "pigSources",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigSources",
                                row.pigSources
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.productionBatch"),
                        key: "productionBatch"
                    }
                ]
            }

            onMounted(() => {
                setColumns()
                getWeaningRecord()
            })
            return {
                ...toRefs(state),
                formRef,
                addformRef,
                getWeaningRecord,
                getWeaningRecordDetail,
                rules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSowEncoding"),
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
                    getWeaningRecord()
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
