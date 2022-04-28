<template>
    <n-spin :show="loading">
        <n-card :title="cardTitle">
            <n-space vertical v-if="pigDetail.pigCode">
                <n-descriptions label-placement="top" :column="2">
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('nowFarmid')" :label="$t('dataTable.listing.Farm')">{{timeCycle()['nowFarmid'] || '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('nowDormCode')" :label="$t('dataTable.listing.Dorm')">{{timeCycle()['nowDormCode']|| '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('nowColumnCode')" :label="$t('dataTable.listing.column')">{{timeCycle()['nowColumnCode']|| '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('gender')" :label="$t('dataTable.listing.gender')">{{timeCycle()['gender']}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('pigBornDate')" :label="$t('dataTable.listing.dateOfBirth')">{{timeCycle()['pigBornDate']|| '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('dueDate')" :label="$t('dataTable.listing.dueDate')">{{timeCycle()['dueDate']|| '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('matherBatch')" :label="$t('dataTable.listing.breedingBatch')">{{timeCycle()['batchNumber']|| '暂无'}}</n-descriptions-item>
                    <n-descriptions-item :label-style="labelStyle" v-if="displayData('littlePigBatch')" :label="$t('dataTable.listing.productionBatch')">{{timeCycle()['productionBatch']|| '暂无'}}</n-descriptions-item>

                    <!-- 生长状态 -->
                    <n-descriptions-item :label-style="labelStyle" :label="$t('dtables.listing.theGrowthState')">{{timeCycle()['pigStatus']|| '暂无'}}</n-descriptions-item>
                    <!-- 育种状态 -->
                    <n-descriptions-item :label-style="labelStyle" :label="$t('dataTable.listing.breedingStatus')">{{timeCycle()['breedingStatus']|| '暂无'}}</n-descriptions-item>
                    <!-- 在场状态 -->
                    <n-descriptions-item :label-style="labelStyle" :label="$t('dataTable.listing.thePresentState')">{{timeCycle()['pigKeepStatusName']|| '暂无'}}</n-descriptions-item>
                    <!-- 胎次 -->
                    <n-descriptions-item :label-style="labelStyle" label="胎次">{{timeCycle()['breedingBatch']|| '暂无'}}</n-descriptions-item>
                </n-descriptions>
            </n-space>
            <n-empty :description="$t('dataTable.listing.pleaseClickOnTheLeftSideOfTheSearch,CheckTheDetails')" v-else></n-empty>
        </n-card>
    </n-spin>
</template>


<script>
    import { defineComponent, computed } from "vue"
    import helper from "@/utils/helper.js"
    import { useI18n } from "vue-i18n"
    export default defineComponent({
        props: {
            pigDetail: {
                // 数据源
                type: Object,
                default() {
                    return {}
                },
            },
            loading: {
                // loading
                type: Boolean,
                default: false,
            },
            cardTitle: {
                // card title名称
                type: String,
                default: "",
            },
            displayOptions: {
                // 所有需要显示的字段
                type: Array,
                default() {
                    return []
                },
            },
        },
        setup(props) {
            const { t } = useI18n()
            // 当前时间端
            const timeCycle = computed(() => {
                return function () {
                    let newPigDetail = JSON.parse(JSON.stringify(props.pigDetail))
                    for (const key in newPigDetail) {
                        if (key.indexOf("Date") != -1) {
                            newPigDetail[key] = helper.timestampToTime(newPigDetail[key])
                        }
                    }
                    return newPigDetail
                }
            })
            const displayData = computed(() => {
                return function (key) {
                    return props.displayOptions.indexOf(key) != -1 ? true : false
                }
            })

            return {
                timeCycle,
                displayData,
                labelStyle: {
                    color: "#969595",
                },
            }
        },
    })
</script>
