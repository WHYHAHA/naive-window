<template>
    <div class="p-2">
        <!-- 流产记录 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.abortionRecord") }}</div>
                    <n-space align="center">
                        <!-- 登记、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-abortion-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.dataIsIntroducedInto")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.dataOutput")
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
                            >{{ $t("dataTable.listing.registeredAbortion") }}</n-button
                        >
                        <!-- <n-button type="info" class="col-2" @click="deleteAll()">批量删除</n-button> -->
                    </n-space>
                </n-space>
            </template>

            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center" justify="space-between">
                    <n-space align="center">
                        <div>{{ $t("dataTable.listing.abortionRecord") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="getPigAbortion"
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
                            @keyup.enter="getPigAbortion"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigAbortion()
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
            <n-data-table
                :columns="columns"
                :data="pigAbortionList"
                :loading="showloading"
                :scroll-x="1300"
                v-model:checked-row-keys="checkedRowKeys"
                :row-key="row => row"
                @update:filters="handleFiltersChange"
                :row-class-name="rowClassName"
                @update:search="getPigAbortion"
            />
            <n-card content-style="padding: 10px;">
                <n-space justify="space-between" align="center">
                    <n-text class="pl-1"
                        >{{ $t("dataTable.listing.footerPrefix") }}：{{ pigAbortionList.length
                        }}{{ $t("dataTable.listing.footerSuffix") }}</n-text
                    >&nbsp;
                    <n-pagination
                        v-model:page="search.page"
                        v-model:pageSize="search.limit"
                        :item-count="search.total"
                        show-size-picker
                        :page-sizes="[10, 20, 30, 40]"
                        show-quick-jumper
                        @update:page="getPigAbortion()"
                        @update:pageSize="getPigAbortion()"
                    >
                        <template #prefix="{ itemCount }"
                            >{{ $t("dataTable.listing.altogether") }} {{ itemCount }}
                            {{ $t("dataTable.listing.footerSuffix") }}</template
                        >
                    </n-pagination>
                </n-space>
            </n-card>
        </n-card>

        <!-- 流产登记 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.abortionIsRegistered')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="abortionForm"
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
                                    <!-- <n-input :style="{ width: '200px' }" :placeholder="$t('dtables.listing.pleaseEnterTheSowEncoding')" v-model:value="abortionForm.pigCode" :disabled="abortionForm.id?true:false" /> -->
                                    <!-- 母猪个体号 -->
                                    <n-select
                                        v-model:value="abortionForm.pigCode"
                                        :style="{ width: '73%' }"
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
                                </n-input-group>
                            </n-form-item>

                            <n-form-item
                                path="abortionDatetime"
                                :label="$t('dataTable.listing.abortionDate')"
                            >
                                <n-date-picker
                                    :style="{ width: '255px' }"
                                    v-model:value="abortionForm.abortionDatetime"
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

                            <n-form-item :path="remark" :label="$t('dataTable.listing.remark')">
                                <n-input
                                    v-model:value="abortionForm.remark"
                                    type="textarea"
                                    maxlength="200"
                                    show-count
                                    :placeholder="$t('dtables.listing.pleaseEnterANote')"
                                    style="width: 255px"
                                />
                            </n-form-item>

                            <!-- <n-form-item path="staffCode" label="操作人：">
                                <n-select :style="{ width: '255px' }" v-model:value="VaccineForm.staffCode" :options="userList" filterable placeholder="请输入操作人" />
                            </n-form-item>-->
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
            apiUrl="batchPigAbortionRegisterApi"
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="流产列表"
            apiUrl="exportPigAbortionRegisterApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    // h,
    import { defineComponent, reactive, toRefs, onMounted, ref, computed, h } from "vue"
    // NButton,NSpace, useDialog
    import { useMessage, NInput, NSpace, NButton } from "naive-ui"
    import {
        getPigAbortionRegisterApi,
        addPigAbortionRegisterApi,
        deletePigAbortionRegisterApi
    } from "@/api/pigAbortion.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import eximportComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    // import tableComponents from '@/components/table.vue'

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            eximportComponents,
            exportComponents,
            pigDetailComponents
        },
        setup() {
            const checkedRowKeysRef = ref([])
            const store = useStore()
            const message = useMessage()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            // const dialog = useDialog()
            const { t } = useI18n()
            const formRef = ref(null)
            const state = reactive({
                showAdd: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    breedingBatchNumberList: [],
                    pigCode: "",
                    // 下床记录日期开始时间abortionDatetime
                    abortionDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 下床记录日期结束时间
                    abortionDatetimeLte: helper.formatEndTamp(Date.now()),
                    nowFarmidList: [],
                    nowDormCodeList: [],
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                abortionForm: {
                    pigCode: undefined,
                    abortionDatetime: Date.now(),
                    remark: undefined
                    // staffCode: undefined
                },
                pigAbortionList: [],
                pigDetail: {},
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

            // 获取流产列表
            const getPigAbortion = async () => {
                state.search.abortionDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.abortionDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigAbortionRegisterApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigAbortionList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存
            const addPigAbortion = async () => {
                let data = JSON.parse(JSON.stringify(state.abortionForm))
                data.abortionDatetime = helper.format(data.abortionDatetime)
                await addPigAbortionRegisterApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigAbortion()
                    }
                })
            }

            // 删除
            const deletePigAbortion = async row => {
                // checkedRowKeysRef.value
                let data = { models: [] }
                if (checkedRowKeysRef.value && checkedRowKeysRef.value.length != 0) {
                    checkedRowKeysRef.value.forEach(item => {
                        data.models.push({ id: item.id })
                    })
                } else {
                    data = { models: [{ id: row.id }] }
                }

                await deletePigAbortionRegisterApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.deleteTheSuccess"))
                        state.search.page = 1
                        checkedRowKeysRef.value = []
                        getPigAbortion()
                    }
                })
            }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.abortionForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                if (state.abortionForm.pigCode == 6) {
                    await getPigInfoApi({ searchInfo6: state.abortionForm.pigCode }).then(res => {
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
                    await getPigInfoApi({ searchInfo: state.abortionForm.pigCode }).then(res => {
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

            const clearForm = () => {
                state.abortionForm = {
                    pigCode: undefined,
                    abortionDatetime: Date.now(),
                    remark: undefined
                }
                state.pigDetail = {}
            }

            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
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
            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })

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
                        // title: '猪场',
                        title: () => {
                            return t("dataTable.listing.pig")
                        },
                        key: "nowFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.nowFarmid)
                        }
                    },
                    {
                        // title: '猪舍',
                        title: () => {
                            return t("dataTable.listing.piggery")
                        },
                        key: "nowDormCode",
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
                        // title: '配种日期',
                        title: () => {
                            return t("dataTable.listing.breedingDate")
                        },
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        },
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigSources"]
                        })
                    },
                    {
                        // 配种批号
                        title: () => {
                            return t("dataTable.listing.breedingBatchNumber")
                        },
                        key: "breedingBatchNumber",
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
                                                value: state.search.breedingBatchNumberList,
                                                style: "margin-bottom:10px",
                                                onUpdateValue: val => {
                                                    // 搜索条件按照给定的val
                                                    state.search.breedingBatchNumberList = val
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
                                                                state.search.breedingBatchNumberList =
                                                                    ""
                                                                // 页数到1
                                                                state.search.page = 1
                                                                state.columns.forEach(element => {
                                                                    if (
                                                                        element.key ==
                                                                        "breedingBatchNumber"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            undefined
                                                                })
                                                                // 调取列表数据
                                                                getPigAbortion()
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
                                                                        "breedingBatchNumber"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            state.search.breedingBatchNumberList
                                                                })
                                                                // 调取列表数据
                                                                getPigAbortion()
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
                        // title: '胎次',
                        title: () => {
                            return t("dataTable.listing.parity")
                        },
                        key: "parity"
                    },
                    {
                        // title: '流产日期',
                        title: () => {
                            return t("dataTable.listing.abortionDate")
                        },
                        key: "abortionDatetime",
                        render(row) {
                            return helper.timestampToTime(row.abortionDatetime)
                        }
                    },
                    {
                        // title: '妊检员',
                        title: () => {
                            return t("dataTable.listing.aPerfectInspectionMember")
                        },
                        key: "createid",
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
                    //         return h(NSpace, {}, [
                    //             h(
                    //                 NButton,
                    //                 {
                    //                     size: 'small',
                    //                     type: 'error',
                    //                     text: true,
                    //                     onClick: () => {
                    //                         dialog.warning({
                    //                             title: '警告',
                    //                             content: '确定删除该条数据么？',
                    //                             positiveText: '确定',
                    //                             negativeText: '取消',
                    //                             onPositiveClick: () => {
                    //                                 deletePigAbortion(row)
                    //                             }
                    //                         })
                    //                     }
                    //                 },
                    //                 { default: () => '删除' }
                    //             )
                    //         ])
                    //     }
                    // }
                ]
            }
            onMounted(() => {
                getPigAbortion()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                // 模糊查询(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getPigAbortion,
                pigInfoApiSearch,
                getDictionaries,
                getFarmName,
                getDormName,
                getDictionarieName,
                clearForm,
                deletePigAbortion,
                addPigAbortion,
                checkedRowKeys: checkedRowKeysRef,
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
                    abortionDatetime: {
                        required: true,
                        message: t("form.rules.pleaseSelectAMiscarriage")
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
                // handleCheck(rowKeys) {
                //     state.tabSelection = rowKeys
                // },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addPigAbortion()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                deleteAll() {
                    if (checkedRowKeysRef.value && checkedRowKeysRef.value.length == 0) {
                        message.error(t("dtables.listing.pleaseSelectAtLeastOneData"))
                    } else {
                        deletePigAbortion()
                    }
                },
                handleFiltersChange(filters, sourceColumn) {
                    if (sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = filters.nowFarmid
                    }
                    if (sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = filters.nowDormCode
                    }
                    if (sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = filters.pigSources
                    }
                    if (sourceColumn.key == "breedingBatchNumber") {
                        state.search.breedingBatchNumberList = filters.breedingBatchNumber
                    }
                    state.search.page = 1
                    getPigAbortion()
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
<style lang="less" scoped></style>
