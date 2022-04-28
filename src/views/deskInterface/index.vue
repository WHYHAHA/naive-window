<template lang="">
    <div class="position-relative">
        <div
            class="appFolder"
            v-for="(item, index) in deskBox"
            :key="index"
            :style="{
                height: item.height + 'px',
                width: item.width + 'px',
                top: item.top + 'px',
                left: item.left + 'px'
            }"
        >
            <!-- 头部heard -->
            <n-space justify="space-between" align="center" class="appFolderheard">
                <div class="flex align-center">
                    <n-icon
                        @mousedown.stop="move(item)"
                        class="pinBox"
                        :size="18"
                        style="margin-bottom: 2px"
                    >
                        <PinIcon />
                    </n-icon>
                    <div class="font-14 ml-1">
                        {{ language == "zh-CN" ? item.boxName : item.boxEnName }}
                    </div>
                </div>
                <div class="addIcon animated" v-if="item.popoverFlag">
                    <n-popover
                        :overlap="overlap"
                        :style="{ width: '300px', padding: 0 }"
                        placement="bottom-start"
                        trigger="click"
                        :show-arrow="false"
                    >
                        <template #trigger>
                            <n-icon :size="20" style="grid-area: 5 / 1 / 6 / 2">
                                <JiahaoIcon />
                            </n-icon>
                        </template>
                        <div class="large-text">
                            <popoverBox :setting="item"></popoverBox>
                        </div>
                    </n-popover>
                </div>
            </n-space>
            <!-- 主体 -->
            <div class="appFolderBody">
                <!-- app管理box -->
                <appFolder v-if="item.type == 'appFolder'" :setting="item"></appFolder>
                <!-- commonFolder功能Box -->
                <commonFolder v-if="item.type == 'commonFolder'" :setting="item"></commonFolder>
                <!-- calendarFolder日历Box -->
                <calendarFolder v-if="item.type == 'calendar'" :setting="item"></calendarFolder>
            </div>
            <div class="resize-overlay" v-show="overlayShow"></div>
            <div
                class="resize-side"
                v-for="(value, index) in resizeSide"
                :key="index"
                v-show="item.useDrag"
                :class="value"
                @mousedown.self="onResize(value, item)"
            ></div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, computed } from "vue"
    import { AddSquare24Regular as JiahaoIcon, Pin24Regular as PinIcon } from "@vicons/fluent"
    import { useStore } from "vuex"

    import appFolder from "./appFolder.vue"
    import commonFolder from "./commonFolder.vue"
    import calendarFolder from "./calendarFolder.vue"
    import popoverBox from "./popoverBox.vue"

    export default defineComponent({
        // 主界面
        props: {
            deskBox: {
                // 单个Box
                type: Array,
                default() {
                    return []
                }
            }
        },
        components: {
            appFolder,
            commonFolder,
            calendarFolder,
            popoverBox,
            JiahaoIcon,
            PinIcon
        },
        setup(props) {
            const state = reactive({
                resize: false,
                overlayShow: false,
                resizeSide: [
                    "side-top",
                    "side-bottom",
                    "side-left",
                    "side-right",
                    "angle-top-left",
                    "angle-top-right",
                    "angle-bottom-left",
                    "angle-bottom-right"
                ]
            })
            const store = useStore()
            const language = computed(() => {
                return store.state.core.language
            })
            // 盒子移动
            const move = item => {
                // let odiv = e //获取目标元素
                //算出鼠标相对元素的位置
                // let disX = event.clientX - (odiv.offsetLeft || 0)
                // let disY = event.clientY - (odiv.offsetTop || 0)
                state.zindex = 100
                document.onmousemove = e => {
                    //鼠标按下并移动的事件
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = e.clientX - 18
                    let top = e.clientY - 18
                    state.positionX = top
                    state.positionY = left
                    //移动当前元素
                    store.commit("core/SETMAINMOVE", { id: item.id, left: left, top: top })
                }
                document.onmouseup = () => {
                    document.onmousemove = null
                    document.onmouseup = null
                    state.zindex = 0
                }
            }
            // 盒子调整大小
            const onResize = (direction, item) => {
                state.resize = true
                state.overlayShow = true
                store.commit("core/DRAGGABLECLOSE")
                document.querySelector("HTML").style.userSelect = "none"
                let mousemove = event => {
                    if (state.resize) {
                        let x = event.clientX
                        let y = event.clientY
                        let mx = document.body.clientWidth
                        let my = document.body.clientHeight * 0.95
                        x = x >= 0 ? (x >= mx ? mx : x) : 0
                        y = y >= 0 ? (y >= my ? my : y) : 0

                        if (direction.indexOf("top") >= 0) {
                            let data = {
                                id: item.id,
                                type: "top",
                                moveY: y
                            }
                            store.commit("core/BOXONRESIZE", data)
                        }
                        if (direction.indexOf("left") >= 0) {
                            let data = {
                                id: item.id,
                                type: "left",
                                moveX: x
                            }
                            store.commit("core/BOXONRESIZE", data)
                        }
                        if (direction.indexOf("bottom") >= 0) {
                            let data = {
                                id: item.id,
                                type: "bottom",
                                moveY: y
                            }
                            store.commit("core/BOXONRESIZE", data)
                        }
                        if (direction.indexOf("right") >= 0) {
                            let data = {
                                id: item.id,
                                type: "right",
                                moveX: x
                            }
                            store.commit("core/BOXONRESIZE", data)
                        }
                    }
                }

                let mouseup = () => {
                    document.querySelector("HTML").style.userSelect = "text"
                    state.resize = false
                    state.overlayShow = false
                    store.commit("core/DRAGGABLEOPEN")
                    clearMouseEvent("mouseup", mouseup)
                    clearMouseEvent("mousemove", mousemove)
                }
                document.addEventListener("mousemove", mousemove)
                document.addEventListener("mouseup", mouseup)
            }
            const clearMouseEvent = (type, callback) => {
                document.removeEventListener(type, callback)
            }

            return {
                move,
                onResize,
                language,
                ...toRefs(state)
            }
        }
    })
