<template>
    <!-- <transition name="slide"> -->
    <transition
        name="custom-classes-transition"
        enter-active-class="animate__animated animate__fadeInRight animation-faster-plus"
        leave-active-class="animate__animated animate__fadeOutRight animation-faster-pro"
    >
        <div class="sidebar" v-show="sidebarShow">
            <!-- 通知 -->
            <n-scrollbar class="scrollbarBox">
                <n-space vertical class="sidebar-body" :size="20">
                    <!-- 日程及时间 -->
                    <!-- <div class="scheduleTime">
                        <n-card class="theScheduleOf" content-style="padding: 10;">
                            <h4>星期{{ weekArray[week] }}</h4>
                            <div class="num">{{ day }}</div>
                            <div class="thereIsNoSchedule">今日无其他日程</div>
                        </n-card>
                    </div>-->
                    <n-card
                        v-for="(item, index) in toDoMessagesList"
                        :key="item"
                        class="useYourTime"
                        content-style="padding: 5;position: relative;"
                        bordered
                        hoverable
                        @mouseenter.stop="hoverItem = toDoMessagesList[index]"
                        @click="goToPage(toDoMessagesList[index])"
                    >
                        <n-space vertical>
                            <n-space
                                align="center"
                                justify="space-between"
                                style="position: relative"
                            >
                                <n-space align="center">
                                    <n-space align="center">
                                        <n-icon-wrapper
                                            :size="24"
                                            :border-radius="50"
                                            color="#4251bb"
                                        >
                                            <n-icon size="20" color="#f9fafd">
                                                <HourglassIcon />
                                            </n-icon>
                                        </n-icon-wrapper>
                                        <span>{{ item.notificationtitle || "暂无" }}</span>
                                    </n-space>
                                    <!-- 选项 -->
                                    <div class="todoOptions">
                                        <n-popselect
                                            v-model:value="popselectVal"
                                            :options="todoOptions"
                                            size="small"
                                            @update:value="popselectChange"
                                        >
                                            <n-button strong secondary type="tertiary" size="tiny">
                                                <n-space align="center" :size="30">
                                                    <div>{{ "选项" }}</div>
                                                    <div>
                                                        <n-icon :size="15">
                                                            <ArrowBottomIcon />
                                                        </n-icon>
                                                    </div>
                                                </n-space>
                                            </n-button>
                                        </n-popselect>
                                    </div>
                                </n-space>
                                <div></div>
                            </n-space>
                            <div class="canCheck">{{ item.msgtitle || "暂无" }}</div>
                            <div style="position: relative">{{ item.msgcontent || "暂无" }}</div>
                        </n-space>
                    </n-card>
                    <n-card v-if="toDoMessagesList.length == 0" style="border-radius: 20px">
                        <n-empty description="暂无消息通知">
                            <template #extra>
                                <n-button size="small" @click="closeSidebarSwitch">
                                    看看别的
                                </n-button>
                            </template>
                        </n-empty>
                    </n-card>
                </n-space>
            </n-scrollbar>
        </div>
    </transition>
</template>

