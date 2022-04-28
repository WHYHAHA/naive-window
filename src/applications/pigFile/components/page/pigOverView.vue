<template>
    <div class="pigOverview">
        <n-space vertical :size="20">
            <n-grid :cols="2" x-gap="20">
                <n-gi>
                    <n-space vertical :size="30">
                        <!-- 种猪周期 -->
                        <!-- 种猪状态 -->
                        <n-card :title="$t('dtables.listing.stateOfSwine')" class="live">
                            <div>
                                <div style="width: 90%">
                                    <!-- 最上 -->
                                    <div
                                        :class="
                                            haveLiveOrder('birth_forSale')
                                                ? 'flex align-end selectBorder'
                                                : 'flex align-end'
                                        "
                                    >
                                        <div class="lineRow_top_left"></div>
                                        <div
                                            :class="
                                                haveLive(
                                                    'forSale',
                                                    'borth p-1 border border-3 rounded text-center'
                                                )
                                            "
                                            style="width: 75%"
                                        >
                                            {{ $t("dtables.listing.forSale") }} {{ liveTime(6) }}
                                        </div>
                                    </div>
                                    <!-- 间隔层 -->
                                    <div class="flex align-center">
                                        <div class="intervalBox">
                                            <!-- 出生-待售 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('birth_forSale')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 保育-待售 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('welfare_forSale')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 育肥-待售 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('fatten_forSale')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 后备-待售 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('backups_forSale')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine'
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 种猪-待售 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('breedingPig_forSale')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine'
                                                "
                                            ></span>
                                        </div>
                                    </div>

                                    <div class="flex align-center">
                                        <div :class="haveLive('birth', 'liveBox')">
                                            <div class="text-center">
                                                {{ $t("dtables.listing.born") }}
                                            </div>
                                            <div class="text-center font-12">{{ liveTime(1) }}</div>
                                        </div>
                                        <!-- 出生-保育 -->
                                        <div
                                            :class="
                                                haveLiveOrder('birth_welfare')
                                                    ? 'shortLineRow selectBg'
                                                    : 'shortLineRow'
                                            "
                                        ></div>
                                        <div :class="haveLive('welfare', 'liveBox')">
                                            <div class="text-center">
                                                {{ $t("dtables.listing.conservation") }}
                                            </div>
                                            <div class="text-center font-12">{{ liveTime(2) }}</div>
                                        </div>
                                        <!-- 保育-育肥 -->
                                        <div
                                            :class="
                                                haveLiveOrder('welfare_fatten')
                                                    ? 'shortLineRow selectBg'
                                                    : 'shortLineRow'
                                            "
                                        ></div>
                                        <div :class="haveLive('fatten', 'liveBox')">
                                            <div class="text-center">
                                                {{ $t("dtables.listing.fattening") }}
                                            </div>
                                            <div class="text-center font-12">{{ liveTime(3) }}</div>
                                        </div>
                                        <!-- 育肥-后备 -->
                                        <div
                                            :class="
                                                haveLiveOrder('fatten_backups')
                                                    ? 'shortLineRow selectBg'
                                                    : 'shortLineRow'
                                            "
                                        ></div>
                                        <div :class="haveLive('backups', 'liveBox')">
                                            <!-- 后备 -->
                                            <div class="text-center">
                                                {{ $t("dataTable.listing.backup") }}
                                            </div>
                                            <div class="text-center font-12">{{ liveTime(4) }}</div>
                                        </div>
                                        <!-- 后备-种猪 -->
                                        <div
                                            :class="
                                                haveLiveOrder('backups_breedingPig')
                                                    ? 'shortLineRow selectBg'
                                                    : 'shortLineRow'
                                            "
                                        ></div>
                                        <div :class="haveLive('breedingPig', 'liveBox')">
                                            <div class="text-center">
                                                {{ $t("dataTable.listing.swine") }}
                                            </div>
                                            <div class="text-center font-12">{{ liveTime(5) }}</div>
                                        </div>
                                    </div>

                                    <!-- 间隔层 -->
                                    <div class="flex align-center">
                                        <div class="intervalBox">
                                            <!-- 出生-死亡 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('birth_dead')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 保育-死亡 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('welfare_dead')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 育肥-死亡 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('fatten_dead')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine '
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 后备-死亡 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('backups_dead')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine'
                                                "
                                            ></span>
                                        </div>
                                        <div style="width: 35px"></div>
                                        <div class="intervalBox">
                                            <!-- 种猪-死亡 -->
                                            <span
                                                :class="
                                                    haveLiveOrder('breedingPig_dead')
                                                        ? 'verticalLine selectBg'
                                                        : 'verticalLine'
                                                "
                                            ></span>
                                        </div>
                                    </div>
                                    <!-- 最下 -->
                                    <div
                                        :class="
                                            haveLiveOrder('birth_dead')
                                                ? 'flex align-center text-center selectBorder'
                                                : 'flex align-center text-center'
                                        "
                                    >
                                        <div class="lineRow_bottom_left"></div>
                                        <div
                                            :class="
                                                haveLive(
                                                    'dead',
                                                    'borth p-1 border border-3 rounded text-center'
                                                )
                                            "
                                            style="width: 75%"
                                        >
                                            {{ $t("datatable.listing.death") }} {{ liveTime(7) }}
                                        </div>
                                    </div>
                                </div>
                                <!-- 最右 -->
                                <!-- <div :class="haveLiveOrder('forSale_dead')?'lineRow_right selectBorder':'lineRow_right '">
                                <div class="lineRow_right_top"></div>
                                <div class="lineVertical"></div>
                                <div class="lineRow_right_bottom"></div>
                            </div>-->
                            </div>
                        </n-card>
                        <!-- Echarts -->
                        <!-- 体重变化趋势 -->
                        <n-card :title="$t('dtables.listing.weightChangeTrend')">
                            <div
                                id="myEcharts"
                                class="mt-4"
                                :style="{ width: '100%', height: '300px' }"
                            ></div>
                        </n-card>
                    </n-space>
                </n-gi>
                <n-gi>
                    <n-space vertical :size="30">
                        <!-- Echarts -->
                        <!-- 血系图谱： -->
                        <n-card :title="$t('dtables.listing.bloodIsAMap')">
                            <div
                                id="myEcharts1"
                                class="mt-4"
                                :style="{ width: '100%', height: '400px' }"
                            ></div>
                        </n-card>
                        <n-card :title="$t('dataTable.listing.breedingValue')">
                            <n-descriptions label-placement="left" :column="4" size="small">
                                <n-descriptions-item
                                    :label="$t('dataTable.listing.matrilinealIndex')"
                                    >{{
                                        breedingList.m_index || $t("dataTable.listing.notYet")
                                    }}</n-descriptions-item
                                >
                                <!-- 血系图谱 -->
                                <n-descriptions-item
                                    :label="$t('dataTable.listing.paternityIndex')"
                                    >{{
                                        breedingList.f_index || $t("dataTable.listing.notYet")
                                    }}</n-descriptions-item
                                >
                                <!-- 基因祖育种值 -->
                                <n-descriptions-item
                                    :label="$t('dtables.listing.geneticBreedingValues')"
                                    :span="2"
                                    >{{
                                        breedingList.breedingValue || $t("dataTable.listing.notYet")
                                    }}</n-descriptions-item
                                >
                                <n-descriptions-item label="ADG">{{
                                    breedingList.adg || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="BF">{{
                                    breedingList.bf || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="FCR">{{
                                    breedingList.fcr || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="LMD">{{
                                    breedingList.lmd || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="IMF">{{
                                    breedingList.lmf || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="FI">{{
                                    breedingList.fi || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="DAYS">{{
                                    breedingList.days || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="WCL">{{
                                    breedingList.wcl || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                                <n-descriptions-item label="NBA">{{
                                    breedingList.nba || $t("dataTable.listing.notYet")
                                }}</n-descriptions-item>
                            </n-descriptions>
                        </n-card>
                    </n-space>
                </n-gi>
            </n-grid>
        </n-space>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, nextTick, computed } from "vue"
    import { useI18n } from "vue-i18n"

    import {
        // 后续更新接口
        // 生长
        pigOverviewApi,
        // 体重
        getPmPigArchivesApi,
        // 血系
        getBirthDeterminationApi,
        // 育种值
        getPmPigFosterBreedingValueApi
    } from "@/api/pigFile.js"

    export default defineComponent({
        name: "pigOverview",
        props: {
            pigDetail: Object
        },
        setup(props) {
            let echart = window.echarts
            const { t } = useI18n()

            const state = reactive({
                search: {
                    pigCodeLike: ""
                },
                currentStatus: "process",
                //     初生: 'birth',
                //     保育: 'welfare',
                //     育肥: 'fatten',
                //     后备: 'backups',
                //     种猪: 'breedingPig',
                //     待售: 'forSale',
                //     已死亡: 'dead'
                liveDictionaries: {
                    1: "birth",
                    2: "welfare",
                    3: "fatten",
                    4: "backups",
                    5: "breedingPig",
                    6: "forSale",
                    7: "dead"
                },

                liveOrder: [],
                overview: [],
                bloodList: [],
                breedingList: [],
                memorabilia: []
            })
            // 生长周期
            const pigOverview = async id => {
                await pigOverviewApi({ pigCode: id }).then(res => {
                    if (res.code == 0) {
                        // 所有周期节点
                        res.data.forEach(element => {
                            element.liveName = state.liveDictionaries[element.application]
                        })
                        state.overview = res.data
                        // 循环push所有线条节点
                        for (let index = 0; index < res.data.length - 1; index++) {
                            // 当前节点
                            const element = res.data[index].liveName
                            // 下一个节点
                            const nextElement = res.data[index + 1].liveName
                            state.liveOrder.push(element + "_" + nextElement)
                        }
                    }
                })
            }
            // 体重列表
            const getWeightList = async id => {
                await getPmPigArchivesApi({ pigCode: id }).then(res => {
                    if (res.code == 0) {
                        state.weightList = res.data
                        // 初始化echarts
                        initChart_weight()
                    }
                })
            }
            // 血系图谱
            const getBirthDetermination = async id => {
                await getBirthDeterminationApi({ pigCode: id }).then(res => {
                    if (res.code == 0) {
                        var obj = {}
                        // state.bloodList = [
                        //     {
                        //         pigCode: '001',
                        //         fatherCode: '002',
                        //         motherCode: '003'
                        //     },
                        //     {
                        //         pigCode: '002',
                        //         fatherCode: '021',
                        //         motherCode: '022'
                        //     },
                        //     {
                        //         pigCode: '003',
                        //         fatherCode: '031',
                        //         motherCode: '032'
                        //     },
                        //     {
                        //         pigCode: '021'
                        //     },
                        //     {
                        //         pigCode: '022'
                        //     },
                        //     {
                        //         pigCode: '031'
                        //     },
                        //     {
                        //         pigCode: '032'
                        //     }
                        // ]
                        state.bloodList = res.data.reduce(function (item, next) {
                            obj[next.pigCode] ? "" : (obj[next.pigCode] = true && item.push(next))
                            return item
                        }, [])
                        // 初始化echarts
                        initChart_phylon()
                    }
                })
            }
            // 育种值
            const getPmPigFosterBreedingValue = async id => {
                await getPmPigFosterBreedingValueApi({ pigCode: id }).then(res => {
                    if (res.code == 0) {
                        state.breedingList = res.data[0] || []
                    }
                })
            }

            const initChart_phylon = () => {
                nextTick(() => {
                    function toTreeData(data, fid, mid) {
                        function tree(fid, mid) {
                            let arr = []
                            let filter = data.filter(item => {
                                return item.pigCode === fid || item.pigCode === mid
                            })
                            filter.forEach(item => {
                                arr.push({
                                    // gender: item.gender,
                                    name: item.pigCode,
                                    pigCode: item.pigCode,
                                    fatherCode: item.fatherCode,
                                    motherCode: item.motherCode,
                                    pigSources: item.source,
                                    pigStatus: item.pigStatus,
                                    children: tree(item.fatherCode, item.motherCode)
                                })
                            })
                            return arr
                        }
                        return tree(fid, mid) // 第一级节点的父id，是null或者0，视情况传入
                    }
                    // 血系图谱
                    try {
                        // 递归遍历2代后数据
                        let gene = toTreeData(
                            state.bloodList,
                            state.bloodList[0].fatherCode,
                            state.bloodList[0].motherCode
                        )
                        // 添加本猪数据
                        let geneObj = {
                            children: gene,
                            name: state.bloodList[0].pigCode,
                            pigCode: state.bloodList[0].pigCode,
                            pigStatus: state.bloodList[0].pigStatus,
                            pigSources: state.bloodList[0].source,
                            fatherCode: state.bloodList[0].fatherCode,
                            motherCode: state.bloodList[0].motherCode
                        }
                        let chart1 = echart.init(document.getElementById("myEcharts1"))
                        // chart配置和数据
                        chart1.setOption({
                            tooltip: {
                                trigger: "item",
                                triggerOn: "mousemove",
                                formatter: function (params) {
                                    let pigcode =
                                        params.data.pigCode || t("dataTable.listing.notYet")
                                    let pigStatus =
                                        params.data.pigStatus || t("dataTable.listing.notYet")
                                    let pigSources =
                                        params.data.pigSources || t("dataTable.listing.notYet")
                                    let fatherCode =
                                        params.data.fatherCode || t("dataTable.listing.notYet")
                                    let motherCode =
                                        params.data.motherCode || t("dataTable.listing.notYet")
                                    return (
                                        "<div>编码：" +
                                        pigcode +
                                        "</div>" +
                                        "<div>状态：" +
                                        pigStatus +
                                        "</div>" +
                                        "<div>来源：" +
                                        pigSources +
                                        "</div>" +
                                        "<div>父code：" +
                                        fatherCode +
                                        "</div>" +
                                        "<div>母code：" +
                                        motherCode +
                                        "</div>"
                                    )
                                }
                            },
                            series: [
                                {
                                    type: "tree",
                                    data: [geneObj],
                                    left: "2%",
                                    right: "2%",
                                    top: "8%",
                                    bottom: "20%",
                                    symbol: "emptyCircle",
                                    orient: "vertical",
                                    expandAndCollapse: false,
                                    symbolSize: 10,
                                    label: {
                                        position: "top",
                                        verticalAlign: "middle",
                                        align: "center",
                                        bottom: 20,
                                        fontSize: 12,
                                        color: "#17233d",
                                        offset: [0, -10],
                                        formatter: function (params) {
                                            if (params.data.pigCode == state.bloodList[0].pigCode) {
                                                return "本猪：" + params.data.pigCode
                                            } else {
                                                return params.data.pigCode.slice(0, 5) + "..."
                                            }
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: "#2d8cf0",
                                            lineStyle: {
                                                color: "#2d8cf0"
                                            }
                                        }
                                    },
                                    leaves: {
                                        label: {
                                            position: "bottom",
                                            align: "center",
                                            rotate: 310,
                                            offset: [0, 10],
                                            fontSize: 12,
                                            formatter: function (params) {
                                                return params.data.pigCode.slice(0, 5) + "..."
                                            }
                                        }
                                    },
                                    animationDurationUpdate: 750
                                }
                            ]
                        })
                    } catch (error) {
                        console.log("error: ", error)
                        window.$message.error("血系数据渲染错误")
                    }
                })
            }
            const initChart_weight = () => {
                // 体重图表
                nextTick(() => {
                    try {
                        let chart = echart.init(document.getElementById("myEcharts"))
                        let xAxis = state.weightList.map(item => {
                            return item.monthStr + "月"
                        })
                        let seriesData = state.weightList.map(item => {
                            return {
                                value: item.weightValue,
                                asInDay: item.asInDay
                            }
                        })
                        // chart配置和数据
                        chart.setOption({
                            title: {
                                text: t("dtables.listing.weightChangeTrendkg"),
                                left: "center"
                            },
                            xAxis: {
                                type: "category",
                                data: xAxis
                            },
                            tooltip: {
                                trigger: "axis",
                                formatter: function (params) {
                                    const title = params[0].axisValueLabel
                                    const weight = params[0].value
                                    const asInDay = params[0].data.asInDay
                                    return (
                                        "<div>" +
                                        title +
                                        "</div> <div style='color:#657180'>日龄：" +
                                        asInDay +
                                        " 天</div><div style='color:#657180'>体重：" +
                                        weight +
                                        "kg</div>"
                                    )
                                }
                            },
                            yAxis: {
                                type: "value"
                            },
                            series: [
                                {
                                    data: seriesData,
                                    type: "line",
                                    smooth: true
                                }
                            ]
                        })
                        window.onresize = function () {
                            //自适应大小
                            chart.resize()
                        }
                    } catch (error) {
                        window.$message.error("体重图表错误")
                    }
                })
            }
            //生命周期 顺序的所有的线条显示与否
            const haveLiveOrder = computed(() => {
                return function (type) {
                    const index = state.liveOrder.findIndex(item => item == type)
                    return index == -1 ? false : true
                }
            })
            //生命周期 获取对应时间
            const liveTime = computed(() => {
                return function (type) {
                    let time = ""
                    state.overview.forEach(element => {
                        if (element.application == type) time = element.recordDatetime
                    })
                    return time
                }
            })
            //查询是否有该周期
            const haveLive = computed(() => {
                return function (type, css) {
                    const index = state.overview.findIndex(item => item.liveName == type)
                    return index == -1 ? css : css + " selectBox"
                }
            })
            onMounted(() => {
                // 获取生命周期
                pigOverview(props.pigDetail.pigCode)
                // 获取体重
                getWeightList(props.pigDetail.pigCode)
                // 获取血系图谱
                getBirthDetermination(props.pigDetail.pigCode)
                // 获取育种值
                getPmPigFosterBreedingValue(props.pigDetail.pigCode)
            })
            return {
                ...toRefs(state),
                haveLiveOrder,
                liveTime,
                haveLive
            }
        }
    })
</script>
<style lang="less" scoped>
    .pigOverview {
        padding-top: 10px;
        .originalTab {
            border-width: 2px;
            :deep(.n-tabs-tab-pad) {
                width: var(--tab-gap) !important;
                margin-right: 15px;
            }
            :deep(.n-tabs-nav) {
                background: white !important;
                cursor: pointer;
            }
            :deep(.n-tabs-bar) {
                background: #169bd5 !important;
            }
        }
        .lineRow_top_left {
            border-left: #efeff5 solid 4px;
            border-top: #efeff5 solid 4px;
            width: 100px;
            height: 25px;
            margin-left: 7.4%;
        }
        .lineRow_bottom_left {
            border-left: #efeff5 solid 4px;
            border-bottom: #efeff5 solid 4px;
            width: 100px;
            height: 25px;
            margin-left: 7.4%;
            margin-bottom: 3%;
        }
        .lineRow_right {
            width: 10%;
            .lineRow_right_top {
                border-right: #efeff5 solid 2px;
                border-top: #efeff5 solid 2px;
                width: 20px;
                height: 25px;
                margin-top: 20px;
            }
            .lineVertical {
                border-right: #efeff5 solid 2px;
                width: 20px;
                height: 55%;
            }
            .lineRow_right_bottom {
                border-right: #efeff5 solid 2px;
                border-bottom: #efeff5 solid 2px;
                width: 20px;
                height: 25px;
                margin-bottom: 25px;
            }
        }
        .liveBox {
            border-radius: 8px;
            width: 15%;
            height: 65px;
            border-width: 3px;
            border-style: solid;
            border-color: #dee2e6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .intervalBox {
            width: 15%;
            display: flex;
            justify-content: center;
            .verticalLine {
                width: 3px;
                height: 25px;
                background: rgb(239, 239, 245);
            }
        }
        .shortLineRow {
            background: rgb(239, 239, 245);
            width: 35px;
            height: 3px;
        }
        .selectBg {
            background: #3091f2 !important;
        }
        .selectBox {
            border-color: #3091f2 !important;
            color: #3091f2 !important;
        }
        .selectBorder {
            border-color: #3091f2 !important;
            > * {
                border-color: #3091f2 !important;
            }
        }
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
