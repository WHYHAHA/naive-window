<template>
    <div
        class="window animate__animated animation-faster-plus"
        :class="{
            focus: setting.focus,
            animating: this.animating,
            maximized: this.maximized,
            animate__fadeIn: this.animatedIn,
            animate__fadeOut: this.animatedOut
        }"
        v-show="!setting.min"
        :style="{
            top: position.y + 'px',
            left: position.x + 'px',
            width: width + 'px',
            height: height + 'px',
            'z-index': setting.index
        }"
        @mousedown="onFocus(setting.id)"
        @click.stop="onClick"
    >
        <!-- 窗口头部菜单 -->
        <header class="window-title" @mousedown.self="onMousedown($event)" @dblclick.self="onMax()">
            <div class="icon" :class="setting.icon"></div>
            <div class="text-light userNoSelect">{{ language == "zh-CN" ? setting.title : setting.enTitle }}</div>
            <!-- 路由菜单 -->
            <n-menu class="userNoSelect" v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleMenu" />
            <div class="window-control">
                <span class="button reload" @click="onReload(setting.id)"></span>
                <span class="button min" @mousedown="onMin(setting.id)"></span>
                <span class="button max" @mousedown="onMax()"></span>
                <span class="button close" @mousedown="onClose(setting.id)"></span>
            </div>
        </header>
        <div class="window-body" :ref="'window_' + setting.id">
            <keep-alive>
                <component :is="subComponent" v-model:window="window" :setting="setting" :pageData="pageData" @gopage="goPage"></component>
            </keep-alive>
            <loadingPageComponent v-if="pageLoading"></loadingPageComponent>
        </div>
        <div class="resize-overlay" v-show="overlayShow"></div>
        <div class="resize-side" v-for="(value, index) in resizeSide" :key="index" v-show="resizable" :class="value" @mousedown.self="onResize(value)"></div>
    </div>
</template>

