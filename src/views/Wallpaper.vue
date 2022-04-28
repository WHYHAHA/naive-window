<template>
    <div class="wallpaper-box">
        <!-- 背景图模块 -->
        <div class="wallpaper-section" @mousedown="onMousedown($event)" :style="{ backgroundImage: 'url(' + wallpaper + ')' }"></div>
        <div class="mouse-action-section">
            <div class="selection-section" v-show="selection.startSelection"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "wallpaper",
        data() {
            return {
                selection: {
                    startSelection: false,
                    startPosition: {},
                    currentPosition: {},
                    topLeft: null,
                    bottomRight: null,
                },
            }
        },
        computed: {
            wallpaper() {
                return (
                    this.$store.state.core.wallpaper ||
                    "https://cdn.bestgenetics.com.cn/common/wall/wall-0.jpg"
                )
            },
        },
        methods: {
            onMousedown(event) {
                this.$store.commit("core/SELECT_ICON", "") //清空 图标选择
                if (event.button == 2) {
                    this.$store.commit("core/SET_CONTEXT_MENU", {
                        x: event.clientX,
                        y: event.clientY,
                        type: "wall",
                    })
                } else {
                    this.$store.dispatch("core/sidebarSwitch", false)
                    this.$store.commit("core/CLEAN_CONTEXT_MENU")
                }
            },
        },
        ready: function () {},
    }
</script>

<style lang="less" scoped>
    .display-preview {
        width: 50%;
        margin: 0px auto;
        padding: 15px;
    }

    .wallpaper-box {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        .wallpaper-section {
            box-sizing: border-box;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            height: 100%;
            background-repeat: no-repeat;
            background-size: cover;
            background-color: #1f1f1f;
            background-position: center;
            background-attachment: fixed;
        }
    }
</style>
