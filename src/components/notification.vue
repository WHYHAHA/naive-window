<template>
    <div></div>
</template>

<script>
    import { useNotification } from 'naive-ui'

    export default {
        name: 'publice_notification',
        setup() {
            window.$notification = useNotification()
        }
    }
</script>
