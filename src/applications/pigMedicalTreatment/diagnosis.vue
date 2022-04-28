<template>
    <div class="pigHealthCare p-2">
        <!-- 种猪医疗丨诊疗 -->
        <n-card :title="
                $t('dataTable.listing.breedingPigMedical') +
                '丨' +
                $t('dataTable.listing.diagnosisAndTreatment')
            ">
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待确诊" :tab="$t('dataTable.listing.toBeConfirmed')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 待处理挂号 -->
                                            <div>
                                                {{
                                                $t(
                                                "dataTable.listing.RegistrationToBeProcessed"
                                                )
                                                }}:
                                            </div>
                                            <!-- <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigDiagnosis()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />-->
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchRegistrationNumber')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.registerCodeLike"
                                                @keyup.enter="getpigDiagnosis"
                                                @clear="
                                                    () => {
                                                        search.registerCodeLike = ''
                                                        getpigDiagnosis()
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
                                    :data="pigDiagnosisList"
                                    :loading="listLoading"
                                    :scroll-x="1000"
                                    v-model:search="search"
                                    :clickIndex="leftClickIndex"
                                    @update:checked-row-keys="handleCheck"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigDiagnosis"
                                ></tableComponents>
                            </n-gi>
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 诊疗明细， 批量确诊，批量开药-->
                                            <div class="font-16 font-weight-bolder">{{ $t("dataTable.listing.diagnosisDetails") }}:</div>
                                            <n-button type="info" @click="diagnosisSubmit('批量确诊')">{{ $t("button.batchDiagnosis") }}</n-button>
                                            <n-button type="info" @click="medicineSubmit('批量开药')">{{ $t("button.batchPrescriptions") }}</n-button>
                                        </n-space>
                                    </div>
                                    <!-- @update:checked-row-keys="handleCheck" -->
                                    <n-space vertical v-if="useMedicineList.length >= 0">
                                        <n-data-table
                                            size="small"
                                            :loading="showloading"
                                            :columns="medicineColumns"
                                            :scroll-x="900"
                                            :data="useMedicineList"
                                            v-model:checked-row-keys="checkedRowKeys"
                                            :row-key="row => row"
                                            :row-class-name="rightRowClassName"
                                            @update:filters="handleRightFiltersChange"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="rightSearch.page"
                                                v-model:pageSize="rightSearch.limit"
                                                :item-count="rightSearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                :page-slot="4"
                                                show-quick-jumper
                                                @update:page="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                                @update:pageSize="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                            >
                                                <template #prefix="{ itemCount }">共 {{ itemCount }} 项</template>
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftToSeeDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="已确诊" :tab="$t('dataTable.listing.confirmed')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 已确诊挂号 -->
                                            <div>{{ $t("dtables.listing.confirmedBooking") }}:</div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigDiagnosis()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchRegistrationNumber')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.registerCodeLike"
                                                @keyup.enter="getpigDiagnosis"
                                                @clear="
                                                    () => {
                                                        search.registerCodeLike = ''
                                                        getpigDiagnosis()
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
                                    :data="pigDiagnosisList"
                                    :loading="listLoading"
                                    :scroll-x="1000"
                                    v-model:search="search"
                                    :clickIndex="leftClickIndex"
                                    @update:checked-row-keys="handleCheck"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigDiagnosis"
                                ></tableComponents>
                            </n-gi>
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 诊疗明细， 批量确诊，批量开药-->
                                            <div class="font-16 font-weight-bolder">{{ $t("dataTable.listing.diagnosisDetails") }}:</div>
                                            <n-button type="info" @click="diagnosisSubmit('批量确诊')">{{ $t("button.batchDiagnosis") }}</n-button>
                                            <n-button type="info" @click="medicineSubmit('批量开药')">{{ $t("button.batchPrescriptions") }}</n-button>
                                        </n-space>
                                    </div>
                                    <!-- @update:checked-row-keys="handleCheck" -->
                                    <n-space vertical v-if="useMedicineList.length >= 0">
                                        <n-data-table
                                            size="small"
                                            :loading="showloading"
                                            :columns="medicineColumns"
                                            :scroll-x="900"
                                            :data="useMedicineList"
                                            v-model:checked-row-keys="checkedRowKeys"
                                            :row-key="row => row"
                                            :row-class-name="rightRowClassName"
                                            @update:filters="handleRightFiltersChange"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="rightSearch.page"
                                                v-model:pageSize="rightSearch.limit"
                                                :item-count="rightSearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                :page-slot="4"
                                                show-quick-jumper
                                                @update:page="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                                @update:pageSize="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                            >
                                                <template #prefix="{ itemCount }">共 {{ itemCount }} 项</template>
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftToSeeDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="已完成" :tab="$t('dataTable.listing.hasBeenCompleted')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 已完成挂号 -->
                                            <div>{{ $t("dtables.listing.completedRegistration") }}:</div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigDiagnosis()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchRegistrationNumber')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.registerCodeLike"
                                                @keyup.enter="getpigDiagnosis"
                                                @clear="
                                                    () => {
                                                        search.registerCodeLike = ''
                                                        getpigDiagnosis()
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
                                    :data="pigDiagnosisList"
                                    :loading="listLoading"
                                    :scroll-x="1000"
                                    v-model:search="search"
                                    :clickIndex="leftClickIndex"
                                    @update:checked-row-keys="handleCheck"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigDiagnosis"
                                ></tableComponents>
                            </n-gi>
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 诊疗明细， 批量确诊，批量开药-->
                                            <div class="font-16 font-weight-bolder">{{ $t("dataTable.listing.diagnosisDetails") }}:</div>
                                            <n-button type="info" @click="diagnosisSubmit('批量确诊')">{{ $t("button.batchDiagnosis") }}</n-button>
                                            <n-button type="info" @click="medicineSubmit('批量开药')">{{ $t("button.batchPrescriptions") }}</n-button>
                                        </n-space>
                                    </div>
                                    <!-- @update:checked-row-keys="handleCheck" -->
                                    <n-space vertical v-if="useMedicineList.length >= 0">
                                        <n-data-table
                                            size="small"
                                            :loading="showloading"
                                            :columns="medicineColumns"
                                            :scroll-x="900"
                                            :data="useMedicineList"
                                            v-model:checked-row-keys="checkedRowKeys"
                                            :row-key="row => row"
                                            :row-class-name="rightRowClassName"
                                            @update:filters="handleRightFiltersChange"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="rightSearch.page"
                                                v-model:pageSize="rightSearch.limit"
                                                :item-count="rightSearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                :page-slot="4"
                                                show-quick-jumper
                                                @update:page="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                                @update:pageSize="
                                                    getPigDiagnosisDetail(theRegisterCode)
                                                "
                                            >
                                                <template #prefix="{ itemCount }">共 {{ itemCount }} 项</template>
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftToSeeDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-card>
        <!-- 确诊 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.diagnosis')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeFrom()"
        >
            <n-form :model="form.condition" ref="formRef" :rules="rules" label-placement="left" label-width="auto">
                <n-space vertical :size="10">
                    <n-form-item path="confirmedCase" :label="$t('dataTable.listing.diagnosedDisease')" class="feedback-wrapper-noHeight">
                        <n-select v-model:value="form.condition.confirmedCase" filterable :options="symptomList" style="width: 300px" />
                    </n-form-item>
                    <n-form-item
                        path="processingMode"
                        :label="$t('dataTable.listing.treatmentMethod')"
                        class="feedback-wrapper-noHeight"
                        v-if="
                            form.condition.confirmedCase &&
                            getSymptomName(form.condition.confirmedCase) != '无病'
                        "
                    >
                        <n-select
                            v-model:value="form.condition.processingMode"
                            :options="getDictionaries('processingMode')"
                            :placeholder="$t('dtables.listing.pleaseSelectAHandling')"
                            style="width: 300px"
                        />
                    </n-form-item>
                    <n-form-item path="conductorId" :label="$t('dataTable.listing.operatingPersonnel')">
                        <!-- <n-input v-model:value="form.condition.conductorId" style="width:300px;" /> -->
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="form.condition.conductorId"
                            :options="userList"
                            filterable
                            :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                            style="width: 300px"
                        />
                    </n-form-item>
                    <n-space justify="center">
                        <n-button type="info" @click="handleDiagnosis">
                            {{
                            $t("dataTable.listing.confirm")
                            }}
                        </n-button>
                        <n-button
                            @click="
                                () => {
                                    showAdd = false
                                    closeFrom()
                                }
                            "
                        >{{ $t("dtables.listing.cancel") }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 开药 -->
        <n-modal
            class="custom-card"
            v-model:show="showMedicine"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.prescribe')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="closeMedicineFrom()"
        >
            <n-form :model="addChildForm" ref="medicineFormRef" :rules="medrules" label-placement="left" :label-width="100">
                <n-space vertical :size="30">
                    <!-- :pagination="pagination" -->
                    <n-scrollbar style="max-height: 191px">
                        <n-data-table :columns="addChildColumns" :data="addChildList" :row-class-name="childRowClassName" :size="small" :max-height="120" />
                    </n-scrollbar>

                    <n-grid x-gap="20" :cols="2">
                        <n-gi>
                            <n-form-item :label="$t('dtables.listing.bookingFormNo')">{{ theRegisterCode }}</n-form-item>
                            <n-form-item path="dose" :label="$t('dtables.listing.aSingleDose')">
                                <n-input-number v-model:value="addChildForm.dose" clearable min="1" style="width: 120px" />
                                <span>&nbsp;&nbsp;{{ $t("dtables.listing.a / /Package") }}</span>
                            </n-form-item>
                            <n-form-item path="prescribingPeopletime" :label="$t('dtables.listing.drugUseInterval')">
                                <n-input-number v-model:value="addChildForm.prescribingPeopletime" clearable min="1" style="width: 120px" />
                                <span>&nbsp;&nbsp;小时</span>
                            </n-form-item>
                            <n-form-item path="prescribingPeople" :label="$t('dataTable.listing.operatingPersonnel')">
                                <n-select :style="{ width: '255px' }" v-model:value="addChildForm.prescribingPeople" :options="userList" filterable placeholder="请输入操作人" style="width: 350px" />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item path="medication" :label="$t('dataTable.listing.drugCommonName')">
                                <n-select v-model:value="addChildForm.medication" filterable :options="drugsList" style="width: 350px" />
                            </n-form-item>
                            <n-form-item path="frequency" :label="$t('dtables.listing.drugUseFrequency')">
                                <n-input-number v-model:value="addChildForm.frequency" clearable min="1" style="width: 120px" />
                                <span>&nbsp;&nbsp;{{ $t("dtables.listing.time/day") }}</span>
                            </n-form-item>
                            <n-form-item path="periodOfTreatment" :label="$t('dtables.listing.periodOfTreatment')">
                                <n-input-number v-model:value="addChildForm.periodOfTreatment" clearable min="1" style="width: 120px" />
                                <span>&nbsp;&nbsp;{{ $t("dtables.listing.day") }}</span>
                            </n-form-item>
                            <n-form-item path="prescriptionInstructions" :label="$t('dtables.listing.instructions')">
                                <n-input v-model:value="addChildForm.prescriptionInstructions" type="textarea" maxlength="200" show-count placeholder="请输入描述详情" style="width: 350px" />
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="nextAddChild">
                            {{
                            $t("dataTable.listing.prescribe")
                            }}
                        </n-button>
                        <n-button @click="closeAddChildForm()">
                            {{
                            $t("dtables.listing.cancel")
                            }}
                        </n-button>
                    </n-space>
                    <n-space justify="center">
                        <n-button type="info" @click="handlePrescribeMedicine" attr-type="button">
                            {{
                            $t("dtables.listing.allSubmitted")
                            }}
                        </n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
        <!-- 附件查看 -->
        <n-modal class="custom-card" v-model:show="showEnclosure" preset="card" :style="bodyStyle" :title="$t('dtables.listing.theAttachmentList')" :bordered="false" :mask-closable="false">
            <n-image-group>
                <n-space v-if="enclosureList && enclosureList.length != 0">
                    <n-image width="100" height="100" v-for="(item, index) in enclosureList" :key="index" :src="item" />
                </n-space>
                <n-space v-else>
                    <n-empty :description="$t('dtables.listing.noPictures')"></n-empty>
                </n-space>
            </n-image-group>
        </n-modal>

        <!-- 化验单上传 -->
        <n-modal
            class="custom-card"
            v-model:show="showUpload"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.report')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="clearShowUpload()"
        >
            <n-space vertical :size="30">
                <n-upload
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    v-model:file-list="fileList"
                    list-type="image-card"
                    accept=".png, .jpg, .jpeg"
                    :max="20"
                    :disabled="
                        filesForm.nowPigStatus == '已康复' || filesForm.nowPigStatus == '已死亡'
                            ? true
                            : false
                    "
                    @before-upload="beforeUpload"
                    @finish="handleFinish"
                    @remove="handleRemove"
                    @change="handleUploadChange"
                >
                    <span>{{ $t("dtables.listing.clickOnTheUpload") }}</span>
                </n-upload>

                <n-space justify="center" v-if="filesForm.nowPigStatus != '已康复' && filesForm.nowPigStatus != '已死亡'">
                    <n-button type="info" @click="uploadPictures">
                        {{
                        $t("dataTable.listing.confirm")
                        }}
                    </n-button>
                    <n-button @click="showUpload = false">
                        {{
                        $t("dtables.listing.cancel")
                        }}
                    </n-button>
                </n-space>
            </n-space>
        </n-modal>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeMount, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog } from "naive-ui"
    import {
        getpigDiagnosisApi,
        getPigConfirmedInformationApi,
        createPigMedicalInformationApi,
        pigDiagnosisApi,
        getPigConfirmedInformationListApi,
        medicalUploadPicturesApi,
        getPigMedicalInformationApi,
        deletePigMedicalInformationByIdApi,
        getPigDrugsBySymptomsIdApi,
        getSymptomsListApi
    } from "@/api/pigDiagnosis.js"
    import { getEditinfoApi } from "@/api/pigRegistration.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import tableComponents from "@/components/table.vue"
    import storage from "store"
    import { S } from "@vicons/carbon"
    import { keep } from "naive-ui/lib/_utils"

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
            const checkedRowKeysRef = ref([])
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const medicineFormRef = ref(null)
            let loadingReactive = null
            const fileListRef = ref([])
            const { t } = useI18n()
            const state = reactive({
                showAdd: false,
                showMedicine: false,
                // 批量和单个
                ismedAll: false,
                isdiagAll: false,
                // 是否选中全部表格数据
                isAllSelect: false,

                showloading: false,
                listLoading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    registerCodeLike: "",
                    // 选配记录日期开始时间
                    registerDataGte: helper.formatStartTamp(Date.now()),
                    // 选配记录日期结束时间
                    registerDataLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    nowFarmidList: [],
                    // 栋舍
                    nowDormCodeList: [],
                    morbidityScopeList: [],
                    theIllnessDescribeList: [],
                    registerStateList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                rightSearch: {
                    registerCode: "",
                    nowPigStatusList: [],
                    confirmedCaseList: [],
                    processingModeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                medicineColumns: [],
                addChildColumns: [],
                // 确诊form
                form: {
                    models: [],
                    condition: {
                        confirmedCase: undefined,
                        processingMode: undefined,
                        conductorId: store.state.core.userInfo.id || ""
                    }
                },
                // 开药form
                medicineForm: {
                    ids: [],
                    models: []
                },
                addChildForm: {
                    frequency: undefined,
                    pigCode: undefined,
                    dose: undefined,
                    medication: undefined,
                    prescribingPeopletime: undefined,
                    periodOfTreatment: undefined,
                    prescriptionInstructions: undefined,
                    prescribingPeople: undefined
                },
                filesForm: {
                    id: undefined,
                    nowPigStatus: undefined,
                    pictureUrl: []
                },
                tabSelection: [],
                allSelection: [],
                // 开多种药
                addChildList: [],
                pagination: {
                    pageSize: 10
                },
                // 挂号单
                theRegisterCode: "",
                // 病症
                theConfirmedCase: "",

                pigDiagnosisList: [],
                useMedicineList: {},
                pigDetail: {},

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {},

                rightClickIndex: -1,
                rightClickId: undefined,
                rightClickRow: {},

                // 挂号单附件列表
                enclosureList: [],
                showEnclosure: false,
                // 上传化验单部分
                showUpload: false,
                uploadUrl:
                    process.env.VUE_APP_API_BASE_URL + "/ms-tenant-consummer/user/{version}/uploadFile",
                uploadHeaders: {
                    Authorization: "Bearer " + storage.get("access_token")
                },
                fileStorageList: [],
                // 是否是编辑
                isEdit: false,
                drugsList: [],
                symptomList: []
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
            // 获取字典 药品
            const getDrugsListOptions = computed(() => {
                return store.state.dictionaries.allDrugsList
            })

            // 获取字典 症状
            const getConfirmedCase = async () => {
                await getSymptomsListApi().then(res => {
                    if (res.code == 0) {
                        state.symptomList = []
                        res.data.forEach(item => {
                            state.symptomList.push({
                                label: item.name,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 根据id获取症状名称
            const getSymptomName = computed(() => {
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

            // 根据病症获取药品
            // const getPigDrugsList = computed(() => {
            //     return function () {
            //         return store.state.dictionaries.drugsList
            //     }
            // })
            const getdrugs = async () => {
                await getPigDrugsBySymptomsIdApi({ id: state.theConfirmedCase }).then(res => {
                    if (res.code == 0) {
                        state.drugsList = []
                        res.data.list.forEach(item => {
                            state.drugsList.push({
                                label: item.commonName,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 表单计算属性
            // 获取所有场区
            const getFarmList = computed(() => {
                return store.state.dictionaries.farmList
            })
            // 根据场区获取对应栋舍
            const getDormList = computed(() => {
                let dormList = []
                if (state.form.farmCode) {
                    dormList = store.state.dictionaries.dormList.filter(
                        item => item.farmCode != state.form.farmCode
                    )
                } else {
                    dormList = store.state.dictionaries.dormList
                }
                return dormList
            })

            // 获取诊疗列表
            const getpigDiagnosis = async () => {
                state.search.registerDataGte = helper.formatStartTamp(state.timeList[0])
                state.search.registerDataLte = helper.formatEndTamp(state.timeList[1])
                state.listLoading = true
                await getpigDiagnosisApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.pigDiagnosisList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取诊疗明细
            const getPigDiagnosisDetail = async rowId => {
                state.theRegisterCode = rowId
                state.rightSearch.registerCode = rowId
                state.showloading = true
                await getPigConfirmedInformationApi(state.rightSearch).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.useMedicineList = res.data.list
                        state.rightSearch.page = res.data.pageNo
                        state.rightSearch.limit = res.data.pageSize
                        state.rightSearch.total = res.data.total
                    }
                })
            }

            // 根据id获取编辑回显附件
            const getEditDate = async row => {
                await getEditinfoApi({ pictureCode: row.pictureCode }).then(res => {
                    if (res.code == 0) {
                        state.enclosureList = []
                        res.data.forEach(item => {
                            state.enclosureList.push(item.baseUrl)
                        })
                        state.showEnclosure = true
                    }
                })
            }

            // 获取单个猪的 开药回显
            const getPigMedicalInformation = async row => {
                await getPigMedicalInformationApi({ pigCode: row.pigCode }).then(res => {
                    if (res.code == 0) {
                        state.addChildList = res.data
                        if (res.data && res.data.length != 0) {
                            state.isEdit = true
                        }
                    }
                })
            }

            // 删除
            const deleteMedicalInfo = async row => {
                await deletePigMedicalInformationByIdApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        111
                    }
                })
            }

            // 根据pictureCode获取化验单回显图片
            const getPictureList = async row => {
                await getEditinfoApi({ pictureCode: row.pictureCode }).then(res => {
                    if (res.code == 0) {
                        fileListRef.value = []
                        res.data.forEach(item => {
                            let oneItem = {
                                id: item.id,
                                name: item.baseUrl,
                                status: "finished",
                                url: item.baseUrl
                            }
                            fileListRef.value.push(oneItem)
                            state.fileStorageList.push(oneItem)
                        })
                    }
                })
            }

            // 确诊保存
            const toDiagnosis = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("message.loading"), {
                        duration: 0
                    })
                }
                if (state.isdiagAll) {
                    state.form.models = []
                    state.allSelection.forEach(item => {
                        state.form.models.push({
                            id: item.id
                        })
                    })
                }
                let fromData = JSON.parse(JSON.stringify(state.form))
                await pigDiagnosisApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.search.page = 1
                        getpigDiagnosis()
                        getPigDiagnosisDetail(state.theRegisterCode)
                        checkedRowKeysRef.value = []

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

            // 开药保存
            const toPrescribeMedicine = async () => {
                if (state.ismedAll) {
                    state.medicineForm.models = []
                    state.allSelection.forEach(item => {
                        state.medicineForm.ids.push(item.id)
                    })
                }
                // 是否是编辑
                if (state.isEdit) {
                    state.addChildList.forEach(item => {
                        if (!item.id) {
                            state.medicineForm.models.push(item)
                        }
                    })
                } else {
                    state.medicineForm.models = state.addChildList
                }
                await createPigMedicalInformationApi(state.medicineForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.rightSearch.page = 1
                        getPigDiagnosisDetail(state.theRegisterCode)
                        checkedRowKeysRef.value = []

                        state.showMedicine = false
                        closeMedicineFrom()
                        state.addChildList = []
                    }
                })
            }

            // 调取根据病症获取对应用药的方法
            function findDrugsListOptions() {
                let data = {
                    symptomsType: 2,
                    id: state.theConfirmedCase
                }
                store.dispatch("dictionaries/getPigDrugsList", data)
            }

            // 确诊按钮
            function diagnosisSubmit(type) {
                switch (type) {
                    case "单个确诊":
                        state.isdiagAll = false
                        state.showAdd = true

                        break
                    case "批量确诊":
                        if (checkedRowKeysRef.value.length == 0) {
                            message.warning(t("dtables.listing.youAreNotSelectedInTheListOfAnyOne"))
                        } else {
                            const yz = []
                            if (!state.isAllSelect) {
                                state.allSelection = checkedRowKeysRef.value
                            }
                            state.allSelection.forEach((ele, index) => {
                                if (ele.nowPigStatus !== "1") {
                                    yz.push(index)
                                }
                            })
                            if (yz.length === 0) {
                                state.isdiagAll = true
                                state.showAdd = true
                                state.isAllSelect = false
                            } else {
                                message.error(t("dtables.listing.pleaseSelectAStateToBeConfirmedData"))
                            }
                        }
                        break
                    default:
                        break
                }
            }

            // 开药按钮
            function medicineSubmit(type) {
                state.addChildList = []
                switch (type) {
                    case "单个开药":
                        getdrugs()
                        state.ismedAll = false
                        state.showMedicine = true

                        break
                    case "批量开药":
                        if (checkedRowKeysRef.value.length == 0) {
                            message.warning(t("dtables.listing.youAreNotSelectedInTheListOfAnyOne"))
                        } else {
                            if (!state.isAllSelect) {
                                state.allSelection = checkedRowKeysRef.value
                            }
                            const theName = state.allSelection[0]
                            const yz = []
                            state.allSelection.forEach((ele, index) => {
                                if (ele.nowPigStatus != "2") {
                                    yz.push(index)
                                } else if (ele.confirmedCase != theName.confirmedCase) {
                                    yz.push(index)
                                }
                            })
                            if (yz.length === 0) {
                                state.theConfirmedCase = state.allSelection[0].confirmedCase
                                getdrugs()
                                state.ismedAll = true
                                state.showMedicine = true
                                state.isAllSelect = false
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.pleaseSelectConfirmedState,AndDiagnoseDiseaseTheSameData"
                                    )
                                )
                            }
                        }
                        break
                    default:
                        break
                }
            }
            // 上传化验单
            function uploadPictures() {
                state.filesForm.pictureUrl = []
                state.fileStorageList.forEach(item => {
                    state.filesForm.pictureUrl.push(item.url)
                })
                medicalUploadPicturesApi(state.filesForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.showUpload = false
                        state.fileStorageList = []
                        getPigDiagnosisDetail(state.theRegisterCode)
                    }
                })
            }

            // 图片上传成功后
            const handleFinish = ({ file, event }) => {
                if (file.status == "finished") {
                    let response = JSON.parse(event.target.response)
                    let oneItem = {
                        id: file.id,
                        name: file.name,
                        url: response.data[0]
                    }
                    state.fileStorageList.push(oneItem)
                }
            }

            // 开药form
            const closeMedicineFrom = () => {
                state.addChildList = []
                state.medicineForm = {
                    models: [],
                    ids: []
                    // condition: {
                    //     frequency: undefined,
                    //     pigCode: undefined,
                    //     dose: undefined,
                    //     prescribingPeopletime: undefined,
                    //     periodOfTreatment: undefined,
                    //     prescriptionInstructions: undefined,
                    //     prescribingPeople: undefined,
                    //     medication: undefined
                    // }
                }
                state.isEdit = false
            }

            const clearShowUpload = () => {
                state.showUpload = false
                state.fileStorageList = []
                fileListRef.value = []
            }

            const closeAddChildForm = () => {
                state.addChildForm = {
                    frequency: "",
                    pigCode: "",
                    dose: "",
                    prescribingPeopletime: "",
                    periodOfTreatment: "",
                    prescriptionInstructions: "",
                    prescribingPeople: "",
                    medication: ""
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
                        confirmedCase: undefined,
                        processingMode: undefined,
                        conductorId: undefined
                    }
                }
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '挂号单编号',
                        title: () => {
                            return t("dataTable.listing.registrationNumber")
                        },
                        key: "registerCode"
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.productionStatus")
                        },
                        key: "registerState",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["registerState"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "registerState",
                                row.registerState
                            )
                        }
                    },
                    {
                        // title: '发病范围',
                        title: () => {
                            return t("dataTable.listing.incidenceRange")
                        },
                        key: "morbidityScope",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["morbidityScope"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "morbidityScope",
                                row.morbidityScope
                            )
                        }
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
                            return store.getters["dictionaries/getDormName"](row.nowDormCode) || "--"
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
                        // title: '病情描述',
                        title: () => {
                            return t("dataTable.listing.illnessDescription")
                        },
                        key: "theIllnessDescribe",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["theIllnessDescribe"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "theIllnessDescribe",
                                row.theIllnessDescribe
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
                                        // type: 'warning',
                                        color: "#8a2be2",
                                        text: true,
                                        onClick: () => {
                                            getEditDate(row)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.enclosure") }
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
                                            state.rightSearch.groupHealthcareId = row.id
                                            getPigDiagnosisDetail(row.registerCode)
                                            // getPigDiagnosisDetail()
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
                        type: "selection",
                        options: [
                            {
                                label: t("dataTable.listing.selectAllTableData"),
                                key: "f2",
                                onSelect: pageData => {
                                    checkedRowKeysRef.value = pageData
                                    state.isAllSelect = true
                                    getPigConfirmedInformationListApi({
                                        registerCode: state.theRegisterCode
                                    }).then(res => {
                                        if (res.code == 0) {
                                            state.allSelection = res.data
                                        }
                                    })
                                }
                            },
                            "none"
                        ]
                    },
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.fileCoding")
                        },
                        width: 150,
                        key: "pigCode"
                    },
                    {
                        // title: '当前状态',
                        title: () => {
                            return t("dataTable.listing.currentState")
                        },
                        key: "nowPigStatus",
                        filter: true,
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
                        // title: '开药状态',
                        title: () => {
                            return t("dataTable.listing.prescriptionStatus")
                        },
                        key: "whetherPrescribeMedicine",
                        filter: false,
                        render(row) {
                            return row.whetherPrescribeMedicine == 1
                                ? t("dataTable.listing.prescribedMedicine")
                                : t("dataTable.listing.notPrescribed")
                        }
                    },
                    {
                        // title: '确诊病症',
                        title: () => {
                            return t("dataTable.listing.diagnosedDisease")
                        },
                        key: "confirmedCase",
                        filter: true,
                        // ellipsis: {
                        //     tooltip: true
                        // },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigSymptomsList"]
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "pigSymptomsList",
                                    row.confirmedCase
                                ) || "--"
                            )
                        }
                    },
                    {
                        // title: '处理方式',
                        title: () => {
                            return t("dataTable.listing.treatmentMethod")
                        },
                        key: "processingMode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["processingMode"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "processingMode",
                                row.processingMode
                            )
                        }
                    },
                    {
                        // title: '处理时间',
                        title: () => {
                            return t("dataTable.listing.processingTime")
                        },
                        key: "processingModeDataTime",
                        render(row) {
                            return row.processingModeDataTime || "--"
                        }
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid",
                        render(row) {
                            return row.createid || "--"
                        }
                    },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "conductorId",
                        render(row) {
                            return row.conductorId || "--"
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
                                        type: "success",
                                        text: true,
                                        disabled: row.nowPigStatus == "1" ? false : true,
                                        onClick: () => {
                                            state.rightClickIndex = index
                                            state.rightClickRow = row
                                            // state.medicineForm = {
                                            //     id: row.id,
                                            //     pigCode: row.pigCode,
                                            //     medicationNumber: row.medicationNumber,
                                            //     operatorid: row.operatorid
                                            // }
                                            state.showAdd = true
                                            state.form.models = [{ id: row.id }]
                                            diagnosisSubmit("单个确诊", row)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.diagnosis") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "warning",
                                        // color:'#8a2be2',
                                        text: true,
                                        onClick: () => {
                                            fileListRef.value = []
                                            state.fileStorageList = []
                                            state.showUpload = true
                                            state.filesForm.id = row.id
                                            state.filesForm.nowPigStatus = store.getters[
                                                "dictionaries/getDictionarieName"
                                            ]("nowPigStatus", row.nowPigStatus)

                                            row.pictureCode && getPictureList(row)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.report") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        disabled: row.nowPigStatus == "2" ? false : true,
                                        onClick: () => {
                                            state.theConfirmedCase = row.confirmedCase
                                            state.medicineForm.ids = [row.id]
                                            getdrugs(row.confirmedCase)
                                            // 如果是单个-先调接口回显开药数据
                                            getPigMedicalInformation(row)

                                            medicineSubmit("单个开药")
                                        }
                                    },
                                    { default: () => t("dataTable.listing.prescribe") }
                                )
                            ])
                        }
                    }
                ]
            }

            const setAddChildColumns = () => {
                state.addChildColumns = [
                    {
                        title: t("dataTable.listing.serialNumber"),
                        width: 60,
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        title: t("dataTable.listing.drugCommonName"),
                        key: "medication",
                        width: 100,
                        ellipsis: {
                            tooltip: true
                        },
                        render(row) {
                            return store.getters["dictionaries/getAllDrugName"](row.medication)
                        }
                    },
                    {
                        title: t("dtables.listing.aSingleDose"),
                        key: "dose"
                    },
                    {
                        title: t("dtables.listing.drugUseFrequency"),
                        key: "frequency"
                    },
                    {
                        title: t("dtables.listing.drugUseInterval"),
                        key: "prescribingPeopletime"
                    },
                    {
                        title: t("dtables.listing.periodOfTreatment"),
                        key: "periodOfTreatment"
                    },
                    {
                        title: t("dtables.listing.instructions"),
                        key: "prescriptionInstructions",
                        width: 100,
                        render(row) {
                            return row.prescriptionInstructions || "--"
                        },
                        ellipsis: {
                            tooltip: true
                        }
                    },
                    {
                        title: t("dataTable.listing.operatingPersonnel"),
                        key: "prescribingPeople",
                        render(row) {
                            return store.getters["dictionaries/getUserName"](row.prescribingPeople)
                        }
                    },
                    {
                        title: t("dataTable.listing.actions"),
                        key: "actions",
                        fixed: "right",
                        width: 60,
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: true,
                                        onClick: () => {
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t("dataTable.listing.areYouSureToDelete"),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    state.addChildList.splice(index, 1)
                                                    deleteMedicalInfo(row)
                                                    message.success(t("message.success"))
                                                }
                                            })
                                        }
                                    },
                                    { default: () => t("dataTable.listing.delete") }
                                )
                            ])
                        }
                    }
                ]
            }

            const tabsChange = value => {
                state.search.registerStateList = store.getters["dictionaries/getDictionarieId"](
                    "registerState",
                    value
                )
                state.search.page = 1
                getpigDiagnosis()
            }
            onBeforeMount(() => {
                // 获取症状
                store.dispatch("dictionaries/getPigSymptomsList", 2)
                // 获取全部药品
                store.dispatch("dictionaries/getPigDrugsList", "")
            })
            onMounted(() => {
                // 切换
                tabsChange("待确诊")
                // getpigDiagnosis();
                getConfirmedCase()
                //设置列表
                setTableColumns()
                setMedicineColumns()
                setAddChildColumns()
            })
            return {
                tabsChange,
                ...toRefs(state),
                formRef,
                closeMedicineFrom,
                closeFrom,
                closeAddChildForm,
                clearShowUpload,
                medicineFormRef,
                getpigDiagnosis,
                getPigDiagnosisDetail,
                getDictionaries,
                getDictionarieName,
                getFarmList,
                getDormList,
                getFarmName,
                getDormName,
                getSymptomName,
                getDrugsListOptions,
                getConfirmedCase,
                diagnosisSubmit,
                medicineSubmit,
                getdrugs,
                findDrugsListOptions,
                setAddChildColumns,
                checkedRowKeys: checkedRowKeysRef,
                handleFinish,
                uploadPictures,
                getPictureList,
                deleteMedicalInfo,
                getPigMedicalInformation,
                userList: computed(() => store.state.dictionaries.userSelectList),
                fileList: fileListRef,
                bodyStyle: {
                    width: "800px"
                },
                // 确诊规则
                rules: {
                    confirmedCase: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectADiagnosisOfDisease"),
                        trigger: ["input", "blur"]
                    },
                    processingMode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAProcessingMethod"),
                        trigger: ["input", "blur"]
                    },
                    conductorId: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheOperation"),
                        trigger: ["input", "blur"]
                    }
                },
                // 开药规则
                medrules: {
                    medication: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectADrug2"),
                        trigger: ["input", "blur"]
                    },
                    frequency: {
                        required: true,
                        message: t("dtables.listing.pleaseInputFrequency")
                    },
                    dose: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheDose")
                    },
                    prescribingPeopletime: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheInterval")
                    },
                    periodOfTreatment: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterThePeriodOfTreatment")
                    },
                    prescriptionInstructions: {
                        required: false,
                        trigger: ["input", "blur"],
                        message: t("dtables.listing.pleaseEnterThePrescribingInstructions")
                    },
                    prescribingPeople: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("dtables.listing.pleaseEnterThePrescription")
                    }
                },
                // 用药登记规则
                medicineRules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["input", "blur"]
                    },
                    medicationNumber: {
                        required: true,
                        message: t("dtables.listing.pleaseAddTheDosage")
                    },
                    operatorid: {
                        required: true,
                        trigger: ["input", "blur"],
                        message: t("dtables.listing.pleaseEnterTheOperation")
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
                handleCheck(rowKeys) {
                    // state.tabSelection = rowKeys
                    checkedRowKeysRef.value = rowKeys
                },

                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = options.filters.nowDormCode
                    }
                    if (options.sourceColumn.key == "morbidityScope") {
                        state.search.morbidityScopeList = options.filters.morbidityScope
                    }
                    if (options.sourceColumn.key == "theIllnessDescribe") {
                        state.search.theIllnessDescribeList = options.filters.theIllnessDescribe
                    }
                    if (options.sourceColumn.key == "registerState") {
                        state.search.registerStateList = options.filters.registerState
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getpigDiagnosis()
                },
                //右侧详情的搜索
                handleRightFiltersChange(filters, sourceColumn) {
                    if (sourceColumn.key == "nowPigStatus") {
                        state.rightSearch.nowPigStatusList = filters.nowPigStatus
                    }
                    if (sourceColumn.key == "confirmedCase") {
                        state.rightSearch.confirmedCaseList = filters.confirmedCase
                    }
                    if (sourceColumn.key == "processingMode") {
                        state.rightSearch.processingModeList = filters.processingMode
                    }
                    getPigDiagnosisDetail(state.theRegisterCode)
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
                // 开下一种药
                nextAddChild() {
                    // 验证是否已有同名的药品
                    let hasMedicine = state.addChildList.some(
                        t => state.addChildForm.medication == t.medication
                    )
                    if (hasMedicine) {
                        return message.error(t("dtables.listing.drugsWithTheSameNameAlreadyExist"))
                    }

                    medicineFormRef.value.validate(errors => {
                        if (!errors) {
                            let newfrom = JSON.parse(JSON.stringify(state.addChildForm))
                            state.addChildList.push(newfrom)
                            closeAddChildForm()
                        } else {
                            message.error(
                                t("dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit")
                            )
                        }
                    })
                },
                // 确诊
                handleDiagnosis() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            toDiagnosis()
                        } else {
                            message.error(
                                t("dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit")
                            )
                        }
                    })
                },
                // 开药
                handlePrescribeMedicine() {
                    if (state.addChildList.length != 0) {
                        toPrescribeMedicine()
                    } else {
                        message.error(
                            t("dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit")
                        )
                    }
                },
                handleUploadChange({ fileList }) {
                    fileListRef.value = fileList
                },

                // 图片大小控制
                beforeUpload({ file }) {
                    if (file.file.size >= 5242880) {
                        message.error(t("dtables.listing.lessThan 5Mb,PleaseUploadPictures!"))
                        return false
                    }
                },
                // 图片删除
                handleRemove({ file }) {
                    state.fileStorageList.forEach((item, index) => {
                        if (file.name == item.name) {
                            state.fileStorageList.splice(index, 1)
                        }
                    })
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
