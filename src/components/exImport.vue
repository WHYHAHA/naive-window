<template>
    <n-modal
        v-model:show="showImport"
        preset="dialog"
        :title="$t('dtables.listing.theImport')"
        :negative-text="$t('dtables.listing.cancel')"
        :mask-closable="false"
        style="width: 700px"
        @after-leave="cancelCallback"
    >
        <n-space vertical>
            <n-text code>{{ $t("dataTable.listing.manuallyRefresh") }}</n-text>
            <n-text type="error">{{ $t("dataTable.listing.limitedData") }}</n-text>
            <div class="font-16 text-center" v-if="templateNmae">
                <a :href="'https://cdn.bestgenetics.com.cn/common/' + templateNmae" download v-if="templateNmae == '仔猪档案批量上传模板'">下载模板</a>
            </div>

            <n-space justify="center">
                <n-upload @change="importData" v-model:file-list="fileList" @finish="handleFinish">
                    <n-upload-dragger>
                        <div style="margin-bottom: 12px">
                            <n-icon size="48" :depth="3">
                                <archive-icon />
                            </n-icon>
                        </div>
                        <n-text style="font-size: 16px">
                            {{
                            $t("dataTable.listing.dragTheFileUpload")
                            }}
                        </n-text>
                        <n-p depth="3" style="margin: 8px 0 0 0">
                            {{
                            $t("dataTable.listing.withReferenceToTheTemplateAbove")
                            }}
                        </n-p>
                    </n-upload-dragger>
                </n-upload>
            </n-space>

            <!-- 显示错误下载地址 -->
            <n-text depth="3" v-if="tabData.length > 0">
                {{ $t("dataTable.listing.hasBeenSuccessfullyPutInStorage") }} {{ successCount }}
                {{
                $t(
                "dataTable.listing.aPartOfTheUploadDataFormatIsNotCorrect,PleaseDownloadAndUploadAgain"
                )
                }}
            </n-text>
            <n-data-table v-if="tabData.length" :columns="columns" :data="tabData" size="small" />
        </n-space>
        <!-- <n-card title="获取数据" v-if="jsonData.length>0">{{jsonData}}</n-card> -->
    </n-modal>
</template>

