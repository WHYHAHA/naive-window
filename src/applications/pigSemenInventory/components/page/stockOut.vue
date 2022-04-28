<template>
    <n-grid x-gap="12" cols="10" item-responsive>
        <!-- 左边 -->
        <n-gi span="6 400:6 600:6 800:6">
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center">
                    <div>精液出库计划:</div>
                    <n-date-picker :default-value="Date.now()" v-model:value="search.time" type="datetime" />
                    <n-button type="info">导出</n-button>
                    <n-button type="info">批量确认</n-button>
                </n-space>
            </div>
            <n-space vertical>
                <n-data-table size="small" :columns="columns" :data="data" :row-class-name="rowClassName" />
                <n-space justify="end">
                    <n-pagination
                        v-model:page="search.page"
                        v-model:pageSize="search.limit"
                        :item-count="search.total"
                        show-size-picker
                        :page-sizes="[10, 20, 30, 40]"
                        show-quick-jumper
                        @update:page="getExceptionRecordList()"
                        @update:pageSize="getExceptionRecordList()"
                    />
                </n-space>
            </n-space>
        </n-gi>
        <!-- 右边 -->
        <n-gi span="4 400:4 600:4 800:4">
            <div class="p-2 tabHeader">
                <n-space align="center">
                    <div class="font-16 font-weight-bolder">打包详情:</div>
                    <n-button type="info">发货</n-button>
                    <n-button type="info">打印发货单</n-button>
                </n-space>
            </div>
            <n-descriptions label-placement="left" bordered :column="4" size="small">
                <n-descriptions-item label="打包编号：">11111111111111111</n-descriptions-item>
                <n-descriptions-item label="打包日期：">11111111111111111</n-descriptions-item>
                <n-descriptions-item label="收货部门：">11111111111111111</n-descriptions-item>
                <n-descriptions-item label="操作人：">11111111111111111</n-descriptions-item>
            </n-descriptions>
        </n-gi>
    </n-grid>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref } from 'vue'
    import { NButton, useMessage, NSpace, useDialog } from 'naive-ui'

    const createColumns = ({ getExceptionRecordDetail }) => {
        return [
            {
                type: 'selection'
            },
            {
                title: '公猪编号',
                key: 'age'
            },
            {
                title: '关联需求',
                key: 'age'
            },
            {
                title: '计划出库日期',
                key: 'age'
            },
            {
                title: '出库量',
                key: 'age'
            },
            {
                title: '原始库存',
                key: 'age'
            },
            {
                title: '状态',
                key: 'age'
            },
            {
                title: '操作',
                key: 'actions',
                render(row, index) {
                    return h(NSpace, {}, [
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'info',
                                onClick: () => {
                                    getExceptionRecordDetail(row, index)
                                }
                            },
                            { default: () => '打包' }
                        )
                    ])
                }
            }
        ]
    }
    const createData = () => [
        {
            key: 0,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer']
        },
        {
            key: 1,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['wow']
        },
        {
            key: 2,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher']
        }
    ]
    export default defineComponent({
        name: 'exceptionRecord',
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        setup(props) {
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const state = reactive({
                showUpdate: false,
                search: {
                    time: undefined,
                    dormCode: '',
                    farmid: '',
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                exceptionList: [],
                exceptionDetail: {
                    detail: {},
                    nodeList: []
                },
                updateForm: {
                    id: undefined,
                    pigCode: undefined,
                    abnormalDynamicDate: undefined,
                    abnormalDynamicType: undefined
                },
                leftClickIndex: -1
            })

            // 获取异动列表
            // const getExceptionRecordList = async () => {
            //     state.search.batchNumber = '190207/2019-06'
            //     await getExceptionRecordListApi(state.search).then(res => {
            //         if (res.code == 0) {
            //             state.exceptionList = res.data.list
            //             state.search.page = res.data.pageNo
            //             state.search.limit = res.data. pageSize
            //             state.search.total = res.data.total
            //         }
            //     })
            // }

            onMounted(() => {
                props
            })
            return {
                ...toRefs(state),
                formRef,
                columns: createColumns({
                    dialog
                }),
                bodyStyle: {
                    width: '600px'
                },
                data: createData(),
                handleUpdateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            // updateExceptionRecord()
                            message
                        }
                    })
                },
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return 'tr-select'
                    }
                    return null
                }
            }
        }
    })
</script>
<style lang="">
</style>