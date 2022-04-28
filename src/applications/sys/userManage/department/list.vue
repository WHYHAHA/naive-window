<template>
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <div>
            <n-card>
                <div class="border border-deepBlue p-2 rounded">
                    <n-space vertical>
                        <div class="text-deepBlue">设置企业的岗位和部门关系；</div>
                        <div>
                            <n-button type="info" @click="showAddModal">添加部门 / 分组</n-button>
                        </div>
                    </n-space>
                </div>
            </n-card>
            <n-card>
                <tableComponents :columns="columns" :data="tableData" :loading="showloading" v-model:search="search" @update:search="getDepartmentList"></tableComponents>
            </n-card>
        </div>
    </n-space>
    <!-- 添加部门/分组 -->
    <n-modal v-model:show="showRegisterModal" :mask-closable="false">
        <n-card style="width: 600px;" title="添加部门/分组" :bordered="false" size="huge">
            <n-form :label-width="80" :model="addFormValue" :rules="rules" ref="addFormRef" label-placement="left" :style="{maxWidth: '500px'}">
                <n-form-item label="名称" path="title">
                    <n-input placeholder="请输入名称" v-model:value="addFormValue.title" />
                </n-form-item>
                <n-form-item label="上级部门" path="pid">
                    <n-select placeholder="请输入上级部门" :options="department" v-model:value="addFormValue.pid" clearable />
                </n-form-item>
                <n-form-item label="备注" path="remark">
                    <n-input maxlength="200" show-count v-model:value="addFormValue.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" />
                </n-form-item>
                <n-form-item>
                    <div class="flex justify-center" style="width:100%">
                        <n-button type="info" @click="handleValidateClick" attr-type="button" class="mr-2">保存</n-button>
                        <n-button @click="showRegisterModal=false">取消</n-button>
                    </div>
                </n-form-item>
            </n-form>
        </n-card>
    </n-modal>
    <!-- 修改部门/分组 -->
    <n-modal v-model:show="showUpdateModal" :mask-closable="false">
        <n-card style="width: 600px;" title="修改部门/分组" :bordered="false" size="huge">
            <n-form :label-width="80" :model="updateFormValue" :rules="rules" ref="updateFormRef" label-placement="left" :style="{maxWidth: '500px'}">
                <n-form-item label="名称" path="title">
                    <n-input placeholder="请输入名称" v-model:value="updateFormValue.title" />
                </n-form-item>
                <n-form-item label="上级" path="pid">
                    <n-select placeholder="请选择上级" :options="department" v-model:value="updateFormValue.pid" clearable />
                </n-form-item>
                <n-form-item label="备注" path="remark">
                    <n-input maxlength="200" show-count v-model:value="updateFormValue.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" />
                </n-form-item>
                <n-form-item>
                    <div class="flex justify-center" style="width:100%">
                        <n-button type="info" @click="updateSubmit" attr-type="button" class="mr-2">保存</n-button>
                        <n-button @click="showUpdateModal=false">取消</n-button>
                    </div>
                </n-form-item>
            </n-form>
        </n-card>
    </n-modal>
