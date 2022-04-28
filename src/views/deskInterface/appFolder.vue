<template >
    <n-scrollbar :style="{maxHeight:'100%', padding: 10+'px'}">
        <!-- icons -->
        <n-grid x-gap="12" y-gap="20" cols="2 300:4 600:6">
            <n-gi v-for="item in icons" :key="item">
                <n-space justify="center" align="center">
                    <div class="icon-item" :class="{selected:item.selected}" @contextmenu="onContextmenu($event)">
                        <div class="icon-body" @click="onClick($event)" @dblclick="onDblclick(item)" @dragstart="onDragstart()" @dragend="onDragend()" draggable="true">
                            <div class="icon" :class="item.icon"></div>
                            <div class="text">{{ language=='zh-CN'?item.name: item.enName}}</div>
                        </div>
                    </div>
                </n-space>
            </n-gi>
        </n-grid>
        <!-- 底部间距 -->
        <div class="p-1"></div>
    </n-scrollbar>
</template>

<script>
    import { defineComponent, reactive, toRefs, computed } from "vue"
    import { useStore } from "vuex"

    export default defineComponent({
        props: {
            setting: {
                // 所有设置选项和基本信息
                type: Object,
                default() {
                    return {}
                },
            },
        },
        components: {},
        setup(props) {
            const store = useStore()
            const icons = computed(() => {
                let icons = []
                props.setting.appList.forEach(item => {
                    if (item.link) {
                        icons.push(item)
                    }
                })
                return icons
            })
            const language = computed(() => {
                return store.state.core.language
            })
            const state = reactive({})
            return {
                icons,
                language,
                ...toRefs(state),
                onDblclick(item) {
                    store.dispatch("core/openApp", { aid: item.id, rid: store.state.core.userInfo.id })
                },
            }
        },
    })
</script>
<style lang="less" scoped>
    .icon-item {
        // width: 50px;
        // height: 50px;
        padding: 5px 0;
        /*border:1px dashed #fff;*/
        &.selected {
            .icon-body {
                /*border:2px solid rgba(43, 115, 199, 0.36);*/
                /*background:rgba(43, 115, 199, 0.2);*/
                background: rgba(0, 134, 255, 0.27);
            }
        }
        &:hover {
            border-color: #b9d7fc;
            background: hsla(0, 0%, 100%, 0.5);
            .icon-body {
                background: none;
            }
        }
        &.dragging {
            opacity: 0.6;
        }

        .icon-body {
            /*border:2px solid transparent;*/
            border-radius: 4px;
            width: 80px;

            .icon {
                height: 50px;
                width: 100%;
                margin: 0 auto;
                background-size: 45px;
            }

            .text {
                min-height: 20px;
                line-height: 20px;
                text-align: center;
                font-size: 14px;
                overflow: hidden;
                word-wrap: break-word;
                word-break: break-all;
                text-overflow: ellipsis;
                padding: 0 5px;
                padding-top: 5px;
                color: #ffffff;
            }
        }
    }
</style>