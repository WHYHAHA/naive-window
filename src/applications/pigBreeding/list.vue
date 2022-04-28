<template>
    <n-space vertical>
        <div class="p-2">
            <n-card>
                <template #header>
                    <n-space align="center" justify="space-between">
                        <div class="mr-3">{{ $t("dataTable.listing.pigHybridizationRecords") }}</div>
                        <n-space align="center">
                            <!-- 登记配种，导入导出，模板 -->
                            <n-button
                                text
                                tag="a"
                                type="primary"
                                href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-breeding-upload-template.xlsx"
                                target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button>
                            <n-button type="info" class="col-2" @click="showImport = true">{{ $t("button.dataIsIntroducedInto") }}</n-button>
                            <n-button type="info" class="col-2" @click="showExport = true">{{ $t("button.dataOutput") }}</n-button>
                            <n-button type="info" class="col-2" @click="addPigBreedOpen">{{ $t("dataTable.listing.registrationBreeding") }}</n-button>
                        </n-space>
                    </n-space>
                </template>
                <!-- 配种记录：待配种 -->
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane :name="$t('dataTable.listing.toBeMated')" :tab="$t('dataTable.listing.toBeMated')">
                        <div class="tabHeader">
                            <n-space justify="space-between">
                                <n-space align="center">
                                    <!-- 待配母猪清单 -->
                                    <div class="font-16 font-weight-bolder">{{ $t("dataTable.listing.listOfSowsToBeMatched") }}:</div>
                                    <!-- <n-date-picker
                                        v-model:value="timeList"
                                        :shortcuts="rangeShortcuts"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigBreedingList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />-->
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigBreedingList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigBreedingList()
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
                            :data="pigBreedingList"
                            :loading="showloading"
                            :scroll-x="3000"
                            v-model:search="search"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigBreedingList"
                        ></tableComponents>
                    </n-tab-pane>
                    <n-tab-pane :name="$t('dataTable.listing.bred')" :tab="$t('dataTable.listing.bred')">
                        <div class="tabHeader">
                            <n-space justify="space-between">
                                <n-space align="center">
                                    <!-- 已配母猪清单 -->
                                    <div class="font-16 font-weight-bolder">{{ $t("dtables.listing.hasForListing") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        :shortcuts="rangeShortcuts"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigBreedingList()
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
                                        @keyup.enter="getPigBreedingList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigBreedingList()
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
                            :data="pigBreedingList"
                            :loading="showloading"
                            :scroll-x="3000"
                            v-model:search="search"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigBreedingList"
                        ></tableComponents>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </div>
        <!-- 配种登记 -->
        <n-modal
            class="custom-card"
            v-model:show="addPigBreeding"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.breedingRegistration')"
            :bordered="false"
            @afterLeave="clearForm()"
            style="width: 1000px"
            :mask-closable="false"
        >
            <n-grid x-gap="20" :cols="10">
                <n-gi span="5 400:5 600:5 800:5">
                    <n-form :model="pigBreedingForm" ref="formRef" :rules="rules" label-placement="left" label-width="auto">
                        <!-- 母猪个体号 -->
                        <n-form-item path="pigCode" :label="$t('dataTable.listing.sowTheIndividual')">
                            <n-input-group>
                                <n-input v-if="status == '待配'" v-model:value="pigBreedingForm.pigCode" :style="{ width: '60%' }" :disabled="formDisabled" />
                                <!-- 登记配种 -->
                                <n-select
                                    v-else
                                    v-model:value="pigBreedingForm.pigCode"
                                    :style="{ width: '60%' }"
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                    clearable
                                    remote
                                    filterable
                                    :options="pigCodeOptions"
                                    :loading="loading"
                                    @search="handleSearch"
                                />
                                <n-button type="primary" @click="pigInfoApiSearch(1)">{{ $t("dtables.listing.search") }}</n-button>
                            </n-input-group>
                        </n-form-item>
                        <!-- 与配公猪个体号 -->
                        <n-form-item path="semenCode" :label="$t('dataTable.listing.andBoarsIndividualNumber')">
                            <n-input-group>
                                <!-- <n-input
                                    v-model:value="pigBreedingForm.semenCode"
                                    :style="{ width: '80%' }"
                                />-->
                                <n-select
                                    v-model:value="pigBreedingForm.semenCode"
                                    :style="{ width: '60%' }"
                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                    clearable
                                    remote
                                    filterable
                                    :options="pigCodeOptions"
                                    :loading="loading"
                                    @search="handleSearch"
                                />
                                <n-button type="primary" @click="pigInfoApiSearch(2)">{{ $t("dtables.listing.search") }}</n-button>
                            </n-input-group>
                        </n-form-item>
                        <n-form-item path="breedMode" :label="$t('dataTable.listing.breedingWay')">
                            <n-input-group>
                                <n-select v-model:value="pigBreedingForm.breedMode" :options="getDictionaries('breedMode')" :style="{ width: '80%' }" />
                            </n-input-group>
                        </n-form-item>
                        <n-form-item path="pregnancyCheckType" :label="$t('dataTable.listing.numberOfInsemination')" v-if="formType == 'register'">
                            <n-input
                                v-model:value="pigBreedingForm.inseminationOrder"
                                :style="{ width: '80%' }"
                                disabled
                                :placeholder="
                                    $t('dataTable.listing.pleaseClickOnTheAboveQueryNumberOfSperm')
                                "
                            />
                        </n-form-item>
                        <n-form-item path="timestamp" :label="$t('dataTable.listing.breedingDate')">
                            <n-date-picker
                                v-model:value="pigBreedingForm.timestamp"
                                type="date"
                                :is-date-disabled="disablePreviousDate"
                                :style="{ width: '80%' }"
                                actions="['now']"
                                @focus="
                                    e => {
                                        e.target.blur()
                                    }
                                "
                            />
                        </n-form-item>
                        <!-- 配种员 -->
                        <n-form-item path="staffCode" :label="$t('dataTable.listing.matingPart')">
                            <n-input-group>
                                <n-select
                                    :style="{ width: '80%' }"
                                    v-model:value="pigBreedingForm.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
                            </n-input-group>
                        </n-form-item>
                        <n-form-item path="remark" :label="$t('dataTable.listing.remark')">
                            <n-input maxlength="200" show-count v-model:value="pigBreedingForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" :style="{ width: '80%' }" />
                        </n-form-item>
                        <n-space justify="center">
                            <n-button type="info" @click="handleValidateClick" attr-type="button">{{ $t("dtables.listing.save") }}</n-button>
                            <n-button @click="addPigBreeding = false">{{ $t("dtables.listing.cancel") }}</n-button>
                        </n-space>
                    </n-form>
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
        </n-modal>
        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigBreedingRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigBreedingList
                }
            "
        ></importComponents>

        <!-- 导出 -->
        <exportComponents fileName="配种记录" apiUrl="exportBreedingTaskApi" :search="{
                ...search,
                breedingStatus: tabsIndex
            }" v-model:openExport="showExport"></exportComponents>
    </n-space>
