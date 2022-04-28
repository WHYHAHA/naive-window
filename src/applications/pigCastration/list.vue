<template>
    <div class="pigHealthCare p-2">
        <!-- 阉割记录 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.castrationRecord") }}</div>
                    <n-space align="center">
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.import")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                    </n-space>
                </n-space>
            </template>

            <!-- tabs切换 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待审定" :tab="$t('dataTable.listing.forReviewAndApproval')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <div>
                                                <!-- 待审定阉割记录 -->
                                                {{
                                                    $t(
                                                        "dataTable.listing.forExaminationAndCastration"
                                                    )
                                                }}:
                                            </div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigCastrationList()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                            <!-- <n-button type="info" @click="showAdd=true">登记</n-button> -->
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getpigCastrationList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getpigCastrationList()
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
                                    :data="pigCastrationList"
                                    :loading="showloading"
                                    :scroll-x="1500"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigCastrationList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 选留公猪列表 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.selectedBoarList") }}:
                                            </div>
                                        </n-space>
                                    </div>

                                    <n-space vertical v-if="stayPigList.length > 0">
                                        <n-data-table
                                            size="small"
                                            :columns="stayColumns"
                                            :data="stayPigList"
                                            :row-class-name="rightRowClassName"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="staySearch.page"
                                                v-model:pageSize="staySearch.limit"
                                                :item-count="staySearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                show-quick-jumper
                                                :page-slot="4"
                                                @update:page="getPigRightDetail(detailId)"
                                                @update:pageSize="getPigRightDetail(detailId)"
                                            >
                                                <template #prefix="{ itemCount }"
                                                    >{{ $t("dataTable.listing.altogether") }}
                                                    {{ itemCount }}
                                                    {{ $t("dtables.listing.project") }}</template
                                                >
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>

                                <n-space vertical>&nbsp;</n-space>

                                <!-- <n-card content-style="padding: 0;">
                        <div class="p-2 tabHeader">
                            <n-space align="center">
                                阉割公猪列表
                                <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.castratedBoarList')}}:</div>
                            </n-space>
                        </div>

                        <n-space vertical v-if="removePigList.length>0">
                            <n-data-table size="small" :columns="medicineColumns" :data="removePigList" :row-class-name="rightRowClassName" />
                            <n-space justify="end" style="padding-bottom:5px;">
                                <n-pagination
                                    v-model:page="removeSearch.page"
                                    v-model:pageSize="removeSearch.limit"
                                    :item-count="removeSearch.total"
                                    show-size-picker
                                    :page-sizes="[10, 20, 30, 40]"
                                    show-quick-jumper
                                    :page-slot="4"
                                    @update:page="getPigHealthCareDetail()"
                                    @update:pageSize="getPigHealthCareDetail()"
                                >
                                    <template #prefix="{ itemCount}">共 {{ itemCount }} 项</template>
                                </n-pagination>
                            </n-space>
                        </n-space>
                        <n-empty v-else description="暂无记录，请点击左侧编辑" class="mt-3"></n-empty>
                                </n-card>-->
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="待阉割" :tab="$t('dtables.listing.toCastrate')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <div>
                                                <!-- 待阉割记录 -->
                                                {{ $t("dataTable.listing.toCastrateRecord") }}:
                                            </div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigCastrationList()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                            <!-- <n-button type="info" @click="showAdd=true">登记</n-button> -->
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getpigCastrationList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getpigCastrationList()
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
                                    :data="pigCastrationList"
                                    :loading="showloading"
                                    :scroll-x="1500"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigCastrationList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 选留公猪列表 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.selectedBoarList") }}:
                                            </div>
                                        </n-space>
                                    </div>

                                    <n-space vertical v-if="stayPigList.length > 0">
                                        <n-data-table
                                            size="small"
                                            :columns="stayColumns"
                                            :data="stayPigList"
                                            :row-class-name="rightRowClassName"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="staySearch.page"
                                                v-model:pageSize="staySearch.limit"
                                                :item-count="staySearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                show-quick-jumper
                                                :page-slot="4"
                                                @update:page="getPigRightDetail(detailId)"
                                                @update:pageSize="getPigRightDetail(detailId)"
                                            >
                                                <template #prefix="{ itemCount }"
                                                    >{{ $t("dataTable.listing.altogether") }}
                                                    {{ itemCount }}
                                                    {{ $t("dtables.listing.project") }}</template
                                                >
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>

                                <n-space vertical>&nbsp;</n-space>

                                <!-- <n-card content-style="padding: 0;">
                        <div class="p-2 tabHeader">
                            <n-space align="center">
                                阉割公猪列表
                                <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.castratedBoarList')}}:</div>
                            </n-space>
                        </div>

                        <n-space vertical v-if="removePigList.length>0">
                            <n-data-table size="small" :columns="medicineColumns" :data="removePigList" :row-class-name="rightRowClassName" />
                            <n-space justify="end" style="padding-bottom:5px;">
                                <n-pagination
                                    v-model:page="removeSearch.page"
                                    v-model:pageSize="removeSearch.limit"
                                    :item-count="removeSearch.total"
                                    show-size-picker
                                    :page-sizes="[10, 20, 30, 40]"
                                    show-quick-jumper
                                    :page-slot="4"
                                    @update:page="getPigHealthCareDetail()"
                                    @update:pageSize="getPigHealthCareDetail()"
                                >
                                    <template #prefix="{ itemCount}">共 {{ itemCount }} 项</template>
                                </n-pagination>
                            </n-space>
                        </n-space>
                        <n-empty v-else description="暂无记录，请点击左侧编辑" class="mt-3"></n-empty>
                                </n-card>-->
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="已阉割" :tab="$t('dtables.listing.hasBeenCastrated')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <div>
                                                {{ $t("dataTable.listing.castrationRecord") }}:
                                            </div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getpigCastrationList()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                            <!-- <n-button type="info" @click="showAdd=true">登记</n-button> -->
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getpigCastrationList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getpigCastrationList()
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
                                    :data="pigCastrationList"
                                    :loading="showloading"
                                    :scroll-x="1500"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getpigCastrationList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 选留公猪列表 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.selectedBoarList") }}:
                                            </div>
                                        </n-space>
                                    </div>

                                    <n-space vertical v-if="stayPigList.length > 0">
                                        <n-data-table
                                            size="small"
                                            :columns="stayColumns"
                                            :data="stayPigList"
                                            :row-class-name="rightRowClassName"
                                        />
                                        <n-space justify="end" style="padding-bottom: 5px">
                                            <n-pagination
                                                v-model:page="staySearch.page"
                                                v-model:pageSize="staySearch.limit"
                                                :item-count="staySearch.total"
                                                show-size-picker
                                                :page-sizes="[10, 20, 30, 40]"
                                                show-quick-jumper
                                                :page-slot="4"
                                                @update:page="getPigRightDetail(detailId)"
                                                @update:pageSize="getPigRightDetail(detailId)"
                                            >
                                                <template #prefix="{ itemCount }"
                                                    >共 {{ itemCount }} 项</template
                                                >
                                            </n-pagination>
                                        </n-space>
                                    </n-space>
                                    <n-empty
                                        v-else
                                        description="暂无记录，请点击左侧编辑"
                                        class="mt-3"
                                    ></n-empty>
                                </n-card>

                                <n-space vertical>&nbsp;</n-space>

                                <!-- <n-card content-style="padding: 0;">
                        <div class="p-2 tabHeader">
                            <n-space align="center">
                                阉割公猪列表
                                <div class="font-16 font-weight-bolder">{{$t('dataTable.listing.castratedBoarList')}}:</div>
                            </n-space>
                        </div>

                        <n-space vertical v-if="removePigList.length>0">
                            <n-data-table size="small" :columns="medicineColumns" :data="removePigList" :row-class-name="rightRowClassName" />
                            <n-space justify="end" style="padding-bottom:5px;">
                                <n-pagination
                                    v-model:page="removeSearch.page"
                                    v-model:pageSize="removeSearch.limit"
                                    :item-count="removeSearch.total"
                                    show-size-picker
                                    :page-sizes="[10, 20, 30, 40]"
                                    show-quick-jumper
                                    :page-slot="4"
                                    @update:page="getPigHealthCareDetail()"
                                    @update:pageSize="getPigHealthCareDetail()"
                                >
                                    <template #prefix="{ itemCount}">共 {{ itemCount }} 项</template>
                                </n-pagination>
                            </n-space>
                        </n-space>
                        <n-empty v-else description="暂无记录，请点击左侧编辑" class="mt-3"></n-empty>
                                </n-card>-->
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                </n-tabs>
                <!-- 登记 -->
                <n-modal
                    class="custom-card"
                    v-model:show="showAdd"
                    preset="card"
                    :style="bodyStyle"
                    :title="$t('dataTable.listing.castrationIsRegistered')"
                    :bordered="false"
                    :mask-closable="false"
                >
                    <n-form
                        :model="planForm"
                        ref="formRef"
                        :rules="rules"
                        label-placement="left"
                        label-width="auto"
                    >
                        <n-space vertical :size="20">
                            {{ $t("dataTable.listing.castrationPlan") }}
                            <n-grid x-gap="12" :cols="3">
                                <n-gi>
                                    <n-form-item :label="$t('dataTable.listing.dens')">{{
                                        planForm.nestNumber
                                    }}</n-form-item>

                                    <n-form-item :label="$t('dataTable.listing.motherCode')">{{
                                        planForm.pigCode
                                    }}</n-form-item>

                                    <n-form-item :label="$t('dataTable.listing.fatherCode')">{{
                                        planForm.boarCode
                                    }}</n-form-item>

                                    <n-form-item
                                        :label="$t('dataTable.listing.seedNumberOfBoars')"
                                        >{{ planForm.farrowingMCount }}</n-form-item
                                    >
                                </n-gi>
                                <n-gi>
                                    <n-form-item :label="$t('dataTable.listing.inCourt')">{{
                                        getFarmName(planForm.farmid)
                                    }}</n-form-item>

                                    <n-form-item
                                        :label="$t('dataTable.listing.femaleBreedingLevel')"
                                        >{{
                                            getDictionarieName(
                                                "breedingLevel",
                                                planForm.breedingLevel
                                            )
                                        }}</n-form-item
                                    >

                                    <n-form-item
                                        :label="$t('dataTable.listing.theParentBreedingLevel')"
                                        >{{
                                            getDictionarieName(
                                                "breedingLevel",
                                                planForm.boarCodeBreedingLevel
                                            )
                                        }}</n-form-item
                                    >

                                    <n-form-item
                                        path="seedRetentionMCount"
                                        :label="$t('dataTable.listing.castrationOf')"
                                        >{{ planForm.castrationMCount }}</n-form-item
                                    >
                                </n-gi>
                                <n-gi>
                                    <n-form-item :label="$t('dataTable.listing.inPiggery')">{{
                                        getDormName(planForm.dormCode)
                                    }}</n-form-item>

                                    <n-form-item
                                        :label="$t('dataTable.listing.femaleBreedingValue')"
                                        >{{ planForm.breedingValue }}</n-form-item
                                    >

                                    <n-form-item
                                        :label="$t('dataTable.listing.theParentBreedingValue')"
                                        >{{ planForm.boarCodeBreedingValue }}</n-form-item
                                    >

                                    <n-form-item
                                        path="seedRetentionMCount"
                                        :label="$t('dataTable.listing.seedOf')"
                                        >{{ planForm.seedRetentionMCount }}</n-form-item
                                    >
                                </n-gi>
                            </n-grid>
                        </n-space>

                        <n-space vertical :size="20" style="margin: 10px 0">
                            <n-scrollbar style="max-height: 300px">
                                {{ $t("dataTable.listing.inSeedBreeding") }}
                                <n-data-table
                                    size="small"
                                    :columns="seedColumns"
                                    :data="seedCountList"
                                    v-model:checked-row-keys="checkedRowKeys"
                                    :row-key="row => row"
                                    :row-class-name="rightRowClassName"
                                />
                            </n-scrollbar>
                        </n-space>

                        <n-space justify="center">
                            <n-button type="info" @click="handleValidateClick">{{
                                $t("dataTable.listing.confirm")
                            }}</n-button>
                            <n-button
                                @click="
                                    () => {
                                        showAdd = false
                                        closeFrom()
                                    }
                                "
                                >{{ $t("dtables.listing.cancel") }}</n-button
                            >
                        </n-space>
                    </n-form>
                </n-modal>
            </n-card>
        </n-card>
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
        ref,
        computed
    } from "vue"
    import { NButton, useMessage, NSpace } from "naive-ui"
    // getpigCastrationListApi
    import { getPigHealthCareDetailApi } from "@/api/pigHealthCare.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"
    import {
        getPigcastrationPlanApi,
        getPigcastrationPlanAndBreedingBoarApi,
        addPigBreedingBoarApi,
        getSecondaryCastrationRecordApi,
        addSecondaryPigBreedingBoarApi,
        getPigBreedingBoarApi
    } from "@/api/pigCastration.js"

    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        name: "pigHealthCare",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents
        },
        setup() {
            const checkedRowKeysRef = ref([])
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            let loadingReactive = null
            const { t } = useI18n()

            const state = reactive({
                showAdd: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCodeLike: "",
                    planStatusList: [],
                    // 选配记录日期开始时间
                    healthcareDateGte: helper.formatStartTamp(Date.now()),
                    // 选配记录日期结束时间
                    healthcareDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                staySearch: {
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                removeSearch: {
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                seedColumns: [],
                columns: [],
                stayColumns: [],
                removeColumns: [],
                dormList: [],
                // 登记保健form
                form: {
                    condition: {
                        castrationPlanId: undefined
                    },
                    models: []
                },
                pigCastrationList: [],
                stayPigList: [],
                removePigList: [],
                planForm: {},
                seedCountList: [],

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {},

                isTwo: false,
                rightLiu: [],
                detailId: ""
            })
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
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

            // 表单计算属性
            // 获取所有场区
            const getFarmList = computed(() => {
                return store.state.dictionaries.farmList
            })
            // 根据场区获取对应栋舍
            const getDormList = async () => {
                state.form.dormCode = ""
                let dormList = []
                if (state.form.farmid) {
                    dormList = store.state.dictionaries.dormList.filter(
                        item => item.farmCode == state.form.farmid
                    )
                } else {
                    dormList = store.state.dictionaries.dormList
                }
                state.dormList = dormList
            }
            // 获取字典 症状
            const getSymptomsOptions = computed(() => {
                return store.state.dictionaries.symptomsList
            })
            // 获取字典 药品
            const getDrugsListOptions = computed(() => {
                return store.state.dictionaries.drugsList
            })

            // 获取阉割列表
            const getpigCastrationList = async () => {
                state.search.healthcareDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.healthcareDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigcastrationPlanApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigCastrationList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 小列表
            const getPigHealthCareDetail = async () => {
                await getPigHealthCareDetailApi(state.staySearch).then(res => {
                    if (res.code == 0) {
                        state.useMedicineList = res.data.list
                        state.staySearch.page = res.data.pageNo
                        state.staySearch.limit = res.data.pageSize
                        state.staySearch.total = res.data.total
                    }
                })
            }
            // 右边留种列表
            const getPigRightDetail = async id => {
                state.staySearch.castrationPlanId = id
                await getPigBreedingBoarApi(state.staySearch).then(res => {
                    if (res.code == 0) {
                        state.stayPigList = res.data.list
                        state.staySearch.page = res.data.pageNo
                        state.staySearch.limit = res.data.pageSize
                        state.staySearch.total = res.data.total
                    }
                })
            }

            // 登记
            const addpigCastration = async () => {
                if (checkedRowKeysRef.value.length == 0) {
                    message.warning(t("dtables.listing.pleaseSelectSeedBreeding"))
                    return false
                }
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("dtables.listing.isToSave"), {
                        duration: 0
                    })
                }
                let fromData = JSON.parse(JSON.stringify(state.form))
                let arr = []
                checkedRowKeysRef.value.forEach(ele => {
                    arr.push({
                        pigletCode: ele.pigCode,
                        earBrandCode: ele.earBrandCode,
                        breedingLevel: ele.breedingLevel
                    })
                })
                fromData.models = arr
                await addPigBreedingBoarApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.search.page = 1
                        getpigCastrationList()
                        state.showAdd = false
                        closeFrom()
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }
            // 二次阉割

            const addTwopigCastration = async () => {
                if (checkedRowKeysRef.value.length == 0) {
                    message.warning(t("dtables.listing.pleaseSelectSeedBreeding"))
                    return false
                }
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("dtables.listing.isToSave"), {
                        duration: 0
                    })
                }
                let fromData = JSON.parse(JSON.stringify(state.form))
                let arr = []
                checkedRowKeysRef.value.forEach(ele => {
                    arr.push({
                        pigletCode: ele.pigletCode,
                        earBrandCode: ele.earBrandCode,
                        breedingLevel: ele.breedingLevel
                    })
                })
                fromData.models = arr
                await addSecondaryPigBreedingBoarApi(fromData).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        state.search.page = 1
                        getpigCastrationList()
                        state.showAdd = false
                        closeFrom()
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            // 获取详细信息
            const getPigdetil = async id => {
                await getPigcastrationPlanAndBreedingBoarApi({ id: id }).then(res => {
                    if (res.code == 0) {
                        state.planForm = res.data[0].castrationRecord
                        state.seedCountList = res.data[0].breedingPig
                    }
                })
            }

            // 获取二次阉割详细信息
            const getTwoPigdetil = async id => {
                await getSecondaryCastrationRecordApi({ id: id }).then(res => {
                    if (res.code == 0) {
                        state.planForm = res.data[0].castrationRecord
                        state.seedCountList = res.data[0].breedingPig
                    }
                })
            }

            const closeFrom = () => {
                if (loadingReactive) {
                    loadingReactive.destroy()
                    loadingReactive = null
                }
                state.form = {
                    condition: {
                        castrationPlanId: undefined
                    },
                    models: []
                }
                state.seedCountList = []
                checkedRowKeysRef.value = []
                state.isTwo = false
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '窝号',
                        title: () => {
                            return t("dataTable.listing.dens")
                        },
                        key: "nestNumber"
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
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
                    },
                    {
                        // title: '母猪ID',
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
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
                        // title: '母猪等级',
                        title: () => {
                            return t("dataTable.listing.sowGrade")
                        },
                        key: "breedingLevel",
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
                        key: "breedingBatch"
                    },
                    {
                        // title: '公猪数量',
                        title: () => {
                            return t("dataTable.listing.numberOfBoars")
                        },
                        key: "farrowingMCount"
                    },
                    {
                        // title: '阉割公猪数',
                        title: () => {
                            return t("dataTable.listing.numberOfCastratedBoars")
                        },
                        key: "castrationMCount"
                    },
                    {
                        // title: '留种公猪数',
                        title: () => {
                            return t("dataTable.listing.numberOfBreedingBoars")
                        },
                        key: "seedRetentionMCount"
                    },
                    {
                        // title: '计划状态',
                        title: () => {
                            return t("dataTable.listing.planStatus")
                        },
                        key: "planStatus",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["planStatus"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "planStatus",
                                row.planStatus
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
                        // title: '计划人',
                        title: () => {
                            return t("dataTable.listing.planner")
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
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "planStatus",
                                                row.planStatus
                                            ) == "已阉割" ||
                                            store.getters["dictionaries/getDictionarieName"](
                                                "planStatus",
                                                row.planStatus
                                            ) == "待审定"
                                                ? true
                                                : false,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickRow = row
                                            state.form.condition.castrationPlanId = row.id
                                            getPigdetil(row.id)
                                            state.showAdd = true
                                        }
                                    },
                                    { default: () => t("dataTable.listing.btnRegistration") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "warning",
                                        text: true,
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "planStatus",
                                                row.planStatus
                                            ) == "已阉割"
                                                ? false
                                                : true,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickRow = row
                                            state.isTwo = true
                                            state.form.condition.castrationPlanId = row.id
                                            getTwoPigdetil(row.id)
                                            state.showAdd = true
                                        }
                                    },
                                    { default: () => t("dtables.listing.secondaryCastration") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "success",
                                        text: true,
                                        // disabled: helper.dateInDay(row.createDatetime),
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickRow = row
                                            getPigRightDetail(row.id)
                                            state.detailId = row.id
                                        }
                                    },
                                    { default: () => t("dataTable.listing.check") }
                                )
                            ])
                        }
                    }
                ]
            }

            const setSeedColumns = () => {
                state.seedColumns = [
                    {
                        type: "selection"
                    },
                    {
                        // title: '编码',
                        title: () => {
                            return t("dataTable.listing.boarCode")
                        },
                        key: "pigCode",
                        render(row) {
                            return row.pigCode || row.pigletCode
                        }
                    },
                    {
                        // title: '耳牌号',
                        title: () => {
                            return t("dataTable.listing.earBrandCode")
                        },
                        key: "earBrandCode"
                    },
                    {
                        // title: '育种等级',
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "breedingLevel",
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "breedingLevel",
                                    row.breedingLevel
                                ) || "--"
                            )
                        }
                    }
                ]
            }

            const setStayColumns = () => {
                state.stayColumns = [
                    {
                        // title: '公猪编码',
                        title: () => {
                            return t("dataTable.listing.boarCode")
                        },
                        key: "pigletCode"
                    },
                    {
                        // title: '耳牌号',
                        title: () => {
                            return t("dataTable.listing.earBrandCode")
                        },
                        key: "earBrandCode"
                    },
                    {
                        // title: '育种等级',
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "breedingLevel",
                        render(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "breedingLevel",
                                    row.breedingLevel
                                ) || "--"
                            )
                        }
                    }
                ]
            }

            const setRemoveColumns = () => {
                state.removeColumns = [
                    {
                        // title: '公猪编码',
                        title: () => {
                            return t("dataTable.listing.boarCode")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '耳牌号',
                        title: () => {
                            return t("dataTable.listing.earBrandCode")
                        },
                        key: "medicationNumber"
                    },
                    {
                        // title: '育种等级',
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "operatorid"
                    }
                ]
            }

            const tabsChange = value => {
                state.search = {
                    pigCodeLike: "",
                    planStatusList: [],
                    // 选配记录日期开始时间
                    healthcareDateGte: helper.formatStartTamp(Date.now()),
                    // 选配记录日期结束时间
                    healthcareDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    pigSourcesList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                }
                state.search.planStatusList = store.getters["dictionaries/getDictionarieId"](
                    "planStatus",
                    value
                )
                state.search.page = 1
                getpigCastrationList()
            }

            onBeforeMount(() => {
                tabsChange("待审定")
                // 获取保健目的
                store.dispatch("dictionaries/getPigSymptomsList", 1)
                // 获取全部药品
                store.dispatch("dictionaries/getPigDrugsList", "")
            })
            onMounted(() => {
                // getpigCastrationList()
                //设置列表
                setTableColumns()
                setStayColumns()
                setRemoveColumns()
                setSeedColumns()
            })
            return {
                tabsChange,
                ...toRefs(state),
                formRef,
                getpigCastrationList,
                getPigHealthCareDetail,
                getDictionaries,
                getDictionarieName,
                getFarmList,
                getDormList,
                getFarmName,
                getDormName,
                getPigdetil,
                getTwoPigdetil,
                getPigRightDetail,
                getSymptomsOptions,
                getDrugsListOptions,
                checkedRowKeys: checkedRowKeysRef,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                // 保健登记规则
                rules: {
                    farmid: {
                        required: true,
                        message: t("dataTable.listing.pleaseSelectACourt"),
                        trigger: ["input", "blur"]
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
                    if (options.sourceColumn.key == "planStatus") {
                        state.search.planStatusList = options.filters.planStatus
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getpigCastrationList()
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                // 清空右侧信息
                cleanPigOptionalDetail() {
                    state.pigOptionalDetail = {
                        theSow: [{}],
                        theMaleMain: [{}],
                        alternativeBoar: [{}]
                    }
                },
                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.isTwo ? addTwopigCastration() : addpigCastration()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },
                // 左侧选中行class设置
                leftRowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 判断是不是七天以内
                dateInSevenDay(timestamp) {
                    var date = new Date() //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var year = date.getFullYear(),
                        month = ("0" + (date.getMonth() + 1)).slice(-2),
                        day = ("0" + date.getDate()).slice(-2)
                    // 当前时间
                    var toDayDate = new Date(year + "-" + month + "-" + day + " 00:00:00").getTime()

                    var beforeYesterday = toDayDate - 6 * 24 * 3600 * 1000

                    return beforeYesterday > timestamp ? false : true
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
