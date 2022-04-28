<template>
    <div class="p-2">
        <!-- 医疗及保健丨挂号登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">
                        {{
                            $t("dataTable.listing.breedingPigMedical") +
                            "丨" +
                            $t("dataTable.listing.registration")
                        }}
                    </div>
                    <n-space align="center">
                        <!-- 挂号登记 -->
                        <n-button
                            type="success"
                            class="col-3"
                            @click=";(addSimpleShow = true), clearSForm()"
                            >{{ $t("dataTable.listing.simpleMedicalProcess") }}</n-button
                        >
                        <n-button
                            type="info"
                            class="col-3"
                            @click="
                                () => {
                                    addRegistrationShow = true
                                    clearForm()
                                }
                            "
                            >{{ $t("dataTable.listing.registration") }}</n-button
                        >
                    </n-space>
                </n-space>
            </template>
            <!-- tabs分栏 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待确诊" :tab="$t('dataTable.listing.toBeConfirmed')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待确诊挂号记录 -->
                                    <div>
                                        {{
                                            $t("dtables.listing.toBeConfirmedRegistrationRecords")
                                        }}:
                                    </div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigRegistrationList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="
                                            $t('dataTable.listing.searchRegistrationNumber')
                                        "
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.registerCodeLike"
                                        @keyup.enter="getPigRegistrationList"
                                        @clear="
                                            () => {
                                                search.registerCodeLike = ''
                                                getPigRegistrationList()
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
                    </n-tab-pane>
                    <!-- 已确诊挂号记录 -->
                    <n-tab-pane name="已确诊" :tab="$t('dataTable.listing.confirmed')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <div>{{ $t("dtables.listing.confirmedBookingRecord") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigRegistrationList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="
                                            $t('dataTable.listing.searchRegistrationNumber')
                                        "
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.registerCodeLike"
                                        @keyup.enter="getPigRegistrationList"
                                        @clear="
                                            () => {
                                                search.registerCodeLike = ''
                                                getPigRegistrationList()
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
                    </n-tab-pane>
                    <n-tab-pane name="已完成" :tab="$t('dataTable.listing.hasBeenCompleted')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 已完成挂号记录 -->
                                    <div>
                                        {{ $t("dtables.listing.completedRegistrationRecords") }}:
                                    </div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :is-date-disabled="disablePreviousDate"
                                        :shortcuts="rangeShortcuts"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigRegistrationList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="
                                            $t('dataTable.listing.searchRegistrationNumber')
                                        "
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.registerCodeLike"
                                        @keyup.enter="getPigRegistrationList"
                                        @clear="
                                            () => {
                                                search.registerCodeLike = ''
                                                getPigRegistrationList()
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
                    </n-tab-pane>
                </n-tabs>
                <tableComponents
                    :columns="columns"
                    :data="registrationList"
                    :loading="showloading"
                    :scroll-x="1600"
                    v-model:search="search"
                    @update:checked-row-keys="handleCheck"
                    @update:filters="handleFiltersChange"
                    @update:search="getPigRegistrationList"
                ></tableComponents>
            </n-card>
        </n-card>

        <!-- 挂号登记 -->
        <n-modal
            class="custom-card"
            v-model:show="addRegistrationShow"
            preset="card"
            :style="bodyStyle"
            :title="$t('dataTable.listing.registration')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="addfrom"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="10">
                    <!-- 发病原因 -->
                    <n-form-item
                        path="morbidityScope"
                        :label="$t('dataTable.listing.incidenceRange')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :placeholder="$t('dtables.listing.pleaseSelectA')"
                            v-model:value="addfrom.morbidityScope"
                            :options="getDictionaries('morbidityScope')"
                            style="width: 350px"
                            :disabled="addfrom.id ? true : false"
                            @update:value="rangeChange"
                        />
                    </n-form-item>
                    <!-- 范围详情 -->
                    <n-form-item class="feedback-wrapper-noHeight">
                        <template #label>
                            <span>
                                {{ $t("dtables.listing.theScopeOfTheDetails") }}
                                <span style="color: #d03050">*</span>
                            </span>
                        </template>
                        <n-space>
                            <n-form-item path="nowFarmid">
                                <n-select
                                    v-model:value="addfrom.nowFarmid"
                                    :options="getDictionaries('farmList')"
                                    :placeholder="$t('dtables.listing.pleaseEnterTheArea')"
                                    style="width: 350px"
                                    :disabled="addfrom.id ? true : false"
                                />
                            </n-form-item>
                            <n-form-item
                                path="nowDormCode"
                                v-if="
                                    addfrom.morbidityScope &&
                                    getDictionarieName('morbidityScope', addfrom.morbidityScope) !=
                                        '全场'
                                "
                            >
                                <n-select
                                    :placeholder="$t('dtables.listing.pleaseEnterTheBuilding')"
                                    v-model:value="addfrom.nowDormCode"
                                    :options="getDormListForFarmId(addfrom.nowFarmid)"
                                    style="width: 120px"
                                    :disabled="addfrom.id ? true : false"
                                />
                            </n-form-item>
                            <n-form-item
                                path="nowColumnCode"
                                v-if="
                                    (addfrom.morbidityScope &&
                                        getDictionarieName(
                                            'morbidityScope',
                                            addfrom.morbidityScope
                                        ) == '全栏') ||
                                    getDictionarieName('morbidityScope', addfrom.morbidityScope) ==
                                        '单头'
                                "
                            >
                                <n-select
                                    :placeholder="$t('dataTable.listing.pleaseEnterTheField')"
                                    v-model:value="addfrom.nowColumnCode"
                                    :options="getColumnListForDormId(addfrom.nowDormCode)"
                                    style="width: 120px"
                                    filterable
                                    :disabled="addfrom.id ? true : false"
                                />
                            </n-form-item>
                            <n-form-item
                                path="pigCode"
                                v-if="
                                    addfrom.morbidityScope &&
                                    getDictionarieName('morbidityScope', addfrom.morbidityScope) ==
                                        '单头'
                                "
                            >
                                <n-input
                                    v-model:value="addfrom.pigCode"
                                    :placeholder="$t('dtables.listing.pleaseEnterTheSwineEncoding')"
                                    style="width: 150px"
                                    :disabled="addfrom.id ? true : false"
                                ></n-input>
                            </n-form-item>
                        </n-space>
                    </n-form-item>
                    <!-- 病情描述 -->
                    <n-form-item
                        path="pigRange"
                        :label="$t('dtables.listing.scopeOfPigs')"
                        class="feedback-wrapper-noHeight"
                        v-show="
                            addfrom.morbidityScope &&
                            getDictionarieName('morbidityScope', addfrom.morbidityScope) == '全栏'
                        "
                    >
                        <n-radio-group
                            v-model:value="addfrom.pigRange"
                            name="radiogroup"
                            :disabled="addfrom.id ? true : false"
                        >
                            <n-space>
                                <n-radio
                                    v-for="item in pigRanges"
                                    :key="item.value"
                                    :value="item.value"
                                    >{{ item.label }}</n-radio
                                >
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item class="feedback-wrapper-noHeight">
                        <template #label>
                            <span>
                                {{ $t("dataTable.listing.illnessDescription") }}
                                <span style="color: #d03050">*</span>
                            </span>
                        </template>
                        <n-form-item path="theIllnessDescribe">
                            <n-select
                                :placeholder="$t('dtables.listing.pleaseSelectA')"
                                v-model:value="addfrom.theIllnessDescribe"
                                :options="getDictionaries('theIllnessDescribe')"
                                style="width: 350px"
                            />
                        </n-form-item>
                    </n-form-item>

                    <n-form-item class="feedback-wrapper-noHeight">
                        <template #label>
                            <span>{{ $t("dtables.listing.descriptionDetails") }}</span>
                            <span style="color: #d03050">*</span>
                        </template>
                        <n-form-item path="conditionForDetails">
                            <n-input
                                v-model:value="addfrom.conditionForDetails"
                                type="textarea"
                                maxlength="200"
                                show-count
                                :placeholder="
                                    $t('dtables.listing.pleaseEnterADescriptionForDetails')
                                "
                                style="width: 350px"
                            />
                        </n-form-item>
                    </n-form-item>

                    <n-form-item
                        :label="$t('dtables.listing.theAttachmentInformation')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-upload
                            :action="uploadUrl"
                            :headers="uploadHeaders"
                            v-model:file-list="fileList"
                            list-type="image-card"
                            accept=".png, .jpg, .jpeg"
                            :max="20"
                            @before-upload="beforeUpload"
                            @finish="handleFinish"
                            @remove="handleRemove"
                            @change="handleUploadChange"
                            >{{ $t("dtables.listing.clickOnTheUpload") }}</n-upload
                        >
                    </n-form-item>
                    <n-form-item
                        path="primaryDiagnosis"
                        :label="$t('dataTable.listing.primaryDiagnosis')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :placeholder="$t('dtables.listing.pleaseSelectA')"
                            v-model:value="addfrom.primaryDiagnosis"
                            :options="getDictionaries('primaryDiagnosis')"
                            style="width: 350px"
                        />
                    </n-form-item>
                    <n-form-item
                        path="morbidityData"
                        :label="$t('dataTable.listing.theOnsetdate')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-date-picker
                            :placeholder="$t('dtables.listing.pleaseSelectATime')"
                            v-model:value="addfrom.morbidityData"
                            type="date"
                            :is-date-disabled="disablePreviousDate"
                            style="width: 350px"
                            @focus="e => e.target.blur()"
                        />
                    </n-form-item>
                    <n-form-item
                        path="morbidityTime"
                        :label="$t('dataTable.listing.diseaseTime')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :placeholder="$t('dtables.listing.pleaseSelectA')"
                            v-model:value="addfrom.morbidityTime"
                            :options="getDictionaries('morbidityTime')"
                            style="width: 350px"
                        />
                    </n-form-item>

                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick" attr-type="button">{{
                            $t("dtables.listing.save")
                        }}</n-button>
                        <n-button
                            @click="
                                () => {
                                    addRegistrationShow = false
                                    clearForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 简易号登记 -->
        <n-modal
            class="custom-card"
            v-model:show="addSimpleShow"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.medicalRegistration')"
            :bordered="false"
            @afterLeave="clearSForm()"
            :mask-closable="false"
        >
            <n-scrollbar style="max-height: 600px">
                <n-form
                    :model="addSimpleForm"
                    ref="SimpleFormRef"
                    :rules="Srules"
                    label-placement="left"
                    label-width="auto"
                >
                    <n-space vertical :size="10">
                        <!-- 发病范围 -->
                        <n-form-item
                            path="morbidityScope"
                            :label="$t('dataTable.listing.incidenceRange')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                :placeholder="$t('dtables.listing.pleaseSelectA')"
                                v-model:value="addSimpleForm.morbidityScope"
                                :options="getDictionaries('morbidityScope')"
                                style="width: 350px"
                                :disabled="addSimpleForm.id ? true : false"
                                @update:value="clearfarmDormColumn"
                            />
                        </n-form-item>
                        <!-- 范围详情 -->
                        <n-form-item class="feedback-wrapper-noHeight">
                            <template #label>
                                <span>
                                    {{ $t("dtables.listing.theScopeOfTheDetails") }}
                                    <span style="color: #d03050">*</span>
                                </span>
                            </template>
                            <n-space>
                                <n-form-item path="nowFarmid">
                                    <n-select
                                        v-model:value="addSimpleForm.nowFarmid"
                                        :options="getDictionaries('farmList')"
                                        :placeholder="$t('dtables.listing.pleaseEnterTheArea')"
                                        style="width: 350px"
                                        :disabled="addSimpleForm.id ? true : false"
                                    />
                                </n-form-item>
                                <n-form-item
                                    path="nowDormCode"
                                    v-if="
                                        addSimpleForm.morbidityScope &&
                                        getDictionarieName(
                                            'morbidityScope',
                                            addSimpleForm.morbidityScope
                                        ) != '全场'
                                    "
                                >
                                    <n-select
                                        v-model:value="addSimpleForm.nowDormCode"
                                        :options="getDormListForFarmId(addSimpleForm.nowFarmid)"
                                        :placeholder="$t('dtables.listing.pleaseEnterTheBuilding')"
                                        style="width: 120px"
                                        :disabled="addSimpleForm.id ? true : false"
                                    />
                                </n-form-item>
                                <n-form-item
                                    path="nowColumnCode"
                                    v-if="
                                        (addSimpleForm.morbidityScope &&
                                            getDictionarieName(
                                                'morbidityScope',
                                                addSimpleForm.morbidityScope
                                            ) == '全栏') ||
                                        getDictionarieName(
                                            'morbidityScope',
                                            addSimpleForm.morbidityScope
                                        ) == '单头'
                                    "
                                >
                                    <n-select
                                        :placeholder="$t('dataTable.listing.pleaseEnterTheField')"
                                        v-model:value="addSimpleForm.nowColumnCode"
                                        :options="getColumnListForDormId(addSimpleForm.nowDormCode)"
                                        style="width: 120px"
                                        filterable
                                        :disabled="addSimpleForm.id ? true : false"
                                    />
                                </n-form-item>
                                <n-form-item
                                    path="pigCode"
                                    v-if="
                                        addSimpleForm.morbidityScope &&
                                        getDictionarieName(
                                            'morbidityScope',
                                            addSimpleForm.morbidityScope
                                        ) == '单头'
                                    "
                                >
                                    <n-input
                                        v-model:value="addSimpleForm.pigCode"
                                        :placeholder="
                                            $t('dtables.listing.pleaseEnterTheSwineEncoding')
                                        "
                                        style="width: 150px"
                                        :disabled="addSimpleForm.id ? true : false"
                                    ></n-input>
                                </n-form-item>
                            </n-space>
                        </n-form-item>
                        <!-- 病情描述 -->
                        <n-form-item class="feedback-wrapper-noHeight">
                            <template #label>
                                <span>
                                    {{ $t("dataTable.listing.illnessDescription") }}
                                    <span style="color: #d03050">*</span>
                                </span>
                            </template>
                            <n-form-item path="theIllnessDescribe">
                                <n-select
                                    v-model:value="addSimpleForm.theIllnessDescribe"
                                    :options="getDictionaries('theIllnessDescribe')"
                                    style="width: 350px"
                                />
                            </n-form-item>
                        </n-form-item>
                        <!-- 初步诊断 -->
                        <n-form-item
                            path="primaryDiagnosis"
                            :label="$t('dataTable.listing.primaryDiagnosis')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.primaryDiagnosis"
                                :options="getDictionaries('primaryDiagnosis')"
                                style="width: 350px"
                            />
                        </n-form-item>
                        <!-- 发病时间 -->
                        <n-form-item
                            path="morbidityTime"
                            :label="$t('dataTable.listing.diseaseTime')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.morbidityTime"
                                :options="getDictionaries('morbidityTime')"
                                style="width: 350px"
                            />
                        </n-form-item>
                        <!-- 确诊病症 -->
                        <n-form-item
                            path="confirmedCase"
                            :label="$t('dataTable.listing.diagnosedDisease')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.confirmedCase"
                                filterable
                                :options="symptomList"
                                style="width: 350px"
                                @update:value="getdrugs"
                            />
                        </n-form-item>
                        <!-- 用药 -->
                        <n-form-item
                            path="processingMode"
                            :label="$t('dataTable.listing.treatmentMethod')"
                            class="feedback-wrapper-noHeight"
                            v-if="
                                addSimpleForm.confirmedCase &&
                                getSymptomName(addSimpleForm.confirmedCase) != '无病'
                            "
                        >
                            <n-select
                                v-model:value="addSimpleForm.processingMode"
                                :options="getDictionaries('processingMode')"
                                :placeholder="$t('dtables.listing.pleaseSelectAHandling')"
                                style="width: 350px"
                            />
                        </n-form-item>
                        <!-- 用药量 -->
                        <n-form-item
                            path="medication"
                            :label="$t('dataTable.listing.drugCommonName')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.medication"
                                filterable
                                :options="drugsList"
                                style="width: 350px"
                            />
                        </n-form-item>
                        <n-form-item
                            path="dose"
                            :label="$t('dataTable.listing.dosage')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-input-number
                                v-model:value="addSimpleForm.dose"
                                clearable
                                min="1"
                                style="width: 350px"
                            />
                            <span>&nbsp;&nbsp;{{ $t("dtables.listing.a / /Package") }}</span>
                        </n-form-item>

                        <!-- 根据登记病情不同，显示不同select -->
                        <n-form-item
                            path="deathType"
                            :label="$t('dataTable.listing.deathType')"
                            v-if="
                                getDictionarieName('nowPigStatus', addSimpleForm.nowPigStatus) ==
                                '已死亡'
                            "
                        >
                            <n-select
                                :style="{ width: '350px' }"
                                v-model:value="addSimpleForm.deathType"
                                :options="getDictionaries('deathType')"
                            />
                        </n-form-item>
                        <!-- 死亡原因 非未知 -->
                        <n-form-item
                            path="deathReason"
                            :label="$t('dataTable.listing.deathCause')"
                            v-if="
                                addSimpleForm.deathType &&
                                getDictionarieName('deathType', addSimpleForm.deathType) != '未知'
                            "
                        >
                            <n-select
                                :style="{ width: '350px' }"
                                v-model:value="addSimpleForm.deathReason"
                                :options="getDictionaries('pigletDeathReason')"
                            />
                        </n-form-item>
                        <!-- 死亡原因 未知 -->
                        <n-form-item
                            path="remark"
                            label="备注："
                            v-if="
                                getDictionarieName('deathType', addSimpleForm.deathType) == '未知'
                            "
                        >
                            <n-input
                                :style="{ width: '350px' }"
                                v-model:value="addSimpleForm.remark"
                                type="textarea"
                                maxlength="200"
                                show-count
                                :placeholder="$t('dtables.listing.pleaseEnterANote')"
                            />
                        </n-form-item>
                        <!-- 死亡后处理方式 -->
                        <n-form-item
                            path="handlingType"
                            :label="$t('dataTable.listing.treatmentMethod')"
                            v-if="
                                getDictionarieName('nowPigStatus', addSimpleForm.nowPigStatus) ==
                                '已死亡'
                            "
                        >
                            <n-select
                                :style="{ width: '350px' }"
                                v-model:value="addSimpleForm.handlingType"
                                :options="getDictionaries('handlingType')"
                            />
                        </n-form-item>

                        <n-form-item
                            path="nowPigStatus"
                            :label="$t('dataTable.listing.registeredIllness')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.nowPigStatus"
                                :options="getDictionaries('nowPigStatus')"
                                style="width: 350px"
                            />
                        </n-form-item>
                        <div style="display: none">{{ addSimpleForm.staffCode }}</div>
                        <n-form-item
                            path="staffCode"
                            :label="$t('dataTable.listing.operatingPersonnel')"
                            class="feedback-wrapper-noHeight"
                        >
                            <n-select
                                v-model:value="addSimpleForm.staffCode"
                                :options="userList"
                                filterable
                                style="width: 350px"
                            />
                        </n-form-item>

                        <n-space justify="center">
                            <n-button type="info" @click="addSimpleClick" attr-type="button">{{
                                $t("dtables.listing.save")
                            }}</n-button>
                            <n-button
                                @click="
                                    () => {
                                        addSimpleShow = false
                                        clearSForm()
                                    }
                                "
                                >{{ $t("dtables.listing.cancel") }}</n-button
                            >
                        </n-space>
                    </n-space>
                </n-form>
            </n-scrollbar>
        </n-modal>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog } from "naive-ui"
    import {
        getPigRegistrationListApi,
        addPigRegistrationApi,
        updatePigRegistrationApi,
        getEditinfoApi,
        deletePigRegisterApi,
        pigSimpleMedicalProcessApi
    } from "@/api/pigRegistration.js"
    import { getSymptomsListApi, getPigDrugsBySymptomsIdApi } from "@/api/pigDiagnosis.js"
    import { useI18n } from "vue-i18n"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import tableComponents from "@/components/table.vue"
    import storage from "store"

    export default defineComponent({
        name: "registration",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            tableComponents
        },
        setup() {
            const store = useStore()
            const message = useMessage()
            const formRef = ref(null)
            const SimpleFormRef = ref(null)
            let loadingReactive = null
            const dialog = useDialog()
            const fileListRef = ref([])
            const { t } = useI18n()
            const state = reactive({
                addOptional: false,
                addRegistrationShow: false,
                showloading: false,
                addSimpleShow: false,
                timeList: [Date.now(), Date.now()],
                search: {
                    registerCodeLike: "",
                    // 挂号时间 （开始时间）
                    registerDataGte: helper.formatStartTamp(Date.now()),
                    // 挂号时间 （结束时间）
                    registerDataLte: helper.formatStartTamp(Date.now()),
                    nowFarmidList: [],
                    nowDormCodeList: [],
                    nowColumnCodeList: [],
                    morbidityScopeList: [],
                    theIllnessDescribeList: [],
                    primaryDiagnosisList: [],
                    registerStateList: [],
                    createidList: [],
                    page: 1,
                    limit: 10,
                    total: undefined
                },
                columns: [],
                addfrom: {
                    // 发病范围
                    morbidityScope: undefined,
                    pigRange: undefined,
                    nowFarmid: undefined,
                    nowDormCode: undefined,
                    nowColumnCode: undefined,
                    pigCode: undefined,
                    theIllnessDescribe: undefined,
                    primaryDiagnosis: undefined,
                    conditionForDetails: undefined,
                    morbidityData: undefined,
                    morbidityTime: undefined,
                    pictureUrl: []
                },
                // 简易流程的
                addSimpleForm: {
                    // 发病范围
                    morbidityScope: undefined,
                    // pigRange: undefined,
                    nowFarmid: undefined,
                    nowDormCode: undefined,
                    nowColumnCode: undefined,
                    pigCode: undefined,
                    theIllnessDescribe: undefined,
                    primaryDiagnosis: undefined,
                    morbidityData: undefined,
                    morbidityTime: undefined,
                    confirmedCase: undefined,
                    processingMode: undefined,
                    medication: undefined,
                    dose: undefined,
                    nowPigStatus: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                },
                registrationList: [],
                pigDetail: {},
                tabSelection: [],
                pigRanges: [
                    {
                        label: t("dataTable.listing.all"),
                        value: "0"
                    },
                    {
                        label: t("dtables.listing.piglet"),
                        value: "1"
                    },
                    {
                        label: t("dtables.listing.sow"),
                        value: "2"
                    }
                ],
                uploadUrl:
                    process.env.VUE_APP_API_BASE_URL +
                    "/ms-tenant-consummer/user/{version}/uploadFile",
                uploadHeaders: {
                    Authorization: "Bearer " + storage.get("access_token")
                },
                fileStorageList: [],
                symptomList: [],
                drugsList: []
            })
            // 发病范围 病情描述 初步诊断
            const getDictionaries = computed(() => {
                return function (dictionaryKey) {
                    return store.getters["dictionaries/getDictionaries"](dictionaryKey)
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
            const getFarmName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getFarmName"](id)
                }
            })
            const getDormName = computed(() => {
                return function (id) {
                    return store.getters["dictionaries/getDormName"](id)
                }
            })

            const getDictionarieName = computed(() => {
                return function (dictionaryKey, id) {
                    return store.getters["dictionaries/getDictionarieName"](dictionaryKey, id)
                }
            })
            // 根据病症获取药品
            const getdrugs = async value => {
                state.addSimpleForm.medication = undefined
                await getPigDrugsBySymptomsIdApi({ id: value }).then(res => {
                    if (res.code == 0) {
                        state.drugsList = []
                        res.data.list.forEach(item => {
                            state.drugsList.push({
                                label: item.commonName,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 获取字典 症状
            const getConfirmedCase = async () => {
                await getSymptomsListApi().then(res => {
                    if (res.code == 0) {
                        state.symptomList = []
                        res.data.forEach(item => {
                            state.symptomList.push({
                                label: item.name,
                                value: item.id
                            })
                        })
                    }
                })
            }

            // 根据id获取症状名称
            const getSymptomName = computed(() => {
                return function (id) {
                    let name = ""
                    state.symptomList &&
                        state.symptomList.forEach(item => {
                            if (id == item.value) {
                                name = item.label
                            }
                        })
                    return name
                }
            })

            // 病情登记--病情描述下拉
            const getNowPigStatus = computed(() => {
                return function (dictionaryKey) {
                    let arr = store.getters["dictionaries/getDictionaries"](dictionaryKey)
                    let newArr = []
                    arr.forEach(item => {
                        if (item.dictName == "已康复" || item.dictName == "已死亡") {
                            newArr.push(item)
                        }
                    })
                    return newArr
                }
            })

            // 获取挂号登记列表
            const getPigRegistrationList = async () => {
                state.search.registerDataGte = helper.formatStartTamp(state.timeList[0])
                state.search.registerDataLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true
                await getPigRegistrationListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.registrationList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }

            // 简易保存
            const addSimpleBtn = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("message.loading"), {
                        duration: 0
                    })
                }
                let data = JSON.parse(JSON.stringify(state.addSimpleForm))
                await pigSimpleMedicalProcessApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.addSimpleShow = false
                        clearSForm()
                        state.search.page = 1
                        getPigRegistrationList()
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            // 保存
            const addPigRegistration = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("message.loading"), {
                        duration: 0
                    })
                }
                state.addfrom.pictureUrl = []
                state.fileStorageList.forEach(item => {
                    state.addfrom.pictureUrl.push(item.url)
                })
                if (state.addfrom.pigRange == "0") {
                    state.addfrom.pigRange = undefined
                }
                let data = JSON.parse(JSON.stringify(state.addfrom))
                data.morbidityData = helper.format(data.morbidityData)
                await addPigRegistrationApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.addRegistrationShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRegistrationList()

                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            // 编辑
            const updatePigRegistration = async () => {
                if (!loadingReactive) {
                    loadingReactive = message.loading(t("message.loading"), {
                        duration: 0
                    })
                }
                state.addfrom.pictureUrl = []
                state.fileStorageList.forEach(item => {
                    state.addfrom.pictureUrl.push(item.url)
                })
                if (state.addfrom.pigRange == "0") {
                    state.addfrom.pigRange = undefined
                }
                let data = JSON.parse(JSON.stringify(state.addfrom))
                data.morbidityData = helper.format(data.morbidityData)
                await updatePigRegistrationApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.addRegistrationShow = false
                        clearForm()
                        state.search.page = 1
                        getPigRegistrationList()

                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    } else {
                        if (loadingReactive) {
                            loadingReactive.destroy()
                            loadingReactive = null
                        }
                    }
                })
            }

            // 删除单个查询记录
            const deletePigRegister = async row => {
                await deletePigRegisterApi({ id: row.id }).then(res => {
                    if (res.code == 0) {
                        message.success(t("message.success"))
                        state.search.page = 1
                        getPigRegistrationList()
                    }
                })
            }

            // 根据id获取编辑回显数据
            const getEditDate = async row => {
                await getEditinfoApi({ pictureCode: row.pictureCode }).then(res => {
                    if (res.code == 0) {
                        fileListRef.value = []
                        res.data.forEach(item => {
                            let oneItem = {
                                id: item.id,
                                name: item.baseUrl,
                                status: "finished",
                                url: item.baseUrl
                            }
                            fileListRef.value.push(oneItem)
                            state.fileStorageList.push(oneItem)
                        })
                        state.addRegistrationShow = true
                    }
                })
            }

            // 图片上传成功后
            const handleFinish = ({ file, event }) => {
                if (file.status == "finished") {
                    let response = JSON.parse(event.target.response)
                    let oneItem = {
                        id: file.id,
                        name: file.name,
                        url: response.data[0]
                    }
                    state.fileStorageList.push(oneItem)
                }
            }
            const clearSForm = () => {
                if (loadingReactive) {
                    loadingReactive.destroy()
                    loadingReactive = null
                }
                state.addSimpleForm = {
                    // 发病范围
                    morbidityScope: undefined,
                    // pigRange: undefined,
                    nowFarmid: undefined,
                    nowDormCode: undefined,
                    nowColumnCode: undefined,
                    pigCode: undefined,
                    theIllnessDescribe: undefined,
                    primaryDiagnosis: undefined,
                    morbidityTime: undefined,
                    confirmedCase: undefined,
                    processingMode: undefined,
                    medication: undefined,
                    dose: undefined,
                    nowPigStatus: undefined,
                    staffCode: store.state.core.userInfo.id || ""
                }
            }

            const clearForm = () => {
                state.addfrom = {
                    // 发病范围
                    morbidityScope: undefined,
                    pigRange: undefined,
                    nowFarmid: undefined,
                    nowDormCode: undefined,
                    nowColumnCode: undefined,
                    pigCode: undefined,
                    theIllnessDescribe: undefined,
                    primaryDiagnosis: undefined,
                    conditionForDetails: undefined,
                    morbidityData: undefined,
                    morbidityTime: undefined,
                    pictureUrl: []
                }
                fileListRef.value = []
                state.fileStorageList = []
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        // title: '挂号日期',
                        title: () => {
                            return t("dataTable.listing.registrationDate")
                        },
                        key: "registerData",
                        render(row) {
                            return helper.timestampToTime(row.registerData)
                        }
                    },
                    {
                        // title: '挂号单编码',
                        title: () => {
                            return t("dataTable.listing.registrationNumber")
                        },
                        key: "registerCode"
                    },
                    {
                        // title: '状态',
                        title: () => {
                            return t("dataTable.listing.productionStatus")
                        },
                        key: "registerState",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries["registerState"]
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "registerState",
                                row.registerState
                            )
                        }
                    },
                    {
                        // title: '发病范围',
                        title: () => {
                            return t("dataTable.listing.incidenceRange")
                        },
                        key: "morbidityScope",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["morbidityScope"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "morbidityScope",
                                row.morbidityScope
                            )
                        }
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "nowFarmid",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.nowFarmid)
                        }
                    },
                    {
                        // title: '栋舍',
                        title: () => {
                            return t("dataTable.listing.Dorm")
                        },
                        key: "nowDormCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dormList
                        }),
                        render(row) {
                            return (
                                store.getters["dictionaries/getDormName"](row.nowDormCode) || "--"
                            )
                        }
                    },
                    {
                        // title: '栏/床位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "nowColumnCode",
                        render(row) {
                            return row.nowColumnCode || "--"
                        }
                    },
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.fileCoding")
                        },
                        key: "pigCode",
                        render(row) {
                            return row.pigCode || "--"
                        }
                    },
                    {
                        // title: '病情描述',
                        title: () => {
                            return t("dataTable.listing.illnessDescription")
                        },
                        key: "theIllnessDescribe",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["theIllnessDescribe"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "theIllnessDescribe",
                                row.theIllnessDescribe
                            )
                        }
                    },
                    {
                        // title: '初步诊断',
                        title: () => {
                            return t("dataTable.listing.primaryDiagnosis")
                        },
                        key: "primaryDiagnosis",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["primaryDiagnosis"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "primaryDiagnosis",
                                row.primaryDiagnosis
                            )
                        }
                    },
                    {
                        // title: '发病日期',
                        title: () => {
                            return t("dataTable.listing.theOnsetdate")
                        },
                        key: "morbidityData",
                        render(row) {
                            return helper.timestampToTime(row.morbidityData)
                        }
                    },
                    {
                        // title: '发病时间',
                        title: () => {
                            return t("dataTable.listing.diseaseTime")
                        },
                        key: "morbidityTime",
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["morbidityTime"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "morbidityTime",
                                row.morbidityTime
                            )
                        }
                    },
                    {
                        // title: '记录人',
                        title: () => {
                            return t("dataTable.listing.registrant")
                        },
                        key: "createid",
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
                        render(row) {
                            return h(NSpace, {}, [
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "info",
                                        text: true,
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "registerState",
                                                row.registerState
                                            ) == "待确诊"
                                                ? false
                                                : true,
                                        onClick: () => {
                                            state.addfrom = {
                                                id: row.id,
                                                morbidityScope: row.morbidityScope,
                                                nowFarmid: row.nowFarmid,
                                                nowDormCode: row.nowDormCode,
                                                nowColumnCode: row.nowColumnCode,
                                                pigCode: row.pigCode,
                                                theIllnessDescribe: row.theIllnessDescribe,
                                                primaryDiagnosis: row.primaryDiagnosis,
                                                conditionForDetails: row.conditionForDetails,
                                                morbidityData: new Date(
                                                    row.morbidityData
                                                ).getTime(),
                                                morbidityTime: row.morbidityTime,
                                                pigRange: row.pigRange || "0"
                                            }
                                            getEditDate(row)
                                        }
                                    },
                                    { default: () => t("button.edit") }
                                ),
                                h(
                                    NButton,
                                    {
                                        size: "small",
                                        type: "error",
                                        text: true,
                                        disabled:
                                            store.getters["dictionaries/getDictionarieName"](
                                                "registerState",
                                                row.registerState
                                            ) == "待确诊"
                                                ? false
                                                : true,
                                        onClick: () => {
                                            dialog.warning({
                                                title: t("dataTable.listing.warning"),
                                                content: t("dataTable.listing.areYouSureToDelete"),
                                                positiveText: t("dataTable.listing.determine"),
                                                negativeText: "dataTable.listing.cancel",
                                                onPositiveClick: () => {
                                                    deletePigRegister(row)
                                                }
                                            })
                                        }
                                    },
                                    { default: () => t("button.delete") }
                                )
                            ])
                        }
                    }
                ]
            }
            const tabsChange = value => {
                state.search.registerStateList = store.getters["dictionaries/getDictionarieId"](
                    "registerState",
                    value
                )
                state.search.page = 1
                getPigRegistrationList()
            }
            const clearfarmDormColumn = () => {
                state.addfrom.nowFarmid = null
                state.addfrom.nowDormCode = null
                state.addfrom.nowColumnCode = null
                state.addfrom.pigCode = null
            }
            let rules = {
                morbidityScope: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectARangeOfDisease"),
                    trigger: ["blur", "change"]
                },
                pigRange: {
                    required: false,
                    message: t("dtables.listing.pleaseSelectARangeOfPigs"),
                    trigger: ["blur", "change"]
                },
                nowFarmid: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterTheArea"),
                    trigger: ["blur", "change"]
                },
                nowDormCode: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterTheBuilding"),
                    trigger: ["blur", "change"]
                },
                nowColumnCode: {
                    required: true,
                    message: t("dataTable.listing.pleaseEnterTheField"),
                    trigger: ["blur", "change"]
                },
                pigCode: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                    trigger: ["blur", "change"]
                },
                theIllnessDescribe: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectACondition"),
                    trigger: ["blur", "change"]
                },
                primaryDiagnosis: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectAPreliminaryDiagnosis"),
                    trigger: ["blur", "change"]
                },
                conditionForDetails: {
                    required: true,
                    message: t("dtables.listing.pleaseEnterADescriptionForDetails"),
                    trigger: ["blur", "change"]
                },
                morbidityData: {
                    required: true,
                    type: "number",
                    message: t("dtables.listing.pleaseSelectADate"),
                    trigger: ["blur", "change"]
                },
                morbidityTime: {
                    required: true,
                    message: t("dtables.listing.pleaseSelectPeriod"),
                    trigger: ["blur", "change"]
                }
            }
            onMounted(() => {
                tabsChange("待确诊")
                // getPigRegistrationList()
                setTableColumns()
                getConfirmedCase()
            })
            return {
                ...toRefs(state),
                // tab分栏
                tabsChange,
                formRef,
                SimpleFormRef,
                clearForm,
                clearSForm,
                getPigRegistrationList,
                getFarmName,
                getDormName,
                getDormListForFarmId,
                getColumnListForDormId,
                getDictionaries,
                getDictionarieName,
                getNowPigStatus,
                getSymptomName,
                fileList: fileListRef,
                getEditDate,
                handleFinish,
                getdrugs,
                addSimpleBtn,
                getConfirmedCase,
                userList: computed(() => store.state.dictionaries.userSelectList),
                bodyStyle: {
                    width: "800px"
                },
                clearfarmDormColumn,
                rules,
                rangeChange(value) {
                    rules.pigRange.required = value == "2"

                    clearfarmDormColumn()
                },

                Srules: {
                    morbidityScope: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectARangeOfDisease"),
                        trigger: ["blur", "change"]
                    },
                    nowFarmid: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheArea"),
                        trigger: ["blur", "change"]
                    },
                    nowDormCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheBuilding"),
                        trigger: ["blur", "change"]
                    },
                    nowColumnCode: {
                        required: true,
                        message: t("dataTable.listing.pleaseEnterTheField"),
                        trigger: ["blur", "change"]
                    },
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    theIllnessDescribe: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectACondition"),
                        trigger: ["blur", "change"]
                    },
                    primaryDiagnosis: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAPreliminaryDiagnosis"),
                        trigger: ["blur", "change"]
                    },
                    confirmedCase: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectASymptomDiagnosis"),
                        trigger: ["blur", "change"]
                    },
                    morbidityTime: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectPeriod"),
                        trigger: ["blur", "change"]
                    },
                    processingMode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAHandling"),
                        trigger: ["blur", "change"]
                    },
                    medication: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectADrug"),
                        trigger: ["blur", "change"]
                    },
                    dose: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheDose"),
                        trigger: ["blur", "change"]
                    },
                    nowPigStatus: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectARegistrationCondition"),
                        trigger: ["blur", "change"]
                    },
                    deathType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectATypeOfDeath"),
                        trigger: ["blur", "change"]
                    },
                    deathReason: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTheCauseOfDeath"),
                        trigger: ["blur", "change"]
                    },
                    remark: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterANote"),
                        trigger: ["blur", "change"]
                    },
                    handlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectAHandling")
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOperation"),
                        trigger: ["blur", "change"]
                    }
                },
                rangeShortcuts: {
                    [t("dataTable.listing.inRecentMonth")]: [
                        new Date().setFullYear(new Date().getFullYear(), new Date().getMonth() - 1),
                        new Date().getTime()
                    ],
                    [t("dataTable.listing.almostAYear")]: [
                        new Date().setFullYear(new Date().getFullYear() - 1),
                        new Date().getTime()
                    ]
                },
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    state.tabSelection = rowKeys
                },
                handleFiltersChange(options) {
                    if (options.sourceColumn.key == "nowFarmid") {
                        state.search.nowFarmidList = options.filters.nowFarmid
                    }
                    if (options.sourceColumn.key == "nowDormCode") {
                        state.search.nowDormCodeList = options.filters.nowDormCode
                    }
                    if (options.sourceColumn.key == "nowColumnCode") {
                        state.search.nowColumnCodeList = options.filters.nowColumnCode
                    }
                    if (options.sourceColumn.key == "morbidityScope") {
                        state.search.morbidityScopeList = options.filters.morbidityScope
                    }
                    if (options.sourceColumn.key == "theIllnessDescribe") {
                        state.search.theIllnessDescribeList = options.filters.theIllnessDescribe
                    }
                    if (options.sourceColumn.key == "primaryDiagnosis") {
                        state.search.primaryDiagnosisList = options.filters.primaryDiagnosis
                    }
                    if (options.sourceColumn.key == "registerState") {
                        state.search.registerStateList = options.filters.registerState
                    }
                    if (options.sourceColumn.key == "createid") {
                        state.search.createidList = options.filters.createid
                    }
                    state.search.page = 1
                    getPigRegistrationList()
                },
                addSimpleClick() {
                    SimpleFormRef.value.validate(errors => {
                        if (!errors) {
                            addSimpleBtn()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                handleValidateClick() {
                    formRef.value.validate(errors => {
                        if (!errors) {
                            state.addfrom.id ? updatePigRegistration() : addPigRegistration()
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                )
                            )
                        }
                    })
                },

                handleUploadChange({ fileList }) {
                    fileListRef.value = fileList
                },

                // 图片大小控制
                beforeUpload({ file }) {
                    if (file.file.size >= 5242880) {
                        message.error(t("dtables.listing.lessThan 5Mb,PleaseUploadPictures!"))
                        return false
                    }
                },
                // 图片删除
                handleRemove({ file }) {
                    state.fileStorageList.forEach((item, index) => {
                        if (file.name == item.name) {
                            state.fileStorageList.splice(index, 1)
                        }
                    })
                }
            }
        }
    })
</script>
<style lang="less" scoped>
    .feedback-wrapper-noHeight {
        :deep(.n-form-item-feedback-wrapper) {
            min-height: 10px;
        }
    }
</style>
