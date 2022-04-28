<template>
    <div class="p-2">
        <!-- 上床记录 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.goToBedRecord") }}</div>
                    <n-space align="center">
                        <!-- 登记上床、导出，上传，下载上传模板 -->
                        <!-- <n-button @click="sendSocket">模拟socket</n-button> -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-gotobed-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >

                        <n-button type="info" class="col-2" @click="mutiplePrint">
                            {{ $t("button.mutiplePrint") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showImport = true">
                            {{ $t("button.import") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">
                            {{ $t("button.export") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="addGoTobedShow = true">
                            {{ $t("dataTable.listing.registerForBed") }}
                        </n-button>
                    </n-space>
                </n-space>
            </template>
            <!-- tab分栏 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待上床" :tab="$t('dataTable.listing.toGoToBed')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待上床母猪 -->
                                    <div>{{ $t("dataTable.listing.sowReadyForBed") }}:</div>
                                    <!-- <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigGoToBedList()
                                            }
                                        "
                                        actions="['confirm']"
                                    /> -->
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigGoToBedList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigGoToBedList()
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
                    <n-tab-pane name="已上床" :tab="$t('dataTable.listing.haveToGoToBed')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 已上床母猪 -->
                                    <div>{{ $t("dataTable.listing.haveToGoToBedTheSow") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigGoToBedList()
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
                                        @keyup.enter="getPigGoToBedList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigGoToBedList()
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
                    size="medium"
                    :columns="columns"
                    :data="bedList"
                    :loading="showloading"
                    :scroll-x="1800"
                    :checkedRowKeys="tabSelection"
                    v-model:search="search"
                    rowKey="pigCode"
                    @update:checked-row-keys="handleCheck"
                    @update:filters="handleFiltersChange"
                    @update:search="getPigGoToBedList"
                ></tableComponents>
            </n-card>
        </n-card>

        <!-- 母猪上床登记 -->
        <n-modal
            class="custom-card"
            v-model:show="addGoTobedShow"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.goToRegister')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="clearForm()"
        >
            <n-form
                :model="addbedFrom"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="6 400:6 600:6 800:6">
                            <n-form-item
                                label-width="auto"
                                path="pigCode"
                                :label="$t('dataTable.listing.sowTheIndividual')"
                            >
                                <n-input-group>
                                    <n-input
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        v-model:value="addbedFrom.pigCode"
                                        v-if="addbedFrom.status == '待上床'"
                                        disabled
                                        :style="{ width: '60%' }"
                                    />
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-else
                                        v-model:value="addbedFrom.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="getPigDetail">
                                        {{ $t("dtables.listing.search") }}
                                    </n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item label-width="auto" class="feedback-wrapper-noHeight">
                                <template #label>
                                    <span>
                                        {{ $t("dataTable.listing.fieldInformation") }}
                                        <span style="color: #d03050">*</span>
                                    </span>
                                </template>
                                <n-space>
                                    <n-form-item path="inFarmid">
                                        <n-select
                                            v-model:value="addbedFrom.farmid"
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
                                            v-model:value="addbedFrom.dormCode"
                                            :options="getDormListForFarmId(addbedFrom.farmid)"
                                            style="width: 120px"
                                            @update:value="addbedFrom.columnCode = null"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectABuilding')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inColumnCode">
                                        <n-select
                                            v-model:value="addbedFrom.columnCode"
                                            :options="getColumnListForDormId(addbedFrom.dormCode)"
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
                                label-width="auto"
                                path="bedTime"
                                :label="$t('dataTable.listing.bedDate')"
                            >
                                <n-date-picker
                                    v-model:value="addbedFrom.bedTime"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                    :style="{ width: '72%' }"
                                />
                            </n-form-item>
                            <n-form-item
                                label-width="auto"
                                path="weightValue"
                                :label="$t('dataTable.listing.weight')"
                            >
                                <n-input-number
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                    v-model:value="addbedFrom.weightValue"
                                    :validator="weightValidator"
                                    :style="{ width: '72%' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>
                            <n-form-item
                                label-width="auto"
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '72%' }"
                                    v-model:value="addbedFrom.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
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
                        <n-button type="info" @click="handleValidateClick" attr-type="button">
                            {{ $t("dtables.listing.save") }}
                        </n-button>
                        <n-button @click="addGoTobedShow = false">
                            {{ $t("dtables.listing.cancel") }}
                        </n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
        <!-- 批量请求选配 -->
        <n-modal
            v-model:show="showBatchMatching"
            preset="dialog"
            :title="$t('dataTable.listing.batchForMatching')"
            :positive-text="$t('dataTable.listing.confirmTheMatching')"
            @positive-click="batchMatching"
            :negative-text="$t('dtables.listing.cancel')"
            :mask-closable="false"
        >
            <n-space vertical>
                <!-- 是否提交选中母猪的选配申请？ -->
                <div>{{ $t("dataTable.listing.whetherToCommit") }}</div>
                <n-space>
                    <div>{{ $t("dataTable.listing.selectTheCheckId") }}</div>
                    <n-space>
                        <div v-for="arry in tabSelection" :key="arry">{{ arry }}</div>
                    </n-space>
                </n-space>
            </n-space>
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
                <n-spin :show="spinShow">
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

                                <n-button @click="editFilterShow = false">
                                    {{ $t("dtables.listing.cancel") }}
                                </n-button>
                            </n-space>
                        </n-space>
                    </n-form>
                </n-spin>
            </div>
        </n-modal>

        <!-- 判断是否继续放入 -->
        <n-modal
            :style="{ width: '450px' }"
            v-model:show="demotion"
            preset="card"
            :title="$t('dataTable.listing.whetherOrNotToContinueToAdd')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-space justify="center">
                <n-button @click="initColumn" type="success" size="medium">
                    {{ $t("dataTable.listing.yes") }}
                </n-button>
                <n-button @click="demotion = false" type="info" size="medium">
                    {{ $t("dataTable.listing.no") }}
                </n-button>
            </n-space>
        </n-modal>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigBedRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigGoToBedList()
                }
            "
        ></importComponents>
        <!-- 导出 -->
        <exportComponents
            fileName="上床列表"
            apiUrl="exportPigBedRecordApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
        <printPigCardComponents ref="printPigCardRef" />
    </div>
</template>
<script>
    import {
        defineComponent,
        reactive,
        toRefs,
        onMounted,
        h,
        ref,
        computed,
        getCurrentInstance
    } from "vue"
    import { NButton, useMessage, NSpace, NInput } from "naive-ui"
    import {
        getPigGoToBedListApi,
        addPigGoToBedApi,
        getToProductionBatch,
        modifyThemodifyTheBatch
    } from "@/api/pigGoToBed.js"
    import { intoJudge } from "@/api/pigRollIn.js"
    import { getPigInfoApi, batchPrintSowCard, getfuzzyQuery } from "@/api/public.js"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"
    import helper from "@/utils/helper.js"
    import importComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import printPigCardComponents from "@/components/printPigCard.vue"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            importComponents,
            exportComponents,
            pigDetailComponents,
            tableComponents,
            printPigCardComponents
        },
        setup() {
            const observer = getCurrentInstance().appContext.config.globalProperties.$observer
            const printPigCardRef = ref(null)
            const store = useStore()
            // 加载
            let spinShow = ref(false)
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                // 是否继续转入
                demotion: false,
                editFilterShow: false,
                addOptional: false,
                addGoTobedShow: false,
                showExport: false,
                showImport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    // 上床时间 （开始时间）
                    bedTimeGte: helper.formatStartTamp(Date.now()),
                    // 上床时间 （结束时间）
                    bedTimeLte: helper.formatStartTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                addbedFrom: {
                    pigCode: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    columnCode: undefined,
                    weightValue: undefined,
                    bedTime: Date.now()
                },
                // 生产批次
                addlivingFrom: {
                    pigCode: undefined,
                    productionBatch: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                },
                bedList: [],
                pigDetail: {},
                tabSelection: [],
                ProductionBatchList: [],
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
            // 获取查情记录列表
            const getPigGoToBedList = async () => {
                state.tabSelection = []
                state.search.bedTimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.bedTimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigGoToBedListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.bedList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 保存
            const addGoTobed = async () => {
                let data = JSON.parse(JSON.stringify(state.addbedFrom))
                data.bedTime = helper.format(data.bedTime)
                await intoJudge({ dormCode: state.addbedFrom.columnCode }).then(res => {
                    if (res.data == "2") {
                        // 判断是否降级
                        state.demotion = true
                    } else {
                        toBuildingUp()
                    }
                })
            }
            // 封装调用函数
            const toBuildingUp = async () => {
                let data = JSON.parse(JSON.stringify(state.addbedFrom))
                data.bedTime = helper.format(data.bedTime)
                await addPigGoToBedApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addGoTobedShow = false
                        clearForm()
                        state.search.page = 1
                        getPigGoToBedList()
                    }
                })
            }

            // 继续入该栏位(转入栋舍)
            const initColumn = async () => {
                let data = JSON.parse(JSON.stringify(state.rollInFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await addPigGoToBedApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addGoTobedShow = false
                        state.demotion = false
                        clearForm()
                        state.search.page = 1
                        getPigGoToBedList()
                    } else {
                        window.$message(res.msg)
                        return
                    }
                })
            }

            // 编辑
            // const updateGoTobed = async () => {
            //     let data = JSON.parse(JSON.stringify(state.addbedFrom))
            //     data.bedTime = helper.format(data.bedTime)
            //     await updatePigGoToBedApi(data).then(res => {
            //         if (res.code == 0) {
            //             message.success('编辑成功！')
            //             state.addGoTobedShow = false
            //             clearForm()
            //             state.search.page = 1
            //             getPigGoToBedList()
            //         }
            //     })
            // }
            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.addbedFrom.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true

                await getPigInfoApi({ searchInfo: state.addbedFrom.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }
            const mutiplePrint = async () => {
                // 在此获取已勾选的数据，与后台交互后获得打印的实体数据，直接通过print方法传入组件
                let res = await batchPrintSowCard({
                    pigCodeList: state.tabSelection
                })
                printPigCardRef.value.print(res.data || [])
            }
            const clearForm = () => {
                state.addbedFrom = {
                    status: "",
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    columnCode: "",
                    bedTime: Date.now()
                }
                state.pigDetail = {}
                // state.optionsRef = ref([])
            }

            // 获取生产批次筛选项
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
            // 编辑筛选
            const editFilter = row => {
                state.addlivingFrom.productionBatch = row.productionBatch
                state.addlivingFrom.pigCode = row.pigCode
                state.editFilterShow = true
                getToProductionBatchList(row.productionBatch)
            }

            // 修改tab切换样式
            const operationChange = val => {
                state.columns[state.columns.length - 1].key == "actions"
                    ? state.columns.splice(state.columns.length - 1, 1)
                    : ""
                switch (val) {
                    case "待上床":
                        state.columns.push({
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
                                                    "bedStatus",
                                                    row.bedStatus
                                                ) == "已上床",
                                            onClick: () => {
                                                clearForm()
                                                state.addbedFrom = {
                                                    id: row.id,
                                                    status: "待上床",
                                                    pigCode: row.pigCode,
                                                    staffCode:
                                                        store.getters["dictionaries/getUserId"](
                                                            row.staffCode
                                                        ) || store.state.core.userInfo.id,
                                                    farmid: row.farmid,
                                                    dormCode: row.dormCode,
                                                    columnCode: row.columnCode,
                                                    bedTime: row.bedTime
                                                        ? new Date(row.bedTime).getTime()
                                                        : new Date().getTime()
                                                }
                                                state.addGoTobedShow = true
                                            }
                                        },
                                        { default: () => t("dataTable.listing.btnRegistration") }
                                    ),
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "success",
                                            text: true,
                                            onClick: async () => {
                                                // 在此获取已勾选的数据，与后台交互后获得打印的实体数据，直接通过print方法传入组件
                                                let res = await batchPrintSowCard({
                                                    pigCodeList: [row.pigCode]
                                                })
                                                printPigCardRef.value.print(res.data || [])
                                            }
                                        },
                                        { default: () => t("dataTable.listing.printSowCard") }
                                    )
                                ])
                            }
                        })
                        break
                    case "已上床":
                        state.columns.push({
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
                                            type: "success",
                                            text: true,
                                            onClick: async () => {
                                                // 在此获取已勾选的数据，与后台交互后获得打印的实体数据，直接通过print方法传入组件
                                                let res = await batchPrintSowCard({
                                                    pigCodeList: [row.pigCode]
                                                })
                                                printPigCardRef.value.print(res.data || [])
                                            }
                                        },
                                        { default: () => t("dataTable.listing.printSowCard") }
                                    ),
                                    // 修改生产批次
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "bedStatus",
                                                    row.bedStatus
                                                ) == "待上床",
                                            onClick: () => editFilter(row)
                                        },
                                        {
                                            default: () =>
                                                t("dataTable.listing.modifyTheProductionBatch")
                                        }
                                    )
                                ])
                            }
                        })
                        break

                    default:
                        break
                }
            }
            // 切换tab栏
            const tabsChange = value => {
                operationChange(value)
                state.search = {
                    // 上床时间 （开始时间）
                    bedTimeGte: helper.formatStartTamp(Date.now()),
                    // 上床时间 （结束时间）
                    bedTimeLte: helper.formatStartTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                }
                state.search.bedStatusList = store.getters["dictionaries/getDictionarieId"](
                    "bedStatus",
                    value
                )
                state.search.page = 1
                getPigGoToBedList()
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        type: "selection"
                    },
                    {
                        // title: '母猪个体号',
                        title: () => {
                            return t("dataTable.listing.sowTheIndividual")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "status",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["bedStatus"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "bedStatus",
                                row.bedStatus
                            )
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
                        // title: '栏',
                        title: () => {
                            return t("dataTable.listing.columnn")
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
                        // title: '品系',
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '配种批号',
                        title: () => t("dataTable.listing.breedingBatchNumber"),
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
                                                value: state.search.batchNumber,
                                                style: "margin-bottom:10px",
                                                onUpdateValue: val => {
                                                    // 搜索条件按照给定的val
                                                    state.search.batchNumber = val
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
                                                                        element.key == "batchNumber"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            undefined
                                                                })
                                                                // 调取列表数据
                                                                getPigGoToBedList()
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
                                                                        element.key == "batchNumber"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            state.search.batchNumber
                                                                })
                                                                // 调取列表数据
                                                                getPigGoToBedList()
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
                        // title: '配种日期',
                        title: () => {
                            return t("dataTable.listing.breedingDate")
                        },
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
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
                        // title: '生产批次',
                        title: () => {
                            return t("dataTable.listing.productionBatch")
                        },
                        key: "productionBatch"
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
                    // 胎次
                    {
                        title: () => t("dataTable.listing.parity"),
                        key: "parity"
                    }
                    // {
                    // title: '操作',
                    // title: () => {
                    //     return t("dataTable.listing.actions")
                    // },
                    // key: "actions",
                    // fixed: "right",
                    // render(row) {
                    // return h(NSpace, {}, [
                    //     h(
                    //         NButton,
                    // {
                    //     size: "small",
                    //     type: "info",
                    // text: true,
                    // disabled:
                    //     store.getters["dictionaries/getDictionarieName"](
                    //     "bedStatus",
                    //     row.bedStatus
                    // ) == "已上床",
                    // onClick: () => {
                    //     state.addbedFrom = {
                    //         id: row.id,
                    // status: row.status,
                    // pigCode: row.pigCode,
                    // staffCode:
                    // store.getters["dictionaries/getUserId"](
                    //     row.staffCode
                    // ) || store.state.core.userInfo.id,
                    // farmid: row.farmid,
                    // dormCode: row.dormCode,
                    // columnCode: row.columnCode,
                    // bedTime: row.bedTime
                    //     ? new Date(row.bedTime).getTime()
                    //     : new Date().getTime(),
                    //     }
                    //     state.addGoTobedShow = true
                    // },
                    //     },
                    //     { default: () => t("dataTable.listing.btnRegistration") }
                    // ),
                    // h(
                    //     NButton,
                    // {
                    // size: "small",
                    // type: "success",
                    // text: true,
                    // onClick: async () => {
                    // 在此获取已勾选的数据，与后台交互后获得打印的实体数据，直接通过print方法传入组件
                    // let res = await batchPrintSowCard({
                    //     pigCodeList: [row.pigCode],
                    //     })
                    //     printPigCardRef.value.print(res.data || [])
                    // },
                    //     },
                    //     { default: () => t("dataTable.listing.printSowCard") }
                    // ),
                    // 修改生产批次
                    // h(
                    //     NButton,
                    //     {
                    // size: "small",
                    // type: "info",
                    // text: true,
                    // disabled:
                    //     store.getters["dictionaries/getDictionarieName"](
                    //         "bedStatus",
                    //         row.bedStatus
                    //     ) == "待上床",
                    // onClick: () => editFilter(row),
                    //                 },
                    //                 { default: () => t("dataTable.listing.modifyTheProductionBatch") }
                    //             ),
                    //         ])
                    //     },
                    // },
                ]
            }
            // 点击保存修改
            const handlesaveTheBatch = async () => {
                spinShow.value = true
                await modifyThemodifyTheBatch({
                    pigCode: state.addlivingFrom.pigCode,
                    productionBatch: state.addlivingFrom.productionBatch
                }).then(res => {
                    if (res.code == 0) {
                        spinShow.value = false
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.editFilterShow = false
                        state.search.page = 1
                        getPigGoToBedList()
                    }
                })
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
            onMounted(() => {
                setTableColumns()
                tabsChange("待上床")
                // getPigGoToBedList()
            })
            return {
                printPigCardRef,
                ...toRefs(state),
                formRef,
                spinShow,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getPigGoToBedList,
                // 封装函数调用
                toBuildingUp,
                // 异步加载(模糊后6位)
                handleSearch,
                initColumn,

                operationChange,
                tabsChange,
                handlesaveTheBatch,
                getPigDetail,
                getFarmName,
                getDormName,
                getDictionaries,
                getDormListForFarmId,
                getColumnListForDormId,
                mutiplePrint,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["blur", "change"]
                    },
                    farmid: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectACourt"),
                        trigger: ["blur", "change"]
                    },
                    dormCode: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectABuilding"),
                        trigger: ["blur", "change"]
                    },
                    columnCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheColumnNumber"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    bedTime: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectACheckDate")
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
                weightValidator: number => {
                    return /^[1-9][0-9]{1,2}([0-8])?(\.\d{1,2})?$|^(\d{4})$/.test(number)
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
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
                    if (options.sourceColumn.key == "status") {
                        state.search.bedStatusList = options.filters.status
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getPigGoToBedList()
                },

                farmChange() {
                    state.addbedFrom.dormCode = null
                    state.addbedFrom.columnCode = null
                },
                // 保存
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addGoTobed()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                sendSocket() {
                    observer.$emit("SOCKET_SEND", "asd")
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
