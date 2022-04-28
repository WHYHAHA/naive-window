<template >
    <n-space vertical :size="20">
        <n-card>
            <n-breadcrumb>
                <n-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" @click="goFatherPage(index,item)">{{item.name}}</n-breadcrumb-item>
            </n-breadcrumb>
        </n-card>
        <n-card title="系统日志">
            <n-tabs type="line" @update:value="handleUpdateValue">
                <n-tab-pane name="列表展示" tab="列表展示">
                    <div class="pl-3 pr-3 pt-2">
                        <tableComponents :columns="columns" :data="logList" :loading="showloading" v-model:search="search" @update:filters="handleFiltersChange" @update:search="getLog"></tableComponents>
                    </div>
                </n-tab-pane>
                <n-tab-pane name="竖排展示" tab="竖排展示">
                    <n-space vertical>
                        <n-space align="center">
                            <n-text code>共计 {{search.total}} 条操作记录</n-text>
                            <n-button type="info" @click="getLogVertical">更新最新数据</n-button>
                        </n-space>
                        <n-log :log="log" :rows="20" :line-height="2" :loading="loading" language="naive-log" trim @require-bottom="handleReachBottom()" />
                    </n-space>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </n-space>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeMount, ref } from "vue"
    import { getLogApi } from "@/api/public.js"

    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        props: {
            pageData: Object,
        },
        components: {
            tableComponents,
        },
        setup(props, { emit }) {
            const formRef = ref(null)
            const state = reactive({
                breadcrumbList: [
                    { pageUrl: "syspreferences/list", name: "偏好设置" },
                    { pageUrl: "sys/sysLog/log", name: "系统日志" },
                ],
                loading: false,
                columns: [],
                log: "",
                logList: [],
                search: {
                    page: 1,
                    limit: 10,
                    total: undefined,
                },
            })
            // 日志-列表
            const getLog = async () => {
                state.loading = true
                await getLogApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.loading = false
                        state.logList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 日志-竖排
            const getLogVertical = async () => {
                state.loading = true
                await getLogApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.loading = false
                        let logList = []
                        for (let index = 0; index < res.data.list.length; index++) {
                            const element = res.data.list[index]
                            logList.push(
                                index +
                                    1 +
                                    " 用户：" +
                                    element.optName +
                                    " 在操作模块：" +
                                    element.model +
                                    "页面，使用操作类型：" +
                                    element.logType +
                                    "。 操作时间：" +
                                    element.optTime +
                                    " 处理结果：" +
                                    element.result
                            )
                        }
                        state.log = logList.join("\n") + "\n"
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        title: "用户名",
                        key: "optName",
                    },
                    {
                        title: "操作模块",
                        key: "model",
                    },
                    {
                        title: "操作类型",
                        key: "logType",
                    },
                    {
                        title: "操作时间",
                        key: "optTime",
                    },
                    {
                        title: "处理结果",
                        key: "result",
                    },
                    {
                        title: "ip地址",
                        key: "optIp",
                    },
                ]
            }

            onBeforeMount(() => {
                setTableColumns()
            })
            onMounted(() => {
                getLog()
            })
            return {
                ...toRefs(state),
                formRef,
                getLog,
                getLogVertical,
                handleReachBottom() {
                    window.alert("Reach Bottom")
                },
                handleUpdateValue: value => {
                    switch (value) {
                        case "列表展示":
                            state.search.page = 1
                            state.search.limit = 10
                            state.logList = []
                            getLog()
                            break
                        case "竖排展示":
                            state.search.page = 1
                            state.search.limit = 100
                            state.log = ""
                            getLogVertical()
                            break

                        default:
                            break
                    }
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

<style lang='less' scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>