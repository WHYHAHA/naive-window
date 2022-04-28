<template>
    <div class="p-2">
        <!-- 查情记录 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.pigOestrusRecords") }}</div>
                    <n-space align="center">
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-love-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <!-- 登记查情，批量请求选配，导入，模板 -->
                        <n-button type="info" class="col-2" @click="showImport = true">
                            {{ $t("button.import") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">
                            {{ $t("button.export") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="addPigloveTime = true">
                            {{ $t("dataTable.listing.registrationAndInvestigation") }}
                        </n-button>
                        <n-button type="success" class="col-2" @click="showAddList = true">
                            {{ $t("dataTable.listing.theListOfAdd") }}
                        </n-button>
                        <n-button
                            type="info"
                            class="col-2"
                            @click="showBatchMatching = true"
                            :disabled="tabSelection.length > 0 ? false : true"
                            >{{ $t("button.batchRequestOptional") }}</n-button
                        >
                    </n-space>
                </n-space>
            </template>
            <n-card style="margin-bottom: 16px">
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="种猪" :tab="$t('dataTable.listing.swine')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 查情记录详情 -->
                                    <!-- 种猪记录详情 -->
                                    <div>{{ $t("dataTable.listing.swineRecordDetails") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigloveTimeList()
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
                                        @keyup.enter="getPigloveTimeList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigloveTimeList()
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
                            :data="loveTimeList"
                            :loading="showloading"
                            :scroll-x="1800"
                            v-model:search="search"
                            v-model:checked-row-keys="tabSelection"
                            @update:checked-row-keys="handleCheck"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigloveTimeList"
                        ></tableComponents>
                    </n-tab-pane>
                    <n-tab-pane name="后备" :tab="$t('dataTable.listing.backup')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 查情记录详情 -->
                                    <!-- 后备猪记录详情 -->
                                    <div>
                                        {{ $t("dataTable.listing.backupPigsRecordDetails") }}:
                                    </div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigloveTimeList()
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
                                        @keyup.enter="getPigloveTimeList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigloveTimeList()
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
                            :data="loveTimeList"
                            :loading="showloading"
                            :scroll-x="1800"
                            v-model:search="search"
                            v-model:checked-row-keys="tabSelection"
                            @update:checked-row-keys="handleCheck"
                            @update:filters="handleFiltersChange"
                            @update:search="getPigloveTimeList"
                        ></tableComponents>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-card>
        <!-- 加入选配 -->
        <n-modal
            class="custom-card"
            v-model:show="addOptional"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.joinOptional')"
            :bordered="false"
            :mask-closable="false"
        >
            <n-space vertical :size="20">
                <div class="flex align-center">
                    <div class="font-16 font-weight-bolder" style="width: 100px">
                        {{ $t("dataTable.listing.boar (main)") }}
                    </div>
                    <n-input-group>
                        <n-input
                            :style="{ width: '200px' }"
                            :placeholder="$t('dtables.listing.pleaseEnterTheSwineEncoding')"
                            v-model:value="pigCodeLike1"
                        />
                        <n-button type="primary" @click="getPigFileList('main')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </div>
                <div class="flex align-center">
                    <div class="font-16 font-weight-bolder" style="width: 100px">
                        {{ $t("dataTable.listing.boar (prepare)") }}
                    </div>
                    <n-input-group>
                        <n-input
                            :style="{ width: '200px' }"
                            :placeholder="$t('dtables.listing.pleaseEnterTheSwineEncoding')"
                            v-model:value="pigCodeLike2"
                        />
                        <n-button type="primary" @click="getPigFileList('prepare')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </div>
                <n-space justify="center">
                    <n-button type="info" @click="handleUpdateClick">{{
                        $t("dataTable.listing.confirm")
                    }}</n-button>
                    <n-button @click="addOptional = false">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-space>
        </n-modal>

        <!-- 登记查情 -->
        <n-modal
            class="custom-card"
            v-model:show="addPigloveTime"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.theSowToCheckRegistration')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="pigloveTimeForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-text code>
                        {{ $t("dataTable.listing.ifTheRequestSelectedForBreeding") }}
                    </n-text>
                    <n-grid x-gap="12" :cols="10">
                        <n-gi span="6 400:6 600:6 800:6">
                            <n-form-item
                                label-width="140"
                                path="pigCode"
                                :label="$t('dataTable.listing.theSowNumbers')"
                            >
                                <n-input-group>
                                    <!-- 母猪查情登记 -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="pigloveTimeForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="getPigDetail">
                                        {{ $t("dtables.listing.search") }}
                                    </n-button>
                                </n-input-group>
                            </n-form-item>
                            <n-form-item
                                label-width="140"
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <!-- <n-input v-model:value="pigloveTimeForm.staffCode" :style="{ width: '80%' }"  @input="find"/> -->
                                <n-select
                                    v-model:value="pigloveTimeForm.staffCode"
                                    filterable
                                    :options="userList"
                                    :style="{ width: '80%' }"
                                />
                            </n-form-item>
                            <n-form-item
                                label-width="140"
                                path="mapplyDate"
                                :label="$t('dataTable.listing.qestrusDate')"
                            >
                                <n-date-picker
                                    v-model:value="pigloveTimeForm.mapplyDate"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                    :style="{ width: '80%' }"
                                />
                            </n-form-item>
                            <n-form-item
                                label-width="140"
                                path="matchType"
                                :label="$t('dataTable.listing.matchType')"
                            >
                                <n-checkbox v-model:checked="pigloveTimeForm.matchType">
                                    {{ $t("dataTable.listing.applyForMatching") }}
                                </n-checkbox>
                            </n-form-item>
                        </n-gi>
                        <n-gi span="4 400:4 600:4 800:4">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dataTable.listing.theSowInformation')"
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
                        <n-button type="info" @click="handleValidateClick" attr-type="button">
                            {{ $t("dtables.listing.save") }}
                        </n-button>
                        <n-button @click="addPigloveTime = false">
                            {{ $t("dtables.listing.cancel") }}
                        </n-button>
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>
        <!-- 批量请求选配 -->
        <n-modal
            v-model:show="showBatchMatching"
            preset="dialog"
            :title="$t('dataTable.listing.batchForMatching')"
            :positive-text="$t('dataTable.listing.confirmTheMatching')"
            @positive-click="batchMatching"
            :negative-text="$t('dtables.listing.cancel')"
            :mask-closable="false"
        >
            <n-space vertical>
                <div>{{ $t("dataTable.listing.whetherToCommit") }}</div>
                <n-space>
                    <div>{{ $t("dataTable.listing.theSelectedSowsEncoding") }}</div>
                    <n-space>
                        <div v-for="item in tabSelection" :key="item">{{ getPigCode(item) }}</div>
                    </n-space>
                </n-space>
            </n-space>
        </n-modal>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigMatapplyApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigloveTimeList()
                }
            "
        ></importComponents>

        <!-- 导出 -->
        <exportComponents
            fileName
            apiUrl="exportPigloveTimeApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 列表新增 -->
        <addForListComponents
            ref="addForListRef"
            v-model:showAddList="showAddList"
            :formOptions="pigloveTimeForm"
            @getformlist="addBatchPigloveTime"
        ></addForListComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog, NInput } from "naive-ui"
    import {
        getPigloveTimeListApi,
        deleteloveTimeApi,
        addPigloveTimeApi,
        batchMatchingApi,
        getPigDetailApi,
        addBatchPigloveTimeApi
    } from "@/api/pigloveTime.js"
    import { getUserListByTidApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import importComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    import tableComponents from "@/components/table.vue"
    import addForListComponents from "@/components/addForList.vue"
    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            importComponents,
            pigDetailComponents,
            tableComponents,
            addForListComponents,
            exportComponents
        },
        setup() {
            const addForListRef = ref()
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                showExport: false,
                addOptional: false,
                addPigloveTime: false,
                selectLoading: false,
                showBatchMatching: false,
                showAddList: false,
                showImport: false,
                showFinding: false,
                showloading: false,
                timeList: [Date.now() - 86400000 * 2, Date.now()],
                columns: [],
                search: {
                    pigCode: "",
                    // 发情日期 开始
                    mapplyDateGte: "",
                    mapplyDateLte: "",
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 品种
                    pigSourcesList: [],
                    // 当前状态
                    pigStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                pigloveTimeForm: {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    mapplyDate: Date.now(),
                    matchType: false
                },
                loveTimeList: [],
                pigDetail: {},
                tabSelection: [],
                userList: [],
                // 母猪编码
                pigCodeOptions: []
            })
            let messageReactive = reactive(null)
            const closeLoading = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }
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
            const getPigCode = computed(() => {
                return function (id) {
                    let selectItem = state.loveTimeList.filter(item => item.id == id)
                    return selectItem[0].pigCode
                }
            })
            // 获取查情记录列表
            const getPigloveTimeList = async () => {
                state.search.mapplyDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.mapplyDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigloveTimeListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.loveTimeList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 删除单个查询记录
            const deleteloveTime = async row => {
                await deleteloveTimeApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.deleteTheSuccess"))
                        state.search.page = 1
                        getPigloveTimeList()
                    }
                })
            }
            // 保存
            const addPigloveTime = async () => {
                let data = JSON.parse(JSON.stringify(state.pigloveTimeForm))
                data.mapplyDate = helper.format(data.mapplyDate)
                data.matchType == false ? (data.matchType = 2) : (data.matchType = 1)
                await addPigloveTimeApi(data).then(res => {
                    if (res.code == 0) {
                        clearForm()
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.addPigloveTime = false
                        state.search.page = 1
                        getPigloveTimeList()
                    }
                })
            }
            // 批量保存
            const addBatchPigloveTime = async datalist => {
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
                await addBatchPigloveTimeApi(formData).then(res => {
                    closeLoading()
                    if (res.code == 0) {
                        if (res.data.badList.length == 0) {
                            window.$message.success(t("dataTable.listing.saveSuccess"))
                            state.showAddList = false
                        } else {
                            addForListRef.value.setTheWrongData(res.data)
                        }
                    }
                })
            }
            // 查询单个种猪详情
            const getPigDetail = async () => {
                if (!state.pigloveTimeForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showFinding = true
                state.pigCodeOptions = []
                await getPigDetailApi({ searchInfo: state.pigloveTimeForm.pigCode }).then(res => {
                    state.showFinding = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                        // 当前状态为 种猪时 选配按钮勾选
                        if (state.pigDetail.pigStatus == "种猪") {
                            state.pigloveTimeForm.matchType = true
                        } else {
                            state.pigloveTimeForm.matchType = false
                        }
                    } else {
                        message.error(t("dtables.listing.thisSowNumbersNotQueryTo"))
                    }
                })

                // if (state.pigloveTimeForm.pigCode.length == 6) {
                //     await getPigDetailApi({ searchInfo6: state.pigloveTimeForm.pigCode }).then(res => {
                //         state.showFinding = false
                //         if (res.code == 0) {
                //             state.pigDetail = res.data
                //             // console.log(res.data)
                //             // if (res.data.length > 0) {
                //             //     res.data.forEach(item => console.log(item))
                //             // }
                //             // 当前状态为 种猪时 选配按钮勾选
                //             if (state.pigDetail.pigStatus == "种猪") {
                //                 state.pigloveTimeForm.matchType = true
                //             } else {
                //                 state.pigloveTimeForm.matchType = false
                //             }
                //         } else {
                //             message.error("该母猪编号未查询到！")
                //         }
                //     })
                // } else {
                //     await getPigDetailApi({ searchInfo: state.pigloveTimeForm.pigCode }).then(res => {
                //         state.showFinding = false
                //         if (res.code == 0) {
                //             state.pigDetail = res.data
                //             // 当前状态为 种猪时 选配按钮勾选
                //             if (state.pigDetail.pigStatus == "种猪") {
                //                 state.pigloveTimeForm.matchType = true
                //             } else {
                //                 state.pigloveTimeForm.matchType = false
                //             }
                //         } else {
                //             message.error("该母猪编号未查询到！")
                //         }
                //     })
                // }
            }

            // 批量选配/加入选配
            const batchMatching = async () => {
                let sendData = []
                state.tabSelection.forEach(ele => {
                    sendData.push({ id: ele })
                })
                await batchMatchingApi({ models: sendData }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.joinTheMatchingSuccess"))
                        state.tabSelection = []
                        getPigloveTimeList()
                    }
                })
            }
            // 根据角色获取对应用户
            const getUserListByTid = async () => {
                await getUserListByTidApi({ rids: [525270759636024306, 968048203486093954] }).then(
                    res => {
                        if (res.code == 0) {
                            res.data.forEach(element => {
                                element.label = element.name
                                element.value = element.id
                            })
                            state.userList = res.data
                        }
                    }
                )
            }

            const clearForm = () => {
                state.pigloveTimeForm = {
                    pigCode: "",
                    staffCode: store.state.core.userInfo.id || "",
                    mapplyDate: Date.now(),
                    matchType: false
                }
                state.pigDetail = {}
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        type: "selection",
                        disabled(row) {
                            return row.matchType == "1" ||
                                !helper.dateInTwoDay(new Date(row.createDatetime).getTime())
                                ? true
                                : false
                        }
                    },
                    {
                        // title: '记录日期',
                        title: () => {
                            return t("dataTable.listing.recordDate")
                        },
                        key: "createDatetime",
                        render(row) {
                            return helper.timestampToTime(row.createDatetime)
                        }
                    },
                    {
                        // title: '发情状态',
                        title: () => {
                            return t("dataTable.listing.heatState")
                        },
                        key: "estrousState",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "estrousState",
                                row.estrousState
                            )
                        }
                    },
                    {
                        // title: '查情类型',
                        title: () => {
                            return t("dataTable.listing.qestrusType")
                        },
                        key: "mapplyType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["mapplyType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "mapplyType",
                                row.mapplyType
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
                        key: "pigStatus",
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
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
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
                        // title: '品种品系',
                        title: () => {
                            return t("dataTable.listing.varietiesOfStrain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '发情日期',
                        title: () => {
                            return t("dataTable.listing.qestrusDate")
                        },
                        key: "mapplyDate",
                        render(row) {
                            return helper.timestampToTime(row.mapplyDate)
                        }
                    },
                    {
                        // title: '育种值',
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },
                    {
                        // title: '胎次',
                        title: () => {
                            return t("dataTable.listing.parity")
                        },
                        key: "breedingBatch",
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
                                                value: state.search.breedingBatch,
                                                style: "margin-bottom:10px",
                                                onUpdateValue: val => {
                                                    // 搜索条件按照给定的val
                                                    state.search.breedingBatch = val
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
                                                                state.search.breedingBatch = ""
                                                                // 页数到1
                                                                state.search.page = 1
                                                                state.columns.forEach(element => {
                                                                    if (
                                                                        element.key ==
                                                                        "breedingBatch"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            undefined
                                                                })
                                                                // 调取列表数据
                                                                getPigloveTimeList()
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
                                                                        "breedingBatch"
                                                                    )
                                                                        element.filterOptionValue =
                                                                            state.search.breedingBatch
                                                                })
                                                                // 调取列表数据
                                                                getPigloveTimeList()
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
                                        // 选配 或 不在三天内 禁用
                                        disabled:
                                            row.matchType == "1" ||
                                            !helper.dateInTwoDay(new Date(row.mapplyDate).getTime())
                                                ? true
                                                : false,
                                        onClick: () => {
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t(
                                                    "dataTable.listing.determinedToJoinMatching"
                                                ),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    state.tabSelection = []
                                                    state.tabSelection.push(row.id)
                                                    batchMatching()
                                                }
                                            })
                                        }
                                    },
                                    { default: () => t("dataTable.listing.joinOptional") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: true,
                                        // 选配 或 不在三天内 禁用
                                        disabled:
                                            row.matchType == "1" ||
                                            !helper.dateInTwoDay(
                                                new Date(row.createDatetime).getTime()
                                            )
                                                ? true
                                                : false,
                                        onClick: () => {
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t(
                                                    "dataTable.listing.sureToDeleteThisData"
                                                ),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: t("dtables.listing.cancel"),
                                                onPositiveClick: () => {
                                                    deleteloveTime(row)
                                                }
                                            })
                                        }
                                    },
                                    { default: () => t("button.delete") }
                                )
                            ])
                        }
                    }
                ]
            }
            const tabsChange = value => {
                // 清空选中
                state.tabSelection = []
                state.search.pigStatusList = store.getters["dictionaries/getDictionarieId"](
                    "pigStatus",
                    value
                )
                state.search.page = 1
                getPigloveTimeList()
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
                tabsChange("种猪")
                setTableColumns()
                getUserListByTid()
            })
            return {
                ...toRefs(state),
                formRef,
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                getPigloveTimeList,
                getPigDetail,
                batchMatching,
                addBatchPigloveTime,
                getDictionarieName,
                getFarmName,
                getDormName,
                getPigCode,
                clearForm,
                tabsChange,
                handleSearch,
                addForListRef,
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: () => t("dtables.listing.pleaseEnterTheNumberSwine"),
                        trigger: ["input"]
                    },
                    staffCode: {
                        required: true,
                        message: () => t("dtables.listing.pleaseEnterTheOperation"),
                        trigger: ["input"]
                    },
                    mapplyDate: {
                        required: true,
                        message: () => t("dtables.listing.pleaseSelectADateOfEstrus")
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
                    state.tabSelection = JSON.parse(JSON.stringify(rowKeys))
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
                    if (options.sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = options.filters.pigStatus
                    }
                    if (options.sourceColumn.key == "mapplyType") {
                        state.search.mapplyTypeList = options.filters.mapplyType
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigloveTimeList()
                },

                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            addPigloveTime()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                }
            }
        }
    })
</script>
