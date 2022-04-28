<template>
    <n-space align="center" justify="center" style="width:100%;height:100vh;background:rgb(240, 242, 245)">
        <n-result status="500" title="500 服务器错误" description="服务器出错,请联系管理员">
            <template #icon>
                <n-image preview-disabled="false" width="300" src="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/bg/500.png" />
            </template>
            <template #footer>
                <n-button type="error" @click="closeApp">关闭APP</n-button>
            </template>
        </n-result>
    </n-space>
</template>

<script>
    export default {
        name: 'windowErrorPage',
        props: ['setting'],
        methods: {
            closeApp() {
                this.$store.dispatch('core/close', this.setting.id)
            }
        }
    }
</script>