</script>
<style lang="less" scoped>
    .appFolder {
        border-radius: 8px 8px 0 0;
        color: black;
        position: absolute;
        padding: 5px 0;
        .appFolderheard {
            margin: 0 !important;
            padding: auto;
            widows: 100%;
            background-color: #f0f4f7;
            padding: 6px 10px;
            border-radius: 8px 8px 0 0;
            overflow: hidden;
            .pinBox {
                cursor: grab;
            }
            .addIcon {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover {
                    -webkit-animation-name: swing;
                    animation-name: swing;
                }
            }
        }
        .appFolderBody {
            display: flex;
            flex-wrap: wrap;
            background-color: rgba(173, 173, 173, 0.1);
            color: #f0f4f7;
            height: calc(100% - 40px);
            .n-card {
                position: relative;
                border: 0;
                cursor: pointer;
                &:hover {
                    opacity: 0.5 !important;
                }
                .palette {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                }
            }
        }
        .resize-overlay {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
        .resize-side {
            position: absolute;
        }
        .side-top {
            left: 0;
            top: 0;
            width: 100%;
            height: 4px;
            cursor: n-resize;
        }
        .side-bottom {
            right: 0;
            bottom: 0;
            width: 100%;
            height: 4px;
            cursor: s-resize;
        }
        .side-left {
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            cursor: w-resize;
        }
        .side-right {
            right: 0;
            bottom: 0;
            height: 100%;
            width: 4px;
            cursor: e-resize;
        }
        .angle-top-left {
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            cursor: nw-resize;
        }
        .angle-top-right {
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            cursor: ne-resize;
        }
        .angle-bottom-left {
            left: 0;
            bottom: 0;
            width: 8px;
            height: 8px;
            cursor: sw-resize;
        }
        .angle-bottom-right {
            right: 0;
            bottom: 0;
            width: 8px;
            height: 8px;
            cursor: se-resize;
        }
    }
</style>
