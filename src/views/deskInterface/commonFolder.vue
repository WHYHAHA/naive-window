<template >
    <n-scrollbar :style="{maxHeight:'100%', padding: 10+'px',marginBottom:10+'px'}">
        <n-grid x-gap="12" :y-gap="8" cols="2 300:3 600:4">
            <n-gi v-for="(item,index) in applist" :key="index">
                <!-- 功能 -->
                <n-card :content-style="contentStyle" :style="{background:item.bgColor}">
                    <div class="palette">
                        <n-popover :overlap="overlap" :style="{ width: '200px' }" placement="bottom-start" trigger="click" :show-arrow="false">
                            <template #trigger>
                                <n-icon :size="15" style="grid-area: 5 / 1 / 6 / 2">
                                    <ColorIcon />
                                </n-icon>
                            </template>
                            <div class="large-text">
                                <n-color-picker :default-value="item.bgColor" placement="bottom-start" :show-preview="true" @complete="cardBgColorChange" @click="selectBox = item" />
                            </div>
                        </n-popover>
                    </div>
                    {{item.label}}
                </n-card>
            </n-gi>
        </n-grid>
    </n-scrollbar>
</template>

<script>
    import { defineComponent, reactive, toRefs, computed } from 'vue'
    import { Color24Filled as ColorIcon } from '@vicons/fluent'

    import { useStore } from 'vuex'

    export default defineComponent({
        props: {
            setting: {
                // 所有设置选项和基本信息
                type: Object,
                default() {
                    return {}
                }
            }
        },
        components: {
            ColorIcon
        },
        setup(props) {
            const store = useStore()
            const applist = computed(() => {
                return props.setting.appList
            })
            const state = reactive({
                selectBox: {},
                resize: false,
                resizeSide: [
                    'side-top',
                    'side-bottom',
                    'side-left',
                    'side-right',
                    'angle-top-left',
                    'angle-top-right',
                    'angle-bottom-left',
                    'angle-bottom-right'
                ],
                contentStyle: {
                    padding: 0 + 'px',
                    minHeight: 80 + 'px',
                    display: 'flex',
                    fontSize: 12 + 'px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                }
            })
            // 盒子调整大小
            const resizeMove = direction => {
                state.resize = true
                document.querySelector('HTML').style.userSelect = 'none'
                store.commit('core/DRAGGABLECLOSE')
                let mousemove = event => {
                    if (state.resize) {
                        let x = event.clientX
                        let y = event.clientY
                        let mx = document.body.clientWidth
                        let my = document.body.clientHeight * 0.95
                        x = x >= 0 ? (x >= mx ? mx : x) : 0
                        y = y >= 0 ? (y >= my ? my : y) : 0

                        if (direction.indexOf('top') >= 0) {
                            // console.log(y)
                            store.commit('core/CHANGEMAINHEIGHT', { id: props.setting.id, moveY: y })
                        }
                        if (direction.indexOf('left') >= 0) {
                            // targetData.width =
                            //     targetData.width + (targetData.left - x)
                            // targetData.width < targetData.minWidth
                            //     ? ''
                            //     : (targetData.left = x)
                        }
                        if (direction.indexOf('bottom') >= 0) {
                            // console.log(y)
                            console.log(props.setting.top)
                            store.commit('core/CHANGEMAINHEIGHT', { id: props.setting.id, moveY: y })
                            // targetData.height =
                            //     targetData.height +
                            //     (y - (targetData.top + targetData.height))
                        }
                        if (direction.indexOf('right') >= 0) {
                            // targetData.width =
                            //     targetData.width +
                            //     (x - (targetData.left + targetData.width))
                        }
                        // targetData.width < targetData.minWidth
                        //     ? (targetData.width = targetData.minWidth)
                        //     : ''
                        // targetData.height < targetData.minHeight
                        //     ? (targetData.height = targetData.minHeight)
                        //     : ''
                    }
                }

                let mouseup = () => {
                    document.querySelector('HTML').style.userSelect = 'text'
                    state.resize = false
                    clearMouseEvent('mouseup', mouseup)
                    clearMouseEvent('mousemove', mousemove)
                    store.commit('core/DRAGGABLEOPEN')
                }

                document.addEventListener('mousemove', mousemove)
                document.addEventListener('mouseup', mouseup)
            }
            // 清空监听
            const clearMouseEvent = (type, callback) => {
                document.removeEventListener(type, callback)
            }
            return {
                applist,
                resizeMove,
                ...toRefs(state),
                cardBgColorChange(value) {
                    store.commit('core/SETCOMMONFOLDERBGCOLOR', { selectBox: state.selectBox, color: value })
                },
                onDblclick(item) {
                    store.dispatch('core/openApp', { aid: item.id, rid: store.state.core.userInfo.id })
                }
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
        overflow: hidden;
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
            -webkit-backdrop-filter: blur(7px);
            backdrop-filter: blur(7px);
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            background-color: rgba(173, 173, 173, 0.1);
            color: #f0f4f7;
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