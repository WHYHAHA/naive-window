<template>
    <div class="container">
        <!-- <div class="mask" @click="theMaskDisappear"></div> -->
        <div class="btn-button">
            <!-- <n-button @click="changeLockScreen" type="success">更改锁屏</n-button> -->
            <n-icon size="60" color="#b2b1ae" @click="changeLockScreen">
                <IosLockIcon />
            </n-icon>
            <!-- <n-input round placeholder="请输入密码" size="medium" style="margin-left: -15px;" v-model:value="password" @keyup.enter="compareThePassword(password)" /> -->
        </div>
        <n-carousel effect="fade" autoplay :interval="10000" :show-dots="false" style="width: 100%; height: 100vh">
            <div v-for="(item,index) in wallpaperList" :key="index">
                <img class="carousel-img" :src="item.url" />
            </div>
        </n-carousel>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, onMounted, h, ref, computed } from "vue"
    import { useStore } from "vuex"
    import { IosLock as IosLockIcon } from "@vicons/ionicons4"
    import { useMessage } from "naive-ui"

    export default defineComponent({
        components: {
            IosLockIcon,
        },
        setup() {
            const store = useStore()
            store.commit("core/BASEDONTHEPASSWORD", 123456)
            const message = useMessage()
            const state = reactive({
                password: "",
            })
            const changeLockScreen = () => {
                store.commit("core/CHANGE_LOCKSCREEN")
            }
            const wallpaperList = computed(() => store.state.core.wallpaperList)
            // 比对密码
            const compareThePassword = password => {
                if (password == store.state.core.saveThePassword) {
                    store.commit("core/CHANGE_LOCKSCREEN")
                } else {
                    message.error("密码错误，请重新输入")
                }
            }
            onMounted(() => {})
            return {
                ...toRefs(state),
                changeLockScreen,
                compareThePassword,
                wallpaperList,
            }
        },
    })
</script>


<style lang="less" scoped>
    .container {
        position: relative;
        padding: 0;
        .mask {
            position: absolute;
            width: 100%;
            height: 100vh;
            background: rgba(250, 250, 250, 0.8);
            z-index: 99;
        }
        .btn-button {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            z-index: 3;
            .n-icon:hover {
                cursor: pointer;
                color: #dbbf09 !important;
            }
        }
        .carousel-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        :deep(.creative-enter-from),
        :deep(.creative-leave-to) {
            opacity: 0;
            transform: scale(0.9);
        }

        :deep(.creative-enter-active),
        :deep(.creative-leave-active) {
            transition: all 0.3s ease;
        }
    }
</style>
