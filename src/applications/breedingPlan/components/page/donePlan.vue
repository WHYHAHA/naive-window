<template>
    <div class="tabHeader">
        <n-space justify="space-between">
            <div>
                <n-input
                    :placeholder="$t('dtables.listing.searchTheSowCoding')"
                    autosize
                    style="min-width: 300px"
                    clearable
                    v-model:value="search.pigCode"
                    @keyup.enter="getDonePlanList()"
                    @clear="
                        () => {
                            search.pigCode = ''
                            getDonePlanList()
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
            <n-space>
                <n-button type="info" class="col-2" @click="showExport = true">{{
                    $t("button.export")
                }}</n-button>
            </n-space>
        </n-space>
    </div>
    <n-space vertical>
        <tableComponents
            :columns="columns"
            :data="donePlanList"
            :loading="showloading"
            :scroll-x="2000"
            v-model:search="search"
            @update:filters="handleFiltersChange"
            @update:search="getDonePlanList"
        ></tableComponents>
    </n-space>
    <!-- 列表导出 -->
    <exportComponents
        apiUrl="exportSowInventoryApi"
        :search="search"
        v-model:openExport="showExport"
    ></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, computed } from "vue"
    import { getDonePlanListApi } from "@/api/breedingPlan.js"
    import { SearchOutlined as searchIcon } from "@vicons/antd"
    import { useStore } from "vuex"
    import tableComponents from "@/components/table.vue"
    import exportComponents from "@/components/exExport.vue"
    import helper from "@/utils/helper.js"
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        name: "donePlan",
        props: {
            pageData: Object
        },
        components: {
            searchIcon,
            tableComponents,
            exportComponents
        },
        setup(props) {
            const store = useStore()
            const { t } = useI18n()
            const state = reactive({
                showloading: false,
                showExport: false,
                columns: [],
                search: {
                    pigCode: "",
                    batchNumber: props.pageData.id,
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                donePlanList: []
            })
            // 获取异动列表
            const getDonePlanList = async () => {
                state.showloading = true
                await getDonePlanListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.donePlanList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            const setColumns = () => {
                state.columns = [
                    {
                        title: () => {
                            return t("dataTable.listing.sowCode")
                        },
                        key: "pigCode"
                    },
                    {
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
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
                    },
                    {
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
                            return t("dtables.listing.group")
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
                        title: () => {
                            return t("dataTable.listing.boarCode")
                        },
                        key: "semenCode"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.breedingDate")
                        },
                        key: "breedingDatetime",
                        render(row) {
                            return helper.timestampToTime(row.breedingDatetime)
                        }
                    },
                    {
                        title: () => {
                            return t("dtables.listing.breedingForTheFirstTime")
                        },
                        key: "breeding",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breeding"]
                        })
                    },
                    {
                        title: () => {
                            return t("dtables.listing.breedingState")
                        },
                        key: "pregnnancyType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pregnnancyType"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pregnnancyType",
                                row.pregnnancyType
                            )
                        }
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.numberOfInsemination")
                        },
                        key: "inseminationOrder"
                    },
                    {
                        title: () => {
                            return t("dataTable.listing.dueDate")
                        },
                        key: "dueDate",
                        render(row) {
                            return helper.timestampToTime(row.dueDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dtables.listing.breedingOperationPerson")
                        },
                        key: "staffCode"
                    },
                    {
                        title: () => {
                            return t("datatable.listing.unusualAction")
                        },
                        key: "pigStatus"
                    },
                    {
                        title: () => {
                            return t("dtables.listing.moveTheDate")
                        },
                        key: "outOfBedDate",
                        render(row) {
                            return helper.timestampToTime(row.outOfBedDate)
                        }
                    },
                    {
                        title: () => {
                            return t("dtables.listing.moveToRegister")
                        },
                        key: "staffCode"
                    }
                ]
            }
            onMounted(() => {
                setColumns()
                getDonePlanList()
            })
            return {
                ...toRefs(state),
                getDonePlanList,
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
                    if (options.sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = options.filters.breedingLevel
                    }
                    if (options.sourceColumn.key == "breeding") {
                        state.search.breedingList = options.filters.breeding
                    }
                    if (options.sourceColumn.key == "pregnnancyType") {
                        state.search.pregnnancyTypeList = options.filters.pregnnancyType
                    }
                    state.search.page = 1
                    getDonePlanList()
                }
            }
        }
    })
</script>
<style lang=""></style>
