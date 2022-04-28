<template>
    <div class="p-2">
        <n-card :title="$t('dtables.listing.batchList')">
            <n-data-table
                size="small"
                :loading="showloading"
                :data="pigBreedingList"
                :columns="columns"
                :single-line="false"
                :single-column="false"
                :scroll-x="3000"
                :pagination="pagination"
            />
        </n-card>
        <!-- 登记疫苗&编辑 -->
        <!-- <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            style="width: 560px"
            :title="$t('dataTable.listing.vaccinationIsRegistered')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="VaccineForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-form-item
                        path="vaccineCode"
                        :label="$t('dataTable.listing.vaccineCommonType')"
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="VaccineForm.vaccineCode"
                            :options="getVaccineTypes"
                        />
                    </n-form-item>

                    <n-form-item
                        path="vaccinationDate"
                        :label="$t('dataTable.listing.vaccinationDate')"
                    >
                        <n-date-picker
                            :style="{ width: '255px' }"
                            v-model:value="VaccineForm.vaccinationDate"
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
                     批次 -->
        <!-- <n-form-item
                        path="vaccinationBatch"
                        :label="$t('dataTable.listing.batchNumber')"
                    >
                        <n-input
                            disabled
                            :style="{ width: '255px' }"
                            :placeholder="$t('dataTable.listing.pleaseEnterTheBatchNumber')"
                            v-model:value="VaccineForm.vaccinationBatch"
                        />
                    </n-form-item>

                    <n-form-item
                        path="staffCode"
                        :label="$t('dataTable.listing.operatingPersonnel')"
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="VaccineForm.staffCode"
                            :options="userList"
                            filterable
                            :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                        />
                    </n-form-item>
                    <n-space justify="center">
                        保存 -->
        <!-- <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                         取消 -->
        <!-- <n-button
                            @click="
                                () => {
                                    showAdd = false
                                    clearForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>  -->
    </div>
</template>
<script>
    import { defineComponent, toRefs, reactive, onMounted, ref, h } from "vue"
    import { NButton } from "naive-ui"
    import { useStore } from "vuex"
    import { getPigBreedingListApi } from "@/api/breedingPlan.js"
    import { useI18n } from "vue-i18n"
    import helper from "@/utils/helper.js"
    // import { addPigVaccineApi } from "@/api/pigVaccine.js"

    export default defineComponent({
        components: {},
        setup(props, { emit }) {
            // const message = useMessage()
            const store = useStore()
            const { t } = useI18n()
            const state = reactive({
                showloading: false,
                search: {
                    page: 1,
                    limit: 10
                },
                pigBreedingList: [],
                breedingPlan: [],
                columns: [],
                periodColumns: [],
                // 疫苗接种
                showAdd: false,
                VaccineForm: {
                    vaccineCode: undefined,
                    vaccinationDate: Date.now(),
                    vaccinationBatch: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                }
            })
            // 获取批次列表
            const getPigBreedingList = async () => {
                state.showloading = true
                await getPigBreedingListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigBreedingList = res.data
                    }
                })
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // 批次
                        title: () => {
                            return t("dataTable.listing.batchNumber")
                        },
                        key: "batchNumber",
                        width: 140,
                        fixed: "left"
                    },
                    {
                        // '开始日期'
                        title: () => {
                            return t("datatable.listing.startDate")
                        },
                        key: "startTime",
                        width: 100,
                        fixed: "left",
                        render(row) {
                            return helper.timestampToTime(row.startTime)
                        }
                    },
                    {
                        // 结束日期
                        title: () => {
                            return t("datatable.listing.endDate")
                        },
                        key: "endTime",
                        width: 100,
                        fixed: "left",
                        render(row) {
                            return helper.timestampToTime(row.endTime)
                        }
                    },
                    {
                        // 配种目标
                        title: () => {
                            return t("datatable.listing.breedingTarget")
                        },
                        key: "planNum",
                        width: 80,
                        fixed: "left"
                    },
                    {
                        // 断奶头数
                        title: () => {
                            return t("datatable.listing.numberOfWeaningHeads")
                        },
                        key: "countPig",
                        width: 80,
                        fixed: "left"
                    },
                    {
                        // 配种头数
                        title: () => {
                            return t("datatable.listing.numberOfBreedingHeads")
                        },
                        key: "attrs",
                        children: [
                            {
                                // 批次
                                title: () => {
                                    return t("dataTable.listing.batchNumber")
                                },
                                key: "attack",
                                children: [
                                    {
                                        title: "≤7",
                                        key: "countLittle",
                                        width: 80
                                    },
                                    {
                                        title: "＞7",
                                        key: "countBig",
                                        width: 80
                                    }
                                ]
                            },
                            {
                                // 重发
                                title: () => {
                                    return t("datatable.listing.retransmission")
                                },
                                key: "countPigCode",
                                width: 80
                            },

                            {
                                // 后备猪
                                title: () => {
                                    return t("datatable.listing.ReservePig")
                                },
                                key: "backuppigs",
                                width: 80
                            }
                        ]
                    },
                    {
                        // 异动
                        title: () => {
                            return t("datatable.listing.unusualAction")
                        },
                        key: "aaaa",
                        children: [
                            {
                                // 死亡
                                title: () => {
                                    return t("datatable.listing.death")
                                },
                                key: "die",
                                width: 80
                            },
                            {
                                // 空怀
                                title: () => {
                                    return t("datatable.listing.empty")
                                },
                                key: "barren",
                                width: 80
                            },
                            {
                                // 返情
                                title: () => {
                                    return t("datatable.listing.returnToLove")
                                },
                                key: "retry",
                                width: 80
                            },
                            {
                                // 流产
                                title: () => {
                                    return t("dataTable.listing.abortion")
                                },
                                key: "abortion",
                                width: 80
                            }
                        ]
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        width: 150,
                        fixed: "right",
                        render(row) {
                            return h("div", {}, [
                                h(
                                    NButton,
                                    {
                                        size: "tiny",
                                        type: "info",
                                        style: { marginRight: "10px" },
                                        onClick: () => {
                                            const data = {
                                                id: row.batchNumber,
                                                name: "批次详情",
                                                pageUrl: "breedingPlan/detail"
                                            }
                                            emit("gopage", data)
                                        }
                                    },
                                    { default: () => t("button.viewDetail") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "tiny",
                                        type: "info",
                                        onClick: () => {
                                            const data = {
                                                id: row.batchNumber,
                                                name: "设置目标",
                                                pageUrl: "breedingPlan/setTarget"
                                            }
                                            emit("gopage", data)
                                        }
                                    },
                                    { default: () => t("datatable.listing.setUp") }
                                )
                            ])
                        }
                    },
                    {
                        // 周期
                        title: () => {
                            return t("dtables.listing.cycle")
                        },
                        key: "attrs",
                        children: [
                            {
                                // 孕期
                                title: () => {
                                    return t("dtables.listing.pregnancy")
                                },
                                key: "attrs",
                                children: [
                                    {
                                        // 第1周
                                        title: () => {
                                            return t("dtables.listing.Week1")
                                        },
                                        key: "firstWeek"
                                    },
                                    {
                                        // 第2周
                                        title: () => {
                                            return t("dtables.listing.Week2")
                                        },
                                        key: "twoWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week3")
                                        },
                                        key: "thirdWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week4")
                                        },
                                        key: "secondWeekOf"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week5")
                                        },
                                        key: "fifthWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week6")
                                        },
                                        key: "sixWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week7")
                                        },
                                        key: "sevenWeeks"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week8")
                                        },
                                        key: "eightWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week9")
                                        },
                                        key: "ninthWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week10")
                                        },
                                        key: "tenWeeks"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week11")
                                        },
                                        key: "tenthWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week12")
                                        },
                                        key: "twelveWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week13")
                                        },
                                        key: "thirTeenhWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week14")
                                        },
                                        key: "fourTeenWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week15")
                                        },
                                        key: "fifTeenWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week16")
                                        },
                                        key: "sixTeenWeek"
                                    }
                                ]
                            },
                            {
                                // 哺乳期
                                title: () => {
                                    return t("dtables.listing.lactation")
                                },
                                key: "attrs",
                                children: [
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week1")
                                        },
                                        key: "lactionOneWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week2")
                                        },
                                        key: "lactionTwoWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week3")
                                        },
                                        key: "lactionThreeWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week4")
                                        },
                                        key: "lactionFourWeek"
                                    }
                                ]
                            },
                            {
                                //离乳期
                                title: () => {
                                    return t("dtables.listing.WeaningPeriod")
                                },
                                key: "attrs",
                                children: [
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week1")
                                        },
                                        key: "lactionFiveWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week2")
                                        },
                                        key: "lactionSixWeek"
                                    },
                                    {
                                        title: () => {
                                            return t("dtables.listing.Week3")
                                        },
                                        key: "lactionSevenWeek"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            // 疫苗
            const vaccineList = row => {
                state.showAdd = true
                state.VaccineForm.vaccinationBatch = row.batchNumber
            }
            // 疫苗类型
            // const getVaccineTypes = computed(() => {
            //     return store.state.dictionaries.dictionaries.vaccinationType
            // })
            //清空数据
            // const clearForm = () => {
            //     state.VaccineForm = {
            //         vaccinationDate: Date.now(),
            //         vaccineCode: undefined,
            //         vaccinationBatch: undefined,
            //         staffCode: store.state.core.userInfo.id || ""
            //     }
            // }
            // 保存疫苗数据
            // const handleValidateClick = async () => {
            //     let data = JSON.parse(JSON.stringify(state.VaccineForm))
            //     data.vaccinationDate = helper.format(data.vaccinationDate)
            //     data.productionBatch = state.VaccineForm.vaccinationBatch
            //     await addPigVaccineApi(data).then(res => {
            //         if (res.code == 0) {
            //             message.success(t("dataTable.listing.saveSuccess"))
            //             clearForm()
            //             state.showAdd = false
            //             state.pigDetail = {}
            //             state.search.page = 1
            //             getPigBreedingList()
            //         }
            //     })
            // }
            onMounted(() => {
                getPigBreedingList()
                //设置列表
                setTableColumns()
            })
            return {
                getPigBreedingList,
                pagination: ref({
                    pageSize: 10
                }),
                ...toRefs(state),
                songs: [
                    {
                        value: "1",
                        label: "全部批次"
                    },
                    {
                        value: "2",
                        label: "执行中批次"
                    },
                    {
                        value: "3",
                        label: "已完成批次"
                    }
                ].map(s => {
                    s.value = s.value.toLowerCase()
                    return s
                }),
                tabValChange(val) {
                    state.search.dateType = val
                    getPigBreedingList()
                },
                viewTypeChange(val) {
                    state.viewType = val
                },
                goDetail(item) {
                    const data = {
                        id: item.batchNumber,
                        name: "批次详情",
                        pageUrl: "breedingPlan/detail"
                    }
                    emit("gopage", data)
                },
                // 疫苗
                vaccineList
                // getVaccineTypes,
                // clearForm,
                // 操作人
                // userList: computed(() => store.state.dictionaries.userSelectList),
                // handleValidateClick
            }
        }
    })
</script>
<style lang="less" scoped>
    .listBox {
        padding: 50px 0;
        display: grid;
        grid-template-columns: 24% 24% 24% 24%;
        grid-column-gap: 10px;
        grid-row-gap: 5%;
    }
    .listChange {
        position: absolute;
        left: 20px;
    }
</style>
