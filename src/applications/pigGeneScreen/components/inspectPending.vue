<template>
    <n-card content-style="padding: 0;">
        <div class="tabHeader font-16 font-weight-bolder">
            <n-space justify="space-between">
                <n-space align="center">
                    <div>{{ $t('dtables.listing.inspectionSheetDetails') }}</div>
                    <n-button type="info" @click="handleAddSample">{{ $t('dtables.listing.addSample') }}</n-button>
                    <n-button type="error" @click="handleMutipleDel">{{ $t('dtables.listing.batchRemoval') }}</n-button>
                </n-space>
                <n-space align="center">
                    <n-button type="success" @click="handleConfirmInspect">{{ $t('dtables.listing.inspectionSheetCode') }}</n-button>
                </n-space>
            </n-space>
        </div>
        <div class="tabHeader font-16">
            <n-space justify="space-between">
                <n-space align="center">
                    <span style="font-weight: 500;">{{ $t('dtables.listing.inspectionSheetCode') }}</span>
                    <input type="text" :value="inspectionCode" disabled />
                </n-space>
                <n-space align="center">
                    <span style="font-weight: 500;">{{ $t('dtables.listing.inspectionStatus') }}</span>
                    <input type="text" :value="$t('dtables.listing.toBeSubmittedForInspection')" disabled />
                </n-space>
            </n-space>
        </div>
        <n-data-table
            :max-height="innerHeight"
            :columns="columns"
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
                <n-button type="info" @click="confirmAdd">{{ $t('dataTable.listing.confirm') }}</n-button>
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
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, watch, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPmInspectionSheetDetails,
        getPmPigSamplCollect,
        createPmInspectionSheetDetail,
        deletePmInspectionDetail,
        deleteBatchPmInspectionDetail,
        updatePmInspectionSheet
    } from "@/api/pigMeasure.js"

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
        setup(props, { emit }) {
            const store = useStore()
            const { t } = require("vue-i18n").useI18n()
            const message = useMessage()
            let refList = {
                innerHeight: ref(props.innerHeight)
            }
            let state = reactive({
                determinationType: [],
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
                dataList: []
            })
            let staticData = {
                bodyStyle: {
                    width: "800px"
                }
            }
            let computeds = {
                samplcollectOptions: computed(() => store.state.dictionaries.userSelectList)
            }
            watch(state.originData, () => {
                methods.setTables()
            })
            let methods = {
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

                    data.inspectionCode = state.inspectionCode
                    data.id = state.originData.id
                    data.inspectionType = 2
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
                    if (!list[0]) {
                        return message.error(t("dtables.listing.pleaseSelectAtLeastOneItem"))
                    }
                    createPmInspectionSheetDetail({ detailModels: list }).then(res => {
                        if (res.code == 0) {
                            emit("refershList")
                            methods.setTables()
                            message.success(t("message.success"))
                            state.addSampleModal = false
                        }
                    })
                },
                // 获取送检列表
                getPigInspectList: async () => {
                    getPmPigSamplCollect({
                        samplcollectType: 2,
                        typeSettingId: state.originData.determinationType
                    }).then(res => {
                        state.showloading = false
                        if (res.code == 0) {
                            state.addSampleTableList = res.data.filter(t => t.sampleStatus == 0)
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
                    if (state.delMultipleList.length == 0) {
                        return message.error(t("dtables.listing.pleaseAddAtLeastOneSample"))
                    }
                    let list = state.dataList
                        .filter(t => state.delMultipleList.includes(t.id))
                        .map(t => ({ id: t.id, sampleCode: t.sampleCode }))

                    deleteBatchPmInspectionDetail({
                        models: list
                    }).then(res => {
                        res.code == 0 &&
                            (methods.setTables(),
                            message.success(t("message.success")),
                            emit("refershList"))
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
                        res.code == 0 && (state.dataList = res.data)
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
                            type: "selection"
                        },
                        {
                            // title: "种猪编码",
                            title: t("dataTable.listing.pigCode"),
                            key: "pigCode",
                            align: "center",
                            width: 100
                            // render(row) {
                            //     return helper.timestampToTime(row.matchDate)
                            // }
                        },
                        {
                            // title: "耳样编码",
                            title: t("dtables.listing.otoidCoding"),
                            key: "sampleCode",
                            align: "center",
                            width: 100
                            // render(row) {
                            //     return store.getters[
                            //         'dictionaries/getDictionarieName'
                            //     ]('sampleCode', row.sampleCode)
                            // }
                        },
                        {
                            // title: "采样日期",
                            title: t("dtables.listing.samplingDate"),
                            key: "samplcollectDate",
                            align: "center",
                            width: 80,
                            render(row) {
                                return helper.timestampToTime(row.samplcollectDate)
                            }
                        },
                        {
                            // title: "操作",
                            title: t("dataTable.listing.actions"),
                            key: "actions",
                            align: "center",
                            fixed: "right",
                            width: 40,
                            render(row) {
                                return h(NSpace, {}, [
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,
                                            onClick: () => {
                                                deletePmInspectionDetail({
                                                    id: row.id,
                                                    sampleCode: row.sampleCode
                                                }).then(res => {
                                                    if (res.code == 0) {
                                                        emit("refershList")
                                                        methods.setTables()
                                                        message.success(t("message.success"))
                                                    }
                                                })
                                            }
                                        },
                                        { default: () => t("dataTable.listing.delete") }
                                    )
                                ])
                            }
                        }
                    ]

                    let addSampleColumns = JSON.parse(JSON.stringify(state.columns))
                    // addSampleColumns[1].key = 'pigCode'
                    addSampleColumns[addSampleColumns.length - 1] = {
                        title: "状态",
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
                methods.setTableColumns()
                methods.setTables()
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