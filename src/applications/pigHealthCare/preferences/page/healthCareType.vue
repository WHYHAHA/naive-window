<template >
    <n-space vertical :size="0">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in pageData.breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>

        <div class="p-2">
            <n-card title="偏好设置：保健品设置">
                <n-grid :cols="2" :x-gap="12">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="20">
                                <div class="font-16 font-weight-bolder">保健目的列表</div>
                                <n-button type="info" class="col-2" @click="healthCareModal=true">新增保健目的</n-button>
                            </n-space>
                        </div>
                        <n-space vertical>
                            <tableComponents
                                size="small"
                                :columns="columns"
                                :data="healthCareTypeList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                v-model:search="search"
                                @update:search="getHealthCareSettings"
                            ></tableComponents>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0" justify="space-between">
                                <n-space align="center" :size="0">
                                    <div class="font-16 font-weight-bolder">保健目的及保健品</div>
                                </n-space>
                            </n-space>
                        </div>

                        <n-form :model="rightForm" ref="rightFormRef" :rules="rightRules" label-placement="left" :label-width="100" v-if="leftClickIndex>=0">
                            <n-space vertical :size="15">
                                <n-card>
                                    <n-form-item path="healthCarePurposeName" label="保健目的：">
                                        <n-input :style="{ width: '300px' }" placeholder="请输入" v-model:value="rightForm.healthCarePurposeName" maxlength="20" />
                                    </n-form-item>
                                    <n-form-item path="models" label="保健品:">
                                        <n-select v-model:value="rightForm.models" multiple filterable :options="drugsList" :style="{ width: '300px'}" />
                                    </n-form-item>

                                    <n-form-item path="remark" label="备注：">
                                        <n-input v-model:value="rightForm.remark" type="textarea" maxlength="200" show-count placeholder="请输入描述" style="width:350px" />
                                    </n-form-item>
                                </n-card>
                                <n-space justify="left">
                                    <n-button class="col-2" type="info" @click="handleValidateClick">确认</n-button>
                                    <n-button class="col-2" @click="clearForm();leftClickIndex=-1">取消</n-button>
                                </n-space>
                            </n-space>
                        </n-form>
                        <n-card v-else>
                            <n-empty description="请在左侧选择添加或编辑" class="mt-3"></n-empty>
                        </n-card>
                    </n-gi>
                </n-grid>
            </n-card>
        </div>

        <!-- 新增保健目的 -->
        <n-modal class="custom-card" v-model:show="healthCareModal" preset="card" :style="{  width: '800px'}" title="新增保健目的" :bordered="false" @afterLeave="clearForm()" :mask-closable="false">
            <n-form :model="form" ref="formRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical>
                    <n-form-item path="healthCarePurposeName" label="保健目的：" class="feedback-wrapper-noHeight">
                        <n-input :style="{ width: '300px' }" placeholder="请输入" v-model:value="form.healthCarePurposeName" maxlength="20" />
                    </n-form-item>

                    <n-form-item path="models" label="保健品:">
                        <n-select v-model:value="form.models" multiple filterable :options="drugsList" :style="{ width: '300px'}" />
                    </n-form-item>

                    <n-form-item path="remark" label="备注：">
                        <n-input v-model:value="form.remark" type="textarea" maxlength="200" show-count placeholder="请输入描述" style="width:350px" />
                    </n-form-item>

                    <n-space justify="center">
                        <n-button type="info" @click="handleAddValidateClick" attr-type="button">保存</n-button>
                        <n-button @click="healthCareModal=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed, onBeforeMount } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getHealthCareSettingsApi,
        addHealthCareSettingsApi,
        updateHealthCareSettingsApi,
        updateAvailableApi,
        getHealthCareSettingsListApi,
    } from "@/api/pigHealthCare.js"
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
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const rightFormRef = ref(null)
            const dialog = useDialog()
            const state = reactive({
                leftClickIndex: -1,
                healthCareModal: false,
                showloading: false,
                viewType: false,
                healthCareTypeList: [],
                columns: [],
                drugsList: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                form: {
                    healthCarePurposeName: undefined,
                    remark: undefined,
                    models: [],
                },
                rightForm: {
                    id: undefined,
                    healthCarePurposeName: undefined,
                    remark: undefined,
                    models: [],
                },
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            const getSymptomsList = computed(() => {
                return store.state.dictionaries.symptomsList
            })

            // 获取所有药品
            const getHealthDrugs = async () => {
                await getHealthCareSettingsListApi().then(res => {
                    if (res.code == 0) {
                        state.drugsList = []
                        res.data.forEach(item => {
                            state.drugsList.push({
                                label: item.nameOfHealthProducts,
                                value: item.id,
                            })
                        })
                    }
                })
            }

            // 获取 保健品列表
            const getHealthCareSettings = async () => {
                state.showloading = true
                await getHealthCareSettingsApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.healthCareTypeList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 添加
            const addHealthCareSettings = async () => {
                await addHealthCareSettingsApi(state.form).then(res => {
                    if (res.code == 0) {
                        message.success("添加成功，正在为您刷新列表...")
                        clearForm()
                        state.healthCareModal = false
                        state.search.page = 1
                        getHealthCareSettings()
                        // 更新字典表
                        store.dispatch("dictionaries/getAllDictionaries")
                    }
                })
            }
            // 修改
            const updateHealthCareSettings = async () => {
                await updateHealthCareSettingsApi(state.rightForm).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        clearRightForm()
                        state.leftClickIndex = -1
                        state.search.page = 1
                        getHealthCareSettings()
                    }
                })
            }

            // 启用停用
            const upDataHealthCareStatus = async row => {
                await updateAvailableApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        state.search.page = 1
                        getHealthCareSettings()
                    }
                })
            }

            const clearForm = () => {
                state.form = {
                    healthCarePurposeName: undefined,
                    remark: undefined,
                    models: [],
                }
            }

            const clearRightForm = () => {
                state.rightForm = {
                    id: undefined,
                    healthCarePurposeName: undefined,
                    remark: undefined,
                    models: [],
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
                        title: "保健目的",
                        key: "healthCarePurposeName",
                        ellipsis: {
                            tooltip: true,
                        },
                        // render(row) {
                        //     return store.getters['dictionaries/getSymptomName'](row.healthcarePurposeDescription)
                        // }
                    },
                    {
                        title: "备注",
                        key: "remark",
                        render(row) {
                            return row.remark || "--"
                        },
                        ellipsis: {
                            tooltip: true,
                        },
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
                                            state.leftClickIndex = index
                                            state.rightForm = {
                                                id: row.id,
                                                healthCarePurposeName: row.healthCarePurposeName,
                                                available: row.available,
                                                remark: row.remark,
                                                models: [],
                                            }
                                            row.healthCareSettingsBoList &&
                                                row.healthCareSettingsBoList.forEach(item => {
                                                    state.rightForm.models.push(item.id)
                                                })
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
                                            // let status = row.available == '1' ? '0' : '1'
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    upDataHealthCareStatus(row)
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
            onBeforeMount(() => {
                // 获取保健目的
                store.dispatch("dictionaries/getPigSymptomsList", 1)
            })
            onMounted(() => {
                getHealthCareSettings()
                // getMeasureTemplate()
                setTableColumns()
                getHealthDrugs()
            })
            return {
                ...toRefs(state),
                formRef,
                rightFormRef,
                getDictionaries,
                getSymptomsList,
                getHealthCareSettings,
                clearForm,
                clearRightForm,
                updateHealthCareSettings,
                getHealthDrugs,
                upDataHealthCareStatus,

                // 检测规则
                rules: {
                    healthCarePurposeName: {
                        required: true,
                        message: "请输入保健目的",
                        trigger: ["input", "blur"],
                    },
                    models: {
                        type: "array",
                        required: true,
                        trigger: "change",
                        message: "请选择至少一项",
                    },
                },
                rightRules: {
                    healthCarePurposeName: {
                        required: true,
                        message: "请输入保健目的",
                        trigger: ["input", "blur"],
                    },
                    models: {
                        type: "array",
                        required: true,
                        trigger: "change",
                        message: "请选择至少一项",
                    },
                },
                // 面包屑去往父级
                goFatherPage(index) {
                    if (index == 0) {
                        const data = {
                            pageUrl: "pigVaccine/preferences/list",
                            name: "偏好设置",
                        }
                        emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                },
                handleAddValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addHealthCareSettings()
                        } else {
                            message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                handleValidateClick() {
                    rightFormRef.value.validate(errors => {
                        if (!errors) {
                            updateHealthCareSettings()
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