<template>
    <n-space class="p-2" vertical>
        <!-- 当前时间段进行中批次 -->
        <n-card
            :title="$t('dtables.listing.inTheCurrentPeriodInBatches')"
            v-if="currentBatch.batchNumber"
        >
            <n-descriptions label-placement="top" bordered :column="3" size="small">
                <!-- 批次号 -->
                <n-descriptions-item :label="$t('dtables.listing.batchNo')">{{
                    currentBatch.batchNumber
                }}</n-descriptions-item>
                <!-- 开始时间 -->
                <n-descriptions-item :label="$t('dataTable.listing.startTime')">{{
                    currentBatch.startTime
                }}</n-descriptions-item>
                <!-- 结束时间 -->
                <n-descriptions-item :label="$t('dtables.listing.theEndOfTime')">{{
                    currentBatch.endTime
                }}</n-descriptions-item>
            </n-descriptions>
        </n-card>
        <n-card :title="$t('dtables.listing.aNewBatch')">
            <n-space vertical>
                <n-space vertical class="mb-1">
                    <n-text class="ml-2" type="error"
                        >* &nbsp;{{ $t("dtables.listing.overrideThisTime") }}</n-text
                    >
                </n-space>
                <n-form
                    label-placement="left"
                    :label-width="120"
                    :model="addForm"
                    :rules="rules"
                    ref="formRef"
                >
                    <div>
                        <n-form-item :label="$t('dtables.listing.batchCycle')" path="countDay">
                            <n-input-number v-model:value="addForm.countDay" :min="1" :max="999">
                                <template #suffix>天</template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item :label="$t('datatable.listing.startDate')" path="startDate">
                            <n-date-picker
                                v-model:value="addForm.startDate"
                                type="date"
                                :is-date-disabled="dateDisabled"
                            />
                        </n-form-item>
                    </div>
                    <!-- <div class="pl-1 pb-1">配种目标设置：</div>
                <n-grid x-gap="12" :cols="2">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space justify="space-between">栋舍：</n-space>
                        </div>
                        <n-data-table :columns="columns" :data="data" :pagination="pagination" />
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">配种目标:</div>
                        <n-card>123</n-card>
                    </n-gi>
                    </n-grid>-->
                    <div class="pl-3">
                        <n-form-item>
                            <!-- 保存，取消 -->
                            <n-button
                                type="info"
                                @click="handleValidateClick"
                                attr-type="button"
                                class="col-2"
                                >{{ $t("button.preservation") }}</n-button
                            >
                        </n-form-item>
                    </div>
                </n-form>
            </n-space>
        </n-card>
    </n-space>
</template>
<script>
    import { defineComponent, h, reactive, toRefs, ref, onMounted } from "vue"
    import { NTag, NButton } from "naive-ui"
    import { addBatchApi, getCurrentBatchApi } from "@/api/breedingPlan.js"
    import helper from "@/utils/helper.js"
    import { useI18n } from "vue-i18n"

    const createColumns = ({ sendMail }) => {
        return [
            {
                title: "Name",
                key: "name",
                align: "center"
            },
            {
                title: "Age",
                key: "age"
            },
            {
                title: "Address",
                key: "address"
            },
            {
                title: "Tags",
                key: "tags",
                render(row) {
                    const tags = row.tags.map(tagKey => {
                        return h(
                            NTag,
                            {
                                style: {
                                    marginRight: "6px"
                                },
                                type: "info"
                            },
                            {
                                default: () => tagKey
                            }
                        )
                    })
                    return tags
                }
            },
            {
                title: "Action",
                key: "actions",
                render(row) {
                    return h(
                        NButton,
                        {
                            size: "small",
                            onClick: () => sendMail(row)
                        },
                        { default: () => "Send Email" }
                    )
                }
            }
        ]
    }
    const createData = () => [
        {
            key: 0,
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["nice", "developer"]
        },
        {
            key: 1,
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["wow"]
        },
        {
            key: 2,
            name: "Joe Black",
            age: 32,
            address: "Sidney No. 1 Lake Park",
            tags: ["cool", "teacher"]
        }
    ]

    export default defineComponent({
        props: {
            pageData: Object
        },
        setup() {
            const { t } = useI18n()
            const formRef = ref(null)
            const state = reactive({
                addForm: {
                    countDay: 7,
                    startDate: undefined
                },
                currentBatch: {}
            })
            let messageReactive = reactive(null)
            const removeMessage = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }

            // 添加种猪
            const addbatch = async () => {
                if (!messageReactive) {
                    messageReactive = window.$message.loading(t("dtables.listing.isTheNewBatch"), {
                        duration: 0
                    })
                }
                state.addForm.startDate = helper.formatStartTamp(state.addForm.startDate)

                await addBatchApi(state.addForm).then(res => {
                    removeMessage()
                    if (res.code == 0) {
                        window.$message.success(t("dtables.listing.theNewBatchSuccess"))
                        state.addForm = {
                            countDay: 7,
                            startDate: state.currentBatch.endTime
                                ? new Date().setFullYear(
                                      new Date(state.currentBatch.endTime).getFullYear(),
                                      new Date(state.currentBatch.endTime).getMonth(),
                                      new Date(state.currentBatch.endTime).getDate()
                                  ) + 86400000
                                : new Date().setFullYear(
                                      new Date().getFullYear(),
                                      new Date().getMonth(),
                                      new Date().getDate()
                                  ) + 86400000
                        }
                        getCurrentBatch()
                    }
                })
            }
            // 获取当前批次  表单开始时间做判断
            const getCurrentBatch = async () => {
                await getCurrentBatchApi().then(res => {
                    if (res.code == 0) {
                        state.currentBatch = res.data || ""
                    }
                })
            }
            onMounted(() => {
                getCurrentBatch()
            })
            return {
                ...toRefs(state),
                formRef,
                rules: {
                    countDay: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheBatchCycle")
                    },
                    startDate: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheBatchStartDate")
                    }
                },
                data: createData(),
                pagination: {
                    pageSize: 10
                },
                columns: createColumns({}),
                // 右侧表单提交
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addbatch()
                        } else {
                            window.$message.error(t("dtables.listing.toResubmit"))
                        }
                    })
                },
                dateDisabled(ts) {
                    if (state.currentBatch.endTime) {
                        const endTime = new Date(state.currentBatch.endTime).getTime()
                        return ts < endTime
                    }
                    return ts < new Date().getTime()
                },
                options: [
                    {
                        label: "Everybody's Got Something to Hide Except Me and My Monkey",
                        value: "song0",
                        disabled: true
                    },
                    {
                        label: "Drive My Car",
                        value: "song1"
                    },
                    {
                        label: "Norwegian Wood",
                        value: "song2"
                    },
                    {
                        label: "You Won't See",
                        value: "song3",
                        disabled: true
                    },
                    {
                        label: "Nowhere Man",
                        value: "song4"
                    },
                    {
                        label: "Think For Yourself",
                        value: "song5"
                    },
                    {
                        label: "The Word",
                        value: "song6"
                    },
                    {
                        label: "Michelle",
                        value: "song7",
                        disabled: true
                    },
                    {
                        label: "What goes on",
                        value: "song8"
                    },
                    {
                        label: "Girl",
                        value: "song9"
                    },
                    {
                        label: "I'm looking through you",
                        value: "song10"
                    },
                    {
                        label: "In My Life",
                        value: "song11"
                    },
                    {
                        label: "Wait",
                        value: "song12"
                    }
                ]
            }
        }
    })
</script>
