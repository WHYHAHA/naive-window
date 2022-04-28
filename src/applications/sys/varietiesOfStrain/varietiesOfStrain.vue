<template>
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item
                    v-for="(item, index) in breadcrumbList"
                    :key="index"
                    @click="goFatherPage(index, item)"
                    >{{ item.name }}</n-breadcrumb-item
                >
            </n-breadcrumb>
        </n-card>
        <n-card title="系统偏好设置|品种品系">
            <n-grid x-gap="20" :cols="2">
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>品种品系：</div>
                        </n-space>
                    </div>
                    <!-- <tableComponents :columns="varietiesColumns" :data="varietiesData" :loading="showloading" v-model:search="search" :clickIndex="leftClickIndex" @update:search="getFatherDictList"></tableComponents> -->
                    <n-data-table :columns="varietiesColumns" :data="varietiesData1"></n-data-table>
                </n-gi>
                <n-gi>
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center">
                            <div>详情：</div>
                            <n-space justify="space-between">
                                <n-button
                                    v-if="flag"
                                    type="info"
                                    size="medium"
                                    @click="theNewStrain = true"
                                    >新增品系</n-button
                                >
                                <n-input
                                    v-if="flag"
                                    :style="{ width: '300px' }"
                                    placeholder="请输入查询品系"
                                    v-model:value="pigCode"
                                    clearable
                                    @keyup.enter="getstraintheFuzzyList"
                                    @clear="
                                        () => {
                                            pigCode = ''
                                            getstraintheFuzzyList()
                                        }
                                    "
                                />
                            </n-space>
                        </n-space>
                    </div>
                    <!-- <n-data-table :loading="loadingColumns" :columns="strainList" :data="strainListData" :pagination="pagination"></n-data-table> -->
                    <tableComponents
                        :loading="loadingColumns"
                        :columns="strainList"
                        :data="strainListData"
                        v-model:search="search"
                        :clickIndex="leftClickIndex"
                        @update:search="toObtainStrain()"
                    ></tableComponents>
                </n-gi>
            </n-grid>
        </n-card>
        <!-- 操作合成码 -->
        <n-modal
            class="custom-card"
            v-model:show="synthesisOfCode"
            preset="card"
            :style="{ width: '800px' }"
            title="合成码数据"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="clearAllForm()"
        >
            <n-form
                :model="strainForm"
                ref="strainformRef"
                :rules="strainRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-scrollbar style="max-height: 300px">
                        <n-data-table
                            :columns="syntheticOperationCode"
                            :data="syntheticOperationCodeData"
                            :size="small"
                        />
                    </n-scrollbar>
                    <n-grid x-gap="12" :cols="2">
                        <n-gi>
                            <n-form-item path="compositeBoarStrain" label="父品系">
                                <n-select
                                    v-model:value="strainForm.compositeBoarStrain"
                                    :options="selectFatherOptions"
                                    filterable
                                    clearable
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item path="compositeSowStrain" label="母品系">
                                <n-select
                                    v-model:value="strainForm.compositeSowStrain"
                                    :options="selectMotherOptions"
                                    filterable
                                    clearable
                                />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-space justify="center" align="center" vertical :size="20">
                        <n-space>
                            <n-button type="info" @click="nextAddChild('add')" attr-type="button"
                                >新增一条</n-button
                            >
                            <n-button
                                v-if="changeCode"
                                type="info"
                                @click="nextAddChild('update')"
                                attr-type="button"
                                >修改合成码</n-button
                            >
                            <n-button
                                v-if="leftClickIndex > 0"
                                @click="
                                    () => {
                                        showAddChild = false
                                        clearAddChildForm()
                                    }
                                "
                                >取消</n-button
                            >
                        </n-space>
                    </n-space>
                    <n-space justify="center">
                        <n-button
                            type="info"
                            @click="handleValidateAddChildClick"
                            attr-type="button"
                            >全部保存提交</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
        <!-- 新增品系 -->
        <n-modal
            class="custom-card"
            v-model:show="theNewStrain"
            preset="card"
            :style="{ width: '600px' }"
            title="新增品系"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="clearForm()"
        >
            <n-form v-model="varietiesOfTable" label-placement="left">
                <n-form-item label="品种">
                    <!-- v-model:value="leftDictCode" -->
                    <n-select
                        v-model:value="addForm.dictCode"
                        :options="varietiesData1"
                        placeholder="请输入品种"
                    />
                </n-form-item>
                <n-form-item label="品系">
                    <n-input
                        maxlength="4"
                        v-model:value="addForm.strainName"
                        placeholder="请输入品系"
                    />
                </n-form-item>
                <n-space justify="center">
                    <n-button type="success" @click="addstrain">确认</n-button>
                    <n-button
                        @click="
                            () => {
                                theNewStrain = false
                                clearForm()
                            }
                        "
                        >取消</n-button
                    >
                </n-space>
            </n-form>
        </n-modal>
    </n-space>
</template>

