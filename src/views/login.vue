<template >
    <div>
        <div class="login">
            <!-- 登录 -->
            <n-card class="loginBox" size="huge" hoverable content-style="padding: 0;">
                <n-grid :cols="2">
                    <n-gi>
                        <div class="login_left"></div>
                    </n-gi>
                    <n-gi>
                        <n-card class="login_right">
                            <!-- logo -->
                            <n-space align="center" justify="center">
                                <n-image width="350" src="https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/img/login-both.png" preview-disabled />
                            </n-space>
                            <!-- tab分页 -->
                            <n-tabs ref="tabsInstRef" class="mt-1" default-value="signin" size="large" justify-content="space-evenly">
                                <n-tab-pane name="signin" :tab="$t('login.login')">
                                    <div style="width:80%;margin:0 auto;">
                                        <n-form label-placement="left" :model="loginForm" ref="formRef" :rules="rules">
                                            <n-form-item path="username">
                                                <n-input :placeholder="$t('dataTable.listing.pleaseEnterTheAccount')" round size="large" v-model:value="loginForm.username" @keyup.enter="enterInput()">
                                                    <template #prefix>
                                                        <n-icon>
                                                            <Phone16Regular />
                                                        </n-icon>
                                                    </template>
                                                </n-input>
                                            </n-form-item>
                                            <n-form-item path="password">
                                                <n-input
                                                    :placeholder="$t('dataTable.listing.pleaseEnterThePassword')"
                                                    round
                                                    size="large"
                                                    v-model:value="loginForm.password"
                                                    type="password"
                                                    @keyup.enter="enterInput()"
                                                >
                                                    <template #prefix>
                                                        <n-icon>
                                                            <Key24Regular />
                                                        </n-icon>
                                                    </template>
                                                </n-input>
                                            </n-form-item>
                                        </n-form>
                                        <n-button type="primary" block round size="large" @click="handleValidateButtonClick">{{$t('login.login')}}</n-button>
                                    </div>
                                </n-tab-pane>
                                <!-- <n-tab-pane name="signup" :tab="$t('login.scanQrCode')">
                                    <n-button type="primary" block>注册</n-button>
                                </n-tab-pane>-->
                            </n-tabs>
                            <!-- 中英文切换 -->
                            <n-divider style="margin-bottom:10px">
                                <div class="font-14 text-secondary">{{$t('login.changeLanguageText')}}</div>
                            </n-divider>
                            <!-- 页脚 -->
                            <n-space justify="center">
                                <div class="chineseBtn animate__bounceIn" @click="onAppLanguageZH">CN</div>
                                <div class="englishBtn animate__bounceIn" @click="onAppLanguageEN">EN</div>
                            </n-space>
                        </n-card>
                        <div class="login_right_footer">
                            <n-text depth="3">If you need English system,please click the icon to switch.</n-text>
                        </div>
                    </n-gi>
                </n-grid>
            </n-card>
        </div>
        <Particles
            id="tsparticles"
            :options="{
                    background: {
                        image:'url(https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/bg/login-bg.jpg)',
                        position:'50% 50%',
                        repeat:	'no-repeat',
                        size:	'cover'
                    },
                    fpsLimit: 60,
                    particles: {
                        number: {
                            value: 30,
                        density: {
                            enable: true,
                            value_area: 30 * 10 * 2
                        }
                        },
                        shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '000000'
                        },
                        polygon: {
                            nb_sides: 5
                        }
                        },
                        opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                        },
                        size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            opacity: 1,
                            width: 1
                        },
                        move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on:'canvas',
                    events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'remove'
                    },
                    resize: true
                    },
                    modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                        opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                    }
                },
                    detectRetina: true
                }"
        />
    </div>
