<template>
    <!-- <button v-print="'#printSemen'">Print local range</button> -->
    <n-card
        ref="printSemenRef"
        id="printSemen"
        :bordered="false"
        style="width: 450px"
        content-style="padding: 0;"
        v-show="false"
    >
        <div v-for="semenItem in originData" :key="semenItem" class="border">
            <n-grid :x-gap="0" :cols="2">
                <n-grid-item style="position: relative">
                    <div class="imgbox">
                        <n-image width="200" :src="'data:image/jpg;base64,' + semenItem.qrcode" />
                        <div>{{ semenItem.id }}</div>
                    </div>
                </n-grid-item>
                <n-grid-item>
                    <n-table bordered :single-line="false" size="small">
                        <thead>
                            <tr>
                                <th colspan="2">母猪信息：</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <h4>猪号：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.pigCode }}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4>栋舍：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.dormName }}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4>栏位：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.columnCode }}</h4>
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                    <n-table bordered :single-line="false" size="small">
                        <thead>
                            <tr>
                                <th colspan="2" class="bg-secondary">公猪信息：</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <h4>猪号：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.boarPigCode }}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4>栋舍：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.boarDormName }}</h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h4>栏位：</h4>
                                </td>
                                <td>
                                    <h4>{{ semenItem.boarColumnCode }}</h4>
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                </n-grid-item>
            </n-grid>
            <div style="page-break-after: always; page-break-inside: avoid"></div>
        </div>
    </n-card>
</template>

<script>
    import { defineComponent, ref, getCurrentInstance, reactive, toRefs } from "vue"

    export default defineComponent({
        props: {
            originData: {
                default: () => [],
                type: Array
            }
        },
        setup({ originData }) {
            const { proxy } = getCurrentInstance()
            const printSemenRef = ref(null)
            const state = reactive({
                originData
            })
            const print = transmitData => {
                transmitData && (state.originData = transmitData)
                setTimeout(() => {
                    proxy.$print(printSemenRef.value)
                })
            }

            return {
                ...toRefs(state),
                printSemenRef,
                print
            }
        }
    })
</script>
<style scope>
    .imgbox {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translate(0%, -50%);
        text-align: center;
    }
</style>
