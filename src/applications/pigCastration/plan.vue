<template>
    <div class="p-2">
        <!-- 阉割计划 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.castrationPlan") }}</div>
                    <n-space align="center">
                        <n-button type="info" class="col-2" @click="showImport = true">
                            {{ $t("button.import") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">
                            {{ $t("button.export") }}
                        </n-button>
                    </n-space>
                </n-space>
            </template>
            <!-- tabs切换 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待审定" :tab="$t('dataTable.listing.forReviewAndApproval')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待审定阉割计划 -->
                                    <div>
                                        {{ $t("dataTable.listing.toBeAuthorizedCastrationPlan") }}:
                                    </div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigPlan()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCodeLike"
                                        @keyup.enter="getPigPlan"
                                        @clear="
                                            () => {
                                                search.pigCodeLike = ''
                                                getPigPlan()
                                            }
                                        "
                                    >
                                        <template #prefix>
                                            <n-icon>
                                                <searchIcon />
                                            </n-icon>
                                        </template>
                                    </n-input>
                                </div>
                            </n-space>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="待阉割" :tab="$t('dtables.listing.toCastrate')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待阉割计划 -->
                                    <div>{{ $t("dataTable.listing.toCastratePlan") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigPlan()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCodeLike"
                                        @keyup.enter="getPigPlan"
                                        @clear="
                                            () => {
                                                search.pigCodeLike = ''
                                                getPigPlan()
                                            }
                                        "
                                    >
                                        <template #prefix>
                                            <n-icon>
                                                <searchIcon />
                                            </n-icon>
                                        </template>
                                    </n-input>
                                </div>
                            </n-space>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="已阉割" :tab="$t('dtables.listing.hasBeenCastrated')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <div>{{ $t("dataTable.listing.castrationPlan") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigPlan()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCodeLike"
                                        @keyup.enter="getPigPlan"
                                        @clear="
                                            () => {
                                                search.pigCodeLike = ''
                                                getPigPlan()
                                            }
                                        "
                                    >
                                        <template #prefix>
                                            <n-icon>
                                                <searchIcon />
                                            </n-icon>
                                        </template>
                                    </n-input>
                                </div>
                            </n-space>
                        </div>
                    </n-tab-pane>
                </n-tabs>
                <tableComponents
                    :columns="columns"
                    :data="castrationList"
                    :loading="showloading"
                    :scroll-x="1600"
                    v-model:search="search"
                    @update:checked-row-keys="handleCheck"
                    @update:filters="handleFiltersChange"
                    @update:search="getPigPlan"
                ></tableComponents>
            </n-card>
        </n-card>

        <!-- 编辑阉割计划span="4 400:4 600:4 800:4" -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.editCastrationPlan')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="planForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="3">
                        <n-gi>
                            <n-form-item :label="$t('dataTable.listing.nestNumber')">
                                {{ planForm.nestNumber }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.motherCode')">{{
                                planForm.pigCode
                            }}</n-form-item>

                            <n-form-item :label="$t('dataTable.listing.fatherCode')">
                                {{ planForm.boarCode }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.numberOfBoars')">
                                {{ planForm.farrowingMCount }}
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item :label="$t('dataTable.listing.inCourt')">
                                {{ getFarmName(planForm.farmid) }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.femaleBreedingLevel')">
                                {{ getDictionarieName("breedingLevel", planForm.breedingLevel) }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.theParentBreedingLevel')">
                                {{
                                    getDictionarieName(
                                        "breedingLevel",
                                        planForm.boarCodeBreedingLevel
                                    )
                                }}
                            </n-form-item>

                            <n-form-item
                                path="seedRetentionMCount"
                                :label="$t('dataTable.listing.seedNumber')"
                            >
                                <n-input-number
                                    v-model:value="planForm.seedRetentionMCount"
                                    clearable
                                    min="0"
                                    style="width: 120px"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item :label="$t('dataTable.listing.inPiggery')">
                                {{ getDormName(planForm.dormCode) }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.femaleBreedingValue')">
                                {{ planForm.breedingValue }}
                            </n-form-item>

                            <n-form-item :label="$t('dataTable.listing.theParentBreedingValue')">
                                {{ planForm.boarCodeBreedingValue }}
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button
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
        </n-modal>

        <!-- 导入 -->
        <eximportComponents
            v-model:openImport="showImport"
            templateNmae="piglet-archive-upload-template.xls"
            apiUrl="batchAddPigVaccinationApi"
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="阉割计划列表"
            apiUrl="exportPigcastrationPlanApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigcastrationPlanApi,
        getPigcastrationPlanAndBreedingRecordApi,
        updatePigcastrationPlanApi
    } from "@/api/pigCastration.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import eximportComponents from "@/components/exImport.vue"
    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            eximportComponents,
            exportComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                showAdd: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCodeLike: "",
                    // 开始时间
                    createDateGte: helper.formatStartTamp(Date.now()),
                    // 结束时间
                    createDateLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                planForm: {
                    seedRetentionMCount: undefined
                },
                castrationList: [],
                columns: []
            })

            // 获取阉割计划列表
            const getPigPlan = async () => {
                state.search.vaccinationDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.vaccinationDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true

                await getPigcastrationPlanApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.castrationList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            //修改
            const updatePigPlan = async () => {
                let data = {
                    id: state.planForm.id,
                    seedRetentionMCount: state.planForm.seedRetentionMCount
                }
                await updatePigcastrationPlanApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.editSuccess"))
                        clearForm()
                        state.showAdd = false
                        getPigPlan()
                    }
                })
            }

            // 获取详细信息
            const getPigdetil = async id => {
                await getPigcastrationPlanAndBreedingRecordApi({ id: id }).then(res => {
                    if (res.code == 0) {
                        state.planForm.boarCode = res.data[0].boarCode
                        state.planForm.boarCodeBreedingLevel = res.data[0].boarCodeBreedingLevel
                        state.planForm.boarCodeBreedingValue = res.data[0].boarCodeBreedingValue
                    }
                })
            }

            const clearForm = () => {
                state.planForm = {
                    id: undefined,
                    seedRetentionMCount: undefined
                }
            }
            function getVaccineTypesName(id) {
                state.VaccineTypes.forEach(item => {
                    if (item.value == id) {
                        return item.label
                    }
                })
            }
            // store.getters['dictionaries/getVaccineTypeList']
            const getVaccineTypes = computed(() => {
                return function () {
                    return store.state.dictionaries.vaccineTypeList
                }
            })
            const getFarmName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getFarmName"](id)
                }
            })
            const getDormName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getDormName"](id)
                }
            })
            const getVaccineTypeName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getVaccineTypeName"](id)
                }
            })
            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '窝号',
                        title: () => {
                            return t("dataTable.listing.dens")
                        },
                        key: "nestNumber"
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "farmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmid)
                        }
                    },
                    {
                        // title: '栋舍',
                        title: () => {
                            return t("dataTable.listing.Dorm")
                        },
                        key: "dormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.dormCode)
                        }
                    },
                    {
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
                    },
                    {
                        // title: '母猪ID',
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '品种',
                        title: () => {
                            return t("dataTable.listing.species")
                        },
                        key: "pigSources",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigSources"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigSources",
                                row.pigSources
                            )
                        }
                    },
                    {
                        // title: '品系',
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '母猪等级',
                        title: () => {
                            return t("dataTable.listing.sowGrade")
                        },
                        key: "breedingLevel",
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedingLevel"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingLevel",
                                row.breedingLevel
                            )
                        }
                    },
                    {
                        // title: '育种值',
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },
                    {
                        // title: '胎次',
                        title: () => {
                            return t("dataTable.listing.parity")
                        },
                        key: "breedingBatch"
                    },
                    {
                        // title: '公猪数量',
                        title: () => {
                            return t("dataTable.listing.numberOfBoars")
                        },
                        key: "farrowingMCount"
                    },
                    {
                        // title: '阉割公猪数',
                        title: () => {
                            return t("dataTable.listing.numberOfCastratedBoars")
                        },
                        key: "castrationMCount"
                    },
                    {
                        // title: '留种公猪数',
                        title: () => {
                            return t("dataTable.listing.numberOfBreedingBoars")
                        },
                        key: "seedRetentionMCount"
                    },
                    {
                        // title: '计划状态',
                        title: () => {
                            return t("dataTable.listing.planStatus")
                        },
                        key: "planStatus",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["planStatus"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "planStatus",
                                row.planStatus
                            )
                        }
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    },
                    {
                        // title: '计划人',
                        title: () => {
                            return t("dataTable.listing.planner")
                        },
                        key: "staffCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        fixed: "right",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "planStatus",
                                                row.planStatus
                                            ) == "已阉割",
                                        onClick: () => {
                                            state.planForm = Object.assign({}, row)
                                            getPigdetil(row.id)
                                            state.showAdd = true
                                        }
                                    },
                                    { default: () => t("button.edit") }
                                )
                            ])
                        }
                    }
                ]
            }
            // tabs切换
            const tabsChange = value => {
                state.search.planStatusList = store.getters["dictionaries/getDictionarieId"](
                    "planStatus",
                    value
                )
                state.search.page = 1
                getPigPlan()
            }
            onMounted(() => {
                tabsChange("待审定")
                // getPigPlan()
                setTableColumns()
            })
            return {
                // tabs切换
                tabsChange,
                ...toRefs(state),
                formRef,
                getPigPlan,
                getVaccineTypes,
                updatePigPlan,
                getFarmName,
                getDormName,
                getVaccineTypeName,
                getVaccineTypesName,
                getDictionarieName,
                clearForm,
                getPigdetil,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    seedRetentionMCount: {
                        required: true,
                        message: t("dataTable.listing.seedNumberMustNotBeEmpty")
                    }
                },
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ]
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            updatePigPlan()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "planStatus") {
                        state.search.planStatusList = options.filters.planStatus
                    }
                    state.search.page = 1
                    getPigPlan()
                },
                // 获取导入数据
                getEximportData(data) {
                    state.ablactationList = [...state.ablactationList, ...data]
                    state.showImport = false
                }
            }
        }
    })
</script>
<style lang=""></style>
