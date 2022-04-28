<template>
    <div class="p-2">
        <div class="flex justify-between">
            <n-card hoverable class="flex-1 mr-2">
                <n-space vertical>
                    <div class="flex justify-center flex-column align-center">
                        <n-avatar
                            :src="userInfo.imgpath"
                            round
                            :size="104"
                            :fallback-src="defaultUserAvatar"
                        ></n-avatar>
                        <n-h1 class="mt-2 mb-1">{{ userInfo.loginname }}</n-h1>
                        <n-p class="mt-0">{{
                            userInfo.remark || $t("dtables.listing.noProfiles")
                        }}</n-p>
                    </div>
                    <n-space vertical>
                        <div class="flex align-center">
                            <n-icon size="20" class="mr-1">
                                <DepartmentIcon />
                            </n-icon>
                            {{ $t("dtables.listing.belongsToTheTenant") }}：{{
                                userInfo.tenantName || $t("dataTable.listing.notYet")
                            }}
                        </div>
                        <div class="flex align-center">
                            <n-icon size="20" class="mr-1">
                                <DepartmentIcon />
                            </n-icon>
                            {{ $t("dtables.listing.department") }}：{{
                                getDepartmentName || $t("dataTable.listing.notYet")
                            }}
                        </div>
                        <div class="flex align-center">
                            <n-icon size="20" class="mr-1">
                                <AddressIcon />
                            </n-icon>
                            {{ $t("dtables.listing.address") }}：{{
                                userInfo.address || $t("dataTable.listing.notYet")
                            }}
                        </div>
                    </n-space>
                </n-space>
                <n-divider />
                <!-- 栋舍权限 -->
                <div class="mt-1">
                    <n-h4 class="mt-2 mb-1">{{ $t("dtables.listing.buildingUpPermissions") }}</n-h4>
                    <n-space>
                        <n-tag
                            type="success"
                            round
                            v-for="item in userInfo.dormCodeList"
                            :key="item"
                            >{{ item }}</n-tag
                        >
                    </n-space>
                </div>
            </n-card>
            <n-card class="flex-3">
                <n-tabs type="line" @update:value="tabChange">
                    <n-tab-pane name="应用" :tab="$t('dtables.listing.application')">
                        <div class="appCardBox">
                            <n-card hoverable v-for="(app, index) in userApp" :key="index">
                                <n-thing>
                                    <template #header>
                                        <i class="icon" :class="app.icon"></i>
                                        {{ app.name }}
                                    </template>
                                    {{ app.description }}
                                </n-thing>
                            </n-card>
                        </div>
                        <n-empty class="mt-5" description="暂无应用" v-if="userApp == ''"></n-empty>
                    </n-tab-pane>
                    <!-- 部门 -->
                    <n-tab-pane
                        name="部门"
                        :tab="$t('dtables.listing.department')"
                        v-if="userInfo.type == 2"
                    >
                        <n-h3>您所属的部门：</n-h3>
                        <n-space>
                            <n-button
                                strong
                                secondary
                                type="success"
                                v-for="item in userDepartmentNameList"
                                :key="item"
                                >{{ item }}</n-button
                            >
                        </n-space>
                    </n-tab-pane>
                    <!-- 个人信息修改 -->
                    <n-tab-pane
                        name="个人信息修改"
                        :tab="$t('dtables.listing.personalInformationChanges')"
                        v-if="userInfo.type == 2"
                    >
                        <n-form
                            :label-width="auto"
                            :model="formValue"
                            :rules="rules"
                            ref="formRef"
                            label-placement="left"
                            :style="{ maxWidth: '500px' }"
                        >
                            <n-form-item :label="$t('dtables.listing.theUserName')" path="name">
                                <n-input
                                    v-model:value="formValue.name"
                                    :placeholder="$t('dtables.listing.enterTheName')"
                                />
                            </n-form-item>
                            <n-form-item
                                :label="$t('dtables.listing.theLoginName')"
                                path="loginname"
                            >
                                <n-input
                                    :placeholder="$t('dtables.listing.pleaseEnterTheLoginName')"
                                    v-model:value="formValue.loginname"
                                />
                            </n-form-item>
                            <n-form-item
                                :label="$t('dtables.listing.changeThePassword')"
                                path="loginpwd"
                            >
                                <n-input
                                    :placeholder="
                                        $t(
                                            'dtables.listing.pleaseEnterThePassword (mustContainNumbers,Letters,SpecialSymbols)'
                                        )
                                    "
                                    v-model:value="formValue.loginpwd"
                                />
                            </n-form-item>
                            <n-form-item :label="$t('dtables.listing.address')" path="address">
                                <n-input
                                    :placeholder="$t('dtables.listing.enterTheAddress')"
                                    v-model:value="formValue.address"
                                />
                            </n-form-item>
                            <n-form-item :label="$t('dataTable.listing.gender')" path="sex">
                                <n-radio-group v-model:value="formValue.sex" name="radiogroup1">
                                    <n-space>
                                        <n-radio value="0">{{
                                            $t("dtables.listing.male")
                                        }}</n-radio>
                                        <n-radio value="1">{{
                                            $t("dtables.listing.female")
                                        }}</n-radio>
                                    </n-space>
                                </n-radio-group>
                            </n-form-item>
                            <n-form-item :label="$t('dtables.listing.inTheTime')" path="sex">
                                <n-date-picker
                                    v-model:value="formValue.hiredate"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                />
                            </n-form-item>
                            <n-form-item :label="$t('dtables.listing.headPortrait')">
                                <n-upload
                                    :action="uploadUrl"
                                    :headers="uploadHeaders"
                                    :show-file-list="false"
                                    @change="uploadChange"
                                    @before-upload="beforeUpload"
                                    style="width: 100%"
                                    accept="image/png, image/jpeg"
                                >
                                    <n-upload-dragger>
                                        <div v-if="!formValue.imgpath">
                                            <div style="margin-bottom: 12px">
                                                <n-icon size="48" :depth="3">
                                                    <Add20Regular />
                                                </n-icon>
                                            </div>
                                            <n-text>点击或者拖动文件到该区域来上传</n-text>
                                        </div>
                                        <div v-else>
                                            <div>
                                                <n-avatar
                                                    circle
                                                    :size="100"
                                                    :src="formValue.imgpath"
                                                    :fallback-src="defaultUserAvatar"
                                                />
                                            </div>
                                            <n-text>{{
                                                $t("dtables.listing.clickAgainOnTheIconToChange")
                                            }}</n-text>
                                        </div>
                                    </n-upload-dragger>
                                </n-upload>
                            </n-form-item>
                            <n-form-item :label="$t('dataTable.listing.remark')" path="remark">
                                <n-input
                                    maxlength="200"
                                    show-count
                                    type="textarea"
                                    v-model:value="formValue.remark"
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                />
                            </n-form-item>
                            <n-form-item>
                                <n-space>
                                    <n-button
                                        type="info"
                                        @click="handleValidateClick"
                                        attr-type="button"
                                        >{{ $t("dtables.listing.save") }}</n-button
                                    >
                                </n-space>
                            </n-form-item>
                        </n-form>
                    </n-tab-pane>

                    <n-tab-pane
                        name="消息中心"
                        :tab="$t('dtables.listing.messageCenter')"
                        v-if="userInfo.type == 2"
                    >
                        <n-layout has-sider>
                            <n-layout-sider bordered content-style="padding: 0px;">
                                <n-menu
                                    v-model:value="menuVal"
                                    :options="messageMenu"
                                    @update:value="menuChange"
                                />
                            </n-layout-sider>
                            <n-layout content-style="padding: 24px;">
                                <n-scrollbar style="max-height: 1000px">
                                    <n-space
                                        vertical
                                        :size="30"
                                        style="mt-1 mb-1"
                                        class="messageModule"
                                    >
                                        <n-card v-for="item in messagesList" :key="item">
                                            <n-thing>
                                                <template #avatar>
                                                    <n-icon-wrapper
                                                        :size="24"
                                                        :border-radius="50"
                                                        color="#4251bb"
                                                        v-if="item.readStatus == '2'"
                                                    >
                                                        <n-icon size="20" color="#f9fafd">
                                                            <HourglassIcon />
                                                        </n-icon>
                                                    </n-icon-wrapper>
                                                    <n-icon-wrapper
                                                        :size="24"
                                                        :border-radius="50"
                                                        color="#4251bb"
                                                        v-if="item.readStatus == '1'"
                                                    >
                                                        <n-icon size="20" color="#f9fafd">
                                                            <UnreadMessagesIcon />
                                                        </n-icon>
                                                    </n-icon-wrapper>
                                                </template>
                                                <template #header>
                                                    {{ item.notificationtitle }}
                                                </template>
                                                <template #description>
                                                    <n-text>{{ item.msgtitle }}</n-text>
                                                </template>
                                                {{ item.msgcontent }}
                                                <template #footer>
                                                    <!-- 未读 -->
                                                    <n-grid
                                                        x-gap="12"
                                                        :cols="2"
                                                        style="background: #fafafa"
                                                        v-if="item.readStatus == '2'"
                                                    >
                                                        <n-gi>
                                                            <n-button
                                                                text
                                                                type="info"
                                                                class="w-100"
                                                                style="padding: 12px 20px"
                                                                @click="goToApp(item)"
                                                                >跳转app</n-button
                                                            >
                                                        </n-gi>
                                                        <n-gi>
                                                            <n-button
                                                                text
                                                                type="warning"
                                                                class="w-100"
                                                                style="padding: 12px 20px"
                                                                @click="bulkModifyTheMessage(item)"
                                                                >标记为已读</n-button
                                                            >
                                                        </n-gi>
                                                    </n-grid>
                                                </template>
                                            </n-thing>
                                        </n-card>
                                    </n-space>
                                </n-scrollbar>
                            </n-layout>
                        </n-layout>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </div>
    </div>
