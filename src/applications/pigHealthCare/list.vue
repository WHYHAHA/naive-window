<template>
    <div class="pigHealthCare p-2">
        <!-- 群体保健 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">
                        {{
                            $t("dataTable.listing.pigHealthCare") +
                            "丨" +
                            $t("dataTable.listing.groupHealthCare")
                        }}
                    </div>
                    <n-space align="center">
                        <!-- 登记 -->
                        <n-button class="col-2" type="info" @click="showAdd = true">{{
                            $t("dataTable.listing.btnRegistration")
                        }}</n-button>

                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                    </n-space>
                </n-space>
            </template>

            <n-grid x-gap="12" cols="10" item-responsive>
                <n-gi span="6 400:6 600:6 800:6">
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space justify="space-between">
                            <n-space align="center">
                                <div>{{ $t("dataTable.listing.groupHealthRecords") }}:</div>
                                <n-date-picker
                                    v-model:value="timeList"
                                    type="daterange"
                                    :shortcuts="rangeShortcuts"
                                    :is-date-disabled="disablePreviousDate"
                                    @update:value="
                                        () => {
                                            search.page = 1
                                            getPigHealthCareList()
                                        }
                                    "
                                    actions="['confirm']"
                                />
                            </n-space>
                        </n-space>
                    </div>
                    <tableComponents
                        size="small"
                        :columns="columns"
                        :data="pigHealthCareList"
                        :loading="showloading"
                        :scroll-x="1000"
                        :clickIndex="leftClickIndex"
                        v-model:search="search"
                        @update:filters="handleFiltersChange"
                        @update:search="getPigHealthCareList"
                    ></tableComponents>
                </n-gi>
                <!-- 右侧 -->
                <n-gi span="4 400:4 600:4 800:4">
                    <n-card content-style="padding: 0;">
                        <div class="p-2 tabHeader">
                            <n-space align="center">
                                <!-- 用药记录，登记用药，一键全改 -->
                                <div class="font-16 font-weight-bolder">
                                    {{ $t("dataTable.listing.medicationRecord") }}:
                                </div>
                                <n-button
                                    type="info"
                                    v-if="leftClickRow.id"
                                    @click="showAddMedicine = true"
                                    >{{ $t("dataTable.listing.registeredMedication") }}</n-button
                                >
                                <n-button
                                    type="info"
                                    v-if="leftClickIndex >= 0"
                                    @click="showUpdateAll = true"
                                    >{{ $t("dataTable.listing.allChange") }}</n-button
                                >
                            </n-space>
                        </div>

                        <n-space vertical v-if="useMedicineList.length > 0">
                            <n-data-table
                                size="small"
                                :columns="medicineColumns"
                                :data="useMedicineList"
                                :row-class-name="rightRowClassName"
                            />
                            <n-space justify="end" style="padding-bottom: 5px">
                                <n-pagination
                                    v-model:page="rightSearch.page"
                                    v-model:pageSize="rightSearch.limit"
                                    :item-count="rightSearch.total"
                                    show-size-picker
                                    :page-sizes="[10, 20, 30, 40]"
                                    show-quick-jumper
                                    :page-slot="4"
                                    @update:page="getPigHealthCareDetail()"
                                    @update:pageSize="getPigHealthCareDetail()"
                                >
                                    <template #prefix="{ itemCount }">
                                        {{ $t("dataTable.listing.altogether") }} {{ itemCount }}
                                        {{ $t("dtables.listing.project") }}
                                    </template>
                                </n-pagination>
                            </n-space>
                        </n-space>
                        <n-empty
                            v-else
                            :description="
                                $t('dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor')
                            "
                            class="mt-3"
                        ></n-empty>
                    </n-card>
                </n-gi>
            </n-grid>
        </n-card>

        <!-- 登记保健 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.communityHealthRegistration')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="form"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <!-- 保健范围 -->
                <n-form-item path="healthcareScope" :label="$t('dataTable.listing.careRange')">
                    <n-select
                        :disabled="form.pigCode"
                        v-model:value="form.healthcareScope"
                        :options="getDictionaries('healthcareScope')"
                        clearable
                    />
                </n-form-item>
                <!-- 范围详情 -->
                <n-form-item class="feedback-wrapper-noHeight">
                    <template #label>
                        <span>
                            {{ $t("dtables.listing.theScopeOfTheDetails") }}
                            <!-- <span style="color: #d03050">*</span> -->
                        </span>
                    </template>
                    <n-space>
                        <n-form-item path="farmid">
                            <n-select
                                :disabled="form.pigCode"
                                v-model:value="form.farmid"
                                :options="getDictionaries('farmList')"
                                :placeholder="$t('dtables.listing.pleaseEnterTheArea')"
                                style="width: 150px"
                                @update:value="farmChange"
                            />
                        </n-form-item>
                        <n-form-item
                            path="dormCode"
                            v-if="
                                form.healthcareScope &&
                                getDictionarieName('healthcareScope', form.healthcareScope) !=
                                    '全场'
                            "
                        >
                            <n-select
                                v-model:value="form.dormCode"
                                :options="getDormListForFarmId(form.farmid)"
                                style="width: 150px"
                                @update:value="form.columnCode = null"
                                :placeholder="$t('dataTable.listing.pleaseSelectABuilding')"
                                filterable
                            />
                        </n-form-item>
                        <n-form-item
                            path="columnCode"
                            v-if="
                                form.healthcareScope &&
                                getDictionarieName('healthcareScope', form.healthcareScope) ==
                                    '全栏'
                            "
                        >
                            <n-select
                                v-model:value="form.columnCode"
                                :options="getColumnListForDormId(form.dormCode)"
                                style="width: 120px"
                                :placeholder="$t('dataTable.listing.pleaseEnterTheField')"
                                filterable
                            />
                        </n-form-item>
                    </n-space>
                </n-form-item>
                <!-- 按批次号 -->
                <n-form-item path="" label="按批次号">
                    <n-select
                        v-model:value="form.pigCode"
                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                        clearable
                        remote
                        filterable
                        :options="pigCodeOptions"
                        :loading="loading"
                        @search="handleSearch"
                        :disabled="form.healthcareScope"
                    >
                    </n-select>
                </n-form-item>
                <!-- 免疫类型 -->
                <n-form-item path="immuneType" :label="$t('dataTable.listing.immuneType')">
                    <n-select
                        v-model:value="form.immuneType"
                        :options="getDictionaries('immuneType')"
                    />
                </n-form-item>

                <!-- 保健目的/用药 -->
                <n-form-item class="feedback-wrapper-noHeight">
                    <template #label>
                        <span>
                            {{ $t("dataTable.listing.healthCarePurpose/drugUse") }}
                            <span style="color: #d03050">*</span>
                        </span>
                    </template>
                    <n-space>
                        <n-form-item path="healthcareGoal">
                            <n-select
                                v-model:value="form.healthcareGoal"
                                :options="symptomList"
                                style="width: 200px"
                                @update:value="getDrugsListOptions"
                            />
                        </n-form-item>
                        <n-form-item path="healthcareMedication" v-if="drugsList.length > 0">
                            <n-select
                                v-model:value="form.healthcareMedication"
                                :options="drugsList"
                                style="width: 200px"
                            />
                        </n-form-item>
                    </n-space>
                </n-form-item>
                <!-- 保健日期 -->
                <n-form-item path="healthcareDate" :label="$t('dataTable.listing.healthCareDate')">
                    <n-date-picker
                        v-model:value="form.healthcareDate"
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

                <n-space justify="center">
                    <!-- 确定 -->
                    <n-button type="info" @click="handleValidateClick">
                        {{ $t("dataTable.listing.confirm") }}
                    </n-button>
                    <!-- 取消 -->
                    <n-button @click="showAdd = false">{{ $t("dtables.listing.cancel") }}</n-button>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 登记用药 -->
        <n-modal
            class="custom-card"
            v-model:show="showAddMedicine"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.registeredMedication')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeMedicineForm()"
        >
            <n-form
                :model="medicineForm"
                ref="medicineFormRef"
                :rules="medicineRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="6 400:6 600:6 800:6">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <n-input
                                        v-model:value="medicineForm.pigCode"
                                        :disabled="medicineForm.id ? true : false"
                                    />
                                    <n-button type="primary" @click="getPigDetail">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item
                                path="medicationNumber"
                                :label="$t('dataTable.listing.dosage')"
                            >
                                <n-input-number
                                    v-model:value="medicineForm.medicationNumber"
                                    min="1"
                                    max="9999"
                                />
                            </n-form-item>

                            <n-form-item
                                path="operatorid"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    v-model:value="medicineForm.operatorid"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-card :title="$t('dataTable.listing.swineInformation')">
                                <n-space vertical v-if="pigDetail.pigCode">
                                    <n-text depth="3">
                                        {{ $t("dataTable.listing.Farm") }}：{{
                                            getFarmName(pigDetail.nowFarmid) ||
                                            $t("dataTable.listing.notYet")
                                        }}
                                    </n-text>
                                    <n-text depth="3">
                                        {{ $t("dataTable.listing.Dorm") }}：{{
                                            getDormName(pigDetail.nowDormCode) ||
                                            $t("dataTable.listing.notYet")
                                        }}
                                    </n-text>
                                    <n-text depth="3">
                                        {{ $t("dataTable.listing.column") }}：{{
                                            pigDetail.nowColumnCode ||
                                            $t("dataTable.listing.notYet")
                                        }}
                                    </n-text>
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
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClickMedicine">{{
                            $t("dataTable.listing.confirm")
                        }}</n-button>
                        <n-button @click="showAddMedicine = false">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 种猪保健导出 -->
        <!-- ...search, -->
        <exportComponents
            fileName="群体保健记录"
            apiUrl="exportPigGroupHealthcareApi"
            :search="calcSearchData"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 一键全改 -->
        <n-modal
            class="custom-card"
            v-model:show="showUpdateAll"
            preset="card"
            :style="{ width: '500px' }"
            :title="$t('dataTable.listing.registeredMedication')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeUpdateAllForm()"
        >
            <n-form
                :model="updateAllForm"
                ref="updateAllFormRef"
                :rules="medicineRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-form-item path="medicationNumber" :label="$t('dataTable.listing.dosage')">
                        <n-input-number
                            v-model:value="updateAllForm.medicationNumber"
                            min="1"
                            max="9999"
                        />
                    </n-form-item>

                    <n-form-item
                        path="operatorid"
                        :label="$t('dataTable.listing.operatingPersonnel')"
                    >
                        <n-select
                            v-model:value="updateAllForm.operatorid"
                            :options="userList"
                            filterable
                            :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                        />
                    </n-form-item>

                    <n-space justify="center">
                        <!-- 确定 -->
                        <n-button type="info" @click="handleValidateClickUpdateAll">
                            {{ $t("dataTable.listing.confirm") }}
                        </n-button>
                        <!-- 取消 -->
                        <n-button @click="showUpdateAll = false">
                            {{ $t("dtables.listing.cancel") }}
                        </n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
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
    import { NButton, useMessage, NSpace, useDialog, NInput } from "naive-ui"
    import {
        getPigHealthCareListApi,
        getPigHealthCareDetailApi,
        addPigHealthCareApi,
        addMedicineApi,
        deleteMedicineApi,
        updateMedicineApi,
        updateAllMedicationApi,
        getHealthCarePurposeListApi,
        getHealthCareSettingsByPurposeIdApi,
        addbatchNoApi
    } from "@/api/pigHealthCare.js"

    import exportComponents from "@/components/exExport.vue"

    import { getPigInfoApi } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "pigHealthCare",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            exportComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const { t } = useI18n()
            const medicineFormRef = ref(null)
            const updateAllFormRef = ref(null)
            let loadingReactive = null
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                showExport: false,
                showAdd: false,
                showAddMedicine: false,
                showloading: false,
                showUpdateAll: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    // 开始时间
                    healthcareDateGte: helper.formatStartTamp(Date.now()),
                    // 结束时间
                    healthcareDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    healthcareScopeList: [],
                    healthcareGoalList: [],
                    page: 1,
                    limit: 10,
                    total: undefined,
                    immunetype: ""
                },
                rightSearch: {
                    groupHealthcareId: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                medicineColumns: [],
                dormList: [],
                // 登记保健form
                form: {
                    // 保健登记日期
                    healthcareDate: Date.now(),
                    // 保健范围
                    healthcareScope: undefined,
                    // 场区 必填
                    farmid: undefined,
                    dormCode: undefined,
                    columnCode: undefined,
                    // 保健范围：1=预防流感，2=保胎
                    healthcareGoal: undefined,
                    // 保健用药:1=金银解读散感,BWW=>2=霸王丸
                    healthcareMedication: undefined,
                    immunetype: undefined,
                    pigCode: undefined
                },
                // 登记用药form
                medicineForm: {
                    groupHealthcareId: "",
                    pigCode: undefined,
                    medicationNumber: 1,
                    operatorid: undefined
                },
                // 一键全改form
                updateAllForm: {
                    groupHealthcareId: "",
                    medicationNumber: 1,
                    operatorid: undefined
                },
                pigHealthCareList: [],
                useMedicineList: [],
                pigDetail: {},

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {},

                rightClickIndex: -1,
                rightClickId: undefined,
                rightClickRow: {},

                drugsList: [],
                symptomList: [],
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

            // 异步加载（模糊后6位）
            const handleSearch = async query => {
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
            // 获取字典 目的
            const getSymptomsOptions = async () => {
                await getHealthCarePurposeListApi().then(res => {
                    if (res.code == 0) {
                        state.symptomList = []
                        res.data.forEach(item => {
                            state.symptomList.push({
                                label: item.healthCarePurposeName,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 根据id获取目的名称
            const getDrugsName = computed(() => {
                return function (id) {
                    let name = ""
                    state.symptomList &&
                        state.symptomList.forEach(item => {
                            if (id == item.id) {
                                name = item.label
                            }
                        })
                    return name
                }
            })

            // 导出的数据
            const calcSearchData = computed(() => {
                let originData = JSON.parse(JSON.stringify(state.search))
                delete originData.healthcareDateGte
                delete originData.healthcareDateLte
                return {
                    ...originData,
                    groupHealthtimeGte: state.search.healthcareDateGte,
                    groupHealthtimeLte: state.search.healthcareDateLte
                }
            })

            // 根据目的获取药品
            const getDrugsListOptions = async () => {
                await getHealthCareSettingsByPurposeIdApi({
                    purposeId: state.form.healthcareGoal
                }).then(res => {
                    if (res.code == 0) {
                        state.drugsList = []
                        res.data.forEach(item => {
                            state.drugsList.push({
                                label: item.nameOfHealthProducts,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 获取保健列表
            const getPigHealthCareList = async () => {
                state.search.healthcareDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.healthcareDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigHealthCareListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigHealthCareList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取用药详情
            const getPigHealthCareDetail = async () => {
                await getPigHealthCareDetailApi(state.rightSearch).then(res => {
                    if (res.code == 0) {
                        state.useMedicineList = res.data.list
                        state.rightSearch.page = res.data.pageNo
                        state.rightSearch.limit = res.data.pageSize
                        state.rightSearch.total = res.data.total
                    }
                })
            }

            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.medicineForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                await getPigInfoApi({ searchInfo: state.medicineForm.pigCode }).then(res => {
                    if (res.code == 0) {
                        if (JSON.stringify(res.data) == "{}") {
                            message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                        }
                        state.pigDetail = res.data
                    }
                })
            }
            // 创建群体保健记录
            const addPigHealthCare = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(
                        t("dataTable.listing.isCreatingHealthCareRecords"),
                        {
                            duration: 0
                        }
                    )
                }
                // 添加对应保健id
                let fromData = JSON.parse(JSON.stringify(state.form))
                fromData.healthcareDate = helper.format(fromData.healthcareDate)
                fromData.batchNumber = state.form.pigCode
                await addPigHealthCareApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.addHealthRecordOfSuccess"))
                        state.search.page = 1
                        getPigHealthCareList()

                        state.showAdd = false
                        closeFrom()
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            // 添加用药记录
            const addMedicine = async () => {
                // 添加对应保健id
                state.medicineForm.groupHealthcareId = state.leftClickRow.id
                await addMedicineApi(state.medicineForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.addHealthRecordOfSuccess"))
                        state.rightSearch.page = 1
                        getPigHealthCareDetail()

                        state.showAddMedicine = false
                        closeMedicineFrom()
                    }
                })
            }

            // 删除用药记录
            const deleteMedicine = async row => {
                await deleteMedicineApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.deleteTheSuccess"))
                        state.rightClickIndex = -1
                        state.rightClickRow = {}
                        state.rightSearch.page = 1
                        getPigHealthCareDetail()
                    }
                })
            }
            // 编辑用药记录
            const updateMedicine = async () => {
                await updateMedicineApi(state.medicineForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.modifyTheSuccess"))
                        state.rightSearch.page = 1
                        getPigHealthCareDetail()

                        state.showAddMedicine = false
                        closeMedicineFrom()
                    }
                })
            }
            // 一键全改
            const updateMedicineAll = async () => {
                state.updateAllForm.groupHealthcareId = state.leftClickId
                await updateAllMedicationApi(state.updateAllForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.modifyTheSuccess"))
                        state.rightSearch.page = 1
                        getPigHealthCareDetail()

                        state.showUpdateAll = false
                        closeMedicineFrom()
                    }
                })
            }
            const closeMedicineFrom = () => {
                state.medicineForm = {
                    groupHealthcareId: "",
                    pigCode: undefined,
                    medicationNumber: 1,
                    operatorid: undefined
                }
            }

            const closeFrom = () => {
                if (loadingReactive) {
                    loadingReactive.destroy()
                    loadingReactive = null
                }
                state.form = {
                    // 保健登记日期
                    healthcareDate: Date.now(),
                    // 保健范围
                    healthcareScope: undefined,
                    // 场区 必填
                    farmid: undefined,
                    dormCode: undefined,
                    columnCode: undefined,
                    // 保健范围：1=预防流感，2=保胎
                    healthcareGoal: undefined,
                    // 保健用药:1=金银解读散感,BWW=>2=霸王丸
                    healthcareMedication: undefined
                }
            }
            const closeMedicineForm = () => {
                state.medicineForm = {
                    groupHealthcareId: "",
                    pigCode: undefined,
                    medicationNumber: 1,
                    operatorid: undefined
                }
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '保健日期',
                        title: () => {
                            return t("dataTable.listing.healthCareDate")
                        },
                        render(row) {
                            return helper.timestampToTime(row.healthcareDate)
                        }
                    },
                    {
                        // title: '保健范围',
                        title: () => {
                            return t("dataTable.listing.careRange")
                        },
                        key: "healthcareScope",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["healthcareScope"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "healthcareScope",
                                row.healthcareScope
                            )
                        }
                    },
                    {
                        // title: '保健目的',
                        title: () => {
                            return t("dataTable.listing.healthCarePurpose")
                        },
                        key: "healthcareGoal",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["healthCarePurposeList"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "healthCarePurposeList",
                                row.healthcareGoal
                            )
                        }
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
                        // title: '生产批次',
                        title: () => {
                            return t("dataTable.listing.productionBatch")
                        },
                        key: "batchNumber",
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
                                                    // state.search.batchNumber = val || " "
                                                    state.search.productionBatch = val
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
                                                                state.search.batchNumber = ""
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
                                                                getPigHealthCareList()
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
                                                                getPigHealthCareList()
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
                        // title: '保健用药',
                        title: () => {
                            return t("dataTable.listing.healthMedication")
                        },
                        key: "healthcareMedication",
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["healthcareMedication"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "healthCareSettingsList",
                                row.healthcareMedication
                            )
                        }
                    },
                    {
                        // title: '免疫类型',
                        title: "免疫类型",
                        key: "immuneType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["immuneType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "immuneType",
                                row.immuneType
                            )
                        }
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid"
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        fixed: "right",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickRow = row
                                            state.leftClickId = row.id
                                            state.rightSearch.groupHealthcareId = row.id
                                            getPigHealthCareDetail()
                                        }
                                    },
                                    { default: () => t("dataTable.listing.viewDetails") }
                                )
                            ])
                        }
                    }
                ]
            }
            const setMedicineColumns = () => {
                state.medicineColumns = [
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.pigCode")
                        },
                        key: "pigCode"
                    },

                    {
                        // title: '用药量',
                        title: () => {
                            return t("dataTable.listing.dosage")
                        },
                        key: "medicationNumber"
                    },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "operatorid"
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.rightClickIndex = index
                                            state.rightClickRow = row
                                            state.medicineForm = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                medicationNumber: row.medicationNumber,
                                                operatorid:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.operatorid
                                                    ) || row.operatorid
                                            }
                                            state.showAddMedicine = true
                                        }
                                    },
                                    { default: () => t("dataTable.listing.btnRegistration") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: true,
                                        disabled: row.medicationNumber,
                                        onClick: () => {
                                            state.rightClickIndex = index
                                            state.rightClickRow = row
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t(
                                                    "dataTable.listing.sureToDeleteThisData"
                                                ),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    deleteMedicine(row)
                                                }
                                            })
                                        }
                                    },
                                    { default: () => t("button.delete") }
                                )
                            ])
                        }
                    }
                ]
            }

            onBeforeMount(() => {
                // 获取保健目的
                store.dispatch("dictionaries/getPigSymptomsList", 1)
                // 获取全部药品
                store.dispatch("dictionaries/getPigDrugsList", "")
            })
            onMounted(() => {
                getPigHealthCareList()
                getSymptomsOptions()
                //设置列表
                setTableColumns()
                setMedicineColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                medicineFormRef,
                updateAllFormRef,
                getPigHealthCareList,
                getPigHealthCareDetail,
                getPigDetail,
                getDictionaries,
                getDictionarieName,
                getDormListForFarmId,
                getColumnListForDormId,
                getFarmName,
                getDormName,
                getSymptomsOptions,
                getDrugsListOptions,
                calcSearchData,
                closeMedicineForm,
                getDrugsName,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                // 保健登记规则
                rules: {
                    // healthcareScope: {
                    //     required: true,
                    //     message: t("form.rules.pleaseSelectARangeOfHealthCare"),
                    //     trigger: ["input", "blur"]
                    // },
                    // immuneType: {
                    //     required: true,
                    //     message: t("form.rules.pleaseSelectATypeOfImmune"),
                    //     trigger: ["input", "blur"]
                    // },
                    // farmid: {
                    //     required: true,
                    //     message: t("form.rules.listing.pleaseSelectACourt"),
                    //     trigger: ["input", "blur"]
                    // },
                    dormCode: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("form.rules.pleaseSelectABuilding")
                    },
                    columnCode: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("dataTable.listing.pleaseEnterTheField")
                    },
                    healthcareGoal: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("form.rules.pleaseSelectAHealthCarePurposes")
                    },
                    healthcareMedication: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("form.rules.pleaseSelectAHealthCareMedicine")
                    },
                    healthcareDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectACheckDate")
                    }
                },
                // 用药登记规则
                medicineRules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheSwineEncoding"),
                        trigger: ["input", "blur"]
                    },
                    medicationNumber: {
                        required: true,
                        message: t("form.rules.pleaseAddTheDosage")
                    },
                    operatorid: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("form.rules.pleaseEnterTheOperation")
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

                // 根据保健目的获取对应用药
                findDrugsListOptions() {
                    state.form.healthcareMedication = ""
                    let data = {
                        symptomsType: 1,
                        id: state.form.healthcareGoal
                    }
                    // 获取保健目的
                    store.dispatch("dictionaries/getPigDrugsList", data)
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "healthcareScope") {
                        state.search.healthcareScopeList = options.filters.healthcareScope
                    }
                    if (options.sourceColumn.key == "healthcareGoal") {
                        state.search.healthcareGoalList = options.filters.healthcareGoal
                    }
                    if (options.sourceColumn.key == "immuneType") {
                        state.search.immuneTypeList = options.filters.immuneType
                    }
                    state.search.page = 1
                    getPigHealthCareList()
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                // 清空右侧信息
                cleanPigOptionalDetail() {
                    state.pigOptionalDetail = {
                        theSow: [{}],
                        theMaleMain: [{}],
                        alternativeBoar: [{}]
                    }
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addPigHealthCare()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 用药提交
                handleValidateClickMedicine() {
                    medicineFormRef.value.validate(errors => {
                        if (!errors) {
                            state.medicineForm.id ? updateMedicine() : addMedicine()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 一键全改提交
                handleValidateClickUpdateAll() {
                    updateAllFormRef.value.validate(errors => {
                        if (!errors) {
                            updateMedicineAll()
                        } else {
                            message.error("您有暂未填写的选项，请修改数据重新提交")
                        }
                    })
                },
                // 左侧选中行class设置
                leftRowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                farmChange() {
                    state.form.dormCode = null
                    state.form.columnCode = null
                },
                clearfarmDormColumn() {
                    // state.form.farmid = null
                    // state.form.dormCode = null
                    // state.form.columnCode = null
                    // state.form.immunetype = null,
                    state.form = {
                        // 保健登记日期
                        healthcareDate: Date.now(),
                        // 保健范围
                        healthcareScope: undefined,
                        // 场区 必填
                        farmid: undefined,
                        dormCode: undefined,
                        columnCode: undefined,
                        // 保健范围：1=预防流感，2=保胎
                        healthcareGoal: undefined,
                        // 保健用药:1=金银解读散感,BWW=>2=霸王丸
                        healthcareMedication: undefined,
                        immunetype: undefined,
                        pigCode: undefined
                    }
                },
                // 右侧1选中行class设置
                rightRowClassName(row, index) {
                    if (index == state.rightClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                // 模糊搜索
                handleSearch
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
