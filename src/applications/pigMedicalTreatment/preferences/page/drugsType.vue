<template >
    <n-space vertical :size="0">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in pageData.breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>

        <div class="p-2">
            <n-card title="偏好设置：药品设置">
                <div class="tabHeader">
                    <n-space align="center" :size="20">
                        <div class="font-16 font-weight-bolder">药品列表</div>
                        <n-button type="info" class="col-2" @click="viewType='add'">新建药品</n-button>
                    </n-space>
                </div>
                <n-space vertical>
                    <n-data-table :columns="columns" :data="measureTypeList" :row-class-name="rowClassName" />
                    <n-space justify="end">
                        <n-pagination
                            v-model:page="search.page"
                            v-model:pageSize="search.limit"
                            :item-count="search.total"
                            show-size-picker
                            :page-sizes="[10, 20, 30, 40]"
                            show-quick-jumper
                            @update:page="getPigloveTimeList()"
                            @update:pageSize="getPigloveTimeList()"
                        />
                    </n-space>
                </n-space>
            </n-card>
        </div>
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeMount, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getMeasureTypeListApi,
        getMeasureTemplateApi,
        getMeasureTypeDetailApi,
        addMeasureTypeApi,
        upDataMeasureTypeApi,
        upDataMeasureTypeStatusApi,
    } from "@/api/pigMeasure.js"
    import { useStore } from "vuex"

    export default defineComponent({
        props: {
            pageData: Object,
        },
        setup(props, { emit }) {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const dialog = useDialog()
            const state = reactive({
                viewType: "",
                leftClickIndex: -1,
                measureTypeList: [],
                measureTemplate: {},
                columns: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                form: {
                    tname: undefined,
                    typeStatus: "1",
                    measuringRange: {
                        gender: undefined,
                        breedingLevel: undefined,
                        pigSources: undefined,
                        daysOfAgeStar: 0,
                        daysOfAgeEnd: 0,
                    },
                    measuringProject: {
                        generalSettings: undefined,
                    },
                },
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            // 获取检测选项列表
            const getMeasureTypeList = async () => {
                await getMeasureTypeListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.measureTypeList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 获取模板
            const getMeasureTemplate = async () => {
                // id 1 获取检测模板
                await getMeasureTemplateApi({ id: 1 }).then(res => {
                    if (res.code == 0) {
                        state.measureTemplate = res.data
                    }
                })
            }
            // 获取检测详情
            const getMeasureTypeDetail = async row => {
                await getMeasureTypeDetailApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        state.form = res.data
                        state.viewType = "update"
                    }
                })
            }

            // 添加检测
            const addMeasureType = async () => {
                await addMeasureTypeApi(state.form).then(res => {
                    if (res.code == 0) {
                        message.success("添加成功，正在为您刷新列表...")
                        closeForm()
                        state.search.page = 1
                        getMeasureTypeList()
                    }
                })
            }
            // 修改
            const upDataMeasureType = async () => {
                await upDataMeasureTypeApi(state.form).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        closeForm()
                        state.search.page = 1
                        getMeasureTypeList()
                    }
                })
            }
            // 启用停用
            const upDataMeasureTypeStatus = async form => {
                await upDataMeasureTypeStatusApi(form).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        closeForm()
                        state.search.page = 1
                        getMeasureTypeList()
                    }
                })
            }
            const closeForm = () => {
                state.viewType = ""
                state.form = {
                    tname: undefined,
                    typeStatus: "1",
                    measuringRange: {
                        gender: undefined,
                        breedingLevel: undefined,
                        pigSources: undefined,
                        daysOfAgeStar: 0,
                        daysOfAgeEnd: 0,
                    },
                    measuringProject: {
                        generalSettings: undefined,
                    },
                }
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        title: "药品名称",
                        key: "tname",
                    },
                    {
                        title: "创建日期",
                        key: "createid",
                    },
                    {
                        title: "创建人",
                        key: "createid",
                    },
                    {
                        title: "状态",
                        key: "status",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px",
                                    },
                                    type: row.status == "1" ? "success" : "error",
                                },
                                {
                                    default: () => (row.status == "1" ? "启用" : "停用"),
                                }
                            )
                        },
                    },
                    {
                        title: "操作",
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            getMeasureTypeDetail(row)
                                        },
                                    },
                                    { default: () => "编辑" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.status == "1" ? "error" : "success",
                                        text: true,
                                        onClick: () => {
                                            let mark = row.status == "1" ? "停用" : "启用"
                                            let status = row.status == "1" ? "0" : "1"
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    upDataMeasureTypeStatus({
                                                        id: row.id,
                                                        status: status,
                                                    })
                                                },
                                            })
                                        },
                                    },
                                    { default: () => (row.status == "1" ? "停用" : "启用") }
                                ),
                            ])
                        },
                    },
                ]
            }
            onBeforeMount(() => {
                // 获取 性别字典
                store.dispatch("dictionaries/getPigDictionaries", "gender")
                // 获取 品种字典
                store.dispatch("dictionaries/getPigDictionaries", "pigSources")
                // 获取 群 字典
                store.dispatch("dictionaries/getPigDictionaries", "breedingLevel")
                // 获取 常规设置项目
                store.dispatch("dictionaries/getPigDictionaries", "generalSettings")
            })
            onMounted(() => {
                getMeasureTypeList()
                getMeasureTemplate()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getDictionaries,
                closeForm,
                // 检测规则
                rules: {
                    tname: {
                        required: true,
                        message: "请输入名称",
                        trigger: ["input", "blur"],
                    },
                    measuringProject: {
                        generalSettings: {
                            type: "array",
                            required: true,
                            trigger: "change",
                            message: "请选择至少一项",
                        },
                    },
                },
                // 面包屑去往父级
                goFatherPage(index) {
                    if (index == 0) {
                        const data = {
                            pageUrl: "pigMedicalTreatment/preferences/list",
                            name: "偏好设置",
                        }
                        emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.viewType == "add" ? addMeasureType() : upDataMeasureType()
                        } else {
                            message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
            }
        },
    })
</script>

<style lang='less' scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>