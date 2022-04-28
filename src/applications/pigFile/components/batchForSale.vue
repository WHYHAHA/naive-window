<template>
    <n-modal v-model:show="visible" preset="dialog" title="批量待售" positive-text="确认转销售" @positive-click="submitCallback" negative-text="取消">
        <n-space vertical>
            <div>是否要将选种的种猪进行转销售操作？</div>
            <n-space>
                <div>选中种猪列表id</div>
                <n-space>
                    <div v-for="arry in tabSelection" :key="arry">{{arry}}</div>
                </n-space>
            </n-space>
        </n-space>
    </n-modal>
</template>

<script>
    import { defineComponent, reactive, ref, toRefs } from 'vue'
    import { useMessage } from 'naive-ui'
    import { batchActionApi } from '@/api/pigFile.js'

    export default defineComponent({
        props: {
            tabSelection: {
                // 列表选中项
                type: Array,
                default() {
                    return []
                }
            }
        },
        setup(props, context) {
            const message = useMessage()
            const state = reactive({
                pigStatus: 9
            })
            const listReload = () => {
                context.emit('listReload')
            }
            const batchAction = async () => {
                await batchActionApi({ ids: props.tabSelection, pigStatus: state.pigStatus }).then(res => {
                    if (res.code == 0) {
                        message.success('操作成功！')
                        listReload()
                    }
                })
            }
            return {
                ...toRefs(state),
                visible: ref(true),
                submitCallback() {
                    batchAction()
                }
            }
        }
    })
</script>
