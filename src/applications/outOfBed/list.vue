<template>
    <div class="p-2">
        <!-- 下床登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.outOfBedToRegister") }}</div>
                    <n-space align="center">
                        <!-- 登记下床、导入、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-outofbed-upload-template.xlsx"
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
                                    showAdd = true
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
                    <!-- 母猪下床登记 -->
                    <n-space align="center">
                        <div>{{ $t("dataTable.listing.sowOutOfBedToRegister") }}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigOutOfBedList()
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
                            @keyup.enter="getPigOutOfBedList"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigOutOfBedList()
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
                :data="bedList"
                :loading="showloading"
                :scroll-x="1800"
                v-model:search="search"
                @update:filters="handleFiltersChange"
                @update:search="getPigOutOfBedList"
            ></tableComponents>
        </n-card>

        <!-- 登记断奶&编辑 -->
        <!-- 下床登记 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.outOfBedToRegister')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="outOfBedForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dtables.listing.theSow')">
                                <n-input-group>
                                    <!-- <n-input v-model:value="outOfBedForm.pigCode" :disabled="outOfBedForm.id?true:false" :placeholder="$t('dtables.listing.pleaseEnterThe')" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="outOfBedForm.pigCode"
                                        :style="{ width: '70%' }"
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
                            <!-- 下床日期 -->
                            <n-form-item
                                path="outOfBedDate"
                                :label="$t('dataTable.listing.dateOfBed')"
                            >
                                <n-date-picker
                                    v-model:value="outOfBedForm.outOfBedDate"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                    :style="{ width: '90%' }"
                                />
                            </n-form-item>
                            <!-- 下床类型 -->
                            <n-form-item
                                path="outBedType"
                                :label="$t('dataTable.listing.typeOfOutOfBed')"
                            >
                                <n-select
                                    v-model:value="outOfBedForm.outBedType"
                                    :options="getDictionaries('outBedType')"
                                    style="width: 120px"
                                    :placeholder="$t('dtables.listing.pleaseSelectA')"
                                    :style="{ width: '90%' }"
                                />
                            </n-form-item>
                            <!-- 栏位信息 -->
                            <n-form-item class="feedback-wrapper-noHeight">
                                <template #label>
                                    <span>
                                        {{ $t("dataTable.listing.fieldInformation") }}
                                        <span style="color: #d03050">*</span>
                                    </span>
                                </template>
                                <n-space>
                                    <n-form-item path="inFarmid">
                                        <n-select
                                            v-model:value="outOfBedForm.inFarmid"
                                            :options="getDictionaries('farmList')"
                                            @change="farmChange"
                                            style="width: 260px"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectACourt')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inDormCode">
                                        <n-select
                                            v-model:value="outOfBedForm.inDormCode"
                                            :options="getDormListForFarmId(outOfBedForm.inFarmid)"
                                            @update:value="outOfBedForm.inColumnCode = null"
                                            style="width: 120px"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectABuilding')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inColumnCode">
                                        <n-select
                                            v-model:value="outOfBedForm.inColumnCode"
                                            :options="
                                                getColumnListForDormId(outOfBedForm.inDormCode)
                                            "
                                            style="width: 120px"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseEnterTheField')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                </n-space>
                            </n-form-item>
                            <!-- 体重 -->
                            <n-form-item path="weightValue" :label="$t('dataTable.listing.weight')">
                                <n-input-number
                                    v-model:value="outOfBedForm.weightValue"
                                    :validator="weightValidator"
                                    :style="{ width: '90%' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>
                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '90%' }"
                                    v-model:value="outOfBedForm.staffCode"
                                    :options="userList"
                                    filterable
                                    placeholder="请输入操作人"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dataTable.listing.theSowInformation')"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'pigBornDate',
                                    'matherBatch'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button @click="showAdd = false">{{
                            $t("dtables.listing.cancel")
                        }}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 判断是否继续放入 -->
        <n-modal
            :style="{ width: '450px' }"
            v-model:show="demotion"
            preset="card"
            title="栋舍容量已达80%，是否继续添加"
            :bordered="false"
            :mask-closable="false"
        >
            <n-space justify="center">
                <n-button @click="initColumn" type="success" size="medium">{{
                    $t("dataTable.listing.yes")
                }}</n-button>
                <n-button @click="demotion = false" type="info" size="medium">{{
                    $t("dataTable.listing.no")
                }}</n-button>
            </n-space>
        </n-modal>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigOutOfBedApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigOutOfBedList()
                }
            "
        ></importComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="下床列表"
            apiUrl="exportPigOutOfBedApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage } from "naive-ui"
    import {
        getPigOutOfBedListApi,
        addPigOutOfBedApi,
        updatePigOutOfBedApi
    } from "@/api/pigOutOfBed.js"
    import { intoJudge } from "@/api/pigRollIn.js"
    import { useStore } from "vuex"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        name: "pigFormula",
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
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                // 是否继续入
                demotion: false,
                showAdd: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 下床记录日期开始时间
                    outOfBedTimeGte: helper.formatStartTamp(Date.now()),
                    // 下床记录日期结束时间
                    outOfBedTimeLte: helper.formatEndTamp(Date.now()),
                    farmidList: [],
                    dormCodeList: [],
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                outOfBedForm: {
                    pigCode: undefined,
                    outOfBedDate: Date.now(),
                    staffCode: store.state.core.userInfo.id || "",
                    inColumnCode: undefined,
                    weightValue: undefined
                },
                bedList: [],
                pigDetail: {},
                tabSelection: [],
                columns: [],
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

            // 获取下床列表
            const getPigOutOfBedList = async () => {
                state.search.outOfBedTimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.outOfBedTimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigOutOfBedListApi(state.search).then(res => {
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
            const addPigOutOfBed = async () => {
                await intoJudge({ dormCode: state.outOfBedForm.inDormCode }).then(res => {
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
                let data = JSON.parse(JSON.stringify(state.outOfBedForm))
                data.outOfBedDate = helper.format(data.outOfBedDate)
                await addPigOutOfBedApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        getPigOutOfBedList()
                    }
                })
            }

            // 继续入该栏位(转入栋舍)
            const initColumn = async () => {
                let data = JSON.parse(JSON.stringify(state.outOfBedForm))
                data.outOfBedDate = helper.format(data.outOfBedDate)
                await addPigOutOfBedApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.demotion = false
                        state.pigDetail = {}
                        getPigOutOfBedList()
                    } else {
                        window.$message(res.msg)
                        return
                    }
                })
            }
            //修改
            const updatePigOutOfBed = async () => {
                let data = JSON.parse(JSON.stringify(state.outOfBedForm))
                data.outOfBedDate = helper.format(data.outOfBedDate)
                await updatePigOutOfBedApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.modifyTheSuccess"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        getPigOutOfBedList()
                    }
                })
            }

            // 查询单个母猪种猪详情
            const getPigDetail = async () => {
                if (!state.outOfBedForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSowEncoding"))
                    return false
                }
                state.showFinding = true
                await getPigInfoApi({ searchInfo: state.outOfBedForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    }
                })
            }

            const clearForm = () => {
                state.outOfBedForm = {
                    pigCode: undefined,
                    outOfBedDate: Date.now(),
                    staffCode: store.state.core.userInfo.id || "",
                    inColumnCode: undefined
                }
                state.pigDetail = {}
            }

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
                        // title: '母猪编码',
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '配种批次',
                        title: () => {
                            return t("dataTable.listing.breedingBatch")
                        },
                        key: "batchNumber"
                    },
                    {
                        // title: '下床日期',
                        title: () => {
                            return t("dataTable.listing.dateOfBed")
                        },
                        key: "outOfBedDate",
                        render(row) {
                            return helper.timestampToTime(row.outOfBedDate)
                        }
                    },
                    {
                        // title: '下床类型',
                        title: () => {
                            return t("dataTable.listing.typeOfOutOfBed")
                        },
                        key: "outBedType",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "outBedType",
                                row.outBedType
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
                        // title: '产床编码',
                        title: () => {
                            return t("dataTable.listing.maternityBedNo")
                        },
                        key: "columnCode"
                    },

                    {
                        // title: '转入栏位',
                        title: () => {
                            return t("dataTable.listing.inColumn")
                        },
                        key: "inColumnCode"
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
                        render(row) {
                            return h(
                                NButton,
                                {
                                    size: "small",
                                    type: "info",
                                    text: true,
                                    disabled: helper.dateInDay(row.createDatetime),
                                    onClick: () => {
                                        state.outOfBedForm = {
                                            id: row.id,
                                            pigCode: row.pigCode,
                                            outOfBedDate: new Date(row.outOfBedDate).getTime(),
                                            inFarmid: row.inFarmid,
                                            inDormCode: row.inDormCode,
                                            inColumnCode: row.inColumnCode,
                                            staffCode:
                                                store.getters["dictionaries/getUserId"](
                                                    row.staffCode
                                                ) || store.state.core.userInfo.id
                                        }
                                        state.showAdd = true
                                    }
                                },
                                { default: () => t("button.edit") }
                            )
                        }
                    }
                ]
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
                getPigOutOfBedList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigOutOfBedList,
                getPigDetail,
                getDictionaries,
                // 封装函数
                toBuildingUp,
                // 模糊查询(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                initColumn,
                getFarmName,
                getDormName,
                getDormListForFarmId,
                getColumnListForDormId,
                clearForm,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("form.rules.pleaseInputTheSowNumbers")
                    },
                    outOfBedDate: {
                        required: true,
                        message: t("form.rules.pleaseSelectADateOutOfBed")
                    },
                    inFarmid: {
                        required: true,
                        message: t("form.rules.pleaseSelectACourt")
                    },
                    inDormCode: {
                        required: true,
                        message: t("form.rules.pleaseSelectABuilding")
                    },
                    inColumnCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterIntoTheField")
                    },
                    staffCode: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheOperation")
                    },
                    outBedType: {
                        required: true,
                        message: t("form.rules.pleaseEnterTheBedType")
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
                // 保存
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.outOfBedForm.id ? updatePigOutOfBed() : addPigOutOfBed()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                farmChange() {
                    state.outOfBedForm.inDormCode = null
                    state.outOfBedForm.inColumnCode = null
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
                    getPigOutOfBedList()
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
