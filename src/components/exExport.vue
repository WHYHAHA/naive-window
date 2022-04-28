<template>
    <n-modal
        v-model:show="showExport"
        preset="dialog"
        :title="$t('file.exportFile')"
        :positive-text="$t('dataTable.listing.export')"
        :negative-text="$t('dtables.listing.cancel')"
        style="width: 700px;"
        :mask-closable="false"
        @after-leave="cancelCallback"
        @positive-click="submitCallback"
    >
        <n-spin :show="spinShow">
            <n-space vertical :size="20">
                <n-text type="info">{{$t('dtables.listing.pleaseMakeSureTheItemListScreenIsWhatYouNeed')}}</n-text>
                <n-text type="info">
                    {{$t('dtables.listing.recordDetails')}}:
                    <n-text code>{{getTimeQuantum()}}</n-text>
                </n-text>
                <n-space align="center" v-if="haveTime()">
                    <n-text>{{$t('dataTable.listing.theTimeTo')}}：</n-text>
                    <n-button type="info" size="small" @click="changTime('month')">{{$t('dataTable.listing.inRecentMonth')}}</n-button>
                    <n-button type="info" size="small" @click="changTime('year')">{{$t('dataTable.listing.almostAYear')}}</n-button>
                </n-space>
                <n-text depth="3" v-if="tabData.length>0">{{$t('dataTable.listing.thereMayBeMany')}}</n-text>
                <n-data-table v-if="tabData.length>0" :columns="columns" :data="tabData" size="small" />
            </n-space>
        </n-spin>
    </n-modal>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeUnmount, h, computed } from "vue"
    import { NButton } from "naive-ui"
    import { useI18n } from "vue-i18n"

    import {
        exportPigloveTimeApi,
        exportPigGroupHealthcareApi,
        getFileUrl,
        optionalExprotApi,
        exportPigSemenNeedApi,
        exportBreedingTaskApi,
        exportPigSpFarmweanApi,
        exportPigWithMilkApi,
        exportPigPregnancyTestApi,
        exportPigBedRecordApi,
        exportPigOutOfBedApi,
        exportPigProductionRecordApi,
        exportPigVaccinationApi,
        exportPigDormInRecordApi,
        exportPigDormOutRecordApi,
        exportPigDieApi,
        exportPhysicalExaminationRecord,
        exportPigSpFarmdieRecordApi,
        exportPigAbortionRegisterApi,
        exportPigArchivesApi,
        exportPedigreeApi,
        exportPigBatchPregnancyApi,
        exportPigBatchDetailPregnancyApi,
        exportPigBatchProductionRecordApi,
        exportPigBatchAbnormalDynamicApi,
        exportWeaningRecordApi,
        exportGotobedApi,
        exportProductionRecordsApi,
        exportNursingRecordApi,
        exportSowInventoryApi,
        exportPigcastrationPlanApi,
        exportLabelDataApi,
        exportCarvingDataApi,
        exportDeliveryRecordApi,
        exportInspectionSheetDetail,
        exportInspectionOptionValue,
        exportSpSamplcollect,
        exportPigGradedRecord
    } from "@/api/exExport.js"

    import helper from "@/utils/helper.js"
    let timer = 0
    export default defineComponent({
        props: {
            openExport: {
                // 显示
                type: Boolean,
                default: false
            },
            // 搜索条件
            search: {
                // 搜索条件
                type: String
            },
            fileName: {
                // 列表选中项
                type: String,
                default() {
                    return "导出文件"
                }
            },
            apiUrl: {
                // 接口路径
                type: String,
                default() {
                    return ""
                }
            }
        },
        setup(props, { emit }) {
            const { t } = useI18n()
            const showExport = computed({
                get: () => props.openExport,
                set: val => {
                    emit("update:openExport", val)
                }
            })
            const state = reactive({
                originalSearch: computed(() => {
                    return JSON.parse(JSON.stringify(props.search))
                }),
                spinShow: false,
                columns: [],
                tabData: []
            })
            let messageReactive = reactive(null)
            const closeLoading = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }
            // 定义 watch 监听
            // watch(props.search, search => {
            //     debugger
            //     state.originalSearch = JSON.parse(JSON.stringify(search))
            // })
            // 判断search中是否有时间段
            const haveTime = computed(() => {
                return function () {
                    let falg = false
                    if (state.originalSearch && JSON.stringify(state.originalSearch) != "{}") {
                        for (const key in state.originalSearch) {
                            if (key.indexOf("Gte") != -1 || key.indexOf("Lte") != -1) {
                                falg = true
                            }
                        }
                    }

                    return falg
                }
            })
            // 当前时间端
            const getTimeQuantum = computed(() => {
                return function () {
                    let timeQuantum = ""
                    let timeList = []
                    for (const key in state.originalSearch) {
                        if (key.indexOf("Gte") != -1) {
                            state.originalSearch[key] ? timeList.unshift(state.originalSearch[key]) : ""
                        }
                        if (key.indexOf("Lte") != -1) {
                            state.originalSearch[key] ? timeList.push(state.originalSearch[key]) : ""
                        }
                    }
                    timeList.length > 0
                        ? (timeQuantum =
                              helper.timestampToTime(timeList[0]) +
                              " - " +
                              helper.timestampToTime(timeList[1]))
                        : (timeQuantum = t("dataTable.listing.all"))
                    return timeQuantum
                }
            })
            // 所有导出字典
            const apiDictionaries = {
                exportPigloveTimeApi: exportPigloveTimeApi,
                optionalExprotApi: optionalExprotApi,
                exportPigSemenNeedApi: exportPigSemenNeedApi,
                exportBreedingTaskApi: exportBreedingTaskApi,
                exportPigSpFarmweanApi: exportPigSpFarmweanApi,
                exportPigWithMilkApi: exportPigWithMilkApi,
                exportPigPregnancyTestApi: exportPigPregnancyTestApi,
                exportPigBedRecordApi: exportPigBedRecordApi,
                exportPigOutOfBedApi: exportPigOutOfBedApi,
                exportPigProductionRecordApi: exportPigProductionRecordApi,
                exportPigVaccinationApi: exportPigVaccinationApi,
                exportPigDormInRecordApi: exportPigDormInRecordApi,
                exportPigDormOutRecordApi: exportPigDormOutRecordApi,
                exportPigDieApi: exportPigDieApi,
                exportPhysicalExaminationRecord: exportPhysicalExaminationRecord,
                exportPigSpFarmdieRecordApi: exportPigSpFarmdieRecordApi,
                exportPigAbortionRegisterApi: exportPigAbortionRegisterApi,
                exportPigArchivesApi: exportPigArchivesApi,
                exportPigBatchPregnancyApi: exportPigBatchPregnancyApi,
                exportPigBatchProductionRecordApi: exportPigBatchProductionRecordApi,
                exportPigBatchAbnormalDynamicApi: exportPigBatchAbnormalDynamicApi,
                exportPigBatchDetailPregnancyApi: exportPigBatchDetailPregnancyApi,
                exportWeaningRecordApi: exportWeaningRecordApi,
                exportGotobedApi: exportGotobedApi,
                exportProductionRecordsApi: exportProductionRecordsApi,
                exportNursingRecordApi: exportNursingRecordApi,
                exportSowInventoryApi: exportSowInventoryApi,
                exportPigcastrationPlanApi: exportPigcastrationPlanApi,
                exportLabelDataApi: exportLabelDataApi,
                exportCarvingDataApi: exportCarvingDataApi,
                exportDeliveryRecordApi: exportDeliveryRecordApi,
                exportInspectionSheetDetail,
                exportInspectionOptionValue,
                exportSpSamplcollect,
                exportPigGradedRecord,
                exportPedigreeApi,
                exportPigGroupHealthcareApi
            }
            // 动态导出接口
            const exportTable = async () => {
                if (!apiDictionaries[props.apiUrl]) {
                    window.$message.error(t("file.componentApiDoesNotExist"))
                }

                await apiDictionaries[props.apiUrl](state.originalSearch).then(res => {
                    if (res?.code == 0) {
                        // 无往期生成记录 首条生成中 ==》 生成轮询定时
                        if (res.data.excelRecordBo && res.data.excelRecordBo.excelStatus == "生成中") {
                            // 存储 excelData
                            helper.setLocalstorage("excelData", JSON.stringify(res.data.excelRecordBo))
                            timer = setInterval(() => {
                                setTimeFindState()
                            }, 3000)
                        }

                        // 有往期记录直接写入
                        if (res.data.excelRecordBoList && res.data.excelRecordBoList.length > 0) {
                            state.tabData = res.data.excelRecordBoList
                        }
                        closeLoading()
                    } else {
                        state.spinShow = false
                        emit("update:openExport", false)
                        closeLoading()
                    }
                })
            }
            // 3s轮询定时器
            const setTimeFindState = () => {
                setTimeout(() => {
                    // 这里 请求的代码片段和判断是否停止定时器
                    // 存储 excelData
                    let excelData = JSON.parse(helper.getLocalstorage("excelData"))

                    getFileUrl({ id: excelData.id }).then(res => {
                        if (res?.code == 0) {
                            if (res.data.excelStatus !== "生成中") {
                                closeLoading()
                                // 列表显示
                                state.tabData = []
                                // 验证是否有pdf文件

                                res.data.isPdf = res?.data?.fileAdress?.includes(".pdf")
                                state.tabData.push(res.data)
                                // 停止定时器
                                clearInterval(timer)

                                state.spinShow = false
                            }
                        } else {
                            state.spinShow = false
                            // 停止定时器
                            clearInterval(timer)
                        }
                    })
                }, 0)
            }
            // 下载
            const downLoadExcel = row => {
                // const blob = new Blob([row]) //处理文档流d
                const fileName = props.fileName + row.isPdf ? ".pdf" : ".xlsx"
                const elink = document.createElement("a")
                elink.setAttribute("target", "_blank")

                elink.download = fileName
                elink.style.display = "none"
                // elink.href = URL.createObjectURL(blob)
                elink.href = row.fileAdress
                document.body.appendChild(elink)
                elink.click()
                // URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            }
            const changTime = type => {
                let starTime = new Date()
                if (type == "month") {
                    starTime = starTime.setFullYear(starTime.getFullYear(), starTime.getMonth() - 1)
                }
                if (type == "year") {
                    starTime = starTime.setFullYear(starTime.getFullYear() - 1)
                }

                let starKeyName = "",
                    endKeyName = ""
                for (const key in state.originalSearch) {
                    if (Object.hasOwnProperty.call(state.originalSearch, key)) {
                        const element = key
                        if (element.includes("Gte")) {
                            starKeyName = key
                        }
                        if (element.includes("Lte")) {
                            endKeyName = key
                        }
                    }
                }
                state.originalSearch[starKeyName] = helper.format(starTime)
                state.originalSearch[endKeyName] = helper.format(new Date().getTime())
                state.tabData = []
                window.$message.success(t("message.success"))
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: "类型",
                        title: t("dtables.listing.theFileType"),
                        key: "excelType",
                        align: "center"
                    },
                    {
                        // title: "状态",
                        title: t("dtables.listing.state"),
                        key: "excelStatus"
                    },
                    {
                        // title: "创建时间",
                        title: t("file.creationTime"),
                        key: "createDatetime"
                    },
                    {
                        // title: "创建者",
                        title: t("file.creator"),
                        key: "createid"
                    },
                    {
                        // title: "操作",
                        title: t("dataTable.listing.actions"),
                        key: "actions",
                        render(row) {
                            if (row.excelStatus == "已生成") {
                                return h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "success",
                                        onClick: () => {
                                            downLoadExcel(row)
                                        }
                                    },
                                    { default: () => t("file.exportFile") }
                                )
                            } else {
                                return row.excelStatus
                            }
                        }
                    }
                ]
            }

            onMounted(() => {
                setTableColumns()
            })
            onBeforeUnmount(() => {
                closeLoading()
                // 停止定时器
                clearInterval(timer)
            })
            return {
                ...toRefs(state),
                changTime,
                showExport,
                getTimeQuantum,
                haveTime,
                handleChange(e) {
                    state.exportType = e.target.value
                },
                submitCallback() {
                    if (state.spinShow) {
                        return false
                    }
                    state.spinShow = true
                    // if (!messageReactive) {
                    //     messageReactive = window.$message.loading("正在生成Excel...", {
                    //         duration: 10000
                    //     })
                    // }
                    exportTable()
                    return false
                },
                cancelCallback() {
                    closeLoading()
                    state.tabData = []
                }
            }
        }
    })
</script>
