<template>
    <div>
        <n-data-table
            ref="tableComponentRef"
            :columns="columns"
            :data="data"
            :loading="loading"
            :size="size"
            :scroll-x="scrollX"
            :row-key="row => rowKey!='row'?row[rowKey]:row"
            v-model:checked-row-keys="checkedRowKeysChange"
            @update:filters="handleFiltersChange"
            :row-class-name="rowClassName"
        />

        <n-card content-style="padding: 10px;">
            <n-space justify="space-between" align="center">
                <n-text class="pl-1">{{$t('dataTable.listing.footerPrefix')}}{{data.length}} {{$t('dataTable.listing.footerSuffix')}}</n-text>&nbsp;
                <n-pagination
                    :page="search.page"
                    :pageSize="search.limit"
                    :item-count="search.total"
                    show-size-picker
                    :page-sizes="[10, 20, 30, 40]"
                    show-quick-jumper
                    :page-slot="pageSlot"
                    @update:page="updatePage"
                    @update:pageSize="updatePageSize"
                >
                    <template #prefix="{ itemCount }">{{$t('dataTable.listing.altogether')}} {{ itemCount }} {{$t('dataTable.listing.footerSuffix')}}</template>
                </n-pagination>
            </n-space>
        </n-card>
        <!-- 后续改版 -->
        <!-- <div class="tabHeader font-16 font-weight-bolder">
            <n-space align="center">
                <div>{{heardLeftText}}</div>
                <n-date-picker v-model:value="timeList" type="daterange" :is-date-disabled="disablePreviousDate" :shortcuts="rangeShortcuts" @update:value="getPigPregnancyList" actions="['confirm']" />
                <slot name="headerRight"></slot>
            </n-space>
        </div>
        <n-data-table
            ref="tableComponentRef"
            :columns="columns"
            :data="data"
            :loading="loading"
            :size="size"
            :scroll-x="scrollX"
            @update:checked-row-keys="handleCheck"
            :row-key="row => row.id"
            @update:filters="handleFiltersChange"
            :row-class-name="rowClassName"
        />
        <n-config-provider>
            <n-card content-style="padding: 10px;">
                <n-space justify="space-between" align="center">
                    <n-text class="pl-1">本页总共：{{data.length}}条</n-text>&nbsp;
                    <n-pagination
                        :page="search.page"
                        :pageSize="search.limit"
                        :item-count="search.total"
                        show-size-picker
                        :page-sizes="[10, 20, 30, 40]"
                        show-quick-jumper
                        @update:page="updatePage"
                        @update:pageSize="updatePageSize"
                    >
                        <template #prefix="{ itemCount }">共 {{ itemCount }} 条</template>
                    </n-pagination>
                </n-space>
            </n-card>
        </n-config-provider>-->
    </div>
</template>


<script>
    import { defineComponent, ref, computed } from "vue"
    import { darkTheme } from "naive-ui"

    export default defineComponent({
        props: {
            size: {
                // 大小
                type: String,
                default: "medium",
            },
            columns: {
                // 列设置
                type: Array,
                default() {
                    return []
                },
            },
            data: {
                // 数据源
                type: Array,
                default() {
                    return []
                },
            },
            checkedRowKeys: {
                // 选中
                type: Array,
                default() {
                    return []
                },
            },
            rowKey: {
                // table 选中项的id值
                type: String,
                default: "id",
            },
            loading: {
                // 加载样式
                type: Boolean,
                default: false,
            },
            scrollX: {
                // 横向宽度
                type: String,
                default: "",
            },
            clickIndex: {
                // 点击时下标
                type: Number,
                default: -1,
            },
            search: {
                // 搜索
                type: Object,
                default() {
                    return {}
                },
            },
            pageSlot: {
                // 分页的槽位
                type: Number,
                default: 8,
            },
        },
        setup(props, { emit }) {
            const tableComponentRef = ref(null)
            const checkedRowKeysChange = computed({
                get: () => props.checkedRowKeys,
                set: val => {
                    emit("update:checked-row-keys", val)
                },
            })
            const updatePage = page => {
                const searchDeepCopy = JSON.parse(JSON.stringify(props.search))
                searchDeepCopy.page = page
                emit("update:search", searchDeepCopy)
            }
            const updatePageSize = pageSize => {
                const searchDeepCopy = JSON.parse(JSON.stringify(props.search))
                searchDeepCopy.limit = pageSize
                emit("update:search", searchDeepCopy)
            }
            const handleFiltersChange = (filters, sourceColumn) => {
                emit("update:filters", { filters, sourceColumn })
            }
            const clearFilters = () => {
                tableComponentRef.value.clearFilters()
            }

            return {
                tableComponentRef,
                darkTheme,
                clearFilters,
                updatePage,
                updatePageSize,
                handleFiltersChange,
                checkedRowKeysChange,
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == props.clickIndex) {
                        return "tr-select"
                    }
                    return null
                },
            }
        },
    })
</script>

<style scope lang="less">
</style>
