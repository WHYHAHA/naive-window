<template>
    <div class="p-2">
        <!-- 选配清单 -->
        <n-card :title="$t('dataTable.listing.optionalList')">
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.optionalList") }}</div>
                    <n-space align="center">
                        <!-- 导入，导出，模板 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/gilt-optional-upload-template.xlsx"
                            target="_blank"
                        >
                            {{ $t("button.downloadTemplate") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showImport = true">
                            {{ $t("button.import") }}
                        </n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">
                            {{ $t("button.export") }}
                        </n-button>
                        <!-- 完成本次选配 -->
                        <n-button type="info" class="pl-3 pr-3" @click="finsh">
                            {{ $t("dataTable.listing.completeThisMatching") }}
                        </n-button>
                    </n-space>
                </n-space>
            </template>
            <!-- tab栏 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待选配" :tab="$t('dataTable.listing.forMatching')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 待选配记录 -->
                                            <div>
                                                {{ $t("dataTable.listing.forMatchingRecords") }}:
                                            </div>
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getPigOptionalList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getPigOptionalList()
                                                    }
                                                "
                                            >
                                                <template #prefix>
                                                    <n-icon>
                                                        <searchIcon />
                                                    </n-icon>
                                                </template>
                                            </n-input>
                                        </div>
                                    </n-space>
                                </div>
                                <tableComponents
                                    size="small"
                                    :columns="columns"
                                    :data="pigOptionalList"
                                    :loading="showloading"
                                    :scroll-x="1200"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getPigOptionalList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 母猪选配详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.sowMatchingDetails") }}:
                                            </div>
                                            <!-- 编辑选配 （超三天 不是放弃选配 订单状态不是已加入）-->
                                            <n-button
                                                type="info"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="editTheSelected"
                                                >{{
                                                    $t("dataTable.listing.editOptional")
                                                }}</n-button
                                            >
                                            <!-- 放弃选配 （超三天 不是放弃选配 订单状态不是已加入） -->
                                            <n-button
                                                type="error"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="deletePigOptionalBtn()"
                                                >{{
                                                    $t("dataTable.listing.abandonOption")
                                                }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                </n-card>
                                <n-scrollbar
                                    style="max-height: 500px"
                                    v-if="pigOptionalDetail.theSow[0].pigCode"
                                >
                                    <n-card content-style="padding: 0;">
                                        <div class="p-3">
                                            <!--母猪档案，档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码  -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="$t('dataTable.listing.sowFile') + '：'"
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theSow[0].pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theSow[0].pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theSow[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theSow[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theSow[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theSow[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theSow[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                        </div>
                                    </n-card>
                                    <!-- 暂无选配公猪（主） -->
                                    <n-card content-style="padding: 0;" class="mt-2">
                                        <div class="p-3" v-if="pigOptionalDetail.theMaleMain">
                                            <!--选配公猪（主），档案编码，耳牌，父编码，母编码 ，品种 ，出生日期，祖编码-->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarMaster') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <!-- 品种品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（主） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <!-- <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item> -->
                                                <!-- 匹配参数 -->
                                                <!-- 合成品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .offspringStrain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarMaster')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                    <n-card content-style="padding: 0;" class="mt-2 mb-2">
                                        <div class="p-3" v-if="pigOptionalDetail.alternativeBoar">
                                            <!-- 选配公猪（备），档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarS') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigCode || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .strain || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .mIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .fIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（备） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <!-- <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item> -->
                                                <!-- 匹配参数 -->
                                                <!-- 合成品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                    >{{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .offspringStrain ||
                                                        $t("dtables.listing.empty")
                                                    }}</n-descriptions-item
                                                >
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarS')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                </n-scrollbar>
                                <n-empty
                                    v-else
                                    :description="
                                        $t(
                                            'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                        )
                                    "
                                    class="mt-3"
                                ></n-empty>

                                <div
                                    class="mt-2 pl-3"
                                    v-if="
                                        leftClickRow.id &&
                                        dateInTwoDay(leftClickRow.matapplyDate) &&
                                        leftClickRow.matchStatus != 3 &&
                                        leftClickRow.indentStatus != 1
                                    "
                                >
                                    <n-space>
                                        <!-- 保存，取消 -->
                                        <n-button type="info" @click="hybridization">
                                            {{ $t("button.preservation") }}
                                        </n-button>
                                        <n-button @click="clearPigOptionalDetail">
                                            {{ $t("button.cancel") }}
                                        </n-button>
                                    </n-space>
                                </div>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="已选配" :tab="$t('dataTable.listing.hasBeenSelected')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 选配记录 -->
                                            <div>{{ $t("dataTable.listing.matchingRecord") }}:</div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getPigOptionalList()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getPigOptionalList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getPigOptionalList()
                                                    }
                                                "
                                            >
                                                <template #prefix>
                                                    <n-icon>
                                                        <searchIcon />
                                                    </n-icon>
                                                </template>
                                            </n-input>
                                        </div>
                                    </n-space>
                                </div>
                                <tableComponents
                                    size="small"
                                    :columns="columns"
                                    :data="pigOptionalList"
                                    :loading="showloading"
                                    :scroll-x="1200"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getPigOptionalList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 母猪选配详情 -->

                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.sowMatchingDetails") }}:
                                            </div>
                                            <!-- 编辑选配 -->
                                            <n-button
                                                type="info"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="editTheSelected"
                                                >{{
                                                    $t("dataTable.listing.editOptional")
                                                }}</n-button
                                            >
                                            <!-- 放弃选配 -->
                                            <n-button
                                                type="error"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="deletePigOptionalBtn()"
                                                >{{
                                                    $t("dataTable.listing.abandonOption")
                                                }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                </n-card>
                                <n-scrollbar
                                    style="max-height: 500px"
                                    v-if="pigOptionalDetail.theSow[0].pigCode"
                                >
                                    <n-card content-style="padding: 0;">
                                        <div class="p-3">
                                            <!--母猪档案，档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码  -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="$t('dataTable.listing.sowFile') + '：'"
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theSow[0].pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theSow[0].pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <!-- 品种品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theSow[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theSow[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theSow[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theSow[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theSow[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                        </div>
                                    </n-card>
                                    <!-- 暂无选配公猪（主） -->
                                    <n-card content-style="padding: 0;" class="mt-2">
                                        <div class="p-3" v-if="pigOptionalDetail.theMaleMain">
                                            <!--选配公猪（主），档案编码，耳牌，父编码，母编码 ，品种 ，出生日期，祖编码-->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarMaster') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <!-- 品种品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（主） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item>
                                                <!-- 匹配参数 -->
                                                <!-- 合成品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                    >{{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .offspringStrain ||
                                                        $t("dtables.listing.empty")
                                                    }}</n-descriptions-item
                                                >
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarMaster')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                    <n-card content-style="padding: 0;" class="mt-2 mb-2">
                                        <div class="p-3" v-if="pigOptionalDetail.alternativeBoar">
                                            <!-- 选配公猪（备），档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarS') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigCode || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .strain || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .mIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .fIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（备） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item>
                                                <!-- 匹配参数 -->
                                                <!-- 合成品系 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                    >{{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .offspringStrain ||
                                                        $t("dtables.listing.empty")
                                                    }}</n-descriptions-item
                                                >
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarS')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                </n-scrollbar>
                                <n-empty
                                    v-else
                                    :description="
                                        $t(
                                            'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                        )
                                    "
                                    class="mt-3"
                                ></n-empty>

                                <div
                                    class="mt-2 pl-3"
                                    v-if="
                                        leftClickRow.id &&
                                        dateInTwoDay(leftClickRow.matapplyDate) &&
                                        leftClickRow.matchStatus != 3 &&
                                        leftClickRow.indentStatus != 1
                                    "
                                >
                                    <n-space>
                                        <!-- 保存，取消 -->
                                        <n-button type="info" @click="hybridization">
                                            {{ $t("button.preservation") }}
                                        </n-button>
                                        <n-button @click="clearPigOptionalDetail">
                                            {{ $t("button.cancel") }}
                                        </n-button>
                                    </n-space>
                                </div>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                    <n-tab-pane name="放弃选配" :tab="$t('dataTable.listing.abandonOption')">
                        <n-grid x-gap="12" cols="10" item-responsive>
                            <n-gi span="6 400:6 600:6 800:6">
                                <div class="tabHeader font-16 font-weight-bolder">
                                    <n-space justify="space-between">
                                        <n-space align="center">
                                            <!-- 放弃选配记录 -->
                                            <div>
                                                {{
                                                    $t(
                                                        "dataTable.listing.giveUpTheMatchingRecords"
                                                    )
                                                }}:
                                            </div>
                                            <n-date-picker
                                                v-model:value="timeList"
                                                type="daterange"
                                                :shortcuts="rangeShortcuts"
                                                :is-date-disabled="disablePreviousDate"
                                                @update:value="
                                                    () => {
                                                        search.page = 1
                                                        getPigOptionalList()
                                                    }
                                                "
                                                actions="['confirm']"
                                            />
                                        </n-space>
                                        <div>
                                            <n-input
                                                :placeholder="
                                                    $t('dataTable.listing.searchFilesEncoded')
                                                "
                                                autosize
                                                style="min-width: 300px"
                                                clearable
                                                v-model:value="search.pigCodeLike"
                                                @keyup.enter="getPigOptionalList"
                                                @clear="
                                                    () => {
                                                        search.pigCodeLike = ''
                                                        getPigOptionalList()
                                                    }
                                                "
                                            >
                                                <template #prefix>
                                                    <n-icon>
                                                        <searchIcon />
                                                    </n-icon>
                                                </template>
                                            </n-input>
                                        </div>
                                    </n-space>
                                </div>
                                <tableComponents
                                    size="small"
                                    :columns="columns"
                                    :data="pigOptionalList"
                                    :loading="showloading"
                                    :scroll-x="1200"
                                    :clickIndex="leftClickIndex"
                                    v-model:search="search"
                                    @update:filters="handleFiltersChange"
                                    @update:search="getPigOptionalList"
                                ></tableComponents>
                            </n-gi>
                            <!-- 右侧 -->
                            <n-gi span="4 400:4 600:4 800:4">
                                <n-card content-style="padding: 0;">
                                    <div class="p-2 tabHeader">
                                        <n-space align="center">
                                            <!-- 母猪选配详情 -->
                                            <div class="font-16 font-weight-bolder">
                                                {{ $t("dataTable.listing.sowMatchingDetails") }}:
                                            </div>
                                            <!-- 编辑选配 -->
                                            <n-button
                                                type="info"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="editTheSelected"
                                                >{{
                                                    $t("dataTable.listing.editOptional")
                                                }}</n-button
                                            >
                                            <!-- 放弃选配 -->
                                            <n-button
                                                type="error"
                                                v-if="
                                                    leftClickRow.id &&
                                                    dateInTwoDay(leftClickRow.matapplyDate) &&
                                                    leftClickRow.matchStatus != 3 &&
                                                    leftClickRow.indentStatus != 1
                                                "
                                                @click="deletePigOptionalBtn()"
                                                >{{
                                                    $t("dataTable.listing.abandonOption")
                                                }}</n-button
                                            >
                                        </n-space>
                                    </div>
                                </n-card>
                                <n-scrollbar
                                    style="max-height: 500px"
                                    v-if="pigOptionalDetail.theSow[0].pigCode"
                                >
                                    <n-card content-style="padding: 0;">
                                        <div class="p-3">
                                            <!--母猪档案，档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码  -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="$t('dataTable.listing.sowFile') + '：'"
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theSow[0].pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theSow[0].pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theSow[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theSow[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theSow[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theSow[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theSow[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theSow[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theSow[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theSow[0].breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                        </div>
                                    </n-card>
                                    <!-- 暂无选配公猪（主） -->
                                    <n-card content-style="padding: 0;" class="mt-2">
                                        <div class="p-3" v-if="pigOptionalDetail.theMaleMain">
                                            <!--选配公猪（主），档案编码，耳牌，父编码，母编码 ，品种 ，出生日期，祖编码-->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarMaster') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].pigCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.theMaleMain[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].strain ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].mIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fIndex ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].lmf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.theMaleMain[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（主） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item>
                                                <!-- 匹配参数 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                    >{{
                                                        pigOptionalDetail.parameterdirect ||
                                                        $t("dtables.listing.empty")
                                                    }}</n-descriptions-item
                                                >
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarMaster')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                    <n-card content-style="padding: 0;" class="mt-2 mb-2">
                                        <div class="p-3" v-if="pigOptionalDetail.alternativeBoar">
                                            <!-- 选配公猪（备），档案编码，耳牌，父编码，母编码，品种，出生日期，祖编码 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.optionalBoarS') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fileCoding')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigCode || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.earCard')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .earBrandCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.fatherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.motherCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigMotherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.species')"
                                                >
                                                    {{
                                                        getDictionarieName(
                                                            "pigSources",
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigSources
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.dateOfBirth')"
                                                >
                                                    {{
                                                        dateTransition(
                                                            pigOptionalDetail.alternativeBoar[0]
                                                                .pigBornDate
                                                        ) || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.ancestralCode')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .pigGrandFatherCode ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.varietiesOfStrain')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .strain || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 遗传参数，母系指数，父系指数，育种值 -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.geneticParameter') + '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.matrilinealIndex')
                                                    "
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .mIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.paternityIndex')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .fIndex || $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="ADG">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].adg ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="BF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].bf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FCR">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fcr ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="LMD">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].lmd ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="IMF">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].imf ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="FI">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].fi ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="DAYS">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].days ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="WC1">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].wcl ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item label="NBA">
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0].nba ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.breedingValue')"
                                                >
                                                    {{
                                                        pigOptionalDetail.alternativeBoar[0]
                                                            .breedingValue ||
                                                        $t("dtables.listing.empty")
                                                    }}
                                                </n-descriptions-item>
                                            </n-descriptions>
                                            <n-divider />
                                            <!-- 匹配参数，近亲代差，档案编码，暂无选配公猪（备） -->
                                            <n-descriptions
                                                label-placement="left"
                                                :title="
                                                    $t('dataTable.listing.matchingParameters') +
                                                    '：'
                                                "
                                                column="2"
                                            >
                                                <n-descriptions-item
                                                    :label="$t('dataTable.listing.closeRelativeGD')"
                                                >
                                                    {{ $t("dataTable.listing.earCard") }}
                                                </n-descriptions-item>
                                                <!-- 匹配参数 -->
                                                <n-descriptions-item
                                                    :label="
                                                        $t('dataTable.listing.syntheticStrains')
                                                    "
                                                    >{{
                                                        pigOptionalDetail.parameterready ||
                                                        $t("dtables.listing.empty")
                                                    }}</n-descriptions-item
                                                >
                                            </n-descriptions>
                                        </div>
                                        <n-empty
                                            v-else
                                            :description="
                                                $t('dataTable.listing.notYet') +
                                                ' ' +
                                                $t('dataTable.listing.optionalBoarS')
                                            "
                                            class="mt-3"
                                        ></n-empty>
                                    </n-card>
                                </n-scrollbar>
                                <n-empty
                                    v-else
                                    :description="
                                        $t(
                                            'dtables.listing.noRecord,PleaseClickOnTheLeftSideOfTheEditor'
                                        )
                                    "
                                    class="mt-3"
                                ></n-empty>

                                <div
                                    class="mt-2 pl-3"
                                    v-if="
                                        leftClickRow.id &&
                                        dateInTwoDay(leftClickRow.matapplyDate) &&
                                        leftClickRow.matchStatus != 3 &&
                                        leftClickRow.indentStatus != 1
                                    "
                                >
                                    <n-space>
                                        <!-- 保存，取消 -->
                                        <n-button type="info" @click="hybridization">
                                            {{ $t("button.preservation") }}
                                        </n-button>
                                        <n-button @click="clearPigOptionalDetail">
                                            {{ $t("button.cancel") }}
                                        </n-button>
                                    </n-space>
                                </div>
                            </n-gi>
                        </n-grid>
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-card>

        <!-- 修改 -->
        <n-modal
            class="custom-card"
            v-model:show="showUpdate"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.optionalBoar')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="updateForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                :label-width="100"
            >
                <n-form-item path="pigCodeMain" :label="$t('dataTable.listing.boar (main)')">
                    <n-input-group>
                        <!-- <n-input
                            :style="{ width: '300px' }"
                            :placeholder="$t('dataTable.listing.pleaseEnterTheBoar (main)Encoding')"
                            v-model:value="updateForm.pigCodeMain"
                        /> -->
                        <n-select
                            v-model:value="updateForm.pigCodeMain"
                            :style="{ width: '60%' }"
                            :placeholder="$t('dataTable.listing.pleaseEnterTheBoar (main)Encoding')"
                            clearable
                            remote
                            filterable
                            :options="pigCodeOptions"
                            :loading="loading"
                            @search="handleSearch"
                        />
                        <n-button type="primary" @click="getMatchMessage('main')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </n-form-item>
                <n-space
                    vertical
                    v-if="mainPig.breedingValue"
                    style="padding-left: 100px; margin-bottom: 30px"
                >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.breedingValue")
                        }}{{ mainPig.breedingValue }}</n-text
                    >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.semenCode")
                        }}{{ mainPig.repertoryAmount }}</n-text
                    >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.varietiesOfStrain") }}{{ mainPig.strain }}</n-text
                    >
                </n-space>
                <n-form-item path="pigCodePrepare" :label="$t('dataTable.listing.boar (prepare)')">
                    <n-input-group>
                        <!-- <n-input
                            :style="{ width: '300px' }"
                            :placeholder="
                                $t('dataTable.listing.pleaseEnterTheBoar (prepare)Encoding')
                            "
                            v-model:value="updateForm.pigCodePrepare"
                        /> -->
                        <n-select
                            v-model:value="updateForm.pigCodePrepare"
                            :style="{ width: '60%' }"
                            :placeholder="
                                $t('dataTable.listing.pleaseEnterTheBoar (prepare)Encoding')
                            "
                            clearable
                            remote
                            filterable
                            :options="pigCodeOptions"
                            :loading="loading"
                            @search="handleSearch"
                        />
                        <n-button type="primary" @click="getMatchMessage('prepare')">{{
                            $t("dtables.listing.search")
                        }}</n-button>
                    </n-input-group>
                </n-form-item>
                <n-space
                    vertical
                    v-if="preparePig.breedingValue"
                    style="padding-left: 100px; margin-bottom: 30px"
                >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.breedingValue")
                        }}{{ preparePig.breedingValue }}</n-text
                    >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.semenCode")
                        }}{{ preparePig.repertoryAmount }}</n-text
                    >
                    <n-text depth="3"
                        >{{ $t("dataTable.listing.varietiesOfStrain")
                        }}{{ preparePig.strain }}</n-text
                    >
                </n-space>
                <n-space justify="center">
                    <n-button type="info" @click="handleUpdateClick">{{
                        $t("dataTable.listing.confirm")
                    }}</n-button>
                    <n-button @click="showUpdate = false">{{
                        $t("dtables.listing.cancel")
                    }}</n-button>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导出 -->
        <exportComponents
            fileName="种猪档案"
            apiUrl="optionalExprotApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>

        <!-- 导入 -->
        <importComponents
            v-model:openImport="showImport"
            apiUrl="batchAddPigMatchRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigOptionalList
                }
            "
        ></importComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NTag, NButton, useMessage, NSpace, useDialog } from "naive-ui"
    import {
        getPigOptionalListApi,
        getPigOptionalDetailApi,
        deletePigOptionalApi,
        getMatchMessageApi,
        addMatchMessageApi,
        getMatchMessagelistsApi,
        finshOptionalApi,
        addsyntheticStrains
    } from "@/api/pigOptional.js"
    import { useStore } from "vuex"
    import { useI18n } from "vue-i18n"

    import exportComponents from "@/components/exExport.vue"
    import importComponents from "@/components/exImport.vue"
    import tableComponents from "@/components/table.vue"
    import helper from "@/utils/helper.js"
    import { getfuzzyQuery } from "@/api/public.js"

    export default defineComponent({
        name: "exceptionRecord",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            exportComponents,
            importComponents,
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                showExport: false,
                showImport: false,
                showUpdate: false,
                showloading: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    pigCodeLike: "",
                    // 选配记录日期开始时间
                    matchDateGte: helper.formatStartTamp(Date.now()),
                    // 选配记录日期结束时间
                    matchDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 选配状态
                    matchStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                updateForm: {
                    // 主id
                    pigCodeMain: "",
                    // 备id
                    pigCodePrepare: ""
                },
                mainPig: {},
                preparePig: {},
                pigOptionalList: [],
                pigOptionalDetail: {
                    theSow: [{}],
                    // 主信息
                    theMaleMain: [{}],
                    // 备信息
                    alternativeBoar: [{}]
                },

                leftClickIndex: -1,
                leftClickId: undefined,
                leftClickRow: {},
                // 母猪编码
                pigCodeOptions: []
            })

            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })
            const dateTransition = computed(() => {
                return function (date) {
                    return helper.timestampToTime(new Date(date).getTime())
                }
            })
            const dateInTwoDay = computed(() => {
                return function (date) {
                    return helper.dateInTwoDay(new Date(date).getTime())
                }
            })

            // 编辑选配
            const editTheSelected = () => {
                state.showUpdate = true
                // console.log(state.pigOptionalDetail.theSow[0].strain)
            }

            // 获取选配列表
            const getPigOptionalList = async () => {
                state.search.matchDateGte = helper.formatStartTamp(state.timeList[0])
                state.search.matchDateLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigOptionalListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigOptionalList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 获取选配详情
            const getPigOptionalDetail = async row => {
                let pram = {
                    pigCode: row.pigCode,
                    semenCode: row.semenCode,
                    backupSemenCode: row.backupSemenCode
                }
                await getPigOptionalDetailApi(pram).then(res => {
                    if (res.code == 0) {
                        if (res.data.theSow) {
                            state.pigOptionalDetail = res.data
                        } else {
                            state.pigOptionalDetail = {
                                theSow: [{}],
                                theMaleMain: [{}],
                                alternativeBoar: [{}]
                            }
                        }
                    }
                })
            }
            // 放弃选配
            const deletePigOptional = async () => {
                await deletePigOptionalApi({ id: state.leftClickId }).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.giveUpMatchingSuccess"))
                        getPigOptionalList()
                        state.leftClickIndex = -1
                        state.leftClickId = ""
                        state.leftClickRow = {}
                        state.pigOptionalDetail = {
                            theSow: [{}],
                            theMaleMain: [{}],
                            alternativeBoar: [{}]
                        }
                    }
                })
            }

            // 弹框搜索主备时的查询
            const getMatchMessage = async type => {
                if (type == "main" && !state.updateForm.pigCodeMain) {
                    message.error(t("dataTable.listing.pleaseEnterTheBoar (main)Encoding"))
                    return false
                }
                if (type == "prepare" && !state.updateForm.pigCodePrepare) {
                    message.error(t("dataTable.listing.pleaseEnterTheBoar (main)Encoding"))
                    return false
                }
                await getMatchMessageApi({
                    coding:
                        type == "main"
                            ? state.updateForm.pigCodeMain
                            : state.updateForm.pigCodePrepare
                }).then(res => {
                    if (res.code == 0) {
                        type == "main"
                            ? (state.mainPig = res.data[0])
                            : (state.preparePig = res.data[0])
                    }
                })
            }

            // 主备信息查询
            const getMatchMessagelists = async (type, pigcode) => {
                await getMatchMessagelistsApi({
                    semenCode: pigcode,
                    pigCode: state.pigOptionalDetail.theSow[0].strain
                }).then(res => {
                    if (res.code == 0) {
                        if (res.data.length == 0) {
                            type == "main"
                                ? message.error(
                                      t("dataTable.listing.notQueryToTheBoar (main)Encoding")
                                  )
                                : message.error(
                                      t("dataTable.listing.notQueryToTheBoar (main)Encoding")
                                  )
                        } else {
                            state.showUpdate = false
                            type == "main" && res.data.length > 0
                                ? (state.pigOptionalDetail.theMaleMain = res.data)
                                : (state.pigOptionalDetail.alternativeBoar = res.data)

                            type == "main"
                                ? message.success(
                                      t(
                                          "dataTable.listing.hasJoinedTheRightSideOfTheBoar (main)Information"
                                      )
                                  )
                                : message.success(
                                      t(
                                          "dataTable.listing.hasJoinedTheRightSideOfTheBoar (main)Information"
                                      )
                                  )
                        }
                    }
                })
            }
            // 保存选配先判断主备公猪与母猪是否为杂交配种
            const hybridization = async () => {
                // 没有公猪时提示
                if (
                    !state.pigOptionalDetail.theMaleMain ||
                    state.pigOptionalDetail.theMaleMain.length == 0
                ) {
                    window.$message.warning(
                        t("dataTable.listing.pleaseClickOnTheEditSelectedAbove")
                    )
                    return false
                }
                let matherPigSources = state.pigOptionalDetail.theSow[0].pigSources
                let mainPigSources = state.pigOptionalDetail.theMaleMain[0].pigSources
                if (matherPigSources != mainPigSources) {
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dataTable.listing.forHybridBreeding"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            addMatchMessage()
                        }
                    })
                } else {
                    addMatchMessage()
                }
            }
            // 保存选配
            const addMatchMessage = async () => {
                let semenCode = state.pigOptionalDetail.theMaleMain
                    ? state.pigOptionalDetail.theMaleMain[0].pigCode
                    : ""

                let backupSemenCode = state.pigOptionalDetail.alternativeBoar
                    ? state.pigOptionalDetail.alternativeBoar[0].pigCode
                    : ""
                let data = {
                    id: state.leftClickId,
                    semenCode: semenCode,
                    backupSemenCode: backupSemenCode,
                    offspringStrain: state.pigOptionalDetail.parameterdirect
                }
                await addMatchMessageApi(data).then(res => {
                    if (res.code == 0) {
                        getPigOptionalDetail(state.leftClickRow)
                        message.success(t("dataTable.listing.editTheMatchingSuccess"))

                        getPigOptionalList()
                    }
                })
            }

            // 完成本次选配
            const finshOptional = async () => {
                await finshOptionalApi({}).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.hasBeenSubmittedOnTheSameDay"))
                        state.search.page = 1
                        getPigOptionalList()
                    }
                })
            }

            // 表单验证
            const repetitionPigCode = () => {
                return (
                    state.updateForm.pigCodeMain &&
                    state.updateForm.pigCodeMain != state.updateForm.pigCodePrepare
                )
            }

            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '选配日期',
                        title: () => {
                            return t("dataTable.listing.optionalDate")
                        },
                        render(row) {
                            return helper.timestampToTime(row.matchDate)
                        }
                    },
                    {
                        // title: '母猪个体号',
                        title: () => {
                            return t("dataTable.listing.sowTheIndividual")
                        },
                        key: "pigCode"
                    },
                    {
                        // title: '选配状态',
                        title: () => {
                            return t("dataTable.listing.optionalStatus")
                        },
                        key: "matchStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["matchStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "matchStatus",
                                row.matchStatus
                            )
                        }
                    },
                    {
                        // title: '猪场',
                        title: () => {
                            return t("dataTable.listing.pig")
                        },
                        key: "farmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmid)
                        }
                    },
                    {
                        // title: '猪舍',
                        title: () => {
                            return t("dataTable.listing.piggery")
                        },
                        key: "dormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDormName"](row.dormCode)
                        }
                    },
                    {
                        // title: '栏位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
                    },
                    {
                        // title: '发情日期',
                        title: () => {
                            return t("dataTable.listing.qestrusDate")
                        },
                        render(row) {
                            return helper.timestampToTime(row.matapplyDate)
                        }
                    },
                    {
                        // title: '是否申请精液',
                        title: () => {
                            return t("dataTable.listing.applyForSemen")
                        },
                        key: "indentStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["indentStatus"]
                        }),
                        render(row) {
                            if (row.indentStatus == "1") {
                                return h(
                                    NTag,
                                    {
                                        style: {
                                            marginRight: "6px"
                                        },
                                        type: "success"
                                    },
                                    {
                                        default: () => t("dataTable.listing.join")
                                    }
                                )
                            } else {
                                return h(
                                    NTag,
                                    {
                                        style: {
                                            marginRight: "6px"
                                        },
                                        type: "error"
                                    },
                                    {
                                        default: () => t("dataTable.listing.notToJoin")
                                    }
                                )
                            }
                        }
                    },
                    {
                        // title: '操作人',
                        title: () => {
                            return t("dataTable.listing.operatingPersonnel")
                        },
                        key: "staffCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        })
                    },
                    {
                        // title: '操作',
                        title: () => {
                            return t("dataTable.listing.actions")
                        },
                        key: "actions",
                        fixed: "right",
                        render(row, index) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        onClick: () => {
                                            state.leftClickIndex = index
                                            state.leftClickId = row.id
                                            state.leftClickRow = row
                                            getPigOptionalDetail(row, index)
                                        }
                                    },
                                    {
                                        default: () => t("dataTable.listing.viewDetails")
                                    }
                                )
                            ])
                        }
                    }
                ]
            }
            // tab进行切换
            const tabsChange = value => {
                state.search = {
                    pigCodeLike: "",
                    // 选配记录日期开始时间
                    matchDateGte: helper.formatStartTamp(Date.now()),
                    // 选配记录日期结束时间
                    matchDateLte: helper.formatEndTamp(Date.now()),
                    // 场区
                    farmidList: [],
                    // 栋舍
                    dormCodeList: [],
                    // 选配状态
                    matchStatusList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                }
                state.search.matchStatusList = store.getters["dictionaries/getDictionarieId"](
                    "matchStatus",
                    value
                )
                state.search.page = 1
                getPigOptionalList()
            }
            // 异步加载（模糊后6位）
            const handleSearch = async query => {
                optionsRef.value = []
                if (query.length == 6) {
                    loadingRef.value = true
                    await getfuzzyQuery({ searchInfo: query }).then(res => {
                        loadingRef.value = false
                        if (res.code == 0) {
                            console.log(res.data)
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
            onMounted(() => {
                tabsChange("待选配")
                // getPigOptionalList()
                //设置列表
                setTableColumns()
            })
            return {
                ...toRefs(state),
                formRef,
                // 改变样式
                tabsChange,
                // 编辑选配
                editTheSelected,
                getMatchMessage,
                getPigOptionalList,
                addMatchMessage,
                deletePigOptional,
                getDictionarieName,
                dateInTwoDay,
                dateTransition,
                hybridization,
                bodyStyle: {
                    width: "600px"
                },
                rules: {
                    pigCodeMain: [
                        {
                            required: true,
                            message: t("form.rules.pleaseEnterTheBoar.Encoding"),
                            trigger: ["input"]
                        },
                        {
                            validator: repetitionPigCode,
                            message: t("form.rules.lordForEncodingIsConsistentPleaseEnterAgain"),
                            trigger: "input"
                        },
                        {
                            validator: repetitionPigCode,
                            message: t("form.rules.masterPigsAndSowsNotMatching"),
                            trigger: "input"
                        }
                    ]
                },
                rangeShortcuts: {
                    近一月: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    近一年: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ]
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "farmid") {
                        state.search.farmidList = options.filters.farmid
                    }
                    if (options.sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = options.filters.dormCode
                    }
                    if (options.sourceColumn.key == "matchStatus") {
                        state.search.matchStatusList = options.filters.matchStatus
                    }
                    if (options.sourceColumn.key == "indentStatus") {
                        state.search.indentStatusList = options.filters.indentStatus
                    }
                    if (options.sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = options.filters.staffCode
                    }
                    state.search.page = 1
                    getPigOptionalList()
                },
                // 日期过滤
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                clearForm() {
                    state.mainPig = {}
                    state.preparePig = {}
                    state.updateForm.pigCodeMain = ""
                    state.updateForm.pigCodePrepare = ""
                },
                // 清空右侧信息
                clearPigOptionalDetail() {
                    state.pigOptionalDetail = {
                        theSow: [{}],
                        theMaleMain: [{}],
                        alternativeBoar: [{}]
                    }
                    state.mainPig = {}
                    state.preparePig = {}
                    state.leftClickRow = {}
                    state.leftClickIndex = -1
                    state.updateForm = {
                        // 主id
                        pigCodeMain: "",
                        // 备id
                        pigCodePrepare: ""
                    }
                },
                // 根据主备查询对应信息 添加到右侧
                handleUpdateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            // 校验接口
                            addsyntheticStrains({
                                sowStrain: state.pigOptionalDetail.theSow[0].strain,
                                //
                                boarStrainMain: state.updateForm.pigCodeMain,
                                boarStrainPrepare: state.updateForm.pigCodePrepare
                            }).then(res => {
                                if (res.code == 1) {
                                    window.$message(res.msg)
                                } else {
                                    // 过完校验 查询主备信息
                                    getMatchMessagelists("main", state.updateForm.pigCodeMain)
                                    if (state.updateForm.pigCodePrepare) {
                                        getMatchMessagelists(
                                            "prepare",
                                            state.updateForm.pigCodePrepare
                                        )
                                    }
                                }
                            })
                        }
                    })
                },
                deletePigOptionalBtn() {
                    dialog.warning({
                        title: t("dataTable.listing.warning"),
                        content: t("dataTable.listing.determinedToGiveUpThisData"),
                        positiveText: t("dataTable.listing.determine"),
                        negativeText: t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            deletePigOptional()
                        }
                    })
                },
                // 完成本次选配
                finsh() {
                    dialog.warning({
                        title: () => t("dataTable.listing.optional"),
                        content: () => t("dataTable.listing.sureToSubmitTheSelectedData"),
                        positiveText: () => t("dataTable.listing.determine"),
                        negativeText: () => t("dtables.listing.cancel"),
                        onPositiveClick: () => {
                            finshOptional()
                        }
                    })
                },
                // 选中行class设置
                rowClassName(row, index) {
                    if (index == state.leftClickIndex) {
                        return "tr-select"
                    }
                    return null
                },
                // 模糊搜索
                handleSearch,
                // 异步加载
                loading: loadingRef,
                options: optionsRef
            }
        }
    })
</script>
<style lang=""></style>
