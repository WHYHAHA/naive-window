<template>
    <div class="p-2">
        <!-- 淘汰登记 -->
        <n-card>
            <template #header>
                <n-space align="center" justify="space-between">
                    <div class="mr-3">{{ $t("dataTable.listing.selectedForRegistration") }}</div>
                    <n-space align="center">
                        <!-- 淘汰申请，登记，批量操作，导出，上传 -->
                        <n-button
                            text
                            tag="a"
                            type="primary"
                            href="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/excel/pigs-eliminate-upload-template.xlsx"
                            target="_blank"
                            >{{ $t("button.downloadTemplate") }}</n-button
                        >
                        <n-button type="info" class="col-2" @click="showImport = true">{{
                            $t("button.import")
                        }}</n-button>
                        <n-button type="info" class="col-2" @click="showExport = true">{{
                            $t("button.export")
                        }}</n-button>
                        <n-button
                            type="info"
                            class="pl-3 pr-3"
                            @click="
                                () => {
                                    showApply = true
                                    clearForm()
                                }
                            "
                            >{{ $t("dataTable.listing.eliminationApplication") }}</n-button
                        >
                        <n-button
                            type="info"
                            class="col-2"
                            @click="
                                () => {
                                    showAdd = true
                                    clearDieForm()
                                }
                            "
                            >{{ $t("button.register") }}</n-button
                        >
                        <n-dropdown trigger="hover" :options="batchOptions" @select="handleSelect">
                            <n-button type="info" class="col-2">{{
                                $t("dataTable.listing.batchOperation")
                            }}</n-button>
                        </n-dropdown>
                    </n-space>
                </n-space>
            </template>
            <!-- tab分栏 -->
            <n-card>
                <n-tabs type="line" @update:value="tabsChange">
                    <n-tab-pane name="待审定" :tab="$t('dataTable.listing.forReviewAndApproval')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待审定淘汰记录 -->
                                    <div>
                                        {{
                                            $t(
                                                "dtables.listing.theExaminationAndApprovalOfStayOutRecord"
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
                                                getPigDieList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        :placeholder="$t('dataTable.listing.searchFilesEncoded')"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigDieList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigDieList()
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
                    <n-tab-pane name="待处理" :tab="$t('dataTable.listing.toBeProcessed')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 待处理淘汰记录 -->
                                    <div>{{ $t("dtables.listing.toBeProcessedOutRecord") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigDieList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        placeholder="搜索档案编码"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigDieList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigDieList()
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
                                    <!-- 已完成淘汰记录 -->
                                    <div>
                                        {{
                                            $t(
                                                "dtables.listing.theEliminationRecordHasBeenCompleted"
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
                                                getPigDieList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        placeholder="搜索档案编码"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigDieList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigDieList()
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
                    <n-tab-pane name="已撤销" :tab="$t('dataTable.listing.hadWithdrawn')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 已撤销淘汰记录 -->
                                    <div>{{ $t("dtables.listing.hadWithdrawnOutRecord") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigDieList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        placeholder="搜索档案编码"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigDieList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigDieList()
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
                    <n-tab-pane name="被驳回" :tab="$t('dataTable.listing.beRejected')">
                        <div class="tabHeader font-16 font-weight-bolder">
                            <n-space align="center" justify="space-between">
                                <n-space align="center">
                                    <!-- 被驳回淘汰记录 -->
                                    <div>{{ $t("dtables.listing.beRejectedOutRecord") }}:</div>
                                    <n-date-picker
                                        v-model:value="timeList"
                                        type="daterange"
                                        :shortcuts="rangeShortcuts"
                                        :is-date-disabled="disablePreviousDate"
                                        @update:value="
                                            () => {
                                                search.page = 1
                                                getPigDieList()
                                            }
                                        "
                                        actions="['confirm']"
                                    />
                                </n-space>
                                <div>
                                    <n-input
                                        placeholder="搜索档案编码"
                                        autosize
                                        style="min-width: 300px"
                                        clearable
                                        v-model:value="search.pigCode"
                                        @keyup.enter="getPigDieList"
                                        @clear="
                                            () => {
                                                search.pigCode = ''
                                                getPigDieList()
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
                <n-data-table
                    :columns="columns"
                    :data="pigdieList"
                    :loading="showloading"
                    :scroll-x="3000"
                    v-model:checked-row-keys="checkedRowKeys"
                    :row-key="row => row"
                    @update:filters="handleFiltersChange"
                    :row-class-name="rowClassName"
                    @update:search="getPigDieList"
                />
                <n-card content-style="padding: 10px;">
                    <n-space justify="space-between" align="center">
                        <n-text class="pl-1">本页总共：{{ pigdieList.length }}条</n-text>&nbsp;
                        <n-pagination
                            v-model:page="search.page"
                            v-model:pageSize="search.limit"
                            :item-count="search.total"
                            show-size-picker
                            :page-sizes="[10, 20, 30, 40]"
                            show-quick-jumper
                            @update:page="getPigDieList()"
                            @update:pageSize="getPigDieList()"
                        >
                            <template #prefix="{ itemCount }">共 {{ itemCount }} 条</template>
                        </n-pagination>
                    </n-space>
                </n-card>
            </n-card>
        </n-card>

        <!-- 淘汰申请 -->
        <n-modal
            class="custom-card"
            v-model:show="showApply"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.obsoleteToApplyFor')"
            :bordered="false"
            @afterLeave="clearForm()"
            :mask-closable="false"
        >
            <n-form
                :model="dieApplyForm"
                ref="formRef"
                :rules="rules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input :style="{ width: '200px' }" placeholder="请输入种猪编码、耳牌号" v-model:value="dieApplyForm.pigCode" :disabled="dieApplyForm.id ? true : false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="dieApplyForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="pigInfoApiSearch('apply')">
                                        {{ $t("dtables.listing.search") }}
                                    </n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item
                                path="farmdieReason"
                                :label="$t('dtables.listing.selectedForReasons')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="dieApplyForm.farmdieReason"
                                    :options="getDictionaries('farmdieReason')"
                                />
                            </n-form-item>

                            <n-form-item
                                :path="
                                    getDictionarieName(
                                        'farmdieReason',
                                        dieApplyForm.farmdieReason
                                    ) == '其他'
                                        ? 'remark'
                                        : ''
                                "
                                :label="$t('dataTable.listing.remark')"
                            >
                                <n-input
                                    v-model:value="dieApplyForm.remark"
                                    type="textarea"
                                    maxlength="200"
                                    show-count
                                    :placeholder="$t('dtables.listing.pleaseEnterANote')"
                                    style="width: 255px"
                                />
                            </n-form-item>

                            <n-form-item
                                path="applicant"
                                :label="$t('dataTable.listing.applicant')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="dieApplyForm.applicant"
                                    :options="userList"
                                    filterable
                                    :disabled="dieApplyForm.id ? true : false"
                                />
                            </n-form-item>

                            <n-form-item
                                path="applicationDatetime"
                                :label="$t('dtables.listing.applicationDate')"
                                class="feedback-wrapper-noHeight"
                            >
                                <n-date-picker
                                    v-model:value="dieApplyForm.applicationDatetime"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    style="width: 255px"
                                    :disabled="dieApplyForm.id ? true : false"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                />
                            </n-form-item>
                        </n-gi>

                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dataTable.listing.swineInformation')"
                                :pigDetail="pigDetail"
                                :displayOptions="['nowFarmid', 'nowDormCode', 'nowColumnCode']"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button
                            type="info"
                            @click="handleValidateClick('apply')"
                            attr-type="button"
                            >{{ $t("dtables.listing.save") }}</n-button
                        >
                        <n-button
                            @click="
                                () => {
                                    showApply = false
                                    clearForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 选淘登记 -->
        <n-modal
            class="custom-card"
            v-model:show="showAdd"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.selectedForRegistration')"
            :bordered="false"
            @afterLeave="clearDieForm()"
            :mask-closable="false"
        >
            <n-form
                :model="dieForm"
                ref="dieFormRef"
                :rules="dieRules"
                label-placement="left"
                label-width="auto"
            >
                <n-space vertical :size="20">
                    <n-grid x-gap="20" :cols="10">
                        <n-gi span="5 400:5 600:5 800:5">
                            <n-form-item path="pigCode" :label="$t('dataTable.listing.pigCode')">
                                <n-input-group>
                                    <!-- <n-input :style="{ width: '200px' }" placeholder="请输入种猪编码" v-model:value="dieForm.pigCode" :disabled="dieForm.id ? true : false" /> -->
                                    <!-- 母猪编号 -->
                                    <n-select
                                        v-model:value="dieForm.pigCode"
                                        :style="{ width: '60%' }"
                                        :placeholder="$t('dtables.listing.pleaseEnterThe')"
                                        clearable
                                        remote
                                        filterable
                                        :options="pigCodeOptions"
                                        :loading="loading"
                                        @search="handleSearch"
                                    />
                                    <n-button type="primary" @click="pigDieInfoApiSearch()">
                                        {{ $t("dtables.listing.search") }}
                                    </n-button>
                                </n-input-group>
                            </n-form-item>

                            <n-form-item
                                path="farmdieHandlingType"
                                :label="$t('dtables.listing.obsoleteWay')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="dieForm.farmdieHandlingType"
                                    :options="getDictionaries('farmdieHandlingType')"
                                />
                            </n-form-item>

                            <n-form-item
                                path="handlingType"
                                :label="$t('dataTable.listing.treatmentMethod')"
                                v-if="
                                    getDictionarieName(
                                        'farmdieHandlingType',
                                        dieForm.farmdieHandlingType
                                    ) == '处死'
                                "
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="dieForm.handlingType"
                                    :options="getDictionaries('handlingType')"
                                />
                            </n-form-item>

                            <n-form-item
                                path="weightValue"
                                :label="$t('dataTable.listing.weight')"
                                v-if="
                                    getDictionarieName(
                                        'farmdieHandlingType',
                                        dieForm.farmdieHandlingType
                                    ) == '处死'
                                "
                            >
                                <n-input-number
                                    v-model:value="dieForm.weightValue"
                                    :min="0"
                                    :validator="weightValidator"
                                    :style="{ width: '255px' }"
                                >
                                    <template #suffix>kg</template>
                                </n-input-number>
                            </n-form-item>

                            <n-form-item
                                path="farmdieDatetime"
                                :label="$t('dataTable.listing.dateOfRegistration')"
                            >
                                <n-date-picker
                                    v-model:value="dieForm.farmdieDatetime"
                                    type="date"
                                    :is-date-disabled="disablePreviousDate"
                                    actions="['now']"
                                    style="width: 255px"
                                    @focus="
                                        e => {
                                            e.target.blur()
                                        }
                                    "
                                />
                            </n-form-item>

                            <n-form-item
                                path="staffCode"
                                :label="$t('dataTable.listing.operatingPersonnel')"
                            >
                                <n-select
                                    :style="{ width: '255px' }"
                                    v-model:value="dieForm.staffCode"
                                    :options="userList"
                                    filterable
                                    placeholder="请输入操作人"
                                />
                            </n-form-item>
                        </n-gi>

                        <n-gi span="5 400:5 600:5 800:5">
                            <pigDetailComponents
                                :loading="showFinding"
                                :cardTitle="$t('dataTable.listing.theSowInformation')"
                                :pigDetail="pigDetail"
                                :displayOptions="[
                                    'nowFarmid',
                                    'nowDormCode',
                                    'nowColumnCode',
                                    'gender'
                                ]"
                            ></pigDetailComponents>
                        </n-gi>
                    </n-grid>
                    <n-space justify="center">
                        <n-button type="info" @click="handleValidateClick('add')" attr-type="button"
                            >保存</n-button
                        >
                        <n-button
                            @click="
                                () => {
                                    showAdd = false
                                    clearForm()
                                }
                            "
                            >取消</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 批量选淘登记 -->
        <n-modal
            class="custom-card"
            v-model:show="showAddAll"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.batchSelectedForRegistration')"
            :bordered="false"
            @afterLeave="clearAllForm()"
            :mask-closable="false"
        >
            <n-form
                :model="dieAllForm"
                ref="dieAllFormRef"
                :rules="dieAllRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-form-item
                        path="farmdieHandlingType"
                        :label="$t('dtables.listing.obsoleteWay')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="dieAllForm.farmdieHandlingType"
                            :options="getDictionaries('farmdieHandlingType')"
                        />
                    </n-form-item>

                    <n-form-item
                        path="handlingType"
                        :label="$t('dataTable.listing.treatmentMethod')"
                        v-if="
                            getDictionarieName(
                                'farmdieHandlingType',
                                dieAllForm.farmdieHandlingType
                            ) == '处死'
                        "
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="dieAllForm.handlingType"
                            :options="getDictionaries('handlingType')"
                        />
                    </n-form-item>

                    <n-form-item
                        path="weightValue"
                        :label="$t('dataTable.listing.weight')"
                        v-if="
                            getDictionarieName(
                                'farmdieHandlingType',
                                dieAllForm.farmdieHandlingType
                            ) == '处死'
                        "
                        class="feedback-wrapper-noHeight"
                    >
                        <n-input-number
                            v-model:value="dieAllForm.weightValue"
                            :min="0"
                            :validator="weightValidator"
                            :style="{ width: '255px' }"
                        >
                            <template #suffix>kg</template>
                        </n-input-number>
                        <span class="redTips">
                            {{ $t("dtables.listing.batchOperationWillBeTheSameWeight") }}
                        </span>
                    </n-form-item>

                    <n-form-item
                        path="farmdieDatetime"
                        :label="$t('dataTable.listing.dateOfRegistration')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-date-picker
                            v-model:value="dieAllForm.farmdieDatetime"
                            type="date"
                            :is-date-disabled="disablePreviousDate"
                            actions="['now']"
                            style="width: 255px"
                            @focus="
                                e => {
                                    e.target.blur()
                                }
                            "
                        />
                    </n-form-item>

                    <n-form-item
                        path="staffCode"
                        :label="$t('dataTable.listing.operatingPersonnel')"
                        class="feedback-wrapper-noHeight"
                    >
                        <n-select
                            :style="{ width: '255px' }"
                            v-model:value="dieAllForm.staffCode"
                            :options="userList"
                            filterable
                            placeholder="请输入操作人"
                        />
                    </n-form-item>

                    <n-space justify="center">
                        <n-button
                            type="info"
                            @click="handleValidateClick('addAll')"
                            attr-type="button"
                            >{{ $t("dtables.listing.save") }}</n-button
                        >
                        <n-button
                            @click="
                                () => {
                                    showAddAll = false
                                    clearAllForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 审定驳回-->
        <n-modal
            class="custom-card"
            v-model:show="showApprove"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.dismissTheReason')"
            :bordered="false"
            @afterLeave="clearApproveForm()"
            :mask-closable="false"
        >
            <n-form
                :model="approveForm"
                ref="approveFormRef"
                :rules="approveRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-form-item
                        path="rejectionReason"
                        :label="$t('dataTable.listing.reasonsForRejection')"
                    >
                        <n-input
                            v-model:value="approveForm.rejectionReason"
                            type="textarea"
                            maxlength="200"
                            show-count
                            :placeholder="$t('dtables.listing.pleaseEnterTheRejectReason')"
                            style="width: 350px"
                        />
                    </n-form-item>

                    <n-space justify="center">
                        <n-button
                            type="info"
                            @click="handleValidateClick('approve')"
                            attr-type="button"
                            >{{ $t("dtables.listing.save") }}</n-button
                        >
                        <n-button
                            @click="
                                () => {
                                    showApprove = false
                                    clearApproveForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 撤销-->
        <n-modal
            class="custom-card"
            v-model:show="showRevoke"
            preset="card"
            :style="bodyStyle"
            :title="$t('dtables.listing.causeForRevocation')"
            :bordered="false"
            @afterLeave="clearRevokeForm()"
            :mask-closable="false"
        >
            <n-form
                :model="revokeForm"
                ref="revokeFormRef"
                :rules="revokeRules"
                label-placement="left"
                :label-width="100"
            >
                <n-space vertical :size="20">
                    <n-form-item
                        path="revokeReason"
                        :label="$t('dtables.listing.causeForRevocation')"
                    >
                        <n-input
                            v-model:value="revokeForm.revokeReason"
                            type="textarea"
                            maxlength="200"
                            show-count
                            :placeholder="$t('dtables.listing.pleaseEnterTheCauseForRevocation')"
                            style="width: 350px"
                        />
                    </n-form-item>

                    <n-space justify="center">
                        <n-button
                            type="info"
                            @click="handleValidateClick('revoke')"
                            attr-type="button"
                            >{{ $t("dtables.listing.save") }}</n-button
                        >
                        <n-button
                            @click="
                                () => {
                                    showRevoke = false
                                    clearRevokeForm()
                                }
                            "
                            >{{ $t("dtables.listing.cancel") }}</n-button
                        >
                    </n-space>
                </n-space>
            </n-form>
        </n-modal>

        <!-- 导入 -->
        <eximportComponents
            v-model:openImport="showImport"
            templateNmae="piglet-archive-upload-template.xls"
            apiUrl="batchAddPigSpFarmdieRecordApi"
            @getlist="
                () => {
                    search.page = 1
                    getPigDieList()
                }
            "
        ></eximportComponents>

        <!-- 导出 -->
        <exportComponents
            fileName="选淘列表"
            apiUrl="exportPigSpFarmdieRecordApi"
            :search="search"
            v-model:openExport="showExport"
        ></exportComponents>
    </div>
</template>
<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { NButton, useMessage, NSpace, useDialog } from "naive-ui"
    import {
        getPigSpFarmdieRecordPageListApi,
        applyPigSpFarmdieApi,
        approvePigSpFarmdieApi,
        registerPigSpFarmdieApi,
        revokePigSpFarmdieApi,
        editPigSpFarmdieApi
    } from "@/api/pigEliminate.js"
    import { getPigInfoApi, getfuzzyQuery } from "@/api/public.js"
    import { useStore } from "vuex"

    import helper from "@/utils/helper.js"
    import exportComponents from "@/components/exExport.vue"
    import eximportComponents from "@/components/exImport.vue"
    import pigDetailComponents from "@/components/minPigDetail.vue"
    // import tableComponents from '@/components/table.vue'
    import { useI18n } from "vue-i18n"

    export default defineComponent({
        name: "pigFormula",
        props: {
            pageData: Object,
            pigDictionaries: Object
        },
        components: {
            eximportComponents,
            exportComponents,
            pigDetailComponents
            // tableComponents
        },
        setup() {
            const checkedRowKeysRef = ref([])
            const store = useStore()
            const message = useMessage()
            const dialog = useDialog()
            const formRef = ref(null)
            const dieFormRef = ref(null)
            const approveFormRef = ref(null)
            const dieAllFormRef = ref(null)
            const revokeFormRef = ref(null)
            const { t } = useI18n()
            // 异步加载
            const loadingRef = ref(false)
            const optionsRef = ref([])
            const state = reactive({
                showApply: false,
                showAdd: false,
                showApprove: false,
                showRevoke: false,

                showAddAll: false,
                showImport: false,
                showExport: false,
                showFinding: false,
                showloading: false,
                // 是否单个审定
                isSingleApprove: false,
                isSingleRevoke: false,

                timeList: [Date.now(), Date.now()],
                search: {
                    pigCode: "",
                    // 淘汰记录日期开始时间
                    farmdieDatetimeGte: helper.formatStartTamp(Date.now()),
                    // 淘汰记录日期结束时间
                    farmdieDatetimeLte: helper.formatEndTamp(Date.now()),
                    farmCodeList: [],
                    dormCodeList: [],
                    genderList: [],
                    farmdieReasonList: [],
                    farmdieHandlingTypeList: [],
                    handlingTypeList: [],
                    pigSourcesList: [],
                    breedingLevelList: [],
                    pigStatusList: [],
                    applicantList: [],
                    approverList: [],
                    staffCodeList: [],
                    page: 1,
                    limit: 10,
                    total: undefined,
                    processingStatusList: []
                },
                // 批量操作
                batchOptions: [
                    {
                        label: t("dtables.listing.theExaminationAndApprovalOfBatch"),
                        key: "1"
                    },
                    {
                        label: t("dtables.listing.bulkRegistration"),
                        key: "2"
                    },
                    {
                        label: t("dtables.listing.batchCancellation"),
                        key: "3"
                    }
                ],
                // 选淘登记
                dieForm: {
                    pigCode: undefined,
                    farmdieDatetime: Date.now(),
                    farmdieHandlingType: undefined,
                    handlingType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    models: []
                },

                // 批量选淘登记
                dieAllForm: {
                    farmdieDatetime: Date.now(),
                    farmdieHandlingType: undefined,
                    handlingType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    models: []
                },

                // 淘汰申请
                dieApplyForm: {
                    pigCode: undefined,
                    applicationDatetime: Date.now(),
                    farmdieReason: undefined,
                    applicant: store.state.core.userInfo.id || "",
                    remark: undefined
                },
                // 审定
                approveForm: {
                    flag: undefined,
                    rejectionReason: undefined,
                    approvalDatetime: Date.now(),
                    models: []
                },
                // 撤销
                revokeForm: {
                    revokeReason: undefined,
                    models: []
                },
                VaccineTypes: [],
                pigdieList: [],
                pigDetail: {},
                tabSelection: [],
                columns: [],
                // 母猪编码
                pigCodeOptions: []
            })

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

            // 获取淘汰列表
            const getPigDieList = async () => {
                state.search.farmdieDatetimeGte = helper.formatStartTamp(state.timeList[0])
                state.search.farmdieDatetimeLte = helper.formatEndTamp(state.timeList[1])
                state.showloading = true

                await getPigSpFarmdieRecordPageListApi(state.search).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigdieList = res.data.list
                        state.search.page = res.data.pageNo
                        state.search.limit = res.data.pageSize
                        state.search.total = res.data.total
                    }
                })
            }
            // 淘汰申请
            const handleDieApplyBtn = async () => {
                let data = JSON.parse(JSON.stringify(state.dieApplyForm))
                data.applicationDatetime = helper.format(data.applicationDatetime)
                let url = state.dieApplyForm.id ? editPigSpFarmdieApi : applyPigSpFarmdieApi
                await url(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dataTable.listing.saveSuccess"))
                        clearForm()
                        state.showApply = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigDieList()
                    }
                })
            }

            //登记
            const handleDieBtn = async () => {
                state.dieForm.models = [{ pigCode: state.dieForm.pigCode }]
                let data = JSON.parse(JSON.stringify(state.dieForm))
                data.farmdieDatetime = helper.format(data.farmdieDatetime)
                await registerPigSpFarmdieApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.registrationSuccessful"))
                        clearForm()
                        state.showAdd = false
                        state.pigDetail = {}
                        state.search.page = 1
                        getPigDieList()
                    }
                })
            }

            //批量登记
            const handleDieAllBtn = async () => {
                let data = JSON.parse(JSON.stringify(state.dieAllForm))
                data.farmdieDatetime = helper.format(data.farmdieDatetime)
                await registerPigSpFarmdieApi(data).then(res => {
                    if (res.code == 0) {
                        message.success(t("dtables.listing.registrationSuccessful"))
                        clearForm()
                        state.showAddAll = false
                        state.search.page = 1
                        getPigDieList()
                    }
                })
            }

            // 审定提示
            const handleApproveBtn = () => {
                if (!state.isSingleApprove && checkedRowKeysRef.value.length == 0) {
                    message.warning(t("dtables.listing.pleaseSelectDataFirst"))
                    return false
                }
                const yz = []
                if (!state.isSingleApprove) {
                    state.approveForm.models = checkedRowKeysRef.value
                }
                state.approveForm.models.forEach((ele, index) => {
                    let name = store.getters["dictionaries/getDictionarieName"](
                        "farmdieProcessingStatus",
                        ele.processingStatus
                    )
                    if (name != "待审定") {
                        yz.push(index)
                    }
                })
                if (yz.length === 0) {
                    dialog.success({
                        // title: '淘汰审定',
                        content: t("dtables.listing.whetherToGrantApproval"),
                        showIcon: false,
                        maskClosable: false,
                        // 同意，驳回
                        positiveText: t("dtables.listing.agree"),
                        negativeText: t("dtables.listing.rejected"),
                        onClose: () => {
                            clearApproveForm()
                        },
                        onPositiveClick: () => {
                            state.approveForm.flag = true
                            let data = JSON.parse(JSON.stringify(state.approveForm))
                            data.approvalDatetime = helper.formatStartTamp(data.approvalDatetime)
                            approvePigSpFarmdieApi(data).then(res => {
                                if (res.code == 0) {
                                    let msg =
                                        res.data && res.data.length == 0 ? "提交成功！" : res.data
                                    message.success(msg)
                                    state.showApprove = false
                                    getPigDieList()
                                }
                                clearApproveForm()
                            })
                        },
                        onNegativeClick: () => {
                            // approveFormRef.value.restoreValidation()
                            state.approveForm.flag = false
                            state.showApprove = true
                        }
                    })
                } else {
                    message.error("请选择状态为待审定的数据")
                }
            }

            // 批量登记按钮
            function allAddBtn() {
                if (checkedRowKeysRef.value.length == 0) {
                    message.warning("请先选择数据！")
                    return false
                }
                state.dieAllForm.models = checkedRowKeysRef.value
                const yz = []
                state.dieAllForm.models.forEach((ele, index) => {
                    let name = store.getters["dictionaries/getDictionarieName"](
                        "farmdieProcessingStatus",
                        ele.processingStatus
                    )
                    if (name != "待处理") {
                        yz.push(index)
                    }
                })
                if (yz.length === 0) {
                    state.showAddAll = true
                } else {
                    message.error("请选择状态为待处理的数据")
                }
            }

            // 撤销
            function handleRevokeBtn() {
                let data = JSON.parse(JSON.stringify(state.revokeForm))
                revokePigSpFarmdieApi(data).then(res => {
                    if (res.code == 0) {
                        message.success("撤销成功！")
                        clearRevokeForm()
                        state.showRevoke = false
                        state.search.page = 1
                        getPigDieList()
                    }
                })
            }

            // 查询单个种猪的详情
            const pigInfoApiSearch = async type => {
                let pigcode = ""
                if (type == "apply") {
                    if (!state.dieApplyForm.pigCode) {
                        message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                        return false
                    }
                    pigcode = state.dieApplyForm.pigCode
                } else {
                    if (!state.dieForm.pigCode) {
                        message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                        return false
                    }
                    pigcode = state.dieForm.pigCode
                }
                state.showloading = true
                if (pigcode.length == 6) {
                    await getPigInfoApi({ searchInfo6: pigcode }).then(res => {
                        state.showloading = false
                        if (res.code == 0 && res.data) {
                            if (JSON.stringify(res.data) == "{}") {
                                message.error("该种猪编号未查询到！")
                            }

                            res.data.gender = store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                res.data.gender
                            )
                            res.data.pigStatus = store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                res.data.pigStatus
                            )

                            state.pigDetail = res.data
                        } else {
                            message.error("该种猪编号未查询到！")
                            state.pigDetail = {}
                        }
                    })
                } else {
                    await getPigInfoApi({ searchInfo: pigcode }).then(res => {
                        state.showloading = false
                        if (res.code == 0 && res.data) {
                            if (JSON.stringify(res.data) == "{}") {
                                message.error("该种猪编号未查询到！")
                            }
                            res.data.gender = store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                res.data.gender
                            )
                            res.data.pigStatus = store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                res.data.pigStatus
                            )
                            state.pigDetail = res.data
                        } else {
                            message.error("该种猪编号未查询到！")
                            state.pigDetail = {}
                        }
                    })
                }
            }

            // 登记中-查询单个种猪的详情
            const pigDieInfoApiSearch = async () => {
                if (!state.dieForm.pigCode) {
                    message.error(t("dtables.listing.pleaseEnterTheSwineEncoding"))
                    return false
                }
                state.showloading = true
                await getPigInfoApi({ searchInfo: state.dieForm.pigCode }).then(res => {
                    state.showloading = false
                    if (res.code == 0) {
                        state.pigDetail = res.data
                    } else {
                        message.error("该种猪编号未查询到！")
                        state.pigDetail = {}
                    }
                })
            }

            const clearForm = () => {
                state.dieApplyForm = {
                    id: undefined,
                    pigCode: undefined,
                    applicationDatetime: Date.now(),
                    farmdieReason: undefined,
                    applicant: store.state.core.userInfo.id || "",
                    remark: undefined
                }
                state.pigDetail = {}
            }

            const clearAllForm = () => {
                state.dieAllForm = {
                    farmdieDatetime: Date.now(),
                    farmdieHandlingType: undefined,
                    handlingType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    models: []
                }
                checkedRowKeysRef.value = []
            }

            const clearDieForm = () => {
                state.dieForm = {
                    id: undefined,
                    pigCode: undefined,
                    farmdieDatetime: Date.now(),
                    farmdieHandlingType: undefined,
                    handlingType: undefined,
                    staffCode: store.state.core.userInfo.id || "",
                    models: []
                }
                state.pigDetail = {}
            }

            const clearApproveForm = () => {
                state.approveForm = {
                    flag: undefined,
                    rejectionReason: undefined,
                    approvalDatetime: Date.now(),
                    models: []
                }
                checkedRowKeysRef.value = []
                state.isSingleApprove = false
            }

            const clearRevokeForm = () => {
                state.revokeForm = {
                    revokeReason: undefined,
                    models: []
                }
                checkedRowKeysRef.value = []
                state.isSingleRevoke = false
            }

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
            // 不同的tabs变化操作按钮选项
            const operationChange = val => {
                state.columns[state.columns.length - 1].key == "actions"
                    ? state.columns.splice(state.columns.length - 1, 1)
                    : ""
                switch (val) {
                    case "待审定":
                        state.columns.push({
                            // title: '操作',
                            title: () => {
                                return t("dataTable.listing.actions")
                            },
                            key: "actions",
                            width: 175,
                            fixed: "right",
                            render(row) {
                                return h(NSpace, {}, [
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "error",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待审定" ||
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "被驳回"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                state.revokeForm.models = []
                                                state.revokeForm.models = [row]
                                                state.isSingleRevoke = true
                                                state.showRevoke = true
                                            }
                                        },
                                        // 撤销
                                        { default: () => t("button.revoke") }
                                    ),
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "info",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待审定"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                clearApproveForm()
                                                state.approveForm.models.push(row)
                                                state.isSingleApprove = true
                                                handleApproveBtn()
                                            }
                                        },
                                        // 审定
                                        { default: () => t("button.approve") }
                                    ),
                                    // h(
                                    // NButton,
                                    // {
                                    // size: "small",
                                    // type: "success",
                                    // text: true,
                                    // disabled:
                                    // store.getters["dictionaries/getDictionarieName"](
                                    // "farmdieProcessingStatus",
                                    // row.processingStatus
                                    // ) == "待处理"
                                    // ? false
                                    // : true,
                                    // onClick: () => {
                                    // state.dieForm.pigCode = row.pigCode
                                    // state.dieForm.id = row.id
                                    // pigDieInfoApiSearch()
                                    // state.showAdd = true
                                    // },
                                    // },
                                    // 登记
                                    // { default: () => t("button.register") }
                                    // ),
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "warning",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待审定" ||
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "被驳回"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                let status = store.getters[
                                                    "dictionaries/getDictionarieName"
                                                ]("farmdieProcessingStatus", row.processingStatus)
                                                if (status == "待审定" || status == "被驳回") {
                                                    state.dieApplyForm = []
                                                    state.dieApplyForm = row
                                                    state.dieApplyForm.applicationDatetime =
                                                        new Date(row.applicationDatetime).getTime()

                                                    pigInfoApiSearch("apply")
                                                    state.showApply = true
                                                }
                                            }
                                        },
                                        // 编辑
                                        { default: () => t("button.edit") }
                                    )
                                ])
                            }
                        })
                        break
                    case "待处理":
                        state.columns.push({
                            // title: '操作',
                            title: () => {
                                return t("dataTable.listing.actions")
                            },
                            key: "actions",
                            width: 175,
                            fixed: "right",
                            render(row) {
                                return h(NSpace, {}, [
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "success",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待处理"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                state.dieForm.pigCode = row.pigCode
                                                state.dieForm.id = row.id
                                                pigDieInfoApiSearch()
                                                state.showAdd = true
                                            }
                                        },
                                        // 登记
                                        { default: () => t("button.register") }
                                    )
                                ])
                            }
                        })
                        break
                    case "已完成":
                        break
                    case "已撤销":
                        break
                    case "被驳回":
                        state.columns.push({
                            // title: '操作',
                            title: () => {
                                return t("dataTable.listing.actions")
                            },
                            key: "actions",
                            width: 175,
                            fixed: "right",
                            render(row) {
                                return h(NSpace, {}, [
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "error",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待审定" ||
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "被驳回"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                state.revokeForm.models = []
                                                state.revokeForm.models = [row]
                                                state.isSingleRevoke = true
                                                state.showRevoke = true
                                            }
                                        },
                                        // 撤销
                                        { default: () => t("button.revoke") }
                                    ),
                                    h(
                                        NButton,
                                        {
                                            size: "small",
                                            type: "warning",
                                            text: true,
                                            disabled:
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "待审定" ||
                                                store.getters["dictionaries/getDictionarieName"](
                                                    "farmdieProcessingStatus",
                                                    row.processingStatus
                                                ) == "被驳回"
                                                    ? false
                                                    : true,
                                            onClick: () => {
                                                let status = store.getters[
                                                    "dictionaries/getDictionarieName"
                                                ]("farmdieProcessingStatus", row.processingStatus)
                                                if (status == "待审定" || status == "被驳回") {
                                                    state.dieApplyForm = []
                                                    state.dieApplyForm = row
                                                    state.dieApplyForm.applicationDatetime =
                                                        new Date(row.applicationDatetime).getTime()

                                                    pigInfoApiSearch("apply")
                                                    state.showApply = true
                                                }
                                            }
                                        },
                                        // 编辑
                                        { default: () => t("button.edit") }
                                    )
                                ])
                            }
                        })
                        break
                    default:
                        break
                }
            }

            // tab分栏切换
            const tabsChange = value => {
                operationChange(value)
                state.search.processingStatusList = store.getters["dictionaries/getDictionarieId"](
                    "farmdieProcessingStatus",
                    value
                )
                state.search.page = 1
                getPigDieList()
            }
            const setTableColumns = () => {
                state.columns = [
                    {
                        type: "selection"
                    },
                    {
                        // title: '种猪编码',
                        title: () => {
                            return t("dataTable.listing.pigCode")
                        },
                        key: "pigCode",
                        width: 160
                    },
                    {
                        // title: '之前状态',
                        title: () => {
                            return t("dataTable.listing.beforeStatus")
                        },
                        key: "pigStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                row.pigStatus
                            )
                        }
                    },
                    {
                        // title: '处理状态',
                        title: () => {
                            return t("dataTable.listing.processingStatus")
                        },
                        key: "processingStatus",
                        // filter: true,
                        // filterOptions: computed(() => {
                        //     return store.state.dictionaries.dictionaries['farmdieProcessingStatus']
                        // }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "farmdieProcessingStatus",
                                row.processingStatus
                            )
                        }
                    },
                    {
                        // title: '场区',
                        title: () => {
                            return t("dataTable.listing.Farm")
                        },
                        key: "farmCode",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.farmList
                        }),
                        render(row) {
                            return store.getters["dictionaries/getFarmName"](row.farmCode)
                        }
                    },
                    {
                        // title: '栋舍',
                        title: () => {
                            return t("dataTable.listing.Dorm")
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
                        // title: '栏/床位',
                        title: () => {
                            return t("dataTable.listing.column")
                        },
                        key: "columnCode"
                    },
                    {
                        // title: '性别',
                        title: () => {
                            return t("dataTable.listing.gender")
                        },
                        key: "gender",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["gender"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "gender",
                                row.gender
                            )
                        }
                    },
                    {
                        // title: '淘汰原因',
                        title: () => {
                            return t("dataTable.listing.reasonsForElimination")
                        },
                        key: "farmdieReason",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["farmdieReason"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "farmdieReason",
                                row.farmdieReason
                            )
                        }
                    },
                    {
                        // title: '处理方式',
                        title: () => {
                            return t("dataTable.listing.treatmentMethod")
                        },
                        key: "farmdieHandlingType",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["farmdieHandlingType"]
                        }),
                        render(row) {
                            let name = store.getters["dictionaries/getDictionarieName"](
                                "farmdieHandlingType",
                                row.farmdieHandlingType
                            )
                            if (name == "处死") {
                                return store.getters["dictionaries/getDictionarieName"](
                                    "handlingType",
                                    row.handlingType
                                )
                            } else {
                                return (
                                    store.getters["dictionaries/getDictionarieName"](
                                        "farmdieHandlingType",
                                        row.farmdieHandlingType
                                    ) || "--"
                                )
                            }
                        }
                    },
                    {
                        // title: '品种',
                        title: () => {
                            return t("dataTable.listing.species")
                        },
                        key: "pigSources",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigSources"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigSources",
                                row.pigSources
                            )
                        }
                    },
                    {
                        // title: '品系',
                        title: () => {
                            return t("dataTable.listing.strain")
                        },
                        key: "strain"
                    },
                    {
                        // title: '育种等级',
                        title: () => {
                            return t("dataTable.listing.breedingLevel")
                        },
                        key: "breedingLevel",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["breedingLevel"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingLevel",
                                row.breedingLevel
                            )
                        }
                    },
                    {
                        // title: '育种值',
                        title: () => {
                            return t("dataTable.listing.breedingValue")
                        },
                        key: "breedingValue"
                    },
                    {
                        // title: '驳回原因',
                        title: () => {
                            return t("dataTable.listing.reasonsForRejection")
                        },
                        key: "rejectionReason",
                        render(row) {
                            return row.rejectionReason || "--"
                        },
                        width: 100,
                        ellipsis: {
                            tooltip: true
                        }
                    },
                    {
                        // title: '申请人',
                        title: () => {
                            return t("dataTable.listing.applicant")
                        },
                        key: "applicant",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        }),
                        render(row) {
                            return row.applicant || "--"
                        }
                    },
                    {
                        // title: '审定人',
                        title: () => {
                            return t("dataTable.listing.approver")
                        },
                        key: "approver",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.userSelectList
                        }),
                        render(row) {
                            return row.approver || "--"
                        }
                    },
                    {
                        // 胎次
                        title: () => t("dataTable.listing.parity"),
                        key: "parity"
                    },
                    {
                        // 日龄
                        title: () => t("dtables.listing.daysOfAge"),
                        key: "daysOfAge"
                    },
                    {
                        title: () => t("dataTable.listing.breedingStatus"),
                        key: "breedingStatus",
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "breedingStatus",
                                row.breedingStatus
                            )
                        }
                    },
                    {
                        // 生长状态
                        title: () => t("dtables.listing.theGrowthState"),
                        key: "pigStatus",
                        filter: true,
                        filterOptions: computed(() => {
                            return store.state.dictionaries.dictionaries["pigStatus"]
                        }),
                        render(row) {
                            return store.getters["dictionaries/getDictionarieName"](
                                "pigStatus",
                                row.pigStatus
                            )
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
                        }),
                        render(row) {
                            return row.staffCode || "--"
                        }
                    }
                    // {
                    // title: '操作',
                    // title: () => {
                    //     return t("dataTable.listing.actions")
                    // },
                    // key: "actions",
                    // width: 175,
                    // fixed: "right",
                    // render(row) {
                    //     return h(NSpace, {}, [
                    //         h(
                    //     NButton,
                    //     {
                    //         size: "small",
                    //         type: "error",
                    //         text: true,
                    //         disabled:
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "待审定" ||
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "被驳回"
                    //                 ? false
                    //                 : true,
                    //         onClick: () => {
                    //             state.revokeForm.models = []
                    //             state.revokeForm.models = [row]
                    //             state.isSingleRevoke = true
                    //             state.showRevoke = true
                    //         },
                    //     },
                    //     // 撤销
                    //     { default: () => t("button.revoke") }
                    // ),
                    // h(
                    //     NButton,
                    //     {
                    //         size: "small",
                    //         type: "info",
                    //         text: true,
                    //         disabled:
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "待审定"
                    //                 ? false
                    //                 : true,
                    //         onClick: () => {
                    //             clearApproveForm()
                    //             state.approveForm.models.push(row)
                    //             state.isSingleApprove = true
                    //             handleApproveBtn()
                    //         },
                    //     },
                    //     // 审定
                    //     { default: () => t("button.approve") }
                    // ),
                    // h(
                    //     NButton,
                    //     {
                    //         size: "small",
                    //         type: "success",
                    //         text: true,
                    //         disabled:
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "待处理"
                    //                 ? false
                    //                 : true,
                    //         onClick: () => {
                    //             state.dieForm.pigCode = row.pigCode
                    //             state.dieForm.id = row.id
                    //             pigDieInfoApiSearch()
                    //             state.showAdd = true
                    //         },
                    //     },
                    //     // 登记
                    //     { default: () => t("button.register") }
                    // ),
                    // h(
                    //     NButton,
                    //     {
                    //         size: "small",
                    //         type: "warning",
                    //         text: true,
                    //         disabled:
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "待审定" ||
                    //             store.getters["dictionaries/getDictionarieName"](
                    //                 "farmdieProcessingStatus",
                    //                 row.processingStatus
                    //             ) == "被驳回"
                    //                 ? false
                    //                 : true,
                    //         onClick: () => {
                    //                     let status = store.getters[
                    //                         "dictionaries/getDictionarieName"
                    //                     ]("farmdieProcessingStatus", row.processingStatus)
                    //                     if (status == "待审定" || status == "被驳回") {
                    //                         state.dieApplyForm = []
                    //                         state.dieApplyForm = row
                    //                         state.dieApplyForm.applicationDatetime = new Date(
                    //                             row.applicationDatetime
                    //                         ).getTime()

                    //                         pigInfoApiSearch("apply")
                    //                         state.showApply = true
                    //                     }
                    //                 },
                    //             },
                    //             // 编辑
                    //             { default: () => t("button.edit") }
                    //         ),
                    //     ])
                    // },
                    // },
                ]
            }

            onMounted(() => {
                setTableColumns()
                tabsChange("待审定")
                // getPigDieList();
            })
            return {
                ...toRefs(state),
                // tab分栏点击切换事件
                tabsChange,
                operationChange,
                // 模糊搜索(后6位)
                // 异步加载
                loading: loadingRef,
                options: optionsRef,
                handleSearch,
                formRef,
                dieFormRef,
                approveFormRef,
                dieAllFormRef,
                revokeFormRef,
                getPigDieList,
                pigInfoApiSearch,
                pigDieInfoApiSearch,
                getFarmName,
                getDormName,
                getDictionaries,
                getDictionarieName,
                clearForm,
                clearDieForm,
                clearApproveForm,
                clearAllForm,
                clearRevokeForm,
                handleDieApplyBtn,
                handleDieBtn,
                handleDieAllBtn,
                handleApproveBtn,
                handleRevokeBtn,
                allAddBtn,
                checkedRowKeys: checkedRowKeysRef,
                userList: computed(() => store.state.dictionaries.userSelectList),
                weightValidator: number => {
                    return /^[1-9][0-9]{0,3}?(\.\d{1,2})?$|^(\d{4})$/.test(number)
                },
                labelStyle: {
                    color: "#969595"
                },
                bodyStyle: {
                    width: "800px"
                },
                rules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    farmdieReason: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOut"),
                        trigger: ["blur", "change"]
                    },
                    applicant: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectTheApplicant"),
                        trigger: ["blur", "change"]
                    },
                    applicationDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseToApplyForTime")
                    },
                    remark: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterANote"),
                        trigger: ["blur", "change"]
                    }
                },
                dieRules: {
                    pigCode: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheSwineEncoding"),
                        trigger: ["blur", "change"]
                    },
                    farmdieHandlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOutText"),
                        trigger: ["blur", "change"]
                    },
                    handlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseDeath"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOperation"),
                        trigger: ["blur", "change"]
                    },
                    farmdieDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseToApplyForTime")
                    }
                },
                dieAllRules: {
                    farmdieHandlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOutText"),
                        trigger: ["blur", "change"]
                    },
                    handlingType: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseDeath"),
                        trigger: ["blur", "change"]
                    },
                    staffCode: {
                        required: true,
                        message: t("dtables.listing.pleaseSelectOperation"),
                        trigger: ["blur", "change"]
                    },
                    farmdieDatetime: {
                        required: true,
                        message: t("dtables.listing.pleaseChooseToApplyForTime")
                    }
                },
                approveRules: {
                    rejectionReason: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheRejectReason")
                        // trigger: ['blur', 'change']
                    }
                },
                revokeRules: {
                    revokeReason: {
                        required: true,
                        message: t("dtables.listing.pleaseEnterTheCauseForRevocation"),
                        trigger: ["blur", "change"]
                    }
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
                disablePreviousDate(ts) {
                    return ts > Date.now()
                },
                handleCheck(rowKeys) {
                    // state.tabSelection = rowKeys
                    checkedRowKeysRef.value = rowKeys
                },
                handleValidateClick(type) {
                    if (type == "apply") {
                        formRef.value.validate(errors => {
                            if (!errors) {
                                handleDieApplyBtn()
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                    )
                                )
                            }
                        })
                    } else if (type == "add") {
                        dieFormRef.value.validate(errors => {
                            if (!errors) {
                                handleDieBtn()
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                    )
                                )
                            }
                        })
                    } else if (type == "approve") {
                        approveFormRef.value.validate(errors => {
                            if (!errors) {
                                let data = JSON.parse(JSON.stringify(state.approveForm))
                                data.approvalDatetime = helper.format(data.approvalDatetime)
                                approvePigSpFarmdieApi(data).then(res => {
                                    if (res.code == 0) {
                                        let msg =
                                            res.data && res.data.length == 0
                                                ? "提交成功！"
                                                : res.data
                                        message.success(msg)
                                        state.showApprove = false
                                        getPigDieList()
                                    }
                                    clearApproveForm()
                                })
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                    )
                                )
                            }
                        })
                    } else if (type == "addAll") {
                        dieAllFormRef.value.validate(errors => {
                            if (!errors) {
                                handleDieAllBtn()
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                    )
                                )
                            }
                        })
                    } else if (type == "revoke") {
                        revokeFormRef.value.validate(errors => {
                            if (!errors) {
                                handleRevokeBtn()
                            } else {
                                message.error(
                                    t(
                                        "dtables.listing.youHaveNoFillInOption,PleaseModifyTheDataToSubmit"
                                    )
                                )
                            }
                        })
                    }
                },
                // 批量操作
                handleSelect(key) {
                    if (key == "1") {
                        handleApproveBtn()
                    } else if (key == "2") {
                        allAddBtn()
                    } else if (key == "3") {
                        if (!state.isSingleRevoke && checkedRowKeysRef.value.length == 0) {
                            message.warning("请先选择数据！")
                            return false
                        }
                        if (!state.isSingleRevoke) {
                            state.revokeForm.models = checkedRowKeysRef.value
                        }
                        const yz = []
                        state.revokeForm.models.forEach((ele, index) => {
                            let name = store.getters["dictionaries/getDictionarieName"](
                                "farmdieProcessingStatus",
                                ele.processingStatus
                            )
                            if (name != "待审定" && name != "被驳回") {
                                yz.push(index)
                            }
                        })
                        if (yz.length === 0) {
                            state.showRevoke = true
                        } else {
                            message.error(
                                t(
                                    "dtables.listing.pleaseSelectAStateForTheDataToBeApprovedOrRejected"
                                )
                            )
                        }
                    }
                },
                handleFiltersChange(filters, sourceColumn) {
                    if (sourceColumn.key == "farmCode") {
                        state.search.farmCodeList = filters.farmCode
                    }
                    if (sourceColumn.key == "dormCode") {
                        state.search.dormCodeList = filters.dormCode
                    }
                    if (sourceColumn.key == "gender") {
                        state.search.genderList = filters.gender
                    }
                    if (sourceColumn.key == "farmdieReason") {
                        state.search.farmdieReasonList = filters.farmdieReason
                    }

                    if (sourceColumn.key == "handlingType") {
                        state.search.handlingTypeList = filters.handlingType
                    }
                    if (sourceColumn.key == "farmdieHandlingType") {
                        state.search.farmdieHandlingTypeList = filters.farmdieHandlingType
                    }

                    if (sourceColumn.key == "pigSources") {
                        state.search.pigSourcesList = filters.pigSources
                    }
                    if (sourceColumn.key == "breedingLevel") {
                        state.search.breedingLevelList = filters.breedingLevel
                    }
                    if (sourceColumn.key == "pigStatus") {
                        state.search.pigStatusList = filters.pigStatus
                    }

                    if (sourceColumn.key == "processingStatus") {
                        state.search.processingStatusList = filters.processingStatus
                    }
                    if (sourceColumn.key == "applicant") {
                        state.search.applicantList = filters.applicant
                    }
                    if (sourceColumn.key == "approver") {
                        state.search.approverList = filters.approver
                    }
                    if (sourceColumn.key == "staffCode") {
                        state.search.staffCodeList = filters.staffCode
                    }
                    state.search.page = 1
                    getPigDieList()
                },
                // 获取导入数据
                getEximportData(data) {
                    state.ablactationList = [...state.ablactationList, ...data]
                    state.showImport = false
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
    .redTips {
        display: inline-block;
        color: #d03050;
        padding-left: 10px;
    }
</style>