</template>
<script>
    import { h, defineComponent, reactive, toRefs, onMounted, ref } from 'vue'
    import { NButton, NTag, NSpace, useNotification, useDialog } from 'naive-ui'
    import {
        getDepartmentListApi,
        getDepartmentAllApi,
        postAddDepartmentApi,
        postUpdateDepartmentApi,
        deleteDepartmentApi
    } from '@/api/userManage'
    import helper from '@/utils/helper.js'
    import tableComponents from '@/components/table.vue'

    const createColumns = ({ deleteDepartment, updateDepartment, startusingDepartment, departmentStr }) => {
        return [
            {
                title: '编号',
                width: 200,
                key: 'id'
            },
            {
                title: '名称',
                key: 'title'
            },
            {
                title: '上级部门',
                key: 'pid',
                render(row) {
                    let str = departmentStr(row)
                    return str
                }
            },
            {
                title: '创建时间',
                key: 'createtime'
            },
            {
                title: '备注',
                key: 'remark'
            },
            {
                title: '状态',
                key: 'available',
                render(row) {
                    return h(
                        NTag,
                        {
                            style: {
                                marginRight: '6px'
                            },
                            type: row.available == '1' ? 'success' : 'error'
                        },
                        {
                            default: () => (row.available == '1' ? '启用' : '停用')
                        }
                    )
                }
            },
            {
                title: '操作',
                width: 200,
                render(row) {
                    return h(NSpace, {}, [
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'info',
                                onClick: () => updateDepartment(row)
                            },
                            { default: () => '编辑' }
                        ),
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: row.available == 1 ? 'error' : 'success',
                                onClick: () => (row.available == 1 ? deleteDepartment(row) : startusingDepartment(row))
                            },
                            { default: () => (row.available == 1 ? '停用' : '启用') }
                        )
                    ])
                }
            }
        ]
    }

    export default defineComponent({
        name: 'departmentList',
        props: {
            pageData: Object
        },
        components: {
            tableComponents
        },
        setup(props, { emit }) {
            const notification = useNotification()
            const dialog = useDialog()
            const addFormRef = ref(null)
            const updateFormRef = ref(null)
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: 'syspreferences/list', name: '偏好设置' },
                    { pageUrl: 'sys/userManage/department/list', name: '组织' }
                ],
                search: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                showloading: false,
                department: [],
                tableData: [],
                addFormValue: {},
                updateFormValue: {},
                showRegisterModal: false,
                showUpdateModal: false
            })
            // 获取列表
            const getDepartmentList = async page => {
                state.showloading = true
                page ? (state.search.page = page) : ''
                await getDepartmentListApi(state.search).then(res => {
                    state.tableData = res.data.list
                    state.search.total = res.data.total
                    state.showloading = false
                })
            }
            // 获取全部部门
            const getDepartmentAll = async () => {
                await getDepartmentAllApi().then(res => {
                    if (res.code == 0) {
                        res.data.forEach(element => {
                            element.label = element.title
                            element.value = element.id
                        })
                        state.department = res.data
                    }
                })
            }
            onMounted(() => {
                getDepartmentList()
                getDepartmentAll()
            })
            return {
                ...toRefs(state),
                // 表单
                addFormRef,
                updateFormRef,
                getDepartmentList,
                rules: {
                    title: [
                        {
                            required: true,
                            message: '请输入部门名称',
                            trigger: ['input', 'blur']
                        },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['input', 'blur'] }
                    ]
                },
                columns: createColumns({
                    //上级部门
                    departmentStr(row) {
                        let i = state.department.findIndex(item => {
                            return item.id == row.pid
                        })
                        return i >= 0 ? state.department[i].title : '暂无'
                    },
                    // 删除
                    deleteDepartment(rowData) {
                        dialog.warning({
                            title: '警告',
                            content: '确认删除该部门吗？',
                            positiveText: '确定',
                            negativeText: '取消',
                            onPositiveClick: () => {
                                const params = {
                                    id: rowData.id,
                                    available: 0
                                }
                                deleteDepartmentApi(params).then(res => {
                                    if (res.code == 0) {
                                        getDepartmentList()
                                        notification['success']({
                                            content: '部门删除成功',
                                            duration: 5000
                                        })
                                    }
                                })
                            }
                        })
                    },
                    // 启用
                    startusingDepartment(rowData) {
                        dialog.warning({
                            title: '警告',
                            content: '确认启用该部门吗？',
                            positiveText: '确定',
                            negativeText: '取消',
                            onPositiveClick: () => {
                                const params = {
                                    id: rowData.id,
                                    available: 1
                                }
                                deleteDepartmentApi(params).then(res => {
                                    if (res.code == 0) {
                                        getDepartmentList()
                                        notification['success']({
                                            content: '部门启用成功',
                                            duration: 5000
                                        })
                                    }
                                })
                            }
                        })
                    },
                    // 修改
                    updateDepartment(rowData) {
                        rowData.title ? (state.updateFormValue.title = rowData.title) : ''
                        rowData.remark ? (state.updateFormValue.remark = rowData.remark) : ''
                        rowData.pid ? (state.updateFormValue.pid = rowData.pid) : ''
                        rowData.id ? (state.updateFormValue.id = rowData.id) : ''
                        state.showUpdateModal = true
                    }
                }),
                showAddModal() {
                    state.showRegisterModal = true
                },
                // 添加表单提交
                handleValidateClick() {
                    addFormRef.value.validate(errors => {
                        if (!errors) {
                            // message.success('Valid')
                            helper.Debounce(() => {
                                postAddDepartmentApi(state.addFormValue).then(res => {
                                    if (res.code == 0) {
                                        state.showRegisterModal = false
                                        state.addFormValue = {}
                                        getDepartmentList(1)
                                        getDepartmentAll()
                                        notification['success']({
                                            content: '部门/分组添加成功',
                                            duration: 5000
                                        })
                                    }
                                })
                            }, 1000)
                        } else {
                            console.log(errors)
                            // message.error('Invalid')
                        }
                    })
                },
                updateSubmit() {
                    updateFormRef.value.validate(errors => {
                        if (!errors) {
                            // message.success('Valid')
                            helper.Debounce(() => {
                                postUpdateDepartmentApi(state.updateFormValue).then(res => {
                                    if (res.code == 0) {
                                        state.showUpdateModal = false
                                        getDepartmentList()
                                        notification['success']({
                                            content: '部门修改成功',
                                            duration: 5000
                                        })
                                    }
                                })
                            }, 1000)
                        } else {
                            console.log(errors)
                            // message.error('Invalid')
                        }
                    })
                },
                // 面包屑去往父级
                goFatherPage(index) {
                    if (index == 0) {
                        const data = {
                            pageUrl: 'sys/preferences',
                            name: '系统偏好设置'
                        }
                        emit('gopage', data)
                    } else {
                        window.$message.warning('您已在当前页面！')
                    }
                }
            }
        }
    })
</script>
<style lang="">
</style>