<script>
    import {
        defineComponent,
        reactive,
        ref,
        toRefs,
        computed,
        onMounted,
        onBeforeUnmount,
        h,
        inject
    } from "vue"
    import { NButton } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5"
    import {
        getFileUrl,
        batchAddPigMatapplyApi,
        batchAddPigMatchRecordApi,
        batchAddPigpregnancyTestRecordApi,
        batchAddPigBedRecordApi,
        batchAddPigOutOfBedApi,
        batchAddPigWithMilkApi,
        batchAddPigSpFarmweanApi,
        batchAddPigBreedingRecordApi,
        batchAddPigVaccinationApi,
        batchAddPigDormInRecordApi,
        batchAddPigDormOutRecordApi,
        batchAddPigDieRecordApi,
        batchAddPigSpFarmdieRecordApi,
        batchAddPmPigArchivesApi,
        batchPigAbortionRegisterApi,
        batchAddPigProductionRecordApi
    } from "@/api/exImport.js"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        props: {
            openImport: {
                // 显示
                type: Boolean,
                default: false
            },
            // 模板名称 不填写不显示模板
            templateNmae: {
                // 列表选中项
                type: String,
                default: ""
            },
            apiUrl: {
                // 接口路径
                type: String,
                default() {
                    return ""
                }
            }
        },
        components: {
            ArchiveIcon
        },
        setup(props, { emit }) {
            const { t } = useI18n()
            const fileListRef = ref([])
            let messageReactive = reactive(null)
            const state = reactive({
                // 接收文件集合
                fileList: [],
                // 转化json数据集合
                jsonData: [],
                // 接口返回错误数据集合
                tabData: [],
                columns: [],
                // 定时器
                timer: "",
                // 成功条数
                successCount: 0
            })
            const closeLoading = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }

            const showImport = computed({
                get: () => props.openImport,
                set: val => {
                    emit("update:openImport", val)
                }
            })
            // 所有导入字典
            const apiDictionaries = {
                batchAddPigMatapplyApi: batchAddPigMatapplyApi,
                batchAddPigMatchRecordApi: batchAddPigMatchRecordApi,
                batchAddPigpregnancyTestRecordApi: batchAddPigpregnancyTestRecordApi,
                batchAddPigBedRecordApi: batchAddPigBedRecordApi,
                batchAddPigOutOfBedApi: batchAddPigOutOfBedApi,
                batchAddPigWithMilkApi: batchAddPigWithMilkApi,
                batchAddPigSpFarmweanApi: batchAddPigSpFarmweanApi,
                batchAddPigBreedingRecordApi: batchAddPigBreedingRecordApi,
                batchAddPigVaccinationApi: batchAddPigVaccinationApi,
                batchAddPigDormInRecordApi: batchAddPigDormInRecordApi,
                batchAddPigDormOutRecordApi: batchAddPigDormOutRecordApi,
                batchAddPigDieRecordApi: batchAddPigDieRecordApi,
                batchAddPigSpFarmdieRecordApi: batchAddPigSpFarmdieRecordApi,
                batchAddPmPigArchivesApi: batchAddPmPigArchivesApi,
                batchPigAbortionRegisterApi: batchPigAbortionRegisterApi,
                batchAddPigProductionRecordApi: batchAddPigProductionRecordApi
            }
            // 动态导入接口
            const importTable = async () => {
                if (!apiDictionaries[props.apiUrl]) {
                    window.$message.error("组件Api不存在!")
                    return false
                }

                if (!messageReactive) {
                    messageReactive = window.$message.loading("正在上传Excel...", {
                        duration: 0
                    })
                }
                let data = {
                    batchSize: state.jsonData.length,
                    models: state.jsonData
                }
                await apiDictionaries[props.apiUrl](data).then(res => {
                    if (res.code == 0) {
                        if (
                            JSON.stringify(res.data.excelRecordBo) != "{}" &&
                            JSON.stringify(res.data.excelRecordBo) != "null"
                        ) {
                            state.tabData = []
                            state.tabData.push(res.data.excelRecordBo)
                            res.data.count > 0
                                ? window.$message.success(
                                      "部分上传成功，已上传" + res.data.count + "条！"
                                  )
                                : window.$message.error("导入数据失败，已导0条！")

                            state.successCount = res.data.count || 0

                            // 无往期生成记录 首条生成中 ==》 定时轮询查看状态
                            if (res.data.excelRecordBo.excelStatus == "生成中") {
                                // 存储 importExcelBo
                                helper.setLocalstorage(
                                    "importExcelBo",
                                    JSON.stringify(res.data.excelRecordBo)
                                )
                                state.timer = setInterval(() => {
                                    setTimeFindState(state.timer)
                                }, 3000)
                            }
                        } else {
                            closeLoading()
                            window.$message.success("全部导入成功，共" + res.data.count + "条！")
                        }
                        // 调用父级刷新列表
                        emit("getlist")
                    } else {
                        emit("update:openImport", false)
                        closeLoading()
                    }
                })
            }
            // 3s轮询定时器
            const setTimeFindState = () => {
                setTimeout(() => {
                    // 这里 请求的代码片段和判断是否停止定时器
                    // 存储 importExcelBo
                    let excelData = JSON.parse(helper.getLocalstorage("importExcelBo"))

                    getFileUrl({ id: excelData.id }).then(res => {
                        if (res.code == 0) {
                            if (res.data.excelStatus !== "生成中") {
                                closeLoading()
                                // 列表显示
                                state.tabData = []
                                state.tabData.push(res.data)
                                // 停止定时器
                                clearInterval(state.timer)
                            }
                        } else {
                            // 停止定时器
                            clearInterval(state.timer)
                        }
                    })
                }, 0)
            }
            // 下载
            const downLoadExcel = row => {
                const fileName = props.fileName + ".xlsx"
                const elink = document.createElement("a")

                elink.download = fileName
                elink.style.display = "none"

                elink.href = row.fileAdress
                document.body.appendChild(elink)
                elink.click()

                document.body.removeChild(elink)
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        title: "类型",
                        key: "excelType",
                        align: "center"
                    },
                    {
                        title: "状态",
                        key: "excelStatus"
                    },
                    {
                        title: "创建时间",
                        key: "createDatetime"
                    },
                    {
                        title: "创建者",
                        key: "createid"
                    },
                    {
                        title: "操作",
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
                                    { default: () => "下载导入失败Excel" }
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
                clearInterval(state.timer)
            })
            return {
                accept: ".doc,.docx,application/msword",
                showImport,
                ...toRefs(state),
                importData(options) {
                    // if (options.event && !options.event.currentTarget.files.length) {
                    //     return
                    // }
                    if (options.file.file.size >= 5242880) {
                        window.$message.error("文件过大！请上传小于5MB的Excel文件！")
                        return
                    }
                    fileListRef.value = options.fileList

                    // 拿取文件对象
                    var f = options.file.file
                    // 用FileReader来读取
                    var reader = new FileReader()
                    // 重写FileReader上的readAsBinaryString方法
                    FileReader.prototype.readAsBinaryString = function (f) {
                        var binary = ""
                        var wb // 读取完成的数据
                        var outdata // 你需要的数据
                        var reader = new FileReader()
                        reader.onload = function () {
                            // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
                            var bytes = new Uint8Array(reader.result)
                            var length = bytes.byteLength
                            for (var i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i])
                            }
                            // 接下来就是xlsx了，具体可看api
                            var XLSX = window.XLSX
                            wb = XLSX.read(binary, {
                                type: "binary"
                            })
                            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
                            // 移除第一第二个表头  从第三项开始为导出时传递数据
                            outdata.splice(0, 2)
                            // 自定义方法向父组件传递数据
                            state.jsonData = outdata
                            // emit('geteximportdata', state.jsonData)
                            if (state.jsonData.length <= 1500) {
                                importTable()
                            } else {
                                window.$message.error("不允许上传1500条以上的Excel表格！")
                            }
                        }
                        reader.readAsArrayBuffer(f)
                    }
                    reader.readAsBinaryString(f)
                },
                cancelCallback() {
                    closeLoading()
                }
            }
        }
    })
</script>
