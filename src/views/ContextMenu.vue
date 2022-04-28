<template>
    <div class="context-menu-section" v-show="isShow" :style="{
			top: position.y + 'px',
			left: position.x + 'px'
		}">
        <div class="context-menu">
            <ul>
                <li v-for="item in list" :key="item.id" :class="{ disabled: item.disabled, divide: item.type == 'divide', 'list-item': item.type !== 'divide','font-12':true }" @click="onClick(item)">
                    <i v-if="item.type!='divide'" class="contextIcon icon" :class="item.icon" aria-hidden="true"></i>
                    {{item.name}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name: "ContextMenu",
        data() {
            return {
                icon: [
                    {
                        id: "1",
                        text: "打开",
                        type: "default",
                        disabled: false,
                        action: "core/openApp",
                    },
                    {
                        type: "divide",
                    },
                    {
                        id: "system_002",
                        text: "使用帮助",
                        name: "帮助",
                        page: "sys/help",
                        system: true,
                        type: "default",
                        disabled: false,
                        icon: "fa-android",
                        action: "core/help",
                    },
                ],
                wall: [
                    {
                        id: "system_002",
                        text: "使用帮助",
                        name: "帮助",
                        page: "sys/help",
                        system: true,
                        type: "default",
                        disabled: false,
                        icon: "fa-android",
                        action: "core/help",
                    },
                    {
                        type: "divide",
                    },
                    {
                        id: "2",
                        text: "锁屏",
                        type: "default",
                        icon: "fa-lock",
                        disabled: false,
                        action: "session/lockScreen",
                    },
                    {
                        id: "system_003",
                        text: "壁纸设置",
                        name: "壁纸设置",
                        page: "sys/display",
                        type: "default",
                        icon: "fa-cog",
                        disabled: false,
                        action: "core/display",
                    },
                ],
            }
        },
        computed: {
            list() {
                // if (this.$store.state.core.contextMenu.type === 'wall') {
                //     return this.$store.state.core.contextMenu.data
                // } else {
                //     return this.icon
                // }
                return this.$store.state.core.contextMenu.data
            },
            position() {
                return this.$store.state.core.contextMenu
            },
            isShow() {
                return this.position.x > 0 && this.position.y > 0
            },
        },
        methods: {
            onClick(item) {
                let date = this.$store.state.core.contextMenu.data
                if (item.text == "打开") {
                    this.$store.dispatch(item.action, {
                        aid: date,
                        rid: this.$store.state.core.userInfo.id,
                    })
                } else {
                    this.$store.dispatch(item.action, item)
                }

                this.$store.commit("core/CLEAN_CONTEXT_MENU")
            },
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    .context-menu-section {
        position: absolute;
    }

    .context-menu {
        margin: 0;
        padding: 0;

        ul {
            background: rgba(255, 255, 255, 1);
            width: 100%;
            padding: 0;
            list-style: none;
            border-radius: 8px;
            overflow: hidden;

            .list-item {
                cursor: pointer;
                color: #333;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                .contextIcon {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    background-size: 100% 100%;
                }

                &:hover {
                    background: #4b8de4;
                    color: #fff;
                }

                &.disabled {
                    color: #999;
                }
            }

            .divide {
                border-top: 1px solid #ccc;
                margin: 5px;
            }
        }
    }
</style>
