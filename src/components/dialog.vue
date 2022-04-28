<template>
    <div></div>
</template>

<script>
    import { useDialog } from 'naive-ui'

    export default {
        name: 'publice_dialog',
        setup() {
            window.$dialog = useDialog()
        }
    }
</script>