<script>
    import { defineComponent, defineAsyncComponent, markRaw } from "vue"

    import { h } from "vue"
    import { NIcon, useDialog } from "naive-ui"
    import { Menu as MenuIcon, HelpCircle as HelpIcon } from "@vicons/ionicons5"
    import { ContentSettings16Regular as PreferencesIcon } from "@vicons/fluent"

    import notFindComponent from "@/components/404.vue"
    import loadingPageComponent from "@/components/loading.vue"

    function renderIcon(icon) {
        return () => h(NIcon, null, { default: () => h(icon) })
    }
    // 窗口创建
    function asyncComponent(viewPath) {
        // return defineAsyncComponent(() => require(`../applications/${viewPath}.vue`).default)
        // return defineAsyncComponent(() => require([`../applications/${viewPath}.vue`]).default)
        // return defineAsyncComponent(
        //     () =>
        //         new Promise(resolve => {
        //             resolve(`../applications/${viewPath}.vue`)
        //         })
        // )
        return defineAsyncComponent({
            loader: () => import(`@/applications/${viewPath}.vue`),
            // 加载异步组件时要使用的组件 component不是异步组件
            // loadingComponent: loadingPageComponent,
            // 加载失败时要使用的组件
            errorComponent: notFindComponent,
            // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
            delay: 20,
            // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
            // 默认值：Infinity（即永不超时，单位 ms）
            timeout: 3000
        })
    }
    export default defineComponent({
        name: "Window",
        props: {
            setting: {
                id: String,
                focus: Boolean,
                hidden: Boolean,
                index: Number
            }
        },
        components: {
            loadingPageComponent
        },
        provide() {
            return {
                window: this
            }
        },
        // setup() {
        //     t = require("vue-i18n").useI18n().t
        // },
        data() {
            return {
                dialog: useDialog(),
                pageData: {},
                subComponent: {},
                timer: {},
                activeKey: 0,
                pageLoading: false,
                menuOptions: [
                    {
                        label: () => {
                            return this.$t("account.settings.help")
                        },
                        key: "help",
                        icon: renderIcon(HelpIcon),
                        children: [
                            {
                                label: "关于",
                                key: "about"
                            },
                            {
                                label: "使用说明",
                                key: "direction"
                            }
                        ]
                    }
                ],
                drag: false,
                resize: false,
                width: 200,
                height: 400,
                minWidth: 150,
                minHeight: 150,
                maximized: false,
                animating: false,
                animatedIn: false,
                animatedOut: false,
                resizable: true,
                position: {
                    x: 0,
                    y: 0
                },
                oldposition: {},
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
            }
        },
        // 计算属性
        computed: {
            window() {
                return {
                    width: this.width,
                    height: this.height,
                    id: this.setting.id
                }
            },
            language() {
                return this.$store.state.core.language
            }
        },
        // 组件创建
        created() {
            // 事件总程 On
            this.observeOn()

            let w = document.body.clientWidth
            let h = document.body.clientHeight
            //默认窗口大小
            this.width = this.setting.width > 0 ? this.setting.width : w / 1.3
            this.height = this.setting.height > 0 ? this.setting.height : w / 2.8
            this.position.x = w / 2 - this.width / 2
            this.position.y = (h - this.height) / 2
            this.animatedIn = true
            // 设置偏好设置页面
            let preferencesPage = this.setting.page.split("/")[0] + "/preferences/list"
            // 根据 preferences 字段 判断显示偏好设置
            if (this.setting.preferences) {
                this.menuOptions.unshift({
                    label: () => {
                        return this.$t("account.settings.preferences")
                    },
                    key: "preferences",
                    icon: renderIcon(PreferencesIcon),
                    page: preferencesPage
                })
            }
            //设置菜单
            // 根据getMenuList接口返回值 设置菜单
            if (this.setting.sublist.length > 0 && this.menuOptions[0].label != "菜单") {
                const menuObj = {
                    label: () => {
                        return this.$t("account.settings.menu")
                    },
                    key: "menu",
                    icon: renderIcon(MenuIcon),
                    children: []
                }
                this.setting.sublist.forEach(element => {
                    const subObj = {
                        label: "",
                        key: "",
                        page: ""
                    }
                    subObj.label = element.title || element.name
                    subObj.key = element.id
                    subObj.page = element.href
                    menuObj.children.push(subObj)
                })
                this.menuOptions.unshift(menuObj)
            }

            this.pageData.pageUrl = this.setting.page

            // // 全量字典获取
            // this.$store.dispatch('dictionaries/getAllDictionaries')
            // // 获取用户
            // this.$store.dispatch('dictionaries/getUserList')
            setTimeout(() => this.onMax())
            this.pageLoading = true

            let that = this
            Promise.all([
                this.$store.dispatch("dictionaries/getAllDictionaries"),
                this.$store.dispatch("dictionaries/getUserList")
            ])
                .then(result => {
                    console.log(result)
                    that.pageLoading = false
                    that.subComponent = markRaw(asyncComponent(that.setting.page))
                })
                .catch(error => {
                    that.pageLoading = false
                    console.log(error)
                })
        },
        // 虚拟dom实例化
        mounted() {
            //console.log("mounted====>")
            this.animatedIn = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                this.animatedIn = false
            }, 400)
        },
        unmounted() {
            // 事件总程 off
            this.observeOff()
        },
        //方法
        methods: {
            goPage(data) {
                //data
                // {
                //     name:'二级路由名称',
                //     pageUrl:'二级路由'，
                //     grandchildrenName:'三级路由名称'，
                //     grandchildrenPage:'三级路由'，
                // }
                // 面包屑(只分层三级)
                const breadcrumb = []
                if (data.pageUrl != this.setting.page) {
                    // 如果点击为偏好设置 设置对应面包屑
                    const objFatherItem = {
                        pageUrl: data.preferences
                            ? this.setting.page.split("/")[0] + "preferences/list"
                            : this.setting.page,
                        name: data.preferences ? "偏好设置" : this.setting.title
                    }

                    const objChildrenItem = {
                        pageUrl: data.pageUrl,
                        name: data.name
                    }

                    breadcrumb.push(objFatherItem, objChildrenItem)
                    // 第三层写入
                    if (data.grandchildrenPage) {
                        const grandchildren = {
                            pageUrl: data.grandchildrenPage,
                            name: data.grandchildrenName
                        }
                        breadcrumb.push(grandchildren)
                    }
                    data.breadcrumbList = breadcrumb
                }
                // 页面数据赋值
                this.pageData = data

                // this.subComponent = markRaw(defineAsyncComponent(() => import('../applications/' + data.pageUrl + '.vue')))

                data.grandchildrenPage
                    ? (this.subComponent = markRaw(asyncComponent(data.grandchildrenPage)))
                    : (this.subComponent = markRaw(asyncComponent(data.pageUrl)))
            },
            handleMenu(key, item) {
                // 设置下页面数据源中当前路由
                this.pageData.pageUrl = item.page

                if (item.page) {
                    // this.subComponent = markRaw(defineAsyncComponent(() => import('../applications/' + item.page + '.vue')))
                    this.subComponent = markRaw(asyncComponent(item.page))
                }
            },
            onFocus(id) {
                this.$store.dispatch("core/focus", id)
            },
            onClose(id) {
                this.animatedOut = true
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer)
                    this.$store.dispatch("core/close", id)
                }, 300)
            },
            onClick() {
                this.$store.commit("core/CLOSE_START_MENU")
                this.$store.commit("core/CLEAN_CONTEXT_MENU")
                this.$store.dispatch("core/sidebarSwitch", false)
            },
            onReload() {
                this.dialog.warning({
                    // 警告
                    title: this.$t("dataTable.listing.warning"),
                    content: this.$t("dataTable.listing.areYouSureYouRefreshTheCurrentWindow"),
                    positiveText: this.$t("dataTable.listing.determine"),
                    negativeText: this.$t("dtables.listing.cancel"),
                    onPositiveClick: () => {
                        // 全量字典获取
                        this.$store.dispatch("dictionaries/getAllDictionaries")
                        // 获取用户
                        this.$store.dispatch("dictionaries/getUserList")
                        this.goPage(this.pageData)
                    },
                    onNegativeClick: () => {}
                })
            },
            onMin(id) {
                this.$store.dispatch("core/minOrShow", id)
            },
            onMax() {
                if (this.maximized && this.oldPosition) {
                    this.animating = true
                    this.resizable = true
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.maximized = false
                        this.position.y = this.oldPosition.y
                        this.position.x = this.oldPosition.x
                        this.height = this.oldPosition.height
                        this.width = this.oldPosition.width
                        this.oldPosition = null
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.animating = false
                        }, 500)
                    })
                } else {
                    this.animating = true
                    this.resizable = false
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.maximized = true
                        this.oldPosition = {
                            y: this.position.y,
                            x: this.position.x,
                            height: this.height,
                            width: this.width
                        }
                        this.position.y = 0
                        this.position.x = 0
                        this.height = document.body.clientHeight * 0.95
                        this.width = document.body.clientWidth
                        clearTimeout(this.timer)
                        this.timer = setTimeout(() => {
                            this.animating = false
                        }, 500)
                    })
                }
            },
            onResize(direction) {
                this.resize = true
                this.overlayShow = true
                document.onmousemove = event => {
                    if (this.resize) {
                        let x = event.clientX
                        let y = event.clientY
                        let mx = document.body.clientWidth
                        let my = document.body.clientHeight * 0.95
                        x = x >= 0 ? (x >= mx ? mx : x) : 0
                        y = y >= 0 ? (y >= my ? my : y) : 0

                        if (direction.indexOf("top") >= 0) {
                            this.height = this.height + (this.position.y - y)
                            this.height < this.minHeight ? "" : (this.position.y = y)
                        }
                        if (direction.indexOf("left") >= 0) {
                            this.width = this.width + (this.position.x - x)
                            this.width < this.minWidth ? "" : (this.position.x = x)
                        }
                        if (direction.indexOf("bottom") >= 0) {
                            this.height = this.height + (y - (this.position.y + this.height))
                        }
                        if (direction.indexOf("right") >= 0) {
                            this.width = this.width + (x - (this.position.x + this.width))
                        }
                        this.width < this.minWidth ? (this.width = 400) : ""
                        this.height < this.minHeight ? (this.height = 200) : ""
                    }
                }
                document.onmouseup = () => {
                    this.resize = false
                    this.overlayShow = false
                }
            },
            onMousedown(e) {
                let w = e.clientX - this.position.x
                let h = e.clientY - this.position.y
                if (!this.maximized) {
                    this.drag = true
                    document.onmousemove = e => {
                        if (this.drag && e.y > 30) {
                            //let mx = document.body.clientWidth;
                            //let my = document.body.clientHeight * 0.95;
                            this.position.x = e.clientX - w
                            this.position.y = e.clientY - h
                            //this.position.x = this.position.x <= 0 ? 0 : this.position.x + this.width >= mx ? mx - this.width : this.position.x;
                            //this.position.y = this.position.y <= 0 ? 0 : this.position.y + this.height >= my ? my - this.height : this.position.y;
                        }
                    }
                    document.onmouseup = () => {
                        //console.log("e===>" + this.drag)
                        this.drag = false
                    }
                }
            },
            observeOn() {
                this.$observer.$on("GOERRORPAGE", () => {
                    const AsyncComp = defineAsyncComponent(() =>
                        import("@/components/windowErrorPage.vue")
                    )
                    this.subComponent = AsyncComp
                    this.pageLoading = false
                })
            },
            observeOff() {
                this.$observer.$off("GOERRORPAGE")
            }
        }
    })
