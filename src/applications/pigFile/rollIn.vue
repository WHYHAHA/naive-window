<template>
    <div class="p-2">
        <!--种猪转入  -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.breedingIn") }}</div>
                    <n-space align="center">
                        <!-- 转入登记 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/pigs-rollIn-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showExport = true">
                            {{ $t("button.export") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showImport = true">
                            {{ $t("button.import") }}
                        </n-button>
                        <n-button
                            type="info"
                            class="col-2"
                            @click="
                                () => {
                                    addrollInShow = true
                                    clearForm()
                                }
                            "
                            >{{ $t("dataTable.listing.inRegistration") }}</n-button
                        >
                    </n-space>
                </n-space>
            </template>
            <div class="tabHeader">
                <n-space justify="space-between">
                    <n-space align="center">
                        <div class="font-16 font-weight-bolder">
                            {{ $t("dataTable.listing.breedingList") }}:
                        </div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :is-date-disabled="disablePreviousDate"
                            :shortcuts="rangeShortcuts"
                            @update:value="
                                () => {
                                    search.page = 1
                                    getPigRollInList()
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
                            @keyup.enter="getPigRollInList"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigRollInList()
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
                :columns="columns"
                :data="rollInList"
                :loading="listLoading"
                :scroll-x="2500"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigRollInList"
            ></tableComponents>
        </n-card>

        <!-- 转入登记&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="addrollInShow"
            preset="card"
            :style="bodyStyle"
            :title="
                rollInFrom.id
                    ? $t('dtables.listing.toEdit')
                    : $t('dataTable.listing.inRegistration')
            "
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="rollInFrom"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input
                                        :style="{ width: '200px' }"
                                        v-model:value="rollInFrom.pigCode"
                                        @change="pigCodeChange"
                                        :disabled="rollInFrom.id ? true : false"
                                    /> -->
                                    <n-select
                                        v-model:value="rollInFrom.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                        :disabled="rollInFrom.id ? true : false"
                                    />
                                    <n-button type="primary" @click="pigInfoApiSearch">{{
                                        $t("dtables.listing.search")
                                    }}</n-button>
                                </n-input-group>
                            </n-form-item>

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
                                            v-model:value="rollInFrom.inFarmid"
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
                                            v-model:value="rollInFrom.inDormCode"
                                            :options="getDormListForFarmId(rollInFrom.inFarmid)"
                                            style="width: 120px"
                                            @update:value="rollInFrom.inColumnCode = null"
                                            :placeholder="
                                                $t('dataTable.listing.pleaseSelectABuilding')
                                            "
                                            filterable
                                        />
                                    </n-form-item>
                                    <n-form-item path="inColumnCode">
                                        <n-select
                                            v-model:value="rollInFrom.inColumnCode"
                                            :options="getColumnListForDormId(rollInFrom.inDormCode)"
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
                                path="rollInSource"
                                :label="$t('dataTable.listing.rollInSource')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="rollInFrom.rollInSource"
                                    :options="getRollInSource('rollInSource')"
                                />
                            </n-form-item>

                            <n-form-item path="weightValue" :label="$t('dataTable.listing.weight')">
                                <n-input-number
                                    v-model:value="rollInFrom.weightValue"
                                    :min="0"
                                    :validator="weightValidator"
                                    :style="{ width: '255px' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>

                            <n-form-item
                                path="recordDatetime"
                                :label="$t('dtables.listing.toDate')"
                            >
                                <n-date-picker
                                    :style="{ width: '255px' }"
                                    v-model:value="rollInFrom.recordDatetime"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                />
                            </n-form-item>

                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="rollInFrom.staffCode"
                                    :options="userList"
                                    filterable
                                    placeholder="请输入操作人"
                                />
                            </n-form-item>
                        </n-gi>
                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showloading"
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
                                    addrollInShow = false
                                    clearForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
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
        <eximportComponents
            v-model:openImport="showImport"
            templateNmae="piglet-archive-upload-template.xls"
            apiUrl="batchAddPigDormInRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigRollInList()
                }
            "
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="转入列表"
            apiUrl="exportPigDormInRecordApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import {
        getPigRollInListApi,
        addPigRollInApi,
        intoJudge,
        updatePigRollInApi
    } from "@/api/pigRollIn.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import eximportComponents from "@/components/exImport.vue"
    import exportComponents from "@/components/exExport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            eximportComponents,
            exportComponents,
            pigDetailComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            // const dialog = useDialog()
            const formRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                addOptional: false,
                addrollInShow: false,
                deleterollInShow: false,
                showExport: false,
                showImport: false,
                showloading: false,
                listLoading: false,
                // 编辑是判断是不是修改了pigCode
                isUpdatePcode: false,
                timeList: [Date.now(), Date.now()],
                // 判断是否降级
                demotion: false,
                search: {
                    // 转舍时间 （开始时间）
                    recordDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 转舍时间 （结束时间）
                    recordDatetimeLte: helper.formatStartTamp(Date.now()),
                    // 转入场区
                    inFarmidList: [],
                    // 转入栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    // 性别
                    genderList: [],
                    // 育种等级
                    breedingLevelList: [],
                    // 当前状态
                    pigStatusList: [],
                    // 来自场区
                    outFarmidList: [],
                    // 来自栋舍
                    outDormCodeList: [],
                    // 转入来源
                    rollInSourceList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                rollInFrom: {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    inColumnCode: "",
                    rollInSource: "",
                    weightValue: "",
                    recordDatetime: Date.now(),
                    pigCodee: ""
                },
                rollInList: [],
                pigDetail: {},
                tabSelection: [],
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

            const getRollInSource = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
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

            // 获取种猪转入列表
            const getPigRollInList = async () => {
                state.listLoading = true
                state.search.recordDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.recordDatetimeLte = helper.formatEndTamp(state.timeList[1])
                await getPigRollInListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.rollInList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 保存
            const addPigRollIn = async () => {
                let data = JSON.parse(JSON.stringify(state.rollInFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await intoJudge({ dormCode: state.rollInFrom.inDormCode }).then(res => {
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
                let data = JSON.parse(JSON.stringify(state.rollInFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await addPigRollInApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addrollInShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRollInList()
                    }
                })
            }
            // 继续入该栏位(转入栋舍)
            const initColumn = async () => {
                let data = JSON.parse(JSON.stringify(state.rollInFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await addPigRollInApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addrollInShow = false
                        state.demotion = false
                        clearForm()
                        state.search.page = 1
                        getPigRollInList()
                    } else {
                        window.$message(res.msg)
                        return
                    }
                })
            }
            // 编辑
            const updatePigRollIn = async () => {
                let data = JSON.parse(JSON.stringify(state.rollInFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await updatePigRollInApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.editSuccess"))
                        state.addrollInShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRollInList()
                    }
                })
            }

            // 删除单个查询记录
            // const deletePigRollIn = async row => {
            //     deletePigRollInApi({ id: row.id }).then(res => {
            //         if (res.code == 0) {
            //             message.success('删除成功！')
            //             state.search.page = 1
            //             state.deleterollInShow = false
            //             getPigRollInList()
            //         }
            //     })
            // }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.rollInFrom.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showloading = true
                await getPigInfoApi({ searchInfo: state.rollInFrom.pigCode }).then(res => {
                    state.showloading = false
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

            function pigCodeChange() {
                if (state.rollInFrom.id) {
                    state.isUpdatePcode = true
                }
            }

            const clearForm = () => {
                state.rollInFrom = {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    inColumnCode: "",
                    rollInSource: "",
                    weightValue: "",
                    recordDatetime: Date.now()
                }
                state.pigDetail = {}
                state.isUpdatePcode = false
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // 个体号
                        title: () => {
                            return t("dataTable.listing.theIndividual")
                        },
                        key: "pigCode"
                    },
                    {
                        // 电子耳标号
                        title: () => {
                            return t("dtables.listing.electronicEarLabel")
                        },
                        key: "earTagCode"
                    },
                    {
                        // 场内编号
                        title: () => {
                            return t("dtables.listing.basedOnTheNumber")
                        },
                        key: "earBrandCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.pigStatus")
                        },
                        key: "pigStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                row.pigStatus
                            )
                        }
                    },
                    {
                        // title: '猪场',
                        title: () => {
                            return t("dataTable.listing.pig")
                        },
                        key: "inFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.inFarmid)
                        }
                    },
                    {
                        // title: '猪舍',
                        title: () => {
                            return t("dataTable.listing.piggery")
                        },
                        key: "inDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.inDormCode)
                        }
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
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '性别',
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["gender"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        // title: '转入来源',
                        title: () => {
                            return t("dataTable.listing.rollInSource")
                        },
                        key: "rollInSource",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["rollInSource"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "rollInSource",
                                row.rollInSource
                            )
                        }
                    },
                    {
                        // title: '来源场',
                        title: () => {
                            return t("dataTable.listing.sourceField")
                        },
                        key: "outFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.outFarmid)
                        }
                    },
                    {
                        // title: '来源舍',
                        title: () => {
                            return t("dataTable.listing.sourceS")
                        },
                        key: "outDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.outDormCode)
                        }
                    },
                    {
                        // title: '来自栏位/床位',
                        title: () => {
                            return t("dataTable.listing.fromColumn")
                        },
                        key: "outColumnCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.dateOfBirth")
                        },
                        key: "pigBornDate",
                        render(row) {
                            return helper.timestampToTime(row.pigBornDate)
                        }
                    },
                    {
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
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },
                    {
                        // 体重/kg
                        title: () => {
                            return t("dataTable.listing.weight") + "/kg"
                        },
                        key: "weightValue",
                        render(row) {
                            return row.weightValue || "--"
                        }
                    },
                    {
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
                                            state.rollInFrom = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                staffCode:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.staffCode
                                                    ) || row.staffCode,
                                                inFarmid: row.inFarmid,
                                                inDormCode: row.inDormCode,
                                                inColumnCode: row.inColumnCode,
                                                rollInSource: row.rollInSource,
                                                weightValue: row.weightValue,
                                                recordDatetime: new Date(
                                                    row.recordDatetime
                                                ).getTime()
                                            }
                                            pigInfoApiSearch()
                                            state.isUpdatePcode = false
                                            state.addrollInShow = true
                                        }
                                    },
                                    { default: () => t("button.edit") }
                                )
                                // h(
                                //     NButton,
                                //     {
                                //         size: 'small',
                                //         type: 'error',
                                //         text: true,
                                //         onClick: () => {
                                //             dialog.warning({
                                //                 title: '警告',
                                //                 content: '确定删除该条数据么？',
                                //                 positiveText: '确定',
                                //                 negativeText: '取消',
                                //                 onPositiveClick: () => {
                                //                     deletePigRollIn(row)
                                //                 }
                                //             })
                                //         }
                                //     },
                                //     { default: () => t('button.delete') }
                                // )
                            ])
                        }
                    }
                ]
            }
            onMounted(() => {
                getPigRollInList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                getPigRollInList,
                pigInfoApiSearch,
                // 转入栋舍
                toBuildingUp,
                pigCodeChange,
                clearForm,
                getRollInSource,
                getFarmName,
                getDormName,
                getDictionaries,
                getDormListForFarmId,
                getColumnListForDormId,
                // 继续放入栏位
                initColumn,
                // 6位模糊查询
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                weightValidator: number => {
                    return /^[1-9][0-9]{0,3}?(\.\d{1,2})?$|^(\d{4})$/.test(number)
                },
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    inFarmid: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectIntoTheGround"),
                        trigger: ["blur", "change"]
                    },
                    inDormCode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectIntoTheBuilding"),
                        trigger: ["blur", "change"]
                    },
                    inColumnCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterIntoTheField"),
                        trigger: ["blur", "change"]
                    },
                    rollInSource: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectIntoSource"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    recordDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectACheckDate")
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
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "inFarmid") {
                        state.search.inFarmidList = options.filters.inFarmid
                    }
                    if (options.sourceColumn.key == "inDormCode") {
                        state.search.dormCodeList = options.filters.inDormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "gender") {
                        state.search.genderList = options.filters.gender
                    }
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    if (options.sourceColumn.key == "outFarmid") {
                        state.search.outFarmidList = options.filters.outFarmid
                    }
                    if (options.sourceColumn.key == "outDormCode") {
                        state.search.outDormCodeList = options.filters.outDormCode
                    }
                    if (options.sourceColumn.key == "rollInSource") {
                        state.search.rollInSourceList = options.filters.rollInSource
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigRollInList()
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.rollInFrom.id ? updatePigRollIn() : addPigRollIn()
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
                    state.rollInFrom.inDormCode = null
                    state.rollInFrom.inColumnCode = null
                },
                // 获取导入数据
                getEximportData(data) {
                    state.rollInList = [...state.rollInList, ...data]
                    state.showImport = false
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
    .rollIn-warn {
        margin-left: 35px;
        padding: 10px 0;
    }
</style>
