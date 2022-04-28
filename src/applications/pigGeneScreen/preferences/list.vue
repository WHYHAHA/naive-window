<template>
    <n-card title="偏好设置：">
        <n-space :size="30">
            <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goMeasureType">
                <n-space align="center">
                    <div class="bg-hover-info rounded-left p-2 pl-3 pr-3">
                        <n-icon size="50" color="white">
                            <settingIcon />
                        </n-icon>
                    </div>
                    <div class="font-20 mr-2 ml-1">耳样类型设置</div>
                </n-space>
            </n-card>
            <!-- <n-card hoverable content-style="padding: 0;cursor: pointer;">
                <n-space align="center">
                    <div class="bg-warning rounded-left p-2 pl-3 pr-3">
                        <n-icon size="50" color="white">
                            <settingIcon />
                        </n-icon>
                    </div>
                    <div class="font-20 mr-2 ml-1">检测矫正算法配置</div>
                </n-space>
            </n-card>
            <n-card hoverable content-style="padding: 0;cursor: pointer;">
                <n-space align="center">
                    <div class="bg-light-red rounded-left p-2 pl-3 pr-3">
                        <n-icon size="50" color="white">
                            <settingIcon />
                        </n-icon>
                    </div>
                    <div class="font-20 mr-2 ml-1">种猪淘汰算法配置</div>
                </n-space>
            </n-card>-->
        </n-space>
    </n-card>
</template>
<script>
    import { defineComponent, reactive, toRefs } from "vue"
    import { SettingFilled as settingIcon } from "@vicons/antd"

    export default defineComponent({
        props: {
            pageData: Object,
        },
        components: {
            settingIcon,
        },
        setup(props, { emit }) {
            const state = reactive({
                search: {
                    pigCodeLike: "",
                    selectVal: "",
                },
            })
            return {
                ...toRefs(state),
                goMeasureType() {
                    const data = {
                        id: "",
                        name: "耳样类型设置",
                        preferences: true,
                        pageUrl: "pigGeneScreen/preferences/page/measureType",
                    }
                    emit("gopage", data)
                },
            }
        },
    })
</script>

<style lang="">
</style>