<template>
    <n-modal v-model:show="visible" preset="dialog" title="批量转群" positive-text="确认转群" @positive-click="submitCallback" negative-text="取消">
        <n-space vertical>
            <div>育种等级转入到:</div>
            <n-space>
                <n-radio :checked="exportType == '1'" value="1" @change="handleChange" name="basic-demo">GP</n-radio>
                <n-radio :checked="exportType == '2'" value="2" @change="handleChange" name="basic-demo">GGP</n-radio>
            </n-space>
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
    import { pigChangeLevelApi } from '@/api/pigFile.js'

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
                exportType: 0,
                fatherProps: props
            })
            const listReload = () => {
                context.emit('listReload')
            }
            const pigChangeLevel = async () => {
                await pigChangeLevelApi({ ids: props.tabSelection, BreedingLevel: state.exportType }).then(res => {
                    if (res.code == 0) {
                        message.success('操作成功！')
                        listReload()
                    }
                })
            }

            return {
                ...toRefs(state),
                visible: ref(true),
                pigChangeLevel,
                handleChange(e) {
                    state.exportType = e.target.value
                },
                submitCallback() {
                    pigChangeLevel()
                }
            }
        }
    })
</script>
