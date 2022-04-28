<template>
    <div style="width:100%;height:100%">
        <iframe :src="BIUrl" style="width:100%;height:100%"></iframe>
    </div>
</template>
<script>
    export default {
        props: {
            setting: Object
        },
        data() {
            return {
                BIUrl: this.setting.sublist[0].target
            }
        },
        created() {
            // console.log(this.setting.sublist)
        }
    }
</script>
<style lang="">
</style>