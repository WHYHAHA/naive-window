<template>
    <div>
        <div class="desktop" v-show="!openLockScreen">
            <!-- 背景 -->
            <wallpaper></wallpaper>
            <!-- 桌面 日历及切换 -->
            <icon-grid></icon-grid>
            <!-- 底部菜单&app弹框(window组件) -->
            <Taskbar></Taskbar>
            <!-- 鼠标右击选项 -->
            <ContextMenu></ContextMenu>
            <!-- 右侧消息抽屉 -->
            <Sidebar :sidebarShow="sidebarShow"></Sidebar>
        </div>
        <div v-if="openLockScreen">
            <!-- 锁屏页 -->
            <LockScreen></LockScreen>
        </div>
    </div>
</template>
<script>
    import Wallpaper from "./Wallpaper.vue"
    import Taskbar from "./Taskbar.vue"
    import ContextMenu from "./ContextMenu.vue"
    import IconGrid from "./IconGrid.vue"
    import Sidebar from "./Sidebar.vue"
    import LockScreen from "./LockScreen.vue"
    import storage from "store"

    export default {
        name: "Desktop",
        data() {
            return {
                createFalg: false,
                masterDataWs: "",
                // socketURL: "ws://172.16.22.85:8098/websocket",
                masterDataSocketURL: process.env.VUE_APP_API_BASE_MASTERDATAWEBSOCKET,
                tenantSocketURL: process.env.VUE_APP_API_BASE_TENANTWEBSOCKET
            }
        },
        mounted() {
            let openWebSocket = process.env.VUE_APP_OPENWEBSOCKET

            this.observeOn()
            openWebSocket == "true" ? this.masterDataSocketInit() : ""
            this.createFalg = true
            // this.socketInit2()
        },
        beforeCreate() {
            //oncontextmenu 事件在元素中用户右击鼠标时触发并打开上下文菜单
            document.oncontextmenu = new Function("event.returnValue=false")
            //onselectstart几乎可以用于所有对象，其触发时间为目标对象被开始选中时（即选中动作刚开始，尚未实质性被选中）
            // document.onselectstart = new Function('event.returnValue=false')
            this.$store.commit("core/APP_INIT")
            this.$store.commit("core/DESKTOP_INIT")
        },
        unmounted() {
            // 事件总程 off
            this.observeOff()
        },
        components: {
            Taskbar,
            Wallpaper,
            IconGrid,
            ContextMenu,
            Sidebar,
            LockScreen
        },
        methods: {
            clean() {
                //this.$store.commit('manager/selectIcon', '');
            },
            masterDataSocketInit() {
                let that = this
                this.masterDataWs = new WebSocket(this.masterDataSocketURL, [
                    storage.get("access_token")
                ])
                this.masterDataWs.onopen = function (evt) {
                    console.log("Connection open ..." + evt)
                }
                /*
                 * 接收时参数
                 *
                 * {data: "Hello WebSockets!", msg: "Hello WebSockets!", type: 0,path:''}
                 *
                 */
                this.masterDataWs.onmessage = function (evt) {
                    console.log("接收消息: " + evt.data)
                    that.$store
                        .dispatch("message/AddToDoList", evt)
                        .then(() => {
                            // 获取对应app 信息
                            let messageData = JSON.parse(evt.data.data)
                            // 跳转对应app
                            this.$store.dispatch("core/openApp", {
                                aid: messageData.route,
                                rid: this.$store.state.core.userInfo.id
                            })
                        })
                        .catch(() => {
                            console.log("已读并跳转失败")
                        })
                    // state.ws.close()
                }
                this.masterDataWs.onclose = function (evt) {
                    console.log("Connection closed.")
                    // if (that.createFalg) {
                    //     window.$notification.create({
                    //         title: "消息服务断开！",
                    //         description: "消息服务已断开，请刷新重新连接！",
                    //         meta: "2019-5-27 15:11",
                    //         duration: 5000
                    //     })
                    // }
                }
            },
            socketInit2() {
                this.ws = new WebSocket(this.tenantSocketURL, [storage.get("access_token")])
                this.ws.onopen = function (evt) {
                    console.log("Connection open ..." + evt)
                }
                /*
                 * 接收时参数
                 *
                 * {data: "Hello WebSockets!", msg: "Hello WebSockets!", type: 0,path:''}
                 *
                 */
                this.ws.onmessage = function (evt) {
                    console.log("接收消息: " + evt.data)

                    // state.ws.close()
                }
                this.ws.onclose = function () {
                    console.log("Connection closed.")
                    window.$notification.create({
                        title: "消息服务断开！",
                        description: "消息服务已断开，请重新连接！",
                        meta: "2019-5-27 15:11",
                        duration: 5000
                    })
                }
            },
            testClose() {
                this.masterDataWs.close()
            },
            observeOn() {
                this.$observer.$on("SOCKET_SEND", msg => {
                    this.ws.send(msg)
                })

                this.$observer.$on("SOCKET_CLOSE", () => {
                    this.ws.close()
                })
            },
            observeOff() {
                this.$observer.$off("SOCKET_SEND")
                this.$observer.$off("SOCKET_CLOSE")
            }
        },
        computed: {
            sidebarShow() {
                return this.$store.state.core.sidebar
            },
            openLockScreen() {
                return this.$store.state.core.openLockScreen
            }
        },
        beforeDestroy() {
            this.masterDataWs.close()
            this.masterDataWs = ""
        }
    }
</script>

<style lang="less" scoped></style>