</template>

<script>
    import { defineComponent, reactive, toRefs, h, onMounted, computed, ref } from "vue"
    import { NButton, useMessage, NPopover, NDataTable, NSpace, NIcon, NInput } from "naive-ui"
    // import { SearchOutlined as searchIcon } from '@vicons/antd'
    import {
        getPigBreedingListApi,
        registerBreedingApi,
        getInseminationOrdersApi
    } from "@/api/pigBreeding.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { HandPointerRegular as pointerIcon } from "@vicons/fa"
    import { useI18n } from "vue-i18n"

    import importComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            // searchIcon,
            exportComponents,
            importComponents,
            pigDetailComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const formRef = ref(null)
            const message = useMessage()
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                tabsIndex: 1,
                formType: "add",
                addPigBreeding: false,
                showExport: false,
                showImport: false,
                showloading: false,
                showFinding: false,
                detailTitle: "",
                columns: [],
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 品种：1.大白 2杜洛克 3长白
                    pigSourcesList: [],
                    breedingDatetimeGte: helper.formatStartTamp(Date.now()),
                    breedingDatetimeLte: helper.formatEndTamp(Date.now()),
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigBreedingForm: {
                    pigCode: undefined,
                    semenCode: undefined,
                    breedMode: undefined,
                    breedingDatetime: undefined,
                    inseminationOrder: 1,
                    staffCode: store.state.core.userInfo.id || "",
                    timestamp: Date.now(),
                    remark: undefined
                },
                pigBreedingList: [],
                spermRecordList: [],
                pigDetail: {},
                boarDetail: {},
                // 母猪编码
                pigCodeOptions: [],
                status: ""
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
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            // 异步加载(模糊后6位)
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
            // 获取选配列表
            const getPigBreedingList = async () => {
                state.search.breedingDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.breedingDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                let data = {
                    ...state.search,
                    breedingStatus: state.tabsIndex
                }
                await getPigBreedingListApi(data).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigBreedingList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async type => {
                state.showFinding = true
                state.pigCodeOptions = []
                type == 1
                    ? (state.detailTitle = t("dataTable.listing.theSowNumbers"))
                    : (state.detailTitle = t("dataTable.listing.boarNumber"))
                let code = ""
                state.detailTitle == "母猪编号："
                    ? (code = state.pigBreedingForm.pigCode)
                    : (code = state.pigBreedingForm.semenCode)

                await getPigInfoApi({ searchInfo: code }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })

                // await getPigInfoApi({ searchInfo: code }).then(res => {
                //     state.showFinding = false
                //     if (res.code == 0) {
                //         state.pigDetail = res.data
                //     }
                // })
            }
            // 登记接口
            const registerBreeding = async () => {
                state.pigBreedingForm.breedingDatetime = helper.format(state.pigBreedingForm.timestamp)
                await registerBreedingApi(state.pigBreedingForm).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.registrationSuccessfulMating"))
                        clearForm()
                        getPigBreedingList()
                        state.addPigBreeding = false
                    }
                })
            }
            const clearForm = () => {
                state.pigBreedingForm = {
                    pigCode: undefined,
                    semenCode: undefined,
                    breedMode: undefined,
                    breedingDatetime: undefined,
                    inseminationOrder: 1,
                    staffCode: store.state.core.userInfo.id || "",
                    timestamp: Date.now(),
                    remark: undefined
                }
                state.pigDetail = {}
            }
            // 根据母猪获取输精记录
            const getInseminationOrders = async id => {
                await getInseminationOrdersApi({ id: id }).then(res => {
                    if (res.code == 0) {
                        state.spermRecordList = res.data
                    }
                })
            }
            const registerRow = row => {
                clearForm()
                state.formType = "register"
                state.pigBreedingForm.pigCode = row.pigCode
                state.pigBreedingForm.semenCodeFair = row.semenCodeFair
                state.status = "待配"
                // 设置配种方式默认值
                row.breedMode
                    ? (state.pigBreedingForm.breedMode = row.breedMode)
                    : (state.pigBreedingForm.breedMode = store.getters["dictionaries/getDictionarieId"](
                          "breedMode",
                          "自产鲜精"
                      ))
                state.pigBreedingForm.inseminationOrder = Number(row.inseminationOrder) + 1
                state.addPigBreeding = true
            }
            const disabledBtn = row => {
                if (row.firstbreedingDatetime == null) {
                    return false
                }
                return !helper.dateInTwoDay(new Date(row.firstbreedingDatetime).getTime())
            }

            const renderTooltip = (trigger, row) => {
                return h(
                    NPopover,
                    {
                        onUpdateShow: isShow => {
                            if (isShow) {
                                getInseminationOrders(row.id)
                            } else {
                                state.spermRecordList = []
                            }
                        },
                        style: { padding: "0px" }
                    },
                    {
                        trigger: () => {
                            return h(NSpace, {}, [
                                h(
                                    "div",
                                    {
                                        style: { color: "#2d8cf0" }
                                    },
                                    trigger
                                ),
                                h(
                                    NIcon,
                                    {
                                        color: "#2d8cf0"
                                    },
                                    [h(pointerIcon, {}, {})]
                                )
                            ])
                        },
                        default: () => renderNDataTable()
                    }
                )
            }
            const renderNDataTable = () => {
                return h(
                    NDataTable,
                    {
                        columns: [
                            {
                                // title: '操作人',
                                title: () => {
                                    return t("dataTable.listing.operatingPersonnel")
                                },
                                key: "staffCode"
                            },
                            {
                                // title: '输精次数',
                                title: () => {
                                    return t("dataTable.listing.numberOfInsemination")
                                },
                                key: "inseminationOrder"
                            },
                            {
                                // title: '配种时间',
                                title: () => {
                                    return t("dataTable.listing.breedingTime")
                                },
                                key: "breedingDatetime"
                            }
                        ],
                        data: state.spermRecordList,
                        style: { background: "white" }
                    },
                    {}
                )
            }
            const tabsChange = value => {
                // state.search.registerStateList = store.getters["dictionaries/getDictionarieId"](
                //     "registerState",
                //     value
                // )
                state.tabsIndex = value == t("dataTable.listing.toBeMated") ? 1 : 2
                state.search.page = 1
                setTableColumns()
                getPigBreedingList()
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '母猪个体号',
                        title: () => {
                            return t("dataTable.listing.sowTheIndividual")
                        },
                        key: "pigCode"
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
                        // title: '配种方式',
                        title: () => {
                            return t("dataTable.listing.breedingMode")
                        },
                        key: "breedMode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedMode"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedMode",
                                row.breedMode
                            )
                        }
                    },
                    {
                        // title: '配种批号',
                        title: () => {
                            return t("dataTable.listing.breedingBatchNumber")
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
                                                style: "margin-bottom:10px",
                                                value: state.search.batchNumber,
                                                onUpdateValue: val => {
                                                    // 搜索条件按照给定的val
                                                    state.search.batchNumber = val
                                                }
                                            },
                                            { default: () => t("dataTable.listing.delete") }
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
                                                                    if (element.key == "batchNumber")
                                                                        element.filterOptionValue =
                                                                            undefined
                                                                })
                                                                // 调取列表数据
                                                                getPigBreedingList()
                                                                hide()
                                                            }
                                                        },
                                                        //重置
                                                        {
                                                            default: () => t("dataTable.listing.reset")
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
                                                                    if (element.key == "batchNumber")
                                                                        element.filterOptionValue =
                                                                            state.search.batchNumber
                                                                })
                                                                // 调取列表数据
                                                                getPigBreedingList()
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
                        // title: '发情日期',
                        title: () => {
                            return t("dataTable.listing.qestrusDate")
                        },
                        key: "matapplyDate",
                        render(row) {
                            return helper.timestampToTime(row.matapplyDate)
                        }
                    },
                    {
                        // title: '与配公猪个体号',
                        title: () => {
                            return t("dataTable.listing.andBoarsIndividualNumber")
                        },
                        key: "semenCode"
                    },
                    {
                        // title: '已输精次数',
                        title: () => {
                            return t("dataTable.listing.timesOfSpermInfusion")
                        },
                        key: "inseminationOrder",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["inseminationOrder"]
                        }),
                        render(row) {
                            return renderTooltip(row.inseminationOrder, row)
                        }
                    },
                    {
                        // title: '首次输精日期',
                        title: () => {
                            return t("dataTable.listing.dateOfFirstInsemination")
                        },
                        key: "firstbreedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.firstbreedingDatetime)
                        }
                    },
                    {
                        // title: '最后输精日期',
                        title: () => {
                            return t("dataTable.listing.lastInseminationDate")
                        },
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
                    },
                    {
                        // title: '输精公猪编码',
                        title: () => {
                            return t("dataTable.listing.inseminationBoarCode")
                        },
                        key: "semenCodeFair"
                    },
                    {
                        //  配种胎次
                        title: () => t("dataTable.listing.breedingChildTime"),
                        key: "parity"
                    },
                    {
                        // 当前情期
                        title: () => t("dataTable.listing.theCurrentSeason"),
                        key: "nowEstrus"
                    },
                    {
                        // 发情状态
                        title: () => t("dataTable.listing.heatState"),
                        key: "mapplyType",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "mapplyType",
                                row.mapplyType
                            )
                        }
                    },
                    {
                        // 当前胎次
                        title: () => t("dataTable.listing.theCurrentChildTime"),
                        key: "nowParity"
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
                        // title: '备注',
                        title: () => {
                            return t("dataTable.listing.remark")
                        },
                        key: "remark",
                        width: 100,
                        ellipsis: {
                            tooltip: true
                        }
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        fixed: "right",
                        render(row) {
                            return h(
                                NButton,
                                {
                                    size: "small",
                                    type: "info",
                                    text: true,
                                    disabled: disabledBtn(row),
                                    onClick: () => registerRow(row)
                                },
                                {
                                    default: () => t("dataTable.listing.registrationBreeding")
                                }
                            )
                        }
                    }
                ]
                state.tabsIndex == 2 && state.columns.pop()
            }
            onMounted(() => {
                setTableColumns()
                getPigBreedingList()
            })
            return {
                formRef,
                ...toRefs(state),
                getPigBreedingList,
                // 异步加载（模糊后6位)
                handleSearch,
                tabsChange,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getDictionaries,
                getFarmName,
                getDormName,
                pigInfoApiSearch,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [new Date().setFullYear(new Date().getFullYear() - 1), new Date().getTime()]
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: () => t("form.rules.pleaseInputTheSowBreedingNumber"),
                        trigger: ["input"]
                    },
                    breedMode: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectAWayOfBreeding")
                    },
                    semenCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheNumberBoars"),
                        trigger: ["input"]
                    },
                    timestamp: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectADateOfSperm")
                    },
                    staffCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["input"]
                    }
                },
                formDisabled: computed(() => {
                    return state.formType == "register" ? true : false
                }),
                // 登记配种
                addPigBreedOpen() {
                    state.addPigBreeding = true
                    state.formType = "add"
                    state.status = ""
                    // 设置表单配种方式默认值
                    state.pigBreedingForm.breedMode = store.getters["dictionaries/getDictionarieId"](
                        "breedMode",
                        "自产鲜精"
                    )
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
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
                    if (options.sourceColumn.key == "breedMode") {
                        state.search.breedModeList = options.filters.breedMode
                    }
                    if (options.sourceColumn.key == "inseminationOrder") {
                        state.search.inseminationOrderList = options.filters.inseminationOrder
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigBreedingList()
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            registerBreeding()
                        }
                    })
                }
            }
        }
    })
</script>
<style lang="less" scoped></style>
