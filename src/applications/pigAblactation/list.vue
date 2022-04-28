<template>
    <div class="p-2">
        <!-- 断奶登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.weaningRegistration") }}</div>
                    <n-space align="center">
                        <!-- 登记、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-ablactation-upload-template.xlsx"
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
                                    addPigAblactation = true
                                    clearForm()
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
                        <!-- 仔猪断奶清单 -->
                        <div>{{ $t("dataTable.listing.weaningListOfPiglets") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigAblactationList()
                                }
                            "
                            actions="['confirm']"
                        />
                    </n-space>
                    <div>
                        <n-input
                            :placeholder="$t('dataTable.listing.searchThePigletCoding')"
                            autosize
                            style="min-width: 300px"
                            clearable
                            v-model:value="search.pigCodeLike"
                            @keyup.enter="getPigAblactationList"
                            @clear="
                                () => {
                                    search.pigCodeLike = ''
                                    getPigAblactationList()
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
                :data="ablactationList"
                :loading="showloading"
                :scroll-x="1800"
                v-model:search="search"
                @update:filters="handleFiltersChange"
                @update:search="getPigAblactationList"
            ></tableComponents>
        </n-card>

        <!-- 登记断奶&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="addPigAblactation"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.pigletsWeanedRegistration')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="ablactationForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <!-- 仔猪个体号 -->
                            <n-form-item
                                path="pigCode"
                                :label="$t('dataTable.listing.pigletsIndividualNumber')"
                            >
                                <n-input-group>
                                    <n-input
                                        v-model:value="ablactationForm.pigCode"
                                        :disabled="ablactationForm.id ? true : false"
                                    />
                                    <n-button type="primary" @click="getPigDetail">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item
                                path="weaningDate"
                                :label="$t('dataTable.listing.weaningDate')"
                            >
                                <n-date-picker
                                    v-model:value="ablactationForm.weaningDate"
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
                            <n-form-item path="pigWhere" :label="$t('dtables.listing.where')">
                                <n-select
                                    v-model:value="ablactationForm.pigWhere"
                                    :options="getDictionaries('pigWhere')"
                                />
                            </n-form-item>
                            <n-form-item path="weightValue" :label="$t('dataTable.listing.weight')">
                                <n-input-number
                                    v-model:value="ablactationForm.weightValue"
                                    :validator="weightValidator"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>
                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '280px' }"
                                    v-model:value="ablactationForm.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dtables.listing.pigletsInformation')"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'pigBornDate',
                                    'littlePigBatch'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button @click="addPigAblactation = false">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigSpFarmweanApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigAblactationList()
                }
            "
        ></importComponents>
        <!-- 导出 -->
        <exportComponents
            fileName="断奶登记"
            apiUrl="exportPigSpFarmweanApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigAblactationListApi,
        addPigAblactationApi,
        updatePigAblactationApi
    } from "@/api/pigAblactation.js"
    import { useStore } from "vuex"
    import { getPigInfoApi } from "@/api/public.js"
    import { useI18n } from "vue-i18n"

    import importComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

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
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                addPigAblactation: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCodeLike: "",
                    // 断奶记录日期开始时间
                    spFarmweanTimeGte: helper.formatStartTamp(Date.now()),
                    // 断奶记录日期结束时间
                    spFarmweanTimeLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    breedingLevelList: [],
                    pigWhereList: [],
                    productionTypeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                ablactationForm: {
                    pigCode: undefined,
                    weaningDate: Date.now(),
                    pigWhere: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                },
                ablactationList: [],
                pigDetail: {},
                tabSelection: [],
                columns: []
            })

            // 获取断奶列表
            const getPigAblactationList = async () => {
                state.search.spFarmweanTimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.spFarmweanTimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigAblactationListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.ablactationList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 保存
            const addPigAblactation = async () => {
                let data = JSON.parse(JSON.stringify(state.ablactationForm))
                data.weaningDate = helper.format(data.weaningDate)
                await addPigAblactationApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.addPigAblactation = false
                        state.pigDetail = {}
                        getPigAblactationList()
                    }
                })
            }

            //修改
            const updatePigAblactation = async () => {
                let data = JSON.parse(JSON.stringify(state.ablactationForm))
                data.weaningDate = helper.format(data.weaningDate)
                await updatePigAblactationApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.modifyTheSuccess"))
                        clearForm()
                        state.addPigAblactation = false
                        state.pigDetail = {}
                        getPigAblactationList()
                    }
                })
            }

            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.ablactationForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                await getPigInfoApi({ searchInfo: state.ablactationForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }

            const clearForm = () => {
                state.ablactationForm = {
                    pigCode: undefined,
                    weaningDate: Date.now(),
                    pigWhere: undefined,
                    staffCode: store.state.core.userInfo.id || ""
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
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '登记日期',
                        title: () => {
                            return t("dataTable.listing.dateOfRegistration")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        }
                    },
                    {
                        // title: '仔猪编码',
                        title: () => {
                            return t("dataTable.listing.pigletCode")
                        },
                        key: "pigCode"
                    },
                    // {
                    //     title: '生产批次',
                    //     key: 'productionBatch'
                    // },
                    {
                        // title: '出生日期',
                        title: () => {
                            return t("dataTable.listing.dateOfBirth")
                        },
                        key: "pigBornDate",
                        render(row) {
                            return helper.timestampToTime(row.pigBornDate)
                        }
                    },
                    {
                        // title: '断奶日期',
                        title: () => {
                            return t("dataTable.listing.weaningDate")
                        },
                        key: "weaningDate",
                        render(row) {
                            return helper.timestampToTime(row.weaningDate)
                        }
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
                        // title: '育种等级',
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
                        // title: '猪场',
                        title: () => {
                            return t("dataTable.listing.pig")
                        },
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
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.nowDormcode)
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
                        // title: '断奶去向',
                        title: () => {
                            return t("dataTable.listing.weaningDestination")
                        },
                        key: "pigWhere",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigWhere"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigWhere",
                                row.pigWhere
                            )
                        }
                    },
                    // {
                    //     title: '生产类型',
                    //     key: 'productionType',
                    //     filter: true,
                    //     filterOptions: computed(() => {
                    //         return store.state.dictionaries.dictionaries['productionType']
                    //     }),
                    //     render(row) {
                    //         return store.getters['dictionaries/getDictionarieName']('productionType', row.productionType)
                    //     }
                    // },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "staffCode"
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
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        disabled: helper.dateInDay(row.createDatetime),
                                        onClick: () => {
                                            state.ablactationForm = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                weaningDate: new Date(row.weaningDate).getTime(),
                                                pigWhere: row.pigWhere,
                                                staffCode:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.staffCode
                                                    ) || store.state.core.userInfo.id
                                            }
                                            state.addPigAblactation = true
                                        }
                                    },
                                    { default: () => t("dtables.listing.theEditor") }
                                )
                            ])
                        }
                    }
                ]
            }
            onMounted(() => {
                getPigAblactationList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigAblactationList,
                getPigDetail,
                getDictionaries,
                getFarmName,
                getDormName,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheNumberSwine"),
                        trigger: ["blur", "change"]
                    },
                    pigWhere: {
                        required: true,
                        message: t("form.rules.pleaseSelectADestination"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    weaningDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectADateOfWeaning")
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
                    return /^[1-9][0-9]{0,3}?(\.\d{1,2})?$|^(\d{4})$/.test(number)
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.ablactationForm.id ? updatePigAblactation() : addPigAblactation()
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
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "pigWhere") {
                        state.search.pigWhereList = options.filters.pigWhere
                    }
                    if (options.sourceColumn.key == "productionType") {
                        state.search.productionTypeList = options.filters.productionType
                    }
                    state.search.page = 1
                    getPigAblactationList()
                }
            }
        }
    })
</script>
<style lang=""></style>
