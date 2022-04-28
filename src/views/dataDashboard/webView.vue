<template>
    <div class="webViewBox">
        <iframe :src="setting.biUrl" style="width:100%;height:100%;overflow: hidden;"></iframe>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs } from "vue"
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
            const state = reactive({})
            return {
                ...toRefs(state)
            }
        }
    })
</script>
<style lang="less" scoped>
    .webViewBox {
        width: 100%;
        height: 80vh;
        background: white;
        // border-radius: 8px;
        overflow: hidden;
    }
</style>