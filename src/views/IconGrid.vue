<template>
    <!-- 轮播 -->
    <n-carousel
        dot-placement="top"
        @click.stop="changeTaskBar"
        @contextmenu="onContextmenu($event)"
        :draggable="isDraggable"
        v-if="userInfo.type != 0"
    >
        <template #dots="{ total, currentIndex, to }">
            <div class="custom-dots">
                <n-grid x-gap="0" :cols="2">
                    <n-gi
                        class
                        v-for="index of total"
                        :key="index"
                        :class="{ ['is-active']: currentIndex === index - 1 }"
                        @click="to(index - 1)"
                    >
                        <div class="dotsCenter" v-if="index == 1">
                            {{ language == "en-US" ? "MainInterface" : "主界面" }}
                        </div>
                        <div class="dotsCenter" v-if="index == 2">
                            {{ language == "en-US" ? "DataDashboard" : "数据仪表盘" }}
                        </div>
                    </n-gi>
                </n-grid>
            </div>
        </template>
        <n-carousel-item>
            <!-- 主界面 -->
            <MainInterfaceDesk :deskBox="mainInterfaceDeskData"></MainInterfaceDesk>
        </n-carousel-item>
        <n-carousel-item>
            <!-- 数据仪表盘 -->
            <DataDashboard :deskBox="DataDashboardData"></DataDashboard>
        </n-carousel-item>
    </n-carousel>
</template>

<script>
    // import appIcon from './Icon.vue'
    // import calendar from './calendar.vue'
    import MainInterfaceDesk from "./deskInterface/index.vue"
    import DataDashboard from "./dataDashboard/index.vue"

    export default {
        name: "IconGrid",
        components: {
            // appIcon,
            MainInterfaceDesk,
            DataDashboard
            // calendar
        },
        props: {},
        data() {
            return {
                userInfo: this.$store.state.core.userInfo,
                grid: {
                    //网格行列个数
                    row: 0,
                    col: 0
                },
                cell: {
                    //每个单元格大小
                    height: 100,
                    width: 100
                }
            }
        },
        created() {
            let w = document.body.clientWidth
            let h = document.body.clientHeight * 0.8
            this.grid.row = Math.ceil(h / this.cell.height)
            this.grid.col = Math.ceil(w / this.cell.width)
        },
        computed: {
            mainInterfaceDeskData() {
                return this.$store.state.core.deskData[0].deskBox
            },
            DataDashboardData() {
                return this.$store.state.core.deskData[1].deskBox
            },
            isDraggable() {
                return this.$store.state.core.isDraggable
            },
            language() {
                return this.$store.state.core.language
            }
        },
        methods: {
            changeTaskBar() {
                this.$store.commit("core/CLOSE_START_MENU")
                this.$store.commit("core/CLEAN_CONTEXT_MENU")
                this.$store.dispatch("core/sidebarSwitch", false)
            },
            onContextmenu(event) {
                this.$store.commit("core/SET_CONTEXT_MENU", {
                    x: event.clientX,
                    y: event.clientY,
                    type: "wall",
                    data: this.$store.state.core.deskData[0].contextMenuList
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .carousel-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .custom-dots {
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        max-width: 250px;
        text-align: center;
        color: black;
        background: white;
        box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        display: flex;
        border-radius: 3px;
        justify-content: space-evenly;
        .is-active {
            background: #3480d3;
            color: #fff;
            opacity: 1;
            &:hover {
                border-color: #3480d3;
            }
        }
        .dotsCenter {
            padding: 5px 10px;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
    }
</style>
