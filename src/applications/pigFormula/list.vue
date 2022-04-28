<template>
    <div class="p-2">
        <!-- 代奶登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.formulaRegistration") }}</div>
                    <n-space align="center">
                        <!-- 登记、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-formula-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.import")
                        }}</n-button>
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
                        <!-- 仔猪代奶清单 -->
                        <div>{{ $t("dataTable.listing.formulaListOfPiglets") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigFormulaList()
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
                            @keyup.enter="getPigFormulaList"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigFormulaList()
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
                :data="formulaList"
                :loading="showloading"
                :scroll-x="1800"
                :clickIndex="leftClickIndex"
                v-model:search="search"
                @update:filters="handleFiltersChange"
                @update:search="getPigFormulaList"
            ></tableComponents>
        </n-card>

        <!-- 登记断奶&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.pigletsGenerationMilkRegistration')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="formulaForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item
                                path="pigCode"
                                :label="$t('dataTable.listing.sowTheIndividual')"
                            >
                                <n-input-group>
                                    <!-- <n-input v-model:value="formulaForm.pigCode" :disabled="formulaForm.id?true:false" :placeholder="$t('dtables.listing.pleaseEnterThe')" /> -->
                                    <!-- 母猪个体号 -->
                                    <n-select
                                        v-model:value="formulaForm.pigCode"
                                        :style="{ width: '70%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="getPigMotherDetail">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>
                            <!-- 仔猪重量 -->
                            <n-form-item path="bwt" :label="$t('dataTable.listing.pigletsWeight')">
                                <n-input-number
                                    v-model:value="formulaForm.bwt"
                                    :min="1"
                                    :max="99"
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                    :style="{ width: '90%' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>
                            <!-- 
                            <n-form-item path="childPigCode" label="仔猪：">
                                <n-input-group>
                                    <n-input v-model:value="formulaForm.childPigCode" :disabled="formulaForm.id?true:false" />
                                    <n-button type="primary" @click="getPigChildDetail">搜索</n-button>
                                </n-input-group>
                            </n-form-item>-->
                            <!-- 代奶日期 -->
                            <n-form-item
                                path="milkDate"
                                :label="$t('dataTable.listing.formulaDate')"
                            >
                                <n-date-picker
                                    v-model:value="formulaForm.milkDate"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                    :style="{ width: '90%' }"
                                />
                            </n-form-item>

                            <n-form-item class="feedback-wrapper-noHeight">
                                <template #label>
                                    <span>
                                        {{ $t("dataTable.listing.fieldInformation") }}
                                        <span style="color: #d03050">*</span>
                                    </span>
                                </template>
                                <n-space>
                                    <n-form-item path="inFarmid">
                                        <n-select
                                            v-model:value="formulaForm.farmid"
                                            :options="getDictionaries('farmList')"
                                            @change="farmChange"
                                            style="width: 255px"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectACourt')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inDormCode">
                                        <n-select
                                            v-model:value="formulaForm.dormCode"
                                            :options="getDormListForFarmId(formulaForm.farmid)"
                                            style="width: 120px"
                                            @update:value="formulaForm.columnCode = null"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectABuilding')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inColumnCode">
                                        <n-select
                                            v-model:value="formulaForm.columnCode"
                                            :options="getColumnListForDormId(formulaForm.dormCode)"
                                            style="width: 120px"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseEnterTheField')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                </n-space>
                            </n-form-item>

                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="formulaForm.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="detailTitle"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'pigBornDate'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button @click="showAdd = false">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigOutOfBedApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigFormulaList()
                }
            "
        ></importComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="代奶登记"
            apiUrl="exportPigSpFarmweanApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { useMessage } from "naive-ui"
    import {
        getPigFormulaListApi,
        addPigFormulaApi,
        updatePigFormulaApi
    } from "@/api/pigFormula.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"

    import importComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import { useStore } from "vuex"

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            importComponents,
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
                showExport: false,
                showImport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 代奶记录日期开始时间
                    milkDateGte: helper.formatStartTamp(Date.now()),
                    // 代奶记录日期结束时间
                    milkDateLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                detailTitle: "",
                formulaForm: {
                    pigCode: undefined,
                    childPigCode: undefined,
                    milkDate: Date.now(),
                    columnCode: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                },
                formulaList: [],
                pigDetail: {},
                tabSelection: [],
                columns: [],
                // 母猪编码
                pigCodeOptions: []
            })

            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            const getDormListForFarmId = computed(() => {
                return function (farmId) {
                    return store.getters["dictionaries/getDormListForFarmId"](farmId)
                }
            })
            const getColumnListForDormId = computed(() => {
                return function (dormId) {
                    return store.getters["dictionaries/getColumnListForDormId"](dormId)
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
            // 获取断奶列表
            const getPigFormulaList = async () => {
                state.search.milkDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.milkDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigFormulaListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.formulaList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存
            const addPigFormula = async () => {
                let data = JSON.parse(JSON.stringify(state.formulaForm))
                data.milkDate = helper.format(data.milkDate)
                await addPigFormulaApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigFormulaList()
                    }
                })
            }

            //修改
            const updatePigFormula = async () => {
                let data = JSON.parse(JSON.stringify(state.formulaForm))
                data.weaningDate = helper.format(data.milkDate)
                await updatePigFormulaApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.modifyTheSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigFormulaList()
                    }
                })
            }

            // 查询单个母猪种猪详情
            const getPigMotherDetail = async () => {
                if (!state.formulaForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSowEncoding"))
                    return false
                }
                state.detailTitle = "猪只信息："
                state.showFinding = true
                await getPigInfoApi({ searchInfo: state.formulaForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }
            // 查询单个仔猪种猪详情
            const getPigChildDetail = async () => {
                if (!state.formulaForm.childPigCode) {
                    message.error(t("dtables.listing.pleaseEnterThePigletEncoding"))
                    return false
                }
                state.detailTitle = "仔猪信息："
                state.showFinding = true
                await getPigInfoApi({ searchInfo: state.formulaForm.childPigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }

            const clearForm = () => {
                state.formulaForm = {
                    pigCode: undefined,
                    childPigCode: undefined,
                    milkDate: Date.now(),
                    columnCode: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                }
                state.pigDetail = {}
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '登记日期',
                        title: () => {
                            return t("dataTable.listing.dateOfRegistration")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        }
                    },
                    {
                        // title: '母猪个体号',
                        title: () => {
                            return t("dataTable.listing.sowTheIndividual")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '配种批号',
                        title: () => {
                            return t("dataTable.listing.breedingBatchNumber")
                        },
                        key: "batchNumber"
                    },
                    {
                        // title: '个体号',
                        title: () => {
                            return t("dataTable.listing.theIndividual")
                        },
                        key: "childPigCode"
                    },
                    {
                        // title: '出生批号',
                        title: () => {
                            return t("dataTable.listing.batchNumberOfBirth")
                        },
                        key: "productionBatch"
                    },
                    {
                        // title: '代奶日期',
                        title: () => {
                            return t("dataTable.listing.formulaDate")
                        },
                        key: "milkDate",
                        render(row) {
                            return helper.timestampToTime(row.milkDate)
                        }
                    },
                    {
                        // title: '猪场',
                        title: () => {
                            return t("dataTable.listing.pig")
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
                        // title: '猪舍',
                        title: () => {
                            return t("dataTable.listing.piggery")
                        },
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.nowDormCode)
                        }
                    },
                    {
                        // title: '栏',
                        title: () => {
                            return t("dataTable.listing.columnn")
                        },
                        key: "nowColumnCode"
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid"
                    },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "staffCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    }
                    // {
                    //     title: '操作',
                    //     key: 'actions',
                    //     fixed: 'right',
                    //     render(row) {
                    //         return h(
                    //             NButton,
                    //             {
                    //                 size: 'small',
                    //                 type: 'info',
                    //                 text: true,
                    //                 disabled: helper.dateInDay(row.createDatetime),
                    //                 onClick: () => {
                    //                     state.formulaForm = {
                    //                         id: row.id,
                    //                         pigCode: row.pigCode,
                    //                         childPigCode: row.pigCode,
                    //                         milkDate: new Date(row.milkDate).getTime(),
                    //                         farmid: row.farmid,
                    //                         dormCode: row.dormCode,
                    //                         columnCode: row.columnCode,
                    //                         staffCode: store.getters['dictionaries/getUserId'](row.staffCode) || row.staffCode
                    //                     }
                    //                     state.showAdd = true
                    //                 }
                    //             },
                    //             { default: () => '编辑' }
                    //         )
                    //     }
                    // }
                ]
            }
            onMounted(() => {
                getPigFormulaList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigFormulaList,
                getPigMotherDetail,
                getPigChildDetail,
                // 模糊查询(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getDictionaries,
                getFarmName,
                getDormName,
                getDormListForFarmId,
                getColumnListForDormId,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["blur", "change"]
                    },
                    childPigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheNumberPiglets"),
                        trigger: ["blur", "change"]
                    },
                    farmid: {
                        required: true,
                        message: t("form.rules.pleaseSelectACourt"),
                        trigger: ["blur", "change"]
                    },
                    dormCode: {
                        required: true,
                        message: t("form.rules.pleaseSelectABuilding"),
                        trigger: ["blur", "change"]
                    },
                    columnCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterThePiglets"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    milkDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectADateOfGenerationOfMilk")
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
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.formulaForm.id ? updatePigFormula() : addPigFormula()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                farmChange() {
                    state.formulaForm.dormCode = null
                    state.formulaForm.columnCode = null
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigFormulaList()
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>
