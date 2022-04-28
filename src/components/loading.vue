<template>
    <div style="height:100%;width:100%" class="flex justify-center align-center">
        <n-spin size="large" style="color:black">
            <template #description>
                <n-gradient-text type="success">加载页面中...</n-gradient-text>
            </template>
        </n-spin>
    </div>
</template>

<script>
    export default {
        name: 'loadingComponent',
        methods: {}
    }
</script>
