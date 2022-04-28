<template>
    <div class="dataManagement">
        <n-space vertical>
            <!-- 头部 -->
            <n-grid :x-gap="12" :y-gap="8" :cols="5">
                <n-grid-item>
                    <div class="statistics">
                        <div class="green"></div>
                        <n-statistic label="本月出栏" :value="99" style="paddingTop:20px">
                            <template #suffix>
                                <span class="font-16">头</span>
                            </template>
                        </n-statistic>
                    </div>
                </n-grid-item>
                <n-grid-item>
                    <div class="statistics">
                        <div class="green"></div>
                        <n-statistic label="当前存栏量" :value="99" style="paddingTop:20px">
                            <template #suffix>
                                <span class="font-16">头</span>
                            </template>
                        </n-statistic>
                    </div>
                </n-grid-item>
                <n-grid-item>
                    <div class="statistics">
                        <div class="green"></div>
                        <n-statistic label="存栏种公猪" :value="99" style="paddingTop:20px">
                            <template #suffix>
                                <span class="font-16">头</span>
                            </template>
                        </n-statistic>
                    </div>
                </n-grid-item>
                <n-grid-item>
                    <div class="statistics">
                        <div class="green"></div>
                        <n-statistic label="存栏母猪量" :value="99" style="paddingTop:20px">
                            <template #suffix>
                                <span class="font-16">头</span>
                            </template>
                        </n-statistic>
                    </div>
                </n-grid-item>
                <n-grid-item>
                    <div class="statistics">
                        <div class="green"></div>
                        <n-statistic label="存栏母猪量" :value="99" style="paddingTop:20px">
                            <template #suffix>
                                <span class="font-16">头</span>
                            </template>
                        </n-statistic>
                    </div>
                </n-grid-item>
            </n-grid>

            <!-- 图表 -->
            <n-grid :x-gap="12" :y-gap="8" :cols="2">
                <div id="echars1" class="echars"></div>
                <div>
                    <n-space vertical>
                        <div id="echars2" class="echars2"></div>
                        <div id="echars3" class="echars2"></div>
                    </n-space>
                </div>
            </n-grid>
            <!-- 环境监控 -->
            <n-card>
                <template #header>
                    <span>环境监控</span>
                </template>
                <n-grid :x-gap="12" :y-gap="8" :cols="5">
                    <n-grid-item>
                        <div id="panel" class="panel"></div>
                    </n-grid-item>
                    <n-grid-item>
                        <div id="panel2" class="panel"></div>
                    </n-grid-item>
                </n-grid>
            </n-card>
        </n-space>
    </div>