<script>
    import { defineComponent, reactive, toRefs, h, onMounted, computed, ref } from "vue"
    import tableComponents from "@/components/table.vue"
    import { NButton, NSpace, useMessage, useDialog } from "naive-ui"
    import {
        getstrainList,
        getspeciesList,
        getwithStrain,
        addwithStrainData,
        sendAllSave,
        getMotherStrainApi,
        deleteStrainList
    } from "@/api/varietiesOfStrain.js"
    import { useStore } from "vuex"
    export default defineComponent({
        name: "varietiesOfStrain",
        components: {
            tableComponents
        },
        setup(props, { emit }) {
            const strainformRef = ref()
            const message = useMessage()
            const dialog = useDialog()
            const state = reactive({
                search: {
                    sources: ""
                },
                breadcrumbList: [
                    { pageUrl: "syspreferences/list", name: "偏好设置" },
                    { pageUrl: "sys/varietiesOfStrain/varietiesOfStrain", name: "品种品系" }
                ],
                varietiesColumns: [],
                varietiesData: computed(() => {
                    return store.getters["dictionaries/getDictionaries"]("pigSources")
                }),
                // 新增品系
                theNewStrain: false,

                // 品系表
                varietiesOfTable: {},
                varietiesData1: [],
                loadingColumns: false,
                // 品种
                strainList: [],
                strainListData: [],
                // 品系数据
                synthesisOfCodeList: [],
                synthesisOfCode: false,
                // 操作合成码
                syntheticOperationCode: [],
                syntheticOperationCodeData: [],
                selectFatherOptions: [],
                selectMotherOptions: [],
                strainForm: {
                    compositeBoarStrain: "",
                    compositeSowStrain: ""
                },
                addForm: {
                    dictCode: null,
                    strainName: null
                },
                flag: false,
                // 品系
                rootStrainCode: "",
                // 修改合成码
                changeCode: false,
                // 合成码ID
                clickIndex: "",
                // 模糊搜索品系
                pigCode: ""
            })
            const store = useStore()

            const setTableColumns = () => {
                state.varietiesColumns = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        title: "品种",
                        key: "dictName"
                    },
                    {
                        title: "数量",
                        key: "count"
                    },
                    {
                        title: "操作",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onclick: () => {
                                            state.leftDictCode = row.dictCode
                                            toObtainStrain(state.leftDictCode)
                                        }
                                    },
                                    { default: () => "查看详情" }
                                )
                            ])
                        }
                    }
                ]
                state.strainList = [
                    {
                        title: "品系",
                        key: "strainCode"
                    },
                    {
                        title: "合成码",
                        key: "compositeCode",
                        render(row) {
                            // console.log(row)
                            return row.composite
                                .map(item => {
                                    return item.compositeCode
                                })
                                .toString()
                        }
                    },
                    {
                        title: "操作",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "success",
                                        text: "true",
                                        onclick: () => {
                                            row.composite?.forEach(t => {
                                                t.label = t.compositeCode
                                                t.value = t.compositeCode
                                            })
                                            state.rootStrainCode = row.strainCode
                                            // 对应行合成码获取
                                            state.syntheticOperationCodeData = JSON.parse(
                                                JSON.stringify(row.composite)
                                            )
                                            // 获取父品系合成码
                                            viewTheSyntheticCode(row)
                                            // 获取母品系合成码
                                            getMotherStrain(row)
                                            state.synthesisOfCode = true
                                            state.changeCode = false
                                        }
                                    },
                                    { default: () => "操作合成码" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: "true",
                                        onclick: () => {
                                            toRemoveStrains(row)
                                        }
                                    },
                                    { default: () => "删除品系" }
                                )
                            ])
                        }
                    }
                ]
                state.syntheticOperationCode = [
                    {
                        title: "序号",
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        title: "归属品系",
                        key: "strainName"
                    },
                    {
                        title: "合成码",
                        key: "compositeCode"
                    },
                    {
                        title: "操作",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: "true",
                                        onclick: () => {
                                            state.strainForm = JSON.parse(JSON.stringify(row))
                                            state.changeCode = true
                                            state.clickIndex = index
                                        }
                                    },
                                    { default: () => "修改" }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: "true",
                                        onclick: () => {
                                            state.syntheticOperationCodeData.splice(index, 1)
                                        }
                                    },
                                    { default: () => "删除" }
                                )
                            ])
                        }
                    }
                ]
            }
            // 删除品系
            const toRemoveStrains = async row => {
                await deleteStrainList({ id: row.id }).then(res => {
                    dialog.warning({
                        title: "警告",
                        content: "你确定删除吗？",
                        positiveText: "确定",
                        negativeText: "取消",
                        onPositiveClick: () => {
                            message.success("确定")
                            if (res.code == 0) {
                                toObtainStrain(state.leftDictCode)
                                setTableColumns()
                                getspeciesListData()
                            }
                        },
                        onNegativeClick: () => {
                            message.error("不确定")
                        }
                    })
                })
            }
            // 全部提交
            const handleValidateAddChildClick = async () => {
                await sendAllSave({ list: state.syntheticOperationCodeData }).then(res => {
                    if (res.code == 0) {
                        state.synthesisOfCode = false
                        console.log(res.data)
                    } else {
                        state.synthesisOfCode = true
                        window.$message(res.msg)
                        return
                    }
                })
                toObtainStrain(state.leftDictCode)
            }
            // 新增品系
            const addstrain = async () => {
                await addwithStrainData({
                    sources: state.addForm.dictCode,
                    strainName: state.addForm.strainName
                }).then(res => {
                    if (res.code == 0) {
                        // console.log(state.leftDictCode)
                        state.theNewStrain = false
                        getspeciesListData()
                        toObtainStrain(state.addForm.dictCode)
                    } else {
                        state.theNewStrain = true
                    }
                })
            }
            // 品系框删除
            const clearForm = () => {
                state.addForm = {
                    dictCode: null,
                    strainName: null
                }
            }
            // 获取品种
            const getspeciesListData = async () => {
                await getspeciesList().then(res => {
                    if (res.code == 0) {
                        // console.log(res.data)
                        res.data.forEach(item => {
                            item.label = item.dictName
                            item.value = item.dictCode
                        })
                        state.varietiesData1 = res.data
                    }
                })
            }
            // 获取品系
            const toObtainStrain = async sources => {
                state.loadingColumns = true
                state.flag = true
                sources ? (state.search.sources = sources) : ""
                await getstrainList(state.search).then(res => {
                    state.loadingColumns = false
                    if (res.code == 0) {
                        state.strainListData = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 新增一条合成码
            const nextAddChild = type => {
                strainformRef.value?.validate(errors => {
                    if (!errors) {
                        // 品系赋值
                        state.strainForm.strainName = state.rootStrainCode
                        // 合成 合成码
                        state.strainForm.compositeCode =
                            state.strainForm.compositeBoarStrain +
                            state.strainForm.compositeSowStrain

                        let falg = true
                        state.syntheticOperationCodeData.forEach(element => {
                            element.compositeCode == state.strainForm.compositeCode
                                ? (falg = false)
                                : ""
                        })
                        if (!falg) {
                            window.$message.error("有重复品系的合成码")
                            return false
                        }
                        // 赋值
                        if (type == "add") {
                            state.syntheticOperationCodeData.push(
                                JSON.parse(JSON.stringify(state.strainForm))
                            )
                        } else {
                            state.syntheticOperationCodeData[state.clickIndex] = JSON.parse(
                                JSON.stringify(state.strainForm)
                            )
                            state.changeCode = false
                        }
                    } else {
                        console.log(errors)
                        window.$message.error("父品系或母品系必须填写一个")
                    }
                })
            }
            // 获取父品系合成码
            const viewTheSyntheticCode = async () => {
                await getwithStrain({ tableName: "pm_pig_sources_strain" }).then(res => {
                    if (res.code == 0) {
                        state.selectFatherOptions = res.data.map(item => {
                            return {
                                label: item.strainName,
                                value: item.strainCode
                            }
                        })
                    }
                })
            }
            // 获取母品系合成码
            const getMotherStrain = async () => {
                await getMotherStrainApi({ tableName: "pm_pig_sources_strain" }).then(res => {
                    if (res.code == 0) {
                        state.selectMotherOptions = res.data.map(item => {
                            return {
                                label: item.strainCode,
                                value: item.strainCode
                            }
                        })
                    }
                })
            }

            // 清空数据
            const clearAllForm = () => {
                state.synthesisOfCodeList = []
                state.syntheticOperationCodeData = []
                state.strainForm = {
                    compositeBoarStrain: "",
                    compositeSowStrain: ""
                }
            }
            // 查询品系(模糊)
            const getstraintheFuzzyList = async () => {
                // console.log(state.addForm.dictCode)
                state.loadingColumns = true
                await getstrainList({
                    sources: state.leftDictCode,
                    strainName: state.pigCode
                }).then(res => {
                    if (res.code == 0) {
                        state.loadingColumns = false
                        state.strainListData = res.data.list
                    }
                })
            }
            onMounted(() => {
                setTableColumns()
                getspeciesListData()
            })
            return {
                ...toRefs(state),
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
                },
                pagination: {
                    pageSize: 10
                },
                strainRules: {
                    compositeBoarStrain: {
                        required: true,
                        message: "请输入父品系",
                        trigger: "input"
                    },
                    compositeSowStrain: {
                        required: true,
                        message: "请输入母品系",
                        trigger: "input"
                    }
                },
                store,
                strainformRef,
                toObtainStrain,
                getspeciesListData,
                viewTheSyntheticCode,
                clearAllForm,
                nextAddChild,
                addstrain,
                clearForm,
                // 全部提交
                handleValidateAddChildClick,
                // 模糊搜索
                getstraintheFuzzyList,
                toRemoveStrains
            }
        }
    })
</script>

<style lang="less" scoped></style>
