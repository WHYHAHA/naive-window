<template >
    <n-card>
        <n-breadcrumb>
            <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
        </n-breadcrumb>
    </n-card>
    <div class="p-2">
        <n-card>
            <div class="border border-deepBlue p-2 rounded">
                <n-space vertical>
                    <div class="text-deepBlue">设置岗位/角色的权限（资源、数据、操作）；</div>
                    <div>
                        <n-button type="info" @click="showRegisterModal=true">添加角色</n-button>
                    </div>
                </n-space>
            </div>
        </n-card>
        <n-card>
            <n-layout>
                <n-layout has-sider>
                    <!-- 左侧菜单 -->
                    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :native-scrollbar="false" :inverted="inverted" style="max-height: 400px;">
                        <n-menu :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22" :options="roleList" @update:value="handleMenu" />
                    </n-layout-sider>
                    <n-layout-content content-style="padding: 24px">
                        <n-form :label-width="100" :model="selectRole" :rules="rules" ref="formRef" label-placement="left" v-if="haveSelsectRole">
                            <!-- 头部基础属性 -->
                            <div class="flex justify-between">
                                <div>
                                    <n-form-item label="名称" path="name">
                                        <n-input v-model:value="selectRole.name" placeholder="输入姓名" />
                                    </n-form-item>
                                    <n-form-item label="备注" path="remark">
                                        <n-input maxlength="200" show-count v-model:value="selectRole.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width:200px" />
                                    </n-form-item>
                                </div>
                                <div class="flex flex-column">
                                    <div class="flex flex-1 justify-end">
                                        <n-icon size="30" color="#ff3300" class="pointer" @click="deleteRole">
                                            <deleteIcon />
                                        </n-icon>
                                    </div>
                                    <div class="flex-1">
                                        <n-button type="info" @click="saveRole">保存角色信息</n-button>
                                    </div>
                                </div>
                            </div>
                            <n-divider />
                            <!-- 应用 -->
                            <div class="appCard">
                                <n-h2>应用</n-h2>
                                <!-- 角色应用列表 -->
                                <div class="apps">
                                    <n-tag type="info" closable size="large" v-for="(item, index) in roleApps" :key="index" @close="deleteApp(item.id)" class="mr-2">
                                        <span class="pointer" @click="changeSelectApp(item)">{{item.name}}</span>
                                    </n-tag>
                                    <n-tag type="success" size="large" class="pointer" @click="getAddAppsList">添加app</n-tag>
                                </div>
                                <n-divider />
                                <!-- 角色资源及权限 -->
                                <div v-if="haveSelectApp">
                                    <n-layout has-sider>
                                        <n-layout-sider>
                                            <!-- menu -->
                                            <n-checkbox-group :value="appMuneSelect" @update:value="handleAppMuneSelect">
                                                <n-menu :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22" :options="appMune" @update:value="handleAppPermission" />
                                            </n-checkbox-group>
                                        </n-layout-sider>
                                        <n-layout>
                                            <!-- 权限 -->
                                            <n-card v-if="appPermission.length>0">
                                                <template #header>
                                                    <div class="flex align-center">
                                                        <n-h2 style="margin-bottom: 0;margin-right:20px">{{appMuneSelectNmae}} —— 操作权限</n-h2>
                                                        <n-checkbox :checked="isAllSelect" @update:checked="handleAllSelect" label="全选" />
                                                    </div>
                                                </template>
                                                <n-space item-style="display: flex;" vertical>
                                                    <n-checkbox-group :value="rulesSelect" @update:value="handleUpdateValue">
                                                        <n-space item-style="display: flex;" align="center">
                                                            <n-checkbox v-for="(rule, index) in appPermission" :key="index" :value="rule.id" :label="rule.title" />
                                                        </n-space>
                                                    </n-checkbox-group>
                                                    <div class="mt-2">
                                                        <n-button type="info" @click="savePermission">保存应用菜单及菜单权限</n-button>
                                                    </div>
                                                </n-space>
                                            </n-card>
                                            <n-empty description="暂未选择权限，请在左侧选择权限！" v-if="appPermission.length==0&&!appMuneSelectId" class="pt-5"></n-empty>
                                            <n-empty description="该菜单暂无权限！" v-if="appPermission.length==0&&appMuneSelectId" class="pt-5">
                                                <template #extra>
                                                    <n-button type="info" @click="savePermission">仅保存菜单选项</n-button>
                                                </template>
                                            </n-empty>
                                        </n-layout>
                                    </n-layout>
                                </div>
                                <n-empty description="未选择应用，请在上方选择应用！" v-else class="pt-5"></n-empty>
                            </div>
                        </n-form>
                        <n-empty description="暂未选择角色，请在左选中角色！" v-else></n-empty>
                    </n-layout-content>
                </n-layout>
            </n-layout>
        </n-card>
        <!-- 添加角色 -->
        <n-modal v-model:show="showRegisterModal" :mask-closable="true">
            <n-card style="width: 600px;" title="添加角色" :bordered="false" size="huge">
                <n-form :label-width="80" :model="addFormValue" :rules="addRules" ref="addFormRef" label-placement="left" :style="{maxWidth: '500px'}">
                    <n-form-item label="名称" path="name">
                        <n-input placeholder="请输入名称" v-model:value="addFormValue.name" />
                    </n-form-item>
                    <!-- <n-form-item label="上级部门" path="pid">
                        <n-select placeholder="请选择上级部门" :options="departmentList" v-model:value="addFormValue.pid" />
                    </n-form-item>-->
                    <n-form-item label="备注" path="remark">
                        <n-input maxlength="200" show-count v-model:value="addFormValue.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" />
                    </n-form-item>
                    <n-form-item>
                        <div class="flex justify-center" style="width:100%">
                            <n-button type="info" @click="addSubmit" attr-type="button" class="mr-2">保存</n-button>
                            <n-button @click="showRegisterModal=false">取消</n-button>
                        </div>
                    </n-form-item>
                </n-form>
            </n-card>
        </n-modal>
        <!-- 添加app -->
        <n-modal v-model:show="showAddApp" :mask-closable="true">
            <n-card style="width: 600px;" title="添加app" :bordered="false" size="huge">
                <n-checkbox-group v-model:value="selectAddApps" @update:value="handleUpdateValue">
                    <n-divider>门户APP列表</n-divider>
                    <n-space align="center" item-style="display: flex;margin-top:10px">
                        <n-checkbox v-for="(addApp, index) in pcAppsList" :key="index" :value="addApp.id" :label="addApp.name" />
                    </n-space>
                    <n-divider>PDA APP列表</n-divider>
                    <n-space item-style="display: flex;margin-top:10px" align="center">
                        <n-checkbox v-for="(addApp, index) in pdaAppsList" :key="index" :value="addApp.id" :label="addApp.name" />
                    </n-space>
                </n-checkbox-group>
                <div class="flex justify-end mt-2">
                    <n-button @click="saveAddApps" type="info" class="mr-2">保存</n-button>
                    <n-button @click="showAddApp=false">取消</n-button>
                </div>
            </n-card>
        </n-modal>
    </div>
