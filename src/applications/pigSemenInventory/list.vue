<template >
    <div class="p-2">
        <n-card content-style="padding: 0;">
            <demand></demand>
            <!-- <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
                <n-tab-pane name="需求">
                    <demand></demand>
                </n-tab-pane>
                <n-tab-pane name="出库计划">
                    <stockOut></stockOut>
                </n-tab-pane>
            </n-tabs>-->
        </n-card>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted } from 'vue'
    // 需求
    import demand from './components/page/demand.vue'
    export default defineComponent({
        name: 'exceptionRecord',
        components: { demand },
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        setup() {
            const state = reactive({})

            onMounted(() => {})
            return {
                ...toRefs(state)
            }
        }
    })
</script>
<style lang="">
</style>