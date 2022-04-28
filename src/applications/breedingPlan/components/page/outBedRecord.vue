<template>
    <n-grid x-gap="12" :cols="1">
        <n-gi>
            <div class="tabHeader font-16 font-weight-bolder">
                <n-space align="center">
                    <div>{{$t('dataTable.listing.outOfBedRecords')}}:</div>
                    <n-button type="info" class="col-2" @click="showExport=true">{{$t('button.export')}}</n-button>
                </n-space>
            </div>
            <tableComponents :columns="columns" :data="outBedList" :loading="showloading" :scroll-x="1000" :clickIndex="leftClickIndex" v-model:search="search" @update:search="outBedRecordList"></tableComponents>
        </n-gi>
    </n-grid>
    <!-- 列表导出 -->
    <exportComponents apiUrl="exportOutbedApi" :search="search" v-model:openExport="showExport"></exportComponents>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref } from 'vue'
    import { getOutBedRecordListApi } from '@/api/breedingPlan.js'
    import { NEllipsis } from 'naive-ui'
    import { useI18n } from "vue-i18n"
    import { useStore } from 'vuex'
    import tableComponents from '@/components/table.vue'
    import exportComponents from '@/components/exExport.vue'

    export default defineComponent({
        name: 'exceptionRecord',
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents,
            exportComponents
        },
        setup(props) {
            const store = useStore()
            const { t } = useI18n()
            const formRef = ref(null)
            const state = reactive({
                showloading: false,
                showExport: false,
                columns: [],
                search: {
                    batchNumber: props.pageData.id,
                    dormCode: '',
                    farmid: '',
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                outBedList: [],
                goToBedDetail: {
                    detail: {},
                    info: {}
                },
                updateForm: {
                    id: undefined,
                    pigCode: undefined,
                    abnormalDynamicDate: undefined,
                    abnormalDynamicType: undefined
                },
                leftClickIndex: -1
            })

            // 获取上床列表
            const outBedRecordList = async () => {
                state.showloading = true
                await getOutBedRecordListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.outBedList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            const setColumns = () => {
                state.columns = [
                    {
                        title: ()=>{
                            return t('dataTable.listing.sowCode')
                        },
                        key: 'pigCode'
                    },
                    {
                        title: ()=>{
                            return t('dataTable.listing.Farm')
                        },
                        key: 'farmid',
                        render(row) {
                            return store.getters['dictionaries/getFarmName'](row.farmid)
                        }
                    },
                    {
                        title: ()=>{
                            return t('dataTable.listing.Dorm')
                        },
                        key: 'dormCode',
                        render(row) {
                            return store.getters['dictionaries/getDormName'](row.dormCode)
                        }
                    },
                    {
                        title: ()=>{
                            return t('dataTable.listing.column')
                        },
                        key: 'columnCode'
                    },
                    {
                        title: ()=>{
                            return t('dataTable.listing.dateOfBed')
                        },
                        key: 'outOfBedDate',
                    },
                    {
                        title: ()=>{
                            return t('dataTable.listing.typeOfOutOfBed')
                        },
                        key: 'outBedType',
                        render(row) {
                            return store.getters['dictionaries/getDictionarieName']('outBedType', row.outBedType)
                        }
                    },
                    {
                        title: ()=>{
                            return t('dtables.listing.theRegistrar')
                        },
                        key: 'staffCode'
                    }
                ]
            }

            onMounted(() => {
                setColumns()
                outBedRecordList()
            })
            return {
                ...toRefs(state),
                formRef,
                headerStyle: {
                    color: '#0099e5 !important'
                },
                bodyStyle: {
                    width: '600px'
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
<style lang="less" scoped>
</style>