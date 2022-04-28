<template>
    <div>
        <div class="application-section scope">
            <window v-for="app in apps" :key="app.id" :setting="app"></window>
        </div>
        <div class="taskbar-section scope">
            <!-- 底部菜单左侧 -->
            <div class="dog-start flex align-center p-1 pointer" @click="onStart">
                <div class="tasker-window">
                    <n-badge :value="0">
                        <n-icon size="30" color="#fff">
                            <WindowsFilled />
                        </n-icon>
                    </n-badge>
                </div>
                <span class="font-weight-bolder font-20 text-light-#ccc m-1 userNoSelect">{{
                    userInfo.tenantName
                }}</span>
            </div>
            <!-- 底部菜单中间 -->
            <div class="task-list">
                <div
                    class="task-item userNoSelect"
                    :class="{ actived: task.focus }"
                    v-for="task in tasklist"
                    :key="task.id"
                    @click="onClick(task.id)"
                    :style="{ width: itemWidth + 'px' }"
                >
                    <span class="icon" :class="task.icon"></span>
                    <n-ellipsis style="max-width: 100px">
                        {{ language == "zh" ? task.title : task.enTitle }}
                    </n-ellipsis>
                </div>
            </div>
            <!-- 底部菜单右侧 -->
            <div class="dog-tool flex">
                <div class="dog-task-icon" @click="onSidebar">
                    <n-badge :value="todoListlength" :max="15">
                        <n-icon size="30" color="#fec445">
                            <EmailFilled />
                        </n-icon>
                    </n-badge>
                </div>
                <div class="dog-theDateOf">
                    <div class="dog-theDateOf-atThe">{{ hours }}:{{ minutes }}</div>
                    <div>
                        <div class="dog-theDateOf-time">
                            {{ years }}/{{ month }}/{{ day }}
                            <span>星期{{ weekOld[week] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__slideInUp animation-faster-plus"
            leave-active-class="animate__animated animate__fadeOutDown animation-faster-pro"
        >
            <div class="dog-menu" v-show="showmenu">
                <span class="user">
                    <n-space vertical align="center">
                        <n-avatar
                            :size="64"
                            :src="userInfo.imgpath"
                            :fallback-src="defaultUserAvatar"
                            round
                        />
                        <span class="text-center">{{ userInfo.name }}</span>
                    </n-space>
                </span>
                <div class="dog-menu-list">
                    <ul>
                        <li class="appTitle userNoSelect">{{ $t("account.settings.AppList") }}</li>
                        <li v-for="item in menulist" :key="item.id" class="pointer">
                            <div
                                class="menu-item"
                                @click="onClickItem(item)"
                                v-if="showMenulist(item)"
                            >
                                <i class="icon" :class="item.icon"></i>
                                <span class="userNoSelect">
                                    {{ language == "zh" ? item.name : item.enName }}
                                </span>
                            </div>
                            <!-- <ul v-if="item.sublist" v-show="!item.subhidden">
                                <li v-for="sub in item.sublist" :key="sub.id">
                                    <div class="menu-item" style="margin-left: 20px ;text-align:left" @click="onClickItem(sub)">
                                        <i class="icon" :class="sub.icon"></i>
                                        <span>{{ sub.name }}</span>
                                    </div>
                                </li>
                            </ul>-->
                        </li>
                        <li v-if="!showMenulist(item)" class="p-1 userNoSelect">
                            <n-blockquote align-text
                                >请在右侧设置用户信息(租户不显示APP)</n-blockquote
                            >
                        </li>
                    </ul>
                </div>
                <div class="dog-menu-links userNoSelect">
                    <ul>
                        <li v-for="item in systemApp" :key="item.id" class="pointer">
                            <div @click="onLink(item)">
                                <span>{{ language == "zh" ? item.name : item.enName }}</span>
                            </div>
                        </li>
                        <li class="pointer">
                            <div @click="onAppLanguage()">
                                <span>{{ $t("button.languageSettings") }}</span>
                            </div>
                        </li>
                        <li class="pointer">
                            <div @click="loginOut()">
                                <span>{{ $t("button.Logout") }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { WindowsFilled } from "@vicons/antd"
    import { EmailFilled } from "@vicons/material"
    import { useDialog } from "naive-ui"
    import Window from "./Window.vue"
    import REGISTER from "../register/index.js"
    import helper from "../utils/helper.js"

    export default {
        components: {
            Window,
            WindowsFilled,
            EmailFilled
        },
        data() {
            return {
                menulist: [],
                setting: {},
                dialog: useDialog(),
                userInfo: this.$store.state.core.userInfo,
                defaultUserAvatar: "https://cdn.bestgenetics.com.cn/common/img/people.png",
                hours1: helper.formatStartTamp(new Date().getTime()),
                hours: new Date().getHours(),
                minutes:
                    new Date().getMinutes() < 10
                        ? "0" + new Date().getMinutes()
                        : new Date().getMinutes(),
                years: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                weekOld: ["日", "一", "二", "三", "四", "五", "六"],
                week: new Date().getDay(),
                timer: "hours:minutes"
            }
        },
        created() {
            // 开始菜单选项
            this.$store.state.core.applications.forEach(item => {
                let object = {}
                if (item.sublist) {
                    object.sublist = []
                    item.sublist.forEach(o => {
                        let sub = {}
                        sub.id = o.id
                        sub.name = o.name
                        sub.icon = o.icon
                        sub.fatherId = item.id
                        object.sublist.push(sub)
                    })
                    object.subhidden = true
                }
                object.id = item.id
                object.name = item.name
                object.enName = item.enName
                object.icon = item.icon
                this.menulist.push(object)
            })
            // 动态更改时间变化
            this.timer = setInterval(() => {
                this.hours = new Date().getHours()
                this.minutes =
                    new Date().getMinutes() < 10
                        ? "0" + new Date().getMinutes()
                        : new Date().getMinutes()
            }, 1000)
        },
        beforeUnmount() {
            //在vue实例销毁前，清除定时器
            if (this.timer) {
                clearInterval(this.timer)
            }
        },
        computed: {
            language: function () {
                // `this` points to the vm instance
                return this.$i18n.locale
            },
            todoListlength: function () {
                // `this` points to the vm instance
                return this.$store.state.message.toDoList.length
            },
            // 针对"应用管理"只有租户才可以看见
            showMenulist() {
                return function () {
                    return this.userInfo.type == 2 ? true : false
                }
            },
            systemApp() {
                let systemApp = JSON.parse(JSON.stringify(REGISTER.system))
                let userManageApp = []
                userManageApp.push(JSON.parse(JSON.stringify(REGISTER.userManageApp)))
                this.userInfo.type != 2 ? (systemApp = [...userManageApp, ...systemApp]) : ""
                return systemApp
            },
            apps() {
                let apps = []
                if (this.$store.state.core.tasks.length > 0) {
                    this.$store.state.core.tasks.forEach(app => {
                        if (app != null) {
                            apps.push(app)
                        }
                    })
                    return apps.sort((a, b) => {
                        return a.date - b.date
                    })
                } else {
                    return []
                }
            },
            tasklist() {
                let tasks = []
                this.$store.state.core.tasks.forEach((task, index) => {
                    if (task != null) {
                        if (index == 0 && task.min == false) {
                            task.focus = true
                        } else {
                            task.focus = false
                        }
                        tasks.push(task)
                    }
                })
                if (tasks.length > 0) {
                    tasks.sort((a, b) => {
                        return a.date - b.date
                    })
                }
                return tasks
            },
            itemWidth() {
                if (this.$store.state.core.tasks.length < 5) {
                    return 150
                } else {
                    let ww = document.body.clientWidth * 0.95
                    return Math.floor(ww / this.$store.state.core.tasks.length)
                }
            },
            showmenu() {
                return this.$store.state.core.startMenu
            }
        },
        methods: {
            onClickItem(object) {
                this.$store.dispatch("core/openApp", {
                    aid: object.id,
                    rid: this.$store.state.core.userInfo.id
                })
                this.$store.commit("core/SELECT_ICON", "")
            },
            onLink(item) {
                console.log(item)
                this.$store.dispatch("core/openSystemApp", item)
                this.$store.commit("core/SELECT_ICON", "")
            },
            onClick(id) {
                this.$store.dispatch("core/minSwitch", id)
            },
            onStart() {
                this.$store.commit("core/OPEN_START_MENU")
            },
            onSidebar() {
                this.$store.dispatch("core/sidebarSwitch")
            },
            loginOut() {
                this.dialog.warning({
                    title: this.$t("dataTable.listing.warning"),
                    content: this.$t("dataTable.listing.confirmLogOut"),
                    positiveText: this.$t("dataTable.listing.determine"),
                    negativeText: this.$t("dtables.listing.cancel"),
                    onPositiveClick: () => {
                        // 清空 notification
                        window.$notification.destroyAll()
                        // 组织参数
                        this.$store.dispatch("core/userLoginOut").then(() => {
                            this.$router.push("/")
                        })
                    }
                })
            },
            onAppLanguage() {
                let language = helper.getLocalstorage("language") || "zh-CN"
                if (language == "zh-CN") {
                    this.dialog.warning({
                        title: "change the language settings",
                        content: "the current language is chinese, whether to modify into english?",
                        positiveText: "confirm",
                        negativeText: "cancel",
                        onPositiveClick: () => {
                            this.$i18n.locale = "en"
                            this.$store.commit("core/SYSTEM_SETLANGUAGE", "en-US")
                            this.$store.commit("core/OPEN_START_MENU")
                            window.location.reload()
                            // window.$message.success("Language change successful!")
                        }
                    })
                } else {
                    this.dialog.warning({
                        title: "更改语言设置",
                        content: "当前语言为英文,是否修改为中文",
                        positiveText: "确定",
                        negativeText: "取消",
                        onPositiveClick: () => {
                            this.$i18n.locale = "zh"
                            this.$store.commit("core/SYSTEM_SETLANGUAGE", "zh-CN")
                            this.$store.commit("core/OPEN_START_MENU")
                            window.location.reload()
                            // window.$message.success("语言改变成功!")
                        }
                    })
                }
            },
            onLockScreen() {
                //this.$store.dispatch('session/lockScreen');
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../css/global.less";

    .taskbar-section {
        width: 100%;
        height: @taskHeight;
        background: rgba(0, 0, 0, 0.8);
        position: absolute;
        bottom: 3px;
        top: auto !important;
        left: 0;
        z-index: 98;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    .dog-start flex align-center p-1 pointer {
        padding-left: 0;
    }

    .tasker-window {
        padding: 5px;
        padding-right: 9px;
    }
    .tasker-window:hover {
        background-color: rgba(255, 255, 255, 0.01);
    }
    .dog-theDateOf {
        box-sizing: border-box;
        padding-right: 15px;
        .dog-theDateOf-atThe {
            padding-top: 8px;
            text-align: center;
        }
        .dog-theDateOf-time {
            line-height: 17px;
            padding-bottom: 6px;
        }
    }
    .font-weight-bolder {
        font-weight: 549;
        color: #e4e4e4;
    }
    .dog-start {
        /* min-width: 60px; */
        width: 280px;
        margin: 0 auto;
        float: left;
        height: @taskHeight;
        padding-left: 0;
        .n-icon:hover {
            color: #01b1f9 !important;
        }
    }

    .dog-tool {
        margin: 0 auto;
        float: right;
        display: flex;
        align-items: center;
        height: @taskHeight;
        user-select: none;
    }

    .dog-task-icon {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        margin-right: 10px;

        &:hover {
            cursor: pointer;
            background-color: rgba(250, 250, 250, 0.1);
        }
    }

    .itemTime {
        width: 200px;
    }
    // 底部颜色
    .taskbar-section scope {
        background-color: rgba(0, 0, 0, 0.8);
    }

    .task-list {
        /* (100% - .dog-tool -.dog-start) */
        min-width: calc(100% - 500px);
        float: left;
        overflow: hidden;
        height: @taskHeight;
        cursor: default;

        .task-item {
            float: left;
            height: @taskHeight;
            max-width: 150px;
            min-width: 20px;
            padding: 0;
            text-align: center;
            line-height: @taskHeight;
            font-size: 14px;
            // border-right: 1px solid #e9e9e9;
            cursor: pointer;
            color: #fff;
            /*background:#ccc;*/
            // color: #464c5b;
            //.Filter(saturate(0.2));

            &.actived {
                /*background:#4b8de4;*/
                /*color:#fff;*/
                color: black;
                background: #fff;
                //.Filter(saturate(1));
            }

            .icon {
                display: inline-block;
                width: 25px;
                height: 25px;
                margin-right: 5px;
                background-size: cover;
                vertical-align: top;
                position: relative;
                top: 7px;
            }
        }
    }

    .fa-magic:before {
        content: "狼";
    }

    .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .dog-menu {
        bottom: @taskHeight;
        z-index: 99;
        left: 0px;
        border: solid 1px #102a3e;
        overflow: visible;
        display: inline-block;
        min-width: 450px;
        //margin: 60px 0 0 20px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        position: fixed;
        box-shadow: inset 0 0 1px #fff;
        -moz-box-shadow: inset 0 0 1px #fff;
        -webkit-box-shadow: inset 0 0 1px #fff;
        background-color: #619bb9;
        background: -moz-linear-gradient(
            top,
            rgba(50, 123, 165, 0.75),
            rgba(46, 75, 90, 0.75) 50%,
            rgba(92, 176, 220, 0.75)
        );
        background: -webkit-gradient(
            linear,
            center top,
            center bottom,
            from(#327aa4),
            color-stop(45%, #2e4b5a),
            to(#5cb0dc)
        );
        .user {
            position: absolute;
            z-index: 10;
            right: 16%;
            top: -100px;
            transform: translateY(28%);
            display: flex;
            flex-direction: column;
            cursor: pointer;
        }
        ul {
            list-style: none;
        }

        .icon {
            display: inline-block;
            height: 18px;
            width: 18px;
            background-size: cover;
            margin-right: 5px;
        }
    }

    .dog-menu-list {
        width: 50%;
        float: left;
        background: #fff;
        border: solid 1px #365167;
        margin: 7px 0 7px 7px;
        box-shadow: 0 0 1px #fff;
        -moz-box-shadow: 0 0 1px #fff;
        -webkit-box-shadow: 0 0 1px #fff;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        max-height: 400px;
        min-height: 300px;
        overflow-y: auto;

        .appTitle {
            font-weight: bold;
            padding: 3px;
            padding-left: 10px;
            padding-bottom: 0;
            color: #464c5b;
        }

        .menu-item {
            border: solid 1px transparent;
            display: flex;
            align-items: center;
            padding: 3px;
            margin: 3px;
            color: #4b4b4b;
            text-align: left;
            text-decoration: none;
        }

        .menu-item:hover {
            border: solid 1px #7da2ce;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            box-shadow: inset 0 0 1px #fff;
            -moz-box-shadow: inset 0 0 1px #fff;
            -webkit-box-shadow: inset 0 0 1px #fff;
            background-color: #cfe3fd;
            background: -moz-linear-gradient(top, #dcebfd, #c2dcfd);
            background: -webkit-gradient(
                linear,
                center top,
                center bottom,
                from(#dcebfd),
                to(#c2dcfd)
            );
        }

        a img {
            border: 0;
            vertical-align: middle;
            margin: 0 5px 0 0;
        }
    }

    .dog-menu-links {
        width: 45%;
        max-height: 400px;
        float: right;
        margin: 5px;
        padding-top: 30px;
        position: relative;

        li.icon {
            text-align: center;
        }

        div {
            border: solid 1px transparent;
            display: block;
            margin: 5px 0;
            position: relative;
            color: #fff;
            text-decoration: none;
            min-width: 120px;
        }

        div:hover {
            border: solid 1px #000;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            box-shadow: 0 0 1px #fff;
            -moz-box-shadow: inset 0 0 1px #fff;
            -webkit-box-shadow: inset 0 0 1px #fff;
            background-color: #658da0;
            background: -moz-linear-gradient(
                center left,
                rgba(81, 115, 132, 0.55),
                rgba(121, 163, 184, 0.55) 50%,
                rgba(81, 115, 132, 0.55)
            );
            background: -webkit-gradient(
                linear,
                0% 100%,
                100% 100%,
                from(#517384),
                color-stop(50%, #79a3b8),
                to(#517384)
            );
        }

        div span {
            padding: 5px;
            display: block;
        }

        div:hover span {
            background: -moz-linear-gradient(
                center top,
                transparent,
                transparent 49%,
                rgba(2, 37, 58, 0.5) 50%,
                rgba(63, 111, 135, 0.5)
            );
            background: -webkit-gradient(
                linear,
                center top,
                center bottom,
                from(transparent),
                color-stop(49%, transparent),
                color-stop(50%, rgba(2, 37, 58, 0.5)),
                to(rgba(63, 111, 135, 0.5))
            );
        }
    }
</style>
