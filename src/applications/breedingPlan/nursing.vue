<template>
    <div class="p-2 hybridization">
        <n-space vertical :size="20">
            <n-card>
                <n-breadcrumb>
                    <n-breadcrumb-item
                        v-for="(item, index) in pageData.breadcrumbList"
                        :key="index"
                        @click="goFatherPage(index, item)"
                        >{{ item.name }}</n-breadcrumb-item
                    >
                </n-breadcrumb>
            </n-card>
            <!-- 登记代奶 -->
            <n-card :title="$t('dtables.listing.registrationOfGenerationOfMilk')">
                <n-grid x-gap="12" :cols="2">
                    <n-gi>
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space justify="space-between">
                                <n-space align="center">
                                    <div>{{ $t("dtables.listing.listOfLactationSows") }}</div>
                                    <n-select
                                        v-model:value="selectVal"
                                        :options="options"
                                        style="width: 120px"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dtables.listing.searchTheSowCoding')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCodeLike"
                                        @keyup.enter="getPigFileList"
                                        @clear="
                                            () => {
                                                search.pigCodeLike = ''
                                                getPigFileList()
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
                        <n-data-table :columns="columns" :data="data" :pagination="pagination" />
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader font-16 font-weight-bolder">
                            {{ $t("dtables.listing.sowMilkGenerationRegistrationForm") }}:
                        </div>
                        <n-data-table :columns="columns2" :data="data" :pagination="pagination" />
                        <n-space>
                            <n-button type="info" class="col-2">{{
                                $t("dtables.listing.save")
                            }}</n-button>
                            <n-button class="col-2">{{ $t("dtables.listing.cancel") }}</n-button>
                        </n-space>
                    </n-gi>
                </n-grid>
            </n-card>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, h, reactive, toRefs } from "vue"
    import { NButton, useMessage } from "naive-ui"
    import { useI18n } from "vue-i18n"
    import { SearchOutlined as searchIcon } from "@vicons/antd"
    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            searchIcon
        },
        setup() {
            const message = useMessage()
            const { t } = useI18n()
            const state = reactive({
                search: {
                    pigCodeLike: "",
                    selectVal: ""
                }
            })
            const createColumns = ({ sendMail }) => {
                return [
                    {
                        title: () => t("dataTable.listing.sowCode"),
                        key: "name",
                        align: "center"
                    },
                    {
                        title: () => t("dataTable.listing.Dorm"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.column"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.species"),
                        key: "age"
                    },
                    {
                        title: () => t("dtables.listing.nursingQuality"),
                        key: "age"
                    },
                    {
                        title: () => t("dtables.listing.theDateOfProduction"),
                        key: "age"
                    },
                    {
                        title: () => t("dtables.listing.lactationPigletNumber"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row) {
                            return h(
                                NButton,
                                {
                                    size: "small",
                                    type: "info",
                                    onClick: () => sendMail(row)
                                },
                                { default: () => t("dtables.listing.addMilkPiglets") }
                            )
                        }
                    }
                ]
            }
            const createColumns2 = ({ sendMail }) => {
                return [
                    {
                        title: () => t("dataTable.listing.pigletCode"),
                        key: "name",
                        align: "center"
                    },
                    {
                        title: () => t("dataTable.listing.Dorm"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.column"),
                        key: "age"
                    },

                    {
                        title: () => t("dtables.listing.theNest"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.weaningDate"),
                        key: "age"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row) {
                            return h(
                                NButton,
                                {
                                    size: "small",
                                    type: "error",
                                    onClick: () => sendMail(row)
                                },
                                { default: () => t("dtables.listing.removeTheRegistrationForm") }
                            )
                        }
                    }
                ]
            }
            const createData = () => [
                {
                    key: 0,
                    name: "John Brown",
                    age: 32,
                    address: "New York No. 1 Lake Park",
                    tags: ["nice", "developer"]
                },
                {
                    key: 1,
                    name: "Jim Green",
                    age: 42,
                    address: "London No. 1 Lake Park",
                    tags: ["wow"]
                },
                {
                    key: 2,
                    name: "Joe Black",
                    age: 32,
                    address: "Sidney No. 1 Lake Park",
                    tags: ["cool", "teacher"]
                }
            ]
            return {
                ...toRefs(state),
                data: createData(),
                pagination: {
                    pageSize: 10
                },
                columns: createColumns({
                    sendMail(rowData) {
                        message.info("send mail to " + rowData.name)
                    }
                }),
                columns2: createColumns2({
                    sendMail(rowData) {
                        message.info("send mail to " + rowData.name)
                    }
                }),
                options: [
                    {
                        label: "Everybody's Got Something to Hide Except Me and My Monkey",
                        value: "song0",
                        disabled: true
                    },
                    {
                        label: "Drive My Car",
                        value: "song1"
                    },
                    {
                        label: "Norwegian Wood",
                        value: "song2"
                    },
                    {
                        label: "You Won't See",
                        value: "song3",
                        disabled: true
                    },
                    {
                        label: "Nowhere Man",
                        value: "song4"
                    },
                    {
                        label: "Think For Yourself",
                        value: "song5"
                    },
                    {
                        label: "The Word",
                        value: "song6"
                    },
                    {
                        label: "Michelle",
                        value: "song7",
                        disabled: true
                    },
                    {
                        label: "What goes on",
                        value: "song8"
                    },
                    {
                        label: "Girl",
                        value: "song9"
                    },
                    {
                        label: "I'm looking through you",
                        value: "song10"
                    },
                    {
                        label: "In My Life",
                        value: "song11"
                    },
                    {
                        label: "Wait",
                        value: "song12"
                    }
                ],
                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index != 2) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl
                        }
                        this.$emit("gopage", data)
                    } else {
                        window.$message.warning(t("dtables.listing.youHaveBeenInTheCurrentPage"))
                    }
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .hybridization {
    }
</style>
