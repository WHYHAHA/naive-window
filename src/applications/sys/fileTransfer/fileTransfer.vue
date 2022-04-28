<template >
    <div class="p-2">
        <n-card :title="$t('dtables.listing.fileTransferManagement')">
            <n-grid cols="10" x-gap="20" item-responsive>
                <n-gi span="1 400:1 600:1 800:1">
                    <n-space vertical :size="20">
                        <n-button secondary strong color="#9E7D50" style="width:140px" @click="listFilter('all')">
                            <template #icon>
                                <n-icon>
                                    <allIcon />
                                </n-icon>
                            </template>
                            {{$t('dtables.listing.all')}}
                        </n-button>
                        <n-button secondary strong color="#458994" style="width:140px" @click="listFilter('doingList')">
                            <template #icon>
                                <n-icon>
                                    <uploadIcon />
                                </n-icon>
                            </template>
                            {{$t('dtables.listing.inTheGenerated')}}
                        </n-button>
                        <n-button secondary strong color="#407434" style="width:140px" @click="listFilter('finishList')">
                            <template #icon>
                                <n-icon>
                                    <doneIcon />
                                </n-icon>
                            </template>
                            {{$t('dtables.listing.completeTheList')}}
                        </n-button>
                        <n-button secondary strong color="#DC143C" style="width:140px" @click="listFilter('errorList')">
                            <template #icon>
                                <n-icon>
                                    <errorIcon />
                                </n-icon>
                            </template>
                            {{$t('dtables.listing.failureList')}}
                        </n-button>
                    </n-space>
                </n-gi>
                <n-gi span="9 400:9 600:9 800:9">
                    <n-space vertical>
                        <n-text type="info">{{$t('dtables.listing.wrongDataImport')}}</n-text>
                        <n-data-table :columns="columns" :data="tableData" :pagination="pagination" />
                    </n-space>
                </n-gi>
            </n-grid>
        </n-card>

        <!-- 导入 -->
        <importComponents v-model:openImport="showImport" templateNmae="piglet-archive-upload-template.xls" apiUrl="batchAddPigSpFarmweanApi"></importComponents>
        <!-- 导出 -->
        <exportComponents fileName="断奶登记" apiUrl="exportPigSpFarmweanApi" :search="search" v-model:openExport="showExport"></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, onMounted, reactive, toRefs, ref, h } from "vue"
    import { useMessage, NButton, NSpace } from "naive-ui"
    import { getExcelRecordApi } from "@/api/public.js"
    import {
        MdCloudUpload as uploadIcon,
        IosFiling as allIcon,
        MdDoneAll as doneIcon,
        IosCloseCircle as errorIcon
    } from "@vicons/ionicons4"
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        components: {
            uploadIcon,
            allIcon,
            doneIcon,
            errorIcon
        },
        setup() {
            const { t } = useI18n()
            const message = useMessage()
            const formRef = ref(null)
            const state = reactive({
                // 列表数据
                tableData: [],
                search: {
                    type: ""
                }
            })
            const createColumns = () => {
                return [
                    {
                        title: () => t("dtables.listing.theFileName"),
                        render(row) {
                            var reg = /[\u4e00-\u9fa5]/g
                            let date = row?.fileAdress?.split("upload/file/")[1]?.split("/")[0]
                            return row.fileAdress
                                ? row.fileAdress?.match(reg)?.join("") + date + row.fileType
                                : row.excelReportType
                        }
                    },
                    {
                        title: () => t("dtables.listing.theFileType"),
                        key: "excelType",
                        filterOptions: [
                            {
                                label: "导入",
                                value: "导入"
                            },
                            {
                                label: "导出",
                                value: "导出"
                            }
                        ],
                        filter(value, row) {
                            return ~row.excelType.indexOf(value)
                        }
                    },
                    {
                        title: () => t("dtables.listing.fileProductionTime"),
                        key: "excelDate"
                    },
                    {
                        title: () => t("dataTable.listing.pigStatus"),
                        key: "excelStatus"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row) {
                            return h(NSpace, {}, [
                                // h(
                                //     NButton,
                                //     {
                                //         size: "small",
                                //         type: "info",
                                //         text: true,
                                //         onClick: () => {
                                //             row
                                //         }
                                //     },
                                //     { default: () => "重新开始" }
                                // ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            downLoadExcel(row)
                                        }
                                    },
                                    { default: () => "下载" }
                                )
                                // h(
                                //     NButton,
                                //     {
                                //         size: "small",
                                //         type: "error",
                                //         text: true,
                                //         onClick: () => {
                                //             row
                                //         }
                                //     },
                                //     { default: () => "删除" }
                                // )
                            ])
                        }
                    }
                ]
            }
            // 下载
            const downLoadExcel = row => {
                var reg = /[\u4e00-\u9fa5]/g
                let date = row?.fileAdress?.split("upload/file/")[1]?.split("/")[0]
                const fileName = row.fileAdress?.match(reg)?.join("") + date + row.fileType

                const elink = document.createElement("a")
                elink.setAttribute("target", "_blank")

                elink.download = fileName
                elink.style.display = "none"
                elink.href = row.fileAdress
                document.body.appendChild(elink)
                elink.click()
                document.body.removeChild(elink)
            }
            // 获取断奶列表
            const getExcelRecord = async () => {
                await getExcelRecordApi(state.search).then(res => {
                    if (res.code == 0) {
                        res.data
                            ? (state.tableData = res.data.excelRecordBoList)
                            : (state.tableData = [])

                        state.tableData.forEach(t => {
                            if (t.excelStatus == "错误") {
                                t.excelDate = t.createDatetime
                            }

                            t.fileType = t?.fileAdress?.includes(".pdf") ? ".pdf" : ".xlsx"
                        })
                    }
                })
            }
            const listFilter = type => {
                switch (type) {
                    case "all":
                        state.search.type = ""
                        break
                    case "doingList":
                        state.search.type = "生成中"
                        break
                    case "exportList":
                        state.search.type = "生成中"
                        break
                    case "finishList":
                        state.search.type = "已生成"
                        break
                    case "errorList":
                        state.search.type = "错误"
                        break
                    default:
                        break
                }
                getExcelRecord()
            }
            onMounted(() => {
                getExcelRecord()
            })
            return {
                ...toRefs(state),
                listFilter,
                columns: createColumns({
                    sendMail(rowData) {
                        message.info("send mail to " + rowData.name)
                    }
                }),
                formRef,
                pagination: {
                    pageSize: 10
                }
            }
        }
    })
</script>
<style lang="less" scoped>
</style>