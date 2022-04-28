<template>
    <!-- 分娩记录 -->
    <div class="p-2">
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.reproductionRecords") }}</div>
                    <n-space align="center">
                        <!-- 添加分娩 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-childbirth-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("dataTable.listing.downloadUploadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.import")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showAdd = true">{{
                            $t("dataTable.listing.addDelivery")
                        }}</n-button>
                        <n-popselect
                            :options="exportButton"
                            trigger="click"
                            @update:value="popselectChange"
                        >
                            <n-button type="info" :disabled="selectRows.length == 0">{{
                                value || "导出耳牌模板数据"
                            }}</n-button>
                        </n-popselect>
                    </n-space>
                </n-space>
            </template>

            <n-grid x-gap="12" cols="10" item-responsive>
                <!-- 左边 -->
                <n-gi span="6 400:6 600:6 800:6">
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space align="center" justify="space-between">
                            <n-space align="center">
                                <!-- 当前分娩母猪 -->
                                <div>{{ $t("dataTable.listing.reproductionRecords") }}:</div>
                                <n-date-picker
                                    v-model:value="timeList"
                                    type="daterange"
                                    :shortcuts="rangeShortcuts"
                                    :is-date-disabled="disablePreviousDate"
                                    @update:value="
                                        () => {
                                            search.page = 1
                                            getPigChildBirthList()
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
                                    @keyup.enter="getPigChildBirthList"
                                    @clear="
                                        () => {
                                            search.pigCode = ''
                                            getPigChildBirthList()
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
                        size="small"
                        :columns="columns"
                        :data="pigChildBirthList"
                        :loading="showloading"
                        :scroll-x="2000"
                        :clickIndex="leftClickIndex"
                        v-model:search="search"
                        row-key="row"
                        :checkedRowKeys="selectRows"
                        @update:checked-row-keys="handleCheck"
                        @update:filters="handleFiltersChange"
                        @update:search="getPigChildBirthList"
                    ></tableComponents>
                </n-gi>
                <!-- 右边 -->
                <n-gi span="4 400:4 600:4 800:4">
                    <div class="p-2 tabHeader">
                        <n-space align="center">
                            <div class="font-16 font-weight-bolder">
                                {{ $t("dtables.listing.details") }}:
                            </div>

                            <!-- 产仔登记 -->
                            <n-button
                                type="info"
                                v-if="
                                    leftClickIndex >= 0 && dateInTwoDay(leftClickRow.childbirthDate)
                                "
                                @click="showAddChild = true"
                                >{{ $t("dataTable.listing.giveBirthRegistration") }}</n-button
                            >
                        </n-space>
                    </div>
                    <n-descriptions
                        v-if="leftClickIndex >= 0"
                        label-placement="left"
                        bordered
                        :column="2"
                        size="small"
                    >
                        <n-descriptions-item :label="$t('dataTable.listing.sowCode')">{{
                            pigChildBirthDetail.detail.pigCode || $t("dataTable.listing.notYet")
                        }}</n-descriptions-item>
                        <n-descriptions-item :label="$t('dataTable.listing.dateOfDelivery')">{{
                            pigChildBirthDetail.detail.childbirthDate ||
                            $t("dataTable.listing.notYet")
                        }}</n-descriptions-item>
                        <n-descriptions-item :label="$t('dataTable.listing.midwifery')">{{
                            getAssistStr(pigChildBirthDetail.detail.assist) ||
                            $t("dataTable.listing.notYet")
                        }}</n-descriptions-item>
                        <n-descriptions-item :label="$t('dataTable.listing.birthAttendants')">{{
                            pigChildBirthDetail.detail.staffCode || $t("dataTable.listing.notYet")
                        }}</n-descriptions-item>
                    </n-descriptions>
                    <n-card v-else>
                        <n-empty
                            :description="
                                $t(
                                    'dataTable.listing.noRecord,PleaseClickOnTheLeftSideOfTheCheckDetails'
                                )
                            "
                            class="mt-3"
                        ></n-empty>
                    </n-card>
                    <div class="mt-2" v-if="leftClickIndex >= 0">
                        <n-data-table
                            size="small"
                            :columns="detailColumns"
                            :data="pigChildBirthDetail.list"
                            :pagination="pagination"
                            :row-class-name="rowDetailClassName"
                            :row-key="row => row.id"
                            @update:checked-row-keys="handleCheck"
                        />
                    </div>
                </n-gi>
            </n-grid>

            <!-- 母猪生产登记 -->
            <!-- 分娩 -->
            <n-modal
                class="custom-card"
                v-model:show="showAdd"
                preset="card"
                :style="bodyStyle"
                :title="$t('dataTable.listing.childbirth')"
                :bordered="false"
                :mask-closable="false"
            >
                <n-form
                    :model="addForm"
                    ref="formRef"
                    :rules="rules"
                    label-placement="left"
                    label-width="auto"
                >
                    <n-space vertical :size="20">
                        <n-grid x-gap="12" :cols="10">
                            <n-gi span="6 400:6 600:6 800:6">
                                <n-form-item path="pigCode" :label="$t('dtables.listing.theSow')">
                                    <n-input-group>
                                        <!-- 母猪编号 -->
                                        <n-select
                                            v-model:value="addForm.pigCode"
                                            :style="{ width: '60%' }"
                                            :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                            clearable
                                            remote
                                            filterable
                                            :options="pigCodeOptions"
                                            :loading="loading"
                                            @search="handleSearch"
                                        />
                                        <!-- <n-input v-model:value="addForm.pigCode" :disabled="addForm.id?true:false" /> -->
                                        <n-button type="primary" @click="getPigDetail">{{
                                            $t("dtables.listing.search")
                                        }}</n-button>
                                    </n-input-group>
                                </n-form-item>
                                <!-- 分娩类型 -->
                                <n-form-item
                                    path="productionType"
                                    :label="$t('dataTable.listing.deliveryType')"
                                >
                                    <n-select
                                        v-model:value="addForm.productionType"
                                        :options="getDictionaries('productionType')"
                                        :style="{ width: '75%' }"
                                    />
                                </n-form-item>
                                <!-- 分娩日期 -->
                                <n-form-item
                                    path="childbirthDate"
                                    :label="$t('dataTable.listing.dateOfDelivery')"
                                >
                                    <n-date-picker
                                        v-model:value="addForm.childbirthDate"
                                        type="date"
                                        :is-date-disabled="disablePreviousDate"
                                        actions="['now']"
                                        @focus="
                                            e => {
                                                e.target.blur()
                                            }
                                        "
                                        :style="{ width: '75%' }"
                                    />
                                </n-form-item>
                                <!-- 操作人 -->
                                <n-form-item
                                    path="staffCode"
                                    :label="$t('dataTable.listing.operatingPersonnel')"
                                >
                                    <n-select
                                        :style="{ width: '75%' }"
                                        v-model:value="addForm.staffCode"
                                        :options="userList"
                                        filterable
                                        :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                    />
                                </n-form-item>
                                <n-form-item
                                    path="assist"
                                    :label="$t('dataTable.listing.midwifery')"
                                >
                                    <n-checkbox v-model:checked="addForm.assist" />
                                </n-form-item>
                            </n-gi>
                            <n-gi span="4 400:4 600:4 800:4">
                                <pigDetailComponents
                                    :loading="showFinding"
                                    :cardTitle="$t('dataTable.listing.theSowInformation')"
                                    :pigDetail="pigDetail"
                                    :displayOptions="[
                                        'nowFarmid',
                                        'nowDormCode',
                                        'nowColumnCode',
                                        'dueDate',
                                        'matherBatch'
                                    ]"
                                ></pigDetailComponents>
                            </n-gi>
                        </n-grid>
                        <n-space justify="center">
                            <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                                $t("dtables.listing.save")
                            }}</n-button>
                            <n-button type="info" @click="birthRegistration()" attr-type="button">{{
                                $t("dataTable.listing.giveBirthRegistration")
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

            <!-- 产仔登记 -->
            <n-modal
                class="custom-card"
                v-model:show="showAddChild"
                preset="card"
                :style="bodyStyle"
                :title="$t('dataTable.listing.giveBirthRegistration')"
                :bordered="false"
                :mask-closable="false"
            >
                <n-form
                    :model="addChildForm"
                    ref="childformRef"
                    :rules="childRules"
                    label-placement="left"
                    :label-width="100"
                >
                    <n-space vertical :size="20">
                        <n-scrollbar style="max-height: 300px">
                            <n-data-table
                                :columns="addChildColumns"
                                :data="addChildList"
                                :pagination="pagination"
                                :row-class-name="childRowClassName"
                                :size="small"
                            />
                        </n-scrollbar>

                        <n-grid x-gap="20" :cols="2">
                            <n-gi>
                                <n-form-item path="pigCode" :label="$t('dtables.listing.theSow')">
                                    <n-input-group>
                                        <n-input v-model:value="addChildForm.pigCode" disabled />
                                    </n-input-group>
                                </n-form-item>
                                <n-form-item path="bornStatus" :label="$t('dtables.listing.state')">
                                    <n-select
                                        v-model:value="addChildForm.bornStatus"
                                        :options="getDictionaries('bornStatus')"
                                    />
                                </n-form-item>

                                <n-form-item
                                    path="bornDate"
                                    :label="$t('dataTable.listing.farrowingTime')"
                                >
                                    <n-date-picker
                                        v-model:value="addChildForm.bornDate"
                                        type="datetime"
                                        actions="['now','confirm']"
                                        :is-date-disabled="disablePreviousDate"
                                        @focus="
                                            e => {
                                                e.target.blur()
                                            }
                                        "
                                    />
                                </n-form-item>
                            </n-gi>
                            <n-gi>
                                <n-form-item
                                    path="columnCode"
                                    :label="$t('dataTable.listing.childbirthColumn')"
                                >
                                    <n-input-group>
                                        <n-input v-model:value="addChildForm.columnCode" disabled />
                                    </n-input-group>
                                </n-form-item>
                                <n-form-item
                                    path="gender"
                                    :label="$t('dataTable.listing.gender')"
                                    v-if="
                                        addChildForm.bornStatus != 1 && addChildForm.bornStatus != 3
                                    "
                                >
                                    <n-select
                                        v-model:value="addChildForm.gender"
                                        :options="getDictionaries('gender')"
                                    />
                                </n-form-item>
                            </n-gi>
                        </n-grid>
                        <n-space justify="center" align="center" vertical :size="20">
                            <n-space align="center">
                                <n-text>{{ $t("dataTable.listing.addTheNumber") }}</n-text>
                                <n-input-number
                                    v-model:value="addNumber"
                                    :min="1"
                                    :max="99"
                                    :validator="integerValidator"
                                />
                            </n-space>
                            <n-space>
                                <n-button type="info" @click="nextAddChild" attr-type="button">{{
                                    $t("dataTable.listing.theNext")
                                }}</n-button>
                                <n-button
                                    @click="
                                        () => {
                                            showAddChild = false
                                            clearAddChildForm()
                                        }
                                    "
                                    >{{ $t("dtables.listing.cancel") }}</n-button
                                >
                            </n-space>
                        </n-space>
                        <n-space justify="center">
                            <!-- 全部保存 -->
                            <n-button
                                type="info"
                                @click="handleValidateAddChildClick"
                                attr-type="button"
                                >{{ $t("dtables.listing.allSubmitted") }}</n-button
                            >
                        </n-space>
                    </n-space>
                </n-form>
            </n-modal>

            <!-- 产仔编辑 -->
            <n-modal
                class="custom-card"
                v-model:show="showUpdate"
                preset="card"
                :style="bodyStyle"
                :title="$t('dataTable.listing.giveBirthRegistration')"
                :bordered="false"
                :mask-closable="false"
            >
                <n-form
                    :model="addChildForm"
                    ref="childformRef"
                    :rules="childRules"
                    label-placement="left"
                    :label-width="100"
                >
                    <n-space vertical :size="30">
                        <n-grid x-gap="20" :cols="2">
                            <n-gi>
                                <n-form-item path="pigCode" :label="$t('dtables.listing.theSow')">
                                    <n-input-group>
                                        <n-input v-model:value="addChildForm.pigCode" disabled />
                                    </n-input-group>
                                </n-form-item>
                                <n-form-item path="bornStatus" :label="$t('dtables.listing.state')">
                                    <n-select
                                        v-model:value="addChildForm.bornStatus"
                                        :options="getDictionaries('bornStatus')"
                                    />
                                </n-form-item>

                                <n-form-item
                                    path="bornDate"
                                    :label="$t('dataTable.listing.farrowingTime')"
                                >
                                    <n-date-picker
                                        v-model:value="addChildForm.bornDate"
                                        type="datetime"
                                        actions="['now','confirm']"
                                        :is-date-disabled="disablePreviousDate"
                                        @focus="
                                            e => {
                                                e.target.blur()
                                            }
                                        "
                                    />
                                </n-form-item>
                            </n-gi>
                            <n-gi>
                                <n-form-item
                                    path="columnCode"
                                    :label="$t('dataTable.listing.childbirthColumn')"
                                >
                                    <n-input-group>
                                        <n-input v-model:value="addChildForm.columnCode" disabled />
                                    </n-input-group>
                                </n-form-item>
                                <n-form-item path="gender" :label="$t('dataTable.listing.gender')">
                                    <n-select
                                        v-model:value="addChildForm.gender"
                                        :options="getDictionaries('gender')"
                                    />
                                </n-form-item>
                            </n-gi>
                        </n-grid>
                        <n-space justify="center">
                            <n-button type="info" @click="updateChild" attr-type="button">{{
                                $t("dtables.listing.save")
                            }}</n-button>
                            <n-button
                                @click="
                                    () => {
                                        showUpdate = false
                                        clearAddChildForm()
                                    }
                                "
                                >{{ $t("dtables.listing.cancel") }}</n-button
                            >
                        </n-space>
                    </n-space>
                </n-form>
            </n-modal>

            <!-- 修改生产批次 -->
            <n-modal
                v-model:show="editFilterShow"
                :mask-closable="false"
                preset="card"
                style="width: 600px"
                :title="$t('dataTable.listing.adjustTheBatchNo')"
                :bordered="false"
                @afterLeave="clearForm()"
            >
                <div style="padding: 15px">
                    <n-form label-width="auto" :model="addlivingFrom" label-placement="left">
                        <n-space vertical :size="20">
                            <!-- 母猪 -->
                            <n-form-item
                                label-width="auto"
                                path="pigCode"
                                :label="$t('dtables.listing.theSow')"
                            >
                                <n-input-group>
                                    <n-input
                                        :style="{ width: '300px' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        v-model:value="addlivingFrom.pigCode"
                                        disabled="true"
                                    />
                                </n-input-group>
                            </n-form-item>
                            <!-- 生产批次 -->
                            <n-form-item
                                label-width="auto"
                                path="productionBatch"
                                :label="$t('dataTable.listing.productionBatch')"
                            >
                                <n-select
                                    :style="{ width: '300px' }"
                                    v-model:value="addlivingFrom.productionBatch"
                                    :options="ProductionBatchList"
                                    filterable
                                />
                            </n-form-item>
                            <!-- 操作人 -->
                            <n-form-item
                                label-width="auto"
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '300px' }"
                                    v-model:value="addlivingFrom.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
                            </n-form-item>
                            <!-- 按钮 -->
                            <n-space justify="center">
                                <n-button
                                    type="info"
                                    @click="handlesaveTheBatch"
                                    attr-type="button"
                                    >{{ $t("dtables.listing.save") }}</n-button
                                >
                                <n-button @click="editFilterShow = false">{{
                                    $t("dtables.listing.cancel")
                                }}</n-button>
                            </n-space>
                        </n-space>
                    </n-form>
                </div>
            </n-modal>

            <!-- 判断是否降级 -->
            <n-modal
                v-model:show="demotionYesOrNo"
                :mask-closable="false"
                style="width: 500px"
                preset="card"
                :bordered="false"
                :title="$t('dataTable.listing.theSowBreedWithDeformity')"
            >
                <n-space justify="center">
                    <n-button type="success" @click="determine">{{
                        $t("dataTable.listing.determine")
                    }}</n-button>
                    <n-button type="info" @click="determine">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-modal>

            <!-- 查看仔猪耳牌 -->
            <n-modal
                v-model:show="viewTheEarCardShow"
                :mask-closable="false"
                preset="card"
                style="width: 700px"
                title="查看仔猪"
                :bordered="false"
            >
                <n-data-table :columns="pigletscolumns" :data="earCardData" max-height="500" />
            </n-modal>
            <!-- 导入 -->
            <importComponents
                v-model:openImport="showImport"
                apiUrl="batchAddPigProductionRecordApi"
                @getlist="
                    () => {
                        search.page = 1
                        getPigChildBirthList
                    }
                "
            ></importComponents>

            <!-- 导出 -->
            <exportComponents
                fileName="分娩列表"
                apiUrl="exportPigProductionRecordApi"
                :search="search"
                v-model:openExport="showExport"
            ></exportComponents>

            <!-- 标贴数据表 导出 -->
            <exportComponents
                fileName="标贴数据表"
                apiUrl="exportLabelDataApi"
                :search="{ pigLabelDataExcelDtoList: selectRows }"
                v-model:openExport="showExportLabelData"
            ></exportComponents>
            <!-- 雕刻记录表 导出 -->
            <exportComponents
                fileName="雕刻数据表"
                apiUrl="exportCarvingDataApi"
                :search="{ pigCarvingDataExcelDtoList: selectRows }"
                v-model:openExport="showExportCarvingData"
            ></exportComponents>
            <!-- 分娩记录表 导出 -->
            <exportComponents
                fileName="雕刻数据表"
                apiUrl="exportDeliveryRecordApi"
                :search="{ pigDeliveryRecordExcelDtoList: selectRows }"
                v-model:openExport="showExportDeliveryRecord"
            ></exportComponents>
        </n-card>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NTime } from "naive-ui"
    import {
        getPigChildBirthListApi,
        addPigChildBirthApi,
        getPigFileDetailApi,
        getPigChildBirthDetailApi,
        deletePigChildBirthApi,
        updateChildBirthApi
    } from "@/api/pigChildBirth.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    // import { getToProductionBatch, modifyThemodifyTheBatch } from "@/api/pigGoToBed.js"
    import { getToProductionBatch } from "@/api/pigGoToBed.js"
    import { modifyThemodifyTheBatchs, gegetearBrandtApi } from "@/api/pigChildBirth.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import importComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        name: "pigChildbirth",
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
            const dialog = useDialog()
            const formRef = ref(null)
            const childformRef = ref(null)
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const { t } = useI18n()
            const state = reactive({
                showImport: false,
                editFilterShow: false,
                showExport: false,
                showUpdate: false,
                showAdd: false,
                showAddChild: false,
                showFinding: false,
                showloading: false,
                showExportLabelData: false,
                showExportCarvingData: false,
                showExportDeliveryRecord: false,
                addChildType: "mother",
                // 判断降级
                demotionYesOrNo: false,
                search: {
                    pigCode: "",
                    childbirthDateGte: "",
                    childbirthDateLte: "",
                    farmidList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    breedingLevelList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                // 标贴数据表、雕刻记录表、分娩记录表 参数
                selectRows: [],
                // 生产批次
                addlivingFrom: {
                    pigCode: undefined,
                    productionBatch: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                },
                timeList: [Date.now() - 86400000 * 2, Date.now()],
                pigChildBirthList: [],
                pigChildBirthDetail: {
                    detail: {},
                    list: []
                },
                // 添加数量
                addNumber: 1,
                addForm: {
                    pigCode: "",
                    productionType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    childbirthDate: Date.now(),
                    assist: false,
                    models: []
                },
                addChildForm: {
                    pigCode: "",
                    columnCode: "",
                    bornDate: Date.now(),
                    gender: undefined,
                    bornStatus: undefined
                },
                exportButton: [
                    {
                        label: "导出标贴数据表",
                        value: "1"
                    },
                    {
                        label: "导出雕刻记录表",
                        value: "2"
                    },
                    {
                        label: "导出分娩记录表",
                        value: "3"
                    }
                ],
                addChildList: [],
                columns: [],
                detailColumns: [],
                addChildColumns: [],
                pigDetail: {},
                selectIds: [],
                leftClickRow: {},
                leftClickId: "",
                leftClickIndex: -1,
                rightClickIndex: -1,
                childClickIndex: -1,
                ProductionBatchList: [],
                // 母猪编码
                pigCodeOptions: [],
                viewTheEarCardShow: false,
                // 查看仔猪耳牌内列表数据
                pigletscolumns: [],
                // 查看耳牌数据
                earCardData: []
            })
            // 确定
            const determine = () => {
                state.demotionYesOrNo = false
                state.showUpdate = false
                state.showAdd = false
                state.showAddChild = false
                clearAddForm()
                clearAddChildForm()
                state.addChildList = []
                state.search.page = 1
                getPigChildBirthList()
                if (state.leftClickId) {
                    getPigChildBirthDetail({ id: state.leftClickId })
                }
            }
            const dateInTwoDay = computed(() => {
                return function (date) {
                    return helper.dateInTwoDay(new Date(date).getTime())
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
            const getDictionaries = computed(() => {
                return function (key) {
                    return store.getters["dictionaries/getDictionaries"](key)
                }
            })
            const getAssistStr = computed(() => {
                return function (val) {
                    let assistStr = ""
                    switch (val) {
                        case "1":
                            assistStr = "助产"
                            break
                        case "2":
                            assistStr = "未助产"
                            break

                        default:
                            break
                    }
                    return assistStr
                }
            })
            const clearAddForm = () => {
                state.addForm = {
                    pigCode: "",
                    productionType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    childbirthDate: Date.now(),
                    assist: ""
                }
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

            const clearAddChildForm = () => {
                state.addChildForm.bornDate = Date.now()
                state.addChildForm.gender = ""
                state.addChildForm.bornStatus = ""
                state.childClickIndex = -1
            }
            // 获取分娩列表
            const getPigChildBirthList = async () => {
                state.search.childbirthDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.childbirthDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigChildBirthListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigChildBirthList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存母猪
            const addPigChildBirth = async () => {
                let data = JSON.parse(JSON.stringify(state.addForm))
                if (state.addChildType == "mother") {
                    data.childbirthDate = helper.format(data.childbirthDate)
                    if (data.assist) {
                        data.assist = "1"
                    } else {
                        data.assist = "2"
                    }
                } else {
                    data.id = state.leftClickId
                }

                // 添加产仔仔猪
                data.models = JSON.parse(JSON.stringify(state.addChildList))
                // 所有日期更改
                data.models.forEach(element => {
                    element.bornDate = helper.format(element.bornDate)
                })

                await addPigChildBirthApi(data).then(res => {
                    if (res.code == 0 && res.data != 2) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.showAdd = false
                        state.showAddChild = false

                        clearAddForm()
                        clearAddChildForm()
                        state.addChildList = []
                        state.search.page = 1
                        getPigChildBirthList()

                        if (state.leftClickId) {
                            getPigChildBirthDetail({ id: state.leftClickId })
                        }
                    }
                    if (res.code == 0 && res.data == 2) {
                        state.demotionYesOrNo = true
                    }
                })
            }
            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.addForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                await getPigInfoApi({ searchInfo: state.addForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }

            // 生产记录详情
            const getPigChildBirthDetail = async row => {
                await getPigChildBirthDetailApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        state.pigChildBirthDetail.list = res.data
                    }
                })
            }
            // 编辑单条产仔记录
            const updatePigChildBirth = async () => {
                let newfrom = JSON.parse(JSON.stringify(state.addChildForm))
                newfrom.bornDate = helper.format(newfrom.bornDate)
                await updateChildBirthApi(newfrom).then(res => {
                    if (res.code == 0) {
                        state.showUpdate = false
                        clearAddForm()
                        clearAddChildForm()
                        getPigChildBirthDetail({ id: state.leftClickId })
                        message.success(t("dataTable.listing.successfullyChangedThisRecord"))
                    }
                })
            }
            // 删除单条产仔记录
            const deletePigChildBirth = async row => {
                await deletePigChildBirthApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        getPigChildBirthList()
                        getPigChildBirthDetail({ id: state.leftClickId })
                        message.error(t("dataTable.listing.successfullyChangedThisRecord"))
                    }
                })
            }

            const setTableColumns = () => {
                ;(state.columns = [
                    {
                        type: "selection"
                    },
                    {
                        // title: '生产时间',
                        title: () => {
                            return t("dataTable.listing.productionTime")
                        },
                        key: "childbirthDate",
                        render(row) {
                            return helper.timestampToTime(row.childbirthDate)
                        }
                    },
                    {
                        // title: '母猪编码',
                        title: () => {
                            return t("dataTable.listing.sowCode")
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
                        // title: '产床编码',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
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
                        // title: '品质',
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
                        // title: '配种批次',
                        title: () => {
                            return t("dataTable.listing.breedingBatch")
                        },
                        key: "batchNumber"
                    },
                    {
                        // title: '预产期',
                        title: () => {
                            return t("dataTable.listing.dueDate")
                        },
                        key: "dueDate",
                        render(row) {
                            return helper.timestampToTime(row.dueDate)
                        }
                    },
                    {
                        // title: '分娩类型',
                        title: () => {
                            return t("dataTable.listing.deliveryType")
                        },
                        key: "productionType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["productionType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "productionType",
                                row.productionType
                            )
                        }
                    },
                    {
                        // title: '产仔数',
                        title: () => {
                            return t("dataTable.listing.farrowingCount")
                        },
                        key: "litterSize"
                    },
                    {
                        // title: '生产批次',
                        title: () => {
                            return t("dataTable.listing.productionBatch")
                        },
                        key: "productionBatch"
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
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.pigChildBirthDetail = {
                                                detail: {
                                                    pigCode: row.pigCode,
                                                    childbirthDate: row.childbirthDate,
                                                    assist: row.assist,
                                                    staffCode:
                                                        row.staffCode ||
                                                        store.state.core.userInfo.id
                                                },
                                                list: []
                                            }

                                            state.addChildForm.pigCode = row.pigCode
                                            state.addChildForm.columnCode = row.columnCode
                                            state.addChildType = ""
                                            state.leftClickIndex = index
                                            state.leftClickId = row.id
                                            state.leftClickRow = row
                                            state.rightClickIndex = -1
                                            getPigChildBirthDetail(row)
                                        }
                                    },
                                    { default: () => t("dataTable.listing.viewDetails") }
                                ),
                                // 修改生产批次
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "success",
                                        text: true,
                                        onClick: () => editFilter(row)
                                    },
                                    {
                                        default: () =>
                                            t("dataTable.listing.modifyTheProductionBatch")
                                    }
                                ),
                                // 查看仔猪耳牌
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "warning",
                                        text: true,
                                        onClick: () => viewTheEarCard(row)
                                    },
                                    {
                                        default: () => "查看仔猪耳牌"
                                    }
                                )
                            ])
                        }
                    }
                ]),
                    (state.pigletscolumns = [
                        {
                            title: "仔猪档案编码",
                            key: "pigCode"
                        },
                        {
                            title: "是否建档",
                            key: "whetherFiling",
                            render(row) {
                                return row.whetherFiling == "1" ? "是" : "否"
                            }
                        }
                    ])
                // ,
                // (state.earCardData = [
                //     {
                // title: "pigCode",
                // key: "pigCode"
                // },
                // {
                //     title: "whetherFiling",
                // key: "whetherFilinsg",
                // render(row) {
                //     return row.whetherFiling == "1" ? "是" : "否"
                //         }
                //     }
                // ])
            }
            const editFilter = row => {
                state.addlivingFrom.productionBatch = row.productionBatch
                state.addlivingFrom.pigCode = row.pigCode
                state.editFilterShow = true
                getToProductionBatchList(row.productionBatch)
            }
            // 点击修改生产批次
            const getToProductionBatchList = async productionBatch => {
                await getToProductionBatch({ productionBatch: productionBatch }).then(res => {
                    if (res.code == 0) {
                        res.data?.forEach(
                            t => ((t.label = t.batchNumber), (t.value = t.batchNumber))
                        )
                        state.ProductionBatchList = res.data
                    }
                })
            }
            // 点击保存修改
            const handlesaveTheBatch = async () => {
                await modifyThemodifyTheBatchs({
                    pigCode: state.addlivingFrom.pigCode,
                    productionBatch: state.addlivingFrom.productionBatch,
                    newProductionBatch: state.addlivingFrom.productionBatch
                }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.editFilterShow = false
                        state.search.page = 1
                        getPigChildBirthList()
                    }
                })
            }
            const setDetailTableColumns = () => {
                state.detailColumns = [
                    {
                        // title: '时间',
                        title: () => {
                            return t("dataTable.listing.time")
                        },
                        key: "bornDate"
                    },
                    {
                        // title: '性别',
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "status",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "bornStatus",
                                row.status
                            )
                        }
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "actions",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        disabled: !helper.dateInTwoDay(
                                            new Date(state.leftClickRow.childbirthDate).getTime()
                                        ),
                                        onClick: () => {
                                            state.rightClickIndex = index
                                            state.addChildForm.id = row.id
                                            state.addChildForm.pigCode = row.motherPigCode
                                            state.addChildForm.columnCode = row.columnCode
                                            state.addChildForm.gender = row.gender
                                            state.addChildForm.bornStatus = row.status
                                            state.addChildForm.bornDate = new Date(
                                                row.bornDate
                                            ).getTime()

                                            state.showUpdate = true
                                        }
                                    },
                                    { default: () => t("dtables.listing.theEditor") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        disabled: !helper.dateInTwoDay(
                                            new Date(state.leftClickRow.childbirthDate).getTime()
                                        ),
                                        onClick: () => {
                                            state.rightClickIndex = index
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t(
                                                    "dataTable.listing.sureToDeleteRecordsWhichBreed"
                                                ),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    deletePigChildBirth(row)
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
            const setAddChildColumns = () => {
                state.addChildColumns = [
                    {
                        // title: '序号',
                        title: () => {
                            return t("dataTable.listing.serialNumber")
                        },
                        render(row, index) {
                            return index + 1
                        }
                    },
                    {
                        // title: '母猪编号',
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '分娩栏位',
                        title: () => {
                            return t("dataTable.listing.childbirthColumn")
                        },
                        key: "columnCode"
                    },
                    {
                        // title: '性别',
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "bornStatus",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "bornStatus",
                                row.bornStatus
                            )
                        }
                    },
                    {
                        // title: '产仔时间',
                        title: () => {
                            return t("dataTable.listing.farrowingTime")
                        },
                        key: "bornDate",
                        render(row) {
                            return h(NTime, {
                                time: row.bornDate
                            })
                        }
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
                                        type: "error",
                                        onClick: () => {
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t("dataTable.listing.sureToDelete"),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    state.addChildList.splice(index, 1)
                                                    clearAddChildForm()
                                                    message.success(
                                                        t("dataTable.listing.deletedThisMessage")
                                                    )
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
            // 查看仔猪耳牌
            const viewTheEarCard = async row => {
                state.viewTheEarCardShow = true
                let id = row.id
                await gegetearBrandtApi({ id: id }).then(res => {
                    if (res.code == 0) {
                        console.log(res.data)
                        state.earCardData = res.data
                    }
                })
            }
            onMounted(() => {
                getPigChildBirthList()
                setTableColumns()
                setDetailTableColumns()
                setAddChildColumns()
            })
            return {
                ...toRefs(state),
                getPigChildBirthList,
                // 异步加载(模糊后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                determine,
                //
                getPigDetail,
                formRef,
                childformRef,
                getFarmName,
                handlesaveTheBatch,
                getDormName,
                getDictionaries,
                getAssistStr,
                clearAddChildForm,
                dateInTwoDay,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                pagination: {
                    pageSize: 10
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["blur", "change"]
                    },
                    productionType: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectATypeOfDelivery"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    childbirthDate: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectADeliveryDate")
                    }
                },
                childRules: {
                    pigCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheSowEncoding"),
                        trigger: ["blur", "change"]
                    },
                    columnCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheDelivery"),
                        trigger: ["blur", "change"]
                    },
                    gender: {
                        required: true,
                        message: t("form.rules.pleaseSelectAGender"),
                        trigger: ["blur", "change"]
                    },
                    bornStatus: {
                        required: true,
                        message: t("form.rules.pleaseSelectAState"),
                        trigger: ["blur", "change"]
                    },
                    bornDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectALitterTime")
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
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            // 判断提交
                            addPigChildBirth()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                handleValidateAddChildClick() {
                    // 详情中添加猪仔
                    if (state.addChildList.length > 0) {
                        // 判断提交
                        addPigChildBirth()
                    } else {
                        message.error(t("dataTable.listing.atLeastAddAPiglet"))
                    }
                },
                popselectChange(value) {
                    switch (value) {
                        case "1":
                            state.showExportLabelData = true
                            break
                        case "2":
                            state.showExportCarvingData = true
                            break
                        case "3":
                            state.showExportDeliveryRecord = true
                            break

                        default:
                            break
                    }
                },
                // 分娩登记中点击产仔登记事件
                birthRegistration() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            // 获取栏位
                            getPigFileDetailApi({ pigCode: state.addForm.pigCode }).then(res => {
                                if (res.code == 0) {
                                    if (JSON.stringify(res.data) == "{}") {
                                        message.error(
                                            t("dataTable.listing.thisSowNumbersNotQueryTo")
                                        )
                                    }
                                    state.showAddChild = true
                                    state.addChildType = "mother"
                                    state.addChildForm.pigCode = state.addForm.pigCode
                                    state.addChildForm.columnCode = res.data[0].nowColumnCode
                                }
                            })
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 添加下一个仔猪
                nextAddChild() {
                    childformRef.value.validate(errors => {
                        if (!errors) {
                            for (let index = 0; index < state.addNumber; index++) {
                                let newfrom = JSON.parse(JSON.stringify(state.addChildForm))
                                state.addChildList.push(newfrom)
                            }
                            state.addNumber = 1
                            clearAddChildForm()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 修改仔猪
                updateChild() {
                    childformRef.value.validate(errors => {
                        if (!errors) {
                            updatePigChildBirth()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 右侧多选
                handleCheck(rowKeys) {
                    state.selectRows = rowKeys
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 详情选中行class设置
                rowDetailClassName(row, index) {
                    if (index == state.rightClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 产仔登记
                childRowClassName(row, index) {
                    if (index == state.childClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 整数验证
                integerValidator(val) {
                    return /^[1-9]\d*$/.test(val)
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
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "productionType") {
                        state.search.productionTypeList = options.filters.productionType
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getPigChildBirthList()
                },
                viewTheEarCard
            }
        }
    })
</script>
<style lang=""></style>
