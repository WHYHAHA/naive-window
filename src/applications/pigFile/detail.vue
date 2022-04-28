<template>
    <div class="pageFileDetail">
        <n-space vertical :size="20">
            <n-card>
                <n-breadcrumb>
                    <n-breadcrumb-item
                        v-for="(item, index) in pageData.breadcrumbList"
                        :key="index"
                        @click="goFatherPage(index, item)"
                        >{{ item.name }}</n-breadcrumb-item
                    >
                </n-breadcrumb>
            </n-card>

            <n-card hoverable>
                <div class="flex align-center">
                    <div>
                        <n-image width="320" :src="pigDetailImg" style="border-radius: 10px" />
                    </div>
                    <div class="flex-1 ml-2">
                        <n-descriptions
                            label-placement="left"
                            label-style="font-weight-bolder text-body"
                            column="4"
                        >
                            <n-descriptions-item :label="$t('dataTable.listing.pigCode')">
                                {{ detail.pigCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.earTagCode')">
                                {{ detail.earTagCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.earBrandCode')">
                                {{ detail.earBrandCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.Farm')">
                                {{ detail.farmid || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.Dorm')">
                                {{ detail.dormCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.column')">
                                {{ detail.columnCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.gender')">
                                {{ genderStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.dateOfBirth')">
                                {{ detail.pigBornDate || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.species')">
                                {{ pigSourcesStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.fatherId')">
                                {{ detail.pigFatherCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.motherId')">
                                {{ detail.pigMotherCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.hybridGeneration')">
                                {{ pigTypeStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.pigStatus')">
                                {{ pigStatusStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.breedingValue')">
                                {{ detail.breedingValue || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.noseColor')">
                                {{ noseColorStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.batchNumber')">
                                {{ detail.batchNumber || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.nestNumber')">
                                {{ detail.nestNumber || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.breedingLevel')">
                                {{ breedingLevelStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dataTable.listing.pigKeepStatus')">
                                {{ pigKeepStatusStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>

                            <n-descriptions-item :label="$t('dtables.listing.leaveReason')">
                                {{ detail.rollOutType || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                            <n-descriptions-item :label="$t('dtables.listing.departureTime')">
                                {{ detail.departureTime || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>

                            <n-descriptions-item :label="$t('dataTable.listing.rasse')">
                                {{ detail.pigForefathersCode || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>

                            <n-descriptions-item
                                v-if="genderStr == '母'"
                                :label="$t('dataTable.listing.breedingStatus')"
                            >
                                {{ breedingStatusStr || $t("dataTable.listing.notYet") }}
                            </n-descriptions-item>
                        </n-descriptions>
                    </div>
                </div>
            </n-card>
            <!-- 公猪 -->
            <div class="bg-white" v-if="genderStr == '公' || genderStr == 'sow'">
                <n-tabs
                    v-model:value="tabsValue"
                    :tab-style="tabStyle"
                    :bar-width="28"
                    :pane-style="paneStyle"
                    size="large"
                >
                    <n-tab-pane name="概览" :tab="$t('dataTable.listing.overview')">
                        <pigOverView :pigDetail="pageData"></pigOverView>
                    </n-tab-pane>
                    <n-tab-pane name="大事纪" :tab="$t('dataTable.listing.memorabilia')">
                        <pigMemorabilia :pigDetail="pageData"></pigMemorabilia>
                    </n-tab-pane>
                    <n-tab-pane name="转入记录" :tab="$t('dataTable.listing.pigTransferinRecords')">
                        <pigRollIn :pigDetail="pageData"></pigRollIn>
                    </n-tab-pane>
                    <n-tab-pane
                        name="转出记录"
                        :tab="$t('dataTable.listing.pigTransferoutRecords')"
                    >
                        <pigRollOut :pigDetail="pageData"></pigRollOut>
                    </n-tab-pane>
                    <n-tab-pane name="疫苗记录" :tab="$t('dataTable.listing.vaccineRecord')">
                        <pigVaccine :pigDetail="pageData"></pigVaccine>
                    </n-tab-pane>
                    <n-tab-pane name="医疗记录" :tab="$t('dataTable.listing.medicalRecord')">
                        <pigMedicalTreatment :pigDetail="pageData"></pigMedicalTreatment>
                    </n-tab-pane>
                    <n-tab-pane name="群体保健" :tab="$t('dataTable.listing.pigHealthCareRecords')">
                        <pigHealthCare :pigDetail="pageData"></pigHealthCare>
                    </n-tab-pane>
                </n-tabs>
            </div>
            <n-divider dashed class="text-light-muted font-16">
                {{ $t("account.settings.menuScroll") }}
            </n-divider>
            <div class="bg-white" v-if="genderStr == '母' || genderStr == 'boar'">
                <n-tabs
                    :tab-style="tabStyle"
                    :bar-width="28"
                    :pane-style="paneStyle"
                    size="large"
                    v-model:value="tabsValue"
                >
                    <n-tab-pane name="概览" :tab="$t('dataTable.listing.overview')">
                        <pigOverView :pigDetail="pageData"></pigOverView>
                    </n-tab-pane>
                    <n-tab-pane name="大事纪" :tab="$t('dataTable.listing.memorabilia')">
                        <pigMemorabilia :pigDetail="pageData"></pigMemorabilia>
                    </n-tab-pane>

                    <n-tab-pane name="查情记录" :tab="$t('dataTable.listing.pigOestrusRecords')">
                        <pigLoveTime :pigDetail="pageData"></pigLoveTime>
                    </n-tab-pane>
                    <n-tab-pane
                        name="配种记录"
                        :tab="$t('dataTable.listing.pigHybridizationRecords')"
                    >
                        <pigBreeding :pigDetail="pageData"></pigBreeding>
                    </n-tab-pane>
                    <n-tab-pane name="测孕记录" :tab="$t('dataTable.listing.pregnancyTestRecord')">
                        <pigPregnancy :pigDetail="pageData"></pigPregnancy>
                    </n-tab-pane>
                    <n-tab-pane name="上床记录" :tab="$t('dataTable.listing.goToBedRecords')">
                        <pigGoToBed :pigDetail="pageData"></pigGoToBed>
                    </n-tab-pane>
                    <n-tab-pane name="分娩记录" :tab="$t('dataTable.listing.reproductionRecords')">
                        <pigChildbirth :pigDetail="pageData"></pigChildbirth>
                    </n-tab-pane>
                    <n-tab-pane name="下床记录" :tab="$t('dataTable.listing.outOfBedRecords')">
                        <pigOutOfBed :pigDetail="pageData"></pigOutOfBed>
                    </n-tab-pane>

                    <n-tab-pane name="代奶记录" :tab="$t('dataTable.listing.pigFormulaRecords')">
                        <pigFormula :pigDetail="pageData"></pigFormula>
                    </n-tab-pane>
                    <n-tab-pane name="流产记录" :tab="$t('dataTable.listing.pigAbortionRecords')">
                        <pigAbortion :pigDetail="pageData"></pigAbortion>
                    </n-tab-pane>
                    <n-tab-pane name="转入记录" :tab="$t('dataTable.listing.pigTransferinRecords')">
                        <pigRollIn :pigDetail="pageData"></pigRollIn>
                    </n-tab-pane>
                    <n-tab-pane
                        name="转出记录"
                        :tab="$t('dataTable.listing.pigTransferoutRecords')"
                    >
                        <pigRollOut :pigDetail="pageData"></pigRollOut>
                    </n-tab-pane>
                    <n-tab-pane name="疫苗记录" :tab="$t('dataTable.listing.vaccineRecord')">
                        <pigVaccine :pigDetail="pageData"></pigVaccine>
                    </n-tab-pane>
                    <n-tab-pane name="医疗记录" :tab="$t('dataTable.listing.medicalRecord')">
                        <pigMedicalTreatment :pigDetail="pageData"></pigMedicalTreatment>
                    </n-tab-pane>
                    <n-tab-pane name="群体保健" :tab="$t('dataTable.listing.pigHealthCareRecords')">
                        <pigHealthCare :pigDetail="pageData"></pigHealthCare>
                    </n-tab-pane>
                </n-tabs>
            </div>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, computed, provide, ref } from "vue"

    import { getPigFileDetailApi } from "@/api/pigFile.js"
    import { useStore } from "vuex"
    // import { useI18n } from 'vue-i18n'
    // 概览
    import pigOverView from "./components/page/pigOverView.vue"
    //大事记
    import pigMemorabilia from "./components/page/pigMemorabilia.vue"
    // 查情
    import pigLoveTime from "./components/page/pigLoveTime.vue"
    // 测孕
    import pigPregnancy from "./components/page/pigPregnancy.vue"
    // 配种
    import pigBreeding from "./components/page/pigBreeding.vue"
    // 上床
    import pigGoToBed from "./components/page/pigGoToBed.vue"
    // 下床
    import pigOutOfBed from "./components/page/pigOutOfBed.vue"
    // 分娩
    import pigChildbirth from "./components/page/pigChildbirth.vue"
    // 代奶
    import pigFormula from "./components/page/pigFormula.vue"
    // 流产
    import pigAbortion from "./components/page/pigAbortion.vue"
    // 转入
    import pigRollIn from "./components/page/pigRollIn.vue"
    // 转出
    import pigRollOut from "./components/page/pigRollOut.vue"
    // 疫苗
    import pigVaccine from "./components/page/pigVaccine.vue"
    // 医疗
    import pigMedicalTreatment from "./components/page/pigMedicalTreatment.vue"
    // 群体保健
    import pigHealthCare from "./components/page/pigHealthCare.vue"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            pigOverView,
            pigLoveTime,
            pigBreeding,
            pigGoToBed,
            pigOutOfBed,
            pigChildbirth,
            pigFormula,
            pigPregnancy,
            pigAbortion,
            pigRollIn,
            pigRollOut,
            pigVaccine,
            pigMedicalTreatment,
            pigHealthCare,
            pigMemorabilia
        },
        setup(props) {
            const store = useStore()
            const state = reactive({
                search: {
                    page: 1,
                    limit: 10,
                    total: 1
                },
                detail: {},
                // 检测数据
                measureList: {},
                measureTabVal: "出生检测",
                tabPaneList: [],
                tabsValue: "概览",
                tabData: [],
                leftClickIndex: -1,
                pigDictionaries: {},
                breedingDetail: {},
                overview: {},
                pigHybridizationDetail: {}
            })

            const seachRest = () => {
                state.tabData = []
                state.search.page = 1
                state.search.limit = 10
                state.search.total = 1
            }

            // 获取种猪详情
            const getPigFileDetail = async obj => {
                await getPigFileDetailApi(obj).then(res => {
                    if (res.code == 0) {
                        state.detail = res.data
                        state.search.pigCode = state.detail.pigCode
                        seachRest()
                    }
                })
            }

            //所有详情转换
            const genderStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "gender",
                    state.detail.gender
                )
            })
            const pigSourcesStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "pigSources",
                    state.detail.pigSources
                )
            })
            const pigTypeStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "pigType",
                    state.detail.pigType
                )
            })
            const pigStatusStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "pigStatus",
                    state.detail.pigStatus
                )
            })
            const noseColorStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "noseColor",
                    state.detail.noseColor
                )
            })
            const pigKeepStatusStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "pigKeepStatus",
                    state.detail.pigKeepStatus
                )
            })
            const breedingLevelStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "breedingLevel",
                    state.detail.breedingLevel
                )
            })
            const breedingStatusStr = computed(() => {
                return store.getters["dictionaries/getDictionarieName"](
                    "breedingStatus",
                    state.detail.breedingStatus
                )
            })
            // 种猪图片
            const pigDetailImg = computed(() => {
                let pigType = store.getters["dictionaries/getDictionarieName"](
                    "pigSources",
                    state.detail.pigSources
                )
                let gender = store.getters["dictionaries/getDictionarieName"](
                    "gender",
                    state.detail.gender
                )
                if (pigType == "长白猪" && gender == "公") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/changbai_gong.jpg"
                }
                if (pigType == "长白猪" && gender == "母") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/changbai_mu.jpg"
                }
                if (pigType == "杜洛克猪" && gender == "公") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/duluoke_gong.jpg"
                }
                if (pigType == "杜洛克猪" && gender == "母") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/duluoke_mu.jpg"
                }
                if (pigType == "大白猪" && gender == "公") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/dabai_gong.jpg"
                }
                if (pigType == "大白猪" && gender == "母") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/dabai_mu.jpg"
                }
                if (pigType == "黑猪") {
                    return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/heizhu.jpg"
                }
                // 默认图片
                return "https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/bg/nopigSources.jpeg"
            })
            // 大事纪单个
            const memorabiliaItem = ref("")
            provide("memorabilia", memorabiliaItem)
            // 大事纪跳转
            provide("changeMemorabilia", item => {
                if (item.model != "种猪建档") {
                    state.tabsValue = item.model
                    memorabiliaItem.value = JSON.parse(JSON.stringify(item))
                }
            })

            onMounted(() => {
                getPigFileDetail({ id: props.pageData.id })
                const name = ref("lei")
                provide("name", name) // 提供数据
            })
            return {
                ...toRefs(state),
                tabStyle: {
                    background: "#169BD5",
                    color: "white",
                    padding: "10px 20px",
                    borderColor: "#169BD5"
                },
                paneStyle: {
                    padding: "10px 20px"
                },
                genderStr,
                pigSourcesStr,
                pigTypeStr,
                pigStatusStr,
                noseColorStr,
                pigKeepStatusStr,
                breedingLevelStr,
                breedingStatusStr,
                pigDetailImg,
                seachRest,
                pigImgPath: "https://cdn.bestgenetics.com.cn/common/bg/pig.png",
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 面包屑去往父级
                goFatherPage(index, item) {
                    if (index == 0) {
                        const data = {
                            name: item.name,
                            pageUrl: item.pageUrl
                        }
                        this.$emit("gopage", data)
                    } else {
                        window.$message.warning("您已在当前页面！")
                    }
                }

                // tabsChange(value) {
                //     switch (value) {
                //         case '概览':
                //             break
                //         case '饲喂记录':
                //             seachRest()
                //             getPigFeedingList()
                //             break
                //         case '转舍记录':
                //             seachRest()
                //             getPigDwellingList()
                //             break
                //         case '体检记录':
                //             seachRest()
                //             getPigExaminationList()
                //             break
                //         case '疫苗记录':
                //             seachRest()
                //             getPigVaccineList()
                //             break
                //         case '医疗记录':
                //             seachRest()
                //             getPigMedicalList()
                //             break
                //         case '采精记录':
                //             seachRest()
                //             getPigSemenList()
                //             break
                //         case '配种记录':
                //             seachRest()
                //             getPigHybridizationList()

                //             break
                //         case '测孕记录':
                //             seachRest()
                //             getPigFetationList()
                //             break
                //         case '生产记录':
                //             seachRest()
                //             getPigMultiplyList()
                //             break
                //         default:
                //             break
                //     }
                // }
            }
        }
    })
</script>
<style lang="less" scoped>
    .pageFileDetail {
        background: #f9f9f9;
        padding: 10px 15px;
        padding-bottom: 40px;
        .n-divider {
            margin: 0;
        }
        .n-tabs {
            border-width: 2px;
            :deep(.n-tabs-tab-pad) {
                width: 0 !important;
            }
            :deep(.n-tabs-nav) {
                background: #169bd5;
            }
            :deep(.n-tabs-bar) {
                background: white;
            }
            :deep(.n-tabs-tab--active) {
                background: white !important;
                color: #169bd5 !important;
            }
        }
    }
</style>
