<template>
    <n-card content-style="padding: 0;">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space justify="space-between">
                <n-space align="center">
                    <div>{{ $t('dtables.listing.inspectionSheetDetails') }}</div>
                    <n-button type="info" @click="handleDownload">{{ $t('dtables.listing.downloadReport') }}</n-button>
                    <n-button type="warning" @click="handleUpdateReport">{{ $t('dtables.listing.uploadReport') }}</n-button>
                </n-space>
            </n-space>
        </div>
        <div class="tabHeader font-16">
            <n-space justify="space-between">
                <n-space align="center">
                    <span style="font-weight: 500;">{{ $t('dtables.listing.inspectionSheetCode') }}</span>
                    <input type="text" :value="inspectionCode" disabled />
                </n-space>
            </n-space>
        </div>
        <n-data-table
            :max-height="innerHeight"
            :columns="columns"
            :scroll-x="0"
            :data="dataList"
            @update:checked-row-keys="list => checkListChange(list, 'delMultipleList')"
            :row-key="row => row.id"
            @update:filters="handleFiltersChange"
        />
    </n-card>

    <!-- 添加样本  -->
    <n-modal class="custom-card" transform-origin="center" v-model:show="addSampleModal" preset="card" :style="bodyStyle" :title="$t('dtables.listing.addSampleForInspection')" :bordered="false">
        <n-card content-style="padding: 0;">
            <n-data-table :max-height="400" :columns="addSampleColumns" :data="addSampleTableList" @update:checked-row-keys="list => checkListChange(list, 'confirmAddList')" :row-key="row => row.id" />

            <div class="flex justify-center p-1">
                <n-button type="info" @click="confirmAdd">{{ $t('dtables.listing.confirmAndSubmitForInspection') }}</n-button>
                <n-button type="error" class="ml-1" @click="addSampleModal = false">{{ $t('dtables.listing.cancel') }}</n-button>
            </div>
        </n-card>
    </n-modal>

    <!-- 完成送检  -->
    <n-modal class="custom-card" transform-origin="center" v-model:show="confirmInspectModal" preset="card" :style="bodyStyle" :title="$t('dtables.listing.completionOfInspection')" :bordered="false">
        <n-card content-style="padding: 0;">
            <div class="p-2">
                <n-form :model="createInspectForm" ref="createInspectRef" label-placement="left" :label-width="100">
                    <n-form-item path="pigCodeMain" :label="$t('dtables.listing.inspectionOrderNo')" :require="true">
                        <input type="text" disabled :value="inspectionCode" />
                    </n-form-item>
                    <n-form-item path="pigCodeMain" :label="$t('dtables.listing.plannedInspectionDate')" :require="true">
                        <n-date-picker v-model:value="confirmInspectForm.actualInspectionDatetime" type="date" :is-date-disabled="disablePreviousDate" />
                    </n-form-item>
                    <n-form-item path="pigCodeMain" :label="$t('dtables.listing.submittedBy')" :require="true">
                        <n-select filterable v-model:value="confirmInspectForm.inspectionid" :options="samplcollectOptions" :style="{width:'180px'}" />
                    </n-form-item>
                    <n-space justify="center">
                        <n-button type="info" @click="confirmInspectFn">{{ $t('dataTable.listing.confirm') }}</n-button>
                        <n-button type="error" class="ml-1" @click="confirmInspectModal = false,confirmInspectForm = {}">{{ $t('dtables.listing.cancel') }}</n-button>
                    </n-space>
                </n-form>
            </div>
        </n-card>
    </n-modal>
    <!-- 导出 -->
    <exportComponents fileName="送检清单" :apiUrl="exportUrl" :search="{
            inspectionType:1,
            ...originData
        }" v-model:openExport="showExport"></exportComponents>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, watch, computed } from "vue"
    import { useMessage } from "naive-ui"
    import {
        getPmInspectionSheetDetails,
        getPmPigSamplCollect,
        createPmInspectionSheetDetail,
        getMeasureOptionsApi,
        deleteBatchPmInspectionDetail,
        updatePmInspectionSheet
    } from "@/api/pigMeasure.js"
    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"

    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            originData: {
                type: Object,
                default: () => ({})
            },
            innerHeight: {
                type: Number,
                default: 0
            }
        },
        components: {
            importComponents,
            exportComponents
        },
        setup(props, { emit }) {
            const { t } = require("vue-i18n").useI18n()
            const store = useStore()
            const message = useMessage()
            let refList = {
                innerHeight: ref(props.innerHeight)
            }
            let state = reactive({
                exportUrl: "",
                showExport: false,
                confirmInspectForm: {},
                confirmInspectModal: false,
                addSampleModal: false,
                inspectionCode: "",
                originData: props.originData,
                columns: [],
                confirmAddList: [],
                delMultipleList: [],
                addSampleColumns: [],
                addSampleTableList: [],
                measureOptions: [],
                dataList: [],

                columnsDynamic: [],
                dynamicList: [],
                ablactationList: []
            })
            let staticData = {
                bodyStyle: {
                    width: "800px"
                }
            }
            let computeds = {
                samplcollectOptions: computed(() => store.state.dictionaries.userSelectList)
            }
            watch(state.originData, val => {
                if (val.type == "inspectComplete") {
                    state.inspectionCode = state.originData.inspectionCode
                    // methods.getDynamicTHead(state.originData.determinationType)
                }
            })
            let methods = {
                // 下载报告
                handleDownload() {
                    // 已上传时候3 已送检是2
                    let exportUrl =
                        props.originData.inspectionStatus == "3"
                            ? "exportInspectionOptionValue"
                            : props.originData.inspectionStatus == "2"
                            ? "exportInspectionSheetDetail"
                            : ""

                    state.exportUrl = exportUrl
                    state.showExport = true
                },
                // 上传报告
                handleUpdateReport() {},
                // 获取检测动态表头
                getDynamicTHead: params => {
                    let tname = state.measureOptions.find(t => t.id == params)?.tname || ""
                    getMeasureOptionsApi({ tname, typeStatus: 3 }).then(async res => {
                        if (res.code == 0) {
                            let dynamicTitles = res.data[0].measuringProject
                            let dictionsData = []
                            Object.entries(dynamicTitles).forEach(t => {
                                let dictions = store.getters["dictionaries/getDictionaries"](t[0])

                                let arr = dictions
                                    ?.filter(tc => t[1].includes(tc.dictCode))
                                    .map(tc => ({
                                        key: tc.dictLogo + tc.dictCode,
                                        title: tc.dictName,
                                        width: 100
                                    }))
                                dictionsData.push(...arr)
                            })
                            state.columnsDynamic = dictionsData
                            methods.setTableColumns()
                        }
                    })
                },
                // 获取检测选项
                getMeasureOptions: () => {
                    return new Promise(resolve => {
                        getMeasureOptionsApi({ typeStatus: 3 }).then(res => {
                            if (res.code == 0) {
                                res.data.forEach(element => {
                                    element.label = element.tname
                                    element.value = element.id
                                })
                                state.measureOptions = res.data
                                resolve()
                                // state.addFrom.typeSettingId = res.data[0].id
                            }
                        })
                    })
                },
                // 动态表 - 内容解析
                dynamicBodyFn() {
                    state.dataList.forEach((t, i) => {
                        t.optionValue = t.optionValue || "{}"
                        let optionValues = JSON.parse(t.optionValue)

                        let obj = {}
                        Object.entries(optionValues).forEach(tc => {
                            tc[1].forEach(ts => {
                                Object.entries(ts).forEach(tr => {
                                    obj[tc[0] + tr[0]] = tr[1]
                                })
                                return obj
                            })
                        })

                        state.dataList[i] = { ...t, ...obj }
                    })
                },

                // 完成送检
                confirmInspectFn() {
                    if (!state.confirmInspectForm.actualInspectionDatetime) {
                        message.error(t("dataTable.listing.thePlannedInspectionSubmission"))
                        return false
                    }
                    if (!state.confirmInspectForm.inspectionid) {
                        message.error(t("dtables.listing.submittedByCannotBeBlank"))
                        return false
                    }
                    let data = JSON.parse(JSON.stringify(state.confirmInspectForm))
                    data.actualInspectionDatetime = helper.format(data.actualInspectionDatetime)
                    data.id = state.originData.id
                    updatePmInspectionSheet(data).then(res => {
                        if (res.code == 0) {
                            message.success(t("message.success"))
                            emit("getData", state.originData)
                            // 通知上级刷新列表
                            state.confirmInspectModal = false
                        }
                    })
                },
                // 多选框变动
                checkListChange(list, type) {
                    state[type] = list
                },
                // 确认添加采样条目
                confirmAdd() {
                    let list = state.addSampleTableList
                        .filter(t => state.confirmAddList.includes(t.id))
                        .map(({ pigCode, sampleCode, samplcollectDate }) => {
                            return {
                                pigCode,
                                inspectionCode: state.originData.inspectionCode,
                                sampleCode,
                                samplcollectDate
                            }
                        })
                    createPmInspectionSheetDetail({ detailModels: list }).then(res => {
                        if (res.code == 0) {
                            methods.setTables()
                            message.success(t("message.success"))
                            state.addSampleModal = false
                        }
                    })
                },
                // 获取送检列表
                getPigInspectList: async () => {
                    getPmPigSamplCollect({ samplcollectType: 2 }).then(res => {
                        state.showloading = false
                        if (res.code == 0) {
                            state.addSampleTableList = res.data
                        }
                    })
                },
                // 添加样本
                handleAddSample: async () => {
                    await methods.getPigInspectList()
                    state.addSampleModal = true
                },
                // 批量删除
                handleMutipleDel: () => {
                    deleteBatchPmInspectionDetail({
                        models: state.delMultipleList.map(id => ({ id }))
                    }).then(res => {
                        res.code == 0 && (methods.setTables(), message.success(t("message.success")))
                    })
                },
                //完成检验
                handleConfirmInspect: () => {
                    if (state.dataList.length == 0) {
                        return message.error(t("dtables.listing.pleaseAddAtLeastOneSample"))
                    }
                    state.confirmInspectModal = true
                },
                // 表内容
                setTables() {
                    if (!state.originData.inspectionCode) {
                        return false
                    }
                    state.inspectionCode = state.originData.inspectionCode
                    getPmInspectionSheetDetails({
                        inspectionCode: state.originData.inspectionCode
                    }).then(res => {
                        res.code == 0 && ((state.dataList = res.data), methods.dynamicBodyFn())
                    })
                },
                // 日期过滤
                disablePreviousDate: ts => {
                    return ts < new Date(helper.formatStartTamp(Date.now())).getTime()
                },
                //表头
                setTableColumns: () => {
                    state.columns = [
                        {
                            // title: "种猪编码",
                            title: t("dataTable.listing.pigCode"),
                            key: "pigCode",
                            align: "center",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            // title: "耳样编码",
                            title: t("dtables.listing.otoidCoding"),
                            key: "sampleCode",
                            align: "center",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            // title: "采样日期",
                            title: t("dtables.listing.samplingDate"),
                            key: "samplcollectDate",
                            align: "center",
                            width: 100,
                            fixed: "left",
                            render(row) {
                                return helper.timestampToTime(row.samplcollectDate)
                            }
                        },
                        // {
                        //     title: '送检状态',
                        //     key: 'sampleCode2',
                        //     align: 'center',
                        //     width: 100,
                        //     fixed: 'left'
                        // },
                        {
                            // title: "报告上传日",
                            title: t("dtables.listing.reportUploadDate"),
                            key: "uploadReportDatetime",
                            align: "center",
                            width: 100,
                            fixed: "left",
                            render(row) {
                                return helper.timestampToTime(row.uploadReportDatetime)
                            }
                        },
                        {
                            // title: "检测人/单位",
                            title: t("dtables.listing.theDeterminationOfPeople"),
                            key: "uploadid",
                            align: "center",
                            width: 100,
                            fixed: "left"
                        },
                        ...state.columnsDynamic
                        // {
                        //     title: '检测数据',
                        //     key: 'measureData',
                        //     children: state.columnsDynamic
                        // }
                    ]

                    let addSampleColumns = JSON.parse(JSON.stringify(state.columns))
                    // addSampleColumns[1].key = 'pigCode'
                    addSampleColumns[addSampleColumns.length - 1] = {
                        // title: "状态",
                        title: t("dtables.listing.state"),
                        key: "samplcollectStatus",
                        align: "center",
                        width: 100,
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "samplcollectStatus",
                                row.samplcollectStatus
                            )
                        }
                    }
                    addSampleColumns[addSampleColumns.length - 2].render = row => {
                        return helper.timestampToTime(row.samplcollectDate)
                    }

                    state.addSampleColumns = addSampleColumns
                }
            }
            onMounted(() => {
                methods.setTables()
                // methods.setTableColumns()
                methods.getMeasureOptions().then(() => {
                    methods.getDynamicTHead(state.originData.determinationType)
                })
            })
            return {
                ...toRefs(state),
                ...refList,
                ...staticData,
                ...computeds,
                ...methods
            }
        }
    })
</script>

<style>
</style>