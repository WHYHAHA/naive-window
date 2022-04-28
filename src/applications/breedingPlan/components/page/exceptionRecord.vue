<template>
    <n-grid x-gap="12" :cols="2">
        <n-gi>
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center">
                    <div>{{ $t("dtables.listing.moveTheSowList") }}:</div>
                    <n-button type="info" class="col-2" @click="showExport = true">{{
                        $t("button.export")
                    }}</n-button>
                </n-space>
            </div>
            <tableComponents
                :columns="columns"
                :data="exceptionList"
                :loading="showloading"
                :scroll-x="1000"
                v-model:search="search"
                @update:filters="handleFiltersChange"
                @update:search="getExceptionRecordList"
            ></tableComponents>
        </n-gi>
        <n-gi>
            <n-space class="tabHeader" align="center">
                <div>{{ $t("dtables.listing.moveRecordDetails") }}：</div>
            </n-space>
            <n-descriptions
                label-placement="left"
                bordered
                :column="3"
                size="small"
                v-if="exceptionDetail.detail.pigCode"
            >
                <n-descriptions-item :label="$t('dataTable.listing.sowCode')">{{
                    exceptionDetail.detail.pigCode
                }}</n-descriptions-item>
                <n-descriptions-item :label="$t('dtables.listing.getACode')">{{
                    exceptionDetail.detail.columnCode
                }}</n-descriptions-item>
                <n-descriptions-item :label="$t('dtables.listing.moveTheDate')">{{
                    exceptionDetail.detail.outOfBedDate
                }}</n-descriptions-item>
                <n-descriptions-item :label="$t('dtables.listing.moveType')">{{
                    getDictionarieName("outBedType", exceptionDetail.detail.outBedType)
                }}</n-descriptions-item>
            </n-descriptions>
            <n-card v-if="exceptionDetail.nodeList.length > 0">
                <n-timeline>
                    <n-timeline-item
                        v-for="(item, index) in exceptionDetail.nodeList"
                        :key="index"
                        :type="item.name == '异动' ? 'warning' : 'success'"
                        :title="item.name"
                        :time="item.time"
                        :content="item.content"
                    />
                </n-timeline>
            </n-card>
            <n-empty
                v-if="exceptionDetail.nodeList.length == 0"
                :description="$t('dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor')"
                class="mt-3"
            ></n-empty>
        </n-gi>
    </n-grid>

    <!-- 列表导出 -->
    <exportComponents
        apiUrl="exportPigBatchAbnormalDynamicApi"
        :search="search"
        v-model:openExport="showExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { getExceptionRecordListApi, getExceptionRecordDetailApi } from "@/api/breedingPlan.js"
    import { useI18n } from "vue-i18n"
    import { NButton, NSpace, NEllipsis } from "naive-ui"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import tableComponents from "@/components/table.vue"
    import exportComponents from "@/components/exExport.vue"

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
                search: {
                    batchNumber: props.pageData.id,
                    dormCode: "",
                    farmid: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                exceptionList: [],
                exceptionDetail: {
                    detail: {},
                    nodeList: []
                },
                columns: [],
                updateForm: {
                    id: undefined,
                    pigCode: undefined,
                    abnormalDynamicDate: undefined,
                    abnormalDynamicType: undefined
                },
                leftClickIndex: -1
            })
            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })
            // 获取异动列表
            const getExceptionRecordList = async () => {
                state.showloading = true
                await getExceptionRecordListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.exceptionList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 获取异动详情
            const getExceptionRecordDetail = async (row, index) => {
                await getExceptionRecordDetailApi({
                    ruttingCode: row.ruttingCode,
                    batchNumber: row.batchNumber
                }).then(res => {
                    if (res.code == 0) {
                        state.leftClickIndex = index
                        state.exceptionDetail.detail = {
                            pigCode: res.data.pigCode,
                            columnCode: res.data.columnCode,
                            outOfBedDate: res.data.outOfBedDate,
                            outBedType: res.data.outBedType
                        }

                        // 第一次输精
                        if (res.data.breedingDatetimeOnce) {
                            state.exceptionDetail.nodeList.push({
                                name: "第一次输精",
                                time: res.data.breedingDatetimeOnce
                            })
                        }
                        // 第二次输精
                        if (res.data.breedingDatetimeTwe) {
                            state.exceptionDetail.nodeList.push({
                                name: "第二次输精",
                                time: res.data.breedingDatetimeTwe
                            })
                        }
                        // 第三次输精
                        if (res.data.breedingDatetimeThree) {
                            state.exceptionDetail.nodeList.push({
                                name: "第三次输精",
                                time: res.data.breedingDatetimeThree
                            })
                        }
                        // 测孕
                        if (res.data.pregnnancyDate) {
                            state.exceptionDetail.nodeList.push({
                                name: "测孕",
                                time: res.data.pregnnancyDate
                            })
                        }
                        // 上床
                        if (res.data.bedTime) {
                            state.exceptionDetail.nodeList.push({
                                name: "上床",
                                time: res.data.bedTime
                            })
                        }
                        // 分娩
                        if (res.data.childbirthDate) {
                            state.exceptionDetail.nodeList.push({
                                name: "分娩",
                                time: res.data.childbirthDate
                            })
                        }
                        // 异动
                        if (res.data.outOfBedDate) {
                            state.exceptionDetail.nodeList.push({
                                name: "异动",
                                content: store.getters["dictionaries/getDictionarieName"](
                                    "outBedType",
                                    res.data.outBedType
                                ),
                                time: res.data.outOfBedDate
                            })
                        }
                    }
                })
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.dateOfRegistration")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
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
                            return t("dtables.listing.moveType")
                        },
                        key: "outBedType",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "outBedType",
                                row.outBedType
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dtables.listing.moveTheTime")
                        },
                        key: "outOfBedDate",
                        render(row) {
                            return helper.timestampToTime(row.outOfBedDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
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
                                            getExceptionRecordDetail(row, index)
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
                getExceptionRecordList()
            })
            return {
                ...toRefs(state),
                formRef,
                getDictionarieName,
                bodyStyle: {
                    width: "600px"
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    state.search.page = 1
                    getExceptionRecordList()
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