</template>
<script>
    import { h, defineComponent, reactive, toRefs, onMounted, ref, computed, createVNode } from 'vue'

    import { NIcon, useNotification, useDialog, NCheckbox, useMessage } from 'naive-ui'
    import { UserOutlined as userIcon, DeleteOutlined as deleteIcon, AppstoreOutlined as appIcon } from '@vicons/antd'
    import {
        getRoleAllApi,
        getDepartmentAllApi,
        postAddRoleApi,
        postUpdateRoleApi,
        deleteRoleApi,
        getRoleAppsApi,
        getAppMenuApi,
        getAppRulesApi,
        getAddAppsListApi,
        saveAddAppsApi,
        deleteAppApi,
        savePermissionApi
    } from '@/api/userManage'
    import helper from '@/utils/helper'

    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) })
    }
    function renderCheckBox(title, id) {
        return () => h('div', { class: 'flex align-center' }, [h(NCheckbox, { value: id }, ''), createVNode('div', { class: 'ml-1' }, title)])
    }
    export default defineComponent({
        name: 'jobList',
        props: {
            pageData: Object
        },
        components: {
            deleteIcon
        },
        setup(props, { emit }) {
            const formRef = ref(null)
            const addFormRef = ref(null)
            const notification = useNotification()
            const message = useMessage()
            const dialog = useDialog()
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: 'syspreferences/list', name: '偏好设置' },
                    { pageUrl: 'sys/userManage/job/list', name: '职位角色' }
                ],
                showRegisterModal: false,
                showAddApp: false,
                roleList: [],
                departmentList: [],
                addFormValue: {},
                // 选中角色
                selectRole: null,
                // 角色所有的应用
                roleApps: [],
                // 选中应用
                selectApp: {},
                // 所有应用菜单
                appMune: [],
                // 选择应用菜案
                appMuneSelect: [],
                appMuneSelectId: '',
                appMuneSelectNmae: '',
                // 对应菜单所有权限
                appPermission: [],
                // 添加应用列表
                pcAppsList: [],
                pdaAppsList: [],
                // 添加时选中的app
                selectAddApps: null,
                rulesSelect: [],
                isAllSelect: false
            })
            const haveSelsectRole = computed(() => {
                return helper.ObjectHaveKey(state.selectRole)
            })
            const haveSelectApp = computed(() => {
                return helper.ObjectHaveKey(state.selectApp)
            })
            // 获取所有角色列表
            const getRoleAll = async () => {
                await getRoleAllApi().then(res => {
                    res.data.forEach(element => {
                        element.label = element.name
                        element.key = element.id
                        element.icon = renderIcon(userIcon)
                    })
                    state.roleList = res.data
                })
            }
            // 获取所有部门
            const getDepartmentAll = async () => {
                await getDepartmentAllApi().then(res => {
                    res.data.forEach(element => {
                        element.label = element.title
                        element.value = element.id
                    })
                    state.departmentList = res.data
                })
            }
            // 获取角色应用
            const getRoleApps = async rid => {
                await getRoleAppsApi({ rid: rid }).then(res => {
                    state.roleApps = res.data
                })
            }
            onMounted(() => {
                state.roleList = []
                getDepartmentAll()
                getRoleAll()
            })
            return {
                ...toRefs(state),
                inverted: ref(false),
                addFormRef,
                formRef,
                haveSelsectRole,
                haveSelectApp,
                addRules: {
                    name: [
                        {
                            required: true,
                            message: '请输入角色名称',
                            trigger: ['input', 'blur']
                        },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['input', 'blur'] }
                    ]
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: '请输入角色名称',
                            trigger: ['input', 'blur']
                        },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['input', 'blur'] }
                    ]
                },
                // 左侧点击
                handleMenu(key, item) {
                    state.selectRole = item
                    state.selectRole.pid ? '' : (state.selectRole.pid = state.departmentList[0].pid)
                    state.selectApp = {}
                    state.appPermission = []
                    // 获取选中角色对应应用及权限
                    getRoleApps(state.selectRole.id)
                },
                // 应用点击获取菜单
                changeSelectApp(app) {
                    state.selectApp = app
                    state.appMuneSelectId = ''
                    getAppMenuApi({ aid: app.id, rid: state.selectRole.id }).then(res => {
                        let arryAppMune = []
                        state.appMuneSelect = []
                        res.data.forEach(element => {
                            let objItem = {
                                label: renderCheckBox(element.title, element.id),
                                key: element.id,
                                id: element.id,
                                name: element.title,
                                icon: renderIcon(appIcon)
                            }
                            arryAppMune.push(objItem)
                            //给菜单多选组加入选中的值
                            element.status == 1 ? state.appMuneSelect.push(element.id) : ''
                        })
                        state.appMune = arryAppMune
                    })
                },
                // 获取对应app权限
                handleAppPermission(key, item) {
                    state.appMuneSelectId = item.id
                    state.appMuneSelectNmae = item.name
                    state.rulesSelect = []
                    getAppRulesApi({ pid: item.id, aid: state.selectApp.id, rid: state.selectRole.id }).then(res => {
                        state.appPermission = res.data
                        state.appPermission.forEach(element => {
                            element.status == 1 ? state.rulesSelect.push(element.id) : ''
                        })
                        if (state.appPermission.length == state.rulesSelect.length) {
                            state.isAllSelect = true
                        }
                    })
                },
                // 权限全选
                handleAllSelect(checked) {
                    state.isAllSelect = checked
                    if (!checked) {
                        state.rulesSelect = []
                    } else {
                        state.rulesSelect = []
                        state.appPermission.forEach(element => {
                            state.rulesSelect.push(element.id)
                        })
                    }
                },
                // 权限多选
                handleUpdateValue(value) {
                    if (state.appPermission.length == value.length) {
                        state.isAllSelect = true
                    } else {
                        state.isAllSelect = false
                    }
                    state.rulesSelect = value
                },
                // 菜单多选
                handleAppMuneSelect(value) {
                    if (value.length == 0) {
                        message.warning('当前应用最少有一个菜单！')
                    } else {
                        state.appMuneSelect = value
                    }
                },
                // 添加时获取添加app列表
                getAddAppsList() {
                    getAddAppsListApi({ rid: state.selectRole.id }).then(res => {
                        if (res.code == 0) {
                            if (res.data.length > 0) {
                                state.showAddApp = true

                                state.pcAppsList = res.data.filter(element => {
                                    return element.platform == 2
                                })
                                state.pdaAppsList = res.data.filter(element => {
                                    return element.platform == 1
                                })
                            } else {
                                message.warning('您已添加所有应用')
                            }
                        }
                    })
                },
                // 保存添加的app
                saveAddApps() {
                    saveAddAppsApi({ rid: state.selectRole.id, aids: state.selectAddApps.toString() }).then(res => {
                        if (res.code == 0) {
                            state.showAddApp = false
                            state.selectAddApps = null
                            getRoleApps(state.selectRole.id)
                        }
                    })
                },
                // 删除用户单个app
                deleteApp(aid) {
                    dialog.warning({
                        title: '警告',
                        content: '确认删除该app吗？',
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                            deleteAppApi({ rid: state.selectRole.id, aid: aid }).then(res => {
                                if (res.code == 0) {
                                    state.selectAddApps = null
                                    state.selectApp = {}

                                    getRoleApps(state.selectRole.id)
                                }
                            })
                        }
                    })
                },
                // 保存角色
                saveRole() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            dialog.warning({
                                title: '警告',
                                content: '确认保存该角色的基础信息吗？',
                                positiveText: '确定',
                                negativeText: '取消',
                                onPositiveClick: () => {
                                    // 组织参数
                                    helper.Debounce(() => {
                                        postUpdateRoleApi(state.selectRole).then(res => {
                                            if (res.code == 0) {
                                                getRoleAll()
                                                notification['success']({
                                                    content: '修改角色信息成功！',
                                                    duration: 5000
                                                })
                                            }
                                        })
                                    }, 1000)
                                }
                            })
                        } else {
                            console.log(errors)
                            // message.error('Invalid')
                        }
                    })
                },
                // 添加角色
                addSubmit() {
                    addFormRef.value.validate(errors => {
                        if (!errors) {
                            // message.success('Valid')
                            helper.Debounce(() => {
                                postAddRoleApi(state.addFormValue).then(res => {
                                    if (res.code == 0) {
                                        state.showRegisterModal = false
                                        getRoleAll()
                                        state.addFormValue = {}
                                        notification['success']({
                                            content: '添加角色成功',
                                            duration: 5000
                                        })
                                    }
                                })
                            }, 1000)
                        } else {
                            console.log(errors)
                        }
                    })
                },
                // 保存权限
                savePermission() {
                    let fromData = state.selectRole
                    fromData.app = []
                    fromData.app.push(state.selectApp)
                    // 设置菜单
                    // 清空选中菜单
                    state.appMune.forEach(element => {
                        element.status = 0
                        delete element.operation
                    })
                    // 设置选中菜单
                    state.appMuneSelect.forEach(selectElement => {
                        state.appMune.forEach(menuElement => {
                            selectElement == menuElement.id ? (menuElement.status = 1) : ''
                        })
                    })
                    fromData.app[0].menu = state.appMune
                    // 更改对应menu下的权限
                    let menuIndex = fromData.app[0].menu.findIndex(item => {
                        return item.id == state.appMuneSelectId
                    })
                    if (fromData.app[0].menu[menuIndex].status == 1) {
                        fromData.app[0].menu[menuIndex].operation = []
                        // 清空选中权限
                        state.appPermission.forEach(element => {
                            element.status = 0
                        })
                        // 设置选中权限
                        state.rulesSelect.forEach(selectElement => {
                            state.appPermission.forEach(menuElement => {
                                selectElement == menuElement.id ? (menuElement.status = 1) : ''
                            })
                        })
                        fromData.app[0].menu[menuIndex].operation = state.appPermission
                    }
                    dialog.warning({
                        title: '警告',
                        content: '确认修改该角色对应的菜单及权限吗？',
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                            let arryRole = { role: [] }
                            arryRole.role.push(fromData)
                            savePermissionApi(arryRole).then(res => {
                                if (res.code == 0) {
                                    if (fromData.app[0].menu[menuIndex].status != 1) {
                                        state.appPermission = []
                                    }
                                    notification['success']({
                                        content: '修改角色对应菜单及权限成功',
                                        duration: 5000
                                    })
                                }
                            })
                        }
                    })
                },
                // 删除角色
                deleteRole() {
                    dialog.warning({
                        title: '警告',
                        content: '确认删除该角色吗？',
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                            const params = {
                                id: state.selectRole.id,
                                available: '0'
                            }
                            deleteRoleApi(params).then(res => {
                                if (res.code == 0) {
                                    getRoleAll()
                                    state.selectRole = null
                                    notification['success']({
                                        content: '删除角色成功',
                                        duration: 5000
                                    })
                                }
                            })
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
<style lang="less">
    .appCard {
        .apps {
            display: flex;
            white-space: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            width: 100%;
            padding: 10px 0;
            .app {
                padding: 10px 20px;
                margin-right: 20px;
                border: 1px solid #e3e8ee;
                background: #f5f7f9;
                cursor: pointer;

                &:hover {
                    border: 1px solid #5cadff;
                    background: #5cadff;
                    color: white;
                }
            }
        }
    }
</style>