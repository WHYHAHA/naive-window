<template>
    <div class="p-2">
        <!-- 测孕 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.pregnancyTestRecord") }}</div>
                    <n-space align="center">
                        <!-- 登记测孕，导出，上传，模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-pregnancy-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.dataIsIntroducedInto")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.dataOutput")
                        }}</n-button>
                        <n-button type="success" class="col-2" @click="showAddList = true">{{
                            $t("dataTable.listing.theListOfAdd")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="addpigPregnancy = true">{{
                            $t("dataTable.listing.RegisteredPregnancyTest")
                        }}</n-button>
                    </n-space>
                </n-space>
            </template>
            <!-- 切换已测待测 -->
            <n-card style="margin-bottom: 16px">
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待测" :tab="$t('dataTable.listing.underTest')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待测母猪清单 -->
                                    <div>{{ $t("dataTable.listing.listOfSowsToBeTested") }}:</div>
                                    <!-- <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigPregnancyList()
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
                                        @keyup.enter="getPigPregnancyList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigPregnancyList()
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
                            :data="pregnancyList"
                            :loading="showloading"
                            :scroll-x="1650"
                            v-model:search="search"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigPregnancyList"
                        ></tableComponents>
                    </n-tab-pane>
                    <n-tab-pane name="已测" :tab="$t('dataTable.listing.measured')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 已测母猪清单 -->
                                    <div>{{ $t("dataTable.listing.measuredTheSowList") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigPregnancyList()
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
                                        @keyup.enter="getPigPregnancyList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigPregnancyList()
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
                            :data="pregnancyList"
                            :loading="showloading"
                            :scroll-x="1650"
                            v-model:search="search"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigPregnancyList"
                        ></tableComponents>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-card>

        <!-- 登记测孕 -->
        <n-modal
            class="custom-card"
            v-model:show="addpigPregnancy"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.RegisteredPregnancyTest')"
            :bordered="false"
            :mask-closable="false"
            @afterLeave="
                () => {
                    clearPigDetail()
                    clearForm()
                }
            "
        >
            <n-form
                :model="pigPregnancyForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="6 400:6 600:6 800:6">
                            <n-form-item
                                path="pigCode"
                                :label="$t('dataTable.listing.sowTheIndividual')"
                                label-width="auto"
                            >
                                <n-input-group>
                                    <!-- 母猪个体号 -->
                                    <n-input
                                        v-if="status == '待测'"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        v-model:value="pigPregnancyForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :disabled="pigPregnancyForm.id ? true : false"
                                    />
                                    <n-select
                                        v-else
                                        v-model:value="pigPregnancyForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />

                                    <n-button type="primary" @click="getPigDetail">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>
                            <!-- 测孕类型 -->
                            <n-form-item
                                label-width="auto"
                                path="pregnancyCheckType"
                                :label="$t('dataTable.listing.typeOfPregnancyTest')"
                            >
                                <n-select
                                    :placeholder="$t('dtables.listing.pleaseSelectA')"
                                    :disabled="pigPregnancyForm.id ? true : false"
                                    v-model:value="pigPregnancyForm.pregnancyCheckType"
                                    :options="getDictionaries('pregnancyCheckType')"
                                    @update:value="pigPregnancyForm.pregnnancyType = ''"
                                    :style="{ width: '80%' }"
                                />
                            </n-form-item>
                            <!-- 妊娠原因说明 -->
                            <n-form-item
                                label-width="auto"
                                path="pregnnancyType"
                                :label="$t('dataTable.listing.pregnancyReasons')"
                            >
                                <n-select
                                    :placeholder="$t('dtables.listing.pleaseSelectA')"
                                    v-model:value="pigPregnancyForm.pregnnancyType"
                                    :options="getDictionaries('pregnnancyType')"
                                    :style="{ width: '80%' }"
                                />
                            </n-form-item>
                            <!-- 妊检员 -->
                            <n-form-item
                                label-width="auto"
                                path="staffCode"
                                :label="$t('dataTable.listing.aPerfectInspectionMember')"
                            >
                                <n-select
                                    :style="{ width: '80%' }"
                                    v-model:value="pigPregnancyForm.staffCode"
                                    :options="userList"
                                    filterable
                                />
                            </n-form-item>

                            <n-form-item
                                label-width="auto"
                                path="pregnnancyDate"
                                :label="$t('dataTable.listing.pregnancyTestDate')"
                            >
                                <n-date-picker
                                    v-model:value="pigPregnancyForm.pregnnancyDate"
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
                        </n-gi>
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-spin :show="showFinding">
                                <pigDetailComponents
                                    :loading="showFinding"
                                    :cardTitle="$t('dataTable.listing.theSowInformation')"
                                    :pigDetail="pigDetail"
                                    :displayOptions="['nowFarmid', 'nowDormCode', 'nowColumnCode']"
                                ></pigDetailComponents>
                            </n-spin>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button @click="addpigPregnancy = false">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导出 -->
        <exportComponents
            fileName="测孕列表"
            apiUrl="exportPigPregnancyTestApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigpregnancyTestRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigPregnancyList
                }
            "
        ></importComponents>

        <!-- 列表新增 -->
        <addForListComponent
            :ref="setItemRef"
            v-model:showAddList="showAddList"
            :formOptions="pigPregnancyForm"
            @getformlist="addBatchPigPregnancy"
        ></addForListComponent>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigPregnancyListApi,
        addPigPregnancyApi,
        addBatchPigPregnancyApi
    } from "@/api/pigPregnancy.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import addForListComponent from "@/components/addForList.vue"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            exportComponents,
            importComponents,
            pigDetailComponents,
            tableComponents,
            addForListComponent
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            let addForListRef = {}
            const setItemRef = el => {
                if (el) {
                    addForListRef = el
                }
            }
            const { t } = useI18n()
            const state = reactive({
                showUpdate: false,
                showExport: false,
                showImport: false,
                showFinding: false,
                showloading: false,
                showAddList: false,
                addpigPregnancy: false,
                columns: [],
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 测孕记录日期开始时间
                    pregnnancyDateGte: helper.formatStartTamp(Date.now() - 86400000 * 2),
                    // 测孕记录日期结束时间
                    pregnnancyDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pregnancyList: [],
                pigDetail: {},
                pigPregnancyForm: {
                    pigCode: "",
                    pregnancyCheckType: "",
                    pregnnancyType: "",
                    pregnnancyDate: Date.now(),
                    staffCode: store.state.core.userInfo.id || ""
                },
                leftClickIndex: -1,
                pregnancyCheckTypeList: [
                    {
                        label: "28D",
                        value: "28D"
                    },
                    {
                        label: "36D",
                        value: "36D"
                    }
                ],
                pregnnancyTypeList: [
                    {
                        label: "有孕",
                        value: "有孕"
                    },
                    {
                        label: "空怀",
                        value: "空怀"
                    },
                    {
                        label: "疑似",
                        value: "疑似"
                    }
                ],
                // 母猪编码
                pigCodeOptions: [],
                // 状态
                status: ""
            })
            let messageReactive = reactive(null)
            // 异步加载（模糊后6位）
            const handleSearch = async query => {
                optionsRef.value = []
                if (query.length == 6) {
                    loadingRef.value = true
                    await getfuzzyQuery({ searchInfo: query }).then(res => {
                        loadingRef.value = false
                        if (res.code == 0) {
                            // console.log(res.data)
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
            const closeLoading = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    if (dictionaryKey == "pregnnancyType") {
                        let pregnnancyTypeOptions = []

                        // 测孕结果根据 测孕类型动态变化
                        // 28天没有待测 35天没有疑似和待测 （如果测孕类型没有 也走 没有疑似和待测）
                        if (
                            state.pigPregnancyForm.pregnancyCheckType &&
                            store.getters["dictionaries/getDictionarieName"](
                                "pregnancyCheckType",
                                state.pigPregnancyForm.pregnancyCheckType
                            ) == "28D"
                        ) {
                            pregnnancyTypeOptions = store.getters["dictionaries/getDictionaries"](
                                dictionaryKey
                            ).filter(item => {
                                return item.dictName != "待测"
                            })
                        } else {
                            pregnnancyTypeOptions = store.getters["dictionaries/getDictionaries"](
                                dictionaryKey
                            ).filter(item => {
                                return item.dictName != "疑似" && item.dictName != "待测"
                            })
                        }

                        return pregnnancyTypeOptions
                    } else {
                        return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    }
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

            // 获取测孕列表
            const getPigPregnancyList = async () => {
                state.search.pregnnancyDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.pregnnancyDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigPregnancyListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pregnancyList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 保存
            const addPigPregnancy = async () => {
                let data = JSON.parse(JSON.stringify(state.pigPregnancyForm))
                data.pregnnancyDate
                    ? (data.pregnnancyDate = helper.format(data.pregnnancyDate))
                    : ""
                await addPigPregnancyApi(data).then(res => {
                    if (res.code == 0) {
                        clearForm()
                        getPigPregnancyList()
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addpigPregnancy = false
                    }
                })
            }
            // 批量保存
            const addBatchPigPregnancy = async datalist => {
                if (!messageReactive) {
                    messageReactive = window.$message.loading(
                        t("dtables.listing.inTheBatchOperation"),
                        {
                            duration: 0
                        }
                    )
                }
                let formData = {
                    models: datalist
                }
                await addBatchPigPregnancyApi(formData).then(res => {
                    closeLoading()
                    if (res.code == 0) {
                        if (res.data.badList.length == 0) {
                            window.$message.success(t("dataTable.listing.saveSuccess"))
                            state.showAddList = false
                        } else {
                            addForListRef.setTheWrongData(res.data)
                        }
                    }
                })
            }

            // 修改
            // const updatePigPregnancy = async () => {
            //     let data = JSON.parse(JSON.stringify(state.pigPregnancyForm))
            //     data.pregnnancyDate = helper.format(data.pregnnancyDate)
            //     await updatePigPregnancyApi(data).then(res => {
            //         if (res.code == 0) {
            //             state.addpigPregnancy = false
            //             clearForm()
            //             getPigPregnancyList()
            //             message.success('修改成功！')
            //         }
            //     })
            // }

            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.pigPregnancyForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true

                await getPigInfoApi({ searchInfo: state.pigPregnancyForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        if (JSON.stringify(res.data) == "{}") {
                            message.error(t("dtables.listing.thisSowNumbersNotQueryTo"))
                        }
                        state.pigDetail = res.data
                    }
                })

                // await getPigInfoApi({ searchInfo: state.pigPregnancyForm.pigCode }).then(res => {
                //     state.showFinding = false
                //     if (res.code == 0) {
                //         if (JSON.stringify(res.data) == "{}") {
                //             message.error("该母猪编号未查询到！")
                //         }
                //         state.pigDetail = res.data
                //     }
                // })
            }
            const clearForm = () => {
                state.pigPregnancyForm = {
                    pigCode: undefined,
                    pregnancyCheckType: undefined,
                    pregnnancyType: undefined,
                    pregnnancyDate: Date.now(),
                    staffCode: store.state.core.userInfo.id || ""
                }
            }
            const clearPigDetail = () => {
                state.pigDetail = {}
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '配种批号',
                        title: () => {
                            return t("dataTable.listing.breedingBatchNumber")
                        },
                        key: "batchNumber"
                    },
                    {
                        // title: '测孕类型',
                        title: () => {
                            return t("dataTable.listing.typeOfPregnancyTest")
                        },
                        key: "pregnancyCheckType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnancyCheckType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnancyCheckType",
                                row.pregnancyCheckType
                            )
                        }
                    },
                    {
                        // title: '妊娠原因说明',
                        title: () => {
                            return t("dataTable.listing.pregnancyReasons")
                        },
                        key: "pregnnancyType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnnancyType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyType",
                                row.pregnnancyType
                            )
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
                        // title: '当前状态',
                        title: () => {
                            return t("dataTable.listing.currentState")
                        },
                        key: "nowState",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["pregnnancyStatus"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyStatus",
                                row.nowState
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
                        // title: '测孕日期',
                        title: () => {
                            return t("dataTable.listing.pregnancyTestDate")
                        },
                        key: "pregnnancyDate",
                        render(row) {
                            return helper.timestampToTime(row.pregnnancyDate)
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
                        // title: '妊检人',
                        title: () => {
                            return t("dataTable.listing.aPerfectInspectionPeople")
                        },
                        key: "staffCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    }
                ]
            }
            // tabs切换
            const operationChange = val => {
                state.columns[state.columns.length - 1].key == "actions"
                    ? state.columns.splice(state.columns.length - 1, 1)
                    : ""
                switch (val) {
                    case "待测":
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
                                                helper.dateInDay(
                                                    helper.formatStartTamp(state.timeList[0])
                                                ) ||
                                                store.getters["dictionaries/getDictionarieZhName"](
                                                    "pregnnancyStatus",
                                                    row.pregnnancyStatus
                                                ) != "待测",
                                            onClick: () => {
                                                // 避免未测时 空pregnnancyDate 显示1970-01-01
                                                let rowData = JSON.parse(JSON.stringify(row))
                                                rowData.pregnnancyDate
                                                    ? rowData.pregnnancyDate
                                                    : (rowData.pregnnancyDate =
                                                          helper.formatStartTamp(
                                                              new Date().getTime()
                                                          ))
                                                state.pigPregnancyForm = {
                                                    id: rowData.id,
                                                    pigCode: rowData.pigCode,
                                                    pregnancyCheckType: rowData.pregnancyCheckType,
                                                    pregnnancyType: rowData.pregnnancyType,
                                                    pregnnancyDate: new Date(
                                                        rowData.pregnnancyDate
                                                    ).getTime(),
                                                    staffCode:
                                                        rowData.staffCode ||
                                                        store.state.core.userInfo.id
                                                }
                                                state.addpigPregnancy = true
                                                state.status = "待测"
                                            }
                                        },
                                        {
                                            default: () =>
                                                t("dataTable.listing.RegisteredPregnancyTest")
                                        }
                                    )
                                ])
                            }
                        })
                        break
                    case "已测":
                        break
                    default:
                        break
                }
            }
            // 切换tab栏
            const tabsChange = value => {
                operationChange(value)
                state.search = {
                    pigCode: "",
                    // 测孕记录日期开始时间
                    pregnnancyDateGte: helper.formatStartTamp(Date.now() - 86400000 * 2),
                    // 测孕记录日期结束时间
                    pregnnancyDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                }
                state.search.pregnnancyStatusList = store.getters["dictionaries/getDictionarieId"](
                    "pregnnancyStatus",
                    value
                )
                state.search.page = 1
                getPigPregnancyList()
            }
            onMounted(() => {
                setTableColumns()
                tabsChange("待测")
            })
            return {
                ...toRefs(state),
                getPigPregnancyList,
                // 模糊查询
                handleSearch,
                getPigDetail,
                getFarmName,
                addBatchPigPregnancy,
                tabsChange,
                getDormName,
                formRef,
                clearForm,
                clearPigDetail,
                getDictionaries,
                setItemRef,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["input"]
                    },
                    pregnancyCheckType: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectAPregnancyTestType"),
                        trigger: ["blur", "change"]
                    },
                    pregnnancyType: {
                        required: true,
                        message: () => t("form.rules.pleaseSelectAPregnancyTestType"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: () => t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["input"]
                    },
                    pregnnancyDate: {
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

                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleFiltersChange(options) {
                    // if (!options.sourceColumn) {
                    //     for (const key in state.search) {
                    //         if (helper.confirmEnding(key, 'List')) {
                    //             delete state.search[key]
                    //         }
                    //     }
                    //     state.search.page = 1
                    //     getPigPregnancyList()
                    //     return false
                    // }
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "pregnancyCheckType") {
                        state.search.pregnancyCheckTypeList = options.filters.pregnancyCheckType
                    }
                    if (options.sourceColumn.key == "pregnnancyType") {
                        state.search.pregnnancyTypeList = options.filters.pregnnancyType
                    }
                    if (options.sourceColumn.key == "nowState") {
                        state.search.pregnnancyStatusList = options.filters.nowState
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.searchstaffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getPigPregnancyList()
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addPigPregnancy()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // tabs切换
                operationChange
            }
        }
    })
</script>
<style lang=""></style>
