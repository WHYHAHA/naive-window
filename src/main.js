import { createApp } from 'vue'
import Monitor from './Monitor.vue'
import router from './router'
import store from './store'
// naive-ui 框架导入
import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
// I18n 国际化
import i18n from './language'
// 动画
import animate from 'animate.css'
// 粒子效果引入
import particles from "particles.vue3";

// 本地icon引入
import './css/icon.less';
import './css/style.less';
import './css/pc.css'

// 全局公共组件引用
import publicComponents from './components/publicComponents'// 引入公共组件

// 打印
import MyPlugin from '../src/utils/print'

// 事件总程
import BusInstance from "@/utils/observe.js";

// 各个设备屏幕分辨率适配，适用于初始的1280分辨率下的chrome类浏览器
window.innerWidth <= 1280 && (window.onload = window.onresize = () => {
    let scale = document.documentElement.clientWidth / 1550
    document.body.style.zoom = scale
})



const app = createApp(Monitor)
app.config.productionTip = false;
app.config.globalProperties.$echarts = window.echarts
app.config.globalProperties.$observer = BusInstance
app.use(publicComponents)

app.use(particles)
app.use(naive)
app.use(store)
app.use(router)
app.use(animate)
app.use(MyPlugin)
app.use(i18n)

app.mount('#monitor')

export default app

