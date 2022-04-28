<template>
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <div>
            <n-card style="margin-bottom: 16px;">
                <n-space vertical :size="20">
                    <n-space>
                        <n-button type="info" @click="showRegisterModal=true">添加用户</n-button>
                        <n-input placeholder="搜索" v-model:value="search.nameLike" clearable @keyup.enter="enterSearch()" @clear="clearUserList">
                            <template #suffix>
                                <n-icon>
                                    <Search24Filled />
                                </n-icon>
                            </template>
                        </n-input>
                    </n-space>
                    <n-list bordered>
                        <n-list-item v-for="(item, index) in userlist.list" :key="index" class="mt-2">
                            <template #prefix>
                                <n-image width="100" :src="item.imgpath" :fallback-src="defaultUserAvatar" />
                            </template>
                            <template #suffix>
                                <n-button type="info" @click="goUserDetail(item.id)">详情 / 操作</n-button>
                            </template>
                            <n-thing :title="item.name" :title-extra="'账号状态：'+(item.available?'激活':'未激活')">
                                <div class="flex">
                                    <div class="text-muted">部门/分组：{{item.deptnames || '暂无'}}</div>
                                </div>
                                <div class="flex">
                                    <div class="text-muted">岗位/角色：{{item.rnames || '暂无是'}}</div>
                                </div>
                            </n-thing>
                        </n-list-item>
                        <n-empty description="暂无数据" v-if="userlist.list.length==0" class="mt-4 mb-4"></n-empty>
                    </n-list>
                    <n-space justify="space-between" align="center" v-if="userlist.total>10">
                        <n-text class="pl-1">{{$t('dataTable.listing.footerPrefix')}}{{userlist.list.length}} {{$t('dataTable.listing.footerSuffix')}}</n-text>&nbsp;
                        <n-pagination
                            v-model:page="search.page"
                            v-model:pageSize="search.limit"
                            :page-count="userlist.total"
                            show-size-picker
                            :page-sizes="[10, 20, 30, 40]"
                            show-quick-jumper
                            @update:page="getUsersList()"
                            @update:pageSize="getUsersList()"
                        >
                            <template #prefix="{ itemCount }">{{$t('dataTable.listing.altogether')}} {{ itemCount }} {{$t('dataTable.listing.footerSuffix')}}</template>
                        </n-pagination>
                    </n-space>
                </n-space>

                <!-- 注册 -->
                <n-modal v-model:show="showRegisterModal" :mask-closable="false">
                    <n-card style="width: 600px;" title="添加用户" :bordered="false" size="huge">
                        <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef" label-placement="left" :style="{maxWidth: '500px'}">
                            <n-form-item label="姓名" path="name">
                                <n-input v-model:value="formValue.name" placeholder="输入姓名" />
                            </n-form-item>
                            <n-form-item label="登录名称" path="loginname">
                                <n-input placeholder="请输入登录名称" v-model:value="formValue.loginname" />
                            </n-form-item>
                            <n-form-item label="登录密码" path="loginpwd">
                                <n-input placeholder="请输入登录密码" v-model:value="formValue.loginpwd" />
                            </n-form-item>
                            <n-form-item label="性别" path="sex">
                                <n-radio-group v-model:value="formValue.sex" name="radiogroup1">
                                    <n-space>
                                        <n-radio value="0">男</n-radio>
                                        <n-radio value="1">女</n-radio>
                                    </n-space>
                                </n-radio-group>
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
                                                <n-avatar circle :size="100" :src="formValue.imgpath" />
                                            </div>
                                            <n-text>再次点击更改头像</n-text>
                                        </div>
                                    </n-upload-dragger>
                                </n-upload>
                            </n-form-item>
                            <n-form-item>
                                <n-space justify="center">
                                    <n-button type="info" @click="handleValidateClick" attr-type="button" class="mr-2">保存并设置</n-button>
                                    <n-button @click="closeRegisterModal" attr-type="reset">取消</n-button>
                                </n-space>
                            </n-form-item>
                        </n-form>
                    </n-card>
                </n-modal>
            </n-card>
        </div>
    </n-space>
</template>
<script>
    import { useNotification } from "naive-ui"
    import { Search24Filled, Add20Regular } from "@vicons/fluent"
    import storage from "store"
    import { defineComponent, ref, reactive, toRefs, onMounted } from "vue"
    import { getUserManageListApi, userRegisterApi } from "@/api/userManage.js"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "user",
        props: {
            pageData: Object,
        },
        components: {
            Search24Filled,
            Add20Regular,
        },
        setup(props, { emit }) {
            const notification = useNotification()
            const valueRef = ref("user")
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: "syspreferences/list", name: "偏好设置" },
                    { pageUrl: "sys/userManage/user/list", name: "账号" },
                ],
                defaultUserAvatar: "https://cdn.bestgenetics.com.cn/common/img/people.png",
                userlist: {
                    list: [],
                },
                departmentList: {
                    list: [],
                },
                uploadUrl:
                    process.env.VUE_APP_API_BASE_URL + "/ms-tenant-consummer/user/{version}/uploadFile",
                uploadHeaders: {
                    Authorization: "Bearer " + storage.get("access_token"),
                },
                search: {
                    type: "2",
                    page: 1,
                    limit: 10,
                    nameLike: "",
                },
                formValue: {
                    sex: "0",
                },
                showRegisterModal: false,
            })
            const formRef = ref(null)
            const getUsersList = async () => {
                await getUserManageListApi(state.search).then(res => {
                    state.userlist = res.data
                })
            }
            const postUserRegisterApi = async () => {
                await userRegisterApi(state.formValue).then(res => {
                    if (res.code == 0) {
                        state.search.page = 1
                        state.search.limit = 10
                        state.search.nameLike = ""
                        state.showRegisterModal = false
                        state.formValue = {
                            sex: "0",
                        }
                        getUsersList()
                        notification["success"]({
                            content: "用户添加成功",
                            meta: "请到【用户详情页】设置用户属性！",
                            duration: 5000,
                        })
                    }
                })
            }
            onMounted(() => {
                getUsersList()
            })
            return {
                ...toRefs(state),
                value: valueRef,
                tabsAction: "",
                // 表单
                formRef,
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
                            required: true,
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
                getUsersList,
                // 去往详情
                goUserDetail(id) {
                    const data = {
                        id: id,
                        name: "账号列表",
                        pageUrl: "sys/userManage/user/list",
                        grandchildrenName: "用户详情",
                        grandchildrenPage: "sys/userManage/user/detail",
                    }
                    this.$emit("gopage", data)
                },
                // 搜索清空
                clearQuery() {
                    state.search.type = 0
                    state.search.page = 1
                    state.search.nameLike = ""
                },
                // 模糊查询
                enterSearch() {
                    state.search.page = 1
                    getUsersList()
                },
                // 查询清空
                clearUserList() {
                    state.search.page = 1
                    state.search.nameLike = ""
                    getUsersList()
                },
                closeRegisterModal() {
                    state.showRegisterModal = false
                    state.formValue = {
                        sex: "0",
                    }
                    formRef.value.restoreValidation()
                },
                // 表单提交 注册
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            helper.Debounce(() => {
                                postUserRegisterApi()
                            }, 1000)
                        } else {
                            console.log(errors)
                            // message.error('Invalid')
                        }
                    })
                },
                async beforeUpload(data) {
                    if (data.file.file?.size >= 5242880) {
                        window.$message.error("文件过大！请上传小于5MB的PNG或JPG文件！")
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
<style>
</style>