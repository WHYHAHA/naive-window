<template>
    <div class="display-container">
        <div class="display-preview">
            <img :src="preview" />
        </div>
        <div class="display-list">
            <n-scrollbar x-scrollable>
                <div class="display-list-item" v-for="(item, index) in images" :key="index" @click="onSelect(item.url)" style="white-space: nowrap; padding: 12px">
                    <img :src="item.url" :class="{ 'item-selected': item.selected }" onerror="this.style.display = 'none' " />
                </div>
            </n-scrollbar>
        </div>
    </div>
</template>

<script>
    import helper from "@/utils/helper"
    export default {
        name: "Display",
        data() {
            return {
                // 全部部署在静态服务器中
                images: [
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-0.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-1.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-2.jpg", selected: true },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-3.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-4.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-5.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-6.jpg", selected: false },
                    // { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-7.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-8.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-9.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-10.jpg", selected: false },
                    { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-11.jpg", selected: false },
                ],
                preview: helper.getLocalstorage("wallpaper", ""),
            }
        },
        computed: {
            wallpaper() {
                return this.$store.state.core.wallpaper
            },
        },
        created() {
            this.selectwallpaper()
        },
        methods: {
            selectwallpaper() {
                this.images.forEach(item => {
                    if (item.url === this.wallpaper) {
                        item.selected = true
                    } else {
                        item.selected = false
                    }
                })
            },
            onSelect(url) {
                this.preview = url
                this.$store.commit("core/SET_WALLPAPER", url)
                this.selectwallpaper()
                // this.$store.commit('message/PUSH_MESSAGE', {
                //     type: 'notification',
                //     content: '切换成功1111111111111111111111111111111111111111111111111111111111111111',
                //     title: '更换壁纸'
                // })
            },
        },
    }
</script>
<style scoped>
    .display-container {
        background-color: #f9f9f9;
        width: 100%;
        height: 100%;
        margin: 0;
    }

    .display-preview {
        width: 55%;
        margin: 0px auto;
        padding: 15px;
    }

    .display-preview img {
        width: 100%;
    }

    .display-list {
        width: 100%;
        white-space: nowrap;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        margin: 0px auto;
        padding: 10px 20px;
    }

    .display-list-item {
        margin-bottom: 7px;
        box-sizing: border-box;
        margin-right: 5px;
        display: inline-block;
        border: 1px solid white;
        border-radius: 10px;
    }

    .display-list-item:hover {
        border: 1px solid #a0d911;
    }

    .item-selected {
        border: 1px solid red;
    }

    .display-list-item:active {
        border: 1px solid #a8071a;
    }

    .display-list-item img {
        height: 130px;
        border-radius: 10px;
    }
</style>
