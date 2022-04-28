<template >
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <n-card title="系统偏好设置丨字典管理">
            <n-grid x-gap="20" :cols="2">
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>基础字典:</div>
                            <n-input placeholder="搜索字典名称或标识" autosize style="min-width: 300px;" clearable v-model:value="search.dictSearchInfo" @keyup.enter="getFatherDictList" @clear="search.dictSearchInfo='';getFatherDictList()"></n-input>
                            <n-button type="info" @click="fatherDictModal=true">新建字典</n-button>
                        </n-space>
                    </div>
                    <tableComponents :columns="tableDorm" :data="fatherDictList" :loading="showloading" v-model:search="search" :clickIndex="leftClickIndex" @update:search="getFatherDictList"></tableComponents>
                </n-gi>
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>详情:</div>
                            <n-button type="info" @click="childrenDictModal=true;" v-if="addDisplay">添加子集字典</n-button>
                            <!-- <n-button type="info" @click="showExport=true">批量停用栏位</n-button> -->
                        </n-space>
                    </div>
                    <n-data-table :loading="loadingColumns" :columns="tableColumns" :data="childrenDict" :pagination="pagination" />
                </n-gi>
            </n-grid>
        </n-card>

        <!-- 新建&编辑父级字典 -->
        <n-modal class="custom-card" v-model:show="fatherDictModal" preset="card" :style="{width: '600px'}" title="父级字典" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <n-form :model="fatherDictForm" ref="fatherRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical :size="20">
                    <div>
                        <n-form-item path="dictName" label="字典中文名称：">
                            <n-input v-model:value="fatherDictForm.dictName" />
                        </n-form-item>

                        <n-form-item path="dictLogo" label="标识：">
                            <n-input v-model:value="fatherDictForm.dictLogo" :disabled="fatherDictForm.id" />
                        </n-form-item>
                    </div>
                    <n-space justify="center">
                        <n-button type="info" @click="fatherDictFormSubmit" attr-type="button">保存</n-button>
                        <n-button @click="fatherDictModal=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 新建&编辑子级字典 -->
        <n-modal class="custom-card" v-model:show="childrenDictModal" preset="card" :style="{width: '600px'}" title="子集字典" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <n-form :model="childrenDictForm" ref="childrenRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical :size="20">
                    <div>
                        <n-form-item path="dictName" label="中文名称：">
                            <n-input v-model:value="childrenDictForm.dictName" />
                        </n-form-item>
                        <n-form-item path="dictEngName" label="英文名称：">
                            <n-input v-model:value="childrenDictForm.dictEngName" />
                        </n-form-item>

                        <n-form-item path="dictLogo" label="标识：">
                            <n-input v-model:value="childrenDictForm.dictLogo" disabled />
                        </n-form-item>
                        <n-form-item path="dictCode" label="字典值：">
                            <n-input-number :default-value="childrenDict.length+1" v-model:value="childrenDictForm.dictCode" :min="1" :max="99" disabled clearable />
                        </n-form-item>
                        <n-form-item path="dictOrder" label="字典顺序：">
                            <n-input-number v-model:value="childrenDictForm.dictOrder" :min="0" :max="99" clearable />
                        </n-form-item>
                    </div>
                    <n-space justify="center">
                        <n-button type="info" @click="childrenDictFormSubmit" attr-type="button">保存</n-button>
                        <n-button @click="childrenDictModal=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, h, computed } from "vue"
    import { NButton, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getFatherDictListApi,
        updateFatherDictApi,
        createFatherDictApi,
        getDictByFatherCodeApi,
        createChildDictApi,
        updateChildDictApi,
    } from "@/api/dictionariesManage.js"
    import { useStore } from "vuex"

    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        props: {
            pageData: Object,
        },
        components: {
            tableComponents,
        },
        setup(props, { emit }) {
            const fatherRef = ref(null)
            const childrenRef = ref(null)
            const columnsRef = ref(null)
            const dialog = useDialog()
            const store = useStore()
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: "syspreferences/list", name: "偏好设置" },
                    { pageUrl: "sys/dictionariesManage/list", name: "字典管理" },
                ],
                addDisplay: false,
                loading: false,
                loadingColumns: false,
                fatherDictModal: false,
                childrenDictModal: false,
                tableColumns: [],
                tableDorm: [],
                fatherDictList: [],
                childrenDict: [],
                fatherDictForm: {
                    dictLogo: undefined,
                    dictName: undefined,
                },
                childrenDictForm: {
                    dictLogo: undefined,
                    dictCode: undefined,
                    dictName: undefined,
                    dictEngName: undefined,
                    dictOrder: 0,
                },
                search: {
                    dictSearchInfo: undefined,
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                leftClickIndex: -1,
                leftCilckRow: {},
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            // 获取父级字典表
            const getFatherDictList = async () => {
                state.loading = true
                await getFatherDictListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.loading = false
                        state.fatherDictList = res.data.list
                        state.childrenDict = []
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取子集字典列表
            const getDictByFatherCode = async search => {
                state.loadingColumns = true
                await getDictByFatherCodeApi(search).then(res => {
                    if (res.code == 0) {
                        state.loadingColumns = false
                        state.childrenDict = res.data
                    }
                })
            }

            // 新增父级字典
            const createFatherDict = async () => {
                await createFatherDictApi(state.fatherDictForm).then(res => {
                    if (res.code == 0) {
                        state.search.page = 1
                        state.search.dictSearchInfo = ""
                        getFatherDictList()
                        state.fatherDictModal = false
                        window.$message.success("新增成功")
                    }
                })
            }

            // 修改父级字典
            const updateFatherDict = async type => {
                if (type == "updateAvailable") {
                    let status = state.fatherDictForm.available == "1" ? "0" : "1"
                    state.fatherDictForm.available = status
                }

                await updateFatherDictApi(state.fatherDictForm).then(res => {
                    if (res.code == 0) {
                        state.fatherDictModal = false
                        getFatherDictList()
                        clearAllForm()
                        window.$message.success("修改成功！")
                    }
                })
            }

            // 新增子级字典
            const createChildDict = async () => {
                state.childrenDictForm.dictCode = state.childrenDict.length + 1
                await createChildDictApi(state.childrenDictForm).then(res => {
                    if (res.code == 0) {
                        getDictByFatherCode({ dictLogo: state.leftCilckRow.dictLogo })
                        state.childrenDictModal = false
                        window.$message.success("新增成功")
                    }
                })
            }
            // 修改子级字典
            const updateChildDict = async type => {
                if (type == "updateAvailable") {
                    let status = state.childrenDictForm.available == "1" ? "0" : "1"
                    state.childrenDictForm.available = status
                }
                await updateChildDictApi(state.childrenDictForm).then(res => {
                    if (res.code == 0) {
                        state.childrenDictModal = false
                        state.childrenDictForm = {
                            dictLogo: state.leftCilckRow.dictLogo,
                            dictCode: undefined,
                            dictName: undefined,
                            dictEngName: undefined,
                            dictOrder: 0,
                        }
                        getDictByFatherCode({ dictLogo: state.leftCilckRow.dictLogo })
                        window.$message.success("修改成功！")
                    }
                })
            }

            const clearAllForm = () => {
                state.fatherDictForm = {
                    dictLogo: undefined,
                    dictName: undefined,
                }
                state.childrenDictForm = {
                    dictCode: undefined,
                    dictLogo: state.leftCilckRow.dictLogo,
                    dictName: undefined,
                    dictEngName: undefined,
                    dictOrder: 0,
                }
            }

            const setTableColumns = () => {
                state.tableDorm = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        title: "父级字典名称",
                        key: "dictName",
                    },
                    {
                        title: "父级字典标识",
                        key: "dictLogo",
                    },
                    {
                        title: "状态",
                        key: "available",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px",
                                    },
                                    type: row.available == "1" ? "success" : "error",
                                },
                                {
                                    default: () => (row.available == "1" ? "启用" : "停用"),
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
                                            state.fatherDictForm = JSON.parse(JSON.stringify(row))
                                            state.fatherDictModal = true
                                            state.leftCilckRow = row
                                            state.leftClickIndex = index
                                        },
                                    },
                                    { default: () => "编辑" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            getDictByFatherCode({
                                                dictLogo: row.dictLogo,
                                            })
                                            state.leftClickIndex = index
                                            state.leftCilckRow = row
                                            state.childrenDictForm.dictLogo = row.dictLogo
                                            state.addDisplay = true
                                        },
                                    },
                                    { default: () => "查看详情" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.available == "1" ? "error" : "success",
                                        text: true,
                                        onClick: () => {
                                            let mark = row.available == "1" ? "停用" : "启用"
                                            state.leftCilckRow = row
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    state.fatherDictForm = JSON.parse(
                                                        JSON.stringify(row)
                                                    )
                                                    state.fatherDictForm.idList = []
                                                    state.fatherDictForm.idList.push(
                                                        state.fatherDictForm.id
                                                    )
                                                    state.childrenDictForm.dictLogo = row.dictLogo
                                                    updateFatherDict("updateAvailable")
                                                },
                                            })
                                        },
                                    },
                                    { default: () => (row.available == "1" ? "停用" : "启用") }
                                ),
                            ])
                        },
                    },
                ]
                state.tableColumns = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        title: "中文名称",
                        key: "dictName",
                    },
                    {
                        title: "英文名称",
                        key: "dictEngName",
                    },
                    {
                        title: "值",
                        key: "dictCode",
                    },
                    {
                        title: "顺序",
                        key: "dictOrder",
                    },

                    {
                        title: "状态",
                        key: "available",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px",
                                    },
                                    type: row.available == "1" ? "success" : "error",
                                },
                                {
                                    default: () => (row.available == "1" ? "启用" : "停用"),
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
                                            state.childrenDictForm = JSON.parse(JSON.stringify(row))
                                            state.childrenDictModal = true
                                            state.rightClickIndex = index
                                        },
                                    },
                                    { default: () => "编辑" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.available == "1" ? "error" : "success",
                                        text: true,
                                        onClick: () => {
                                            let mark = row.available == "1" ? "停用" : "启用"

                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    state.childrenDictForm = JSON.parse(
                                                        JSON.stringify(row)
                                                    )
                                                    state.childrenDictForm.idList = []
                                                    state.childrenDictForm.idList.push(
                                                        state.childrenDictForm.id
                                                    )
                                                    updateChildDict("updateAvailable")
                                                },
                                            })
                                        },
                                    },
                                    { default: () => (row.available == "1" ? "停用" : "启用") }
                                ),
                            ])
                        },
                    },
                ]
            }
            onMounted(() => {
                getFatherDictList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                childrenRef,
                fatherRef,
                columnsRef,
                pagination: {
                    pageSize: 10,
                },
                rules: {
                    dictName: {
                        required: true,
                        message: "请输入中文子典名称",
                    },
                    dictLogo: {
                        required: true,
                        trigger: ["input", "blur"],
                        validator: (rule, value) => {
                            if (!value) {
                                return new Error("请输入字典标识")
                            } else if (!/^[A-Za-z]+$/.test(value)) {
                                return new Error("标识只能输入字母！")
                            }
                            return true
                        },
                    },
                    dictEngName: {
                        required: true,
                        trigger: ["input", "blur"],
                        validator: (rule, value) => {
                            if (!value) {
                                return new Error("请输入英文名称")
                            } else if (!/^[A-Za-z]+$/.test(value)) {
                                return new Error("英文名称只能输入字母！")
                            }
                            return true
                        },
                    },
                    dictOrder: {
                        required: true,
                        message: "请输入父级字典名称",
                    },
                },
                getFatherDictList,
                clearAllForm,
                getDictionaries,
                fatherDictFormSubmit() {
                    fatherRef.value.validate(errors => {
                        if (!errors) {
                            state.fatherDictForm.id ? updateFatherDict() : createFatherDict()
                        } else {
                            window.$message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                childrenDictFormSubmit() {
                    childrenRef.value.validate(errors => {
                        if (!errors) {
                            state.childrenDictForm.id ? updateChildDict() : createChildDict()
                        } else {
                            window.$message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                // 面包屑去往父级
                goFatherPage(index) {
                    if (index == 0) {
                        const data = {
                            pageUrl: "sys/preferences",
                            name: "系统偏好设置",
                        }
                        emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
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