<script>
    import { HourglassOutline as HourglassIcon } from "@vicons/ionicons5"
    import { KeyboardArrowDownRound as ArrowBottomIcon } from "@vicons/material"

    export default {
        name: "IconGroup",
        components: {
            HourglassIcon,
            ArrowBottomIcon
        },
        model: {
            prop: "sidebarShow",
            event: "onShow"
        },
        props: {
            sidebarShow: { type: Boolean, default: false }
        },
        data() {
            return {
                tag: 2,
                weekArray: ["日", "一", "二", "三", "四", "五", "六"],
                day: new Date().getDate(),
                week: new Date().getDay(),
                // 移入时的消息ID
                hoverItem: "",
                popselectVal: "",
                todoOptions: [
                    {
                        label: "跳转消息中心",
                        value: "1"
                    },
                    {
                        label: "标记为已读",
                        value: "2"
                    }
                ]
            }
        },
        computed: {
            toDoMessagesList() {
                let todoList = []
                this.$store.state.message.toDoList.forEach(element => {
                    todoList.push(element)
                })
                return todoList
            }
        },
        methods: {
            onCleanMessage() {
                this.$store.dispatch("message/cleanMessage")
            },
            closeSidebarSwitch() {
                this.$store.dispatch("core/sidebarSwitch", false)
            },
            goToPage(messageItem) {
                if (!messageItem.route) {
                    return false
                }
                // 标记为已读
                this.$store.dispatch("message/BulkModifyTheMessage", [messageItem.id]).then(() => {
                    // 跳转app
                    this.$store.dispatch("core/openApp", {
                        aid: messageItem.route,
                        rid: this.$store.state.core.userInfo.id
                    })
                })
            },
            popselectChange(val) {
                switch (val) {
                    case "1":
                        // 跳转个人消息中心
                        this.$store.dispatch("core/display", {
                            name: "个人信息",
                            id: "system_003",
                            page: "sys/userInfo/userInfo",
                            icon: "personalInformationIcon",
                            type: "default",
                            action: "core/display"
                        })
                        this.$store.dispatch("core/sidebarSwitch", false)
                        break
                    case "2":
                        window.$dialog.warning({
                            title: "警告",
                            content: "确定要将该条消息修改为已读么？已读消息只能在个人中心查看！",
                            positiveText: "确定",
                            negativeText: "取消",
                            onPositiveClick: () => {
                                // 标记为已读
                                this.$store
                                    .dispatch("message/BulkModifyTheMessage", [this.hoverItem.id])
                                    .then(() => {
                                        this.$store.dispatch("message/GetUserMessage", "2")
                                    })
                            }
                        })
                        break

                    default:
                        break
                }
                this.popselectVal = ""
            }
        },

        setup() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    @import "../css/global.less";

    .sidebar {
        position: absolute;
        right: 0;
        top: 0px;
        height: calc(100%);
        // height: 100%;
        width: 350px;
        // background-color: rgba(19, 99, 21, 1);
        //   -webkit-backdrop-filter: blur(7px);
        // backdrop-filter: blur(7px);
        padding-bottom: @taskHeight;
        z-index: 90;
        :deep .scrollbarBox {
            // height: calc(100% - @timeBox - @taskHeight);
            max-height: 100%;
        }
    }

    .n-card.n-card--bordered {
        border: 1px solid #150f0c;
    }
    // 待办盒子
    .useYourTime {
        background-color: rgb(212, 212, 212);
        max-width: 300px;
        border-radius: 20px;
        cursor: pointer;
        .theLength {
            display: flex;
            justify-content: space-between;
        }
        .canCheck {
            font-weight: bolder;
        }
        .n-button {
            background: #a7a7a7;
            color: #150f0c;
        }
        .todoOptions {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0%, -50%);
        }
    }
    // 日程及时间
    .scheduleTime {
        display: flex;
        justify-content: space-between;
        .theScheduleOf {
            border-radius: 20px;
            margin-right: 20px;
            h4 {
                font-size: 12px;
                color: #ff3837;
            }
            .num {
                margin-top: -15px;
                font-size: 37px;
            }
            .thereIsNoSchedule {
                font-size: 12px;
                margin-right: -20px;
            }
        }
        .theWeather {
            max-height: 150px;
            border-radius: 20px;
            padding: 0px;
            background-image: linear-gradient(#008db8, #56aaca);
            h3 {
                color: #e7f3f7;
                font-weight: 100;
            }
            .num {
                color: #e7f3f7;
                margin-top: -14px;
                margin-left: -6px;
                margin-bottom: -6px;
                font-size: 37px;
            }
            .theTemperatureOne {
                color: #e7f3f7;
                margin-top: -7px;
            }
            .theTemperatureTwo {
                color: #e7f3f7;
                margin-top: -5px;
            }
        }
    }
    .sidebar-body {
        padding: 10px 20px;
    }
    .sidebar-body-calendar {
        margin: 15px 0;
    }

    .sidebar-body-calendar .sidebar-body-calendar-date {
        padding: 0 33px;
        color: #585858;
    }

    .sidebar-body-calendar-date.normal-date {
        font-size: 30px;
    }

    .sidebar-body-calendar-date.lunar-date {
    }

    .address-item {
        border: solid 1px transparent;
        display: block;
        padding: 5px;
        margin: 5px;
        color: #4b4b4b;
        background-color: #f9f9f9;
        border-radius: 3px;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        text-align: left;
        text-decoration: none;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
    }

    .address-item-cell {
        padding: 0rem 15px 0px 15px;
    }

    .address-item:hover {
        border: solid 1px #7da2ce;
        box-shadow: inset 0 0 1px #fff;
        -moz-box-shadow: inset 0 0 1px #fff;
        -webkit-box-shadow: inset 0 0 1px #fff;
        background-color: #cfe3fd;
        background: -moz-linear-gradient(top, #dcebfd, #c2dcfd);
        background: -webkit-gradient(linear, center top, center bottom, from(#dcebfd), to(#c2dcfd));
    }

    .message-item {
        margin: 10px auto;
        background-color: snow;
        text-decoration: none;
        font-size: 12px;
        font-family: Arial;
        line-height: 18px;
        padding: 5px 12px 5px 12px;
        border-radius: 6px;
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);

        .title {
            font-weight: bold;
            padding: 3px;
            text-align: left;
        }

        .text {
            padding: 5px 0px;
            left: 10px;
            word-wrap: break-word;
            text-align: left;
        }

        .close {
            color: black;
            border-radius: 6px;
            line-height: 10px;
            text-align: center;
            height: 10px;
            width: 10px;
            font-size: 9px;
            padding: 1px;
            right: 15px;
            position: absolute;
        }

        /* use cross as close button */
        .close::before {
            content: "\2716";
        }

        .close:hover {
            cursor: pointer;
        }
    }
    .animation-faster-plus {
        --animate-duration: 0.5s;
    }
    .animation-faster-pro {
        --animate-duration: 0.2s;
    }
    // .slide-enter-active {
    //     transition: all 0.5s;
    // }

    // .slide-leave-active {
    //     transition: all 0.5s;
    // }

    // .slide-enter,
    // .slide-leave-to {
    //     transform: translateX(300px);
    // }
</style>
