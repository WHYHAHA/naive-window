<template >
    <div class="p-2">
        <!-- 种猪转出 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.breedingOut") }}</div>
                    <n-space align="center">
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/pigs-rollOut-upload-template.xlsx"
                            target="_blank"
                        >{{$t('button.downloadTemplate')}}</n-button>
                        <n-button type="info" class="col-2" @click="showExport=true">{{$t('button.export')}}</n-button>
                        <n-button type="info" class="col-2" @click="showImport=true">{{$t('button.import')}}</n-button>
                        <n-button type="info" class="col-2" @click="addrollOutShow=true;clearForm()">{{$t('dataTable.listing.outRegistration')}}</n-button>
                    </n-space>
                </n-space>
            </template>
            <div class="tabHeader">
                <n-space justify="space-between">
                    <n-space align="center">
                        <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.breedingList')}}:</div>
                        <n-date-picker
                            v-model:value="timeList"
                            type="daterange"
                            :is-date-disabled="disablePreviousDate"
                            :shortcuts="rangeShortcuts"
                            @update:value="search.page=1;getPigRollOUtList()"
                            actions="['confirm']"
                        />
                    </n-space>
                    <div>
                        <n-input
                            :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                            autosize
                            style="min-width: 300px;"
                            clearable
                            v-model:value="search.pigCode"
                            @keyup.enter="getPigRollOUtList"
                            @clear="search.pigCode='';getPigRollOUtList()"
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
                :data="rollOUtList"
                :loading="listLoading"
                :scroll-x="2800"
                v-model:search="search"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleFiltersChange"
                @update:search="getPigRollOUtList"
            ></tableComponents>
            <!-- <n-space vertical>
                <n-data-table
                    :columns="columns"
                    :data="rollOUtList"
                    :scroll-x="1900"
                    @update:checked-row-keys="handleCheck"
                    :row-class-name="rowClassName"
                    :row-key="row => row.id"
                    @update:filters="handleFiltersChange"
                    :loading="listLoading"
                />
                <n-space justify="end">
                    <n-pagination
                        v-model:page="search.page"
                        v-model:pageSize="search.limit"
                        :item-count="search.total"
                        show-size-picker
                        :page-sizes="[10, 20, 30, 40]"
                        show-quick-jumper
                        @update:page="getPigRollOUtList()"
                        @update:pageSize="getPigRollOUtList()"
                    />
                </n-space>
            </n-space>-->
        </n-card>

        <!-- 转出登记&编辑 -->
        <n-modal
            class="custom-card"
            v-model:show="addrollOutShow"
            preset="card"
            :style="bodyStyle"
            :title="rollOutFrom.id ? $t('dataTable.listing.turnOutToEdit'):$t('dataTable.listing.outRegistration')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-form :model="rollOutFrom" ref="formRef" :rules="rules" label-placement="left" label-width="auto">
                <n-space vertical :size="20">
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input :style="{ width: '200px' }" v-model:value="rollOutFrom.pigCode" @change="pigCodeChange" :disabled="rollOutFrom.id ? true : false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="rollOutFrom.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="pigInfoApiSearch">{{$t('dtables.listing.search')}}</n-button>
                                </n-input-group>
                            </n-form-item>

                            <!-- <n-form-item path="inColumnCode" label="原栏位：" v-if="isUpdatePcode">
                                <n-input :style="{ width: '255px' }" v-model:value="rollOutFrom.inColumnCode" />
                            </n-form-item>-->

                            <n-form-item path="rollOutType" :label="$t('dataTable.listing.outType')">
                                <n-select
                                    :style="{ width: '255px' }"
                                    :placeholder="$t('dataTable.listing.pleaseSelectATransferType')"
                                    v-model:value="rollOutFrom.rollOutType"
                                    :options="getrollOutType('rollOutType')"
                                />
                            </n-form-item>

                            <n-form-item path="salesOfPig" :label="$t('dataTable.listing.nowPigStatus')" v-if="rollOutFrom.rollOutType== '2'">
                                <n-select
                                    :style="{ width: '255px' }"
                                    :placeholder="$t('dataTable.listing.pleaseSelectFromThePigs')"
                                    v-model:value="rollOutFrom.salesOfPig"
                                    :options="getsalesOfPig('salesOfPig')"
                                />
                            </n-form-item>

                            <n-form-item path="weightValue" :label="$t('dataTable.listing.weight')">
                                <n-input-number v-model:value="rollOutFrom.weightValue" :min="0" :validator="weightValidator" :style="{ width: '255px' }">
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>

                            <n-form-item path="recordDatetime" :label="$t('dataTable.listing.goOutOfDate')">
                                <n-date-picker
                                    :style="{ width: '255px' }"
                                    v-model:value="rollOutFrom.recordDatetime"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="(e) => {e.target.blur()}"
                                />
                            </n-form-item>

                            <n-form-item path="staffCode" :label="$t('dataTable.listing.operatingPersonnel')">
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="rollOutFrom.staffCode"
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
                                :displayOptions="['nowFarmid','nowDormCode','nowColumnCode']"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{$t('dtables.listing.save')}}</n-button>
                        <n-button @click="addrollOutShow=false;clearForm()">{{$t('dtables.listing.cancel')}}</n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导出 -->
        <eximportComponents v-model:openImport="showImport" templateNmae="piglet-archive-upload-template.xls" apiUrl="batchAddPigDormOutRecordApi" @getlist="search.page=1;getPigRollOUtList()"></eximportComponents>

        <!-- 导出 -->
        <exportComponents fileName="转出列表" apiUrl="exportPigDormOutRecordApi" :search="search" v-model:openExport="showExport"></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    import { getPigRollOutListApi, addPigRollOutApi, updatePigRollOutApi } from "@/api/pigRollOut.js"
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
                    recordDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 转舍时间 （结束时间）
                    recordDatetimeLte: helper.formatStartTamp(Date.now()),
                    // 转出场区
                    inFarmidList: [],
                    // 转出栋舍
                    inDormCodeList: [],
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
                    dormCodeList: [],
                    // 转出来源
                    rollOutTypeList: [],
                    staffCodeList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined,
                    pigCode: ""
                },
                columns: [],
                rollOutFrom: {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    rollOutType: "",
                    weightValue: "",
                    recordDatetime: Date.now(),
                    inColumnCode: ""
                },
                delForm: {
                    id: "",
                    columnCode: ""
                },
                rollOUtList: [],
                pigDetail: {},
                tabSelection: [],
                rollInSources: [],
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
            // 判断猪只是否出现条件
            const getDictionaries = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey, id)
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

            const getrollOutType = computed(() => {
                return function (dictionaryKey) {
                    let allArr = store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    let arr = []
                    allArr.forEach(ele => {
                        if (ele.label != "内部转舍" && ele.label != "死亡离场") {
                            arr.push(ele)
                        }
                    })
                    return arr
                }
            })

            const getsalesOfPig = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })

            // 获取种猪转出列表
            const getPigRollOUtList = async () => {
                state.listLoading = true
                state.search.recordDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.recordDatetimeLte = helper.formatEndTamp(state.timeList[1])
                await getPigRollOutListApi(state.search).then(res => {
                    if (res.code == 0) {
                        state.listLoading = false
                        state.rollOUtList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 保存
            const addPigRollOut = async () => {
                let data = JSON.parse(JSON.stringify(state.rollOutFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await addPigRollOutApi(data).then(res => {
                    if (res.code == 0) {
                        message.success("保存成功！")
                        state.addrollOutShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRollOUtList()
                    }
                })
            }
            // 编辑
            const updatePigRollOut = async () => {
                let data = JSON.parse(JSON.stringify(state.rollOutFrom))
                data.recordDatetime = helper.format(data.recordDatetime)
                await updatePigRollOutApi(data).then(res => {
                    if (res.code == 0) {
                        message.success("编辑成功！")
                        state.addrollOutShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRollOUtList()
                    }
                })
            }

            // 删除单个查询记录
            // const deletePigRollOut = async row => {
            //     await deletePigRollOutApi({ id: row.id }).then(res => {
            //         if (res.code == 0) {
            //             message.success('删除成功！')
            //             state.search.page = 1
            //             getPigRollOUtList()
            //         }
            //     })
            // }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async () => {
                if (!state.rollOutFrom.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showloading = true
                await getPigInfoApi({ searchInfo: state.rollOutFrom.pigCode }).then(res => {
                    state.showloading = false
                    if (res.code == 0 && res.data) {
                        if (JSON.stringify(res.data) == "{}") {
                            message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                        }
                        state.pigDetail = res.data
                        if (res.data.pigStatus == "7") {
                            state.rollOutFrom.rollOutType = "3"
                        }
                    } else {
                        message.error(t("dtables.listing.thisSwineNumbersNotQueryTo"))
                        state.pigDetail = {}
                    }
                })
            }

            function pigCodeChange() {
                if (state.rollOutFrom.id) {
                    state.isUpdatePcode = true
                }
            }

            const clearForm = () => {
                state.rollOutFrom = {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    rollOutType: "",
                    weightValue: "",
                    recordDatetime: Date.now(),
                    inColumnCode: ""
                }
                state.isUpdatePcode = false
                state.pigDetail = {}
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.pigCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // 耳标编码
                        title: () => {
                            return t("dataTable.listing.studEarringsCoding")
                        },
                        key: "earTagCode"
                    },
                    {
                        // 耳牌
                        title: () => {
                            return t("dataTable.listing.earCard")
                        },
                        key: "earBrandCode"
                    },
                    {
                        // 状态
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
                        // 猪只销售状态
                        title: () => t("dtables.listing.pigSalesStatus"),
                        key: "salesOfPig",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "salesOfPig",
                                row.salesOfPig
                            )
                        }
                    },
                    {
                        // 转出场区
                        title: () => {
                            return t("dataTable.listing.outFarm")
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
                        // 转出栋舍
                        title: () => {
                            return t("dataTable.listing.outDorm")
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
                        // 转出栏/床位
                        title: () => {
                            return t("dataTable.listing.outColumn")
                        },
                        key: "outColumnCode"
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
                        // 品系
                        title: () => {
                            return t("dataTable.listing.strain")
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
                        // 转出类型
                        title: () => {
                            return t("dataTable.listing.outType")
                        },
                        key: "rollOutType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["rollOutType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "rollOutType",
                                row.rollOutType
                            )
                        }
                    },
                    {
                        // 去向场区
                        title: () => {
                            return t("dataTable.listing.goFarm")
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
                        // 去向栋舍
                        title: () => {
                            return t("dataTable.listing.goDorm")
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
                        // 去向栏位/床位
                        title: () => {
                            return t("dataTable.listing.goColumn")
                        },
                        key: "inColumnCode"
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
                        // 育种等级
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
                        // 育种值
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
                        fixed: "right",
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        // 只有转场类型为‘销售转舍‘时才可操作
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "rollOutType",
                                                row.rollOutType
                                            ) == "销售离场" && !helper.dateInDay(row.createDatetime)
                                                ? false
                                                : true,
                                        onClick: () => {
                                            state.rollOutFrom = {
                                                id: row.id,
                                                pigCode: row.pigCode,
                                                staffCode:
                                                    store.getters["dictionaries/getUserId"](
                                                        row.staffCode
                                                    ) || row.staffCode,
                                                rollOutType: row.rollOutType,
                                                weightValue: row.weightValue,
                                                recordDatetime: new Date(row.recordDatetime).getTime(),
                                                inColumnCode: ""
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
                                //         disabled:
                                //             store.getters['dictionaries/getDictionarieName']('rollOutType', row.rollOutType) == '销售离场'
                                //                 ? false
                                //                 : true,
                                //         onClick: () => {
                                //             state.delForm.id = row.id
                                //             dialog.warning({
                                //                 title: '警告',
                                //                 content: '确定删除该条数据么？',
                                //                 positiveText: '确定',
                                //                 negativeText: '取消',
                                //                 onPositiveClick: () => {
                                //                     deletePigRollOut(row)
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
                getPigRollOUtList()
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                delFormRef,
                getPigRollOUtList,
                pigInfoApiSearch,
                getDictionaries,
                clearForm,
                // 模糊查询(后6位)
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getFarmName,
                getDormName,
                pigCodeChange,
                getrollOutType,
                getsalesOfPig,
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
                    inColumnCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheOriginalColumn"),
                        trigger: ["blur", "change"]
                    },
                    rollOutType: {
                        required: true,
                        message: t("dataTable.listing.pleaseSelectATransferType"),
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
                    },
                    salesOfPig: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectACheckDate")
                    }
                },
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [new Date().setFullYear(new Date().getFullYear() - 1), new Date().getTime()]
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
                        state.search.inDormCodeList = options.filters.inDormCode
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
                        state.search.dormCodeList = options.filters.outDormCode
                    }
                    if (options.sourceColumn.key == "rollOutType") {
                        state.search.rollOutTypeList = options.filters.rollOutType
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigRollOUtList()
                },

                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.rollOutFrom.id ? updatePigRollOut() : addPigRollOut()
                        } else {
                            message.error(
                                t("dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit")
                            )
                        }
                    })
                },
                // 获取导出数据
                getEximportData(data) {
                    state.rollOUtList = [...state.rollOUtList, ...data]
                    state.showImport = false
                }
            }
        }
    })
</script>
<style lang="">
</style>