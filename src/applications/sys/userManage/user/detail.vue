<template >
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in pageData.breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <n-card :bordered="false">
            <n-tabs type="line">
                <n-tab-pane name="详细信息" tab="详细信息">
                    <!-- 详细信息 -->
                    <n-space vertical :size="30" v-if="pageType=='info'">
                        <n-grid x-gap="30" :cols="3">
                            <n-gi>
                                <n-space vertical :size="20">
                                    <div>
                                        <div class="font-weight-bolder mb-2">用户姓名:</div>
                                        <span class="text-muted">{{userInfo.name}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">入职日期:</div>
                                        <span class="text-muted">
                                            <n-time :time="userInfo.hiredate" format="yyyy-MM-dd hh:mm:ss" v-if="userInfo.hiredate" />
                                            <span v-else>暂无</span>
                                        </span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">角色:</div>
                                        <span class="text-muted">{{roleStr ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">用户备注:</div>
                                        <span class="text-muted breakAll">{{userInfo.remark ||'暂无'}}</span>
                                    </div>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical :size="20">
                                    <div>
                                        <div class="font-weight-bolder mb-2">性别:</div>
                                        <span class="text-muted">{{userInfo.sex == 0 ? '男' : '女'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">登录用户名:</div>
                                        <span class="text-muted">{{userInfo.loginname ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">租户ID:</div>
                                        <span class="text-muted">{{userInfo.tid ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">是否可用:</div>
                                        <div>
                                            <n-tag type="success" v-if="userInfo.available">可用</n-tag>
                                            <n-tag type="error" v-if="!userInfo.available">不可用</n-tag>
                                        </div>
                                    </div>
                                </n-space>
                            </n-gi>
                            <n-gi>
                                <n-space vertical :size="20">
                                    <div>
                                        <div class="font-weight-bolder mb-2">用户地址:</div>
                                        <span class="text-muted breakAll">{{userInfo.address ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">部门:</div>
                                        <span class="text-muted">{{departmentStr ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">用户类型:</div>
                                        <span class="text-muted">{{userTypeStr ||'暂无'}}</span>
                                    </div>
                                    <div>
                                        <div class="font-weight-bolder mb-2">用户头像:</div>
                                        <n-avatar round :size="100" :src="userInfo.imgpath" :fallback-src="defaultUserAvatar" />
                                    </div>
                                </n-space>
                            </n-gi>
                        </n-grid>
                        <n-space style="justify-content: center;">
                            <n-button type="info" @click="updateInit">编辑</n-button>
                            <n-button v-if="userInfo.available==1" type="warning" @click="handleConfirm">注销账户</n-button>
                            <n-button v-if="userInfo.available==0" type="success" @click="handleConfirm">启用账户</n-button>
                        </n-space>
                    </n-space>
                    <!-- 编辑 -->
                    <div v-else class="mt-2">
                        <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef" label-placement="left" :style="{maxWidth: '60%'}">
                            <n-form-item label="用户姓名" path="name">
                                <n-input v-model:value="formValue.name" placeholder="输入姓名" />
                            </n-form-item>
                            <n-form-item label="登录名称" path="loginname">
                                <n-input placeholder="请输入登录名称" v-model:value="formValue.loginname" />
                            </n-form-item>
                            <n-form-item label="登录密码" path="loginpwd">
                                <n-input placeholder="请输入登录密码（此处不显示原密码）" v-model:value="formValue.loginpwd" />
                            </n-form-item>
                            <n-form-item label="地址" path="address">
                                <n-input placeholder="输入地址" v-model:value="formValue.address" maxlength="200" show-count />
                            </n-form-item>
                            <n-form-item label="性别" path="sex">
                                <n-radio-group v-model:value="formValue.sex" name="radiogroup1">
                                    <n-space>
                                        <n-radio value="0">男</n-radio>
                                        <n-radio value="1">女</n-radio>
                                    </n-space>
                                </n-radio-group>
                            </n-form-item>
                            <n-form-item label="入职时间" path="sex">
                                <n-date-picker v-model:value="formValue.hiredate" type="date" :is-date-disabled="disablePreviousDate" actions="['now']" @focus="(e) => {e.target.blur()}" />
                            </n-form-item>
                            <n-form-item label="头像">
                                <n-upload
                                    :action="uploadUrl"
                                    :headers="uploadHeaders"
                                    :show-file-list="false"
                                    @change="uploadChange"
                                    @before-upload="beforeUpload"
                                    style="width:100%"
                                    accept="image/png, image/jpeg"
                                >
                                    <n-upload-dragger>
                                        <div v-if="!formValue.imgpath">
                                            <div style="margin-bottom: 12px;">
                                                <n-icon size="48" :depth="3">
                                                    <Add20Regular />
                                                </n-icon>
                                            </div>
                                            <n-text>点击或者拖动文件到该区域来上传</n-text>
                                        </div>
                                        <div v-else>
                                            <div>
                                                <n-avatar circle :size="100" :src="formValue.imgpath" :fallback-src="defaultUserAvatar" />
                                            </div>
                                            <n-text>再次点击更改头像</n-text>
                                        </div>
                                    </n-upload-dragger>
                                </n-upload>
                            </n-form-item>
                            <n-form-item label="备注" path="remark">
                                <n-input maxlength="200" show-count type="textarea" placeholder="输入备注" v-model:value="formValue.remark" />
                            </n-form-item>
                            <n-form-item label="栋舍配置">
                                <n-space vertical :size="20">
                                    <n-card v-for="(item,key) in dormAll" :key="item">
                                        <n-space style="margin-bottom:10px" v-if="item.length>0">
                                            <n-checkbox :checked="allState(key)" @mouseenter="allKey=key;" @update:checked="handleCheckedChange">{{key}}</n-checkbox>
                                        </n-space>

                                        <n-checkbox-group :value="formValue.dormCodeList" @update:value="handleUpdateValue" v-if="item.length>0">
                                            <n-grid :y-gap="8" :cols="4">
                                                <n-gi v-for="(dorm,key) in item" :key="key">
                                                    <n-checkbox :value="dorm.dormCode" :label="dorm.dormName" />
                                                </n-gi>
                                            </n-grid>
                                        </n-checkbox-group>
                                    </n-card>
                                </n-space>
                            </n-form-item>
                            <n-form-item label="部门配置">
                                <n-transfer ref="transfer" v-model:value="formValue.deptid" :options="departmentAll" />
                            </n-form-item>
                            <n-form-item label="角色配置">
                                <n-transfer ref="transfer" v-model:value="formValue.rids" :options="roleAll" />
                            </n-form-item>
                            <n-form-item>
                                <n-space justify="center">
                                    <n-button type="info" @click="handleValidateClick" attr-type="button">保存</n-button>
                                    <n-button @click="pageType='info'">取消</n-button>
                                </n-space>
                            </n-form-item>
                        </n-form>
                    </div>
                </n-tab-pane>
            </n-tabs>

            <!-- <n-tab-pane name="日志" tab="日志">日志</n-tab-pane> -->
        </n-card>
    </n-space>
</template>

<script>
    import storage from "store"
    import { useMessage, useDialog, useNotification } from "naive-ui"
    import { defineComponent, ref, reactive, toRefs, onMounted, computed } from "vue"
    import {
        getUserDetailApi,
        getDepartmentAllApi,
        updateUserApi,
        updateUserAvaliableApi,
        getRoleAllApi,
        getDormAllApi,
    } from "@/api/userManage.js"
    import helper from "@/utils/helper.js"
    export default defineComponent({
        props: {
            pageData: Object,
        },
        setup(props) {
            const message = useMessage()
            const dialog = useDialog()
            const notification = useNotification()
            const state = reactive({
                defaultUserAvatar: "https://cdn.bestgenetics.com.cn/common/img/people.png",
                pageType: "info",
                userInfo: {},
                departmentAll: [],
                roleAll: [],
                formValue: {
                    dormCodeList: [],
                },
                dormAll: {},
                uploadUrl:
                    process.env.VUE_APP_API_BASE_URL + "/ms-tenant-consummer/user/{version}/uploadFile",
                uploadHeaders: {
                    Authorization: "Bearer " + storage.get("access_token"),
                },
                // 全选时的key
                allKey: "",
            })
            const formRef = ref(null)
            const getUserDetail = async obj => {
                await getUserDetailApi(obj).then(res => {
                    // 性别转字符串
                    res.data.sex = res.data.sex.toString()
                    // 时间序列化
                    res.data.hiredate ? (res.data.hiredate = new Date(res.data.hiredate).getTime()) : ""
                    // 部门字符串转数组
                    res.data.deptid
                        ? (res.data.deptid = res.data.deptid.split(","))
                        : (res.data.deptid = [])
                    // 角色字符串转数组
                    res.data.rids ? (res.data.rids = res.data.rids.split(",")) : (res.data.rids = [])

                    res.data.dormCodeList ? res.data.dormCodeList : (res.data.dormCodeList = [])

                    state.userInfo = res.data
                    state.formValue = res.data
                })
            }
            // 获取所有部门
            const getDepartmentAll = async () => {
                await getDepartmentAllApi().then(res => {
                    res.data.forEach(element => {
                        element.label = element.title
                        element.value = element.id
                        element.available == 1 ? (element.disabled = false) : (element.disabled = true)
                    })
                    state.departmentAll = res.data
                })
            }
            // 获取所有角色
            const getRoleAll = async () => {
                await getRoleAllApi().then(res => {
                    res.data.forEach(element => {
                        element.label = element.name
                        element.value = element.id
                        element.available == 1 ? (element.disabled = false) : (element.disabled = true)
                    })
                    state.roleAll = res.data
                })
            }
            // 获取所有栋舍
            const getDormAll = async () => {
                await getDormAllApi().then(res => {
                    state.dormAll = res.data
                    for (const key in state.dormAll) {
                        if (Object.hasOwnProperty.call(state.dormAll, key)) {
                            const element = state.dormAll[key]
                            if (element.length == 0) {
                                delete state.dormAll[key]
                            }
                        }
                    }
                })
            }

            const userTypeStr = computed(() => {
                // 0 超级管理员 1管理员 2用户
                let typeStr = ""
                if (state.userInfo.type == 0) {
                    typeStr = "超级管理员"
                }
                if (state.userInfo.type == 1) {
                    typeStr = "管理员"
                }
                if (state.userInfo.type == 2) {
                    typeStr = "普通用户"
                }
                return typeStr
            })
            const allState = computed(() => {
                return function (key) {
                    let falg = true
                    state.dormAll[key].forEach(element => {
                        if (!state.formValue.dormCodeList.includes(element.dormCode)) falg = false
                    })
                    return falg
                }
            })

            const departmentStr = computed(() => {
                let depStr = ""
                if (state.departmentAll.length > 0 && JSON.stringify(state.userInfo) != "{}") {
                    let depArry = state.departmentAll.filter(item =>
                        state.userInfo.deptid.some(x => x == item.id)
                    )
                    depArry.forEach(element => {
                        depStr = depStr + element.title + " "
                    })
                }
                return depStr
            })

            const roleStr = computed(() => {
                let rStr = ""
                if (state.roleAll.length > 0 && JSON.stringify(state.userInfo) != "{}") {
                    let rArry = state.roleAll.filter(item =>
                        state.userInfo.rids.some(x => x == item.id)
                    )
                    rArry.forEach(element => {
                        rStr = rStr + element.name + " "
                    })
                }
                return rStr
            })
            onMounted(() => {
                getDepartmentAll()
                getRoleAll()
                getDormAll()
                getUserDetail({ id: props.pageData.id })
            })
            return {
                ...toRefs(state),
                //修改时数据
                formRef,
                departmentStr,
                userTypeStr,
                roleStr,
                allState,
                rules: {
                    name: [
                        {
                            required: true,
                            message: "请输入姓名",
                            trigger: ["input", "blur"],
                        },
                        {
                            min: 2,
                            max: 20,
                            message: "长度在 2 到 20 个字符",
                            trigger: ["input", "blur"],
                        },
                    ],
                    loginname: [
                        {
                            required: true,
                            message: "请输入登录名称(仅支持数字、字母、下划线、横杠、点号)",
                            trigger: ["input", "blur"],
                            pattern: /^[0-9a-zA-Z_.-]{1,}$/,
                        },
                        {
                            min: 2,
                            max: 20,
                            message: "长度在 2 到 20 个字符",
                            trigger: ["input", "blur"],
                        },
                    ],

                    loginpwd: [
                        {
                            message: "请输入登录密码(必须包含数字、英文字母、特殊符号-_.*)",
                            trigger: ["input", "blur"],
                            pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[-_.*])[a-z\d-_.*]{6,20}$/,
                        },
                        {
                            min: 6,
                            max: 20,
                            message: "长度在 6 到 20 个字符",
                            trigger: ["input", "blur"],
                        },
                    ],
                },
                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index != 2) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl,
                        }
                        this.$emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                },
                // 注销&启用 用户
                handleConfirm() {
                    dialog.warning({
                        title: "警告",
                        content:
                            state.userInfo.available != 0
                                ? "你确定注销该用户吗？"
                                : "你确定启用该用户吗？",
                        positiveText: "确定",
                        negativeText: "不确定",
                        onPositiveClick: () => {
                            state.userInfo.available == 0
                                ? (state.userInfo.available = 1)
                                : (state.userInfo.available = 0)
                            let formData = {
                                id: state.userInfo.id,
                                available: state.userInfo.available,
                            }
                            helper.Debounce(() => {
                                updateUserAvaliableApi(formData).then(res => {
                                    if (res.code == 0) {
                                        notification["success"]({
                                            content:
                                                state.userInfo.available == 0
                                                    ? "用户注销成功"
                                                    : "用户启用成功",
                                            meta: "请到【用户详情页】查看用户属性！",
                                            duration: 5000,
                                        })
                                        state.pageType = "info"
                                        getUserDetail({ id: props.pageData.id })
                                    }
                                })
                            }, 1000)
                        },
                    })
                },
                updateInit() {
                    state.pageType = "update"
                    // getUserDetail({ id: props.pageData.id })
                },
                handleCheckedChange(checked) {
                    let key = state.allKey
                    let list = state.dormAll[key].map(x => {
                        return x.dormCode
                    })
                    if (checked) {
                        state.formValue.dormCodeList = [...state.formValue.dormCodeList, ...list]
                    } else {
                        state.formValue.dormCodeList = state.formValue.dormCodeList.filter(
                            item =>
                                !list.some(x => {
                                    return x == item
                                })
                        )
                    }
                },

                handleUpdateValue(value) {
                    state.formValue.dormCodeList = value
                },
                async beforeUpload(data) {
                    if (data.file.file?.size >= 5242880) {
                        message.error("文件过大！请上传小于5MB的PNG或JPG文件！")
                        return false
                    }
                    return true
                },
                uploadChange({ event }) {
                    let responseDate = ""
                    event.target.response != undefined ? (responseDate = event.target.response) : ""
                    responseDate ? (responseDate = JSON.parse(responseDate)) : ""
                    responseDate ? (state.formValue.imgpath = responseDate.data[0]) : ""
                },
                // 表单提交
                handleValidateClick() {
                    dialog.warning({
                        title: "警告",
                        content: "你确定保存用户信息吗？",
                        positiveText: "确定",
                        negativeText: "不确定",
                        onPositiveClick: () => {
                            formRef.value.validate(errors => {
                                if (!errors) {
                                    let { ...formdata } = state.userInfo
                                    formdata.deptid.length > 0
                                        ? (formdata.deptid = formdata.deptid.toString())
                                        : (formdata.deptid = "")
                                    formdata.rids.length > 0
                                        ? (formdata.roles = formdata.rids.toString())
                                        : (formdata.rids = "")
                                    helper.Debounce(() => {
                                        updateUserApi(formdata).then(res => {
                                            if (res.code == 0) {
                                                notification["success"]({
                                                    content: "用户修改成功",
                                                    meta: "请到【用户详情页】查看用户属性！",
                                                    duration: 5000,
                                                })
                                                state.pageType = "info"
                                                getUserDetail({ id: props.pageData.id })
                                            }
                                        })
                                    }, 1000)
                                } else {
                                    message.error("您有暂未填写或填写错误的选项，请修改数据重新提交！")
                                }
                            })
                        },
                    })
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
            }
        },
    })
</script>
<style lang="">
</style>