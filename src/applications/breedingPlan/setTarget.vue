<template>
    <div class="p-2 breedingPlanDetail">
        <n-space vertical :size="20">
            <n-card>
                <n-breadcrumb>
                    <n-breadcrumb-item
                        v-for="(item, index) in pageData.breadcrumbList"
                        :key="index"
                        @click="goFatherPage(index, item)"
                        >{{ item.name }}</n-breadcrumb-item
                    >
                </n-breadcrumb>
            </n-card>
            <!-- 配种计划信息 -->
            <n-card>
                <div class="flex">
                    <div>
                        <img
                            :style="{ width: '150px' }"
                            src="https://cdn.bestgenetics.com.cn/common/bg/pigPlan.png"
                            alt
                            srcset
                        />
                    </div>
                    <div class="flex-1 ml-2">
                        <n-descriptions
                            label-placement="left"
                            :title="detail.batchNumber || $t('dataTable.listing.notYet')"
                        >
                            <n-descriptions-item :label="$t('datatable.listing.startDate')">{{
                                detail.startTime
                            }}</n-descriptions-item>
                            <n-descriptions-item :label="$t('datatable.listing.endDate')">{{
                                detail.endTime
                            }}</n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.planStatus')">{{
                                detail.planStatus
                            }}</n-descriptions-item>
                        </n-descriptions>
                    </div>
                </div>
            </n-card>
            <!-- 配种计划信息 -->
            <n-card title="配种目标设置">
                <n-space vertical :size="20">
                    <n-space>
                        <!-- 保存，取消 -->
                        <n-button type="info" @click="saveTarger" class="col-2">{{
                            $t("button.preservation")
                        }}</n-button>
                        <n-button @click="leftClick = -1" class="col-2">{{
                            $t("button.cancel")
                        }}</n-button>
                    </n-space>

                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="7 400:7 600:7 800:7">
                            <div class="tabHeader">
                                <n-space justify="space-between">{{
                                    $t("dataTable.listing.Dorm")
                                }}</n-space>
                            </div>
                            <n-data-table
                                :columns="columns"
                                :data="targetlist"
                                :row-class-name="rowClassName"
                            />
                        </n-gi>
                        <n-gi span="3 400:3 600:3 800:3">
                            <div class="tabHeader">
                                {{ $t("datatable.listing.breedingTarget") }}:
                            </div>
                            <n-card>
                                <n-space vertical :size="20">
                                    <n-text code v-if="leftClick >= 0">{{
                                        $t("dtables.listing.automaticallySavedAfterTheChange")
                                    }}</n-text>
                                    <n-data-table
                                        :columns="setColumns"
                                        :data="rightData"
                                        v-if="leftClick >= 0"
                                    />
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-space>
                            </n-card>
                        </n-gi>
                    </n-grid>
                </n-space>
            </n-card>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, reactive, onMounted, toRefs, h, computed } from "vue"
    import { NButton, NSpace, NInputNumber } from "naive-ui"
    import {
        getPigBreedingDetailApi,
        getTargetDetailApi,
        saveTargerApi
    } from "@/api/breedingPlan.js"
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {},
        setup(props) {
            const { t } = useI18n()
            const state = reactive({
                targetlist: [],
                columns: [],
                rightData: [{}],
                leftClick: -1,
                detail: {
                    batchNumber: props.pageData.id
                }
            })
            // 获取批次详情
            const getPigBreedingDetail = async () => {
                await getPigBreedingDetailApi({ batchNumber: props.pageData.id }).then(res => {
                    if (res.code == 0) {
                        state.detail = res.data
                        setColumns()
                    }
                })
            }
            // 设置目标时获取 对应栋舍及母猪数量
            const getTargetDetail = async () => {
                await getTargetDetailApi({ batchNumber: props.pageData.id }).then(res => {
                    if (res.code == 0) {
                        state.targetlist = res.data
                        state.targetlist.forEach(element => {
                            element.batchNumber = props.pageData.id
                        })
                    }
                })
            }
            // 保存设置目标
            const saveTarger = async () => {
                let formData = {
                    models: [...state.targetlist]
                }
                await saveTargerApi(formData).then(res => {
                    if (res.code == 0) {
                        // state.targetlist = res.data
                    }
                })
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => t("dtables.listing.buildingUpTheEncoding"),
                        key: "dormCode"
                    },
                    {
                        title: () => t("dataTable.listing.Dorm"),
                        key: "dormName"
                    },
                    {
                        title: () => t("dtables.listing.amountOfNumberOfSows"),
                        key: "theSowColumnNumber"
                    },
                    {
                        title: () => t("dtables.listing.theGenerationOfTheSowsNumber"),
                        key: "attrs",
                        children: [
                            {
                                // 大白
                                title: () => t("dtables.listing.theGreatWhite"),
                                key: "pigSourcesLandrace"
                            },
                            {
                                // 长白
                                title: () => t("dtables.listing.Landrace"),
                                key: "pigSourcesBaymax"
                            },
                            {
                                // 杜洛克
                                title: () => t("dtables.listing.turok"),
                                key: "pigSourcesDuroc"
                            }
                        ]
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        onClick: () => {
                                            state.leftClick = index
                                            state.rightData[0] = JSON.parse(JSON.stringify(row))
                                        }
                                    },
                                    { default: () => t("dtables.listing.setTheBreedingGoals") }
                                )
                            ])
                        }
                    }
                ]
            }
            onMounted(() => {
                getPigBreedingDetail()
                getTargetDetail()
            })
            return {
                ...toRefs(state),
                saveTarger,
                setColumns: [
                    {
                        title: () => t("dtables.listing.theGreatWhite"),
                        key: "planNumLargeWhite",
                        render() {
                            return h(NInputNumber, {
                                value: computed(() => {
                                    return (
                                        state.targetlist[state.leftClick]["planNumLargeWhite"] || 0
                                    )
                                }),
                                min: 0,
                                onUpdateValue(v) {
                                    state.targetlist[state.leftClick]["planNumLargeWhite"] = v
                                }
                            })
                        }
                    },
                    {
                        title: () => t("dtables.listing.Landrace"),
                        key: "planNumLandrace",
                        render() {
                            return h(NInputNumber, {
                                value: computed(() => {
                                    return state.targetlist[state.leftClick]["planNumLandrace"] || 0
                                }),
                                min: 0,
                                onUpdateValue(v) {
                                    state.targetlist[state.leftClick]["planNumLandrace"] = v
                                }
                            })
                        }
                    },
                    {
                        title: () => t("dtables.listing.turok"),
                        key: "planNumDuroc",
                        render() {
                            return h(NInputNumber, {
                                value: computed(() => {
                                    return state.targetlist[state.leftClick]["planNumDuroc"] || 0
                                }),
                                min: 0,
                                onUpdateValue(v) {
                                    state.targetlist[state.leftClick]["planNumDuroc"] = v
                                }
                            })
                        }
                    }
                ],
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClick) {
                        return "tr-select"
                    }
                    return null
                },
                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index == 0) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl
                        }
                        this.$emit("gopage", data)
                    } else {
                        window.$message.warning(t("dtables.listing.youHaveBeenInTheCurrentPage"))
                    }
                }
            }
        }
    })
</script>
