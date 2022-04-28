<template>
    <n-drawer :close-on-esc="false" v-model:show="drawActive" :width="502" placement="top" height="100%">
        <n-drawer-content title="检测登记">
            <template #header>
                <div class="flex justify-between w-100 align-center">
                    <span class="font-weight-bolder font-24">检测登记</span>

                    <n-spin :show="spinShow">
                        <div class>
                            <n-button type="primary" @click="handleAddFormItem">添加一项</n-button>
                            <n-button class="save-btn" type="info" @click="handleValidateClick">保存</n-button>
                            <n-button @click="close()">关闭</n-button>
                        </div>
                    </n-spin>
                </div>
            </template>
            <div class="bg-light p-2">
                <n-spin :show="spinShow">
                    <template #description>正在加载，请稍等</template>
                    <!-- 在此循环formList，产生多个form，并将同等级的rules放入 -->
                    <div class="mb-2 animate__animated animate__pulse" :class="formItem.randomRef" v-for="(formItem,formIndex) in formList" :key="formItem.randomId">
                        <n-form :model="formItem.addFrom" :ref="calcFormRef(formItem.randomRef)" :rules="formItem.rules" label-placement="left" :label-width="100">
                            <!-- {{formItem}} -->
                            <!-- {{formItem.rules}} -->
                            <n-space vertical :size="20" class="bg-white p-2">
                                <div class="flex justify-between w-100 pl-2 font-20 mb-1">
                                    <span class="font-weight-bolder">登记项{{ formIndex + 1 }}：</span>
                                    <n-button secondary type="error" @click="handleDelFormItem(formItem.randomId)">{{ `删除登记项${formIndex+1}` }}</n-button>
                                </div>
                                <n-grid x-gap="20" :cols="10">
                                    <n-gi span="3 400:3 600:3 800:3">
                                        <n-form-item path="pigCode" label="种猪编码：">
                                            <n-input-group>
                                                <!-- <n-input v-model:value="formItem.addFrom.pigCode" maxlength="20" :disabled="formItem.addFrom.id ? true : false" /> -->
                                                <!-- 母猪编号 -->
                                                <n-select
                                                    v-model:value="formItem.addFrom.pigCode"
                                                    :style="{ width: '60%' }"
                                                    :disabled="formItem.addFrom.id ? true : false"
                                                    :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                                    clearable
                                                    remote
                                                    maxlength="20"
                                                    filterable
                                                    :options="pigCodeOptions"
                                                    :loading="loading"
                                                    @search="handleSearch"
                                                />
                                                <n-button type="primary" @click="getPigDetail(formItem.addFrom.pigCode, formItem)">搜索</n-button>
                                            </n-input-group>
                                        </n-form-item>

                                        <n-form-item path="typeSettingId" label="检测类型：">
                                            <n-select :disabled="isEdit?true:false" filterable @update:value="id => changeMeaureType(id, formItem)" v-model:value="formItem.addFrom.typeSettingId" :options="measureOptions" :style="{width:'180px'}" />
                                            <n-popover trigger="hover">
                                                <template #trigger>
                                                    <n-button quaternary class="ml-1" circle type="error">
                                                        <template #icon>
                                                            <n-icon>？</n-icon>
                                                        </template>
                                                    </n-button>
                                                </template>
                                                <span>请选择更改检测类型，以展示或切换检测数据</span>
                                            </n-popover>
                                        </n-form-item>

                                        <n-form-item path="physicalExaminationDateTime" label="检测日期：">
                                            <!-- :is-date-disabled="formItem.disablePreviousDate" -->
                                            <n-date-picker :disabled="isEdit?true:false" v-model:value="formItem.addFrom.physicalExaminationDateTime" type="date" actions="['now']" @focus="(e) => {e.target.blur()}" />
                                        </n-form-item>

                                        <n-form-item path="examinationid" label="检测人：">
                                            <n-select :disabled="isEdit?true:false" filterable v-model:value="formItem.addFrom.examinationid" :options="samplcollectOptions" :style="{width:'180px'}" />
                                        </n-form-item>
                                    </n-gi>
                                    <n-gi span="2 400:2 600:2 800:2">
                                        <pigDetailComponents :cardTitle="detailTitle" :pigDetail="formItem.pigDetail" :displayOptions="['nowFarmid','nowDormCode','nowColumnCode','gender',]"></pigDetailComponents>
                                        <!-- <n-card :title="detailTitle">
                                            <n-space vertical v-if="formItem.pigDetail.nowFarmid">
                                                <n-grid x-gap="12" :cols="2">
                                                    <n-gi>
                                                        <n-space vertical>
                                                            <n-text depth="3">场区：{{ formItem.pigDetail.nowFarmid || '暂无'}}</n-text>
                                                            <n-text depth="3">栋舍：{{ formItem.pigDetail.nowDormCode || '暂无'}}</n-text>
                                                            <n-text depth="3">栏位：{{ formItem.pigDetail.nowColumnCode || '暂无'}}</n-text>
                                                        </n-space>
                                                    </n-gi>
                                                </n-grid>
                                            </n-space>
                                            <n-empty description="请点击左侧搜索，查看详情！" v-else></n-empty>
                                        </n-card>-->
                                    </n-gi>
                                    <n-gi span="5 400:5 600:5 800:5" class="animate__animated animate__shakeX" v-if="formItem.badField[0]">
                                        <n-card title="错误信息" class="error-title">
                                            <ol class="text-totalRed pl-2">
                                                <li v-for="(errItem,errIndex) in formItem.badField" :key="errIndex">{{ errItem }}</li>
                                            </ol>
                                        </n-card>
                                    </n-gi>
                                </n-grid>

                                <n-grid x-gap="20" :cols="10" v-show="formItem.measureData">
                                    <n-gi span="10 400:5 600:5 800:10">
                                        <!-- <div v-if="formItem.badField[0]" class="animate__animated animate__fadeIn">
                                            <n-divider class="error-divider" title-placement="left">错误信息：</n-divider>
                                            <ol class="text-totalRed pl-8">
                                                <li v-for="(errItem,errIndex) in formItem.badField" :key="errIndex">{{ errItem }}</li>
                                            </ol>
                                        </div>-->

                                        <n-divider v-if="formItem.measureData[0]" title-placement="left">检测数据：</n-divider>
                                        <div class="modal-scroll-content">
                                            <div v-for="(item,index) in formItem.measureData" :key="index" class="animate__animated animate__fadeIn">
                                                <!-- <n-divider title-placement="left">part {{index + 1}}</n-divider> -->
                                                <n-form-item class="inline-form-item" label-width="150" :path="itemc.label.trim()" :label="itemc.label" v-for="(itemc,indexc) in item.children" :key="indexc">
                                                    <!-- <n-input
                                                        :placeholder="'请输入' + itemc.label"
                                                        v-if="itemc.type == 'text'"
                                                        v-model:value="formItem.addFrom[itemc.label]"
                                                        :style="{width:'180px',display:'inline-block'}"
                                                        @input="text => itemc.value = text"
                                                    />
                                                    <n-select
                                                        v-else
                                                        filterable
                                                        :disabled="itemc.disabled"
                                                        v-model:value="formItem.addFrom[itemc.label]"
                                                        :options="itemc.options"
                                                        :style="{width:'180px',display:'inline-block'}"
                                                        @update:value="text => dynamicSelectHandle(itemc.label, itemc.options,text, item.children, itemc, formItem)"
                                                    />-->
                                                    <n-input
                                                        :placeholder="$t('dtables.listing.pleaseEnterThe') + itemc.label"
                                                        v-if="itemc.type == 'text'"
                                                        v-model:value="formItem.addFrom[itemc.label]"
                                                        :style="{width:'180px',display:'inline-block'}"
                                                        @input="text => itemc.value = text"
                                                        maxlength="20"
                                                    />
                                                    <n-input-number
                                                        v-else-if="itemc.type == 'number'"
                                                        :max="9999"
                                                        :min="0"
                                                        v-model:value="formItem.addFrom[itemc.label]"
                                                        :style="{width:'180px',display:'inline-block'}"
                                                        :placeholder="$t('dtables.listing.pleaseEnterThe') + itemc.label"
                                                        @blur="() => itemc.value = formItem.addFrom[itemc.label]"
                                                        clearable
                                                    />
                                                    <n-select
                                                        v-else-if="itemc.type == 'select'"
                                                        filterable
                                                        :disabled="itemc.disabled"
                                                        v-model:value="formItem.addFrom[itemc.label]"
                                                        :options="itemc.options"
                                                        :style="{width:'180px',display:'inline-block'}"
                                                        @update:value="text => dynamicSelectHandle(itemc.label, itemc.options,text, item.children, itemc, formItem)"
                                                    />
                                                </n-form-item>
                                            </div>
                                        </div>
                                    </n-gi>
                                </n-grid>
                            </n-space>
                        </n-form>
                    </div>
                </n-spin>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script>
    import { defineComponent, reactive, ref, toRefs, computed, onMounted } from "vue"
    import { useMessage } from "naive-ui"
    import { useStore } from "vuex"

    import {
        getDetailById,
        updatePmPhysicalExamination,
        batchCreatePmPhysicalExamination,
        getMeasureOptionsApi,
        getPmDictByName
    } from "@/api/pigMeasure.js"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"

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
                eTitle: "forelimb",
                options: []
            },
            {
                title: "后肢",
                eTitle: "hind legs",
                options: []
            },
            {
                title: "生殖器",
                eTitle: "genitals",
                options: []
            },
            {
                title: "目测体态",
                eTitle: "visual inspection of body posture",
                options: []
            },
            {
                title: "鼻头颜色",
                eTitle: "nasal head colour",
                options: []
            },
            {
                title: "畸形",
                eTitle: "deformity",
                options: []
            }
        ]
    }
    let generateRandomId = () => parseInt(Math.random() * 9999999999)

    // 这里是用来进行判断后台的字典中英文数据，定死不要改，若要改，后台和前端一起改，一定一定要同步
    const verifyFlag = {
        deformity: {
            zh: "畸形",
            en: "deformity",
            all: ["畸形", "deformity"]
        }
    }

    export default defineComponent({
        components: {
            pigDetailComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            let refData = {
                drawActive: ref(false),
                loadingRef: ref(false),
                optionsRef: ref([])
            }
            let randomRefs = {}
            let state = reactive({
                isEdit: false,
                formList: [],
                spinShow: false,
                multipleRegister: false,
                showAdd: false,
                showImport: false,
                showExport: false,
                showloading: false,
                selectMeasureOption: undefined,

                // 检测选项
                measureOptions: {},
                ablactationList: [],

                tabSelection: [],
                columns: [],
                columnsDynamic: [],
                dynamicList: [],
                basicColumns: [],
                basicList: [],
                dynamicRules: {},
                // 母猪编码
                pigCodeOptions: []

                // rules: {},
            })
            let computeds = {
                // 计算动态ref
                calcFormRef: computed(() => randomRef => randomRefs[randomRef]),
                samplcollectOptions: computed(() => store.state.dictionaries.userSelectList),
                getDictionaries: computed(() => {
                    return function (dictionaryKey) {
                        return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    }
                })
            }
            let signMethods = {
                // formList删除一项
                handleDelFormItem(ramdonId, type) {
                    if (!state.formList[1]) {
                        return message.error(`至少保留一项`)
                    }
                    // 验证是否需要确认删除
                    if (type == "noConfirm") {
                        let findIndex = state.formList.findIndex(t => t.randomId === ramdonId)
                        let randomItem = state.formList[findIndex]?.randomId
                        delete randomRefs[`formRef${randomItem}`]

                        state.formList.splice(findIndex, 1)
                    } else {
                        window.$dialog.warning({
                            title: "提示",
                            content: "是否确认删除？",
                            closable: "false",
                            transformOrigin: "center",
                            negativeText: "取消",
                            positiveText: "确认",
                            onPositiveClick: () => {
                                let findIndex = state.formList.findIndex(t => t.randomId === ramdonId)
                                let randomItem = state.formList[findIndex]?.randomId
                                delete randomRefs[`formRef${randomItem}`]

                                state.formList.splice(findIndex, 1)
                            }
                        })
                    }
                },
                // 给formList添加一项   success!!!
                handleAddFormItem() {
                    let data = {
                        badField: [],
                        randomId: generateRandomId(),
                        addFrom: {
                            pigCode: undefined,
                            physicalExaminationDateTime: Date.now(),
                            examinationid: store.state.core.userInfo.id,
                            typeSettingId: undefined,
                            optionValue: ""
                        },
                        rules: {},
                        measureData: [],
                        pigDetail: {},
                        resultRules: {
                            value: {
                                required: true,
                                message: "请输入数据"
                            },
                            pigCode: {
                                required: true,
                                message: "请输入猪只编号",
                                trigger: ["blur", "change"]
                            },
                            physicalExaminationDateTime: {
                                required: true,
                                message: "请选择检测日期"
                            },
                            typeSettingId: {
                                required: true,
                                message: "清选择转入类型",
                                trigger: ["blur", "change"]
                            },
                            examinationid: {
                                required: true,
                                message: "请选择检测人",
                                trigger: ["blur", "change"]
                            }
                        }
                    }
                    data.randomRef = `formRef${data.randomId}`
                    randomRefs[data.randomRef] = ref(null)
                    data.rules = { ...data.resultRules }
                    state.formList.push(data)
                    setTimeout(() => {
                        methods.animateScroll(document.querySelector(`.${data.randomRef}`), 30)
                    })
                },
                // 产出tamplete中要使用的form对象实体   success!!!
                calcFormItem: params => state.formList.find(t => t.randomId === params.randomId),
                // 检测登记中的下拉框体数据改变，用于操作缺陷状态数据   success!!!
                dynamicSelectHandle(params, options, option, parentList, currentItem, formItem) {
                    let item = options.find(t => t.value == option)
                    currentItem.value = item.value
                    if (params == "目测体态") {
                        let zIndex = parentList.findIndex(t =>
                            verifyFlag.deformity.all.includes(t.label)
                        )
                        //-1 则偏好设置中没配置畸形
                        if (zIndex == -1) {
                            return false
                        }
                        let language = store.state.core.language
                        let labelTitle =
                            language == "zh-CN" ? verifyFlag.deformity.zh : verifyFlag.deformity.en

                        if (item?.label == "有缺陷") {
                            parentList[zIndex].disabled = false
                            formItem.dynamicRules[labelTitle].required = true
                        } else if (item?.label != "有缺陷") {
                            parentList[zIndex].disabled = true
                            formItem.dynamicRules[labelTitle].required = false
                            parentList[zIndex].value = ""
                            formItem.addFrom[labelTitle] = ""
                        }
                    }
                },
                // 登记 -检测类型改变 success!!!
                changeMeaureType(id, formItem) {
                    return new Promise(resolve => {
                        let formItemData = signMethods.calcFormItem(formItem)
                        let dynamicRules = {}
                        formItemData.measureData = []
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
                                    // 从后台发来的检测项，每一项的title都需要根据字典去查英文title，用来获取英文字典名
                                    let label = store.getters["dictionaries/getDictionarieName"](
                                        t[0],
                                        tc
                                    )
                                    let language = store.state.core.language

                                    // 根据title的名称去决定是什么类型
                                    let type = typeObj.select.some(
                                        to => to[language == "zh-CN" ? "title" : "eTitle"] == label
                                    )
                                        ? "select"
                                        : calcInputType(label)
                                        ? "number"
                                        : "text"

                                    let obj = {
                                        value: "",
                                        key: tc,
                                        type,
                                        label,
                                        disabled: verifyFlag.deformity.all.includes(label) // 验证是否是缺陷
                                    }

                                    if (type == "select") {
                                        // 如果是下拉，那么需要用中文的title名去调用后台接口查询英文字典名
                                        let dictCode = await getPmDictByName({
                                            dictName: label,
                                            dictLogo: t[0]
                                        })

                                        let dictData = store.getters["dictionaries/getDictionaries"](
                                            dictCode.data.dictLogo
                                        )

                                        // 根据title的名称。去决定从本地state中读取options还是从字典读取
                                        // 如果从字典读取，需要使用刚刚从后台获取到的英文名查询到相对应的options
                                        // 如果是从字典读取的，那么验证里面有咩有“有缺陷”的选项，有则继续查询二级下拉选项，追加一项检测项
                                        mapDictData = dictData?.map(tm => {
                                            let obj = {}
                                            obj.label = tm.dictName
                                            obj.value = tm.dictCode
                                            return obj
                                        })
                                        obj.options = mapDictData || []
                                    }

                                    // 这里是在为特定的字段输入给出规则,并且一定是number start ，在这里寻找匹配的特定rules源对象，没有则取*中的规则
                                    const rulesData = state.measureOptions.find(tid => tid.id == id)
                                    let ruleItemData =
                                        typeObj.number.find(tRu => tRu.title == rulesData.tname) ||
                                        typeObj.number.find(tRu => tRu.title == "*")

                                    dynamicRules[label] = reactive({
                                        required: !verifyFlag.deformity.all.includes(label),
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
                                            required: !verifyFlag.deformity.all.includes(label),
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
                                    formItemData.addFrom[label] = ""
                                    return obj
                                })
                                let result = await Promise.all(childrenData).then(res =>
                                    Promise.resolve(res)
                                )

                                let temperara = {
                                    title: t[0],
                                    children: result
                                }
                                formItemData.measureData.push(temperara)

                                formItemData.dynamicRules = dynamicRules

                                formItemData.rules = {
                                    ...formItemData.resultRules,
                                    ...dynamicRules
                                }
                                measuringProjects.length - 1 == i && resolve(formItemData.measureData)

                                methods.animateScroll(
                                    document.querySelector(`.${formItemData.randomRef}`),
                                    20
                                )
                            })
                        })
                        formItem.badField = []
                    })
                },
                // 获取检测选项 success!!!
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
                            }
                        })
                    })
                },
                // 处理最后的战场
                handleModalChange: res => {
                    if (res?.code == 0) {
                        message.success(state.isEdit ? "编辑成功" : "保存成功")
                        signMethods.clearForm()
                        refData.drawActive.value = false
                    }
                },
                // 保存
                handleData: async operaType => {
                    let data = JSON.parse(JSON.stringify(state.formList))
                    data.forEach(formItem => {
                        let optionValue = {}
                        formItem.measureData.forEach(t => {
                            let obj = {}
                            t.children.forEach(tc => (obj[tc.key] = tc.value))
                            optionValue[t.title] = [obj]
                        })
                        formItem.addFrom.optionValue = JSON.stringify(optionValue)
                    })
                    let resultData = {
                        modelList: data.map(t => ({ ...t.addFrom, randomId: t.randomId }))
                    }

                    let res = await operaType(resultData)
                    // eslint-disable-next-line require-atomic-updates
                    state.spinShow = false
                    if (!res) {
                        return false
                    }
                    // 发现出现问题的数据，根据后台返回的randomId来进行前端重新渲染数据
                    if (res?.data?.roundIdField[0]) {
                        let delForm = []
                        state.formList.forEach((t, i) => {
                            if (res.data.roundIdField.includes(t.randomId.toString())) {
                                let findData = res.data.badList.find(ti => ti.randomId == t.randomId)
                                state.formList[i].badField = findData.badField
                            } else {
                                delForm.push(t.randomId)
                            }
                        })
                        // 这里删除正确的
                        delForm.forEach(t => signMethods.handleDelFormItem(t, "noConfirm"))
                        // 滚动到最上面，用以处理错误数据
                        setTimeout(() => {
                            methods.animateScroll(
                                document.querySelector(`.${state.formList[0].randomRef}`),
                                40
                            )
                        })
                        return false
                    }
                    signMethods.handleModalChange(res)
                },
                // 异步加载（模糊后6位）
                handleSearch: async query => {
                    refData.optionsRef.value = []
                    if (query.length == 6) {
                        refData.loadingRef.value = true
                        await getfuzzyQuery({ searchInfo: query }).then(res => {
                            refData.loadingRef.value = false
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
                },
                // 查询单个母猪种猪详情 success!!!
                getPigDetail: async (paramsCode, paramsItem) => {
                    let formItemData = signMethods.calcFormItem(paramsItem)

                    if (!paramsCode) {
                        message.error("请输入猪只编码")
                        return false
                    }
                    await getPigInfoApi({
                        searchInfo: paramsCode
                    }).then(res => {
                        if (res.code == 0) {
                            formItemData.pigDetail = res.data
                        }
                    })
                },

                clearForm: () => {
                    state.formList = []
                },
                handleValidateClick() {
                    let valis = []
                    state.formList.forEach((formItem, formIndex) => {
                        randomRefs[formItem.randomRef].value[0]
                            .validate(errors => errors && valis.push({ formIndex, formItem }))
                            .catch(() => {})
                    })

                    setTimeout(() => {
                        if (valis[0]) {
                            return message.error(`登记项中有未填写内容，请补充并完善`)
                        }
                        state.spinShow = true
                        signMethods.handleData(
                            state.isEdit
                                ? updatePmPhysicalExamination
                                : batchCreatePmPhysicalExamination
                        )
                    })
                }
            }

            // draw内基础方法
            const methods = {
                animateScroll(element, speed) {
                    const drawContent = document.querySelector(".n-drawer-body-content-wrapper")
                    let rect = element.getBoundingClientRect()
                    let top = drawContent.scrollTop + rect.top
                    let currentTop = drawContent.scrollTop

                    let requestId
                    function step() {
                        currentTop += speed
                        if (currentTop <= top) {
                            drawContent.scrollTo(0, currentTop)
                            requestId = window.requestAnimationFrame(step)
                        } else {
                            window.cancelAnimationFrame(requestId)
                        }
                    }
                    window.requestAnimationFrame(step)
                },
                open() {
                    signMethods.handleAddFormItem()
                    state.spinShow = false
                    refData.drawActive.value = true
                },
                close() {
                    window.$dialog.warning({
                        title: "提示",
                        content: "退出将不保存当前已填写数据，是否确认？",
                        closable: "false",
                        transformOrigin: "center",
                        negativeText: "取消",
                        positiveText: "确认",
                        onPositiveClick: () => {
                            signMethods.clearForm()
                            refData.drawActive.value = false
                        }
                    })
                }
            }
            onMounted(() => {
                signMethods.getMeasureOptions()
                // state.formList[0].rules = { ...state.formList[0].resultRules }
                // state.rules = { ...state.resultRules }
            })
            return {
                ...toRefs(state),
                ...randomRefs,
                ...computeds,
                ...signMethods,
                ...methods,
                ...refData
            }
        }
    })
</script>
<style lang="less" scoped>
    .inline-form-item {
        display: inline-flex;
        margin: 10px 0;
        width: 33%;
        /deep/ .n-form-item-feedback-wrapper {
            margin-left: 10px;
        }
    }
    /deep/ .n-drawer-header,
    /deep/ .n-drawer-header__main {
        width: 100%;
    }
    .save-btn {
        margin: 0 10px;
    }
    /deep/ .error-title .n-card-header__main {
        color: #f80000;
    }
    /deep/ .n-form-item-feedback-wrapper {
        display: flex;
        align-items: center;
    }
</style>
