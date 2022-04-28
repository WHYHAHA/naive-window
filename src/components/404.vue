<template>
    <n-space align="center" justify="center" style="width:100%;height:100vh;background:rgb(240, 242, 245)">
        <n-result status="404" title="404 资源不存在" description="未找到对应路径资源">
            <template #icon>
                <n-image preview-disabled="false" width="300" src="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/bg/404.png" />
            </template>
            <template #footer>
                <n-button type="error" @click="closeApp">关闭APP</n-button>
            </template>
        </n-result>
    </n-space>
</template>

<script>
    export default {
        name: 'Exception404',
        props: ['setting'],
        methods: {
            closeApp() {
                this.$store.dispatch('core/close', this.setting.id)
            }
        }
    }
</script>
