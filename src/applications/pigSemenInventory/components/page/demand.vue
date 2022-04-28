<template>
    <!-- 精液管理丨精液库丨订单 -->
    <n-card>
        <template #header>
            <n-space align="center" justify="space-between">
                <div class="mr-3">
                    {{
                        $t("dataTable.listing.semenManagement") +
                        "丨" +
                        $t("dataTable.listing.semenBank") +
                        "丨" +
                        $t("dataTable.listing.order")
                    }}
                </div>
                <n-space align="center">
                    <n-button type="info" class="col-2" @click="showExport = true">
                        {{ $t("button.export") }}
                    </n-button>
                </n-space>
            </n-space>
        </template>

        <!-- 分栏 -->
        <n-card>
            <n-tabs type="line" @update:value="tabsChange">
                <n-tab-pane name="待受理" :tab="$t('dataTable.listing.toAccept')">
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <!-- 左边 -->
                        <n-gi span="6 400:6 600:6 800:6">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space align="center" justify="space-between">
                                    <n-space align="center">
                                        <!-- 待受理订单列表 -->
                                        <div>
                                            {{ $t("dataTable.listing.toAcceptTheOrderList") }}:
                                        </div>
                                        <n-date-picker
                                            v-model:value="timeList"
                                            type="daterange"
                                            :shortcuts="rangeShortcuts"
                                            :is-date-disabled="disablePreviousDate"
                                            @update:value="
                                                () => {
                                                    search.page = 1
                                                    getSemenOrderList()
                                                }
                                            "
                                            actions="['confirm']"
                                        />
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchTheOrderCode')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.needNumberLike"
                                            @keyup.enter="getSemenOrderList"
                                            @clear="
                                                () => {
                                                    search.needNumberLike = ''
                                                    getSemenOrderList()
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
                                :data="orderList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                :scroll-x="1200"
                                v-model:search="search"
                                @update:filters="handleFiltersChange"
                                @update:search="getSemenOrderList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右边 -->
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-space vertical>
                                <div>
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 订单详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.orderDetails") }}:
                                            </div>
                                            <!-- 批量完成制作 -->
                                            <n-button
                                                type="info"
                                                @click="batchFun"
                                                v-if="orderDetail.list.length > 0"
                                                :disabled="showBatchBtn()"
                                                >{{ $t("button.batchProduction") }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                    <n-descriptions
                                        label-placement="left"
                                        bordered
                                        :column="2"
                                        size="small"
                                        v-if="orderDetail.detail.needNumber"
                                    >
                                        <!-- 订单编码，收货单位，订单状态，收货时限 -->
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderCode') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needNumber ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.consignee') + '：'"
                                        >
                                            {{
                                                getDormName(orderDetail.detail.needDept) ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderStatus') + '：'"
                                        >
                                            {{
                                                getDictionarieName(
                                                    "dealStatus",
                                                    orderDetail.detail.dealStatus
                                                ) || $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.receivingTime') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needDate ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                    </n-descriptions>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftSideOfTheCheckDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </div>

                                <div v-if="orderDetail.list.length > 0">
                                    <tableComponents
                                        size="small"
                                        :columns="detailColumns"
                                        :data="orderDetail.list"
                                        :clickIndex="leftClickIndex"
                                        :scroll-x="800"
                                        :rowKey="'row'"
                                        v-model:checked-row-keys="selectIds"
                                        @update:checked-row-keys="handleCheck"
                                    ></tableComponents>
                                </div>
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-tab-pane>
                <n-tab-pane name="已受理" :tab="$t('dataTable.listing.hasBeenAccepted')">
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <!-- 左边 -->
                        <n-gi span="6 400:6 600:6 800:6">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space align="center" justify="space-between">
                                    <n-space align="center">
                                        <!-- 已受理订单列表 -->
                                        <div>
                                            {{ $t("dataTable.listing.haveToAcceptTheOrderList") }}:
                                        </div>
                                        <n-date-picker
                                            v-model:value="timeList"
                                            type="daterange"
                                            :shortcuts="rangeShortcuts"
                                            :is-date-disabled="disablePreviousDate"
                                            @update:value="
                                                () => {
                                                    search.page = 1
                                                    getSemenOrderList()
                                                }
                                            "
                                            actions="['confirm']"
                                        />
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchTheOrderCode')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.needNumberLike"
                                            @keyup.enter="getSemenOrderList"
                                            @clear="
                                                () => {
                                                    search.needNumberLike = ''
                                                    getSemenOrderList()
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
                                :data="orderList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                :scroll-x="1200"
                                v-model:search="search"
                                @update:filters="handleFiltersChange"
                                @update:search="getSemenOrderList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右边 -->
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-space vertical>
                                <div>
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 订单详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.orderDetails") }}:
                                            </div>
                                            <!-- 批量完成制作 -->
                                            <n-button
                                                type="info"
                                                @click="batchFun"
                                                v-if="orderDetail.list.length > 0"
                                                :disabled="showBatchBtn()"
                                                >{{ $t("button.batchProduction") }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                    <n-descriptions
                                        label-placement="left"
                                        bordered
                                        :column="2"
                                        size="small"
                                        v-if="orderDetail.detail.needNumber"
                                    >
                                        <!-- 订单编码，收货单位，订单状态，收货时限 -->
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderCode') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needNumber ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.consignee') + '：'"
                                        >
                                            {{
                                                getDormName(orderDetail.detail.needDept) ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderStatus') + '：'"
                                        >
                                            {{
                                                getDictionarieName(
                                                    "dealStatus",
                                                    orderDetail.detail.dealStatus
                                                ) || $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.receivingTime') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needDate ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                    </n-descriptions>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftSideOfTheCheckDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </div>

                                <div v-if="orderDetail.list.length > 0">
                                    <tableComponents
                                        size="small"
                                        :columns="detailColumns"
                                        :data="orderDetail.list"
                                        :clickIndex="leftClickIndex"
                                        :scroll-x="800"
                                        :rowKey="'row'"
                                        v-model:checked-row-keys="selectIds"
                                        @update:checked-row-keys="handleCheck"
                                    ></tableComponents>
                                </div>
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-tab-pane>
                <n-tab-pane name="已完成" :tab="$t('dataTable.listing.hasBeenCompleted')">
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <!-- 左边 -->
                        <n-gi span="6 400:6 600:6 800:6">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space align="center" justify="space-between">
                                    <n-space align="center">
                                        <!-- 已完成订单列表 -->
                                        <div>
                                            {{
                                                $t(
                                                    "dataTable.listing.theOrderListHasBeenCompleted"
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
                                                    getSemenOrderList()
                                                }
                                            "
                                            actions="['confirm']"
                                        />
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchTheOrderCode')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.needNumberLike"
                                            @keyup.enter="getSemenOrderList"
                                            @clear="
                                                () => {
                                                    search.needNumberLike = ''
                                                    getSemenOrderList()
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
                                :data="orderList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                :scroll-x="1200"
                                v-model:search="search"
                                @update:filters="handleFiltersChange"
                                @update:search="getSemenOrderList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右边 -->
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-space vertical>
                                <div>
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 订单详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.orderDetails") }}:
                                            </div>

                                            <n-tooltip>
                                                <template #trigger>
                                                    <n-button
                                                        type="info"
                                                        @click="
                                                            getSemenOrderSticker({
                                                                needNumber:
                                                                    orderDetail.detail.needNumber
                                                            })
                                                        "
                                                        >{{ $t("button.mutiplePrint") }}</n-button
                                                    >
                                                </template>
                                                {{ $t("message.tooltip.print") }}
                                            </n-tooltip>
                                        </n-space>
                                    </div>
                                    <n-descriptions
                                        label-placement="left"
                                        bordered
                                        :column="2"
                                        size="small"
                                        v-if="orderDetail.detail.needNumber"
                                    >
                                        <!-- 订单编码，收货单位，订单状态，收货时限 -->
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderCode') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needNumber ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.consignee') + '：'"
                                        >
                                            {{
                                                getDormName(orderDetail.detail.needDept) ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderStatus') + '：'"
                                        >
                                            {{
                                                getDictionarieName(
                                                    "dealStatus",
                                                    orderDetail.detail.dealStatus
                                                ) || $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.receivingTime') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needDate ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                    </n-descriptions>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftSideOfTheCheckDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </div>

                                <div v-if="orderDetail.list.length > 0">
                                    <tableComponents
                                        size="small"
                                        :columns="detailColumns"
                                        :data="orderDetail.list"
                                        :clickIndex="leftClickIndex"
                                        :scroll-x="800"
                                        :rowKey="'row'"
                                        v-model:checked-row-keys="selectIds"
                                        @update:checked-row-keys="handleCheck"
                                    ></tableComponents>
                                </div>
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-tab-pane>
                <n-tab-pane name="已超时" :tab="$t('dataTable.listing.hasATimeout')">
                    <n-grid x-gap="12" cols="10" item-responsive>
                        <!-- 左边 -->
                        <n-gi span="6 400:6 600:6 800:6">
                            <div class="tabHeader font-16 font-weight-bolder">
                                <n-space align="center" justify="space-between">
                                    <n-space align="center">
                                        <!-- 已超时订单列表 -->
                                        <div>
                                            {{ $t("dataTable.listing.hasTimeoutOrderList") }}:
                                        </div>
                                        <n-date-picker
                                            v-model:value="timeList"
                                            type="daterange"
                                            :shortcuts="rangeShortcuts"
                                            :is-date-disabled="disablePreviousDate"
                                            @update:value="
                                                () => {
                                                    search.page = 1
                                                    getSemenOrderList()
                                                }
                                            "
                                            actions="['confirm']"
                                        />
                                    </n-space>
                                    <div>
                                        <n-input
                                            :placeholder="
                                                $t('dataTable.listing.searchTheOrderCode')
                                            "
                                            autosize
                                            style="min-width: 300px"
                                            clearable
                                            v-model:value="search.needNumberLike"
                                            @keyup.enter="getSemenOrderList"
                                            @clear="
                                                () => {
                                                    search.needNumberLike = ''
                                                    getSemenOrderList()
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
                                :data="orderList"
                                :loading="showloading"
                                :clickIndex="leftClickIndex"
                                :scroll-x="1200"
                                v-model:search="search"
                                @update:filters="handleFiltersChange"
                                @update:search="getSemenOrderList"
                            ></tableComponents>
                        </n-gi>
                        <!-- 右边 -->
                        <n-gi span="4 400:4 600:4 800:4">
                            <n-space vertical>
                                <div>
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 订单详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.orderDetails") }}:
                                            </div>
                                            <!-- 批量完成制作 -->
                                            <n-button
                                                type="info"
                                                @click="batchFun"
                                                v-if="orderDetail.list.length > 0"
                                                :disabled="showBatchBtn()"
                                                >{{ $t("button.batchProduction") }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                    <n-descriptions
                                        label-placement="left"
                                        bordered
                                        :column="2"
                                        size="small"
                                        v-if="orderDetail.detail.needNumber"
                                    >
                                        <!-- 订单编码，收货单位，订单状态，收货时限 -->
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderCode') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needNumber ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.consignee') + '：'"
                                        >
                                            {{
                                                getDormName(orderDetail.detail.needDept) ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.orderStatus') + '：'"
                                        >
                                            {{
                                                getDictionarieName(
                                                    "dealStatus",
                                                    orderDetail.detail.dealStatus
                                                ) || $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                        <n-descriptions-item
                                            :label="$t('dataTable.listing.receivingTime') + '：'"
                                        >
                                            {{
                                                orderDetail.detail.needDate ||
                                                $t("dataTable.listing.notYet")
                                            }}
                                        </n-descriptions-item>
                                    </n-descriptions>
                                    <n-empty
                                        v-else
                                        :description="
                                            $t(
                                                'dataTable.listing.noRecord,PleaseClickOnTheLeftSideOfTheCheckDetails'
                                            )
                                        "
                                        class="mt-3"
                                    ></n-empty>
                                </div>

                                <div v-if="orderDetail.list.length > 0">
                                    <tableComponents
                                        size="small"
                                        :columns="detailColumns"
                                        :data="orderDetail.list"
                                        :clickIndex="leftClickIndex"
                                        :scroll-x="800"
                                        :rowKey="'boarPigCode'"
                                        v-model:checked-row-keys="selectIds"
                                        @update:checked-row-keys="handleCheck"
                                    ></tableComponents>
                                </div>
                            </n-space>
                        </n-gi>
                    </n-grid>
                </n-tab-pane>
            </n-tabs>
        </n-card>

        <!-- 导出 -->
        <exportComponents
            fileName="种猪档案"
            apiUrl="exportPigSemenNeedApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 打印选配贴纸 -->
        <printSemenComponents ref="printSemenRef"></printSemenComponents>
    </n-card>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NTag, NButton, useMessage, NSpace, useDialog } from "naive-ui"
    import {
        getSemenOrderListApi,
        getSemenOrderDetailApi,
        getSemenOrderStickerApi,
        updateSemenOrderApi,
        updateBatchSemenOrderApi
    } from "@/api/pigSemenInventory.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import tableComponents from "@/components/table.vue"
    import printSemenComponents from "@/components/printSemen.vue"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            exportComponents,
            tableComponents,
            printSemenComponents
        },
        setup() {
            const printSemenRef = ref(null)
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const { t } = useI18n()
            const state = reactive({
                showUpdate: false,
                showExport: false,
                showloading: false,
                tabVal: "",
                search: {
                    needNumberLike: "",
                    createDatetimeGte: "",
                    createDatetimeLte: "",
                    needSourceList: [],
                    needUseList: [],
                    dealStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                timeList: [Date.now() - 86400000 * 2, Date.now()],
                orderList: [],
                orderDetail: {
                    detail: {},
                    list: []
                },
                columns: [],
                detailColumns: [],
                selectIds: [],
                leftClickIndex: -1,
                detailClickIndex: -1
            })
            const showBatchBtn = () => {
                let flag = state.orderDetail.list.some(
                    x =>
                        store.getters["dictionaries/getDictionarieZhName"](
                            "acceptTheStatus",
                            x.acceptTheStatus
                        ) == "待制作"
                )
                return !flag
            }

            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })
            const getDormName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getDormName"](id)
                }
            })
            // 获取精液订单
            const getSemenOrderList = async () => {
                state.search.createDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.createDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getSemenOrderListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.orderList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取精液详情
            const getSemenOrderDetail = async row => {
                await getSemenOrderDetailApi({ needNumber: row.needNumber }).then(res => {
                    if (res.code == 0) {
                        state.orderDetail.detail = row
                        state.orderDetail.list = res.data
                    }
                })
            }

            // 获取精液单贴纸数据
            const getSemenOrderSticker = async data => {
                await getSemenOrderStickerApi(data).then(res => {
                    if (res.code == 0) {
                        printSemenRef.value.print(res.data || [])
                    }
                })
            }
            // 单条 完成制作
            const updateSemenOrder = async row => {
                await updateSemenOrderApi({
                    id: row.id,
                    needNumber: state.orderDetail.detail.needNumber,
                    boarPigCode: row.boarPigCode
                }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.committedToCompleteProduction"))
                        // 清空选中
                        state.selectIds = []
                        // 左侧列表刷新
                        getSemenOrderList()
                        const falg = state.orderList.some(item => item.needNumber == row.needNumber)
                        if (!falg) {
                            state.orderDetail = {
                                detail: {},
                                list: []
                            }
                            state.leftClickIndex = -1
                            state.detailClickIndex = -1
                            return false
                        } else {
                            // 右侧列表刷新
                            getSemenOrderDetail(state.orderDetail.detail)
                        }
                    }
                })
            }
            // 批量 完成制作
            const updateBatchSemenOrder = async () => {
                let data = {
                    model: state.selectIds.map(item => {
                        return { id: item.id, boarPigCode: item.boarPigCode }
                    }),
                    condition: { needNumber: state.orderDetail.detail.needNumber }
                }
                await updateBatchSemenOrderApi(data).then(res => {
                    if (res.code == 0) {
                        state.selectIds = []
                        message.success(
                            t("dataTable.listing.haveFinishedProductionBatchSubmission")
                        )
                        // 左侧列表刷新
                        getSemenOrderList()
                        const falg = state.orderList.some(
                            item => item.needNumber == state.orderDetail.needNumber
                        )
                        if (!falg) {
                            state.orderDetail = {
                                detail: {},
                                list: []
                            }
                            state.leftClickIndex = -1
                            state.detailClickIndex = -1
                            return false
                        } else {
                            // 右侧列表刷新
                            getSemenOrderDetail(state.orderDetail.detail)
                        }
                    }
                })
            }
            const tagType = dealStatus => {
                let dealStatusStr = store.getters["dictionaries/getDictionarieName"](
                    "dealStatus",
                    dealStatus
                )
                let type = ""
                switch (dealStatusStr) {
                    case "待受理":
                        type = "warning"
                        break
                    case "已受理":
                        type = "info"
                        break
                    case "已完成":
                        type = "success"
                        break
                    case "已超时":
                        type = "error"
                        break

                    default:
                        break
                }
                return type
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '订单编码',
                        title: () => {
                            return t("dataTable.listing.orderCode")
                        },
                        key: "needNumber"
                    },
                    {
                        // title: '订单状态',
                        title: () => {
                            return t("dataTable.listing.orderStatus")
                        },
                        key: "dealStatus",
                        render(row) {
                            return h(
                                NTag,
                                {
                                    style: {
                                        marginRight: "6px"
                                    },
                                    type: tagType(row.dealStatus)
                                },
                                {
                                    default: () =>
                                        store.getters["dictionaries/getDictionarieName"](
                                            "dealStatus",
                                            row.dealStatus
                                        )
                                }
                            )
                        }
                    },
                    {
                        // title: '用途',
                        title: () => {
                            return t("dataTable.listing.purpose")
                        },
                        key: "needUse",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["needUse"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "needUse",
                                row.needUse
                            )
                        }
                    },
                    {
                        // title: '收货单位',
                        title: () => {
                            return t("dataTable.listing.consignee")
                        },
                        key: "needDept",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.needDept)
                        }
                    },
                    {
                        // title: '订单时限',
                        title: () => {
                            return t("dataTable.listing.orderTimeLimit")
                        },
                        key: "needDate"
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
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.orderDetail = {
                                                detail: {},
                                                list: []
                                            }
                                            state.leftClickIndex = index
                                            getSemenOrderDetail(row)
                                        }
                                    },
                                    {
                                        default: () => t("dataTable.listing.viewDetails")
                                    }
                                )
                            ])
                        }
                    }
                ]
            }
            const setDetailTableColumns = () => {
                state.detailColumns = [
                    {
                        type: "selection",
                        disabled(row) {
                            return (
                                store.getters["dictionaries/getDictionarieName"](
                                    "acceptTheStatus",
                                    row.acceptTheStatus
                                ) == "已制作"
                            )
                        }
                    },
                    {
                        // title: '公猪编码',
                        title: () => {
                            return t("dataTable.listing.boarCode")
                        },
                        key: "boarPigCode"
                    },
                    {
                        // title: '需求份数',
                        title: () => {
                            return t("dataTable.listing.numberOfCopiesRequired")
                        },
                        key: "copies"
                    },
                    {
                        // title: '受理状态',
                        title: () => {
                            return t("dataTable.listing.acceptanceStatus")
                        },
                        key: "acceptTheStatus",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "acceptTheStatus",
                                row.acceptTheStatus
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
                        // title: 'actions',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        render(row, index) {
                            let buttonArry = []
                            if (
                                store.getters["dictionaries/getDictionarieName"](
                                    "acceptTheStatus",
                                    row.acceptTheStatus
                                ) == "已制作"
                            ) {
                                buttonArry.push(
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,

                                            onClick: () => {
                                                getSemenOrderSticker({
                                                    needNumber:
                                                        state.orderDetail.detail.needNumber || "",
                                                    boarPigCode: row.boarPigCode
                                                })
                                            }
                                        },
                                        {
                                            default: () =>
                                                t("dataTable.listing.printOptionalStickers")
                                        }
                                    )
                                )
                            } else {
                                buttonArry.push(
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,
                                            onClick: () => {
                                                state.detailClickIndex = index
                                                dialog.warning({
                                                    title: t("dataTable.listing.warning"),
                                                    content: t(
                                                        "dataTable.listing.confirmTheFinish"
                                                    ),
                                                    positiveText: t("dataTable.listing.determine"),
                                                    negativeText: t("dtables.listing.cancel"),
                                                    onPositiveClick: () => {
                                                        updateSemenOrder(row)
                                                    }
                                                })
                                            }
                                        },
                                        {
                                            default: () => t("dataTable.listing.finishProduction")
                                        }
                                    )
                                )
                            }

                            return h(NSpace, {}, buttonArry)
                        }
                    }
                ]
            }
            const tabsChange = value => {
                state.orderDetail = {
                    detail: {},
                    list: []
                }
                state.tabVal = value
                state.leftClickIndex = -1
                state.detailClickIndex = -1
                state.search.dealStatusList = store.getters["dictionaries/getDictionarieId"](
                    "dealStatus",
                    value
                )
                state.search.page = 1
                getSemenOrderList()
            }
            onMounted(() => {
                tabsChange("待受理")
                // getSemenOrderList()
                setTableColumns()
                setDetailTableColumns()
            })
            return {
                printSemenRef,
                ...toRefs(state),
                getSemenOrderList,
                getSemenOrderSticker,
                // 分栏
                tabsChange,
                getDictionarieName,
                getDormName,
                showBatchBtn,
                formRef,
                bodyStyle: {
                    width: "600px"
                },
                pagination: {
                    pageSize: 10
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
                handleUpdateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            // updateExceptionRecord()
                            message
                        }
                    })
                },
                // 右侧多选
                handleCheck(rowKeys) {
                    state.selectIds = rowKeys
                },
                batchFun() {
                    if (state.selectIds.length == 0) {
                        message.error(t("dtables.listing.youWereNotSelectedListItemOnTheRightSide"))
                        return false
                    }
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dtables.listing.sureFinishProductionBatch"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            updateBatchSemenOrder()
                        }
                    })
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "needSource") {
                        state.search.needSourceList = options.filters.needSource
                    }
                    if (options.sourceColumn.key == "needUse") {
                        state.search.needUseList = options.filters.needUse
                    }
                    if (options.sourceColumn.key == "dealStatus") {
                        state.search.dealStatusList = options.filters.dealStatus
                    }
                    if (options.sourceColumn.key == "needDept") {
                        state.search.dormCodeList = options.filters.needDept
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getSemenOrderList()
                },
                // 详情选中行class设置
                rowDetailClassName(row, index) {
                    if (index == state.detailClickIndex) {
                        return "tr-select"
                    }
                    return null
                }
            }
        }
    })
</script>
<style lang=""></style>
