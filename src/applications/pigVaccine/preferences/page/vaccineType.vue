<template >
    <n-space vertical :size="0">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in pageData.breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>

        <div class="p-2">
            <!-- 偏好设置：疫苗类型设置 -->
            <n-card :title="$t('dataTable.listing.preferences') + '：' + $t('dataTable.listing.vaccineTypeSetting')">
                <n-grid :cols="2" :x-gap="12">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="20">
                                <!-- 疫苗类型，新增疫苗 -->
                                <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.vaccineCommonType')}}</div>
                                <n-button type="info" class="col-2" @click="clearForm();vaccineModal=true">{{$t('dataTable.listing.addVaccine')}}</n-button>
                            </n-space>
                        </div>
                        <n-space vertical>
                            <tableComponents
                                size="small"
                                :columns="columns"
                                :data="vaccineTypeList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                :pageSlot="6"
                                v-model:search="search"
                                @update:search="getPreferencesVaccineList"
                            ></tableComponents>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0" justify="space-between">
                                <n-space align="center" :size="0">
                                    <!-- 疫苗详情 -->
                                    <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.vaccineDetails')}}</div>
                                </n-space>
                            </n-space>
                        </div>

                        <n-form :model="form" ref="formRef" :rules="rules" label-placement="left" :label-width="100" v-if="leftClickIndex>=0">
                            <n-space vertical :size="15">
                                <!-- 疫苗接种设置，疫苗名称，供应商，性别，接种条件 -->
                                <n-card :title="$t('dataTable.listing.vaccinationSettings') + '：'">
                                    <n-form-item path="vaccineCommonName" :label="$t('dataTable.listing.vaccineName') + '：'">
                                        <n-input-group>
                                            <n-input v-model:value="form.vaccineCommonName" />
                                        </n-input-group>
                                    </n-form-item>
                                    <n-form-item path="vaccineProductionEnterprise" :label="$t('dataTable.listing.supplier') + '：'">
                                        <n-input v-model:value="form.vaccineProductionEnterprise" />
                                    </n-form-item>
                                    <n-form-item path="gerderId" :label="$t('dataTable.listing.gender') + '：'">
                                        <n-radio-group v-model:value="form.gerderId" name="gerderId">
                                            <n-space>
                                                <n-radio value="0">不限</n-radio>
                                                <n-radio value="1">公</n-radio>
                                                <n-radio value="2">母</n-radio>
                                            </n-space>
                                        </n-radio-group>
                                    </n-form-item>
                                    <n-form-item path="severalWeeks" :label="$t('dataTable.listing.inoculationConditions') + '：'">
                                        <n-space align="center">
                                            <!-- <n-select :style="{width: '200px'}" v-model:value="form.inoculateCondition" :options="getDictionaries('pigStatus')" /> -->
                                            <div>出生后第</div>
                                            <n-input-number v-model:value="form.severalWeeks" :min="0" :max="1000" :style="{width: '200px'}">
                                                <template #suffix>周</template>
                                            </n-input-number>
                                        </n-space>
                                    </n-form-item>
                                </n-card>
                                <n-space justify="left">
                                    <!-- 确认，取消 -->
                                    <n-button class="col-2" type="info" @click="handleValidateClick">{{$t('button.preservation')}}</n-button>
                                    <n-button class="col-2" @click="clearForm();leftClickIndex=-1">{{$t('button.cancel')}}</n-button>
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

        <!-- 新增疫苗 -->
        <n-modal class="custom-card" v-model:show="vaccineModal" preset="card" :style="{  width: '800px'}" title="新增疫苗" :bordered="false" @afterLeave="clearForm()" :mask-closable="false">
            <n-form :model="form" ref="formRef" :rules="rules" label-placement="left" :label-width="100">
                <n-space vertical>
                    <n-form-item path="vaccineCommonName" label="疫苗名称：">
                        <n-input-group>
                            <n-input v-model:value="form.vaccineCommonName" :style="{ width: '255px' }" />
                        </n-input-group>
                    </n-form-item>
                    <n-form-item path="vaccineProductionEnterprise" label="厂家：">
                        <n-input v-model:value="form.vaccineProductionEnterprise" :style="{ width: '255px' }" />
                    </n-form-item>
                    <n-form-item path="gerderId" label="性别：">
                        <n-radio-group v-model:value="form.gerderId" name="gerderId">
                            <n-space>
                                <n-radio value="0">不限</n-radio>
                                <n-radio value="1">公</n-radio>
                                <n-radio value="2">母</n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item path="severalWeeks" label="接种条件：">
                        <n-space align="center">
                            <!-- <n-select :style="{width: '200px'}" v-model:value="form.inoculateCondition" :options="getDictionaries('pigStatus')" /> -->
                            <div>出生后第</div>
                            <n-input-number v-model:value="form.severalWeeks" :min="0" :max="1000" :style="{width: '185px'}">
                                <template #suffix>周</template>
                            </n-input-number>
                        </n-space>
                    </n-form-item>

                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">保存</n-button>
                        <n-button @click="vaccineModal=false">取消</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getPreferencesVaccineListApi,
        addVaccineTypeApi,
        updateVaccineTypeApi,
    } from "@/api/pigVaccine.js"
    import { useStore } from "vuex"
    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"
    import { useI18n } from "vue-i18n"

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
            const { t } = useI18n()
            const dialog = useDialog()
            const state = reactive({
                leftClickIndex: -1,
                vaccineModal: false,
                showloading: false,
                vaccineTypeList: [],
                columns: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                form: {
                    available: undefined,
                    vaccineCommonName: undefined,
                    supplier: undefined,
                    gerderId: undefined,
                    inoculateCondition: undefined,
                    severalWeeks: undefined,
                },
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            // 获取 疫苗列表
            const getPreferencesVaccineList = async () => {
                state.showloading = true
                await getPreferencesVaccineListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.vaccineTypeList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 添加
            const addVaccineType = async () => {
                await addVaccineTypeApi(state.form).then(res => {
                    if (res.code == 0) {
                        message.success("添加成功")
                        clearForm()
                        state.vaccineModal = false
                        state.search.page = 1
                        getPreferencesVaccineList()
                    }
                })
            }
            // 修改
            const updateVaccineType = async () => {
                await updateVaccineTypeApi(state.form).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功")
                        clearForm()
                        state.leftClickIndex = -1
                        state.vaccineModal = false
                        state.search.page = 1
                        getPreferencesVaccineList()
                    }
                })
            }
            const clearForm = () => {
                state.form = {
                    vaccineCommonName: undefined,
                    supplier: undefined,
                    gerderId: undefined,
                    inoculateCondition: undefined,
                    severalWeeks: undefined,
                }
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '序号',
                        title: () => {
                            return t("dataTable.listing.serialNumber")
                        },
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        // title: '疫苗名称',
                        title: () => {
                            return t("dataTable.listing.vaccineName")
                        },
                        key: "vaccineCommonName",
                    },
                    {
                        // title: '创建日期',
                        title: () => {
                            return t("dataTable.listing.creationDate")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        },
                    },
                    {
                        // title: '创建人',
                        title: () => {
                            return t("dataTable.listing.founder")
                        },
                        key: "createid",
                    },
                    {
                        // title: '供应商',
                        title: () => {
                            return t("dataTable.listing.supplier")
                        },
                        key: "vaccineProductionEnterprise",
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
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
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
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
                                            state.form = row
                                        },
                                    },
                                    { default: () => t("button.edit") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.available == "1" ? "error" : "success",
                                        text: true,
                                        onClick: () => {
                                            let mark = row.available == "1" ? "停用" : "启用"
                                            let status = row.available == "1" ? "0" : "1"
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    state.form.id = row.id
                                                    state.form.available = status
                                                    updateVaccineType()
                                                },
                                            })
                                        },
                                    },
                                    {
                                        default: () =>
                                            row.status == "1"
                                                ? t("button.deactivate")
                                                : t("button.enable"),
                                    }
                                ),
                            ])
                        },
                    },
                ]
            }
            onMounted(() => {
                getPreferencesVaccineList()
                // getMeasureTemplate()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getDictionaries,
                getPreferencesVaccineList,
                clearForm,

                // 检测规则
                rules: {
                    vaccineCommonName: {
                        required: true,
                        message: "请输入名称",
                        trigger: ["input", "blur"],
                    },
                    vaccineProductionEnterprise: {
                        required: true,
                        message: "请输入厂家",
                        trigger: ["input", "blur"],
                    },
                    gerderId: {
                        required: true,
                        message: "请选择性别",
                        trigger: ["input", "blur"],
                    },
                    severalWeeks: {
                        required: true,
                        message: "请选择接种条件",
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
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.form.id ? updateVaccineType() : addVaccineType()
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