</template>
<script>
    export default {
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById('echars1'))
            var myChart2 = this.$echarts.init(document.getElementById('echars2'))
            var myChart3 = this.$echarts.init(document.getElementById('echars3'))
            var panel = this.$echarts.init(document.getElementById('panel'))
            var panel2 = this.$echarts.init(document.getElementById('panel2'))

            // 绘制图表
            myChart.setOption({
                title: {
                    text: '初生仔猪产量（单位：头）',
                    padding: 20
                },
                tooltip: {},
                xAxis: {
                    data: ['一月', '二月', '三月', '四月', '五月', '六月']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20],
                        label: {
                            show: true,
                            position: 'top',
                            valueAnimation: true
                        }
                    }
                ]
            })
            myChart2.setOption({
                title: {
                    top: '80%',
                    padding: [20, 30],
                    text: '成本统计',
                    left: 'left'
                },
                tooltip: {},
                xAxis: {},
                yAxis: {},
                series: [
                    {
                        symbolSize: 20,
                        data: [
                            [10.0, 8.04],
                            [8.07, 6.95],
                            [13.0, 7.58],
                            [9.05, 8.81],
                            [11.0, 8.33],
                            [14.0, 7.66],
                            [13.4, 6.81],
                            [10.0, 6.33],
                            [14.0, 8.96],
                            [12.5, 6.82],
                            [9.15, 7.2],
                            [11.5, 7.2],
                            [3.03, 4.23],
                            [12.2, 7.83],
                            [2.02, 4.47],
                            [1.05, 3.33],
                            [4.05, 4.96],
                            [6.03, 7.24],
                            [12.0, 6.26],
                            [12.0, 8.84],
                            [7.08, 5.82],
                            [5.02, 5.68]
                        ],
                        type: 'scatter'
                    }
                ]
            })
            myChart3.setOption({
                title: {
                    top: '80%',
                    padding: [20, 30],
                    text: '收入统计',
                    left: 'left'
                },
                tooltip: {},
                xAxis: {},
                yAxis: {},
                series: [
                    {
                        symbolSize: 20,
                        data: [
                            [10.0, 8.04],
                            [8.07, 6.95],
                            [13.0, 7.58],
                            [9.05, 8.81],
                            [11.0, 8.33],
                            [14.0, 7.66],
                            [13.4, 6.81],
                            [10.0, 6.33],
                            [14.0, 8.96],
                            [12.5, 6.82],
                            [9.15, 7.2],
                            [11.5, 7.2],
                            [3.03, 4.23],
                            [12.2, 7.83],
                            [2.02, 4.47],
                            [1.05, 3.33],
                            [4.05, 4.96],
                            [6.03, 7.24],
                            [12.0, 6.26],
                            [12.0, 8.84],
                            [7.08, 5.82],
                            [5.02, 5.68]
                        ],
                        type: 'scatter'
                    }
                ]
            })
            panel.setOption({
                animation: true,
                animationThreshold: 2000,
                animationDuration: 1000,
                animationEasing: 'cubicOut',
                animationDelay: 0,
                animationDurationUpdate: 300,
                animationEasingUpdate: 'cubicOut',
                animationDelayUpdate: 0,
                series: [
                    {
                        type: 'gauge',
                        title: {
                            show: true,
                            position: 'top',
                            color: 'blue',
                            margin: 8,
                            fontSize: 12
                        },
                        detail: {
                            show: true,
                            position: 'top',
                            color: 'white',
                            margin: 8,
                            fontSize: 12,
                            formatter: '{value}%'
                        },
                        name: '温度',
                        min: 0,
                        max: 100,
                        splitNumber: 5,
                        radius: '85%',
                        startAngle: 225,
                        endAngle: -45,
                        data: [
                            {
                                name: '20%',
                                value: 20
                            }
                        ],
                        axisLine: {
                            show: true,
                            onZero: true,
                            onZeroAxisIndex: 0
                        },
                        itemStyle: {
                            color: 'red',
                            opacity: 1
                        }
                    }
                ],
                tooltip: {
                    show: true,
                    trigger: 'item',
                    triggerOn: 'mousemove|click',
                    axisPointer: {
                        type: 'line'
                    },
                    formatter: '{a} <br/>{c}%',
                    textStyle: {
                        fontSize: 14
                    },
                    borderWidth: 0
                },
                title: [
                    {
                        padding: 5,
                        top: '80%',
                        text: '温度',
                        left: 'center'
                    }
                ]
            })
            panel2.setOption({
                backgroundColor: 'black',
                series: [
                    {
                        type: 'liquidFill',
                        radius: '80%',
                        data: [0.6, 0.4],
                        backgroundStyle: {
                            color: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(0,24,55, 0)'
                                    },
                                    {
                                        offset: 0.75,
                                        color: 'rgba(0,24,55, 0)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(37,237,259, 1)'
                                    }
                                ],
                                globalCoord: false
                            }
                        },
                        outline: {
                            borderDistance: 0,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(50,115,256, 1)'
                                        },
                                        {
                                            offset: 0.5,
                                            color: 'rgba(50,115,233, .75)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(50,115,233, 1)'
                                        }
                                    ],
                                    globalCoord: false
                                }
                            }
                        },
                        // color: ['rgba(37,237,240, 1)', 'rgba(37,200,220, 1)'],
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(37,237,259, 1)'
                                },
                                {
                                    offset: 0.5,
                                    color: 'rgba(0,100,259, 0.5)'
                                },
                                {
                                    offset: 1,
                                    color: 'darkblue'
                                }
                            ],
                            globalCoord: false
                        },
                        label: {
                            normal: {
                                formatter: ''
                            }
                        }
                    }
                ]
            })
        }
    }
</script>
<style lang="less" scoped>
    .dataManagement {
        padding: 20px;
        background: #f5f7f9;
        .statistics {
            display: flex;
            border-radius: 5px;
            background: white;
        }
        .green {
            height: 108px;
            width: 120px;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            margin-right: 10px;
            background-color: rgba(0, 128, 0, 0.24);
        }
        .echars {
            height: 510px;
            width: 100%;
            border-radius: 5px;
            background: white;
        }
        .echars2 {
            height: 250px;
            width: 100%;
            border-radius: 5px;
            background: white;
        }
        .panel {
            height: 300px;
            width: 100%;
        }
    }
</style>