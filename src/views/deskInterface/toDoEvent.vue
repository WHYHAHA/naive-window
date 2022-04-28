<template >
    <div class="appFolder">
        <!-- {{setting}} -->
        <n-space vertical :size="0">
            <!-- 头部heard -->
            <n-space justify="space-between" align="center" class="appFolderheard">
                <div class="flex align-center">
                    <div class="font-14">待办一览</div>
                </div>
                <div>{{nowDate}}</div>
            </n-space>
            <!-- 主体 -->
            <div class="appFolderBody" :style="{minHeight:setting.height-5 +'px'}">
                <n-card content-style="padding: 10px;">
                    <n-collapse accordion default-expanded-names="1">
                        <template #header-extra>
                            <n-icon :size="20">
                                <TimeIcon />
                            </n-icon>
                        </template>
                        <n-collapse-item title="17日待办" name="1">
                            <n-space vertical>
                                <n-text code>01-11 21:30 至 01-13 01:30</n-text>
                                <n-text strong>四号任务</n-text>
                                <n-text
                                    type="info"
                                    class="font-12"
                                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo at temporibus molestiae vero ad voluptatem, aliquid nam officiis atque ea facilis sunt nobis repellat fugit fugiat tempora dolorum qui! Quisquam?</n-text>
                                <n-space justify="end">
                                    <n-button type="success" size="tiny">跳转APP处理</n-button>
                                </n-space>
                            </n-space>
                        </n-collapse-item>
                        <n-collapse-item title="20日待办" name="2">
                            <n-space vertical>
                                <n-text code>01-11 21:30 至 01-13 01:30</n-text>
                                <n-text strong>二号任务</n-text>
                                <n-text
                                    type="info"
                                    class="font-12"
                                >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor unde provident sapiente tenetur velit consequatur necessitatibus quod est doloribus temporibus odio, exercitationem, corporis possimus ipsam rerum blanditiis iure illum autem.</n-text>
                                <n-space justify="end">
                                    <n-button type="success" size="tiny">跳转APP处理</n-button>
                                </n-space>
                            </n-space>
                        </n-collapse-item>
                        <n-collapse-item title="21日待办" name="3">
                            <n-space vertical>
                                <n-text code>01-11 21:30 至 01-13 01:30</n-text>
                                <n-text strong>七号任务</n-text>
                                <n-text
                                    type="info"
                                    class="font-12"
                                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, animi quisquam temporibus nostrum esse aliquam aliquid quas amet repudiandae officiis vitae doloremque vero. Unde, explicabo nemo qui dolor cupiditate ipsa.</n-text>
                                <n-space justify="end">
                                    <n-button type="success" size="tiny">跳转APP处理</n-button>
                                </n-space>
                            </n-space>
                        </n-collapse-item>
                    </n-collapse>
                </n-card>
            </div>
        </n-space>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted } from 'vue'

    import { AccessTimeOutlined as TimeIcon } from '@vicons/material'
    import { useStore } from 'vuex'

    export default defineComponent({
        props: {
            setting: {
                // 所有设置选项和基本信息
                type: Object,
                default() {
                    return {}
                }
            },
            nowDate: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        components: {
            TimeIcon
        },
        setup(props) {
            const store = useStore()

            const state = reactive({})
            const selectTheDateToDo = data => {
                console.log('data: ', data)
            }

            onMounted(() => {
                store
                props
            })
            return {
                selectTheDateToDo,
                ...toRefs(state)
            }
        }
    })
</script>
<style lang="less" scoped>
    .appFolder {
        border-radius: 8px 8px 0 0;
        color: black;
        width: 300px;
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
            padding: 10px 10px;
            position: relative;
            overflow: hidden;
            background-color: white;
            color: black;
            overflow-y: hidden;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
        }
    }
</style>