</template>
<script>
    import { Phone16Regular, Key24Regular } from "@vicons/fluent"
    import { defineComponent, ref } from "vue"
    import { useRouter } from "vue-router"
    import { useI18n } from "vue-i18n"
    import { userlogin } from "../api/user.js"
    import { useLoadingBar, useDialog } from "naive-ui"

    import storage from "store"
    import helper from "@/utils/helper"

    export default defineComponent({
        name: "login",
        components: {
            Phone16Regular,
            Key24Regular,
        },
        setup() {
            const { t } = useI18n()
            const loadingBar = useLoadingBar()
            const router = useRouter()
            const formRef = ref(null)
            // const tabsInstRef = ref(null)
            const dialog = useDialog()
            const rPasswordFormItemRef = ref(null)
            const loginFormRef = ref({
                username: null,
                password: null,
                scope: "sysoperate",
                grant_type: "password",
                client_id: "sysoperate",
                client_secret: "123456",
            })
            const loginApi = async () => {
                let formData = JSON.parse(JSON.stringify(loginFormRef.value))
                let JSEncrypt = window.JSEncrypt
                let encryptor = new JSEncrypt() // 创建加密对象实例
                let pubKey =
                    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNSGNlDBqraxT3Xr99eipSmX6DVJ2iZfFQ8HhAGBgot1TPMXtvf9cgxbz0k5zvVm/G24yB39Jk1rlp2+ip9ZdBn7+U136Lb/ZV1l8kYNgJYYj/67D1byhF4btHLyK2rgbwbJ7PdaT1k3to8EfSoEG+kIpy1FwMudRD3gN7y/+dKQIDAQAB"

                encryptor.setPublicKey(pubKey.replace(/\s*/g, "").replace(/[\r\n]/g, "")) //设置公钥

                formData.password = encryptor.encrypt(formData.password)

                await userlogin(formData).then(res => {
                    loadingBar.finish()
                    storage.set("access_token", res.data.access_token, 7 * 24 * 60 * 60 * 1000)
                    router.push("/desktop")
                })
            }
            const enterInput = () => {
                if (!loginFormRef.value.username) {
                    window.$message.error("请输入账户或手机号")
                    return false
                }
                if (!loginFormRef.value.password) {
                    window.$message.error("请输入密码")
                    return false
                }
                helper.Debounce(() => {
                    loadingBar.start()
                    loginApi()
                }, 500)
            }
            return {
                formRef,
                rPasswordFormItemRef,
                loginForm: loginFormRef,
                enterInput,
                rules: {
                    username: [
                        {
                            required: true,
                            message: () => t("dataTable.listing.pleaseEnterYourUserName"),
                            trigger: ["input", "blur"],
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: () => t("dataTable.listing.pleaseEnterThePassword"),
                            trigger: ["input", "blur"],
                        },
                    ],
                },

                onAppLanguageZH() {
                    dialog.warning({
                        title: "语言切换",
                        content: "是否切换为中文？",
                        positiveText: "确定",
                        negativeText: "取消",
                        onPositiveClick: () => {
                            this.$store.commit("core/SYSTEM_SETLANGUAGE", "zh-CN")
                            this.$i18n.locale = "zh"
                            window.$message.success("语言更改成功")
                        },
                    })
                },
                onAppLanguageEN() {
                    dialog.warning({
                        title: "language switch",
                        content: "Whether to switch to Chinese?",
                        positiveText: "confirm",
                        negativeText: "cancel",
                        onPositiveClick: () => {
                            this.$store.commit("core/SYSTEM_SETLANGUAGE", "en-US")
                            this.$i18n.locale = "en"
                            window.$message.success("Language change successful")
                            //手动更新tab
                            // nextTick(() => tabsInstRef.value?.syncBarPosition())
                        },
                    })
                },
                handleValidateButtonClick(e) {
                    e.preventDefault()
                    formRef.value.validate(errors => {
                        if (!errors) {
                            helper.Debounce(() => {
                                loginApi()
                            }, 500)
                        } else {
                            console.log(errors)
                            // window.$message.error('验证失败')
                        }
                    })
                },
            }
        },
    })
</script>




<style lang="less" scoped>
    .login {
        // width: 100%;
        // height: 100vh;
        // background: url(https://cdn.bestgenetics.com.cn/common/bg/login.jpeg);
        // background-repeat: no-repeat;
        // background-size: cover;
        // background-color: #1f1f1f;
        // background-position: center;
        // background-attachment: fixed;
        // position: relative;

        .logo {
            width: 80px;
            height: 80px;
        }

        .border-bottom-white {
            border-bottom: 1px solid white;
            padding-bottom: 0px;
        }

        /* 登录 */
        .loginBox {
            position: absolute;
            z-index: 100;
            right: 0;
            left: 0;
            margin: 0 auto;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            background: white;
            max-width: 800px;
            padding: 0;
            border: 0;
            .login_left {
                width: 100%;
                height: 100%;
                background: url(https://bg-cdn.oss-cn-beijing.aliyuncs.com/common/bg/login-sider-img.jpg);
                background-repeat: no-repeat;
                background-size: cover;
                background-color: #1f1f1f;
                background-position: center;
                position: relative;
            }
            .login_right {
                border-color: white;

                .chineseBtn {
                    font-size: 12px;
                    background: #c43833;
                    color: white;
                    padding: 8px;
                    border-radius: 50%;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
                .englishBtn {
                    font-size: 12px;
                    background: #537bcf;
                    color: white;
                    padding: 8px;
                    border-radius: 50%;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
                .chineseBtn:hover {
                    -webkit-transition: background-color 0.1s 0.3s, color 0.1s 0.3s;
                    transition: background-color 0.1s 0.3s, color 0.1s 0.3s;
                    color: #eceff1;
                    background-color: #c43833;
                    -webkit-animation: anim-moema-1 0.3s forwards;
                    animation: anim-moema-1 0.3s forwards;
                }
                .englishBtn:hover {
                    -webkit-transition: background-color 0.1s 0.3s, color 0.1s 0.3s;
                    transition: background-color 0.1s 0.3s, color 0.1s 0.3s;
                    color: #eceff1;
                    background-color: #537bcf;
                    -webkit-animation: anim-moema-1 0.3s forwards;
                    animation: anim-moema-1 0.3s forwards;
                }
                @-webkit-keyframes anim-moema-1 {
                    60% {
                        -webkit-transform: scale3d(0.8, 0.8, 1);
                        transform: scale3d(0.8, 0.8, 1);
                    }
                    85% {
                        -webkit-transform: scale3d(1.1, 1.1, 1);
                        transform: scale3d(1.1, 1.1, 1);
                    }
                    100% {
                        -webkit-transform: scale3d(1, 1, 1);
                        transform: scale3d(1, 1, 1);
                    }
                }
                @keyframes anim-moema-1 {
                    60% {
                        -webkit-transform: scale3d(0.8, 0.8, 1);
                        transform: scale3d(0.8, 0.8, 1);
                    }
                    85% {
                        -webkit-transform: scale3d(1.1, 1.1, 1);
                        transform: scale3d(1.1, 1.1, 1);
                    }
                    100% {
                        -webkit-transform: scale3d(1, 1, 1);
                        transform: scale3d(1, 1, 1);
                    }
                }
            }
            .login_right_footer {
                padding: 10px;
                font-size: 12px;
                text-align: center;
                background: #fafafa;
            }
        }
    }
</style>
<style scoped>
</style>