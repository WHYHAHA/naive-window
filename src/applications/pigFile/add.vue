<template>
    <div>
        <n-space vertical>
            <div class="p-2">
                <!-- 初生仔猪建档 -->
                <n-card>
                    <template #header>
                        <n-space align="center" justify="space-between">
                            <div class="mr-3">{{ $t("form.basic-form.newbornPigletsFile") }}</div>
                            <n-space align="center">
                                <n-button
                                    text
                                    tag="a"
                                    type="primary"
                                    href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/piglet-archive-upload-template.xlsx"
                                    target="_blank"
                                >{{ $t("button.downloadTemplate") }}</n-button>
                                <!-- 批量上传，下载上传模板 -->
                                <n-button type="info" class="col-2" @click="showImport = true">
                                    {{
                                    $t("button.batchUpload")
                                    }}
                                </n-button>
                            </n-space>
                        </n-space>
                    </template>

                    <div class="tabHeader font-20 font-weight-bolder">
                        <n-space align="center">
                            <!-- 初生仔猪建档 -->
                            {{ $t("form.basic-form.newbornPigletsFile") }}:
                        </n-space>
                    </div>

                    <n-card style="margin-bottom: 16px">
                        <n-tabs type="line" @update:value="handleUpdateValue" pane-style="background:#f0f2f5;padding:20px 30px">
                            <!-- 初生仔猪建档 -->
                            <n-tab-pane name="1" :tab="$t('form.basic-form.newbornPigletsFile')">
                                <n-space vertical :size="20">
                                    <n-card v-for="(itemFrom, index) in formList" :key="index" :title="'NO ' + (index + 1)" closable @close="closeFormItem(index)">
                                        <n-form label-placement="left" label-width="auto" :ref="setItemRef" :model="itemFrom" :rules="rulesForm">
                                            <n-space vertical>
                                                <!-- 错误信息 -->
                                                <n-text v-if="itemFrom.badFieldStr" type="error">
                                                    {{ $t("dtables.listing.theErrorMessage")
                                                    }}{{ itemFrom.badFieldStr }}
                                                </n-text>
                                                <!-- 填写母猪编号及性别，档案编号将会自动带出 -->
                                                <n-text code class="mb-2">
                                                    {{
                                                    $t(
                                                    "form.basic-form.newbornPigletsFile.prompt"
                                                    )
                                                    }}
                                                </n-text>
                                            </n-space>

                                            <n-grid x-gap="12" :cols="2">
                                                <n-gi>
                                                    <!-- 母猪个体号 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dataTable.listing.sowTheIndividual'
                                                            ) + '：'
                                                        "
                                                        path="pigMotherCode"
                                                    >
                                                        <!-- <n-input
                                                            v-model:value="itemFrom.pigMotherCode"
                                                            @update:value="
                                                                pigMotherCodeChange(
                                                                    itemFrom.pigMotherCode,
                                                                    index
                                                                )
                                                            "
                                                        />-->
                                                        <n-select
                                                            v-model:value="itemFrom.pigMotherCode"
                                                            :style="{ width: '60%' }"
                                                            :placeholder="
                                                                $t('dtables.listing.pleaseEnterThe')
                                                            "
                                                            clearable
                                                            remote
                                                            filterable
                                                            :options="pigCodeOptions"
                                                            :loading="loading"
                                                            @search="handleSearch"
                                                        />
                                                    </n-form-item>
                                                    <!-- 后裔： -->
                                                    <n-form-item :label="$t('dtables.listing.seed') + '：'" path="pigCode">
                                                        <n-select :options="pigList" v-model:value="itemFrom.pigCode" />
                                                    </n-form-item>

                                                    <!-- 出生体重 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dtables.listing.birthWeight') + '：'
                                                        "
                                                        path="bwt"
                                                    >
                                                        <n-input-number :min="0.01" :max="10" v-model:value="itemFrom.bwt" clearable />
                                                    </n-form-item>

                                                    <!-- 左乳头数 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.nippleNumber (left)'
                                                            ) + '：'
                                                        "
                                                        path="leftPapillaNum"
                                                    >
                                                        <n-input-number :min="1" :max="13" v-model:value="itemFrom.leftPapillaNum" clearable />
                                                    </n-form-item>

                                                    <!-- 目测体态 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dtables.listing.visualPosture') +
                                                            '：'
                                                        "
                                                        path="visualPosture"
                                                    >
                                                        <n-select
                                                            :options="
                                                                getDictionaries('visual_posture')
                                                            "
                                                            v-model:value="itemFrom.visualPosture"
                                                        />
                                                    </n-form-item>

                                                    <!-- 备注： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.remark') + '：'
                                                        "
                                                        path="remark"
                                                    >
                                                        <n-input v-model:value="itemFrom.remark" type="textarea" maxlength="200" show-count />
                                                    </n-form-item>
                                                </n-gi>

                                                <n-gi>
                                                    <!-- 性别： -->
                                                    <!-- formList.0.gender -->
                                                    <!-- {{`formList[${index}].gender`}} -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.gender') + '：'
                                                        "
                                                        path="gender"
                                                    >
                                                        <n-select
                                                            :options="getDictionaries('gender')"
                                                            v-model:value="itemFrom.gender"
                                                            @update:value="
                                                                genderChange(itemFrom.gender, index)
                                                            "
                                                        />
                                                    </n-form-item>
                                                    <!-- 耳标： -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.electronicEarLabel'
                                                            ) + '：'
                                                        "
                                                        path="earTagCode"
                                                    >
                                                        <n-input maxlength="15" v-model:value="itemFrom.earTagCode" />
                                                    </n-form-item>

                                                    <!-- 鼻头颜色 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.noseColor') + '：'
                                                        "
                                                        path="noseColor"
                                                    >
                                                        <n-select :options="getDictionaries('noseColor')" v-model:value="itemFrom.noseColor" />
                                                    </n-form-item>

                                                    <!-- 右乳头数 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.nippleNumber (right)'
                                                            ) + '：'
                                                        "
                                                        path="rightPapillaNum"
                                                    >
                                                        <n-input-number :min="1" :max="13" v-model:value="itemFrom.rightPapillaNum" clearable />
                                                    </n-form-item>

                                                    <!-- 遗传缺陷，有缺陷则展示 -->
                                                    <n-form-item
                                                        v-if="itemFrom.visualPosture == 3"
                                                        :label="
                                                            $t('dtables.listing.geneticDefect') +
                                                            '：'
                                                        "
                                                        path="deformit"
                                                    >
                                                        <n-select :options="getDictionaries('deformity')" v-model:value="itemFrom.deformit" />
                                                    </n-form-item>
                                                </n-gi>

                                                <n-gi></n-gi>
                                            </n-grid>
                                        </n-form>
                                    </n-card>
                                    <n-space vertical align="center" :size="20">
                                        <div class="addForm" @click="addFormItem">
                                            <div>
                                                <n-icon size="48" :depth="3">
                                                    <AddIcon />
                                                </n-icon>
                                            </div>
                                            <n-text depth="3">
                                                {{
                                                $t("dtables.listing.addNewPiglets")
                                                }}
                                            </n-text>
                                        </div>
                                        <n-space :size="30">
                                            <!-- 保存，取消 -->
                                            <n-button type="info" @click="handleValidateClick" class="col-2">{{ $t("button.preservation") }}</n-button>
                                            <n-button type="warning" @click="clearForm(true)" class="col-2">{{ $t("button.reset") }}</n-button>
                                        </n-space>
                                    </n-space>
                                </n-space>
                            </n-tab-pane>
                            <!-- 外场种猪建档 -->
                            <n-tab-pane name="2" :tab="$t('form.basic-form.fieldBreedingPig')">
                                <n-space vertical :size="20">
                                    <n-card v-for="(itemFrom, index) in formList" :key="index" :title="'NO ' + (index + 1)" closable @close="closeFormItem(index)">
                                        <n-form label-placement="left" :label-width="120" :ref="setItemRef" :model="itemFrom" :rules="rulesForm">
                                            <n-space vertical>
                                                <n-text v-if="itemFrom.badFieldStr" type="error">
                                                    {{ $t("dtables.listing.theErrorMessage")
                                                    }}{{ itemFrom.badFieldStr }}
                                                </n-text>
                                                <!-- 填写母猪编号及性别，档案编号将会自动带出 -->
                                                <n-text code class="mb-2">
                                                    {{
                                                    $t(
                                                    "form.basic-form.newbornPigletsFile.prompt"
                                                    )
                                                    }}
                                                </n-text>
                                            </n-space>
                                            <n-grid x-gap="12" :cols="2">
                                                <n-gi>
                                                    <!-- 种猪个体号： -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dataTable.listing.swineIndividuals'
                                                            ) + '：'
                                                        "
                                                        path="pigCode"
                                                    >
                                                        <n-input v-model:value="itemFrom.pigCode" maxlength="15" />
                                                    </n-form-item>
                                                    <!-- 品种： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.species') + '：'
                                                        "
                                                        path="pigSources"
                                                    >
                                                        <n-select :options="getDictionaries('pigSources')" v-model:value="itemFrom.pigSources" />
                                                    </n-form-item>

                                                    <!-- 出生体重 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dtables.listing.birthWeight') + '：'
                                                        "
                                                        path="bwt"
                                                    >
                                                        <n-input-number :min="0.01" :max="10" v-model:value="itemFrom.bwt" clearable />
                                                    </n-form-item>

                                                    <!-- 左乳头数 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.nippleNumber (left)'
                                                            ) + '：'
                                                        "
                                                        path="leftPapillaNum"
                                                    >
                                                        <n-input-number :min="1" :max="13" v-model:value="itemFrom.leftPapillaNum" clearable />
                                                    </n-form-item>

                                                    <!-- 目测体态 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dtables.listing.visualPosture') +
                                                            '：'
                                                        "
                                                        path="visualPosture"
                                                    >
                                                        <n-select
                                                            :options="
                                                                getDictionaries('visual_posture')
                                                            "
                                                            v-model:value="itemFrom.visualPosture"
                                                        />
                                                    </n-form-item>

                                                    <!-- 育种等级： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.breedingLevel') +
                                                            '：'
                                                        "
                                                        path="breedingLevel"
                                                    >
                                                        <n-select
                                                            :options="
                                                                getDictionaries('breedingLevel')
                                                            "
                                                            v-model:value="itemFrom.breedingLevel"
                                                        />
                                                    </n-form-item>
                                                    <!-- 育种状态： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.breedingStatus') +
                                                            '：'
                                                        "
                                                        path="breedingStatus"
                                                        v-if="
                                                            itemFrom.pigStatus == '后备' ||
                                                            itemFrom.pigStatus == '种猪'
                                                        "
                                                    >
                                                        <n-select
                                                            :options="
                                                                getDictionaries('breedingStatus')
                                                            "
                                                            v-model:value="itemFrom.breedingStatus"
                                                        />
                                                    </n-form-item>
                                                    <!-- 出生日期： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.dateOfBirth') +
                                                            '：'
                                                        "
                                                        path="pigBornDate"
                                                    >
                                                        <n-date-picker
                                                            :is-date-disabled="disablePreviousDate"
                                                            v-model:value="itemFrom.pigBornDate"
                                                            type="datetime"
                                                            clearable
                                                            @focus="
                                                                e => {
                                                                    e.target.blur()
                                                                }
                                                            "
                                                        />
                                                    </n-form-item>
                                                    <!-- 育种值： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.breedingValue') +
                                                            '：'
                                                        "
                                                        path="breedingValue"
                                                    >
                                                        <n-input v-model:value="itemFrom.breedingValue" />
                                                    </n-form-item>
                                                    <!-- 栋舍： -->
                                                    <n-form-item :label="$t('dataTable.listing.Dorm') + '：'" path="nowDormCode">
                                                        <n-select
                                                            v-model:value="itemFrom.nowDormCode"
                                                            :options="
                                                                getDormListForFarmId(
                                                                    itemFrom.nowFarmid
                                                                )
                                                            "
                                                            filterable
                                                            @update:value="
                                                                itemFrom.nowColumnCode = null
                                                            "
                                                        />
                                                    </n-form-item>
                                                    <!-- 母亲： -->
                                                    <n-form-item :label="$t('dtables.listing.mother') + '：'">
                                                        <n-input v-model:value="itemFrom.pigMotherCode" />
                                                    </n-form-item>

                                                    <!-- 同窝仔猪数 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.numberOfPigletsInTheSameLitter'
                                                            ) + '：'
                                                        "
                                                        path="littermate"
                                                    >
                                                        <n-input-number :min="1" :max="999" v-model:value="itemFrom.littermate" clearable />
                                                    </n-form-item>
                                                    <!-- 备注： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.remark') + '：'
                                                        "
                                                        path="remark"
                                                    >
                                                        <n-input v-model:value="itemFrom.remark" type="textarea" maxlength="200" show-count />
                                                    </n-form-item>
                                                </n-gi>
                                                <n-gi>
                                                    <!-- 电子耳标号： -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.electronicEarLabel'
                                                            ) + '：'
                                                        "
                                                        path="earTagCode"
                                                    >
                                                        <n-input v-model:value="itemFrom.earTagCode" />
                                                    </n-form-item>
                                                    <!-- 性别： -->

                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.gender') + '：'
                                                        "
                                                        path="gender"
                                                    >
                                                        <n-select :options="getDictionaries('gender')" v-model:value="itemFrom.gender" />
                                                    </n-form-item>
                                                    <!-- 品种品系： -->

                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dataTable.listing.varietiesOfStrain'
                                                            ) + '：'
                                                        "
                                                        path="strain"
                                                    >
                                                        <!-- <n-input v-model:value="itemFrom.strain" /> -->
                                                        <n-select v-model:value="compositeBoarStrain" :options="selectFatherOptions" clearable filterable />
                                                    </n-form-item>
                                                    <!-- 右乳头数 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.nippleNumber (right)'
                                                            ) + '：'
                                                        "
                                                        path="rightPapillaNum"
                                                    >
                                                        <n-input-number :min="1" :max="13" v-model:value="itemFrom.rightPapillaNum" clearable />
                                                    </n-form-item>

                                                    <!-- 遗传缺陷，有缺陷则展示 -->
                                                    <n-form-item
                                                        v-if="itemFrom.visualPosture == 3"
                                                        :label="
                                                            $t('dtables.listing.geneticDefect') +
                                                            '：'
                                                        "
                                                        path="deformit"
                                                    >
                                                        <n-select :options="getDictionaries('deformity')" v-model:value="itemFrom.deformit" />
                                                    </n-form-item>

                                                    <!-- 鼻头颜色 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.noseColor') + '：'
                                                        "
                                                        path="noseColor"
                                                    >
                                                        <n-select :options="getDictionaries('noseColor')" v-model:value="itemFrom.noseColor" />
                                                    </n-form-item>
                                                    <!-- 当前状态： -->

                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.currentState') +
                                                            '：'
                                                        "
                                                        path="pigStatus"
                                                    >
                                                        <n-select :options="getDictionaries('pigStatus')" v-model:value="itemFrom.pigStatus" />
                                                    </n-form-item>

                                                    <!-- 猪场： -->

                                                    <n-form-item :label="$t('dataTable.listing.pig') + '：'" path="nowFarmid">
                                                        <n-select
                                                            v-model:value="itemFrom.nowFarmid"
                                                            :options="getDictionaries('farmList')"
                                                            filterable
                                                            @update:value="
                                                                () => {
                                                                    itemFrom.nowDormCode = null
                                                                    itemFrom.nowColumnCode = null
                                                                }
                                                            "
                                                        />
                                                    </n-form-item>

                                                    <!-- 栏： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.columnn') + '：'
                                                        "
                                                        path="nowColumnCode"
                                                    >
                                                        <n-select
                                                            v-model:value="itemFrom.nowColumnCode"
                                                            :options="
                                                                getColumnListForDormId(
                                                                    itemFrom.nowDormCode
                                                                )
                                                            "
                                                            filterable
                                                        />
                                                    </n-form-item>
                                                    <!-- 父亲： -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dataTable.listing.father') + '：'
                                                        "
                                                    >
                                                        <n-input v-model:value="itemFrom.pigFatherCode" />
                                                    </n-form-item>

                                                    <!-- 外购来源 -->
                                                    <n-form-item
                                                        :label="
                                                            $t(
                                                                'dtables.listing.outsourcingSource'
                                                            ) + '：'
                                                        "
                                                        path="outsourcingSource"
                                                    >
                                                        <n-input
                                                            v-model:value="
                                                                itemFrom.outsourcingSource
                                                            "
                                                            maxlength="20"
                                                        />
                                                    </n-form-item>

                                                    <!-- 出生胎次 -->
                                                    <n-form-item
                                                        :label="
                                                            $t('dtables.listing.birthOrder') + '：'
                                                        "
                                                        path="productBreedingBatch"
                                                    >
                                                        <n-input-number
                                                            :min="1"
                                                            :max="999"
                                                            v-model:value="
                                                                itemFrom.productBreedingBatch
                                                            "
                                                            clearable
                                                        />
                                                        <!-- <n-input
                                                            v-model:value="
                                                                itemFrom.productBreedingBatch
                                                            "
                                                            maxlength="20"
                                                        />-->
                                                    </n-form-item>
                                                </n-gi>
                                            </n-grid>
                                        </n-form>
                                    </n-card>
                                    <n-space vertical align="center" :size="20">
                                        <div class="addForm" @click="addFormItem">
                                            <div>
                                                <n-icon size="48" :depth="3">
                                                    <AddIcon />
                                                </n-icon>
                                            </div>
                                            <n-text depth="3">
                                                {{
                                                $t("dtables.listing.addNewPiglets")
                                                }}
                                            </n-text>
                                        </div>
                                        <n-space :size="30">
                                            <!-- 保存，取消 -->
                                            <n-button type="info" @click="handleValidateClick" class="col-2">{{ $t("button.preservation") }}</n-button>
                                            <n-button type="warning" @click="clearForm(true)" class="col-2">{{ $t("button.reset") }}</n-button>
                                        </n-space>
                                    </n-space>
                                </n-space>
                            </n-tab-pane>
                        </n-tabs>
                    </n-card>
                </n-card>
            </div>
        </n-space>
        <!-- 导入 -->
        <eximportComponents v-model:openImport="showImport" @getEximportData="getEximportData" apiUrl="batchAddPmPigArchivesApi"></eximportComponents>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, h, ref, onMounted, computed } from "vue"
    import { NButton, useMessage, useDialog } from "naive-ui"
    import { addPmPigApi } from "@/api/pigFile.js"
    import { getPigInfoByRuttingCodeApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"
    import { Add20Regular as AddIcon } from "@vicons/fluent"
    import { useI18n } from "vue-i18n"
    import { getwithStrain } from "@/api/varietiesOfStrain.js"
    import eximportComponents from "@/components/exImport.vue"

    export default defineComponent({
        props: {
            pageData: Object
        },
        components: {
            eximportComponents,
            AddIcon
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const { t } = useI18n()
            const dialog = useDialog()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            let itemRefs = []
            const setItemRef = el => {
                if (el) {
                    itemRefs.push(el)
                }
            }
            const state = reactive({
                page: 1,
                // 开关-导入弹框
                showImport: false,
                // 开关-展示右侧空列表
                showEmpty: true,
                leftClickIndex: -1,
                // 搜索选项
                search: {
                    pigCode: ""
                },
                // 添加时返回的错误提示
                errorMsg: "",
                // 导入数据列表
                jsonData: [],
                // 搜索时的原始列表
                originalList: [],
                leftList: [],
                // 根据母编码与性别 获取pigCode列表数据
                pigList: [],
                formList: [
                    {
                        pigCode: null,
                        earTagCode: null,
                        earBrandCode: null,
                        pigSources: null,
                        pigBornDate: null,
                        gender: null,
                        pigMotherCode: null,
                        batchNumber: null,
                        bwt: null,
                        leftPapillaNum: null,
                        rightPapillaNum: null,
                        noseColor: null,
                        visualPosture: null,
                        source: 1,
                        remark: null,
                        pigStatus: null,
                        deformit: null,
                        breedingLevel: null,
                        breedingStatus: null,
                        nowFarmid: null,
                        nowDormCode: null,
                        nowColumnCode: null,
                        strain: null
                    }
                ],

                pigFarmList: [],
                columns: [],
                ramDicColumns: [],
                compositeBoarStrain: "",
                selectFatherOptions: [],
                // 母猪编码
                pigCodeOptions: []
            })

            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
                }
            })
            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })

            const getDormListForFarmId = computed(() => {
                return function (farmId) {
                    return store.getters["dictionaries/getDormListForFarmId"](farmId)
                }
            })
            const getColumnListForDormId = computed(() => {
                return function (dormId) {
                    return store.getters["dictionaries/getColumnListForDormId"](dormId)
                }
            })

            let messageReactive = reactive(null)

            const createLoadingMessage = () => {
                dialog.warning({
                    title: t("dataTable.listing.warning"),
                    content: t("dtables.listing.confirmTheBatchUpload"),
                    positiveText: t("dataTable.listing.determine"),
                    negativeText: t("dtables.listing.cancel"),
                    onPositiveClick: () => {
                        if (!messageReactive) {
                            messageReactive = message.loading(t("dtables.listing.areTheNewSwine"), {
                                duration: 0
                            })
                            addPmPig()
                        }
                    }
                })
            }
            const removeMessage = () => {
                if (messageReactive) {
                    messageReactive.destroy()
                    messageReactive = null
                }
            }

            const pigMotherCodeChange = (pigMotherCode, formIndex) => {
                if (pigMotherCode.length == 15) {
                    // 触发时清空 仔编码、耳标 档案编码选项组
                    state.pigList = []
                    state.formList[formIndex].pigCode = null
                    state.formList[formIndex].earTagCode = null
                    getPigInfoByRuttingCode(pigMotherCode, state.formList[formIndex].gender || "")
                }
            }
            const genderChange = (gender, formIndex) => {
                if (gender && state.formList[formIndex].pigMotherCode.length == 15) {
                    // 触发时清空 仔编码、耳标 档案编码选项组
                    state.pigList = []
                    state.formList[formIndex].pigCode = null
                    state.formList[formIndex].earTagCode = null
                    getPigInfoByRuttingCode(
                        state.formList[formIndex].pigMotherCode,
                        state.formList[formIndex].gender
                    )
                }
            }
            // 异步加载（模糊后6位）
            const handleSearch = async query => {
                optionsRef.value = []
                if (query.length == 6) {
                    loadingRef.value = true
                    await getfuzzyQuery({ searchInfo: query }).then(res => {
                        loadingRef.value = false
                        if (res.code == 0) {
                            state.pigCodeOptions = res.data
                            state.pigCodeOptions.forEach(item => {
                                return (item.value = item.pigCode), (item.label = item.pigCode)
                            })
                        }
                    })
                }
                if (query.length == 15) {
                    state.pigCodeOptions = []
                    state.pigCodeOptions.push({
                        label: query,
                        value: query
                    })
                }
            }
            // 获取字典
            const getPigInfoByRuttingCode = async (pigMotherCode, gender) => {
                if (!messageReactive) {
                    messageReactive = message.loading(t("dtables.listing.beingLoadedFileInformation"), {
                        duration: 0
                    })
                }
                await getPigInfoByRuttingCodeApi({
                    pigCode: pigMotherCode,
                    gender: gender
                }).then(res => {
                    removeMessage()
                    if (res.code == 0) {
                        state.pigList = res.data.map(item => ({
                            label: item,
                            value: item
                        }))
                    }
                })
            }
            const closeFormItem = index => {
                dialog.warning({
                    title: t("dataTable.listing.warning"),
                    content: t("dtables.listing.areYouSureToDeleteThisOption"),
                    positiveText: t("dataTable.listing.determine"),
                    negativeText: t("dtables.listing.cancel"),
                    maskClosable: false,
                    onPositiveClick: () => {
                        state.formList.splice(index, 1)
                    }
                })
            }
            // 添加种猪
            const addPmPig = async () => {
                state.errorMsg = ""
                let formData = { models: state.formList }
                if (!messageReactive) {
                    messageReactive = window.$message.loading(
                        t("dtables.listing.inTheBatchOperation"),
                        {
                            duration: 0
                        }
                    )
                }
                await addPmPigApi(formData).then(res => {
                    removeMessage()
                    if (res.code == 0) {
                        if (res.data.loseNum == 0) {
                            window.$message.success(t("dtables.listing.newBreedingSuccess"))
                            clearForm(false)
                        } else {
                            state.formList = res.data.badList
                            state.formList.forEach(element => {
                                element.badFieldStr = element.badField.toLocaleString()
                                element.pigBornDate = new Date(element.pigBornDate).getTime()
                            })
                            // 您有
                            window.$message.error(
                                t("dataTable.listing.doYouHave") +
                                    res.data.loseNum +
                                    t("dataTable.listing.theErrorInformationSwine")
                            )
                        }
                    }
                })
            }
            const clearForm = showDialog => {
                if (showDialog) {
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dtables.listing.confirmTheResetTheForm"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            state.formList = [
                                {
                                    breedingValue: null,
                                    pigCode: null,
                                    earTagCode: null,
                                    earBrandCode: null,
                                    pigSources: null,
                                    pigBornDate: null,
                                    gender: null,
                                    pigMotherCode: null,
                                    pigFatherCode: null,
                                    batchNumber: null,
                                    bwt: null,
                                    leftPapillaNum: null,
                                    rightPapillaNum: null,
                                    noseColor: null,
                                    visualPosture: null,
                                    source: 1,
                                    remark: null,
                                    pigStatus: null,
                                    deformit: null,
                                    breedingLevel: null,
                                    breedingStatus: null,
                                    nowFarmid: null,
                                    nowDormCode: null,
                                    nowColumnCode: null,
                                    strain: null,
                                    outsourcingSource: null,
                                    productBreedingBatch: null,
                                    littermate: null
                                }
                            ]
                            itemRefs.forEach(t => {
                                t.restoreValidation()
                            })
                        }
                    })
                } else {
                    state.formList = [
                        {
                            breedingValue: null,
                            pigCode: null,
                            earTagCode: null,
                            earBrandCode: null,
                            pigSources: null,
                            pigBornDate: null,
                            gender: null,
                            pigMotherCode: null,
                            pigFatherCode: null,
                            batchNumber: null,
                            bwt: null,
                            leftPapillaNum: null,
                            rightPapillaNum: null,
                            noseColor: null,
                            visualPosture: null,
                            source: 1,
                            remark: null,
                            pigStatus: null,
                            deformit: null,
                            breedingLevel: null,
                            breedingStatus: null,
                            nowFarmid: null,
                            nowDormCode: null,
                            nowColumnCode: null,
                            strain: null,
                            outsourcingSource: null,
                            productBreedingBatch: null,
                            littermate: null
                        }
                    ]
                    itemRefs.forEach(t => {
                        t.restoreValidation()
                    })
                }
            }
            const updateDetail = (rowData, index) => {
                state.leftClickIndex = index
                state.showEmpty = false
                state.form = JSON.parse(JSON.stringify(rowData))
                message.success(t("dtables.listing.onTheLeftSideOfTheData"))
            }
            const setColumns = () => {
                state.columns = [
                    {
                        title: () => t("dataTable.listing.pigletCode"),
                        key: "pigCode",
                        align: "center"
                    },
                    {
                        title: () => t("dtables.listing.source"),
                        key: "source",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "source",
                                row.source
                            )
                        }
                    },
                    {
                        title: () => t("dataTable.listing.gender"),
                        key: "gender",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        title: () => t("dtables.listing.earTag"),
                        key: "earTagCode"
                    },
                    {
                        title: () => t("dataTable.listing.actions"),
                        key: "actions",
                        render(row, index) {
                            return h(
                                NButton,
                                {
                                    size: "small",
                                    type: "info",
                                    onClick: () => updateDetail(row, index)
                                },
                                {
                                    default: () => t("dtables.listing.editTheDetails")
                                }
                            )
                        }
                    }
                ]
            }
            // 在此改变数值的类型，用于校验
            const changeFormDataType = () => {
                const typeList = [
                    "leftPapillaNum",
                    "bwt",
                    "rightPapillaNum",
                    "littermate",
                    "productBreedingBatch",
                    "pigBornDate"
                    // "deformit"
                ]
                state.formList.forEach(t => {
                    typeList.forEach(tc => (t[tc] = t[tc] ? Number(t[tc]) : null))
                })
            }
            const addFormItem = () => {
                state.formList.push({
                    pigCode: null,
                    earTagCode: null,
                    earBrandCode: null,
                    pigSources: null,
                    pigBornDate: null,
                    gender: null,
                    pigMotherCode: null,
                    batchNumber: null,
                    bwt: null,
                    leftPapillaNum: null,
                    rightPapillaNum: null,
                    noseColor: null,
                    visualPosture: null,
                    source: 1,
                    remark: null,
                    pigStatus: null,
                    deformit: null,
                    breedingLevel: null,
                    breedingStatus: null,
                    nowFarmid: null,
                    nowDormCode: null,
                    nowColumnCode: null,
                    strain: null,
                    outsourcingSource: null,
                    productBreedingBatch: null,
                    littermate: null
                })
                itemRefs = []
                // let ruleItem = JSON.parse(JSON.stringify(state.rule[0]))
                // state.rule.push(ruleItem)
            }
            // 获取品种品系
            const viewTheSyntheticCode = async () => {
                await getwithStrain({ tableName: "pm_pig_sources_strain" }).then(res => {
                    if (res.code == 0) {
                        state.selectFatherOptions = res.data.map(item => {
                            return {
                                label: item.strainName,
                                value: item.strainCode
                            }
                        })
                    }
                })
            }
            onMounted(() => {
                setColumns()
                viewTheSyntheticCode()
            })
            return {
                ...toRefs(state),
                formRef,
                closeFormItem,
                createLoadingMessage,
                getDictionarieName,
                getDictionaries,
                getDormListForFarmId,
                getColumnListForDormId,
                addFormItem,
                pigMotherCodeChange,
                genderChange,
                setItemRef,
                pagination: {
                    pageSize: 10
                },
                clearForm,

                rulesForm: {
                    gender: {
                        required: true,
                        message: t("dataTable.listing.pleaseSelectAGender"),
                        trigger: "input"
                    },
                    pigCode: {
                        required: true,
                        min: 15,
                        max: 15,
                        message: t("dtables.listing.pleaseEnterThe 15FileEncoding"),
                        trigger: ["blur", "input"]
                    },
                    earBrandCode: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseTheInputEar"),
                        trigger: ["blur", "input"]
                    },
                    pigSources: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectVarieties"),
                        trigger: ["blur", "input"]
                    },

                    pigStatus: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTheCurrentState"),
                        trigger: ["blur", "input"]
                    },
                    leftPapillaNum: [
                        {
                            type: "number",
                            required: true,
                            message: t("dtables.listing.pleaseEnterTheNippleNumber (left)"),
                            trigger: ["blur", "input"]
                        },
                        {
                            type: "integer",
                            message: t("dtables.listing.cannotBeDecimal"),
                            trigger: ["blur", "input"]
                        }
                    ],
                    rightPapillaNum: [
                        {
                            type: "number",
                            required: true,
                            message: t("dtables.listing.pleaseEnterTheNippleNumber (right)"),
                            trigger: ["blur", "input"]
                        },
                        {
                            type: "integer",
                            message: t("dtables.listing.cannotBeDecimal"),
                            trigger: ["blur", "input"]
                        }
                    ],
                    noseColor: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectANoseColor"),
                        trigger: ["blur", "input"]
                    },
                    visualPosture: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectANoseColor"),
                        trigger: ["blur", "input"]
                    },
                    source: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectASource"),
                        trigger: ["blur", "input"]
                    },
                    bwt: [
                        {
                            type: "number",
                            required: true,
                            message: t("dtables.listing.pleaseEnterTheWeight"),
                            trigger: ["blur", "input"]
                        },
                        {
                            trigger: ["blur", "input"],
                            message: t("dtables.listing.youCanEnterUpToTwoDecimalPlaces"),
                            validator: (rule, value) => !/[0-9]+.[0-9]{3,}/.test(value)
                        }
                    ],
                    littermate: {
                        type: "integer",
                        message: t("dtables.listing.cannotBeDecimal"),
                        trigger: ["blur", "input"]
                    },
                    productBreedingBatch: {
                        type: "integer",
                        message: t("dtables.listing.cannotBeDecimal"),
                        trigger: ["blur", "input"]
                    },
                    breedingLevel: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectBreedingLevel"),
                        trigger: ["blur", "input"]
                    },
                    breedingStatus: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectBreedingCondition"),
                        trigger: ["blur", "input"]
                    },
                    deformit: {
                        type: "string",
                        required: true,
                        message: t("dtables.listing.pleaseSelectATypeOfDefect"),
                        trigger: ["blur", "input"]
                    },
                    columnCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheCurrentField"),
                        trigger: ["blur", "input"]
                    },
                    pigMotherCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheMotherCode"),
                        trigger: ["blur", "input"]
                    },
                    pigBornDate: {
                        type: "number",
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheDateOfBirth"),
                        trigger: ["blur", "input"]
                    }
                },
                // 获取导入数据
                getEximportData(data) {
                    state.jsonData = data
                    state.leftList = [...state.leftList, ...data]
                    state.showImport = false
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleUpdateValue: tabName => {
                    itemRefs = []
                    state.formList = [
                        {
                            pigCode: null,
                            earTagCode: null,
                            earBrandCode: null,
                            pigSources: null,
                            pigBornDate: null,
                            gender: null,
                            pigMotherCode: null,
                            batchNumber: null,
                            bwt: null,
                            leftPapillaNum: null,
                            rightPapillaNum: null,
                            noseColor: null,
                            visualPosture: null,
                            source: tabName,
                            remark: null,
                            pigStatus: null,
                            deformit: null,
                            breedingLevel: null,
                            breedingStatus: null,
                            nowFarmid: null,
                            nowDormCode: null,
                            nowColumnCode: null,
                            strain: null
                        }
                    ]
                },
                // 右侧表单提交
                handleValidateClick() {
                    let promiseList = []
                    let errorIndexList = []
                    changeFormDataType()
                    itemRefs.forEach((item, index) => {
                        // item 即为对应的组件ref
                        // 可通过 item 获取对应组件上的属性或方法
                        promiseList.push(
                            new Promise((resolve, reject) => {
                                item.validate(errors => {
                                    if (!errors) {
                                        resolve()
                                    } else {
                                        errorIndexList.push(index + 1)
                                        reject()
                                    }
                                })
                            })
                        )
                    })
                    Promise.all(promiseList)
                        .then(() => {
                            //验证成功 向提交数据
                            addPmPig()
                        })
                        .catch(() => {
                            message.error(
                                t("dataTable.listing.serialNumber") +
                                    errorIndexList.toLocaleString() +
                                    t("dtables.listing.theDataFormatIsNotCorrect")
                            )
                        })
                },
                viewTheSyntheticCode,
                // 模糊搜索
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef
            }
        }
    })
</script>
<style lang="less" scoped>
    .addForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid rgb(224, 224, 230);
        width: 400px;
        padding: 10px;
        background: white;

        &:hover {
            cursor: pointer;
            transition: border 0.3s;
            border: 1px solid #36ad6a;
        }
    }
</style>
