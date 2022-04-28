<template>
    <div class="p-2 measure-container">
        <n-card>
            <!-- <div class="tabHeader font-16 font-weight-bolder flex">
                <n-space justify="space-between">
                    <n-space align="center">
                        <div>{{$t('dtables.listing.earSampleList')}}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :loading="showloading"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="search.page=1;getMainData()"
                            actions="['confirm']"
                        />
                        <n-button type="info" class="col-2" @click="showAdd=true;clearForm()">{{$t('dataTable.listing.btnRegistration')}}</n-button>
                        <n-button type="info" class="col-2" @click="multipleRegister=true">{{$t('dataTable.listing.bulkRegistration')}}</n-button>
                        <n-button type="warning" class="col-2" @click="confirmMultipleStatus">{{$t('dtables.listing.batchConfirmation')}}</n-button>
                    </n-space>
                </n-space>
            </div>-->

            <div class="tabHeader font-16 font-weight-bolder w-100 flex justify-between">
                <div class="flex align-center">
                    <div class="mr-1">{{ $t("dtables.listing.earSampleList") }}:</div>
                    <n-date-picker
                        v-model:value="timeList"
                        type="daterange"
                        :shortcuts="rangeShortcuts"
                        :loading="showloading"
                        :is-date-disabled="disablePreviousDate"
                        @update:value="
                            () => {
                                search.page = 1
                                getMainData()
                            }
                        "
                        actions="['confirm']"
                    />
                </div>
                <div>
                    <n-button type="warning" class="col-2 mr-1" @click="confirmMultipleStatus">{{
                        $t("dtables.listing.batchConfirmation")
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
                    <n-button class="col-2 ml-1 mr-1" type="info" @click="showImport = true">{{
                        $t("dtables.listing.theImport")
                    }}</n-button>
                    <n-button type="info" class="col-2" @click="showExport = true">{{
                        $t("dataTable.listing.export")
                    }}</n-button>
                </div>
            </div>

            <tableComponents
                size="medium"
                :columns="columns"
                :data="ablactationList"
                :checkedRowKeys="tableCheckList"
                rowKey="id"
                v-model:search="search"
                @update:checked-row-keys="checkoutChange"
                @update:filters="handleFiltersChange"
                @update:search="getPigMeasureList"
            ></tableComponents>

            <!-- <n-space vertical>
                <n-space :size="0">
                    <n-data-table
                        :striped="true"
                        class="main-table"
                        ref="mainTable"
                        :columns="columns"
                        :scroll-x="0"
                        :data="ablactationList"
                        @update:checked-row-keys="checkoutChange"
                        :row-key="row => row.id"
                        @update:filters="handleFiltersChange"
                    />
                </n-space>
                <n-space justify="space-between">
                    <div class="space-between flex">
                        <n-text class="pl-1">{{$t('dtables.listing.thisPage')}}：{{ablactationList.length}}{{$t('dataTable.listing.footerSuffix')}}</n-text>
                    </div>
                    <n-pagination
                        v-model:page="search.page"
                        v-model:pageSize="search.limit"
                        :item-count="search.total"
                        show-size-picker
                        :page-sizes="[10, 20, 30, 40]"
                        show-quick-jumper
                        @update:page="getPigMeasureList()"
                        @update:pageSize="getPigMeasureList()"
                    >
                        <template #prefix="{ total }">
                            <n-text class="pl-1">{{$t('dtables.listing.aCombined')}}{{(search.total) || 0}}{{$t('dataTable.listing.footerSuffix')}}</n-text>
                        </template>
                    </n-pagination>
                </n-space>
            </n-space>-->
        </n-card>

        <!-- 编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            transform-origin="center"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.earRegistration')"
            :bordered="false"
            @afterLeave="clearForm()"
        >
            <n-form
                :model="addFrom"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input v-model:value="addFrom.pigCode" :disabled="addFrom.id?true:false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="addFrom.pigCode"
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

                            <!-- <n-form-item path="typeSettingId" label="检测类型：">
                                <n-select v-model:value="addFrom.typeSettingId" :options="measureOptions" :style="{width:'180px'}" />
                            </n-form-item>-->
                            <n-form-item
                                path="sampleCode"
                                :label="$t('dtables.listing.theSampleCode')"
                            >
                                <n-input
                                    v-model:value="addFrom.sampleCode"
                                    :style="{ width: '90%' }"
                                />
                            </n-form-item>

                            <n-form-item
                                path="samplcollectDate"
                                :label="$t('dtables.listing.samplingDate')"
                            >
                                <n-date-picker
                                    v-model:value="addFrom.samplcollectDate"
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

                            <n-form-item
                                path="samplcollectid"
                                :label="$t('dtables.listing.theSamplingPerson')"
                            >
                                <n-select
                                    filterable
                                    v-model:value="addFrom.samplcollectid"
                                    :options="samplcollectOptions"
                                    :style="{ width: '90%' }"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <!-- <n-card :title="detailTitle">
                                <n-space vertical v-if="pigDetail.nowFarmid">
                                    <n-grid x-gap="12" :cols="2">
                                        <n-gi>
                                            <n-space vertical>
                                                <n-text depth="3">场区：{{ pigDetail.nowFarmid || '暂无'}}</n-text>
                                                <n-text depth="3">栋舍：{{ pigDetail.nowDormCode || '暂无'}}</n-text>
                                                <n-text depth="3">栏位：{{pigDetail.nowColumnCode || '暂无'}}</n-text>
                                            </n-space>
                                        </n-gi>
                                    </n-grid>
                                </n-space>
                                <n-empty description="请点击左侧搜索，查看详情！" v-else></n-empty>
                            </n-card>-->
                            <pigDetailComponents
                                :cardTitle="detailTitle"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'gender'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>

                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dataTable.listing.confirm")
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

        <!-- 批量登记 -->
        <n-modal
            style="width: 100px"
            width="100"
            v-model:show="multipleRegister"
            transform-origin="center"
            preset="card"
            :style="bodyStyle"
            title="批量登记"
            :bordered="false"
        >
            <div style class="flex justify-center">
                <n-button class="col-2 mr-5" type="info" @click="showImport = true">导入</n-button>
                <n-button type="info" class="col-2" @click="showExport = true">导出</n-button>
            </div>
        </n-modal>

        <!-- 导出 -->
        <exportComponents
            fileName="耳样清单"
            apiUrl="exportSpSamplcollect"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
        <!-- 导入 -->
        <importComponents
            fileName="耳样清单"
            apiUrl="exportPigPregnancyTestApi"
            :search="search"
            v-model:openImport="showImport"
        ></importComponents>
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
        watch,
        ref,
        computed
    } from "vue"
    import { NButton, useMessage } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import {
        getPmPigSpSamplcollectList,
        getMeasureOptionsApi,
        createPmPigSpSamplcollect,
        updatePmPigSpSamplcollect,
        updateBatchPmPigSpSamplcollect
    } from "@/api/pigMeasure.js"
    import pigDetailComponents from "@/components/minPigDetail.vue"

    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import tableComponents from "@/components/table.vue"

    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents,
            importComponents,
            exportComponents,
            pigDetailComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            const mainTable = ref(null)
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                multipleRegister: false,
                showAdd: false,
                showImport: false,
                showExport: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                // timeList: ['2021-12-01 00:00:00', '2022-02-11 23:59:59'],
                search: {
                    // 日期开始时间
                    samplcollectDateGte: helper.formatStartTamp(Date.now()),
                    // 日期结束时间
                    samplcollectDateLte: helper.formatEndTamp(Date.now()),
                    page: 1,
                    limit: 10,
                    total: undefined,
                    samplcollectType: 2, //写死 因为是1是采样，2是耳样
                    inspectionType: 2
                },
                addFrom: {
                    pigCode: undefined,
                    samplcollectType: 2,
                    typeSettingId: undefined,
                    sampleCode: undefined,
                    samplcollectDate: Date.now(),
                    samplcollectid: store.state.core.userInfo.id,
                    staffCode: store.state.core.userInfo.id || ""
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
                // 检测选项
                measureOptions: {},
                ablactationList: [],
                pigDetail: {},
                columns: [],
                columnsDynamic: [],
                tableCheckList: [],
                samplcollectOptions: computed(() => store.state.dictionaries.userSelectList),
                // 母猪编码
                pigCodeOptions: []
            })
            watch(
                () => [...state.timeList],
                val => {
                    state.search = {
                        // 日期开始时间
                        samplcollectDateGte: helper.formatStartTamp(val[0]),
                        // 日期结束时间
                        samplcollectDateLte: helper.formatEndTamp(val[1]),
                        page: 1,
                        limit: 10,
                        total: undefined,
                        samplcollectType: 2 //写死 因为是1是采样，2是耳样
                    }
                    mainTable?.value?.clearFilters()
                },
                { deep: true }
            )
            // rules不需要reactive
            let rules = {
                pigCode: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterThePigEncoding"),
                    trigger: ["blur", "change"]
                },
                // typeSettingId: {
                //     required: true,
                //     message: '请选择检测类型',
                //     trigger: ['blur', 'change']
                // },
                sampleCode: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterTheSampleCode"),
                    trigger: ["blur", "change"]
                },
                samplcollectDate: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectTheSamplingDate")
                },
                samplcollectid: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectASampler"),
                    trigger: ["blur", "change"]
                }
            }
            let computeds = {
                getDictionaries: computed(() => {
                    return function (dictionaryKey) {
                        return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    }
                }),
                getFarmName: computed(() => {
                    return function (id) {
                        return store.getters["dictionaries/getFarmName"](id)
                    }
                }),
                getDormName: computed(() => {
                    return function (id) {
                        return store.getters["dictionaries/getDormName"](id)
                    }
                }),
                // eslint-disable-next-line vue/return-in-computed-property
                detailTitle: computed(() => {
                    return t("dtables.listing.pigInformation")
                    // if (!state.pigDetail.pigStatus) {
                    //     return '母猪或仔猪信息:'
                    // }
                    // if (state.pigDetail.pigStatus == '种猪') {
                    //     return '母猪信息:'
                    // }
                    // if (state.pigDetail.pigStatus == '仔猪') {
                    //     return '仔猪信息:'
                    // }
                })
            }
            let methods = {
                // main table checkouts has change
                checkoutChange: list => {
                    state.tableCheckList = list
                },
                getDictionaries: dictionaryKey => {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                },
                // 获取常规检测list
                getPigMeasureList: async () => {
                    state.search.samplcollectDateGte = helper.formatStartTamp(state.timeList[0])
                    state.search.samplcollectDateLte = helper.formatEndTamp(state.timeList[1])

                    // if (state.search.samplcollectDateLte.includes(':00')) {
                    //     state.search.samplcollectDateLte = `${
                    //         state.search.samplcollectDateLte.split(' ')[1]
                    //     } 23:59:59`
                    // }
                    state.showloading = true
                    let basicTable = await methods.getBasicTable()

                    await getPmPigSpSamplcollectList(state.search).then(async res => {
                        state.showloading = false
                        if (res.code == 0) {
                            res.data.list.forEach(t => {
                                t.gender = basicTable?.gender?.find(
                                    tc => t.gender == tc.dictCode
                                ).dictName
                                t.pigSources = basicTable?.pigSources?.find(
                                    tc => t.pigSources == tc.dictCode
                                ).dictName
                            })

                            state.basicList = res.data.list
                            state.ablactationList = res.data.list
                            state.search.page = res.data.pageNo
                            state.search.limit = res.data.pageSize
                            state.search.total = res.data.total
                        }
                    })
                },
                // 获取基本信息表
                getBasicTable() {
                    return new Promise(resolve => {
                        let dictList = {
                            gender: [],
                            pigSources: []
                        }
                        dictList.gender = store.getters["dictionaries/getDictionaries"]("gender")

                        dictList.pigSources =
                            store.getters["dictionaries/getDictionaries"]("pigSources")
                        // dictList.pigSources = await store.dispatch(
                        //     'dictionaries/getPigDictionaries',
                        //     'pigSources'
                        // )
                        resolve(dictList)
                    })
                },
                // 查询单个母猪种猪详情
                getPigDetail: async () => {
                    if (!state.addFrom.pigCode) {
                        message.error(t("dtables.listing.pleaseEnterThePigEncoding"))
                        return false
                    }
                    if (state.addFrom.pigCode.length == 6) {
                        await getPigInfoApi({
                            searchInfo: state.addFrom.pigCode
                        }).then(res => {
                            if (res.code == 0) {
                                state.pigDetail = res.data
                            }
                        })
                    } else {
                        await getPigInfoApi({
                            searchInfo: state.addFrom.pigCode
                        }).then(res => {
                            if (res.code == 0) {
                                state.pigDetail = res.data
                            }
                        })
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
                                state.addFrom.typeSettingId = res.data[0].id
                            }
                        })
                    })
                },
                // 登记校验
                handleValidateClick: () => {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            methods.createPmPigSpSamp()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 确认登记
                createPmPigSpSamp: async () => {
                    let data = JSON.parse(JSON.stringify(state.addFrom))
                    createPmPigSpSamplcollect(data).then(res => {
                        if (res.code == 0) {
                            methods.getPigMeasureList()
                            message.success(t("message.success"))
                            state.showAdd = false
                        } else {
                            message.error(res.msg)
                        }
                    })
                },
                // 单个确认状态
                confirmSingleStatus: ({ id }) => {
                    updatePmPigSpSamplcollect({ id }).then(res => {
                        if (res.code == 0) {
                            message.success(t("message.success"))
                            methods.getPigMeasureList()
                        } else {
                            message.error(res.msg)
                        }
                    })
                },
                // 批量确认状态
                confirmMultipleStatus: () => {
                    // 在此获取table的已选项
                    if (!state.tableCheckList[0]) {
                        return message.error(t("dtables.listing.pleaseSelectAtLeastOneItem"))
                    }
                    // let models = state.ablactationList
                    //     .filter(t => state.tableCheckList.includes(t.subSampleCode))
                    //     .map(t => ({ id: t.id }))
                    let models = state.tableCheckList.map(t => ({ id: t }))

                    updateBatchPmPigSpSamplcollect({
                        models
                    }).then(res => {
                        if (res.code == 0) {
                            message.success(t("message.success"))
                            state.tableCheckList = []
                            methods.getPigMeasureList()
                        } else {
                            message.error(res.msg)
                        }
                    })
                },
                clearForm: () => {
                    state.addFrom = {
                        pigCode: undefined,
                        samplcollectType: 2,
                        typeSettingId: state.measureOptions[0].id,
                        sampleCode: undefined,
                        samplcollectDate: Date.now(),
                        samplcollectid: store.state.core.userInfo.id,
                        staffCode: store.state.core.userInfo.id || ""
                    }
                    state.pigDetail = {}
                },
                // 动态表-自由切换主数据
                getMainData() {
                    methods.getPigMeasureList()
                },
                // 设置主表头
                setTableColumns: () => {
                    state.columns = [
                        {
                            type: "selection",
                            fixed: "left",
                            width: 10,
                            disabled(row, index) {
                                return row.samplcollectStatus != 1
                            }
                        },
                        {
                            title: () => t("dataTable.listing.pigCode"),
                            key: "pigCode",
                            width: 100,
                            fixed: "left"
                        },
                        // {
                        //     title: '检测类型',
                        //     key: 'typeSettingName',
                        //     fixed: 'left',
                        //     width: 110,
                        //     filter: false,
                        //     filterOptions: computed(() => {
                        //         return state.measureOptions
                        //     })
                        // },
                        {
                            title: () => t("dtables.listing.theSampleCode"),
                            key: "sampleCode",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: t("dtables.listing.subCoding"),
                            key: "subSampleCode",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: () => t("dataTable.listing.Farm"),
                            key: "farmCode",
                            fixed: "left",
                            width: 100,
                            filter: true,
                            filterOptions: computed(() => {
                                return store.state.dictionaries.farmList
                            })
                        },
                        {
                            title: () => t("dataTable.listing.Dorm"),
                            key: "nowDormCode",
                            width: 80,
                            fixed: "left",
                            filter: true,
                            filterOptions: computed(() => {
                                return store.state.dictionaries.dormList
                            })
                        },
                        {
                            title: () => t("dataTable.listing.column"),
                            key: "nowColumnCode",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: () => t("dataTable.listing.species"),
                            key: "pigSources",
                            width: 80,
                            fixed: "left",
                            filter: true,
                            filterOptions: computed(() => {
                                return store.state.dictionaries.dictionaries["pigSources"]
                            })
                        },
                        {
                            title: () => t("dataTable.listing.strain"),
                            key: "strain",
                            width: 80,
                            fixed: "left"
                        },
                        {
                            title: () => t("dtables.listing.importantIndicator"),
                            key: "attrs",
                            align: "left",
                            children: [
                                {
                                    title: () => t("dataTable.listing.dateOfDelivery"),
                                    key: "pigBornDate",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.giveBirth"),
                                    key: "dormCode",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.bornBar"),
                                    key: "columnCode",
                                    width: 100
                                },
                                {
                                    title: () => t("dataTable.listing.gender"),
                                    key: "gender",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.motherCoding"),
                                    key: "pigMotherCode",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.maternalBreedingValue"),
                                    key: "mBreedingValue",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.motherBreedingLevel"),
                                    key: "mBreedingLevel",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.motherScore"),
                                    key: "mScore",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.breastMilkQuotas (left)"),
                                    key: "mLeftPapillaNum",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.breastMilkQuotas (right)"),
                                    key: "mRightPapillaNum",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.fetalChildbirthTime"),
                                    key: "productBreedingBatch",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.fatherCoding"),
                                    key: "pigFatherCode",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.patriarchalBreedingValue"),
                                    key: "fBreedingValue",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.fatherStrains"),
                                    key: "fStrain",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.birthWeight"),
                                    key: "bwt",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.deliveryBatch"),
                                    key: "productionBatch",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.nippleNumber (left)"),
                                    key: "leftPapillaNum",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.nippleNumber (right)"),
                                    key: "rightPapillaNum",
                                    width: 100
                                }
                            ]
                        },
                        {
                            title: () => t("dtables.listing.stateOfTheSample"),
                            // fixed: "right",
                            width: 90,
                            key: "samplcollectStatus",
                            render(row) {
                                return store.getters["dictionaries/getDictionarieName"](
                                    "samplcollectStatus",
                                    row.samplcollectStatus
                                )
                            }
                        },
                        {
                            title: () => t("dtables.listing.theSamplingPerson"),
                            key: "samplcollectid",
                            width: 70
                            // fixed: "right"
                        },
                        {
                            title: () => t("dtables.listing.theRegistrar"),
                            key: "createid",
                            width: 70
                            // fixed: "right"
                        },
                        {
                            title: () => t("dtables.listing.theReviewer"),
                            key: "approverid",
                            width: 70
                            // fixed: "right"
                        },
                        {
                            title: () => t("dataTable.listing.actions"),
                            key: "actions",
                            width: 70,
                            fixed: "right",
                            render(row) {
                                let disabled = row.samplcollectStatus == 3 || row.sampleStatus == 1
                                let attrs = {}
                                disabled && (attrs.disabled = disabled)
                                return h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: row.samplcollectStatus == 1 ? "info" : "error",
                                        text: true,
                                        ...attrs,
                                        onClick: () => {
                                            methods.confirmSingleStatus(row)
                                        }
                                    },
                                    {
                                        default: () => {
                                            return row.samplcollectStatus == 1
                                                ? t("dtables.listing.confirmAndSubmitForInspection")
                                                : row.sampleStatus == 1
                                                ? t("dtables.listing.irrevocable")
                                                : row.samplcollectStatus == 2
                                                ? t("dtables.listing.cancellationOfInspection")
                                                : row.samplcollectStatus == 3
                                                ? t("dtables.listing.inoperable")
                                                : "empty"
                                        }
                                    }
                                )
                            }
                        }
                    ]
                },
                disablePreviousDate: ts => {
                    return ts > Date.now()
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
            onBeforeMount(async () => {
                methods.getMeasureOptions()
            })
            onMounted(() => {
                // // 获取列表
                methods.getPigMeasureList()
                // // 设置tab选项
                methods.setTableColumns()

                // document
                // ResizeObserver
                // https://www.zhihu.com/question/20653765
                //     .querySelector('.measure-container')
                //     .parentElement.parentElement.addEventListener('resize', () => {
                //         debugger
                //     })
            })
            return {
                ...toRefs(state),
                ...computeds,
                ...methods,
                // 模糊搜索(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                mainTable,
                rules,
                formRef,
                bodyStyle: {
                    width: "800px"
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .space-between {
        justify-content: space-between;
    }
    .n-data-table .n-data-table-td {
        padding: 10px;
    }
</style>