</script>

<style lang="less" rel="stylesheet/less">
    @import "../css/global";

    .window {
        position: absolute;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);

        &.animating {
            transition: all ease 0.5s;
        }

        .window-body {
            background: #f9f9f9;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
            top: @titleHeight;
            width: 100%;
            overflow: auto;
        }
        // 窗口头部
        .window-title {
            width: 100%;
            display: flex;
            align-items: center;
            line-height: @titleHeight;
            height: @titleHeight;

            cursor: default;
            .n-menu {
                .n-menu-item-content--child-active,
                .n-menu-item-content-header,
                .n-menu-item-content__icon {
                    color: white !important;
                }
            }

            .icon {
                margin: 5px 5px;
                height: 18px;
                width: 18px;
                background-size: cover;
            }
        }

        &.focus {
            box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);

            .window-title {
                //background: #f5f8ff;
                background: #004b6b;
                // background: linear-gradient(to right, #2080f0, rgba(32, 128, 240, 0.6));
                color: white;
            }

            z-index: 10;
        }

        &.maximized {
            .window-control .button.max {
                @margin: 5px;
                @diff: 2px;
                @w: 8px;
                @b: 1px;
                @top: 0px;
                @left: 0px;

                &:before {
                    box-sizing: border-box;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @w;
                    width: @w;
                    left: ((@titleHeight - 2 * @margin - @w) ./ 2)- @diff + @left;
                    top: ((@titleHeight - 2 * @margin - @w) ./ 2) + @diff + @top;
                    border: @b solid #fff;
                    border-top-width: 2 * @b;
                }

                &:after {
                    box-sizing: border-box;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @w;
                    width: @w;
                    left: ((@titleHeight - 2 * @margin - @w) ./ 2) + @diff + @left;
                    top: ((@titleHeight - 2 * @margin - @w) ./ 2)- @diff + @top;
                    border: @b solid #fff;
                    border-top-width: 2 * @b;
                }
            }
        }

        .window-control {
            @margin: 5px;
            position: absolute;
            right: 0;
            top: 0;
            height: @titleHeight;

            .button {
                display: block;
                position: relative;
                width: @titleHeight - 2 * @margin;
                height: @titleHeight - 2 * @margin;
                margin: @margin @margin 0 0;
                float: left;
                border-radius: 3px;
            }
            .reload {
                background: #ff9900;

                &:before {
                    box-sizing: border-box;
                    @w: 13px;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @w;
                    width: @w;
                    left: ((@titleHeight - 2 * @margin - @w) / 2);
                    top: ((@titleHeight - 2 * @margin - @w) / 2);
                    border-radius: 50%;
                    border: 2px solid currentColor;
                    border-left: 2px solid transparent;
                    position: relative;
                }
                &::after {
                    content: "";
                    width: 3px;
                    height: 3px;
                    border-bottom: 2px solid currentColor;
                    border-left: 2px solid currentcolor;
                    position: absolute;
                    top: 11px;
                    left: 4px;
                    transform: rotate(75deg);
                }
            }
            .min {
                background: #81c2d0;

                &:before {
                    box-sizing: border-box;
                    @w: 12px;
                    @h: 2px;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @h;
                    width: @w;
                    left: (@titleHeight - 2 * @margin - @w) ./ 2;
                    bottom: ((@titleHeight - 2 * @margin - @h) ./ 2) - 4px;
                    background: #fff;
                }
            }

            .max {
                background: #659a65;

                &:before {
                    box-sizing: border-box;
                    @w: 12px;
                    @b: 1px;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @w;
                    width: @w;
                    left: ((@titleHeight - 2 * @margin - @w) / 2);
                    top: ((@titleHeight - 2 * @margin - @w) / 2);
                    border: @b solid #fff;
                    border-top-width: 2 * @b;
                }
            }

            .Rotate(@deg) {
                transform: rotate(@deg);
                -webkit-transform: rotate(@deg);
                -moz-transform: rotate(@deg);
            }

            .close {
                &:before,
                &:after {
                    @w: 14px;
                    @h: 2px;
                    content: "";
                    display: block;
                    position: absolute;
                    height: @h;
                    width: @w;
                    left: ((@titleHeight - 2 * @margin - @w) / 2);
                    top: ((@titleHeight - 2 * @margin - @h) / 2);
                    background: #fff;
                    .Rotate(45deg);
                }

                &:after {
                    .Rotate(-45deg);
                }

                background: #d26262;
            }
        }

        @reactionWidth: 4px;

        .resize-side {
            position: absolute;
        }

        .resize-overlay {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }

        .side-right {
            right: 0;
            bottom: 0;
            height: 100%;
            width: @reactionWidth;
            cursor: e-resize;
        }

        .side-bottom {
            right: 0;
            bottom: 0;
            width: 100%;
            height: @reactionWidth;
            cursor: s-resize;
        }

        .side-left {
            left: 0;
            top: 0;
            height: 100%;
            width: @reactionWidth;
            cursor: w-resize;
        }

        .side-top {
            left: 0;
            top: 0;
            width: 100%;
            height: @reactionWidth;
            cursor: n-resize;
        }

        .angle-bottom-right {
            right: 0;
            bottom: 0;
            width: @reactionWidth*2;
            height: @reactionWidth*2;
            cursor: se-resize;
        }

        .angle-bottom-left {
            left: 0;
            bottom: 0;
            width: @reactionWidth*2;
            height: @reactionWidth*2;
            cursor: sw-resize;
        }

        .angle-top-right {
            top: 0;
            right: 0;
            width: @reactionWidth*2;
            height: @reactionWidth*2;
            cursor: ne-resize;
        }

        .angle-top-left {
            top: 0;
            left: 0;
            width: @reactionWidth*2;
            height: @reactionWidth*2;
            cursor: nw-resize;
        }
    }
    .animation-faster-plus {
        --animate-duration: 0.1s;
    }
</style>
