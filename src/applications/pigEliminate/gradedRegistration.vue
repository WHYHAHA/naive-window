<template>
    <div class="p-2">
        <!-- 分级登记-->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.gradedRegistration") }}</div>
                    <n-space align="center">
                        <!-- 登记、导出 -->
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                        <n-button
                            type="info"
                            class="col-2"
                            @click="
                                () => {
                                    showAdd = true
                                    clearForm()
                                }
                            "
                            >{{ $t("dataTable.listing.btnRegistration") }}</n-button
                        >
                    </n-space>
                </n-space>
            </template>
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center" justify="space-between">
                    <n-space align="center">
                        <!-- 分级记录 -->
                        <div>{{ $t("dataTable.listing.gradedRecords") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigGraded()
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
                            v-model:value="search.pigCode"
                            @keyup.enter="getPigGraded"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigGraded()
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
            <tableComponents
                :columns="columns"
                :data="PigGradedList"
                :loading="showloading"
                :scroll-x="1800"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigGraded"
            ></tableComponents>
        </n-card>

        <!-- 分级登记&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.gradedRegistration')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="gradedForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="10 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input :style="{ width: '200px' }" placeholder="请输入种猪编码" v-model:value="gradedForm.pigCode" :disabled="gradedForm.id?true:false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="gradedForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button
                                        type="primary"
                                        @click="
                                            () => {
                                                pigInfoApiSearch()
                                                pigGradedInfo()
                                            }
                                        "
                                        >{{ $t("dtables.listing.search") }}</n-button
                                    >
                                </n-input-group>
                            </n-form-item>
                            <n-form-item
                                path="breedingLevel"
                                :label="$t('dtables.listing.gradingOperation')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="gradedForm.breedingLevel"
                                    :options="getDictionaries('breedingLevel')"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :cardTitle="$t('dataTable.listing.swineInformation')"
                                :loading="showFinding"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'gender'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <!-- <n-spin :show="showFinding">
                                <n-card title="种猪信息：">
                                    <n-space vertical v-if="pigDetail.pigCode">
                                        <n-descriptions label-placement="top" :column="2">
                                            <n-descriptions-item :label-style="labelStyle" label="场区">{{pigDetail.nowFarmid || t('dataTable.listing.notYet')}}</n-descriptions-item>
                                            <n-descriptions-item :label-style="labelStyle" label="栋舍">{{pigDetail.nowDormCode || t('dataTable.listing.notYet')}}</n-descriptions-item>
                                            <n-descriptions-item :label-style="labelStyle" label="栏位">{{pigDetail.nowColumnCode || t('dataTable.listing.notYet')}}</n-descriptions-item>
                                        </n-descriptions>
                                    </n-space>
                                    <n-empty description="请点击左侧搜索，查看详情！" v-else></n-empty>
                                </n-card>
                            </n-spin>-->
                            <n-spin :show="showFinding">
                                <!-- JSON.stringify(pigCDetail) != '{}' -->
                                <n-card :title="$t('dtables.listing.testingInformation')">
                                    <n-space vertical v-if="pigDetail && pigCDetail[21]">
                                        <n-descriptions label-placement="top" :column="2">
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.theComprehensiveScore')"
                                                >{{
                                                    pigCDetail[21] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.nippleScore')"
                                                >{{
                                                    pigCDetail[22] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.bodyScore')"
                                                >{{
                                                    pigCDetail[23] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >

                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.vulvaStressBigScore')"
                                                >{{
                                                    pigCDetail[24] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.legHoofScore')"
                                                >{{
                                                    pigCDetail[25] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.theColourGrading')"
                                                >{{
                                                    pigCDetail[26] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                            <n-descriptions-item
                                                :label-style="labelStyle"
                                                :label="$t('dtables.listing.noseScore')"
                                                >{{
                                                    pigCDetail[27] || t("dataTable.listing.notYet")
                                                }}</n-descriptions-item
                                            >
                                        </n-descriptions>
                                    </n-space>
                                    <n-empty
                                        :description="
                                            $t(
                                                'dataTable.listing.pleaseClickOnTheLeftSideOfTheSearch,CheckTheDetails'
                                            )
                                        "
                                        v-else
                                    ></n-empty>
                                </n-card>
                            </n-spin>
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
            @getlist="
                () => {
                    search.page = 1
                    getPigGraded()
                }
            "
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="疫苗接种列表"
            apiUrl="exportPigGradedRecord"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import {
        defineComponent,
        reactive,
        toRefs,
        onMounted,
        onBeforeMount,
        h,
        ref,
        computed
    } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigGradedRecordPageListApi,
        getPigGradedRecordListListApi,
        addPigGradedRecordListApi,
        updatePigGradedRecordApi
    } from "@/api/pigEliminate.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import eximportComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
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
            pigDetailComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                showAdd: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 评级记录日期开始时间
                    createDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 评级记录日期结束时间
                    createDatetimeLte: helper.formatEndTamp(Date.now()),
                    genderList: [],
                    farmCodeList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    breedingLevelList: [],
                    pigStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                gradedForm: {
                    pigCode: undefined,
                    // vaccinationDate: Date.now(),
                    vaccinbreedingLeveleCode: undefined
                },
                VaccineTypes: [],
                PigGradedList: [],
                pigDetail: {},
                pigCDetail: {},
                tabSelection: [],
                columns: [],
                // 母猪编码
                pigCodeOptions: []
            })

            // 异步加载（模糊后6位）
            const handleSearch = async query => {
                optionsRef.value = []
                if (query.length == 6) {
                    loadingRef.value = true
                    await getfuzzyQuery({ searchInfo: query }).then(res => {
                        loadingRef.value = false
                        if (res.code == 0) {
                            console.log(res.data)
                            state.pigCodeOptions = res.data
                            state.pigCodeOptions.forEach(item => {
                                return (item.value = item.pigCode), (item.label = item.pigCode)
                            })
                        }
                    })
                }
                if (query.length == 15) {
                    state.pigCodeOptions = []
                    state.pigCodeOptions.push({
                        label: query,
                        value: query
                    })
                }
            }

            // 获取评级列表
            const getPigGraded = async () => {
                state.search.createDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.createDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigGradedRecordPageListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.PigGradedList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存
            const addPigVaccine = async () => {
                let data = JSON.parse(JSON.stringify(state.gradedForm))
                // data.vaccinationDate = helper.format(data.vaccinationDate)
                await addPigGradedRecordListApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        getPigGraded()
                    }
                })
            }

            //修改
            const updatePigVaccine = async () => {
                let data = JSON.parse(JSON.stringify(state.gradedForm))
                // data.vaccinationDate = helper.format(data.vaccinationDate)
                await updatePigGradedRecordApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        getPigGraded()
                    }
                })
            }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.gradedForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                if (state.gradedForm.pigCode.length == 6) {
                    await getPigInfoApi({ searchInfo6: state.gradedForm.pigCode }).then(res => {
                        state.showFinding = false
                        if (res.code == 0 && res.data) {
                            if (JSON.stringify(res.data) == "{}") {
                                message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                            }
                            state.pigDetail = res.data
                        } else {
                            message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                            state.pigDetail = {}
                        }
                    })
                } else {
                    await getPigInfoApi({ searchInfo: state.gradedForm.pigCode }).then(res => {
                        state.showFinding = false
                        if (res.code == 0 && res.data) {
                            if (JSON.stringify(res.data) == "{}") {
                                message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                            }
                            state.pigDetail = res.data
                        } else {
                            message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                            state.pigDetail = {}
                        }
                    })
                }
            }

            const pigGradedInfo = async () => {
                if (!state.gradedForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                await getPigGradedRecordListListApi({ pigCode: state.gradedForm.pigCode }).then(
                    res => {
                        state.showFinding = false
                        if (res.code == 0 && res.data) {
                            if (JSON.stringify(res.data) == "{}") {
                                message.error(
                                    t("dtables.listing.theSwineInformationHasNotBeenTested")
                                )
                            }
                            state.pigCDetail = res.data.generalSettings[0]
                        } else {
                            message.error(t("dtables.listing.theSwineInformationHasNotBeenTested"))
                            state.pigCDetail = {}
                        }
                    }
                )
            }

            const clearForm = () => {
                state.gradedForm = {
                    pigCode: undefined,
                    vaccinationDate: Date.now(),
                    breedingLevel: undefined
                }
                state.pigDetail = {}
                state.pigCDetail = {}
            }
            function getVaccineTypesName(id) {
                state.VaccineTypes.forEach(item => {
                    if (item.value == id) {
                        return item.label
                    }
                })
            }

            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
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
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.fileCoding")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "farmCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmCode)
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
                        // title: '性别',
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["gender"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
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
                        // title: '育种等级',
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "breedingLevel",
                        filter: true,
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
                        // title: '当前状态',
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "pigStatus",
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                row.pigStatus
                            )
                        }
                    },
                    {
                        title: () => t("dtables.listing.theComprehensiveScore"),
                        key: "synthesisScore"
                    },
                    {
                        title: () => t("dtables.listing.nippleScore"),
                        key: "papillaScore"
                    },
                    {
                        title: () => t("dtables.listing.bodyScore"),
                        key: "limbsScore"
                    },
                    {
                        title: () => t("dtables.listing.vulvaStressBigScore"),
                        key: "vulvaStressBigBellyScore"
                    },
                    {
                        title: () => t("dtables.listing.legHoofScore"),
                        key: "legScore"
                    },
                    {
                        title: () => t("dtables.listing.theColourGrading"),
                        key: "coatColorScore"
                    },
                    {
                        title: () => t("dtables.listing.noseScore"),
                        key: "noseScore"
                    },
                    {
                        title: () => t("dtables.listing.theOverallScore"),
                        key: "overallScore"
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid",
                        // filter: true,
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
                                        // disabled: helper.dateInDay(row.createDatetime),
                                        onClick: () => {
                                            state.gradedForm = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                breedingLevel: row.breedingLevel
                                            }
                                            pigInfoApiSearch()
                                            pigGradedInfo()
                                            state.showAdd = true
                                        }
                                    },
                                    { default: () => t("dataTable.listing.btnRegistration") }
                                )
                            ])
                        }
                    }
                ]
            }
            onBeforeMount(() => {
                // 获取疫苗类型
                store.dispatch("dictionaries/getVaccineTypeList")
            })
            onMounted(() => {
                getPigGraded()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigGraded,
                // 模糊搜索(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                pigInfoApiSearch,
                pigGradedInfo,
                getDictionaries,
                updatePigVaccine,
                getFarmName,
                getDormName,
                getDictionarieName,
                getVaccineTypeName,
                getVaccineTypesName,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    breedingLevel: {
                        required: true,
                        message: t("form.rules.gradingOperationMustNotBeEmpty"),
                        trigger: ["blur", "change"]
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
                // updatePigVaccine
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.gradedForm.id ? addPigVaccine() : addPigVaccine()
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
                    if (options.sourceColumn.key == "farmCode") {
                        state.search.farmCodeList = options.filters.farmCode
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "gender") {
                        state.search.genderList = options.filters.gender
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    state.search.page = 1
                    getPigGraded()
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
