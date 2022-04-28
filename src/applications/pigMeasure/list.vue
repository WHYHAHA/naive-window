<template >
    <div class="p-2">
        <n-card>
            <div class="tabHeader font-16 font-weight-bolder flex w-100 flex justify-between align-center">
                <div class="flex">
                    <span style="line-height:2.2">{{$t('dataTable.listing.theDeterminationOfRegistration')}}:</span>
                    <div class="ml-1 mr-1">
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :shortcuts="rangeShortcuts"
                            :loading="showloading"
                            :is-date-disabled="disablePreviousDate"
                            @update:value="search.page=1;getMainData()"
                            actions="['confirm']"
                        />
                    </div>
                    <n-select @update:value="changeTableType" v-model:value="selectMeasureOption" :options="measureOptions" filterable :style="{width:'180px'}" />
                </div>
                <div class>
                    <n-button type="primary" class="col-2" @click="clickReg">{{$t('dataTable.listing.btnRegistration')}}</n-button>
                    <n-button class="col-2 ml-1 mr-1" type="info" @click="showImport=true">{{ $t('dtables.listing.theImport') }}</n-button>
                    <n-button type="info" class="col-2" @click="showExport=true">{{ $t('dataTable.listing.export') }}</n-button>
                </div>
            </div>
            <n-space vertical>
                <n-space :size="0">
                    <n-data-table
                        max-height="450"
                        :scroll-x="0"
                        :columns="columns"
                        :data="ablactationList"
                        @update:checked-row-keys="handleCheck"
                        :row-key="row => row.id"
                        @update:filters="handleFiltersChange"
                    />
                </n-space>

                <n-space justify="space-between">
                    <div class="space-between flex">
                        <n-text class="pl-1">{{ $t('dtables.listing.thisPage') }}{{ablactationList.length}}{{ $t('dataTable.listing.footerSuffix') }}</n-text>

                        <!-- <n-text class="pl-1">合计{{search.total}}条</n-text> -->
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
                            <n-text class="pl-1">{{ $t('dataTable.listing.altogether') }}{{(search.total) || 0}}{{ $t('dataTable.listing.footerSuffix') }}</n-text>
                        </template>
                    </n-pagination>
                </n-space>
            </n-space>
        </n-card>

        <!-- 编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            transform-origin="center"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.recordRegistration')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-spin :show="spinShow">
                <template #description>{{ $t("message.loading") }}</template>
                <n-form :model="addFrom" ref="formRef" :rules="rules" label-placement="left" :label-width="100">
                    <n-space vertical :size="20">
                        <n-grid x-gap="20" :cols="10">
                            <n-gi span="5 400:5 600:5 800:5">
                                <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                    <n-input-group>
                                        <n-input v-model:value="addFrom.pigCode" maxlength="20" :disabled="addFrom.id?true:false" />
                                        <n-button type="primary" @click="getPigDetail">{{$t('dtables.listing.search')}}</n-button>
                                    </n-input-group>
                                </n-form-item>

                                <n-form-item path="typeSettingId" :label="`${$t('dtables.listing.theDeterminationOfTheType')}`">
                                    <n-select
                                        :disabled="isEdit?true:false"
                                        filterable
                                        @update:value="changeMeaureType"
                                        v-model:value="addFrom.typeSettingId"
                                        :options="measureOptions"
                                        :style="{width:'180px'}"
                                    />
                                </n-form-item>

                                <n-form-item path="physicalExaminationDateTime" :label="`${$t('dtables.listing.toDetermineTheDate')}`">
                                    <n-date-picker
                                        :disabled="isEdit?true:false"
                                        v-model:value="addFrom.physicalExaminationDateTime"
                                        type="date"
                                        :is-date-disabled="disablePreviousDate"
                                        actions="['now']"
                                        @focus="(e) => {e.target.blur()}"
                                    />
                                </n-form-item>

                                <n-form-item path="examinationid" :label="`${$t('dtables.listing.theDeterminationOfPeople')}`">
                                    <n-select :disabled="isEdit?true:false" filterable v-model:value="addFrom.examinationid" :options="samplcollectOptions" :style="{width:'180px'}" />
                                </n-form-item>
                            </n-gi>
                            <n-gi span="5 400:5 600:5 800:5">
                                <pigDetailComponents :cardTitle="detailTitle" :pigDetail="pigDetail" :displayOptions="['nowFarmid','nowDormCode','nowColumnCode','gender',]"></pigDetailComponents>
                                <!-- <n-card :title="detailTitle">
                                    <n-space vertical v-if="pigDetail.nowFarmid">
                                        <n-grid x-gap="12" :cols="2">
                                            <n-gi>
                                                <n-space vertical>
                                                    <n-text depth="3">{{$t('dataTable.listing.Farm')}}：{{ pigDetail.nowFarmid || $t('dtables.listing.empty')}}</n-text>
                                                    <n-text depth="3">{{$t('dataTable.listing.Dorm')}}：{{ pigDetail.nowDormCode || $t('dtables.listing.empty')}}</n-text>
                                                    <n-text depth="3">{{$t('dataTable.listing.column')}}：{{pigDetail.nowColumnCode || $t('dtables.listing.empty')}}</n-text>
                                                </n-space>
                                            </n-gi>
                                        </n-grid>
                                    </n-space>
                                    <n-empty :description="$t('dataTable.listing.pleaseClickOnTheLeftSideOfTheSearch,CheckTheDetails')" v-else></n-empty>
                                </n-card>-->
                            </n-gi>
                        </n-grid>

                        <n-grid x-gap="20" :cols="10" v-show="measureData[0]">
                            <n-gi span="5 400:5 600:5 800:5">
                                <p class="ml-1 mb-2">{{ $t('dtables.listing.measurementData') }}：</p>
                                <div class="modal-scroll-content">
                                    <div v-for="(item,index) in measureData" :key="index">
                                        <!-- <n-divider title-placement="left">part {{index + 1}}</n-divider> -->
                                        <n-form-item label-width="100" :path="itemc.label.trim()" :label="itemc.label" v-for="(itemc,indexc) in item.children" :key="indexc">
                                            <n-input
                                                :placeholder="$t('dtables.listing.pleaseEnterThe') + itemc.label"
                                                v-if="itemc.type == 'text'"
                                                v-model:value="addFrom[itemc.label]"
                                                :style="{width:'180px',display:'inline-block'}"
                                                @input="text => itemc.value = text"
                                                maxlength="20"
                                            />
                                            <n-input-number
                                                v-else-if="itemc.type == 'number'"
                                                v-model:value="addFrom[itemc.label]"
                                                :style="{width:'180px',display:'inline-block'}"
                                                :placeholder="$t('dtables.listing.pleaseEnterThe') + itemc.label"
                                                @blur="() => itemc.value = addFrom[itemc.label]"
                                                :max="9999"
                                                :min="0"
                                                clearable
                                            />
                                            <n-select
                                                v-else-if="itemc.type == 'select'"
                                                filterable
                                                :disabled="itemc.disabled"
                                                v-model:value="addFrom[itemc.label]"
                                                :options="itemc.options"
                                                :style="{width:'180px',display:'inline-block'}"
                                                @update:value="text => dynamicSelectHandle(itemc.label, itemc.options,text, item.children, itemc)"
                                            />
                                        </n-form-item>
                                    </div>
                                </div>
                            </n-gi>
                        </n-grid>
                        <n-space justify="center" class="justify-center">
                            <n-button type="info" @click="handleValidateClick" attr-type="button">{{ $t('dtables.listing.save') }}</n-button>
                            <n-button @click="showAdd=false;clearForm()">{{ $t('dtables.listing.cancel') }}</n-button>
                        </n-space>
                    </n-space>
                </n-form>
            </n-spin>
        </n-modal>

        <!-- 批量登记 -->
        <!-- <n-modal style="width: 100px" width="100" v-model:show="multipleRegister" transform-origin="center" preset="card" :style="bodyStyle" title="批量登记" :bordered="false" :mask-closable="false">
            <div style class="flex justify-center">
                <n-button class="col-2 mr-5" type="info" @click="showImport=true">导入</n-button>
                <n-button type="info" class="col-2" @click="showExport=true">导出</n-button>
            </div>
        </n-modal>-->

        <!-- 登记draw -->
        <multipleReg ref="multipleRegRef" />
        <!-- 导出 -->
        <exportComponents :fileName="$t('dtables.listing.outOfBedList')" apiUrl="exportPhysicalExaminationRecord" :search="search" v-model:openExport="showExport"></exportComponents>
        <!-- 导入 -->
        <importComponents :fileName="$t('dtables.listing.outOfBedList')" apiUrl="exportPigPregnancyTestApi" :search="search" v-model:openImport="showImport"></importComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, onBeforeMount, h, ref, computed } from "vue"
    import { NButton, useMessage } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import {
        getPigMeasureListApi,
        getDetailById,
        updatePmPhysicalExamination,
        createPmPhysicalExamination,
        getTableColumnsApi,
        getMeasureOptionsApi,
        getPmDictByName
    } from "@/api/pigMeasure.js"
    import pigDetailComponents from "@/components/minPigDetail.vue"

    import multipleReg from "./components/multipleReg"

    import { getPigInfoApi } from "@/api/public.js"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"
    let typeObj = {
        text: ["身高", "体重", "右乳头数", "左乳头数", "眼睑深度"],
        number: [
            // 数字类型的包括模块 - 下面的字段，以及限制，*为全部都限制，
            {
                title: "*",
                rules: [
                    {
                        title: "体重",
                        min: 1,
                        max: 999
                    },
                    {
                        title: "体高",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "体长",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "左乳头数",
                        min: 1,
                        max: 13
                    },
                    {
                        title: "右乳头数",
                        min: 1,
                        max: 13
                    },
                    {
                        title: "背膘厚",
                        min: 0,
                        max: 99
                    },
                    {
                        title: "眼肌面积",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "眼肌厚",
                        min: 0,
                        max: 999
                    },
                    {
                        title: "肌间脂肪",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "出生重",
                        min: 0,
                        max: 10
                    }
                ]
            },
            {
                title: "100KG测试",
                rules: [
                    {
                        title: "体重",
                        min: 60,
                        max: 160
                    },
                    {
                        title: "背膘厚",
                        min: 4,
                        max: 40
                    },
                    {
                        title: "眼肌面积",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "眼肌厚",
                        min: 30,
                        max: 100
                    },
                    {
                        title: "肌间脂肪",
                        min: 0,
                        max: 9999
                    }
                ]
            },
            {
                title: "体型外貌测试",
                rules: [
                    {
                        title: "体重",
                        min: 60,
                        max: 160
                    },
                    {
                        title: "体高",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "体长",
                        min: 0,
                        max: 9999
                    },
                    {
                        title: "背膘厚",
                        min: 4,
                        max: 40
                    },
                    {
                        title: "眼肌厚",
                        min: 30,
                        max: 100
                    },
                    {
                        title: "肌间脂肪",
                        min: 0,
                        max: 9999
                    }
                ]
            },
            {
                title: "出生测定",
                rules: [
                    {
                        title: "左乳头数",
                        min: 1,
                        max: 13
                    },
                    {
                        title: "右乳头数",
                        min: 1,
                        max: 13
                    },
                    {
                        title: "出生重",
                        min: 0,
                        max: 10
                    }
                ]
            }
        ],
        select: [
            {
                title: "前肢",
                options: []
            },
            {
                title: "后肢",
                options: []
            },
            {
                title: "生殖器",
                options: []
            },
            {
                title: "目测体态",
                options: []
            },
            {
                title: "鼻头颜色",
                options: []
            },
            {
                title: "畸形",
                options: []
            }
        ]
    }

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            pigDetailComponents,
            importComponents,
            exportComponents,
            multipleReg
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const multipleRegRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                spinShow: false,
                isEdit: false,
                multipleRegister: false,
                showAdd: false,
                showImport: false,
                showExport: false,
                showloading: false,
                selectMeasureOption: undefined,
                timeList: [Date.now(), Date.now()],
                // timeList: ['2021-12-01 00:00:00', '2022-02-11 23:59:59'],
                search: {
                    // 日期开始时间
                    physicalExaminationDateTimeGte: helper.formatStartTamp(Date.now()),
                    // 日期结束时间
                    physicalExaminationDateTimeLte: helper.formatEndTamp(Date.now()),
                    typeSettingId: 1,
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                addFrom: {
                    pigCode: undefined,
                    physicalExaminationDateTime: Date.now(),
                    examinationid: store.state.core.userInfo.id,
                    typeSettingId: undefined,
                    optionValue: ""
                },
                // 检测选项
                measureOptions: {},
                ablactationList: [],
                pigDetail: {},
                tabSelection: [],
                columns: [],
                columnsDynamic: [],
                dynamicList: [],
                basicColumns: [],
                basicList: [],
                measureData: [],
                dynamicRules: {},

                rules: {},
                resultRules: {
                    value: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterData")
                    },
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterPigNumber"),
                        trigger: ["blur", "change"]
                    },
                    physicalExaminationDateTime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTestDate")
                    },
                    typeSettingId: {
                        required: true,
                        message: t("dtables.listing.selectTransferInType"),
                        trigger: ["blur", "change"]
                    },
                    examinationid: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectATester"),
                        trigger: ["blur", "change"]
                    }
                }
            })
            let computeds = {
                samplcollectOptions: computed(() => store.state.dictionaries.userSelectList),
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
                    return "猪只信息"
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
                // 点击登记按钮
                clickReg() {
                    multipleRegRef.value.open()
                },
                // 检测登记中的下拉框体数据改变，用于操作目测体态的缺陷状态数据
                dynamicSelectHandle(params, options, option, parentList, currentItem) {
                    let item = options.find(t => t.value == option)
                    currentItem.value = item.value
                    if (params == "目测体态") {
                        let zIndex = parentList.findIndex(t => t.label == "畸形")
                        //-1 则偏好设置中没配置畸形
                        if (zIndex == -1) {
                            return false
                        }
                        if (item?.label == "有缺陷") {
                            parentList[zIndex].disabled = false
                            state.dynamicRules["畸形"].required = true
                        } else if (item?.label != "有缺陷") {
                            parentList[zIndex].disabled = true
                            state.dynamicRules["畸形"].required = false
                            parentList[zIndex].value = ""
                            state.addFrom["畸形"] = ""
                        }
                    }
                },
                // 登记 -检测类型改变
                changeMeaureType(id) {
                    return new Promise(resolve => {
                        let dynamicRules = {}
                        state.measureData = []
                        // 根据excel给出的校验类型来进行验证判断，之后这块应该做成动态的
                        // 计算动态输入框的type
                        let calcInputType = itemcLabel => {
                            let type = Object.values(typeObj.number).some(tr => {
                                return tr.rules.some(tc => tc.title == itemcLabel)
                            })
                            return type
                        }
                        getDetailById({ id }).then(res => {
                            let measuringProjects = Object.entries(res.data.measuringProject)
                            measuringProjects.forEach(async (t, i) => {
                                let childrenData = t[1].map(async tc => {
                                    let mapDictData = []
                                    // 从后台发来的检测项，每一项的title都需要根据字典去查title
                                    let label = store.getters["dictionaries/getDictionarieName"](
                                        t[0],
                                        tc
                                    )

                                    // 根据title的名称去决定是什么类型
                                    let type = typeObj.select.some(to => to.title == label)
                                        ? "select"
                                        : calcInputType(label)
                                        ? "number"
                                        : "text"

                                    let obj = {
                                        value: "",
                                        key: tc,
                                        type,
                                        label,
                                        disabled: label == "畸形"
                                    }

                                    if (type == "select") {
                                        // 如果是下拉，那么需要用中文的title名去调用后台接口查询英文字典名
                                        let dictCode = await getPmDictByName({
                                            dictName: label,
                                            dictLogo: t[0]
                                        })
                                        // 根据title的名称。去决定从本地state中读取options还是从字典读取
                                        // 如果从字典读取，需要使用刚刚从后台获取到的英文名查询到相对应的options
                                        // 如果是从字典读取的，那么验证里面有咩有“有缺陷”的选项，有则继续查询二级下拉选项，追加一项检测项
                                        let dictData = store.getters["dictionaries/getDictionaries"](
                                            dictCode.data.dictLogo
                                        )

                                        mapDictData = dictData?.map(tm => {
                                            let obj = {}
                                            obj.label = tm.dictName
                                            obj.value = tm.dictCode
                                            return obj
                                        })

                                        obj.options = mapDictData || []
                                    }

                                    // 这里是在为特定的字段输入给出规则,并且一定是number start
                                    const rulesData = state.measureOptions.find(tid => tid.id == id)
                                    let ruleItemData =
                                        typeObj.number.find(tRu => tRu.title == rulesData.tname) ||
                                        typeObj.number.find(tRu => tRu.title == "*")

                                    dynamicRules[label] = reactive({
                                        required: label != "畸形",
                                        message: `请${type == "select" ? "选择" : "输入"}${label}项`,
                                        trigger: ["blur", "input", "change"]
                                    })

                                    let rulesItem = ruleItemData?.rules.find(
                                        tName => tName.title == label
                                    )
                                    if (rulesItem) {
                                        dynamicRules[label] = reactive({
                                            required: true,
                                            trigger: ["blur", "input", "change"],
                                            validator: (rule, value) => {
                                                return new Promise((resolve, reject) => {
                                                    if (value?.length == 0 || value == null) {
                                                        reject(Error(`请输入${label}项`))
                                                    } else if (isNaN(Number(value))) {
                                                        reject(Error(`请输入数字类型的值`))
                                                    } else if (
                                                        value < rulesItem.min ||
                                                        value > rulesItem.max
                                                    ) {
                                                        reject(
                                                            Error(
                                                                `输入值不可小于${rulesItem.min}，大于${rulesItem.max}`
                                                            )
                                                        )
                                                    } else {
                                                        resolve()
                                                    }
                                                })
                                            }
                                        })
                                        dynamicRules[label].type =
                                            type == "number" ? "number" : "string"
                                    } else {
                                        dynamicRules[label] = reactive({
                                            required: label != "畸形",
                                            type,
                                            message: `请${
                                                type == "select" ? "选择" : "输入"
                                            }${label}项`,
                                            trigger: ["blur", "input", "change"]
                                        })
                                        dynamicRules[label].type =
                                            type == "number" ? "number" : "string"
                                    }
                                    // 以上是在为特定的字段输入给出规则,并且一定是number end

                                    // 为了addForm
                                    state.addFrom[label] = ""
                                    return obj
                                })
                                let result = await Promise.all(childrenData).then(res =>
                                    Promise.resolve(res)
                                )

                                let temperara = {
                                    title: t[0],
                                    children: result
                                }
                                state.measureData.push(temperara)

                                state.dynamicRules = dynamicRules
                                state.rules = {
                                    ...state.resultRules,
                                    ...dynamicRules
                                }
                                measuringProjects.length - 1 == i && resolve(state.measureData)
                            })
                        })
                    })
                },
                // 动态表-自由切换主数据
                getMainData() {
                    methods.getMeasureOptions().then(res => {
                        methods.changeTableType(res)
                    })
                },
                // 动态表 - 内容解析
                dynamicBodyFn() {
                    // 这里的arr是为了验证是否是后台传递的select，后期需要做成动态的
                    let valiArr = ["目测体态", "畸形", "鼻头颜色"]
                    state.ablactationList.forEach((t, i) => {
                        t.optionValue = t.optionValue || "{}"
                        let optionValues = JSON.parse(t.optionValue)
                        let correctionData = JSON.parse(t.correctingValue)?.correctingValue || []

                        let obj = {}
                        Object.entries(optionValues).forEach(tc => {
                            tc[1].forEach(ts => {
                                Object.entries(ts).forEach(async tr => {
                                    // 根据字典获取当前展示的label，转为中文，根据中文查询，如果是下拉的若干项目，则去查询对应的KEY是什么
                                    let label = store.getters["dictionaries/getDictionarieName"](
                                        tc[0],
                                        tr[0]
                                    )
                                    if (valiArr.includes(label)) {
                                        // label
                                        let inqureText = await methods.inquireDictions(
                                            label,
                                            tc[0],
                                            tr[1]
                                        )
                                        // 这个时候再对obj进行赋值已经晚了，所以需要直接给列表
                                        state.ablactationList[i][tc[0] + tr[0]] = inqureText
                                    } else {
                                        obj[tc[0] + tr[0]] = tr[1]
                                    }
                                })
                                return obj
                            })
                        })
                        // 百公斤测定项目渲染
                        state.ablactationList[i] = { ...t, ...obj, ...correctionData[0] }
                    })
                },
                // 根据传递进来的数据值来查询对应的中文名
                async inquireDictions(dictName, dictLogo, childDict) {
                    return new Promise(async resolve => {
                        let dictCode = await getPmDictByName({
                            dictName,
                            dictLogo
                        })

                        let dictData = store.getters["dictionaries/getDictionarieName"](
                            dictCode.data.dictLogo,
                            childDict
                        )
                        resolve(dictData)
                    })
                },
                // 改变下拉值
                changeTableType(params) {
                    state.search.page = 1
                    state.search.typeSettingId = params
                    methods.getDynamicTHead(params).then(methods.getPigMeasureList)
                    // .then(methods.dynamicBodyFn)
                },
                // 获取检测动态表头
                getDynamicTHead: params => {
                    return new Promise(resolve => {
                        let tname = state.measureOptions.find(t => t.id == params)?.tname
                        getMeasureOptionsApi({ tname, typeStatus: 1 }).then(async res => {
                            if (res.code == 0) {
                                let dynamicTitles = res.data[0].measuringProject
                                let dictionsData = []
                                let language = store.state.core.language

                                Object.entries(dynamicTitles).forEach(t => {
                                    let dictions = store.getters["dictionaries/getDictionaries"](t[0])
                                    let arr = dictions
                                        ?.filter(tc => t[1].includes(tc.dictCode))
                                        .map(tc => ({
                                            key: tc.dictLogo + tc.dictCode,
                                            title:
                                                language == "zh-CN"
                                                    ? tc.dictName
                                                    : tc.dictEngName || tc.dictName,
                                            width: 100
                                        }))

                                    dictionsData.push(...arr)
                                })

                                state.columnsDynamic = dictionsData
                                methods.setTableColumns()
                                resolve()
                            }
                        })
                    })
                },
                // 获取检测选项
                getMeasureOptions: () => {
                    return new Promise(resolve => {
                        getMeasureOptionsApi({ typeStatus: 1 }).then(res => {
                            if (res.code == 0) {
                                res.data.forEach(element => {
                                    element.label = element.tname
                                    element.value = element.id
                                })
                                state.measureOptions = res.data
                                state.selectMeasureOption = res.data[0].id
                                resolve(res.data[0].id)
                                methods.getTableColumns()
                            }
                        })
                    })
                },
                // 获取表头
                getTableColumns: async () => {
                    await getTableColumnsApi({
                        id: state.selectMeasureOption
                    }).then(res => {
                        if (res.code == 0) {
                            state.pigDetail = res.data
                            methods.setTableColumns()
                        }
                    })
                },
                // 获取常规检测list
                getPigMeasureList: async () => {
                    state.search.physicalExaminationDateTimeGte = helper.formatStartTamp(
                        state.timeList[0]
                    )
                    state.search.physicalExaminationDateTimeLte = helper.formatEndTamp(
                        state.timeList[1]
                    )

                    state.showloading = true
                    let basicTable = await methods.getBasicTable()
                    await getPigMeasureListApi(state.search).then(async res => {
                        state.showloading = false
                        if (res.code == 0) {
                            res.data.list.forEach(t => {
                                t.gender = basicTable.gender.find(
                                    tc => t.gender == tc.dictCode
                                )?.dictName
                                t.pigSources = basicTable.pigSources.find(
                                    tc => t.pigSources == tc.dictCode
                                )?.dictName
                            })
                            state.basicList = res.data.list
                            state.ablactationList = res.data.list
                            state.search.page = res.data.pageNo
                            state.search.limit = res.data.pageSize
                            state.search.total = res.data.total

                            methods.dynamicBodyFn()
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
                        resolve(dictList)
                    })
                },
                handleModalChange: res => {
                    if (res?.code == 0) {
                        message.success(state.isEdit ? t("message.success") : t("message.success"))
                        methods.clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        methods.getPigMeasureList()
                        state.measureData = []
                        state.spinShow = false
                    }
                },
                // 编辑
                editPigOutOfBed: async () => {
                    let data = JSON.parse(JSON.stringify(state.addFrom))
                    let optionValue = {}
                    state.measureData.forEach(t => {
                        let obj = {}
                        t.children.forEach(tc => (obj[tc.key] = tc.value))
                        optionValue[t.title] = [obj]
                    })
                    data.optionValue = JSON.stringify(optionValue)
                    let res = await updatePmPhysicalExamination(data)
                    methods.handleModalChange(res)
                },
                // 保存
                addPigOutOfBed: async () => {
                    let data = JSON.parse(JSON.stringify(state.addFrom))
                    let optionValue = {}
                    state.measureData.forEach(t => {
                        let obj = {}
                        t.children.forEach(tc => (obj[tc.key] = tc.value))
                        optionValue[t.title] = [obj]
                    })
                    data.optionValue = JSON.stringify(optionValue)
                    let res = await createPmPhysicalExamination(data)
                    methods.handleModalChange(res)
                },

                // 查询单个母猪种猪详情
                getPigDetail: async () => {
                    if (!state.addFrom.pigCode) {
                        message.error(t("dtables.listing.pleaseEnterThePigEncoding"))
                        return false
                    }
                    if (state.addFrom.pigCode.length == 6) {
                        await getPigInfoApi({
                            searchInfo6: state.addFrom.pigCode
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

                clearForm: () => {
                    state.addFrom = {
                        pigCode: undefined,
                        physicalExaminationDateTime: Date.now(),
                        examinationid: store.state.core.userInfo.id,
                        typeSettingId: undefined,
                        optionValue: ""
                    }
                    state.pigDetail = {}
                    state.measureData = []
                },
                setTableColumns: () => {
                    state.columns = [
                        {
                            title: () => t("dataTable.listing.pigCode"),
                            key: "pigCode",
                            width: 160,
                            fixed: "left"
                        },
                        {
                            title: () => t("dataTable.listing.Farm"),
                            key: "farmid",
                            filter: true,
                            width: 100,
                            fixed: "left",
                            filterOptions: computed(() => {
                                return store.state.dictionaries.farmList
                            })
                        },
                        {
                            title: () => t("dataTable.listing.Dorm"),
                            key: "dormCode",
                            filter: true,
                            width: 100,
                            fixed: "left",
                            filterOptions: computed(() => {
                                return store.state.dictionaries.dormList
                            })
                        },
                        {
                            title: () => t("dataTable.listing.column"),
                            key: "columnCode",
                            filter: false,
                            width: 100,
                            fixed: "left",
                            filterOptions: computed(() => {
                                return store.getters["dictionaries/getDictionaries"]("columnList")
                            })
                        },

                        {
                            title: () => t("dtables.listing.theDeterminationOfTheType"),
                            key: "typeSettingName",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: () => t("dtables.listing.toDetermineTheDate"),
                            key: "physicalExaminationDateTime",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: () => t("dtables.listing.theDeterminationOfPeople"),
                            key: "staffCode",
                            width: 100,
                            fixed: "left"
                        },
                        {
                            title: () => t("dataTable.listing.actions"),
                            key: "actions",
                            width: 80,
                            fixed: "left",
                            render(row) {
                                return h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: async () => {
                                            state.isEdit = true
                                            state.addFrom = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                physicalExaminationDateTime: new Date(
                                                    row.physicalExaminationDateTime
                                                ).getTime(),
                                                typeSettingId: row.typeSettingId,
                                                examinationid: row.examinationid
                                            }
                                            await methods.changeMeaureType(row.typeSettingId)
                                            let optionValue = JSON.parse(row.optionValue)
                                            // 在这里需要将列表中的值和options都赋上
                                            state.measureData.forEach(t => {
                                                Object.entries(optionValue).forEach(tc => {
                                                    if (t.title == tc[0]) {
                                                        Object.entries(tc[1][0]).forEach(tc => {
                                                            let keyIndex = t.children.findIndex(
                                                                ts => ts.key == tc[0]
                                                            )

                                                            if (keyIndex > -1) {
                                                                let kData = t.children[keyIndex]
                                                                state.addFrom[kData.label] = tc[1]

                                                                kData.value = tc[1]
                                                            }
                                                        })
                                                    }
                                                })
                                            })
                                            state.showAdd = true
                                        }
                                    },
                                    { default: () => t("dtables.listing.theEditor") }
                                )
                            }
                        },
                        {
                            title: () => t("dtables.listing.theBasicParameters"),
                            key: "baseInfo",
                            children: [
                                {
                                    title: () => t("dataTable.listing.gender"),
                                    key: "gender",
                                    width: 80
                                },
                                {
                                    title: () => t("dataTable.listing.species"),
                                    key: "pigSources",
                                    width: 100
                                },
                                {
                                    title: () => t("dataTable.listing.strain"),
                                    key: "strain",
                                    width: 100
                                },
                                {
                                    title: () => t("dtables.listing.batchesOfBirth"),
                                    key: "productionBatch",
                                    width: 100
                                }
                            ]
                        },
                        {
                            title: () => t("dtables.listing.measurementData"),
                            key: "measureData",
                            children: state.columnsDynamic
                        }
                        // {
                        //     title: () => t("dtables.listing.correctionData"),
                        //     key: "correctingValue",
                        //     children: [
                        //         {
                        //             title: () => t("dtables.listing.dayAge"),
                        //             key: "日龄",
                        //             width: 80,
                        //         },
                        //         {
                        //             title: () => t("dtables.listing.backfatThickness"),
                        //             key: "背膘厚",
                        //             width: 100,
                        //         },
                        //         {
                        //             title: () => t("dtables.listing.ocularMuscleArea"),
                        //             key: "眼肌面积",
                        //             width: 100,
                        //         },
                        //     ],
                        // },
                    ]
                }
            }
            onBeforeMount(() => {
                methods.getMeasureOptions().then(res => {
                    methods.changeTableType(res)
                })
            })
            onMounted(() => {
                // // 获取列表
                methods.getPigMeasureList()
                // // 设置tab选项
                methods.setTableColumns()

                state.rules = { ...state.resultRules }

                // let language = store.state.core.language
                // let dictionaries = JSON.parse(JSON.stringify(store.state.dictionaries))

                // let dictionariesResult = {}
                // Object.entries(store.state.dictionaries).forEach(t => {
                //     // t[0]: key
                //     // t[1]: value
                //     // debugger
                //     // 若是对象，则继续向下entries
                //     if (t[1].constructor.name == "Object") {
                //         dictionariesResult[t[0]] = {}
                //         Object.entries(t[1]).forEach(tc => {})
                //     } else {
                //         t[1].forEach(tc => {
                //             tc.dictName = tc.dictEngName || tc.dictName
                //         })
                //         debugger
                //         dictionariesResult[t[0]] = t[1]
                //     }
                // })
                // const result = response.data
                //         store.commit("SET_ALLDICTIONARIES", result)
                //         context.commit("SET_FARMLIST", result['farmList'])
                //         context.commit("SET_DORMLIST", result['dormList'])
                // language == "zh-CN" ? tc.dictName : tc.dictEngName
            })
            return {
                ...toRefs(state),
                ...computeds,
                ...methods,
                multipleRegRef,
                formRef,
                bodyStyle: {
                    width: "800px"
                    // 'max-height': '700px',
                    // 'overflow-y': 'scroll'
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
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                handleValidateClick() {
                    // let notEmpty = state.measureData.every(t =>
                    //     t.children.every(tc => tc.value)
                    // )
                    // debugger

                    // let data = JSON.parse(JSON.stringify(state.addFrom))
                    // let optionValue = {}
                    // state.measureData.forEach(t => {
                    //     let obj = {}
                    //     t.children.forEach(tc => (obj[tc.key] = tc.value))
                    //     optionValue[t.title] = [obj]
                    // })
                    // data.optionValue = JSON.stringify(optionValue)

                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.spinShow = true
                            state.isEdit ? methods.editPigOutOfBed() : methods.addPigOutOfBed()
                        } else {
                            message.error(
                                t("dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit")
                            )
                        }
                    })
                },
                handleFiltersChange(filters, sourceColumn) {
                    if (sourceColumn.key == "farmid") {
                        state.search.farmCodeList = filters.farmid
                    }
                    if (sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = filters.dormCode
                    }
                    // if (sourceColumn.key == "farmid") {
                    //     state.search.farmCodeList = filters.farmid
                    // }
                    if (sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = filters.pigSources
                    }
                    state.search.page = 1
                    methods.getPigMeasureList()
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .modal-scroll-content {
        padding-right: 20px;
        max-height: 300px;
        width: 700px;
        overflow-y: scroll;
        :deep(.n-form-item) {
            margin-bottom: 10px;
            display: inline-grid;
            width: 48% !important;
            margin-right: 12px;
        }
    }
</style>