</template>
<script>
    import storage from "store"
    import {
        defineComponent,
        getCurrentInstance,
        onMounted,
        reactive,
        toRefs,
        ref,
        computed,
        h
    } from "vue"
    import {
        CalendarPerson24Regular as DepartmentIcon,
        Location28Regular as AddressIcon
    } from "@vicons/fluent"
    import {
        MessageDots as ReadTheMessageIcon,
        MessageReport as UnreadMessagesIcon
    } from "@vicons/tabler"
    import { HourglassOutline as HourglassIcon } from "@vicons/ionicons5"

    import { useMessage, useDialog, useNotification, NIcon } from "naive-ui"
    import { getUserDetailApi, updateUserApi, getDepartmentAllApi } from "@/api/userManage.js"
    import { getUserMessageApi } from "@/api/public.js"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"

    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) })
    }

    export default defineComponent({
        components: {
            DepartmentIcon,
            AddressIcon,
            HourglassIcon,
            UnreadMessagesIcon
        },
        setup() {
            const formRef = ref(null)
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const notification = useNotification()
            const _this = getCurrentInstance().appContext.config.globalProperties
            const state = reactive({
                // 所有部门
                department: [],
                // 部门中文
                userDepartmentNameList: [],
                // 消息列表
                messagesList: [],
                messageMenu: [],
                menuVal: "2",
                defaultUserAvatar: "https://cdn.bestgenetics.com.cn/common/img/people.png",
                userInfo: store.state.core.userInfo,
                userApp: store.state.core.userApplications || "",
                formValue: {},
                uploadUrl:
                    process.env.VUE_APP_API_BASE_URL +
                    "/ms-tenant-consummer/user/{version}/uploadFile",
                uploadHeaders: {
                    Authorization: "Bearer " + storage.get("access_token")
                }
            })
            // 部门显示
            const getDepartmentName = computed(() => {
                let userDepartmentIds = state.userInfo.deptid
                let userDepartmentNameList = state.department.filter(element => {
                    if (userDepartmentIds.indexOf(element.id) > -1) {
                        return element.title
                    }
                })
                userDepartmentNameList = userDepartmentNameList.map(item => {
                    return item.title
                })
                state.userDepartmentNameList = userDepartmentNameList
                return userDepartmentNameList.toLocaleString()
            })

            const getUserDetail = async obj => {
                await getUserDetailApi(obj).then(res => {
                    // 性别转字符串
                    res.data.sex = res.data.sex.toString()
                    // 时间序列化
                    res.data.hiredate
                        ? (res.data.hiredate = new Date(res.data.hiredate).getTime())
                        : ""
                    // 部门字符串转数组
                    res.data.deptid
                        ? (res.data.deptid = res.data.deptid.split(","))
                        : (res.data.deptid = [])
                    // 角色字符串转数组
                    res.data.rids
                        ? (res.data.rids = res.data.rids.split(","))
                        : (res.data.rids = [])
                    state.formValue = res.data
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
            // 获取用户消息  1已读 2未读 不穿全部
            const getUserMessage = async type => {
                getUserMessageApi({ readStatus: type }).then(res => {
                    if (res.code == 0) {
                        type == 2
                            ? (state.messagesList = res.data)
                            : (state.messagesList = res.data.list)
                    }
                })
            }

            const setMessageMenu = () => {
                state.messageMenu = [
                    {
                        label: "未读消息",
                        key: "2",
                        icon: renderIcon(ReadTheMessageIcon)
                    },
                    {
                        key: "divider-1",
                        type: "divider",
                        props: {
                            style: {
                                marginLeft: "32px"
                            }
                        }
                    },
                    {
                        label: "已读消息",
                        key: "1",
                        icon: renderIcon(UnreadMessagesIcon)
                    },
                    {
                        key: "divider-1",
                        type: "divider",
                        props: {
                            style: {
                                marginLeft: "32px"
                            }
                        }
                    }
                ]
            }
            const goToApp = messageItem => {
                if (!messageItem.route) {
                    return false
                }
                // 标记为已读
                store.dispatch("message/BulkModifyTheMessage", [messageItem.id]).then(() => {
                    getUserMessage(2)
                    // 跳转app
                    store.dispatch("core/openApp", {
                        aid: messageItem.route,
                        rid: store.state.core.userInfo.id
                    })
                })
            }
            const bulkModifyTheMessage = messageItem => {
                window.$dialog.warning({
                    title: "警告",
                    content: "你确定？",
                    positiveText: "确定",
                    negativeText: "不确定",
                    onPositiveClick: () => {
                        // 标记为已读
                        store
                            .dispatch("message/BulkModifyTheMessage", [messageItem.id])
                            .then(() => {
                                getUserMessage(2)
                            })
                    }
                })
            }

            onMounted(() => {
                getUserDetail({ id: state.userInfo.id })
                getDepartmentAll()
                setMessageMenu()
            })
            return {
                ...toRefs(state),
                getDepartmentName,
                formRef,
                goToApp,
                bulkModifyTheMessage,
                rules: {
                    name: [
                        {
                            required: true,
                            message: "请输入姓名",
                            trigger: ["input", "blur"]
                        },
                        {
                            min: 2,
                            max: 20,
                            message: "长度在 2 到 20 个字符",
                            trigger: ["input", "blur"]
                        }
                    ],
                    loginname: [
                        {
                            required: true,
                            message: "请输入登录名称(仅支持数字、字母、下划线、横杠、点号)",
                            trigger: ["input", "blur"],
                            pattern: /^[0-9a-zA-Z_.-]{1,}$/
                        },
                        {
                            min: 2,
                            max: 20,
                            message: "长度在 2 到 20 个字符",
                            trigger: ["input", "blur"]
                        }
                    ],
                    loginpwd: [
                        {
                            message: "请输入登录密码(必须包含数字、英文字母、特殊符号-_.*)",
                            trigger: ["input", "blur"],
                            pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[-_.*])[a-z\d-_.*]{6,20}$/
                        },
                        {
                            min: 6,
                            max: 20,
                            message: "长度在 6 到 20 个字符",
                            trigger: ["input", "blur"]
                        }
                    ]
                },
                uploadChange({ event }) {
                    let responseDate = ""
                    event.target.response != undefined ? (responseDate = event.target.response) : ""
                    responseDate ? (responseDate = JSON.parse(responseDate)) : ""
                    responseDate ? (state.formValue.imgpath = responseDate.data[0]) : ""
                },
                async beforeUpload(data) {
                    if (data.file.file?.size >= 5242880) {
                        message.error("文件过大！请上传小于5MB的PNG或JPG文件！")
                        return false
                    }
                    return true
                },
                // 表单提交
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            dialog.warning({
                                title: "警告",
                                content: "你确定保存用户信息吗？",
                                positiveText: "确定",
                                negativeText: "不确定",
                                onPositiveClick: () => {
                                    let { ...formdata } = state.formValue
                                    formdata.rids.length > 0
                                        ? (formdata.roles = formdata.rids.toString())
                                        : (formdata.rids = "")
                                    formdata.deptid.length > 0
                                        ? (formdata.deptid = formdata.deptid.toString())
                                        : (formdata.deptid = "")
                                    helper.Debounce(() => {
                                        updateUserApi(formdata).then(res => {
                                            if (res.code == 0) {
                                                notification["success"]({
                                                    content: "用户信息修改成功",
                                                    meta: "请重新登录！",
                                                    duration: 5000
                                                })
                                                _this.$store
                                                    .dispatch("core/userLoginOut")
                                                    .then(() => {
                                                        _this.$router.push("/")
                                                    })
                                            }
                                        })
                                    }, 1000)
                                }
                            })
                        } else {
                            message.error("部分信息修改错误，请重新填写！")
                        }
                    })
                },
                // tabs切换
                tabChange(val) {
                    switch (val) {
                        case "消息中心":
                            getUserMessage(2)
                            break

                        default:
                            break
                    }
                },
                // menuChange
                menuChange(val) {
                    switch (val) {
                        case "1":
                            // 已读
                            getUserMessage(1)
                            break
                        case "2":
                            // 未读
                            getUserMessage(2)
                            break

                        default:
                            break
                    }
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .appCardBox {
        display: grid;
        grid-template-columns: 31% 31% 31%;
        grid-column-gap: 15px;
        grid-row-gap: 15px;
        .icon {
            display: inline-block;
            width: 20px;
            height: 25px;
            margin-right: 5px;
            background-size: cover;
            vertical-align: top;
        }
    }
    .messageModule {
        :deep .n-card__content {
            padding: 0;
            .n-thing {
                .n-thing-main {
                    .n-thing-avatar-header-wrapper {
                        padding: 20px 24px;
                        padding-bottom: 0;
                    }
                    .n-thing-main__content {
                        padding: 20px 24px;
                        padding-top: 0;
                    }
                }
            }
        }
    }
</style>
