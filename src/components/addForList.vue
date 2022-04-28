<template>
    <n-modal
        v-model:show="showModal"
        class="custom-card"
        preset="card"
        :style="bodyStyle"
        :title="cardTitle"
        size="huge"
        :bordered="false"
        :mask-closable="false"
    >
        <n-card :bordered="false">
            <n-space vertical :size="30">
                <!-- 增加一行 -->
                <n-button @click="addRow" round type="success">{{
                    $t("dataTable.listing.addALine")
                }}</n-button>
                <n-scrollbar style="max-height: 370px">
                    <n-data-table
                        :key="row => row.key"
                        :columns="columnsComputed"
                        :data="formListComputed"
                    />
                </n-scrollbar>
                <n-space justify="end">
                    <n-button class="col-2" type="info" @click="handleValidateClick">{{
                        $t("dtables.listing.save")
                    }}</n-button>
                    <n-button class="col-2" @click="showModal = false">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-space>
        </n-card>
    </n-modal>
</template>

<script>
    import { defineComponent, computed, h, reactive, toRefs, onMounted } from "vue"
    import { NInput, NButton, NDatePicker, NSwitch, NSelect } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        props: {
            showAddList: {
                // 显示
                type: Boolean,
                default: false
            },
            formOptions: {
                // 列表提交数据源
                type: Object,
                default() {
                    return {}
                }
            },
            cardTitle: {
                // card title名称
                type: String,
                default: () => {
                    const { t } = useI18n()
                    return t("dataTable.listing.addANumberOf")
                }
            }
        },
        setup(props, { emit }) {
            const { t } = useI18n()
            const store = useStore()
            const state = reactive({
                formList: [],
                columns: []
            })
            const showModal = computed({
                get: () => props.showAddList,
                set: val => {
                    emit("update:showAddList", val)
                }
            })
            const columnsComputed = computed(() => {
                return state.columns
            })
            const formListComputed = computed(() => {
                return state.formList
            })
            // 初始化数据 创建列
            const initColumns = isBedListInit => {
                let formData = JSON.parse(JSON.stringify(props.formOptions))
                let columns = []
                let selectOptions = ["pregnnancyType", "pregnancyCheckType"]
                for (const key in formData) {
                    if (key.indexOf("Date") != -1) {
                        // 时间
                        columns.push({
                            title: t("dataTable.listing." + key),
                            key: key,
                            render(row, index) {
                                return h(NDatePicker, {
                                    value: row[key] || Date.now(),
                                    onUpdateValue(v) {
                                        state.formList[index][key] = v
                                    }
                                })
                            }
                        })
                    } else if (selectOptions.includes(key)) {
                        //select 选择框
                        columns.push({
                            title: t("dataTable.listing." + key),
                            key: key,
                            width: "150",
                            render(row, index) {
                                // 设置操作人 默认为当前用户
                                return h(NSelect, {
                                    defaultValue: state.formList[index][key],
                                    options: store.state.dictionaries.dictionaries[key],
                                    onUpdateValue(v) {
                                        state.formList[index][key] = v
                                    }
                                })
                            }
                        })
                    } else if (key.indexOf("matchType") != -1) {
                        //单选
                        columns.push({
                            title: t("dataTable.listing." + key),
                            key: key,
                            render(row, index) {
                                return h(NSwitch, {
                                    value: row[key] || false,
                                    onUpdateValue(v) {
                                        state.formList[index][key] = v
                                    }
                                })
                            }
                        })
                    } else if (key.indexOf("staffCode") != -1) {
                        //操作人
                        columns.push({
                            title: t("dataTable.listing." + key),
                            key: key,
                            render(row, index) {
                                // 设置操作人 默认为当前用户
                                return h(NSelect, {
                                    defaultValue: store.state.core.userInfo.id,
                                    options: store.state.dictionaries.userSelectList,
                                    filterable: true,
                                    onUpdateValue(v) {
                                        state.formList[index][key] = v
                                    }
                                })
                            }
                        })
                    } else {
                        // 普通input
                        columns.push({
                            title: t("dataTable.listing." + key),
                            key: key,
                            render(row, index) {
                                return h(NInput, {
                                    value: row[key],
                                    onUpdateValue(v) {
                                        state.formList[index][key] = v
                                    }
                                })
                            }
                        })
                    }
                }
                // 操作
                columns.push({
                    title: t("dataTable.listing.actions"),
                    key: "actions",
                    render(row, index) {
                        return h(
                            NButton,
                            {
                                size: "small",
                                round: true,
                                type: "error",
                                onClick: () => {
                                    state.formList.splice(index, 1)
                                }
                            },
                            { default: () => t("dataTable.listing.checkTheFeeling") }
                        )
                    }
                })
                if (isBedListInit) {
                    columns.unshift({
                        type: "expand",
                        expandable: () => true,
                        renderExpand: rowData => {
                            return rowData.badField ? rowData.badField.toString() : "暂无"
                        }
                    })
                }

                state.columns = columns
            }

            // 单行增加
            const addRow = () => {
                let formData = JSON.parse(JSON.stringify(props.formOptions))
                for (const key in formData) {
                    if (Object.hasOwnProperty.call(formData, key)) {
                        key.indexOf("Date") != -1 ? formData[key] : (formData[key] = "")
                        // 添加默认操作人为自己
                        key.indexOf("staffCode") != -1
                            ? (formData[key] = store.state.core.userInfo.id)
                            : ""
                    }
                }
                state.formList.push(formData)
            }
            // 保存
            const handleValidateClick = () => {
                let formList = JSON.parse(JSON.stringify(state.formList))
                formList.forEach(element => {
                    for (const key in element) {
                        //时间格式转换为  yyyy-mm-dd hh:mm:ss
                        key.indexOf("Date") != -1
                            ? (element[key] = helper.format(element[key]).split(" ")[0])
                            : ""
                        // 单选转换  只是更改为1 加入 2 未加入  没有对应字典(dictName 不一致)
                        if (key.indexOf("matchType") != -1) {
                            let newValue = element[key]
                            //  1加入 2未加入
                            newValue ? (newValue = 1) : (newValue = 2)
                            element[key] = newValue
                        }
                    }
                })
                console.log(formList)
                emit("getformlist", formList)
            }
            // 修改列表
            const setTheWrongData = wrongData => {
                window.$message.warning(
                    "共计 " +
                        wrongData.aggregateData +
                        " 条数据，成功 " +
                        wrongData.succeedNum +
                        " 条，失败 " +
                        wrongData.loseNum +
                        " 条。错误数据已更新到列表，请修改后再提交",
                    { keepAliveOnHover: true }
                )
                wrongData.badList.forEach(element => {
                    element.mapplyDate
                        ? (element.mapplyDate = new Date(element.mapplyDate).getTime())
                        : ""
                    element.pregnnancyDate
                        ? (element.pregnnancyDate = new Date(element.pregnnancyDate).getTime())
                        : ""
                })

                initColumns(true)
                state.formList = JSON.parse(JSON.stringify(wrongData.badList))
            }
            onMounted(() => {
                // 默认添加一行
                addRow()
                initColumns()
            })

            return {
                ...toRefs(state),
                handleValidateClick,
                setTheWrongData,
                addRow,
                formListComputed,
                columnsComputed,
                showModal,
                labelStyle: {
                    color: "#969595"
                },
                bodyStyle: {
                    width: "1200px"
                }
            }
        }
    })
</script>
