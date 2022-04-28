<template>
    <div class="p-2">
        <!-- 死亡登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.deathRegistration") }}</div>
                    <n-space align="center">
                        <!-- 死亡登记、导出，上传，下载上传模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/pigs-death-upload-template.xlsx"
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
                                    addrollOutShow = true
                                    clearForm()
                                }
                            "
                            >{{ $t("dataTable.listing.dieRegistration") }}</n-button
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
                                    getPigDeathList()
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
                            @keyup.enter="getPigDeathList"
                            @clear="
                                () => {
                                    search.pigCode = ''
                                    getPigDeathList()
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
                :data="PigDeathList"
                :loading="listLoading"
                :scroll-x="3000"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigDeathList"
            ></tableComponents>
        </n-card>

        <!-- 死亡登记&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="addrollOutShow"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.dieRegistration')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form
                :model="deathFrom"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input :style="{ width: '200px' }" v-model:value="deathFrom.pigCode" @change="pigCodeChange" :disabled="deathFrom.id ? true : false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="deathFrom.pigCode"
                                        :style="{ width: '60%' }"
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
                                path="deathType"
                                :label="$t('dataTable.listing.deathType')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.deathType"
                                    :options="getDeathType('deathType')"
                                    @change="deathTypeChange"
                                />
                            </n-form-item>

                            <n-form-item
                                path="deathReason"
                                :label="$t('dataTable.listing.deathCause')"
                                v-if="deathFrom.deathType == '1' || deathFrom.deathType == '2'"
                            >
                                <n-select
                                    v-if="deathFrom.id"
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.deathReason"
                                    :options="
                                        deathFrom.pigStatus == '5' || deathFrom.pigStatus == '4'
                                            ? getDeathReason('pigDeathReason')
                                            : getDeathReason('pigletDeathReason')
                                    "
                                />

                                <n-select
                                    v-else
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.deathReason"
                                    :options="
                                        pigDetail.pigStatus == '种猪' ||
                                        pigDetail.pigStatus == '后备'
                                            ? getDeathReason('pigDeathReason')
                                            : getDeathReason('pigletDeathReason')
                                    "
                                />
                            </n-form-item>

                            <n-form-item
                                path="remark"
                                :label="$t('dataTable.listing.remark')"
                                v-if="deathFrom.deathType == '3'"
                            >
                                <n-input
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.remark"
                                    type="textarea"
                                    maxlength="200"
                                    show-count
                                    :placeholder="$t('dtables.listing.pleaseEnterANote')"
                                />
                            </n-form-item>

                            <n-form-item
                                path="handlingType"
                                :label="$t('dataTable.listing.treatmentMethod')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.handlingType"
                                    :options="getHandlingType('handlingType')"
                                />
                            </n-form-item>

                            <n-form-item path="weightValue" :label="$t('dataTable.listing.weight')">
                                <n-input-number
                                    v-model:value="deathFrom.weightValue"
                                    :min="0"
                                    :validator="weightValidator"
                                    :style="{ width: '255px' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>

                            <n-form-item
                                path="deathDatetime"
                                :label="$t('dataTable.listing.dateOfDeath')"
                            >
                                <n-date-picker
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.deathDatetime"
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

                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="deathFrom.staffCode"
                                    :options="userList"
                                    filterable
                                    :placeholder="$t('dtables.listing.pleaseEnterTheOperation')"
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
                                    addrollOutShow = false
                                    clearForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导出 -->
        <eximportComponents
            v-model:openImport="showImport"
            templateNmae="piglet-archive-upload-template.xls"
            apiUrl="batchAddPigDieRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigDeathList()
                }
            "
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="死亡列表"
            apiUrl="exportPigDieApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import { getPigDeathListApi, addPigDeathApi, updatePigDeathApi } from "@/api/pigDeath.js"
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
            const delFormRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                addOptional: false,
                addrollOutShow: false,
                showExport: false,
                showImport: false,
                showloading: false,
                listLoading: false,
                // 编辑是判断是不是修改了pigCode
                isUpdatePcode: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    // 转舍时间 （开始时间）
                    deathDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 转舍时间 （结束时间）
                    deathDatetimeLte: helper.formatStartTamp(Date.now()),
                    // 转出场区
                    nowFarmidList: [],
                    // 转出栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    // 性别
                    genderList: [],
                    // 育种等级
                    breedingLevelList: [],
                    // 当前状态
                    pigStatusList: [],
                    // 死亡类型
                    deathTypeList: [],
                    // 处理方式
                    handlingTypeList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                deathFrom: {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    deathType: "",
                    handlingType: "",
                    deathDatetime: Date.now()
                },
                delForm: {
                    id: "",
                    columnCode: ""
                },
                PigDeathList: [],
                pigDetail: {},
                tabSelection: [],
                // 母猪编码
                pigCodeOptions: []
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
            const getHandlingType = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            const getDeathReason = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            const getDeathType = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            // 获取死亡登记列表列表
            const getPigDeathList = async () => {
                state.listLoading = true
                state.search.deathDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.deathDatetimeLte = helper.formatEndTamp(state.timeList[1])
                await getPigDeathListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.PigDeathList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 保存
            const addPigDeath = async () => {
                let data = JSON.parse(JSON.stringify(state.deathFrom))
                data.deathDatetime = helper.format(data.deathDatetime)
                await addPigDeathApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addrollOutShow = false
                        clearForm()
                        state.search.page = 1
                        getPigDeathList()
                    }
                })
            }
            // 编辑
            const updatePigDeath = async () => {
                let data = JSON.parse(JSON.stringify(state.deathFrom))
                data.deathDatetime = helper.format(data.deathDatetime)
                await updatePigDeathApi(data).then(res => {
                    if (res.code == 0) {
                        message.success("编辑成功！")
                        state.addrollOutShow = false
                        clearForm()
                        state.search.page = 1
                        getPigDeathList()
                    }
                })
            }

            // 删除单个查询记录
            // const deletePigDeath = async row => {
            //     await deletePigDeathApi({ id: row.id }).then(res => {
            //         if (res.code == 0) {
            //             message.success('删除成功！')
            //             state.search.page = 1
            //             getPigDeathList()
            //         }
            //     })
            // }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.deathFrom.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showloading = true
                await getPigInfoApi({ searchInfo: state.deathFrom.pigCode }).then(res => {
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
                if (state.deathFrom.id) {
                    state.isUpdatePcode = true
                }
            }

            function deathTypeChange() {
                state.deathFrom.remark = ""
                state.deathFrom.deathReason = ""
            }

            const clearForm = () => {
                state.deathFrom = {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    deathType: "",
                    deathReason: "",
                    handlingType: "",
                    deathDatetime: Date.now(),
                    remark: ""
                }
                state.isUpdatePcode = false
                state.pigDetail = {}
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // 个体号
                        title: () => {
                            return t("dataTable.listing.theIndividual")
                        },
                        key: "pigCode",
                        width: 160
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
                        // 之前状态
                        title: () => {
                            return t("dataTable.listing.beforeStatus")
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
                        // 当前场区
                        title: () => {
                            return t("dataTable.listing.nowFarm")
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
                        // 当前栋舍
                        title: () => {
                            return t("dataTable.listing.nowDorm")
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
                        // 当前栏/床位
                        title: () => {
                            return t("dataTable.listing.nowColumn")
                        },
                        key: "nowColumnCode"
                    },
                    {
                        // 品种
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
                        // 品种品系
                        title: () => {
                            return t("dataTable.listing.varietiesOfStrain")
                        },
                        key: "strain"
                    },
                    {
                        // 性别
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
                        // 死亡类型
                        title: () => {
                            return t("dataTable.listing.deathType")
                        },
                        key: "deathType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["deathType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "deathType",
                                row.deathType
                            )
                        }
                    },
                    {
                        // 死亡原因
                        title: () => {
                            return t("dataTable.listing.deathCause")
                        },
                        key: "deathReason",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigDeathReason"]
                        }),
                        render(row) {
                            return row.pigStatus == "5" || row.pigStatus == "4"
                                ? store.getters["dictionaries/getDictionarieName"](
                                      "pigDeathReason",
                                      row.deathReason
                                  )
                                : store.getters["dictionaries/getDictionarieName"](
                                      "pigletDeathReason",
                                      row.deathReason
                                  )
                        },
                        ellipsis: {
                            tooltip: true
                        }
                    },
                    {
                        // 备注
                        title: () => {
                            return t("dataTable.listing.remark")
                        },
                        key: "remark"
                    },
                    {
                        // 处理方式
                        title: () => {
                            return t("dataTable.listing.treatmentMethod")
                        },
                        key: "handlingType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["handlingType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "handlingType",
                                row.handlingType
                            )
                        }
                    },
                    {
                        // 出生日期
                        title: () => {
                            return t("dataTable.listing.dateOfBirth")
                        },
                        key: "pigBornDate",
                        render(row) {
                            return helper.timestampToTime(row.pigBornDate)
                        }
                    },
                    {
                        // 记录人
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
                        // 操作人
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
                        width: 100,
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
                                            state.deathFrom = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                staffCode:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.staffCode
                                                    ) || row.staffCode,
                                                deathType: row.deathType,
                                                handlingType: row.handlingType,
                                                deathReason: row.deathReason,
                                                pigStatus: row.pigStatus,
                                                weightValue: row.weightValue,
                                                deathDatetime: new Date(row.deathDatetime).getTime()
                                            }
                                            pigInfoApiSearch()
                                            state.isUpdatePcode = false
                                            state.addrollOutShow = true
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
                                //             state.delForm.id = row.id
                                //             dialog.warning({
                                //                 title: '警告',
                                //                 content: '确定删除该条数据么？',
                                //                 positiveText: '确定',
                                //                 negativeText: '取消',
                                //                 onPositiveClick: () => {
                                //                     deletePigDeath(row)
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
                getPigDeathList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                delFormRef,
                // 模糊搜索(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getPigDeathList,
                pigInfoApiSearch,
                clearForm,
                getFarmName,
                pigCodeChange,
                deathTypeChange,
                getHandlingType,
                getDeathReason,
                getDeathType,
                getDormName,
                userList: computed(() => store.state.dictionaries.userSelectList),
                weightValidator: number => {
                    return /^[1-9][0-9]{0,3}?(\.\d{1,2})?$|^(\d{4})$/.test(number)
                },
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    deathType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectATypeOfDeath"),
                        trigger: ["blur", "change"]
                    },
                    deathReason: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTheCauseOfDeath"),
                        trigger: ["blur", "change"]
                    },
                    remark: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterANote"),
                        trigger: ["blur", "change"]
                    },
                    handlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAHandling"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheOperation"),
                        trigger: ["blur", "change"]
                    },
                    deathDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectACheckDate")
                    }
                },
                delrules: {
                    columnCode: {
                        required: true,
                        message: t("dataTable.listing.pleaseEnterTheField"),
                        trigger: ["blur", "change"]
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
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.dormCodeList = options.filters.nowDormCode
                    }
                    if (options.sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = options.filters.pigSources
                    }
                    if (options.sourceColumn.key == "gender") {
                        state.search.genderList = options.filters.gender
                    }
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    if (options.sourceColumn.key == "deathType") {
                        state.search.deathTypeList = options.filters.deathType
                    }
                    if (options.sourceColumn.key == "handlingType") {
                        state.search.handlingTypeList = options.filters.handlingType
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "deathReason") {
                        state.search.deathReasonList = options.filters.deathReason
                    }

                    state.search.page = 1
                    getPigDeathList()
                },

                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.deathFrom.id ? updatePigDeath() : addPigDeath()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                // 获取导出数据
                getEximportData(data) {
                    state.PigDeathList = [...state.PigDeathList, ...data]
                    state.showImport = false
                },
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                }
            }
        }
    })
</script>
<style lang=""></style>
