<template>
    <n-card title="偏好设置：">
        <n-grid :x-gap="12" :y-gap="20" :cols="4">
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goDormManage">
                    <n-space align="center">
                        <div class="bg-hover-info rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <AppSwitcherIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">场区栋舍</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goToOrganization">
                    <n-space align="center">
                        <div class="bg-warning rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <OrganizationIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">组织</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goToUserJob">
                    <n-space align="center">
                        <div class="bg-light-red rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <BlackTieIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">职位角色</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goToUsers">
                    <n-space align="center">
                        <div class="bg-success rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <PeopleCommunityIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">账号</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goDictionariesManage">
                    <n-space align="center">
                        <div class="bg-dictionarie rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <DictionariesIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">字典管理</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="goToLog">
                    <n-space align="center">
                        <div class="bg-primary rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <BookIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">系统日志</div>
                    </n-space>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card hoverable content-style="padding: 0;cursor: pointer;" @click="govarietiesOfStrain">
                    <n-space align="center">
                        <div class="bg-primary rounded-left p-2 pl-3 pr-3">
                            <n-icon size="50" color="white">
                                <ProductHuntIcon />
                            </n-icon>
                        </div>
                        <div class="font-20 mr-2 ml-1">品种品系</div>
                    </n-space>
                </n-card>
            </n-grid-item>
        </n-grid>
    </n-card>
</template>
<script>
    import { defineComponent, reactive, toRefs } from "vue"
    import { AppSwitcher as AppSwitcherIcon } from "@vicons/carbon"
    import {
        Organization16Regular as OrganizationIcon,
        PeopleCommunity20Filled as PeopleCommunityIcon,
        BookLetter24Filled as DictionariesIcon,
    } from "@vicons/fluent"
    import { BlackTie as BlackTieIcon, Book as BookIcon } from "@vicons/fa"
    import { ProductHunt as ProductHuntIcon } from "@vicons/fa"

    export default defineComponent({
        props: {
            pageData: Object,
        },
        components: {
            AppSwitcherIcon,
            OrganizationIcon,
            BlackTieIcon,
            PeopleCommunityIcon,
            DictionariesIcon,
            BookIcon,
            ProductHuntIcon,
        },
        setup(props, { emit }) {
            const state = reactive({
                search: {
                    pigCodeLike: "",
                    selectVal: "",
                },
            })
            return {
                ...toRefs(state),
                goDormManage() {
                    const data = {
                        id: "",
                        name: "场区栋舍",
                        preferences: true,
                        pageUrl: "sys/dormManage/list",
                    }
                    emit("gopage", data)
                },
                goToOrganization() {
                    const data = {
                        id: "",
                        name: "组织",
                        preferences: true,
                        pageUrl: "sys/userManage/department/list",
                    }
                    emit("gopage", data)
                },
                goToUsers() {
                    const data = {
                        id: "",
                        name: "账号列表",
                        preferences: true,
                        pageUrl: "sys/userManage/user/list",
                    }
                    emit("gopage", data)
                },

                goToUserJob() {
                    const data = {
                        id: "",
                        name: "职位角色",
                        preferences: true,
                        pageUrl: "sys/userManage/job/list",
                    }
                    emit("gopage", data)
                },
                goDictionariesManage() {
                    const data = {
                        id: "",
                        name: "字典管理",
                        preferences: true,
                        pageUrl: "sys/dictionariesManage/list",
                    }
                    emit("gopage", data)
                },
                goToLog() {
                    const data = {
                        id: "",
                        name: "系统日志",
                        preferences: true,
                        pageUrl: "sys/sysLog/log",
                    }
                    emit("gopage", data)
                },
                govarietiesOfStrain() {
                    const data = {
                        id: "",
                        name: "品种品系",
                        preferences: true,
                        pageUrl: "sys/varietiesOfStrain/varietiesOfStrain",
                    }
                    emit("gopage", data)
                },
            }
        },
    })
</script>

<style lang="">
</style>