<template>
    <div id="monitor-container">
        <n-config-provider :locale="locale" :date-locale="dateLocale">
            <!-- 进度条 -->
            <n-loading-bar-provider>
                <!-- 通知 -->
                <n-notification-provider>
                    <!-- 消息 -->
                    <n-message-provider>
                        <!-- dialog -->
                        <n-dialog-provider>
                            <router-view></router-view>
                        </n-dialog-provider>
                    </n-message-provider>
                </n-notification-provider>
            </n-loading-bar-provider>
        </n-config-provider>

        <!-- 全局消息封装(可以直接使用window调用) -->
        <n-message-provider>
            <Message />
        </n-message-provider>
        <!-- 全局通知封装(可以直接使用window调用) -->
        <n-notification-provider>
            <Notification />
        </n-notification-provider>
        <!-- 全局dialog封装(可以直接使用window调用) -->
        <n-dialog-provider>
            <Dialog />
        </n-dialog-provider>
    </div>
</template>

<script>
    import { zhCN, dateZhCN } from "naive-ui"
    import { NMessageProvider } from "naive-ui"
    import helper from "../src/utils/helper.js"
    import Message from "./components/message.vue"
    import Notification from "./components/notification.vue"
    import Dialog from "./components/dialog.vue"

    export default {
        name: "monitor",
        components: {
            NMessageProvider,
            Message,
            Notification,
            Dialog
        },
        data() {
            return {}
        },
        computed: {
            // 框架自动国际化
            locale: function () {
                let language = helper.getLocalstorage("language") || "zh-CN"
                if (language == "zh-CN") {
                    return zhCN
                } else {
                    return null
                }
            },
            // 框架自动国际化
            dateLocale: function () {
                let language = helper.getLocalstorage("language") || "zh-CN"
                if (language == "zh-CN") {
                    return dateZhCN
                } else {
                    return null
                }
            }
        },
        created() {
            // i18n国际化
            let localLanage = helper.getLocalstorage("language")
            if (localLanage && localLanage == "en-US") {
                this.$i18n.locale = "en"
            } else {
                this.$i18n.locale = "zh"
            }
            // window.onresize = () => {
            //     return (() => {
            //         debugger
            //     })()
            // }
        },
        beforeUnmount() {}
    }
</script>

<style lang="less"></style>
