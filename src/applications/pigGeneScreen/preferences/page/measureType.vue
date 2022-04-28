<template>
    <n-space vertical :size="0">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item
                    v-for="(item, index) in pageData.breadcrumbList"
                    :key="index"
                    @click="goFatherPage(index, item)"
                    >{{ item.name }}</n-breadcrumb-item
                >
            </n-breadcrumb>
        </n-card>

        <div class="p-2">
            <n-card title="偏好设置：耳样类型设置">
                <n-grid :cols="2" :x-gap="12">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="20">
                                <div class="font-16 font-weight-bolder">耳样类型</div>
                                <n-button
                                    type="info"
                                    class="col-2"
                                    @click="
                                        () => {
                                            closeForm()
                                            viewType = 'add'
                                        }
                                    "
                                    >新建耳样类型</n-button
                                >
                            </n-space>
                        </div>
                        <n-space vertical>
                            <n-data-table
                                :columns="columns"
                                :data="measureTypeList"
                                :row-class-name="rowClassName"
                            />
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
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0" justify="space-between">
                                <n-space align="center" :size="0">
                                    <div class="font-16 font-weight-bolder">耳样类型详情</div>
                                </n-space>
                            </n-space>
                        </div>

                        <n-form
                            :model="form"
                            ref="formRef"
                            :rules="rules"
                            label-placement="left"
                            :label-width="100"
                            v-if="viewType"
                        >
                            <n-space vertical :size="15">
                                <n-card title="基本：">
                                    <n-form-item path="tname" label="名称：">
                                        <n-input v-model:value="form.tname" />
                                    </n-form-item>
                                </n-card>
                                <n-card
                                    title="耳样范围设置："
                                    v-if="measureTemplate['耳样范围设置']"
                                >
                                    <n-form-item
                                        label="性别："
                                        v-if="measureTemplate['耳样范围设置']['性别']"
                                    >
                                        <n-checkbox-group
                                            v-model:value="form.measuringRange.gender"
                                            name="radiogroup"
                                        >
                                            <n-space>
                                                <n-checkbox
                                                    v-for="list in getDictionaries('gender')"
                                                    :key="list.value"
                                                    :value="list.value"
                                                    >{{ list.label }}</n-checkbox
                                                >
                                            </n-space>
                                        </n-checkbox-group>
                                    </n-form-item>
                                    <n-form-item
                                        label="日龄："
                                        v-if="measureTemplate['耳样范围设置']['日龄']"
                                        class="feedback-wrapper-noHeight"
                                    >
                                        <n-space>
                                            <n-form-item>
                                                <n-input-number
                                                    v-model:value="
                                                        form.measuringRange.daysOfAgeStar
                                                    "
                                                    :min="0"
                                                    :style="{ width: '100px' }"
                                                />
                                            </n-form-item>
                                            <n-form-item>—</n-form-item>
                                            <n-form-item>
                                                <n-input-number
                                                    v-model:value="form.measuringRange.daysOfAgeEnd"
                                                    :min="0"
                                                    :style="{ width: '100px' }"
                                                />
                                            </n-form-item>
                                        </n-space>
                                    </n-form-item>
                                    <n-form-item
                                        label="品种："
                                        v-if="measureTemplate['耳样范围设置']['品种']"
                                    >
                                        <n-checkbox-group
                                            v-model:value="form.measuringRange.pigSources"
                                        >
                                            <n-space item-style="display: flex;">
                                                <n-checkbox
                                                    v-for="list in getDictionaries('pigSources')"
                                                    :key="list.value"
                                                    :value="list.value"
                                                    :label="list.label"
                                                />
                                            </n-space>
                                        </n-checkbox-group>
                                    </n-form-item>
                                    <n-form-item
                                        label="群："
                                        v-if="measureTemplate['耳样范围设置']['群']"
                                    >
                                        <n-checkbox-group
                                            v-model:value="form.measuringRange.breedingLevel"
                                            name="radiogroup"
                                        >
                                            <n-space>
                                                <n-checkbox
                                                    v-for="list in getDictionaries('breedingLevel')"
                                                    :key="list.value"
                                                    :value="list.value"
                                                    >{{ list.label }}</n-checkbox
                                                >
                                            </n-space>
                                        </n-checkbox-group>
                                    </n-form-item>
                                </n-card>
                                <n-card
                                    title="常规耳样项目设置："
                                    v-if="measureTemplate['常规耳样项目设置']"
                                >
                                    <n-form-item
                                        path="measuringProject.otoid"
                                        v-if="measureTemplate['常规耳样项目设置']['耳样']"
                                    >
                                        <n-checkbox-group
                                            v-model:value="form.measuringProject.otoid"
                                        >
                                            <n-space item-style="display: flex;">
                                                <n-checkbox
                                                    v-for="list in getDictionaries('otoid')"
                                                    :key="list.value"
                                                    :value="list.value"
                                                    :label="list.label"
                                                    class="mt-2"
                                                    >{{ list.label }}</n-checkbox
                                                >
                                            </n-space>
                                        </n-checkbox-group>
                                    </n-form-item>
                                </n-card>
                                <n-space justify="left">
                                    <n-button class="col-2" type="info" @click="handleValidateClick"
                                        >确认</n-button
                                    >
                                    <n-button
                                        class="col-2"
                                        @click="
                                            () => {
                                                closeForm()
                                                leftClickIndex = -1
                                            }
                                        "
                                        >取消</n-button
                                    >
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
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getMeasureTypeListApi,
        getMeasureTemplateApi,
        getMeasureTypeDetailApi,
        addMeasureTypeApi,
        upDataMeasureTypeApi,
        upDataMeasureTypeStatusApi
    } from "@/api/pigMeasure.js"
    import { useStore } from "vuex"

    export default defineComponent({
        props: {
            pageData: Object
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
                // 基因 3
                search: {
                    page: 1,
                    limit: 10,
                    typeStatus: "3",
                    total: undefined
                },
                form: {
                    tname: undefined,
                    typeStatus: "3",
                    measuringRange: {
                        gender: undefined,
                        breedingLevel: undefined,
                        pigSources: undefined,
                        daysOfAgeStar: 0,
                        daysOfAgeEnd: 0
                    },
                    measuringProject: {
                        otoid: []
                    }
                }
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
                await getMeasureTemplateApi({ id: 3 }).then(res => {
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
                    typeStatus: "3",
                    measuringRange: {
                        gender: undefined,
                        breedingLevel: undefined,
                        pigSources: undefined,
                        daysOfAgeStar: 0,
                        daysOfAgeEnd: 0
                    },
                    measuringProject: {
                        otoid: undefined
                    }
                }
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        title: "类型名称",
                        key: "tname"
                    },
                    {
                        title: "创建日期",
                        key: "createid"
                    },
                    {
                        title: "创建人",
                        key: "createid"
                    },
                    {
                        title: "状态",
                        key: "status",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px"
                                    },
                                    type: row.status == "1" ? "success" : "error"
                                },
                                {
                                    default: () => (row.status == "1" ? "启用" : "停用")
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
                                            state.leftClickIndex = index
                                            getMeasureTypeDetail(row)
                                        }
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
                                                        status: status
                                                    })
                                                }
                                            })
                                        }
                                    },
                                    { default: () => (row.status == "1" ? "停用" : "启用") }
                                )
                            ])
                        }
                    }
                ]
            }
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
                        trigger: ["input", "blur"]
                    },
                    measuringProject: {
                        otoid: {
                            type: "array",
                            required: true,
                            trigger: "change",
                            message: "请选择至少一项"
                        }
                    }
                },
                // 面包屑去往父级
                goFatherPage(index) {
                    if (index == 0) {
                        const data = {
                            pageUrl: "pigGeneScreen/preferences/list",
                            name: "偏好设置"
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
                }
            }
        }
    })
</script>

<style lang="less" scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>
