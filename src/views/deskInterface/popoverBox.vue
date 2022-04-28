<template>
    <!-- 根据 setting.type 显示不同 popoverBox -->
    <div v-if="setting.type == 'appFolder'">
        <n-space vertical class="p-1">
            <n-h6 prefix="bar" style="margin:0" class="font-14">切换列表中的开关即可隐藏或显示</n-h6>
            <n-scrollbar style="max-height: 400px;padding:10px 20px;">
                <!-- <div v-for="item in appList" :key="item">{{item.name}}</div> -->
                <n-space vertical :size="20">
                    <n-space justify="space-between" v-for="item in appList" :key="item">
                        <n-space>
                            <div class="icon" :class="item.icon"></div>
                            <n-text Strong class="font-14">{{ language=='zh-CN'?item.name: item.enName}}</n-text>
                        </n-space>
                        <n-switch v-model:value="item.link" @update:value="switchChange(item)">
                            <template #checked-icon>
                                <n-icon color="#0e7a0d" :size="20" :component="CheckIcon" />
                            </template>
                            <template #unchecked-icon>
                                <n-icon :size="20" :component="UnCheckIcon" />
                            </template>
                        </n-switch>
                    </n-space>
                </n-space>
            </n-scrollbar>
        </n-space>
    </div>

    <div v-else>{{setting.type}}</div>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, computed } from 'vue'

    import { CheckmarkCircle24Filled as CheckIcon, CheckmarkCircle16Regular as UnCheckIcon } from '@vicons/fluent'
    import { useStore } from 'vuex'

    export default defineComponent({
        props: {
            setting: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        components: {},
        setup(props) {
            const store = useStore()
            const state = reactive({
                appList: []
            })
            const language = computed(() => {
                return store.state.core.language
            })
            const switchChange = item => {
                let data = {
                    setting: props.setting,
                    id: item.id
                }
                store.commit('core/APPLISTLINKCHANGE', data)
            }
            onMounted(() => {
                state.appList = JSON.parse(JSON.stringify(props.setting.appList))
                console.log('appList: ', state.appList)
            })
            return {
                switchChange,
                CheckIcon,
                UnCheckIcon,
                language,
                ...toRefs(state)
            }
        }
    })
</script>
<style  lang="less" scoped>
    .icon {
        height: 25px;
        width: 25px;
        background-size: 25px;
    }
</style>