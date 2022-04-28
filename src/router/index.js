import {
	createRouter,
	createWebHashHistory
} from 'vue-router'
import store from '@/store'
import storage from 'store'
import NProgress from 'nprogress'
import '../css/nprogress.less'


const routes = [{
	path: '/',
	meta: { title: store.state.core.name },
	name: 'login',
	component: () => import('../views/login.vue')
},
{
	path: '/desktop',
	meta: { title: store.state.core.name },
	component: () => import('../views/Desktop.vue')
},
{
	path: '/500',
	meta: { title: '500' },
	name: '500',
	component: () => import('../components/publicErrorPage.vue')
},
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})


// 路由守卫
router.beforeEach((to, from, next) => {
	NProgress.start()
	const token = storage.get('access_token')
	//路由白名单
	const allowList = ['login', '500']
	const loginRoutePath = '/'
	// 默认首页
	const defaultRoutePath = '/desktop'
	// 有token
	if (token) {
		if (allowList.includes(to.name)) {
			// 在免登录名单，直接进入
			next()
			return false
		}
		if (to.path === loginRoutePath) {
			next({ path: defaultRoutePath })
			NProgress.done()
		} else {
			// 使用vux获取userInfo及用户应用app  core/GetUserInfo
			// 用户应用app  core/GetApplication
			// 获取待办消息  message/getUserToDo
			// , store.dispatch('message/GetUserMessage', '2')

			Promise.all([store.dispatch('core/GetUserInfo'), store.dispatch('core/GetApplication')]).then(() => {
				// 做环境配置 确保dev环境开启后自动跳转
				let openWebSocket = process.env.VUE_APP_OPENWEBSOCKET
				if (openWebSocket == 'true') {
					store.dispatch('message/GetUserMessage', '2').then(() => {
						next()
					}).catch((error) => {
						console.log('error: ', error)
						next({ path: loginRoutePath })
						NProgress.done()
						window.$message.error('用户消息初始化失败', { duration: 5000 })
					})
				} else {
					next()
				}

			}).catch((error) => {
				console.log('error: ', error)
				next({ path: loginRoutePath })
				NProgress.done()
				window.$message.error('用户信息初始化失败', { duration: 5000 })
			})
		}
	} else {
		if (allowList.includes(to.name)) {
			// 在免登录名单，直接进入
			next()
		} else {
			next({ path: loginRoutePath })
			NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
		}
	}
})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})

export default router
