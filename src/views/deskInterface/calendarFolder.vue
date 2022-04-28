<template>
    <div class="position-relative w-100">
        <n-space justify="space-between" align="center" id="menu">
            <div>
                <n-space id="menu-navi" align="center">
                    <n-button
                        size="small"
                        round
                        data-action="move-today"
                        class="font-12 shadow"
                        @click="today"
                        >{{ $t("button.backToToday") }}</n-button
                    >
                    <n-button
                        size="small"
                        round
                        class="shadow"
                        data-action="move-prev"
                        @click="prev"
                    >
                        <n-icon :size="20" style="grid-area: 5 / 1 / 6 / 2">
                            <LeftIcon />
                        </n-icon>
                    </n-button>
                    <n-button
                        size="small"
                        round
                        class="shadow"
                        data-action="move-next"
                        @click="next"
                    >
                        <n-icon :size="20" style="grid-area: 5 / 1 / 6 / 2">
                            <RightIcon />
                        </n-icon>
                    </n-button>
                    <span id="renderRange" class="render-range">{{ calendarDate }}</span>
                </n-space>
            </div>
            <div class="floatingSidebar">
                <n-button
                    quaternary
                    circle
                    class="border"
                    @click="
                        () => {
                            inTheDaySidebar = !inTheDaySidebar
                            setTheDateToDo()
                        }
                    "
                >
                    <template #icon>
                        <n-icon v-if="!inTheDaySidebar">
                            <BookIcon />
                        </n-icon>
                        <n-icon v-else>
                            <CloseIcon />
                        </n-icon>
                    </template>
                </n-button>
            </div>
        </n-space>
        <div
            id="calendarBox"
            :style="{ width: '100%', height: setting.minHeight + 'px', overflow: 'hidden' }"
            ref="calendarRef"
            @mousedown.stop="$event;"
        ></div>
        <transition
            name="custom-classes-transition"
            enter-active-class="animate__animated animate__fadeIn animation-faster-plus"
            leave-active-class="animate__animated animate__fadeOut animation-faster-pro"
        >
            <div v-if="inTheDaySidebar" class="toDoEvent">
                <toDoEvent ref="toDoEventRef" :setting="setting" :nowDate="nowDate"></toDoEvent>
            </div>
        </transition>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, ref, computed } from "vue"
    import {
        ChevronLeftFilled as LeftIcon,
        ChevronRightFilled as RightIcon,
        Book20Filled as BookIcon,
        IosCloseCircle as CloseIcon
    } from "@vicons/fluent"
    import toDoEvent from "./toDoEvent.vue"

    import { useStore } from "vuex"

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
            LeftIcon,
            RightIcon,
            BookIcon,
            CloseIcon,
            toDoEvent
        },
        setup(props) {
            const store = useStore()
            let calendarRef = ref({})
            const tui = window.tui
            const dayjs = window.dayjs
            const applist = computed(() => {
                return props.setting.appList
            })
            const state = reactive({
                nowDate: dayjs().format("YYYY年MM月DD日"),
                selectBox: {},
                inTheDaySidebar: false,
                calendarDate: calendarRef.value.getDate
                    ? calendarRef.value.getDate()
                    : dayjs().format("YYYY年MM月"),
                contentStyle: {
                    padding: 0 + "px",
                    minHeight: 80 + "px",
                    display: "flex",
                    fontSize: 12 + "px",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white"
                }
            })
            // 初始化日历
            const calendarInit = () => {
                calendarRef.value = new tui.Calendar("#calendarBox", {
                    defaultView: "month",
                    taskView: false,
                    scheduleView: ["allday"],
                    useCreationPopup: false,
                    useDetailPopup: false,
                    isReadOnly: true,
                    template: {
                        monthDayname: function (dayname) {
                            return (
                                '<span class="calendar-week-dayname-name">' +
                                dayname.label +
                                "</span>"
                            )
                        }
                    },
                    // 月配置
                    month: {
                        visibleScheduleCount: 3,
                        daynames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
                        // startDayOfWeek: 1
                    }
                })

                calendarRef.value.on({
                    // 点击任务
                    clickSchedule: function (event) {
                        console.log("event: ", event)
                        store
                        window.$message.success("点击了" + event.schedule.title)
                    }
                })
                calendarRef.value.createSchedules([
                    {
                        id: "1",
                        calendarId: "1",
                        title: "测孕计划",
                        category: "time",
                        dueDateClass: "",
                        color: "white",
                        bgColor: "#00c16e",
                        start: "2022-4-6",
                        end: "2022-4-9"
                    },
                    {
                        id: "2",
                        calendarId: "2",
                        title: "上床计划",
                        category: "time",
                        color: "white",
                        bgColor: "#00a78e",
                        dueDateClass: "",
                        start: "2022-4-9",
                        end: "2022-4-12"
                    },

                    {
                        id: "3",
                        calendarId: "3",
                        title: "批次",
                        category: "time",
                        color: "white",
                        bgColor: "#279b37",
                        dueDateClass: "",
                        start: "2022-4-6",
                        end: "2022-4-16"
                    },
                    {
                        id: "4",
                        calendarId: "4",
                        title: "分娩计划",
                        category: "time",
                        color: "white",
                        bgColor: "#00a78e",
                        dueDateClass: "",
                        start: "2022-4-9",
                        end: "2022-4-13"
                    }
                ])
                // calendarRef.value.on({
                //     clickDayname: function (event) {
                //         debugger
                //         console.log('clickMore', event.date, event.target)
                //     }
                // })
            }

            // 按钮组点击
            let tapBtn = {
                next: () => {
                    calendarRef.value.next()
                    tapBtn.getCalendarAfterData()
                },
                prev: () => {
                    calendarRef.value.prev()
                    tapBtn.getCalendarAfterData()
                },
                today: () => {
                    calendarRef.value.today()
                    tapBtn.getCalendarAfterData()
                },
                getCalendarAfterData() {
                    let date = calendarRef.value.getDate()
                    state.calendarDate = dayjs(date).format("YYYY年MM月")
                }
            }

            onMounted(() => {
                calendarInit()
                state.inTheDaySidebar = true
            })
            return {
                applist,
                ...tapBtn,
                ...toRefs(state)
            }
        }
    })
</script>
<style lang="less" scoped>
    // .appFolder {
    //     .appFolderBody {
    //         position: relative;
    //         -webkit-backdrop-filter: blur(7px);
    //         backdrop-filter: blur(7px);
    //         overflow: hidden;
    //         display: flex;
    //         flex-wrap: wrap;
    //         background-color: rgba(173, 173, 173, 0.1);
    //         color: #f0f4f7;
    //         overflow-y: hidden;

    //     }
    // }
    #menu {
        padding: 7px 10px;
        width: 100%;
        background: white;
        color: black;
        .n-button {
            background: white;
        }
    }
    .floatingSidebar {
        position: relative;
    }
    .toDoEvent {
        position: absolute;
        overflow: hidden;
        border-radius: 4px;
        right: -50%;
        top: 0px;
        background: #f0f4f7;
    }
</style>
