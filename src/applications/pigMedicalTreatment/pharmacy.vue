<template>
    <div class="pigHealthCare p-2">
        <!-- 种猪医疗丨用药 -->
        <n-card
            :title="
                $t('dataTable.listing.breedingPigMedical') +
                '丨' +
                $t('dataTable.listing.drugCommonName')
            "
        >
            <n-tabs type="line" @update:value="tabsChange">
                <n-tab-pane
                    :name="$t('dataTable.listing.toBeUsed')"
                    :tab="$t('dataTable.listing.toBeUsed')"
                >
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <n-gi span="6 400:6 600:6 800:6">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space justify="space-between">
                                    <n-space align="center">
                                        <!-- 待用药种猪 -->
                                        <div>{{ $t("dataTable.listing.toUsePigs") }}:</div>
                                        <!-- <n-date-picker
                                            v-model:value="timeList"
                                            type="daterange"
                                            :shortcuts="rangeShortcuts"
                                            :is-date-disabled="disablePreviousDate"
                                            @update:value="search.page=1;getPigDrugRegistrationList()"
                                            actions="['confirm']"
                                        /> -->
                                        <!-- <n-button type="info" @click="addPigMedication">批量登记用药</n-button> -->
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchFilesEncoded')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.pigCodeLike"
                                            @keyup.enter="getPigDrugRegistrationList"
                                            @clear="
                                                () => {
                                                    search.pigCodeLike = ''
                                                    getPigDrugRegistrationList()
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
                                :data="PigPharmacyList"
                                :loading="listLoading"
                                :scroll-x="2100"
                                v-model:search="search"
                                :clickIndex="leftClickIndex"
                                @update:checked-row-keys="handleCheck"
                                @update:filters="handleFiltersChange"
                                @update:search="getPigDrugRegistrationList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右侧 -->
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-card content-style="padding: 0;">
                                <div class="p-2 tabHeader">
                                    <n-space align="center">
                                        <div class="font-16 font-weight-bolder">
                                            {{ $t("dataTable.listing.diseaseDetails") }}:
                                        </div>
                                        <!-- <n-button type="info" @click="addPigill">批量登记病情</n-button> -->
                                    </n-space>
                                </div>

                                <n-space vertical v-if="IllnessDetilList.length > 0">
                                    <n-data-table
                                        size="small"
                                        :columns="medicineColumns"
                                        :scroll-x="900"
                                        :data="IllnessDetilList"
                                        @update:checked-row-keys="detilHandleCheck"
                                        :row-key="row => row"
                                        :row-class-name="rightRowClassName"
                                        :loading="showloading"
                                    />
                                    <n-space justify="end">
                                        <n-pagination
                                            v-model:page="rightSearch.page"
                                            v-model:pageSize="rightSearch.limit"
                                            :item-count="rightSearch.total"
                                            show-size-picker
                                            :page-slot="4"
                                            :page-sizes="[10, 20, 30, 40]"
                                            show-quick-jumper
                                            @update:page="getConfirmedInformation(state.detilId)"
                                            @update:pageSize="
                                                getConfirmedInformation(state.detilId)
                                            "
                                        >
                                            <template #prefix="{ itemCount }"
                                                >共 {{ itemCount }} 项</template
                                            >
                                        </n-pagination>
                                    </n-space>
                                </n-space>
                                <n-empty
                                    v-else
                                    description="暂无记录，请点击左侧查看详情"
                                    class="mt-3"
                                ></n-empty>
                            </n-card>
                        </n-gi>
                    </n-grid>
                </n-tab-pane>
                <n-tab-pane
                    :name="$t('dataTable.listing.medicated')"
                    :tab="$t('dataTable.listing.medicated')"
                >
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <n-gi span="12 400:12 600:12 800:12">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space justify="space-between">
                                    <n-space align="center">
                                        <!-- 已经用药种猪 -->
                                        <div>{{ $t("dataTable.listing.usedBreedingPigs") }}:</div>
                                        <n-date-picker
                                            v-model:value="timeList"
                                            type="daterange"
                                            :shortcuts="rangeShortcuts"
                                            :is-date-disabled="disablePreviousDate"
                                            @update:value="
                                                () => {
                                                    search.page = 1
                                                    getPigDrugRegistrationList()
                                                }
                                            "
                                            actions="['confirm']"
                                        />
                                        <!-- <n-button type="info" @click="addPigMedication">批量登记用药</n-button> -->
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchFilesEncoded')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.pigCodeLike"
                                            @keyup.enter="getPigDrugRegistrationList"
                                            @clear="
                                                () => {
                                                    search.pigCodeLike = ''
                                                    getPigDrugRegistrationList()
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
                                :data="PigPharmacyList"
                                :loading="listLoading"
                                :scroll-x="2100"
                                v-model:search="search"
                                :clickIndex="leftClickIndex"
                                @update:checked-row-keys="handleCheck"
                                @update:filters="handleFiltersChange"
                                @update:search="getPigDrugRegistrationList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右侧 -->
                        <!-- <n-gi span="4 400:4 600:4 800:4">
                            <n-card content-style="padding: 0;">
                                <div class="p-2 tabHeader">
                                    <n-space align="center">
                                        <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.diseaseDetails')}}:</div>
                                    </n-space>
                                </div>

                                <n-space vertical v-if="IllnessDetilList.length>0">
                                    <n-data-table
                                        size="small"
                                        :columns="medicineColumns"
                                        :scroll-x="900"
                                        :data="IllnessDetilList"
                                        @update:checked-row-keys="detilHandleCheck"
                                        :row-key="row => row"
                                        :row-class-name="rightRowClassName"
                                        :loading="showloading"
                                    />
                                    <n-space justify="end">
                                        <n-pagination
                                            v-model:page="rightSearch.page"
                                            v-model:pageSize="rightSearch.limit"
                                            :item-count="rightSearch.total"
                                            show-size-picker
                                            :page-slot="4"
                                            :page-sizes="[10, 20, 30, 40]"
                                            show-quick-jumper
                                            @update:page="getConfirmedInformation(state.detilId)"
                                            @update:pageSize="getConfirmedInformation(state.detilId)"
                                        >
                                            <template #prefix="{ itemCount}">共 {{ itemCount }} 项</template>
                                        </n-pagination>
                                    </n-space>
                                </n-space>
                                <n-empty v-else description="暂无记录，请点击左侧查看详情" class="mt-3"></n-empty>
                            </n-card>
                        </n-gi>-->
                    </n-grid>
                </n-tab-pane>
            </n-tabs>
        </n-card>

        <!-- 批量登记用药 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.drugRegistration')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeMedicineFrom()"
        >
            <n-form
                :model="medicineForm.condition"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                :label-width="100"
            >
                <n-form-item path="medicationDatatime" :label="$t('dtables.listing.durationOf')">
                    <n-date-picker
                        v-model:value="medicineForm.condition.medicationDatatime"
                        type="datetime"
                        :is-date-disabled="disablePreviousDate"
                        :is-time-disabled="timeDisabled"
                        actions="['now']"
                        :update-value-on-close="updateValueOnClose"
                        style="width: 300px"
                        @focus="
                            e => {
                                e.target.blur()
                            }
                        "
                    />
                </n-form-item>

                <n-form-item path="operationId" :label="$t('dataTable.listing.operatingPersonnel')">
                    <n-select
                        :style="{ width: '300px' }"
                        v-model:value="medicineForm.condition.operationId"
                        :options="userList"
                        filterable
                        :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                        style="width: 300px"
                    />
                </n-form-item>

                <n-space justify="center">
                    <n-button type="info" @click="handleValidateClick">{{
                        $t("dataTable.listing.confirm")
                    }}</n-button>
                    <n-button
                        @click="
                            () => {
                                showAdd = false
                                closeMedicineFrom()
                            }
                        "
                        >{{ $t("dtables.listing.cancel") }}</n-button
                    >
                </n-space>
            </n-form>
        </n-modal>

        <!-- 病情登记 -->
        <n-modal
            class="custom-card"
            v-model:show="showIllness"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.theIllnessIsRegistered')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeFrom()"
        >
            <n-form
                :model="form.condition"
                ref="medicineFormRef"
                :rules="medicineRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="10">
                    <n-form-item
                        path="nowPigStatus"
                        :label="$t('dataTable.listing.illnessDescription')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            v-model:value="form.condition.nowPigStatus"
                            :options="getNowPigStatus('nowPigStatus')"
                            style="width: 300px"
                        />
                    </n-form-item>
                    <!-- 根据登记病情不同，显示不同select -->
                    <n-form-item
                        path="deathType"
                        :label="$t('dataTable.listing.deathType')"
                        v-if="
                            getDictionarieName('nowPigStatus', form.condition.nowPigStatus) ==
                            '已死亡'
                        "
                    >
                        <n-select
                            :style="{ width: '140px' }"
                            v-model:value="form.condition.deathType"
                            :options="getDictionaries('deathType')"
                        />
                    </n-form-item>
                    <!-- 死亡原因 非未知 -->
                    <n-form-item
                        path="deathReason"
                        :label="$t('dataTable.listing.deathCause')"
                        v-if="
                            form.condition.deathType &&
                            getDictionarieName('deathType', form.condition.deathType) != '未知'
                        "
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="form.condition.deathReason"
                            :options="getDictionaries('pigletDeathReason')"
                        />
                    </n-form-item>
                    <!-- 死亡原因 未知 -->
                    <n-form-item
                        path="remark"
                        :label="$t('dataTable.listing.remark')"
                        v-if="getDictionarieName('deathType', form.condition.deathType) == '未知'"
                    >
                        <n-input
                            :style="{ width: '255px' }"
                            v-model:value="form.condition.remark"
                            type="textarea"
                            maxlength="200"
                            show-count
                            :placeholder="$t('dtables.listing.pleaseEnterANote')"
                        />
                    </n-form-item>
                    <!-- 死亡后处理方式 -->
                    <n-form-item
                        path="handlingType"
                        :label="$t('dataTable.listing.treatmentMethod')"
                        v-if="
                            getDictionarieName('nowPigStatus', form.condition.nowPigStatus) ==
                            '已死亡'
                        "
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="form.condition.handlingType"
                            :options="getDictionaries('handlingType')"
                        />
                    </n-form-item>
                    <n-form-item
                        path="updateDatetime"
                        :label="$t('dtables.listing.theDateOf')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-date-picker
                            v-model:value="form.condition.updateDatetime"
                            type="date"
                            :is-date-disabled="disablePreviousDate"
                            actions="['now']"
                            style="width: 300px"
                            @focus="
                                e => {
                                    e.target.blur()
                                }
                            "
                        />
                    </n-form-item>
                    <n-form-item
                        path="updateid"
                        :label="$t('dataTable.listing.operatingPersonnel')"
                    >
                        <n-select
                            :style="{ width: '300px' }"
                            v-model:value="form.condition.updateid"
                            :options="userList"
                            filterable
                            :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                            style="width: 300px"
                        />
                    </n-form-item>
                    <n-space justify="center">
                        <n-button type="info" @click="toSubmit">{{
                            $t("dataTable.listing.confirm")
                        }}</n-button>
                        <n-button @click=";(showIllness = false), closeFrom()">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
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
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigDrugRegistrationListApi,
        getConfirmedInformationApi,
        addMedicationDatatimeApi,
        PigRegisterDetailsPigStatusApi
    } from "@/api/pigPharmacy.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        name: "pigHealthCare",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const medicineFormRef = ref(null)
            let loadingReactive = null
            const { t } = useI18n()
            const state = reactive({
                tabsIndex: 1,
                showAdd: false,
                showIllness: false,
                showloading: false,
                listLoading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCodeLike: "",
                    // 用药记录日期开始时间
                    createDatatimeGte: helper.formatStartTamp(Date.now()),
                    // 用药记录日期结束时间
                    createDatatimeLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    nowFarmidList: [],
                    // 栋舍
                    nowDormCodeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                rightSearch: {
                    groupHealthcareId: "",
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                medicineColumns: [],
                // 登记用药form
                medicineForm: {
                    models: [],
                    condition: {
                        medicationDatatime: Date.now(),
                        operationId: store.state.core.userInfo.id || ""
                    }
                },
                // 登记病情form
                form: {
                    models: [],
                    condition: {
                        nowPigStatus: undefined,
                        updateid: store.state.core.userInfo.id || "",
                        pigDrugRegistrationId: undefined,
                        updateDatetime: Date.now()
                    }
                },
                tabSelection: [],
                tabDetilSelection: [],
                detilId: "",
                detilPigCode: "",

                PigPharmacyList: [],
                IllnessDetilList: {},

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {},

                rightClickIndex: -1,
                rightClickId: undefined,
                rightClickRow: {}
            })
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
            const tabsChange = value => {
                // state.search.registerStateList = store.getters["dictionaries/getDictionarieId"](
                //     "registerState",
                //     value
                // )
                state.tabsIndex = value == t("dataTable.listing.toBeUsed") ? 1 : 0
                state.search.page = 1
                setTableColumns()
                getPigDrugRegistrationList()
            }

            // 病情登记--病情描述下拉
            const getNowPigStatus = computed(() => {
                return function (dictionaryKey) {
                    let arr = store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    let newArr = []
                    arr.forEach(item => {
                        if (item.dictName == "已康复" || item.dictName == "已死亡") {
                            newArr.push(item)
                        }
                    })
                    return newArr
                }
            })

            // 获取字典 症状
            const getSymptomsOptions = computed(() => {
                return store.state.dictionaries.symptomsList
            })
            // 获取字典 药品
            const getDrugsListOptions = computed(() => {
                return store.state.dictionaries.drugsList
            })

            // 获取用药列表
            const getPigDrugRegistrationList = async () => {
                state.search.createDatatimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.createDatatimeLte = helper.formatEndTamp(state.timeList[1])
                state.listLoading = true

                let data = {
                    ...state.search,
                    toDoAndDone: state.tabsIndex
                }
                await getPigDrugRegistrationListApi(data).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.PigPharmacyList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取病情明细列表
            const getConfirmedInformation = async rowId => {
                state.detilId = rowId
                state.showloading = true
                await getConfirmedInformationApi({ id: rowId }).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.IllnessDetilList = res.data.list
                        state.rightSearch.page = res.data.pageNo
                        state.rightSearch.limit = res.data.pageSize
                        state.rightSearch.total = res.data.total
                    }
                })
            }

            // 登记用药
            const addMedication = async () => {
                state.tabSelection.forEach(item => {
                    state.medicineForm.models.push({
                        id: item.id
                    })
                })
                let fromData = JSON.parse(JSON.stringify(state.medicineForm))
                fromData.condition.medicationDatatime = helper.format(
                    fromData.condition.medicationDatatime
                )
                await addMedicationDatatimeApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))

                        state.search.page = 1
                        getPigDrugRegistrationList()

                        state.showAdd = false
                        closeMedicineFrom()
                    }
                })
            }

            // 登记病情
            const PigRegisterDetails = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("message.loading"), {
                        duration: 0
                    })
                }
                state.tabDetilSelection.forEach(item => {
                    state.form.models.push({
                        pigCode: state.detilPigCode,
                        registerCode: item.registerCode
                    })
                })
                state.form.condition.pigDrugRegistrationId = state.detilId
                let fromData = JSON.parse(JSON.stringify(state.form))
                fromData.condition.updateDatetime = helper.format(fromData.condition.updateDatetime)
                await PigRegisterDetailsPigStatusApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.rightSearch.page = 1
                        getPigDrugRegistrationList()
                        getConfirmedInformation(state.detilId)

                        state.showIllness = false
                        closeFrom()
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            const closeMedicineFrom = () => {
                state.medicineForm = {
                    models: [],
                    condition: {
                        medicationDatatime: Date.now(),
                        operationId: undefined
                    }
                }
            }
            const closeFrom = () => {
                if (loadingReactive) {
                    loadingReactive.destroy()
                    loadingReactive = null
                }
                state.form = {
                    models: [],
                    condition: {
                        nowPigStatus: undefined,
                        updateid: undefined,
                        pigDrugRegistrationId: undefined,
                        updateDatetime: Date.now()
                    }
                }
            }
            const setTableColumns = () => {
                state.columns = [
                    // {
                    //     type: "selection",
                    // },
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.fileCoding")
                        },
                        width: 200,
                        key: "pigCode"
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "nowFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.nowFarmid) || "--"
                        }
                    },
                    {
                        // title: '栋舍',
                        title: () => {
                            return t("dataTable.listing.Dorm")
                        },
                        key: "nowDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getDormName"](row.nowDormCode) || "--"
                            )
                        }
                    },
                    {
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "nowColumnCode"
                    },
                    {
                        // title: '确诊病状',
                        title: () => {
                            return t("dataTable.listing.diagnosedDisease")
                        },
                        key: "confirmedCase",
                        ellipsis: {
                            tooltip: true
                        },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.symptomsList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getSymptomName"](row.confirmedCase) ||
                                "--"
                            )
                        }
                    },
                    {
                        // title: '用药名称',
                        title: () => {
                            return t("dataTable.listing.drugName")
                        },
                        key: "drugName",
                        ellipsis: {
                            tooltip: true
                        },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.allDrugsList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getAllDrugName"](row.drugName) || "--"
                            )
                        }
                    },
                    {
                        // title: '剂量/份',
                        title: () => {
                            return t("dataTable.listing.dose")
                        },
                        key: "dose"
                    },
                    {
                        // title: '频率（次/天）',
                        title: () => {
                            return t("dataTable.listing.frequency")
                        },
                        key: "frequency"
                    },
                    {
                        // title: '开始时间',
                        title: () => {
                            return t("dataTable.listing.startTime")
                        },
                        key: "startMedicationDatatime"
                    },
                    {
                        // title: '已用药量',
                        title: () => {
                            return t("dataTable.listing.usedDose")
                        },
                        key: "usedDose"
                    },
                    {
                        // title: '猪只状态',
                        title: () => {
                            return t("dataTable.listing.nowPigStatus")
                        },
                        key: "nowPigStatus",
                        filter: false,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["nowPigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "nowPigStatus",
                                row.nowPigStatus
                            )
                        }
                    },
                    {
                        // title: '剩余用药量',
                        title: () => {
                            return t("dataTable.listing.residualDosage")
                        },
                        key: "residualDose"
                    },
                    {
                        // title: '本日已用',
                        title: () => {
                            return t("dataTable.listing.usedToday")
                        },
                        key: "usedToday"
                    },
                    {
                        // title: '上次用药时间',
                        title: () => {
                            return t("dataTable.listing.lastMedicationTime")
                        },
                        key: "medicationDatatime"
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "operationId"
                    },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
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
                                        type: "success",
                                        text: true,
                                        onClick: () => {
                                            state.showAdd = true
                                            state.medicineForm.models = [{ id: row.id }]
                                        }
                                    },
                                    { default: () => t("dataTable.listing.btnRegistration") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickRow = row
                                            state.detilPigCode = row.pigCode
                                            getConfirmedInformation(row.id, row.confirmedCase)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]

                state.tabsIndex == 0 && state.columns.pop()
            }
            const setMedicineColumns = () => {
                state.medicineColumns = [
                    // {
                    //     type: 'selection'
                    // },
                    {
                        // title: '挂号单编码',
                        title: () => {
                            return t("dataTable.listing.registrationNumber")
                        },
                        key: "registerCode"
                    },
                    {
                        // title: '确诊病状',
                        title: () => {
                            return t("dataTable.listing.diagnosedDisease")
                        },
                        key: "confirmedCase",
                        filterOptions: computed(() => {
                            return store.state.dictionaries.symptomsList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getSymptomName"](row.confirmedCase) ||
                                "--"
                            )
                        }
                    },
                    {
                        // title: '确诊日期',
                        title: () => {
                            return t("dataTable.listing.dateOfDiagnosis")
                        },
                        key: "prescribingPeopleDatatime",
                        render(row) {
                            return helper.timestampToTime(row.prescribingPeopleDatatime)
                        }
                    },
                    {
                        // title: '确诊医生',
                        title: () => {
                            return t("dataTable.listing.confirmedDoctor")
                        },
                        key: "conductorId"
                    },
                    {
                        // title: '开药日期',
                        title: () => {
                            return t("dataTable.listing.prescriptionDate")
                        },
                        key: "processingModeDatatime",
                        render(row) {
                            return helper.timestampToTime(row.processingModeDatatime)
                        }
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
                                            state.rightClickIndex = index
                                            state.rightClickRow = row
                                            state.form.models = [
                                                {
                                                    pigCode: state.detilPigCode,
                                                    registerCode: row.registerCode
                                                }
                                            ]
                                            state.showIllness = true
                                            state.form.condition.confirmedCase = row.confirmedCase
                                        }
                                    },
                                    { default: () => t("dataTable.listing.registeredIllness") }
                                )
                            ])
                        }
                    }
                ]
            }

            onBeforeMount(() => {
                // 获取症状
                store.dispatch("dictionaries/getPigSymptomsList", 2)
                // 获取全部药品
                store.dispatch("dictionaries/getPigDrugsList", "")
            })
            onMounted(() => {
                getPigDrugRegistrationList()
                //设置列表
                setTableColumns()
                setMedicineColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                tabsChange,
                medicineFormRef,
                closeMedicineFrom,
                closeFrom,
                getPigDrugRegistrationList,
                getConfirmedInformation,
                getDictionaries,
                getNowPigStatus,
                getDictionarieName,
                getFarmName,
                getDormName,
                getSymptomsOptions,
                getDrugsListOptions,
                addMedication,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                updateValueOnClose: ref(true),
                // 保健登记规则
                rules: {
                    operationId: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheRegistration"),
                        trigger: ["input", "blur"]
                    },
                    medicationDatatime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectATime")
                    }
                },
                // 用药登记规则
                medicineRules: {
                    nowPigStatus: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAState"),
                        trigger: ["input", "blur"]
                    },
                    updateDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectADate2")
                    },
                    updateid: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("dtables.listing.pleaseEnterTheOperation")
                    },
                    deathType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectATypeOfDeath")
                    },
                    deathReason: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTheCauseOfDeath")
                    },
                    remark: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterANote")
                    },
                    handlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAHandling")
                    }
                },

                rangeShortcuts: {
                    [t("dataTable.listing.inRecentMonth")]: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    [t("dataTable.listing.almostAYear")]: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ]
                },
                // 用药列表
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                addPigMedication() {
                    if (state.tabSelection.length == 0) {
                        message.warning(t("dtables.listing.youAreNotSelectedInTheListOfAnyOne"))
                    } else {
                        state.showAdd = true
                    }
                },

                // 明细列表
                detilHandleCheck(rowKeys) {
                    state.tabDetilSelection = rowKeys
                },
                addPigill() {
                    if (state.tabDetilSelection.length == 0) {
                        message.warning(t("dtables.listing.youAreNotSelectedInTheListOfAnyOne"))
                    } else {
                        state.showIllness = true
                    }
                },

                // 根据保健目的获取对应用药
                findDrugsListOptions() {
                    state.form.healthcareMedication = undefined
                    // 获取保健目的
                    store.dispatch("dictionaries/getPigDrugsList", state.form.healthcareGoal)
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = options.filters.nowDormCode
                    }
                    state.search.page = 1
                    getPigDrugRegistrationList()
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                // 时间过滤
                timeDisabled() {
                    const date = new Date()
                    return {
                        isHourDisabled: hour => {
                            return hour > date.getHours()
                        }
                        // isMinuteDisabled: (minute) => {
                        //     return minute > date.getMinutes()
                        // },
                        // isSecondDisabled: (second) => {
                        //     return second > date.getSeconds()
                        // }
                    }
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
                            addMedication()
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
                toSubmit() {
                    medicineFormRef.value.validate(errors => {
                        if (!errors) {
                            PigRegisterDetails()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
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
                // 右侧1选中行class设置
                rightRowClassName(row, index) {
                    if (index == state.rightClickIndex) {
                        return "tr-select"
                    }
                    return null
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
