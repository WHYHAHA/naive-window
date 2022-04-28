<template>
    <div> </div>
</template>

<script>
    import { useMessage } from "naive-ui";

    export default {
        name: "publice_message",
        setup() {
            window.$message = useMessage()
        }
    };
</script>
