<template>
    <n-card title="偏好设置：">
        <n-space :size="30">
            <n-card hoverable content-style="padding: 0;cursor: pointer;" v-for="(item,index) in menuList" :key='index' @click="goMeasureType(index)">
                <n-space align="center">
                    <div class="rounded-left p-2 pl-3 pr-3" :class="item.class">
                        <n-icon size="50" color="white">
                            <settingIcon />
                        </n-icon>
                    </div>
                    <div class="font-20 mr-2 ml-1">{{item.name}}</div>
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
        setup(props, { emit }) {
            const state = reactive({
                search: {
                    pigCodeLike: '',
                    selectVal: ''
                },
                menuList:[
                    {
                        id: '0',
                        class:'bg-hover-info',
                        name: '常见药及药品设置',
                        preferences: true,
                        pageUrl: 'pigMedicalTreatment/preferences/page/symptomsType'   
                    },
                    // {
                    //     id: '1',
                    //     class:'bg-warning',
                    //     name: '药品设置',
                    //     preferences: true,
                    //     pageUrl: 'pigMedicalTreatment/preferences/page/drugsType'   
                    // },
                    // {
                    //     id: '2',
                    //     class:'bg-light-red',
                    //     name: '药品设置',
                    //     preferences: true,
                    //     pageUrl: 'pigMedicalTreatment/preferences/page/drugsType'   
                    // }
                ]
            })
            return {
                ...toRefs(state),
                goMeasureType(index) {
                    emit('gopage', state.menuList[index])
                }
            }
        }
    })
</script>

<style lang="">
</style>