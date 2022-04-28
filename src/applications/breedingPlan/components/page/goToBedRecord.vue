<template>
    <n-grid x-gap="12" :cols="2">
        <n-gi>
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center">
                    <div>{{ $t("dataTable.listing.goToBedRecords") }}:</div>
                    <n-button type="info" class="col-2" @click="showExport = true">{{
                        $t("button.export")
                    }}</n-button>
                </n-space>
            </div>
            <tableComponents
                :columns="columns"
                :data="goToBedList"
                :loading="showloading"
                :scroll-x="1000"
                :clickIndex="leftClickIndex"
                v-model:search="search"
                @update:search="getGoToBedRecordList"
            ></tableComponents>
        </n-gi>
        <n-gi>
            <n-space class="tabHeader" align="center">
                <div>{{ $t("dtables.listing.toRecordTheDetails") }}：</div>
            </n-space>
            <n-descriptions
                label-placement="left"
                bordered
                :column="3"
                size="small"
                v-if="goToBedDetail.detail.pigCode"
            >
                <n-descriptions-item :label="$t('dataTable.listing.sowCode')">{{
                    goToBedDetail.detail.pigCode
                }}</n-descriptions-item>
                <n-descriptions-item :label="$t('dataTable.listing.breedingDate')">{{
                    goToBedDetail.detail.breedingDatetime
                }}</n-descriptions-item>
                <n-descriptions-item :label="$t('dataTable.listing.dueDate')">{{
                    goToBedDetail.detail.dueDate
                }}</n-descriptions-item>
            </n-descriptions>
            <n-card v-if="goToBedDetail.info.columnCode" :headerStyle="headerStyle">
                <template #header>
                    <n-text type="info" class="font-18"
                        >{{ $t("dtables.listing.goToTheInformation") }}:</n-text
                    >
                </template>
                <n-descriptions label-placement="left" :column="4" size="small">
                    <n-descriptions-item :label="$t('dtables.listing.BedNumber')">{{
                        goToBedDetail.info.columnCode
                    }}</n-descriptions-item>
                    <n-descriptions-item :label="$t('dataTable.listing.bedDate')">{{
                        goToBedDetail.info.bedTime
                    }}</n-descriptions-item>
                </n-descriptions>
            </n-card>
            <n-empty
                v-if="!goToBedDetail.info.columnCode"
                :description="$t('dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor')"
                class="mt-3"
            ></n-empty>
        </n-gi>
    </n-grid>
    <!-- 列表导出 -->
    <exportComponents
        apiUrl="exportGotobedApi"
        :search="search"
        v-model:openExport="showExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref } from "vue"
    import { getGoToBedRecordListApi, getGoToBedRecordDetailApi } from "@/api/breedingPlan.js"
    import { NButton, NSpace, NEllipsis } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"
    import tableComponents from "@/components/table.vue"
    import exportComponents from "@/components/exExport.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents,
            exportComponents
        },
        setup(props) {
            const { t } = useI18n()
            const store = useStore()
            const formRef = ref(null)
            const state = reactive({
                showloading: false,
                showExport: false,
                columns: [],
                search: {
                    batchNumber: props.pageData.id,
                    dormCode: "",
                    farmid: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                goToBedList: [],
                goToBedDetail: {
                    detail: {},
                    info: {}
                },
                updateForm: {
                    id: undefined,
                    pigCode: undefined,
                    abnormalDynamicDate: undefined,
                    abnormalDynamicType: undefined
                },
                leftClickIndex: -1
            })

            // 获取上床列表
            const getGoToBedRecordList = async () => {
                state.showloading = true
                await getGoToBedRecordListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.goToBedList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 获取上床详情
            const getGoToRecordDetail = async (row, index) => {
                // id: row.id
                await getGoToBedRecordDetailApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        state.leftClickIndex = index
                        if (res.data && JSON.stringify(res.data) != "{}") {
                            state.goToBedDetail.detail = {
                                pigCode: res.data.pigCode,
                                breedingDatetime: res.data.breedingDatetime,
                                dueDate: res.data.dueDate
                            }
                            state.goToBedDetail.info = {
                                columnCode: res.data.columnCode || 123,
                                bedTime: res.data.bedTime
                            }
                        } else {
                            window.$message.error(t("dtables.listing.temporarilyNoData"))
                        }
                    }
                })
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "farmid",
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmid)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.Dorm")
                        },
                        key: "dormCode",
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
                            return t("dataTable.listing.breedingDate")
                        },
                        key: "breedingDatetime"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.dueDate")
                        },
                        key: "dueDate",
                        render(row) {
                            return helper.timestampToTime(row.dueDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dtables.listing.theRegistrar")
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
                                            getGoToRecordDetail(row, index)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]
            }

            onMounted(() => {
                setColumns()
                getGoToBedRecordList()
            })
            return {
                ...toRefs(state),
                formRef,
                headerStyle: {
                    color: "#0099e5 !important"
                },
                bodyStyle: {
                    width: "600px"
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
<style lang="less" scoped></style>
