<template>
    <div class="flex">
        <!-- Echarts -->
        <div id="myEcharts" class="mt-4" :style="{ width: '800px', height: '300px' }"></div>
        <div>
            <n-h3 class="ml-2 mt-5">{{ $t("dtables.listing.keyIndicatorsStatistics") }}:</n-h3>
            <n-space class="ml-2">
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ barren }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.justSowNumber") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ isTheSow }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.haveTheSowNumber") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ transferredSowNumber }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.intoANumberOfSows") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ pregnantSows }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.haveBeenPregnantSows") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg01" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ retry }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.returnsNumberOfSows") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg02" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ abortion }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.abortionNumberOfSows") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg03" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ die }}</h2>
                        {{ $t("dtables.listing.second") }}
                    </div>
                    <div>{{ $t("dtables.listing.deathNumberOfSows") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg04" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ pigLet }}</h2>
                        %
                    </div>
                    <div>{{ $t("dtables.listing.productionOfTheTotalNumberOfPiglets") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ countPig }}</h2>
                        {{ $t("dtables.listing.head") }}
                    </div>
                    <div>{{ $t("dtables.listing.theTotalNumberOfWeanedPiglets") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ averageBreeding }}</h2>
                        {{ $t("dtables.listing.second") }}
                    </div>
                    <div>{{ $t("dtables.listing.theAverageNumberOfBreeding") }}</div>
                </n-card>
                <n-card hoverable class="statisticBox bg05" :content-style="contentStyle">
                    <div class="flex align-baseline justify-center">
                        <h2>{{ weaningRate }}</h2>
                        %
                    </div>
                    <div>{{ $t("dtables.listing.weaningRate") }}</div>
                </n-card>
            </n-space>
        </div>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, nextTick } from "vue"
    import { anOverviewOfTheBatchApi } from "@/api/breedingPlan.js"
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        name: "planOverview",
        props: {
            pageData: Object
        },
        setup(props) {
            let echart = window.echarts
            const { t } = useI18n()
            const state = reactive({
                changbaiList: [],
                daBaiList: [],
                duLuoKeList: [],
                planStatus: "",
                barren: "",
                isTheSow: "",
                transferredSowNumber: "",
                pregnantSows: "",
                retry: "",
                abortion: "",
                die: "",
                pigLet: "",
                countPig: "",
                averageBreeding: "",
                weaningRate: "",
                search: {
                    pigCodeLike: ""
                }
            })
            // 返回当前页面展示数据
            const anOverviewOfTheBatch = async () => {
                await anOverviewOfTheBatchApi({
                    batchNumber: props.pageData.id
                }).then(res => {
                    if (res.code == 0) {
                        state.changbaiList = res.data.changBai
                        state.daBaiList = res.data.daBai
                        state.duLuoKeList = res.data.duLuoKe
                        state.planStatus = res.data.planStatus
                        state.barren = res.data.barren
                        state.isTheSow = res.data.isTheSow
                        state.transferredSowNumber = res.data.transferredSowNumber
                        state.pregnantSows = res.data.pregnantSows
                        state.retry = res.data.retry
                        state.abortion = res.data.abortion
                        state.die = res.data.die
                        state.pigLet = res.data.pigLet
                        state.countPig = res.data.countPig
                        state.averageBreeding = res.data.averageBreeding
                        state.weaningRate = res.data.weaningRate

                        initChart()
                    }
                })
            }
            const initChart = () => {
                let xAxisData = []
                // let r = [1,2,3]
                // let q = r.indexOf('first')
                // if(q == -1){
                //     console.log('hah')
                // }

                let data1 = state.daBaiList
                let data2 = state.changbaiList
                let data3 = state.duLuoKeList
                // let data4 = []
                for (let i = 1; i < 9; i++) {
                    //     switch (i) {
                    //         case 1:
                    //             data1.push(+(Math.random() * 2).toFixed(2))
                    //             data2.push(+(Math.random() * 2).toFixed(2))
                    //             data3.push(+(Math.random() + 0.3).toFixed(2))
                    //             break

                    //         default:
                    //             break
                    //     }
                    xAxisData.push("第" + (3 * i - 2) + "周")
                    //     data1.push(+(Math.random() * 2).toFixed(2))
                    //     data2.push(+(Math.random() * 2).toFixed(2))
                    //     data3.push(+(Math.random() + 0.3).toFixed(2))
                    //     data4.push(+Math.random().toFixed(2))
                }
                // console.log(data3)
                let emphasisStyle = {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: "rgba(0,0,0,0.3)"
                    }
                }
                setTimeout(() => {
                    nextTick(() => {
                        let chart = echart.init(document.getElementById("myEcharts"))

                        // chart配置和数据
                        chart.setOption({
                            legend: {
                                data: ["长白", "大白", "杜洛克"],
                                left: "10%"
                            },
                            toolbox: {
                                feature: {
                                    magicType: {
                                        type: ["stack"]
                                    },
                                    dataView: {}
                                }
                            },
                            tooltip: {},
                            xAxis: {
                                data: xAxisData,
                                name: "X Axis",
                                axisLine: { onZero: true },
                                splitLine: { show: false },
                                splitArea: { show: false }
                            },
                            yAxis: {},
                            grid: {
                                bottom: 100
                            },
                            series: [
                                {
                                    name: "长白",
                                    type: "bar",
                                    stack: "one",
                                    emphasis: emphasisStyle,
                                    data: data1
                                },
                                {
                                    name: "大白",
                                    type: "bar",
                                    stack: "one",
                                    emphasis: emphasisStyle,
                                    data: data2
                                },
                                {
                                    name: "杜洛克",
                                    type: "bar",
                                    stack: "one",
                                    emphasis: emphasisStyle,
                                    data: data3
                                }
                            ]
                        })
                        window.onresize = function () {
                            //自适应大小
                            chart.resize()
                        }
                    })
                }, 500)
            }
            onMounted(() => {
                anOverviewOfTheBatch()
            })
            return {
                ...toRefs(state),
                initChart
            }
        }
    })
</script>
<style lang="less" scoped>
    .n-h:first-child {
        margin-top: 9px;
    }
</style>
