<template>
    <div class="p-2">
        <n-card>
            <n-grid x-gap="12" cols="10" item-responsive>
                <n-gi span="6 600:4 600:4 800:4">
                    <div class="tabHeader font-16 font-weight-bolder">
                        <n-space justify="space-between">
                            <n-space align="center">
                                <div>{{ $t("dtables.listing.inspectionSheetList") }}</div>
                                <n-button type="info" @click="createInpectModal = true">{{
                                    $t("dtables.listing.createInspectionSubmissionForm")
                                }}</n-button>
                            </n-space>
                        </n-space>
                    </div>
                    <tableComponents
                        :columns="columns"
                        :data="pigOptionalList"
                        v-model:search="search"
                        @update:checked-row-keys="handleCheck"
                        @update:filters="handleFiltersChange"
                        @update:search="getPigInspectList"
                    ></tableComponents>

                    <!-- <n-data-table
                        :max-height="innerHeight"
                        :columns="columns"
                        :data="pigOptionalList"
                        @update:checked-row-keys="handleCheck"
                        :row-key="row => row.id"
                        @update:filters="handleFiltersChange"
                        @update:search="getPigInspectList"
                    />
                    <n-space justify="space-between">
                        <n-space justify="space-between">
                            <n-text class="pl-1">本页共：{{pigOptionalList.length}}条</n-text>
                        </n-space>
                        <n-pagination
                            v-model:page="search.page"
                            v-model:pageSize="search.limit"
                            :item-count="search.total"
                            show-size-picker
                            :page-sizes="[10, 20, 30, 40]"
                            show-quick-jumper
                            @update:page="getPigInspectList()"
                            @update:pageSize="getPigInspectList()"
                        >
                            <template #prefix="{ total }">
                                <n-text class="pl-1">合计{{(search.total) || 0}}条</n-text>
                            </template>
                        </n-pagination>
                    </n-space>-->
                </n-gi>
                <!-- 右侧 -->
                <n-gi span="4 600:4 600:4 800:6">
                    <inspectPending
                        @getData="
                            params => {
                                getData(params), (search.page = 1)
                            }
                        "
                        @refershList="
                            params => {
                                ;(search.page = 1), getPigInspectList(params)
                            }
                        "
                        :innerHeight="innerHeight - 10"
                        :originData="inspectDetailData"
                        v-if="inspectDetailData.type === 'inspectPending'"
                    />
                    <inspectComplete
                        @getData="
                            getPigInspectList(),
                                (search.page = 1),
                                (inspectDetailData = { type: false, id: '', inspectionCode: '' })
                        "
                        @refershList="
                            params => {
                                ;(search.page = 1), getPigInspectList(params)
                            }
                        "
                        :innerHeight="innerHeight - 10"
                        :originData="inspectDetailData"
                        v-if="inspectDetailData.type === 'inspectComplete'"
                    />

                    <!-- <inspectPending :innerHeight="innerHeight-10" :originData="inspectDetailData" v-if="inspectDetailData.type === 'inspectPending'" />
                    <inspectComplete :innerHeight="innerHeight-10" :originData="inspectDetailData" v-if="inspectDetailData.type === 'inspectComplete'" />-->
                    <n-empty
                        class="mt-3 empty-table"
                        v-if="!inspectDetailData.type"
                        :description="$t('dtables.listing.noContent')"
                    ></n-empty>
                </n-gi>
            </n-grid>
        </n-card>

        <!--创建送检单  -->
        <n-modal
            class="custom-card"
            transform-origin="center"
            v-model:show="createInpectModal"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.createInspectionSubmissionForm')"
            :bordered="false"
            @afterLeave="clearCreateForm()"
        >
            <n-form
                :model="createInspectForm"
                ref="createInspectRef"
                label-placement="left"
                :label-width="100"
            >
                <n-form-item
                    path="pigCodeMain"
                    :label="$t('dtables.listing.plannedInspectionDate')"
                    :require="true"
                >
                    <n-date-picker
                        v-model:value="createInspectForm.planInspectionDatetime"
                        type="date"
                        :is-date-disabled="disablePreviousDate"
                    />
                </n-form-item>
                <!-- <n-form-item path="determinationType" label="检测类型：" :require="true">
                    <n-select v-model:value="createInspectForm.determinationType" :options="measureOptions" :style="{width:'180px'}" />
                </n-form-item>-->
                <n-space justify="center">
                    <n-button type="info" @click="handleCreateInspect">{{
                        $t("dataTable.listing.confirm")
                    }}</n-button>
                    <n-button @click="createInpectModal = false">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-form>
        </n-modal>
        <!-- 修改 -->
        <n-modal
            class="custom-card"
            v-model:show="showUpdate"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.optionalBoar')"
            :bordered="false"
            @afterLeave="clearForm()"
        >
            <n-form
                :model="updateForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                :label-width="100"
            >
                <n-form-item path="pigCodeMain" :label="$t('dataTable.listing.optionalBoarMaster')">
                    <n-input-group>
                        <n-input
                            :style="{ width: '300px' }"
                            :placeholder="$t('dataTable.listing.pleaseEnterTheBoar (main)Encoding')"
                            maxlength="20"
                            v-model:value="updateForm.pigCodeMain"
                        />
                        <n-button type="primary" @click="getMatchMessage('main')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </n-form-item>
                <n-space
                    vertical
                    v-if="mainPig.breedingValue"
                    style="padding-left: 100px; margin-bottom: 30px"
                >
                    <n-text depth="3">{{
                        $t("dataTable.listing.breedingValue") + mainPig.breedingValue
                    }}</n-text>
                    <n-text depth="3">{{
                        $t("dataTable.listing.semenCode") + mainPig.repertoryAmount
                    }}</n-text>
                </n-space>
                <n-form-item path="pigCodePrepare" :label="$t('dataTable.listing.boar (prepare)')">
                    <n-input-group>
                        <n-input
                            :style="{ width: '300px' }"
                            maxlength="20"
                            :placeholder="
                                $t('dataTable.listing.pleaseEnterTheBoar (prepare)Encoding')
                            "
                            v-model:value="updateForm.pigCodePrepare"
                        />
                        <n-button type="primary" @click="getMatchMessage('prepare')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </n-form-item>
                <n-space
                    vertical
                    v-if="preparePig.breedingValue"
                    style="padding-left: 100px; margin-bottom: 30px"
                >
                    <n-text depth="3">{{
                        $t("dataTable.listing.breedingValue") + preparePig.breedingValue
                    }}</n-text>
                    <n-text depth="3">{{
                        $t("dataTable.listing.semenCode") + preparePig.repertoryAmount
                    }}</n-text>
                </n-space>
                <n-space justify="center">
                    <n-button type="info" @click="handleUpdateClick">{{
                        $t("dataTable.listing.confirm")
                    }}</n-button>
                    <n-button @click="showUpdate = false">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-form>
        </n-modal>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NSelect } from "naive-ui"
    import {
        getPigOptionalDetailApi,
        deletePigOptionalApi,
        getMatchMessageApi,
        addMatchMessageApi,
        getMatchMessagelistsApi,
        finshOptionalApi,
        getPmInspectionSheetPageList,
        createPmInspectionSheet,
        getMeasureOptionsApi,
        saveModel
    } from "@/api/pigMeasure.js"

    import tableComponents from "@/components/table.vue"

    import inspectPending from "./components/inspectPending"
    import inspectComplete from "./components/inspectComplete"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "inspectReport",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents,
            inspectPending,
            inspectComplete
        },
        setup() {
            const { t } = require("vue-i18n").useI18n()
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const state = reactive({
                inspectDetailData: {
                    type: false,
                    id: "",
                    inspectionCode: "",
                    determinationType: ""
                },
                measureOptions: [],
                innerHeight: "100",
                createInpectModal: false,
                showUpdate: false,
                showloading: false,
                timeList: [Date.now() - 86400000 * 2, Date.now()],
                search: {
                    // 送检单类型 1 采样  2耳样
                    inspectionType: 2,
                    // 选配记录日期开始时间
                    // matapplyDateGte: helper.formatStartTamp(
                    //     Date.now() - 86400000 * 2
                    // ),
                    // 选配记录日期结束时间
                    // matapplyDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    // farmidList: [],
                    // 栋舍
                    // dormCodeList: [],
                    // 选配状态
                    // matchStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                createInspectForm: {
                    // 送检单类型 @enum( CY=>1=采样送检单,EY=>2=耳样送检单 )
                    inspectionType: 2,
                    determinationType: "",
                    planInspectionDatetime: Date.now()
                },
                updateForm: {
                    // 主id
                    pigCodeMain: "",
                    // 备id
                    pigCodePrepare: ""
                },
                mainPig: {},
                preparePig: {},
                pigOptionalList: [],
                pigOptionalDetail: {
                    theSow: [{}],
                    theMaleMain: [{}],
                    alternativeBoar: [{}]
                },

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {}
            })

            const constState = {
                rules: {
                    pigCodeMain: [
                        {
                            required: true,
                            message: t("dataTable.listing.pleaseEnterTheBoar (main)Encoding"),
                            trigger: ["input"]
                        },
                        {
                            validator: () => {
                                return (
                                    state.updateForm.pigCodeMain &&
                                    state.updateForm.pigCodeMain != state.updateForm.pigCodePrepare
                                )
                            },
                            message: t("dataTable.listing.lordForEncodingIsConsistent"),
                            trigger: "input"
                        }
                    ]
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
                bodyStyle: {
                    width: "600px"
                }
            }

            let computeds = {
                getDictionarieName: computed(() => {
                    return function (dictionaryKey, id) {
                        return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                    }
                }),
                dateTransition: computed(() => {
                    return function (date) {
                        return helper.timestampToTime(new Date(date).getTime())
                    }
                }),
                dateInTwoDay: computed(() => {
                    return function (date) {
                        return helper.dateInTwoDay(new Date(date).getTime())
                    }
                })
            }

            let methods = {
                getData(data) {
                    methods.getPigInspectList()
                    state.inspectDetailData = {
                        type: "inspectComplete",
                        id: data.id,
                        inspectionCode: data.inspectionCode,
                        determinationType: data.determinationType,
                        inspectionStatus: data.inspectionStatus
                    }
                },
                // 获取检测选项
                getMeasureOptions: () => {
                    return new Promise(() => {
                        getMeasureOptionsApi({ typeStatus: 3 }).then(res => {
                            if (res.code == 0) {
                                res.data.forEach(element => {
                                    element.label = element.tname
                                    element.value = element.id
                                })
                                state.measureOptions = res.data
                                state.createInspectForm.determinationType = res.data[0].id
                                // state.addFrom.typeSettingId = res.data[0].id
                            }
                        })
                    })
                },
                // 创建送检单
                handleCreateInspect() {
                    if (!state.createInspectForm.planInspectionDatetime) {
                        message.error(t("dataTable.listing.thePlannedInspectionSubmission"))
                        return false
                    }
                    // if (!state.createInspectForm.determinationType) {
                    //     message.error('检测类型不得为空')
                    //     return false
                    // }
                    let data = JSON.parse(JSON.stringify(state.createInspectForm))
                    data.planInspectionDatetime = helper.format(data.planInspectionDatetime)
                    createPmInspectionSheet(data).then(res => {
                        if (res.code == 0) {
                            message.success(t("message.success"))
                            methods.getPigInspectList()
                            state.createInpectModal = false
                        }
                    })
                },
                // 获取送检列表
                getPigInspectList: () => {
                    state.showloading = true
                    getPmInspectionSheetPageList(state.search).then(res => {
                        state.showloading = false
                        if (res.code == 0) {
                            state.pigOptionalList = res.data.list
                            state.search.page = res.data.pageNo
                            state.search.limit = res.data.pageSize
                            state.search.total = res.data.total
                        }
                    })
                },
                // 获取选配详情
                getPigOptionalDetail: async row => {
                    let pram = {
                        pigCode: row.pigCode,
                        semenCode: row.semenCode,
                        backupSemenCode: row.backupSemenCode
                    }
                    await getPigOptionalDetailApi(pram).then(res => {
                        if (res.code == 0) {
                            if (res.data.theSow) {
                                state.pigOptionalDetail = res.data
                            } else {
                                state.pigOptionalDetail = {
                                    theSow: [{}],
                                    theMaleMain: [{}],
                                    alternativeBoar: [{}]
                                }
                            }
                        }
                    })
                },
                // 放弃选配
                deletePigOptional: async () => {
                    await deletePigOptionalApi({ id: state.leftClickId }).then(res => {
                        if (res.code == 0) {
                            message.success(t("message.success"))
                            methods.getPigInspectList()
                            state.leftClickIndex = -1
                            state.leftClickId = ""
                            state.pigOptionalDetail = {
                                theSow: [{}],
                                theMaleMain: [{}],
                                alternativeBoar: [{}]
                            }
                        }
                    })
                },

                // 弹框搜索主备时的查询
                getMatchMessage: async type => {
                    if (type == "main" && !state.updateForm.pigCodeMain) {
                        message.error(t("dataTable.listing.pleaseEnterTheBoar (main)Encoding"))
                        return false
                    }
                    if (type == "prepare" && !state.updateForm.pigCodePrepare) {
                        message.error(t("dataTable.listing.pleaseEnterTheBoar (prepare)Encoding"))
                        return false
                    }
                    await getMatchMessageApi({
                        coding:
                            type == "main"
                                ? state.updateForm.pigCodeMain
                                : state.updateForm.pigCodePrepare
                    }).then(res => {
                        if (res.code == 0) {
                            type == "main"
                                ? (state.mainPig = res.data[0])
                                : (state.preparePig = res.data[0])
                        }
                    })
                },

                // 主备信息查询
                getMatchMessagelists: async (tyoe, pigcode) => {
                    await getMatchMessagelistsApi({ semenCode: pigcode }).then(res => {
                        if (res.code == 0) {
                            if (res.data.length == 0) {
                                tyoe == "main"
                                    ? message.error(
                                          t("dataTable.listing.notQueryToTheBoar (main)Encoding")
                                      )
                                    : message.error(
                                          t("dataTable.listing.notQueryToTheBoar (prepare)Encoding")
                                      )
                            } else {
                                state.showUpdate = false
                                tyoe == "main" && res.data.length > 0
                                    ? (state.pigOptionalDetail.theMaleMain = res.data)
                                    : (state.pigOptionalDetail.alternativeBoar = res.data)

                                tyoe == "main"
                                    ? message.success(
                                          t(
                                              "dataTable.listing.hasJoinedTheRightSideOfTheBoar (main)Information"
                                          )
                                      )
                                    : message.success(
                                          t(
                                              "dataTable.listing.hasJoinedTheRightSideOfTheBoar (prepare)Information"
                                          )
                                      )
                            }
                        }
                    })
                },

                // 保存选配
                addMatchMessage: async () => {
                    let semenCode = state.pigOptionalDetail.theMaleMain
                        ? state.pigOptionalDetail.theMaleMain[0].pigCode
                        : ""

                    let backupSemenCode = state.pigOptionalDetail.alternativeBoar
                        ? state.pigOptionalDetail.alternativeBoar[0].pigCode
                        : ""

                    await addMatchMessageApi({
                        id: state.leftClickId,
                        semenCode: semenCode,
                        backupSemenCode: backupSemenCode
                    }).then(res => {
                        if (res.code == 0) {
                            methods.getPigOptionalDetail(state.leftClickRow)
                            message.success(t("message.success"))

                            methods.getPigInspectList()
                        }
                    })
                },

                // 完成本次选配
                finshOptional: async () => {
                    await finshOptionalApi({}).then(res => {
                        if (res.code == 0) {
                            message.success(t("dataTable.listing.hasBeenSubmittedOnTheSameDay"))
                            state.search.page = 1
                            methods.getPigInspectList()
                        }
                    })
                },
                // 表单验证
                repetitionPigCode: () => {
                    return (
                        state.updateForm.pigCodeMain &&
                        state.updateForm.pigCodeMain != state.updateForm.pigCodePrepare
                    )
                },
                setTableColumns: () => {
                    // const renderTooltip = (trigger, row) => {
                    //     return h(NSelect, {
                    //         value: row.determinationType,
                    //         options: state.measureOptions,
                    //         disabled: row.exsitDetail,
                    //         placeholder: '请选择',
                    //         onUpdateValue: key => {
                    //             //    在此调接口进行更新本条状态
                    //             key &&
                    //                 saveModel({
                    //                     id: row.id,
                    //                     determinationType: key
                    //                 }).then(res => {
                    //                     if (res.code == 0) {
                    //                         state.inspectDetailData = {
                    //                             type: false,
                    //                             id: '',
                    //                             inspectionCode: ''
                    //                         }
                    //                         methods.getPigInspectList()
                    //                         message.success('操作成功')
                    //                     }
                    //                 })
                    //         }
                    //     })
                    // }
                    state.columns = [
                        {
                            // title: "送检单编码",
                            title: t("dtables.listing.inspectionSheetCode"),
                            key: "inspectionCode",
                            align: "center",
                            width: 100
                        },
                        {
                            // title: "送检状态",
                            title: t("dtables.listing.inspectionStatus"),
                            key: "inspectionStatus",
                            align: "center",
                            width: 70,
                            render(row) {
                                return store.getters["dictionaries/getDictionarieName"](
                                    "inspectionStatus",
                                    row.inspectionStatus
                                )
                            }
                        },
                        {
                            // title: "计划送检日期",
                            title: t("dtables.listing.plannedInspectionDate"),
                            key: "planInspectionDatetime",
                            align: "center",
                            width: 100,
                            render(row) {
                                return helper.timestampToTime(row.planInspectionDatetime)
                            }
                        },
                        // {
                        //     title: '检测类型',
                        //     key: 'typeSettingName',
                        //     width: 100,
                        //     filter: false,
                        //     filterOptions: computed(() => {
                        //         return state.measureOptions
                        //     }),
                        //     render(row) {
                        //         return renderTooltip(row.determinationType, row)
                        //     }
                        // },
                        {
                            // title: "操作人",
                            title: t("dataTable.listing.operatingPersonnel"),
                            key: "inspectionid",
                            align: "center",
                            width: 80
                        },
                        {
                            // title: "操作",
                            title: t("dataTable.listing.actions"),
                            key: "actions",
                            align: "center",
                            fixed: "right",
                            width: 60,
                            render(row) {
                                return h(NSpace, {}, [
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,
                                            onClick: () => {
                                                state.inspectDetailData = {
                                                    type: ""
                                                }
                                                setTimeout(() => {
                                                    state.inspectDetailData = {
                                                        type:
                                                            row.inspectionStatus == 1
                                                                ? "inspectPending"
                                                                : "inspectComplete",
                                                        id: row.id,
                                                        inspectionCode: row.inspectionCode,
                                                        determinationType: row.determinationType,
                                                        inspectionStatus: row.inspectionStatus
                                                    }
                                                })

                                                // setTime

                                                // state.inspectDetailData.inspectionCode =
                                                //     row.inspectionCode
                                                // state.inspectDetailData.determinationType =
                                                //     row.determinationType
                                                // state.inspectDetailData.id = row.id
                                                // state.inspectDetailData.type =
                                                //     row.inspectionStatus == 1
                                                //         ? 'inspectPending'
                                                //         : 'inspectComplete'
                                            }
                                        },
                                        { default: () => t("dataTable.listing.check") }
                                    )
                                ])
                            }
                        }
                    ]
                },
                // 表内变化回调
                handleFiltersChange: (filters, sourceColumn) => {
                    // if (!sourceColumn) {
                    //     return false
                    // }
                    switch (filters.sourceColumn.key) {
                        case "typeSettingName":
                            state.search.typeSettingIdList = filters.filters.typeSettingName
                            break
                        case "farmCode":
                            state.search.farmCodeList = filters.filters.farmCode
                            break
                        case "nowDormCode":
                            state.search.dormCodeList = filters.filters.nowDormCode
                            break
                        case "pigSources":
                            state.search.pigSourcesList = filters.filters.pigSources
                            break
                        default:
                            break
                    }
                    state.search.page = 1
                    methods.getPigMeasureList()
                },
                // handleFiltersChange: options => {
                //     if (options.sourceColumn.key == 'farmid') {
                //         state.search.farmidList = options.filters.farmid
                //     }
                //     if (options.sourceColumn.key == 'dormCode') {
                //         state.search.dormCodeList = options.filters.dormCode
                //     }
                //     if (options.sourceColumn.key == 'matchStatus') {
                //         state.search.matchStatusList = options.filters.matchStatus
                //     }
                //     if (options.sourceColumn.key == 'indentStatus') {
                //         state.search.indentStatusList = options.filters.indentStatus
                //     }
                //     methods.getPigInspectList()
                // },
                // 日期过滤
                disablePreviousDate: ts => {
                    return ts < new Date(helper.formatStartTamp(Date.now())).getTime()
                },
                clearCreateForm() {
                    state.createInspectForm = {
                        inspectionType: 2,
                        planInspectionDatetime: Date.now(),
                        determinationType: state.measureOptions[0].id
                    }
                },
                clearForm: () => {
                    state.mainPig = {}
                    state.preparePig = {}
                    state.updateForm.pigCodeMain = ""
                    state.updateForm.pigCodePrepare = ""
                },
                // 清空右侧信息
                clearPigOptionalDetail: () => {
                    state.pigOptionalDetail = {
                        theSow: [{}],
                        theMaleMain: [{}],
                        alternativeBoar: [{}]
                    }
                    state.mainPig = {}
                    state.preparePig = {}
                    state.leftClickRow = {}
                    state.leftClickIndex = -1
                    state.updateForm = {
                        // 主id
                        pigCodeMain: "",
                        // 备id
                        pigCodePrepare: ""
                    }
                },
                // 根据主备查询对应信息 添加到右侧
                handleUpdateClick: () => {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            methods.getMatchMessagelists("main", state.updateForm.pigCodeMain)
                            if (state.updateForm.pigCodePrepare) {
                                methods.getMatchMessagelists(
                                    "prepare",
                                    state.updateForm.pigCodePrepare
                                )
                            }
                        }
                    })
                },
                deletePigOptionalBtn: () => {
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dataTable.listing.sureToDeleteThisData"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            methods.deletePigOptional()
                        }
                    })
                },
                // 完成本次选配
                finsh: () => {
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dataTable.listing.sureToSubmitTheSelectedData"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            methods.finshOptional()
                        }
                    })
                },
                // 选中行class设置
                rowClassName: (row, index) => {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                }
            }
            onMounted(() => {
                methods.getPigInspectList()
                methods.setTableColumns()
                methods.getMeasureOptions()
                state.innerHeight = document.querySelector(".window-body").clientHeight / 1.4
            })
            return {
                ...toRefs(state),
                ...constState,
                ...methods,
                ...computeds,
                formRef
            }
        }
    })
</script>
<style lang="less" scoped>
    :deep(.empty-table) {
        height: 100%;
        display: flex;
        justify-content: center;
    }
</style>
