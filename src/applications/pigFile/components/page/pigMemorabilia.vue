<template>
    <div class="pigMemorabilia">
        <n-space vertical :size="20">
            <n-card content-style="padding-top: 20px;" :title="$t('dataTable.listing.memorabilia')">
                <n-spin :show="showLoading">
                    <n-scrollbar style="max-height: 500px">
                        <n-steps
                            vertical
                            :current="memorabilia.length"
                            :status="currentStatus"
                            :size="small"
                        >
                            <n-step
                                v-for="(item, index) in memorabilia"
                                :key="index"
                                :title="item.model"
                                :description="item.createDatetime"
                                :class="item.isSelect ? 'hoverCss' : ''"
                                @mouseenter="memorabilia[index].isSelect = true"
                                @mouseleave="memorabilia[index].isSelect = false"
                                @click="goTabPage(item)"
                            />
                        </n-steps>
                    </n-scrollbar>
                </n-spin>
            </n-card>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, inject } from "vue"
    // import { useI18n } from "vue-i18n"

    import {
        // 大事纪
        getMemorabiliaApi
    } from "@/api/pigFile.js"

    export default defineComponent({
        name: "pigOverview",
        props: {
            pigDetail: Object
        },
        setup(props) {
            // const { t } = useI18n()

            const state = reactive({
                search: {
                    pigCodeLike: ""
                },
                currentStatus: "process",
                showLoading: true,
                //     初生: 'birth',
                //     保育: 'welfare',
                //     育肥: 'fatten',
                //     后备: 'backups',
                //     种猪: 'breedingPig',
                //     待售: 'forSale',
                //     已死亡: 'dead'

                liveOrder: [],
                overview: [],
                bloodList: [],
                breedingList: [],
                memorabilia: []
            })
            // 大事纪
            const getMemorabilia = async id => {
                await getMemorabiliaApi({ pigCode: id }).then(res => {
                    if (res.code == 0) {
                        state.showLoading = false
                        state.memorabilia = res.data
                    }
                })
            }
            const changeMemorabilia = inject("changeMemorabilia")
            // 去往tab页面
            const goTabPage = item => {
                window.$dialog.warning({
                    title: "警告",
                    content: "确定跳转对应页签么？",
                    positiveText: "确定",
                    negativeText: "取消",
                    onPositiveClick: () => {
                        changeMemorabilia(item)
                    }
                })
            }
            onMounted(() => {
                // 获取大事纪
                getMemorabilia(props.pigDetail.pigCode)
            })
            return {
                ...toRefs(state),
                goTabPage
            }
        }
    })
</script>
<style lang="less" scoped>
    .pigMemorabilia {
        padding-top: 10px;
        .n-steps {
            padding: 10px;
            cursor: pointer;
            :deep .n-step-content .n-step-content-header {
                color: #515a6e;
            }
            :deep .n-step-content__description {
                color: #808695;
            }
            &:last-of-type {
                :deep .n-step-content .n-step-content-header {
                    color: #17233d;
                }
                :deep .n-step-content__description {
                    color: #17233d;
                }
            }
        }
        .hoverCss {
            :deep .n-step-content .n-step-content-header {
                color: #19be6b !important;
            }
            :deep .n-step-content__description {
                color: #19be6b !important;
            }
        }
    }
</style>
