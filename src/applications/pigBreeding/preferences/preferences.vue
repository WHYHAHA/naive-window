<template>
    <n-card title="偏好设置：">
        <n-space :size="30">
            <n-card hoverable content-style="padding: 0;">
                <n-space align="center">
                    <div class="bg-hover-info rounded-left p-2 pl-3 pr-3">
                        <n-icon size="50" color="white">
                            <settingIcon />
                        </n-icon>
                    </div>
                    <div class="font-20 mr-2 ml-1">配种匹配算法配置</div>
                </n-space>
            </n-card>
        </n-space>
    </n-card>
</template>
<script>
    import { defineComponent, reactive, toRefs } from 'vue'
    import { SettingFilled as settingIcon } from '@vicons/antd'

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            settingIcon
        },
        setup() {
            const state = reactive({
                search: {
                    pigCodeLike: '',
                    selectVal: ''
                }
            })
            return {
                ...toRefs(state),
                options: [
                    {
                        label: "Everybody's Got Something to Hide Except Me and My Monkey",
                        value: 'song0',
                        disabled: true
                    },
                    {
                        label: 'Drive My Car',
                        value: 'song1'
                    },
                    {
                        label: 'Norwegian Wood',
                        value: 'song2'
                    },
                    {
                        label: "You Won't See",
                        value: 'song3',
                        disabled: true
                    },
                    {
                        label: 'Nowhere Man',
                        value: 'song4'
                    },
                    {
                        label: 'Think For Yourself',
                        value: 'song5'
                    },
                    {
                        label: 'The Word',
                        value: 'song6'
                    },
                    {
                        label: 'Michelle',
                        value: 'song7',
                        disabled: true
                    },
                    {
                        label: 'What goes on',
                        value: 'song8'
                    },
                    {
                        label: 'Girl',
                        value: 'song9'
                    },
                    {
                        label: "I'm looking through you",
                        value: 'song10'
                    },
                    {
                        label: 'In My Life',
                        value: 'song11'
                    },
                    {
                        label: 'Wait',
                        value: 'song12'
                    }
                ],
                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index != 2) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl
                        }
                        this.$emit('gopage', data)
                    } else {
                        window.$message.warning('您已在当前页面！')
                    }
                }
            }
        }
    })
</script>

<style lang="">
</style>