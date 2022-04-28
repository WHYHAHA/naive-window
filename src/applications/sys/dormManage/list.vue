<template >
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <n-card title="系统偏好设置丨场区栋舍">
            <n-grid x-gap="20" :cols="2">
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>猪舍:</div>
                            <n-button type="info" @click="dormModal=true">新建猪舍</n-button>
                        </n-space>
                    </div>
                    <tableComponents
                        :columns="tableDorm"
                        :data="dormsList"
                        :loading="showloading"
                        v-model:search="search"
                        :clickIndex="leftClickIndex"
                        @update:search="getDormListByCode"
                        :scroll-x="1000"
                    ></tableComponents>
                </n-gi>
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>详情:</div>
                            <!-- <n-button type="info" @click="columnsModal=true;clearAllForm()" v-if="addDisplay">添加栏位</n-button> -->
                            <n-button type="info" @click="columnsModalBatch=true;clearAllForm()" v-if="addDisplay">批量添加栏位</n-button>
                            <!-- <n-button type="info" @click="showExport=true">批量停用栏位</n-button> -->
                        </n-space>
                    </div>
                    <n-data-table :loading="loadingColumns" :columns="tableColumns" :data="columnsList" :pagination="pagination" />
                </n-gi>
            </n-grid>
        </n-card>

        <!-- 新建场区 -->
        <n-modal class="custom-card" v-model:show="farmModal" preset="card" :style="{width: '600px'}" title="新建场区" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <n-form :model="farmForm" ref="farmRef" :rules="factoryRules" label-placement="left" :label-width="100">
                <n-space vertical :size="20">
                    <div>
                        <n-form-item path="farmCode" label="场区编码：">
                            <n-input v-model:value.trim="farmForm.farmCode" />
                        </n-form-item>

                        <n-form-item path="farmName" label="场区名称：">
                            <n-input v-model:value="farmForm.farmName" />
                        </n-form-item>
                    </div>
                    <n-space justify="center">
                        <n-button type="info" @click="farmFormSubmit" attr-type="button">保存</n-button>
                        <n-button @click="farmModal=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 新建栋舍 -->
        <n-modal class="custom-card" v-model:show="dormModal" preset="card" :style="{width: '800px'}" title="新建猪舍" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <div class="p-3">
                <n-form :model="dormForm" ref="dormRef" :rules="rules" label-placement="left" :label-width="100">
                    <n-space vertical :size="20">
                        <div>
                            <n-form-item path="farmCode" label="所属场区：">
                                <n-input-group>
                                    <n-select v-model:value="dormForm.farmCode" :options="getDictionaries('farmList')" filterable :disabled="dormForm.id?true:false" />
                                    <n-button type="primary" @click="farmModal=true" v-if="!dormForm.id">新增场区</n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item path="dormCode" label="猪舍编码：">
                                <n-input v-model:value="dormForm.dormCode" :disabled="dormForm.id?true:false" />
                            </n-form-item>

                            <n-form-item path="dormName" label="猪舍名称：">
                                <n-input v-model:value="dormForm.dormName" />
                            </n-form-item>

                            <n-form-item path="application" label="猪舍类型:">
                                <n-select v-model:value="dormForm.application" :options="getDictionaries('application')" filterable />
                            </n-form-item>

                            <n-form-item path="columnNum" label="栏位个数：">
                                <n-input v-model:value="dormForm.columnNum" />
                            </n-form-item>
                        </div>
                        <n-space justify="center">
                            <n-button type="info" @click="dormFormSubmit" attr-type="button">保存</n-button>
                            <n-button @click="dormModal=false">取消</n-button>
                        </n-space>
                    </n-space>
                </n-form>
            </div>
        </n-modal>

        <!-- 通过数量新建栏位 -->
        <n-modal class="custom-card" v-model:show="columnsModalBatch" preset="card" :style="{width: '400px'}" title="新建栏位（批量）" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <n-form :model="columnsFormBatch" ref="columnsBatchRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical :size="20">
                    <!-- <n-text code>PS:栏位容量为单个栏位容量</n-text> -->
                    <div>
                        <n-form-item path="batchSize" label="栏位个数：">
                            <n-input-number v-model:value="columnsFormBatch.batchSize" :min="1" :max="999"></n-input-number>
                        </n-form-item>
                        <n-form-item path="columnCapacity" label="栏位容量：">
                            <n-input-number v-model:value="columnsFormBatch.columnCapacity" :min="1" :max="999">
                                <template #suffix>头</template>
                            </n-input-number>
                        </n-form-item>
                    </div>
                    <n-space justify="center">
                        <n-button type="info" @click="columnsFormBatchSubmit" attr-type="button">保存</n-button>
                        <n-button @click="columnsModalBatch=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 新建栏位 -->
        <n-modal class="custom-card" v-model:show="columnsModal" preset="card" :style="{width: '400px'}" title="新建栏位" :bordered="false" :mask-closable="false" @afterLeave="clearAllForm()">
            <n-form :model="columnsForm" ref="columnsRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical :size="20">
                    <n-text code>PS:栏位容量为单个栏位容量</n-text>
                    <div>
                        <n-form-item path="columnCode" label="栏位：">
                            <n-input v-model:value="columnsForm.columnCode" :disabled="columnsForm.id?true:false" />
                        </n-form-item>
                        <n-form-item path="columnCapacity" label="栏位容量：">
                            <n-input-number v-model:value="columnsForm.columnCapacity" :min="1" :max="999">
                                <template #suffix>头</template>
                            </n-input-number>
                        </n-form-item>
                    </div>
                    <n-space justify="center">
                        <n-button type="info" @click="columnsFormSubmit" attr-type="button">保存</n-button>
                        <n-button @click="columnsModal=false">取消</n-button>
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
        getDormListByCodeApi,
        getColumnListApi,
        creatPmFarmApi,
        createPmDormApi,
        createPmPigDormColumnApi,
        updatePmDormApi,
        updatePmColumnApi,
        batchCreatePmPigDormColumnApi
    } from "@/api/dormManage.js"
    import { useStore } from "vuex"

    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            tableComponents
        },
        setup(props, { emit }) {
            const dormRef = ref(null)
            const farmRef = ref(null)
            const columnsRef = ref(null)
            const columnsBatchRef = ref(null)
            const dialog = useDialog()
            const store = useStore()
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: "syspreferences/list", name: "偏好设置" },
                    { pageUrl: "sys/dormManage/list", name: "场区栋舍" }
                ],
                columnsModalBatch: false,
                loading: false,
                loadingColumns: false,
                dormModal: false,
                farmModal: false,
                columnsModal: false,
                addDisplay: false,
                tableColumns: [],
                tableDorm: [],
                dormsList: [],
                columnsList: [],
                dormForm: {
                    dormName: undefined,
                    farmCode: undefined,
                    application: undefined,
                    dormCode: undefined,
                    columnNum: undefined
                },
                farmForm: {
                    farmCode: undefined,
                    farmName: undefined
                },
                columnsFormBatch: {
                    models: [
                        {
                            farmCode: "",
                            dormCode: "",
                            columnCapacity: ""
                        }
                    ],
                    columnCapacity: "",
                    batchSize: ""
                },
                columnsForm: {
                    columnCapacity: undefined,
                    farmCode: undefined,
                    dormCode: undefined
                },
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                leftClickIndex: -1,
                leftCilckRow: {}
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            // 获取栋舍
            const getDormListByCode = async () => {
                state.loading = true
                await getDormListByCodeApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.loading = false
                        state.dormsList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取栏位
            const getColumnList = async search => {
                state.loadingColumns = true
                await getColumnListApi(search).then(res => {
                    if (res.code == 0) {
                        state.loadingColumns = false
                        state.columnsList = res.data
                    }
                })
            }

            // 新增场区
            const addFarm = async () => {
                await creatPmFarmApi(state.farmForm).then(res => {
                    if (res.code == 0) {
                        // 更新场区字典
                        store.dispatch("dictionaries/getAllDictionaries")
                        state.farmModal = false
                        window.$message.success("新增成功")
                    }
                })
            }

            // 新增栋舍
            const addDorm = async () => {
                await createPmDormApi(state.dormForm).then(res => {
                    if (res.code == 0) {
                        state.dormModal = false
                        window.$message.success("新增成功")
                        state.search.page = 1
                        getDormListByCode()
                    }
                })
            }
            // 新增栏位 （数量添加
            const addColumnBatch = async () => {
                state.columnsFormBatch.models[0].farmCode = state.leftCilckRow.farmCode
                state.columnsFormBatch.models[0].dormCode = state.leftCilckRow.dormCode
                state.columnsFormBatch.models[0].columnCapacity = state.columnsFormBatch.columnCapacity

                await batchCreatePmPigDormColumnApi(state.columnsFormBatch).then(res => {
                    if (res.code == 0) {
                        state.columnsModalBatch = false
                        getDormListByCode()
                        getColumnList({
                            dormCode: state.leftCilckRow.dormCode,
                            farmCode: state.leftCilckRow.farmCode
                        })
                        window.$message.success("新增成功")
                    }
                })
            }

            // 新增栏位 栏位根据容量自动生成 不许要填写栏位号
            const addColumn = async () => {
                state.columnsForm.farmCode = state.leftCilckRow.farmCode
                state.columnsForm.dormCode = state.leftCilckRow.dormCode
                await createPmPigDormColumnApi(state.columnsForm).then(res => {
                    if (res.code == 0) {
                        state.columnsModal = false
                        getDormListByCode()
                        getColumnList({
                            dormCode: state.leftCilckRow.dormCode,
                            farmCode: state.leftCilckRow.farmCode
                        })
                        window.$message.success("新增成功")
                    }
                })
            }

            // 修改栋舍信息
            const updatePmDorm = async type => {
                if (type == "updateAvailable") {
                    let status = state.dormForm.available == "1" ? "0" : "1"

                    state.dormForm.available = status
                }

                await updatePmDormApi(state.dormForm).then(res => {
                    if (res.code == 0) {
                        state.dormModal = false
                        getDormListByCode()
                        window.$message.success("修改成功！")
                    }
                })
            }
            // 修改栏位信息
            const updatePmColumn = async type => {
                if (type == "updateAvailable") {
                    let status = state.columnsForm.available == "1" ? "0" : "1"

                    state.columnsForm.available = status
                }

                await updatePmColumnApi(state.columnsForm).then(res => {
                    if (res.code == 0) {
                        state.columnsModal = false
                        getDormListByCode()
                        getColumnList({
                            dormCode: state.columnsForm.dormCode,
                            farmCode: state.columnsForm.farmCode
                        })
                        window.$message.success("修改成功！")
                    }
                })
            }

            const clearAllForm = () => {
                state.farmForm = {
                    farmCode: undefined,
                    farmName: undefined
                }
                state.dormForm = {
                    dormName: undefined,
                    farmCode: undefined,
                    application: undefined,
                    dormCode: undefined,
                    columnNum: undefined
                }
                state.columnsForm = {
                    columnCapacity: undefined,
                    farmCode: undefined,
                    dormCode: undefined
                }
                state.columnsFormBatch = {
                    models: [
                        {
                            farmCode: "",
                            dormCode: "",
                            columnCapacity: ""
                        }
                    ],
                    columnCapacity: "",
                    batchSize: ""
                }
            }

            const setTableColumns = () => {
                state.tableDorm = [
                    {
                        title: "猪舍编码",
                        key: "dormCode"
                    },
                    {
                        title: "猪舍名称",
                        key: "dormName"
                    },
                    {
                        title: "所属场区",
                        key: "farmCode",
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmCode) || "--"
                        }
                    },
                    {
                        title: "猪舍类型",
                        key: "application",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "application",
                                row.application
                            )
                        }
                    },
                    {
                        title: "可用栏/床位数",
                        key: "columnNum"
                    },
                    {
                        title: "容量",
                        key: "dormCapacity"
                    },
                    {
                        title: "状态",
                        key: "available",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px"
                                    },
                                    type: row.available == "1" ? "success" : "error"
                                },
                                {
                                    default: () => (row.available == "1" ? "启用" : "停用")
                                }
                            )
                        }
                    },
                    {
                        title: "操作",
                        key: "actions",
                        width: 160,
                        fixed: "right",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.dormForm = JSON.parse(JSON.stringify(row))
                                            state.dormModal = true
                                            state.leftClickIndex = index
                                        }
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
                                            getColumnList({
                                                dormCode: row.dormCode,
                                                farmCode: row.farmCode
                                            })
                                            state.addDisplay = true
                                            state.leftClickIndex = index
                                            state.leftCilckRow = row
                                        }
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

                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    state.dormForm = JSON.parse(JSON.stringify(row))
                                                    updatePmDorm("updateAvailable")
                                                }
                                            })
                                        }
                                    },
                                    { default: () => (row.available == "1" ? "停用" : "启用") }
                                )
                            ])
                        }
                    }
                ]
                state.tableColumns = [
                    {
                        title: "栏/床位编码",
                        key: "columnCode"
                    },
                    {
                        title: "容量",
                        key: "columnCapacity"
                    },
                    {
                        title: "状态",
                        key: "available",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px"
                                    },
                                    type: row.available == "1" ? "success" : "error"
                                },
                                {
                                    default: () => (row.available == "1" ? "启用" : "停用")
                                }
                            )
                        }
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
                                            state.columnsForm = JSON.parse(JSON.stringify(row))
                                            state.columnsModal = true
                                            state.rightClickIndex = index
                                        }
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
                                                    state.columnsForm = JSON.parse(JSON.stringify(row))
                                                    updatePmColumn("updateAvailable")
                                                }
                                            })
                                        }
                                    },
                                    { default: () => (row.available == "1" ? "停用" : "启用") }
                                )
                            ])
                        }
                    }
                ]
            }
            onMounted(() => {
                getDormListByCode()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                dormRef,
                farmRef,
                columnsBatchRef,
                columnsRef,
                pagination: {
                    pageSize: 10
                },
                factoryRules: {
                    farmCode: [
                        {
                            required: true,
                            message: "请选择所属场区/请输入场区编码",
                            trigger: ["input", "blur"]
                        },
                        {
                            max: 5,
                            min: 5,
                            message: "只可输入5位",
                            trigger: ["input", "blur"]
                        }
                    ],
                    farmName: {
                        required: true,
                        message: "请输入场区名称"
                    }
                },
                rules: {
                    dormName: {
                        required: true,
                        message: "请输入猪舍名称"
                    },
                    farmCode: [
                        {
                            required: true,
                            message: "请选择所属场区/请输入场区编码",
                            trigger: ["input", "blur"]
                        }
                    ],
                    farmName: {
                        required: true,
                        message: "请输入场区名称"
                    },
                    application: {
                        required: true,
                        message: "请输入容量"
                    },
                    dormCode: {
                        required: true,
                        message: "请输入猪舍编码"
                    },
                    columnNum: {
                        required: true,
                        message: "请输入可用栏/床位数"
                    },
                    columnCode: {
                        required: true,
                        message: "请输入栏位"
                    },
                    columnCapacity: {
                        required: true,
                        message: "请输入栏位容量"
                    },
                    batchSize: {
                        required: true,
                        message: "请输入栏位个数"
                    }
                },
                getDormListByCode,
                clearAllForm,
                getDictionaries,
                dormFormSubmit() {
                    dormRef.value.validate(errors => {
                        if (!errors) {
                            state.dormForm.id ? updatePmDorm() : addDorm()
                        } else {
                            window.$message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                farmFormSubmit() {
                    farmRef.value.validate(errors => {
                        if (!errors) {
                            addFarm()
                        } else {
                            window.$message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                columnsFormBatchSubmit() {
                    columnsBatchRef.value.validate(errors => {
                        if (!errors) {
                            addColumnBatch()
                        } else {
                            window.$message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                columnsFormSubmit() {
                    columnsRef.value.validate(errors => {
                        if (!errors) {
                            state.columnsForm.id ? updatePmColumn() : addColumn()
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
                            name: "系统偏好设置"
                        }
                        emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                }
            }
        }
    })
</script>

<style lang='less' scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>