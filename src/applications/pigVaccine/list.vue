<template>
    <div class="p-2">
        <!-- 疫苗接种丨疫苗接种记录-->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">
                        {{
                            $t("dataTable.listing.vaccination") +
                            "丨" +
                            $t("dataTable.listing.vaccinationList")
                        }}
                    </div>
                    <n-space align="center">
                        <!-- 登记、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/pigs-vaccination-upload-template.xlsx"
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
                                    status = undefined
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
                        <div>{{ $t("dataTable.listing.vaccinationList") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigVaccine()
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
                            @keyup.enter="getPigVaccine"
                            @clear="
                                () => {
                                    search.pigCodeLike = ''
                                    getPigVaccine()
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
                :data="pigVaccineList"
                :loading="showloading"
                :scroll-x="1300"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigVaccine"
            ></tableComponents>
        </n-card>

        <!-- 登记疫苗&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
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
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item
                                path="pigCode"
                                :label="$t('dataTable.listing.pigCode')"
                                v-if="status == '疫苗'"
                            >
                                <n-input-group>
                                    <n-input
                                        :style="{ width: '200px' }"
                                        placeholder="请输入种猪编码"
                                        v-model:value="VaccineForm.pigCode"
                                        :disabled="VaccineForm.id ? true : false"
                                    />
                                    <!--母猪编号 -->
                                    <!-- <n-select
                                        v-model:value="VaccineForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    /> -->
                                    <n-button type="primary" @click="pigInfoApiSearch">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>
                            <!-- 接种范围 -->
                            <n-form-item
                                path="morbidityScope"
                                :label="$t('dataTable.listing.scopeOfVaccination')"
                                class="feedback-wrapper-noHeight"
                                v-if="status != '疫苗'"
                            >
                                <n-select
                                    :placeholder="$t('dtables.listing.pleaseSelectA')"
                                    v-model:value="VaccineForm.morbidityScope"
                                    :options="getDictionaries('morbidityScope')"
                                    style="width: 350px"
                                    clearable
                                    :disabled="VaccineForm.pigCodee"
                                />
                            </n-form-item>
                            <!-- 范围详情 -->
                            <n-form-item class="feedback-wrapper-noHeight" v-if="status != '疫苗'">
                                <template #label>
                                    <span>
                                        {{ $t("dtables.listing.theScopeOfTheDetails") }}
                                        <span style="color: #d03050">*</span>
                                    </span>
                                </template>
                                <n-space>
                                    <n-form-item path="nowFarmid">
                                        <n-select
                                            v-model:value="VaccineForm.nowFarmid"
                                            :options="getDictionaries('farmList')"
                                            :placeholder="$t('dtables.listing.pleaseEnterTheArea')"
                                            style="width: 140px"
                                            :disabled="VaccineForm.pigCodee"
                                        />
                                    </n-form-item>
                                    <n-form-item
                                        path="nowDormCode"
                                        v-if="
                                            VaccineForm.morbidityScope &&
                                            getDictionarieName(
                                                'morbidityScope',
                                                VaccineForm.morbidityScope
                                            ) != '全场'
                                        "
                                    >
                                        <n-select
                                            :placeholder="
                                                $t('dtables.listing.pleaseEnterTheBuilding')
                                            "
                                            v-model:value="VaccineForm.nowDormCode"
                                            :options="getDormListForFarmId(VaccineForm.nowFarmid)"
                                            style="width: 120px"
                                        />
                                    </n-form-item>
                                    <n-form-item
                                        path="nowColumnCode"
                                        v-if="
                                            (VaccineForm.morbidityScope &&
                                                getDictionarieName(
                                                    'morbidityScope',
                                                    VaccineForm.morbidityScope
                                                ) == '全栏') ||
                                            getDictionarieName(
                                                'morbidityScope',
                                                VaccineForm.morbidityScope
                                            ) == '单头'
                                        "
                                    >
                                        <n-select
                                            :placeholder="
                                                $t('dataTable.listing.pleaseEnterTheField')
                                            "
                                            v-model:value="VaccineForm.nowColumnCode"
                                            :options="
                                                getColumnListForDormId(VaccineForm.nowDormCode)
                                            "
                                            style="width: 120px"
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item
                                        path="pigCode"
                                        v-if="
                                            VaccineForm.morbidityScope &&
                                            getDictionarieName(
                                                'morbidityScope',
                                                VaccineForm.morbidityScope
                                            ) == '单头'
                                        "
                                    >
                                        <!-- <n-input :style="{ width: '200px' }" placeholder="请输入种猪编码" v-model:value="VaccineForm.pigCode" :disabled="VaccineForm.id?true:false" /> -->
                                        <!-- 母猪编号 -->
                                        <n-select
                                            v-model:value="VaccineForm.pigCode"
                                            :style="{ width: '60%' }"
                                            :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                            clearable
                                            remote
                                            filterable
                                            :options="pigCodeOptions"
                                            :loading="loading"
                                            @search="handleSearch"
                                        />
                                        <n-button type="primary" @click="pigInfoApiSearch">{{
                                            $t("dtables.listing.search")
                                        }}</n-button>
                                    </n-form-item>
                                </n-space>
                            </n-form-item>
                            <!-- 按批次号 -->
                            <n-form-item path="" label="按批次号" v-if="status != '疫苗'">
                                <n-select
                                    v-model:value="VaccineForm.pigCodee"
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                    clearable
                                    remote
                                    filterable
                                    :options="pigCodeOptions"
                                    :loading="loading"
                                    @search="handleSearchBatch"
                                    :disabled="VaccineForm.morbidityScope"
                                >
                                </n-select>
                            </n-form-item>
                            <!-- 疫苗类型 -->
                            <n-form-item
                                path="vaccineCode"
                                :label="$t('dataTable.listing.vaccineCommonType')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="VaccineForm.vaccineCode"
                                    :options="getVaccineTypes()"
                                />
                            </n-form-item>
                            <!-- 疫苗日期 -->
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
                            <!-- 批号 -->
                            <n-form-item
                                path="vaccinationBatch"
                                :label="$t('dataTable.listing.batchNumberr')"
                                disabled=""
                            >
                                <n-input
                                    :style="{ width: '255px' }"
                                    :placeholder="$t('dataTable.listing.pleaseEnterTheBatchNumber')"
                                    v-model:value="VaccineForm.vaccinationBatch"
                                />
                            </n-form-item>
                            <!-- 操作 -->
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
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dataTable.listing.swineInformation')"
                                :pigDetail="pigDetail"
                                :displayOptions="['nowFarmid', 'nowDormCode', 'nowColumnCode']"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <!-- 保存 -->
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <!-- 取消 -->
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
                    getPigVaccine()
                }
            "
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="疫苗接种列表"
            apiUrl="exportPigVaccinationApi"
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
    import { NButton, useMessage, NSpace, NInput } from "naive-ui"
    // deletePigVaccineApi  删除接口
    import { getPigVaccineApi, addPigVaccineApi, updatePigVaccineApi } from "@/api/pigVaccine.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"
    import { addbatchNoApi } from "@/api/pigHealthCare.js"
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
            // const dialog = useDialog()
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
                    pigCodeLike: "",
                    // 下床记录日期开始时间
                    vaccinationDateGte: helper.formatStartTamp(Date.now()),
                    // 下床记录日期结束时间
                    vaccinationDateLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    vaccinationList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                VaccineForm: {
                    pigCode: undefined,
                    vaccinationDate: Date.now(),
                    vaccineCode: undefined,
                    vaccinationBatch: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    morbidityScope: undefined,
                    nowFarmid: undefined,
                    pigCodee: undefined
                },
                VaccineTypes: [],
                pigVaccineList: [],
                pigDetail: {},
                tabSelection: [],
                columns: [],
                // 母猪编码
                pigCodeOptions: [],
                status: ""
            })
            // 发病范围 病情描述 初步诊断
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
            const handleSearchBatch = async query => {
                optionsRef.value = []
                loadingRef.value = true
                await addbatchNoApi({ batchNumber: query }).then(res => {
                    loadingRef.value = false
                    if (res.code == 0) {
                        console.log(res.data)
                        state.pigCodeOptions = res.data
                        state.pigCodeOptions.forEach(item => {
                            return (item.value = item.batchNumber), (item.label = item.batchNumber)
                        })
                    }
                })
            }
            // 获取疫苗接种列表
            const getPigVaccine = async () => {
                state.search.vaccinationDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.vaccinationDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true

                await getPigVaccineApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigVaccineList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存
            const addPigVaccine = async () => {
                let data = JSON.parse(JSON.stringify(state.VaccineForm))
                data.vaccinationDate = helper.format(data.vaccinationDate)
                data.morbidityScope = state.VaccineForm.morbidityScope
                data.farmid = state.VaccineForm.nowFarmid
                data.dormCode = state.VaccineForm.nowDormCode
                data.columnCode = state.VaccineForm.nowColumnCode
                data.pigCode = state.VaccineForm.pigCode
                data.productionBatch = state.VaccineForm.pigCodee
                await addPigVaccineApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigVaccine()
                    }
                })
            }

            //修改
            const updatePigVaccine = async () => {
                let data = JSON.parse(JSON.stringify(state.VaccineForm))
                data.vaccinationDate = helper.format(data.vaccinationDate)
                await updatePigVaccineApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.modifyTheSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigVaccine()
                    }
                })
            }

            // 删除单个查询记录
            // const deletePigVaccine = async row => {
            //     await deletePigVaccineApi({ id: row.id }).then(res => {
            //         if (res.code == 0) {
            //             message.success('删除成功！')
            //             state.search.page = 1
            //             getPigVaccine()
            //         }
            //     })
            // }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.VaccineForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true

                await getPigInfoApi({ searchInfo: state.VaccineForm.pigCode }).then(res => {
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

            const clearForm = () => {
                state.VaccineForm = {
                    pigCode: undefined,
                    vaccinationDate: Date.now(),
                    vaccineCode: undefined,
                    vaccinationBatch: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                }
                state.pigDetail = {}
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
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '打疫苗日期',
                        title: () => {
                            return t("dataTable.listing.vaccinationDate")
                        },
                        key: "vaccinationDate",
                        render(row) {
                            return helper.timestampToTime(row.vaccinationDate)
                        }
                    },
                    {
                        // title: '疫苗类型',
                        title: () => {
                            return t("dataTable.listing.vaccineType")
                        },
                        key: "vaccineCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.vaccineTypeList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getVaccineTypeName"](row.vaccineCode)
                        }
                    },
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
                        // title: '生产批次',
                        title: () => {
                            return t("dataTable.listing.productionBatch")
                        },
                        key: "productionBatch",
                        filter: "default",
                        filterOptionValue: null,
                        renderFilterMenu({ hide }) {
                            return h(
                                "div",
                                {
                                    style: "padding:10px"
                                },
                                {
                                    default: () => [
                                        h(
                                            NInput,
                                            {
                                                value: state.search.productionBatch,
                                                style: "margin-bottom:10px",
                                                onUpdateValue: val => {
                                                    // 搜索条件按照给定的val
                                                    state.search.batchNumber = val || " "
                                                }
                                            },
                                            { default: () => "删除" }
                                        ),
                                        h(
                                            NSpace,
                                            {
                                                justify: "space-around"
                                            },
                                            {
                                                default: () => [
                                                    h(
                                                        NButton,
                                                        {
                                                            style: "",
                                                            size: "tiny",
                                                            onClick: () => {
                                                                state.search.productionBatch = ""
                                                                // 页数到1
                                                                state.search.page = 1
                                                                state.columns.forEach(element => {
                                                                    if (
                                                                        element.key ==
                                                                        "productionBatch"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            undefined
                                                                })
                                                                // 调取列表数据
                                                                getPigVaccine()
                                                                hide()
                                                            }
                                                        },
                                                        //重置
                                                        {
                                                            default: () =>
                                                                t("dataTable.listing.reset")
                                                        }
                                                    ),
                                                    h(
                                                        NButton,
                                                        {
                                                            type: "success",
                                                            size: "tiny",
                                                            fixed: "left",
                                                            onClick: () => {
                                                                // 页数到1
                                                                state.search.page = 1
                                                                state.columns.forEach(element => {
                                                                    if (
                                                                        element.key ==
                                                                        "productionBatch"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            state.search.productionBatch
                                                                })
                                                                // 调取列表数据
                                                                getPigVaccine()
                                                                hide()
                                                            }
                                                        },
                                                        // 确认
                                                        {
                                                            default: () =>
                                                                t("dataTable.listing.confirm")
                                                        }
                                                    )
                                                ]
                                            }
                                        ),
                                        h(NSpace, {})
                                    ]
                                }
                            )
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
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
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
                                        // disabled: helper.dateInDay(row.createDatetime),
                                        onClick: () => {
                                            state.VaccineForm = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                vaccinationDate: new Date(
                                                    row.vaccinationDate
                                                ).getTime(),
                                                vaccineCode: row.vaccineCode,
                                                vaccinationBatch: row.vaccinationBatch,
                                                staffCode:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.staffCode
                                                    ) || store.state.core.userInfo.id
                                            }
                                            pigInfoApiSearch()
                                            state.showAdd = true
                                            state.status = "疫苗"
                                        }
                                    },
                                    { default: () => t("button.edit") }
                                )
                                // h(
                                //     NButton,
                                //     {
                                //         size: 'small',
                                //         type: 'error',
                                //         text: true,
                                //         onClick: () => {
                                //             dialog.warning({
                                //                 title: '警告',
                                //                 content: '确定删除该条数据么？',
                                //                 positiveText: '确定',
                                //                 negativeText: '取消',
                                //                 onPositiveClick: () => {
                                //                     deletePigVaccine(row)
                                //                 }
                                //             })
                                //         }
                                //     },
                                //     { default: () => t('button.delete') }
                                // )
                            ])
                        }
                    }
                ]
            }
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
            onBeforeMount(() => {
                // 获取疫苗类型
                store.dispatch("dictionaries/getVaccineTypeList")
            })
            onMounted(() => {
                getPigVaccine()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigVaccine,
                pigInfoApiSearch,
                // 异步查询(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getVaccineTypes,
                updatePigVaccine,
                getFarmName,
                getDormName,
                getVaccineTypeName,
                getVaccineTypesName,
                getDormListForFarmId,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    // pigCode: {
                    //     required: true,
                    //     message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                    //     trigger: ["blur", "change"]
                    // },
                    vaccineCode: {
                        required: true,
                        message: t("dataTable.listing.typesOfVaccineMustNotBeEmpty"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    vaccinationBatch: {
                        required: true,
                        message: t("dataTable.listing.pleaseEnterTheBatch"),
                        trigger: ["blur", "change"]
                    },
                    vaccinationDate: {
                        required: true,
                        message: t("dataTable.listing.pleaseSelectAVaccinationTime")
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
                            state.VaccineForm.id ? updatePigVaccine() : addPigVaccine()
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
                    if (options.sourceColumn.key == "vaccineCode") {
                        state.search.vaccinationList = options.filters.vaccineCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigVaccine()
                },
                // 获取导入数据
                getEximportData(data) {
                    state.ablactationList = [...state.ablactationList, ...data]
                    state.showImport = false
                },
                getDictionaries,
                getDictionarieName,
                getColumnListForDormId,
                handleSearchBatch
            }
        }
    })
</script>
<style lang=""></style>
