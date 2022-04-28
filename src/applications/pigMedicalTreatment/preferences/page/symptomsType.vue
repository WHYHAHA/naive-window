<template >
    <n-space vertical :size="0">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in pageData.breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>

        <div class="p-2">
            <n-card title="偏好设置：常见病及用药设置">
                <n-grid :cols="2" :x-gap="12">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="20">
                                <div class="font-16 font-weight-bolder">症状列表</div>
                                <n-button type="info" class="col-2" @click="showAdd = true,closeAddForm()">新建常见病</n-button>
                            </n-space>
                        </div>
                        <tableComponents
                            size="small"
                            :columns="columns"
                            :data="symptomsTypeList"
                            :loading="showloading"
                            :clickIndex="leftClickIndex"
                            v-model:search="search"
                            @update:search="getSymptomsTypeList"
                        ></tableComponents>
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0" justify="space-between">
                                <n-space align="center" :size="0">
                                    <div class="font-16 font-weight-bolder">详情及用药：</div>
                                </n-space>
                            </n-space>
                        </div>

                        <n-form :model="rightForm" ref="rightFormRef" :rules="reightRules" label-placement="left" :label-width="100" v-if="viewType">
                            <n-space vertical :size="15">
                                <n-card>
                                    <n-form-item path="name" label="名称：">
                                        <n-input v-model:value="rightForm.name" maxlength="20" />
                                    </n-form-item>
                                    <n-form-item path="symptomsDescribe" label="病情描述：">
                                        <n-input v-model:value="rightForm.symptomsDescribe" type="textarea" maxlength="200" show-count placeholder="请输入描述详情" style="width:350px" />
                                    </n-form-item>
                                    <n-form-item path="infectivity" label="遗传性：">
                                        <n-radio-group v-model:value="rightForm.infectivity" name="radiogroup">
                                            <n-space>
                                                <n-radio v-for="itme in getDictionaries('genetic')" :key="itme.value" :value="itme.value">{{ itme.label }}</n-radio>
                                            </n-space>
                                        </n-radio-group>
                                    </n-form-item>

                                    <n-form-item path="genetic" label="传染性：">
                                        <n-radio-group v-model:value="rightForm.genetic" name="radiogroup">
                                            <n-space>
                                                <n-radio v-for="item in getDictionaries('infectivity')" :key="item.value" :value="item.value">{{ item.label }}</n-radio>
                                            </n-space>
                                        </n-radio-group>
                                    </n-form-item>
                                </n-card>

                                <n-card>
                                    <n-form-item path="models" label="药品名称">
                                        <n-select v-model:value="rightForm.models" multiple filterable :options="drugsList" :render-label="renderLabel" :style="{ width: '300px'}" />
                                    </n-form-item>
                                    <n-form-item path="drugExplain" label="备注：">
                                        <n-input v-model:value="rightForm.remark" type="textarea" maxlength="200" show-count placeholder="请输入备注" style="width:350px" />
                                    </n-form-item>
                                </n-card>

                                <n-space justify="left">
                                    <n-button class="col-2" type="info" @click="handleValidateClick()">保存</n-button>
                                    <n-button class="col-2" @click="closeForm();leftClickIndex=-1">取消</n-button>
                                </n-space>
                            </n-space>
                        </n-form>
                        <n-card v-else>
                            <n-empty description="请在左侧选择编辑" class="mt-3"></n-empty>
                        </n-card>
                    </n-gi>
                </n-grid>
            </n-card>
        </div>
    </n-space>
    <!-- 新建 -->
    <n-modal class="custom-card" v-model:show="showAdd" preset="card" :style="bodyStyle" title="新建常见病" :bordered="false" :mask-closable="false" @afterLeave="closeAddForm()">
        <n-form :model="addForm" ref="formRef" :rules="rules" label-placement="left" :label-width="100">
            <n-space vertical :size="10">
                <n-form-item path="name" label="名称" class="feedback-wrapper-noHeight">
                    <n-input :style="{ width: '300px' }" placeholder="请输入" v-model:value="addForm.name" maxlength="20" />
                </n-form-item>
                <n-form-item path="infectivity" label="传染性：" class="feedback-wrapper-noHeight">
                    <n-select v-model:value="addForm.infectivity" :options="getDictionaries('infectivity')" style="width:300px" />
                </n-form-item>
                <n-form-item path="genetic" label="遗传性：" class="feedback-wrapper-noHeight">
                    <n-select v-model:value="addForm.genetic" :options="getDictionaries('genetic')" style="width:300px" />
                </n-form-item>
                <n-form-item path="symptomsDescribe" label="描述：">
                    <n-input v-model:value="addForm.symptomsDescribe" type="textarea" maxlength="200" show-count placeholder="请输入描述" style="width:350px" />
                </n-form-item>
                <n-space justify="center">
                    <n-button type="info" @click="handelSymptoms()">确认</n-button>
                    <n-button @click="showAdd=false;closeAddForm()">取消</n-button>
                </n-space>
            </n-space>
        </n-form>
    </n-modal>

    <!-- 添加药品 -->
    <n-modal class="custom-card" v-model:show="showYao" preset="card" :style="bodyStyle" title="新建常见病" :bordered="false" :mask-closable="false" @afterLeave="closeDrugForm()">
        <n-form :model="addDrugForm" ref="drugFormRef" :rules="rules" label-placement="left" :label-width="100">
            <n-space vertical :size="10">
                <n-form-item path="commonName" label="药品名称">
                    <n-select v-model:value="addDrugForm.commonName" filterable tag :options="drugsList" :style="{ width: '300px' }" />
                </n-form-item>
                <n-form-item path="drugType" label="药品类型：" class="feedback-wrapper-noHeight">
                    <n-select v-model:value="addDrugForm.drugType" :options="getDictionaries('infectivity')" style="width:300px" />
                </n-form-item>
                <n-form-item path="drugExplain" label="使用说明：">
                    <n-input v-model:value="addDrugForm.drugExplain" type="textarea" maxlength="200" show-count placeholder="请输入描述详情" style="width:350px" />
                </n-form-item>
                <n-space justify="center">
                    <n-button type="info" @click="handelDrug()">确认</n-button>
                    <n-button @click="showYao=false;closeDrugForm()">取消</n-button>
                </n-space>
            </n-space>
        </n-form>
    </n-modal>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeMount, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTag } from "naive-ui"
    import {
        getSymptomsApi,
        deleteSymptomsByIdApi,
        updateStateApi,
        insertSymptomsApi,
        updateSymptomsApi,
        getPigDrugsBySymptomsIdApi,
        createPigSymptomsDrugsApi,
        updatePigDrugsApi,
        deletePigDrugsApi,
        getPigDrugsApi,
    } from "@/api/pigMedicalTreatment.js"
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
            const drugFormRef = ref(null)
            const rightFormRef = ref(null)

            const dialog = useDialog()
            const state = reactive({
                showAdd: false,
                showYao: false,
                viewType: false,
                showloading: false,
                leftClickIndex: -1,
                symptomsTypeList: [],
                measureTemplate: {},
                TypeList: [],
                columns: [],
                drugColumns: [],
                drugsTypeList: [],
                drugsList: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                rightSearch: {
                    id: undefined,
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
                addForm: {
                    name: undefined,
                    infectivity: undefined,
                    genetic: undefined,
                    symptomsDescribe: undefined,
                },
                rightForm: {
                    name: undefined,
                    infectivity: undefined,
                    genetic: undefined,
                    symptomsDescribe: undefined,
                    models: [],
                },
                addDrugForm: {
                    commonName: undefined,
                    drugType: undefined,
                    drugExplain: undefined,
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
            // 获取所有药品
            const getdrugs = async id => {
                await getPigDrugsApi({ pigSymptomsId: id }).then(res => {
                    if (res.code == 0) {
                        state.drugsList = []
                        res.data.forEach(item => {
                            state.drugsList.push({
                                label: item.commonName,
                                value: item.id,
                                style: item.pigSymptomsId ? { color: "#c97c10" } : {},
                            })
                        })
                    }
                })
            }

            // 获取回显的药品
            const getDrugsTypeList = async id => {
                state.rightSearch.id = id
                await getPigDrugsBySymptomsIdApi(state.rightSearch).then(res => {
                    if (res.code == 0) {
                        state.rightForm.models = []
                        res.data.list.forEach(item => {
                            state.rightForm.models.push(item.id)
                        })
                    }
                })
            }

            // 获取病症列表
            const getSymptomsTypeList = async () => {
                state.showloading = true
                await getSymptomsApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.symptomsTypeList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 删除
            const todelete = async row => {
                await deleteSymptomsByIdApi(row.id).then(res => {
                    if (res.code == 0) {
                        message.success("删除成功")
                    }
                })
            }

            // 添加病
            const addMeasureType = async () => {
                await insertSymptomsApi(state.addForm).then(res => {
                    if (res.code == 0) {
                        message.success("添加成功，正在为您刷新列表...")
                        closeAddForm()
                        state.showAdd = false
                        state.search.page = 1
                        getSymptomsTypeList()
                        // 更新字典表
                        store.dispatch("dictionaries/getAllDictionaries")
                    }
                })
            }
            // 修改
            const upDataMeasureType = async () => {
                await updateSymptomsApi(state.rightForm).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        closeForm()
                        state.search.page = 1
                        getSymptomsTypeList()
                    }
                })
            }
            // 启用停用
            const upDataMeasureTypeStatus = async row => {
                await updateStateApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        state.search.page = 1
                        getSymptomsTypeList()
                    }
                })
            }

            // 药品------------------------------------
            // 添加药品
            function addyao() {
                state.drugsTypeList.push(state.addDrugForm)
                state.showYao = false
                closeDrugForm()
            }
            const addDrug = async () => {
                await createPigSymptomsDrugsApi(state.addSymptomsForm).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        closeForm()
                        state.showYao = false
                        state.search.page = 1
                        getDrugsTypeList()
                    }
                })
            }

            // 修改药品
            const upDataDrug = async () => {
                await updatePigDrugsApi(state.addSymptomsForm).then(res => {
                    if (res.code == 0) {
                        message.success("修改成功，正在为您刷新列表...")
                        closeForm()
                        state.showYao = false
                        state.search.page = 1
                        getDrugsTypeList()
                    }
                })
            }

            // 删除药品
            const deleteDrug = async row => {
                await deletePigDrugsApi(row.id).then(res => {
                    if (res.code == 0) {
                        message.success("删除成功")
                        getDrugsTypeList()
                    }
                })
            }

            const closeAddForm = () => {
                state.addForm = {
                    id: undefined,
                    name: undefined,
                    infectivity: undefined,
                    genetic: undefined,
                    symptomsDescribe: undefined,
                }
            }

            const closeForm = () => {
                state.viewType = false
                state.rightForm = {
                    name: undefined,
                    infectivity: undefined,
                    genetic: undefined,
                    symptomsDescribe: undefined,
                    id: undefined,
                    models: [],
                    remark: undefined,
                }
            }

            const closeDrugForm = () => {
                state.addDrugForm = {
                    commonName: undefined,
                    drugType: undefined,
                    drugExplain: undefined,
                }
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        title: "序号",
                        width: 60,
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        title: "症状名称",
                        key: "name",
                        width: 150,
                        ellipsis: {
                            tooltip: true,
                        },
                    },
                    {
                        title: "症状描述",
                        key: "symptomsDescribe",
                        ellipsis: {
                            tooltip: true,
                        },
                    },
                    {
                        title: "传染性",
                        key: "infectivity",
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "infectivity",
                                    row.infectivity
                                ) || "--"
                            )
                        },
                    },
                    {
                        title: "遗传性",
                        key: "genetic",
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "genetic",
                                    row.genetic
                                ) || "--"
                            )
                        },
                    },
                    {
                        title: "状态",
                        key: "state",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px",
                                    },
                                    type: row.state == "1" ? "success" : "error",
                                },
                                {
                                    default: () => (row.state == "1" ? "启用" : "停用"),
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
                                                name: row.name,
                                                infectivity: row.infectivity,
                                                genetic: row.genetic,
                                                symptomsDescribe: row.symptomsDescribe,
                                                state: row.state,
                                                remark: row.remark,
                                                models: [],
                                            }
                                            state.viewType = true
                                            getdrugs(row.id)
                                            getDrugsTypeList(row.id)
                                        },
                                    },
                                    { default: () => "编辑" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.state == "1" ? "error" : "success",
                                        text: true,
                                        onClick: () => {
                                            let mark = row.state == "1" ? "停用" : "启用"
                                            // let status = row.status == '1' ? '0' : '1'
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定" + mark + "么？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    upDataMeasureTypeStatus(row)
                                                },
                                            })
                                        },
                                    },
                                    { default: () => (row.state == "1" ? "停用" : "启用") }
                                ),
                                //  h(
                                //     NButton,
                                //     {
                                //         size: 'small',
                                //         type: 'error',
                                //         text: true,
                                //         onClick: () => {
                                //             todelete(row)

                                //         }
                                //     },
                                //     { default: () => '删除' }
                                // ),
                            ])
                        },
                    },
                ]
            }

            const setChildColumns = () => {
                state.drugColumns = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        },
                    },
                    {
                        title: "药品名称",
                        key: "name",
                    },
                    {
                        title: "类型",
                        key: "infectivity",
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "infectivity",
                                    row.infectivity
                                ) || "--"
                            )
                        },
                    },
                    {
                        title: "说明",
                        key: "genetic",
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
                                            state.showAdd = true
                                            state.addForm = {
                                                id: row.id,
                                                name: row.name,
                                                infectivity: row.infectivity,
                                                genetic: row.genetic,
                                                symptomsDescribe: row.symptomsDescribe,
                                            }
                                        },
                                    },
                                    { default: () => "编辑" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: true,
                                        onClick: () => {
                                            dialog.warning({
                                                title: "警告",
                                                content: "确定删除吗？",
                                                positiveText: "确定",
                                                negativeText: "取消",
                                                onPositiveClick: () => {
                                                    todelete(row)
                                                    message.success("已删除该条信息!")
                                                },
                                            })
                                        },
                                    },
                                    { default: () => "删除" }
                                ),
                            ])
                        },
                    },
                ]
            }
            onBeforeMount(() => {
                // 获取育种等级字典
                store.dispatch("dictionaries/getPigDictionaries", "infectivity")
                store.dispatch("dictionaries/getPigDictionaries", "genetic")
            })
            onMounted(() => {
                getSymptomsTypeList()
                setTableColumns()
                setChildColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                drugFormRef,
                rightFormRef,
                getDictionaries,
                closeForm,
                closeAddForm,
                closeDrugForm,
                todelete,
                addMeasureType,
                getDrugsTypeList,
                getdrugs,
                addyao,
                getSymptomsTypeList,

                addDrug,
                upDataDrug,
                deleteDrug,
                bodyStyle: {
                    width: "800px",
                },
                // 检测规则
                rules: {
                    name: {
                        required: true,
                        message: "请输入名称",
                        trigger: ["input", "blur"],
                    },
                    infectivity: {
                        required: true,
                        message: "请选择",
                        trigger: ["input", "blur"],
                    },
                    genetic: {
                        required: true,
                        message: "请选择",
                        trigger: ["input", "blur"],
                    },
                },
                reightRules: {
                    name: {
                        required: true,
                        message: "请输入名称",
                        trigger: ["input", "blur"],
                    },
                    infectivity: {
                        required: true,
                        message: "请选择",
                        trigger: ["input", "blur"],
                    },
                    genetic: {
                        required: true,
                        message: "请选择",
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
                            pageUrl: "pigMedicalTreatment/preferences/list",
                            name: "偏好设置",
                        }
                        emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                },
                handleValidateClick() {
                    rightFormRef.value.validate(errors => {
                        if (!errors) {
                            upDataMeasureType()
                        } else {
                            message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                // 药品的
                handelSymptoms() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addMeasureType()
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