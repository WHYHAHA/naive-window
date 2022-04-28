<template>
    <n-space vertical>
        <div class="p-2">
            <n-card title="淘汰管理">
                <n-grid :cols="2" :x-gap="12">
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0">
                                <div class="font-20 font-weight-bolder">种猪淘汰记录</div>
                                <n-button type="info" class="ml-2" size="small" @click="addNewPig">上传新记录</n-button>
                            </n-space>
                        </div>
                        <n-data-table :columns="columns" :data="piglist" :pagination="pagination" />
                    </n-gi>
                    <n-gi>
                        <div class="tabHeader">
                            <n-space align="center" :size="0">
                                <div class="font-20 font-weight-bolder">详情</div>
                                <n-button type="info" class="ml-2" size="small" @click="addNewPig">上传更新</n-button>
                                <n-button type="info" class="ml-2" size="small" @click="addNewPig">下载</n-button>
                                <n-button type="info" class="ml-2" size="small" @click="addNewPig">批量编辑</n-button>
                            </n-space>
                        </div>
                        <n-data-table size="small" :columns="columns2" :data="piglist" :pagination="pagination" />
                    </n-gi>
                </n-grid>
            </n-card>
        </div>
    </n-space>
</template>

<script>
    import { defineComponent, reactive, toRefs, h } from 'vue'
    import { NButton, useMessage, NSpace } from 'naive-ui'

    const createColumns = ({ sendMail }) => {
        return [
            {
                title: '日期',
                key: 'name',
                align: 'center'
            },
            {
                title: '场区',
                key: 'age'
            },
            {
                title: '栋舍',
                key: 'age'
            },
            {
                title: '淘汰类型',
                key: 'age'
            },
            {
                title: '淘汰种猪数',
                key: 'age'
            },
            {
                title: '报告人',
                key: 'age'
            },
            {
                title: '操作',
                key: 'actions',
                render(row) {
                    return h(
                        NButton,
                        {
                            size: 'small',
                            type: 'info',
                            onClick: () => sendMail(row)
                        },
                        { default: () => '查看详情' }
                    )
                }
            }
        ]
    }
    const createColumns2 = ({ sendMail }) => {
        return [
            {
                type: 'selection'
            },
            {
                title: '种猪编码',
                key: 'name',
                align: 'center'
            },
            {
                title: '栏位',
                key: 'age'
            },
            {
                title: '出生日期',
                key: 'age'
            },
            {
                title: '育种值',
                key: 'age'
            },
            {
                title: '近交指数',
                key: 'age'
            },
            {
                title: '缺陷',
                key: 'age'
            },
            {
                title: '淘汰去向',
                key: 'age'
            },
            {
                title: '操作',
                key: 'actions',
                render(row) {
                    return h(NSpace, {}, [
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'info',
                                onClick: () => {
                                    row
                                }
                            },
                            { default: () => '详情' }
                        ),
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'info',
                                onClick: () => {
                                    sendMail(row)
                                }
                            },
                            { default: () => '编辑' }
                        ),
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'error',
                                onClick: () => {}
                            },
                            { default: () => '移除' }
                        )
                    ])
                }
            }
        ]
    }
    export default defineComponent({
        props: {
            pageData: Object
        },
        setup(props) {
            const message = useMessage()
            const state = reactive({
                form: {
                    user: {
                        name: '123',
                        age: ''
                    },
                    phone: ''
                },
                search: {
                    pigCodeLike: '',
                    selectVal: ''
                },
                piglist: [
                    {
                        key: 1,
                        name: 'John Brown',
                        age: 32,
                        address: 'New York No. 1 Lake Park',
                        tags: ['nice', 'developer']
                    },
                    {
                        key: 2,
                        name: 'Jim Green',
                        age: 42,
                        address: 'London No. 1 Lake Park',
                        tags: ['wow']
                    },
                    {
                        key: 3,
                        name: 'Joe Black',
                        age: 32,
                        address: 'Sidney No. 1 Lake Park',
                        tags: ['cool', 'teacher']
                    }
                ],
                fatherProps: props
            })
            return {
                ...toRefs(state),
                pagination: {
                    pageSize: 10
                },
                columns: createColumns({
                    sendMail(rowData) {
                        message.info('send mail to ' + rowData.name)
                        state.form = {
                            user: {
                                name: '123',
                                age: ''
                            },
                            phone: ''
                        }
                    }
                }),
                columns2: createColumns2({
                    sendMail(rowData) {
                        message.info('send mail to ' + rowData.name)
                        state.form = {
                            user: {
                                name: '123',
                                age: ''
                            },
                            phone: ''
                        }
                    }
                }),
                rules: {
                    user: {
                        name: {
                            required: true,
                            message: '请输入姓名',
                            trigger: 'blur'
                        },
                        age: {
                            required: true,
                            message: '请输入年龄',
                            trigger: ['input', 'blur']
                        }
                    },
                    phone: {
                        required: true,
                        message: '请输入电话号码',
                        trigger: ['input']
                    }
                },
                clearForm() {
                    state.form = {}
                },
                // 添加新猪仔
                addNewPig() {
                    if (state.piglist[0].name) {
                        state.piglist.unshift({
                            key: 0,
                            name: '',
                            age: ''
                        })
                    } else {
                        window.$message.warning('您已添加新的仔猪，请保存完后再继续添加！')
                    }
                }
            }
        }
    })
</script>
<style lang="less" scoped>
</style>