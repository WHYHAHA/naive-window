<template>
    <n-card ref="printPigCardRef" id="printSemen" style="width:100%;" content-style="padding: 0px;" :bordered="false" v-show="false">
        <div v-for="(printItem,printIndex) in originData" :key="printIndex">
            <!-- 每一个打印的数据 -->
            <n-space class="print-page" vertical :size="5">
                <div>赤峰家育{{ printItem.nowFarmid }}</div>
                <div class="w-100 flex justify-between align-end">
                    <div class="w-100 flex-5">
                        <!-- line-height--5 -->
                        <div class="font-130 flex-4 line-height-1 font-kai font-weight-bolder" style="color:#000">{{ printItem.earBrandCode }}</div>
                        <div class="flex w-100 text-center">
                            <div class="flex-1">
                                <div class>配种日期</div>
                                <div class="font-40 font-weight-bolder">{{ timestampToTime(new Date(printItem.breedingDatetime).getTime()) }}</div>
                            </div>
                            <div class="flex-3">
                                <div class>孕检日期</div>
                                <div class="font-40 font-weight-bolder">{{ timestampToTime(new Date(printItem.pregnnancyDate).getTime()) }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-2 w-100 text-center align-center">
                        <div class="flex-1-15">
                            <n-image width="120" :src="'data:image/jpg;base64,'+printItem.qrcode" />
                        </div>
                        <div class="flex-2">
                            <div>舍 - 栏</div>
                            <div class="font-40 font-weight-bolder">{{ printItem.nowDormCode }} - {{ printItem.nowColumnCode}}</div>
                        </div>
                    </div>
                </div>
                <div class="dotted"></div>
                <!-- 中部品种 -->
                <div class="flex w-100">
                    <div class="w-100">
                        <div class="flex w-100">
                            <span class="flex-2">品种品系</span>
                            <span class="flex-5">{{ printItem.strain }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-2">等级</span>
                            <span class="flex-5">{{ printItem.breedingLevel }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-2">整体评分</span>
                            <span class="flex-5">{{ printItem.holisticScoring }}</span>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="flex w-100 visible-hidden">
                            <span class="flex-1">测试</span>
                            <span class="flex-5">测试</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-1">F品系</span>
                            <span class="flex-5">{{ printItem.fStrain }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-1">M品系</span>
                            <span class="flex-5">{{ printItem.mStrain }}</span>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="flex w-100">
                            <span class="flex-1">个体号</span>
                            <span class="flex-5">{{ printItem.pigCode }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-1">父亲</span>
                            <span class="flex-5">{{ printItem.pigFatherCode }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-1">母亲</span>
                            <span class="flex-5">{{ printItem.pigMotherCode }}</span>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="flex w-100">
                            <span class="flex-2">乳头数</span>
                            <span class="flex-4">{{ printItem.leftPapillaNum }} / {{ printItem.rightPapillaNum }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-2">出生日期</span>
                            <span class="flex-4">{{ timestampToTime(new Date(printItem.pigBornDate).getTime()) }}</span>
                        </div>
                        <div class="flex w-100">
                            <span class="flex-2">首次配日期</span>
                            <span class="flex-4">{{ timestampToTime(new Date(printItem.theFirstMatchDate).getTime()) }}</span>
                        </div>
                    </div>
                </div>
                <div class="dotted"></div>
                <!-- 第一个table -->
                <n-table bordered :single-line="false" size="small" class="font-10 text-center border-solid no-radius">
                    <thead>
                        <tr>
                            <th>胎次</th>
                            <th>断配间隔</th>
                            <th>配种日期*</th>
                            <th>与配公猪</th>
                            <th>分娩日期</th>
                            <th>饲养活仔</th>
                            <th>死胎</th>
                            <th>木乃伊</th>
                            <th>寄入</th>
                            <th>寄出</th>
                            <th>断奶日期</th>
                            <th>断奶头数</th>
                            <th>断奶死亡</th>
                            <th>怀孕天数</th>
                            <th>哺乳天数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(tItem,tIndex) in printItem.pigProductionRecordBoList" :key="tIndex">
                            <td>{{ tIndex+1 }}</td>
                            <td>{{ tItem.disconnectionInterval }}</td>
                            <td>{{ timestampToTime(new Date(tItem.breedingDatetime).getTime()) }}</td>
                            <td style="word-wrap:break-word;">{{ tItem.semenCode }}</td>
                            <td>{{ timestampToTime(new Date(tItem.childbirthDate).getTime()) }}</td>
                            <td>{{ tItem.farrowingCount }}</td>
                            <td>{{ tItem.stillbirthCount }}</td>
                            <td>{{ tItem.mummyCount }}</td>
                            <td>{{ tItem.sendIn }}</td>
                            <td>{{ tItem.sendOut }}</td>
                            <td>{{ timestampToTime(new Date(tItem.outOfBedDate).getTime()) }}</td>
                            <td>{{ tItem.farmweanNum }}</td>
                            <td>{{ tItem.farmweanDeathNum }}</td>
                            <td>{{ tItem.pregnancyDays }}</td>
                            <td>{{ tItem.lactationDays }}</td>
                        </tr>
                        <tr v-for="(item,index) in 10-printItem.pigProductionRecordBoList.length" :key="index">
                            <td>{{index+1+printItem.pigProductionRecordBoList.length}}</td>
                            <td></td>
                            <td></td>
                            <td style="max-width:50px;word-wrap:break-word;"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </n-table>
                <!-- 第二个table -->
                <n-row class="mt-2-important" x-gap="30" :cols="10" gutter="30">
                    <n-col :span="18">
                        <n-row :cols="9">
                            <n-col :span="20">
                                <n-table bordered :single-line="false" size="small" class="font-10 w-100 text-center border-solid no-radius">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th colspan="2">批号</th>
                                            <th colspan="2">窝号</th>
                                            <th colspan="2">弱子0.8</th>
                                        </tr>
                                        <tr>
                                            <th rowspan="2">序号</th>
                                            <th colspan="6" class="text-center">寄养记录</th>
                                        </tr>
                                        <tr>
                                            <th>耳缺</th>
                                            <th>初生重</th>
                                            <th>断奶重</th>
                                            <th>死亡</th>
                                            <th>寄出</th>
                                            <th>寄入</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr v-for="(item,index) in 18" :key="index">
                                            <td>{{index+2}}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </n-table>
                                <n-table bordered :single-line="false" size="small" class="font-10 w-100 text-center border-solid no-radius" style="border-top:none;">
                                    <tbody>
                                        <tr>
                                            <td colspan="3" class>Sow BF registration</td>
                                            <td v-for="t in 12" :key="t"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">Sow ID</td>
                                            <td v-for="t in 12" :key="t"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="15">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>BF</td>
                                            <td>2.2</td>
                                            <td>2.3</td>
                                            <td>2.5</td>
                                            <td>2.4</td>
                                            <td>2.7</td>
                                            <td>2.8</td>
                                            <td>2.9</td>
                                            <td>3.0</td>
                                            <td>3.2</td>
                                            <td>3.4</td>
                                            <td>3.5</td>
                                            <td>3.7</td>
                                            <td>4.0</td>
                                        </tr>
                                        <tr>
                                            <td>Mating</td>
                                            <td v-for="t in 14" :key="t"></td>
                                        </tr>
                                        <tr>
                                            <td>Day 50</td>
                                            <td v-for="t in 14" :key="t"></td>
                                        </tr>
                                        <tr>
                                            <td>Farrowing</td>
                                            <td v-for="t in 14" :key="t"></td>
                                        </tr>
                                    </tbody>
                                </n-table>
                            </n-col>
                            <n-col :span="4">
                                <n-table bordered style="border-left: none;" :single-line="false" size="small" class="font-10 text-center border-solid no-radius">
                                    <thead style="border-color: #000;">
                                        <tr>
                                            <th colspan="2">畸形</th>
                                        </tr>
                                        <tr>
                                            <th colspan="2">母猪移动信息-1</th>
                                        </tr>
                                        <tr>
                                            <th width="100">移动时间</th>
                                            <th width="80">转到栏位或去向</th>
                                        </tr>
                                    </thead>
                                    <tbody style="border-color: #000;">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">移动原因</td>
                                        </tr>
                                        <tr>
                                            <td style="height: 220px;" class="text-left" colspan="2">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">母猪移动信息-2</td>
                                        </tr>
                                        <tr>
                                            <th width="100">移动时间</th>
                                            <th width="80">转到栏位或去向</th>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">移动原因</td>
                                        </tr>
                                        <tr>
                                            <td style="height: 224px;" colspan="2" class="text-left">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">断奶日期</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">断奶重量</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">断奶头数</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </n-table>
                            </n-col>
                        </n-row>
                    </n-col>
                    <n-col :span="6" class="relative">
                        <n-space vertical>
                            <div class="border-bottom-black font-weight-bolder font-20">
                                <span>育种值</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">母系指数</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.mIndex }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">父系指数</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.fIndex }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">ADG</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.adg }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">BF</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.bf }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">FCR</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.fcr }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">LMD</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.lmd }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">IMF</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.lmf }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">FI</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.fi }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">DAYS</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.days }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">WCI</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.wcl }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">NBA</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.nba }}</span>
                            </div>
                            <div class="border-bottom-black pt-1 font-weight-bolder flex">
                                <span class="flex-3">基因组育种值</span>
                                <span class="flex-5">{{ printItem.pigAncestry && printItem.pigAncestry.breedingLevel }}</span>
                            </div>
                        </n-space>
                        <n-space vertical class="mt-5 absolute" style="bottom:0">
                            <div class="font-20">预产期</div>
                            <h1>{{ timestampToTime(new Date(printItem.dueDate).getTime()) }}</h1>
                            <h1>{{ calcWeekDay(printItem.dueDate) }}</h1>
                        </n-space>
                    </n-col>
                </n-row>

                <!-- 底部 -->
                <n-grid x-gap="0" :cols="9" class="mt-3 page_bottom">
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">分娩日期</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">活仔数</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">死胎</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">木乃伊</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">分娩时背膘厚</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">断奶日期</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">断奶仔猪数</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">断奶前仔猪</div>
                            <div class="dotted_box"></div>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-space vertical>
                            <div class="text-center font-18">断奶时背膘厚</div>
                            <div class="dotted_box" style="border-right: 2px dotted black"></div>
                        </n-space>
                    </n-gi>
                </n-grid>
            </n-space>
            <div style="page-break-after:always;page-break-inside: avoid;"></div>
        </div>
        <!-- <div style="page-break-after: always;"></div>
        <div>123</div>-->
    </n-card>
</template>


<script>
    /**
     * 猪猪生育打印模板
     * @description 还可用ref.print([{},{}])的方式
     * @property {Array}			originData				要渲染的数据
     * */
    import { defineComponent, ref, getCurrentInstance, toRefs, reactive } from "vue"
    import helper from "@/utils/helper.js"

    export default defineComponent({
        props: {
            originData: {
                default: () => [{ pigProductionRecordBoList: [] }],
                type: Array,
            },
        },

        setup({ originData }) {
            const { proxy } = getCurrentInstance()
            const printPigCardRef = ref(null)
            const state = reactive({
                originData,
            })
            const methods = {
                calcWeekDay: dueDate => {
                    let days = new Date(dueDate).getDay()
                    let day = ""
                    switch (days) {
                        case 0:
                            day = "星期日"
                            break
                        case 1:
                            day = "星期一"
                            break
                        case 2:
                            day = "星期二"
                            break
                        case 3:
                            day = "星期三"
                            break
                        case 4:
                            day = "星期四"
                            break
                        case 5:
                            day = "星期五"
                            break
                        case 6:
                            day = "星期六"
                            break
                    }
                    return day
                },
            }
            const print = transmitData => {
                transmitData && (state.originData = transmitData)
                setTimeout(() => {
                    proxy.$print(printPigCardRef.value, { zoom: 0.55 })
                })
            }

            return {
                ...methods,
                timestampToTime: helper.timestampToTime,
                ...toRefs(state),
                printPigCardRef,
                print,
            }
        },
    })
</script>
<style lang="less" scoped>
    :deep(.n-descriptions
            .n-descriptions-table-wrapper
            .n-descriptions-table
            .n-descriptions-table-row
            .n-descriptions-table-content) {
        padding: 0;
    }
    .page_bottom {
        .dotted_box {
            border-left: 2px dotted black;
            // border-right: 2px dotted black;
            border-bottom: 2px dotted black;
            height: 40px;
        }
    }

    #printSemen {
        .line-height--5 {
            line-height: 0.5;
        }
        .font-kai {
            font-family: "行楷";
        }
        .line-height-1 {
            line-height: 1;
        }
        .font-130 {
            font-size: 130px;
        }
        .visible-hidden {
            visibility: hidden;
        }
        // .flex-1-15 {
        //     flex: 1.15;
        // }
        td,
        th {
            border-color: #000;
        }
        .border-solid {
            border-color: #000;
        }
        .absolute {
            position: absolute;
        }
        .mt-2-important {
            margin-top: 20px !important;
        }
        .no-radius {
            border-radius: 0;
        }
    }
</style>
