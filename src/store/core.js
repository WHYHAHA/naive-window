
import deskData from '@/register/deskData.js'
import arrays from '../utils/arrays.js'
import helper from '../utils/helper.js'
import storage from 'store'

import { reactive } from 'vue'

import { getUserInfo, getApplication, userloginOutApi, GetAppMenuAPi } from '../api/user.js'


export default {
	namespaced: true,

	state: {
		wallpaper: 'https://cdn.bestgenetics.com.cn/common/wall/wall-0.jpg',
		wallpaperList: [
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-0.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-1.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-2.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-3.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-4.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-5.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-6.jpg" },
			// { url: "https://cdn.bestgenetics.com.cn/common/wall/wall-7.jpg"},
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-8.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-9.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-10.jpg" },
			{ url: "https://cdn.bestgenetics.com.cn/common/wall/wall-11.jpg" },
		],
		// 是否打开锁屏
		openLockScreen: false,
		// 开始菜单 是否展开
		startMenu: false,
		sidebar: false,
		contextMenu: {
			type: 'wall',
			x: 0,
			y: 0,
			data: {}
		},
		// userInfo中 type: 0为租户，其他为用户
		userInfo: {},
		// 接口获取的当前用户所有app信息
		userApplications: [],
		// 所有apps
		applications: [],
		// 所有窗口
		tasks: reactive([]),
		// 语言
		language: helper.getLocalstorage('language') || 'zh-CN',

		/* 
		 *
		 * 桌面相关
		 *
		 */
		// 桌面默认注册表
		registerDeskData: JSON.parse(JSON.stringify(deskData)),
		// 桌面数据源
		deskData: helper.getLocalstorage('deskData') || JSON.parse(JSON.stringify(deskData)),
		// 轮播图是否允许拖拽
		isDraggable: true,
		// 存入密码
		saveThePassword: ''
	},
	mutations: {
		SYSTEM_SETLANGUAGE: (state, data) => {
			helper.setLocalstorage('language', data)
			state.language = data
		},
		APP_SETDATA: (state, data) => {
			// 通过接口获取用户对应app赋值
			state.userApplications = data
		},
		APP_INIT: (state) => {
			let wallpaper = helper.getLocalstorage('wallpaper', "")
			state.wallpaper = wallpaper
			state.userApplications.forEach(item => {
				let app = {}
				app.id = item.id
				app.name = item.name
				app.enName = item.enName
				app.icon = item.icon ? item.icon : ''
				app.system = item.system ? item.system : false
				app.preferences = item.preferences ? item.preferences : false
				app.width = item.width > 0 ? item.width : 0
				app.height = item.height > 0 ? item.height : 0
				app.page = item.url
				app.sublist = item.sublist ? item.sublist : ''
				app.link = !helper.ObjectIsNull(item.link) ? false : item.link
				app.selected = false
				state.applications.push(app)
			})
		},
		DESKTOP_INIT: (state) => {
			// 先清空应用盒子数据源 
			state.deskData[0].deskBox[0].appList = []
			state.deskData.forEach(deskElement => {
				state.userApplications.forEach(userAppElement => {
					// 先查 deskMenuId 相同
					if (deskElement.deskId == userAppElement.deskMenuId) {
						// 应用盒子 插入 对应app
						if (userAppElement.deskBoxType == 'appFolder') {

							// 存放对应app
							deskElement.deskBox[0].appList.push(userAppElement)
						}
					}
				})
			})
			console.log(state.deskData)
		},
		APP_OPEN: (state, id) => {
			let i = arrays.findIndexById(state.tasks, id)
			// 如果没有在tasks中找到 会创建一个新的窗口填入tasks
			if (i < 0) {
				let object = state.applications.filter(t => t.id == id)[0]
				let task = reactive({})
				task.title = object.name
				task.enTitle = object.enName
				task.id = object.id
				task.icon = object.icon
				task.page = helper.ObjectIsNull(object.page) ? "" : object.page
				task.preferences = object.preferences ? object.preferences : false
				task.sublist = object.sublist ? object.sublist : ''
				task.min = false
				task.focus = true
				task.date = new Date()
				task.lastDate = new Date()
				state.tasks.push(task)
			} else {
				// 桌面点击时打开
				if (state.tasks[i].min) {
					state.tasks[i].min = false
					state.tasks[i].focus = true
				}
				state.tasks[i].lastDate = new Date()
			}
		},
		APP_SYSTEM_OPEN: (state, item) => {
			let i = arrays.findIndexById(state.tasks, item.id)
			// 如果没有在tasks中找到 会创建一个新的窗口填入tasks
			if (i < 0) {
				let object = item
				let task = reactive({})
				task.title = object.name
				task.enTitle = object.enName
				task.id = object.id
				task.icon = object.icon
				task.page = helper.ObjectIsNull(object.page) ? "" : object.page
				task.sublist = object.sublist ? object.sublist : ''
				task.min = false
				task.focus = true
				task.date = new Date()
				task.lastDate = new Date()
				state.tasks.push(task)
			}
		},
		// 设置app菜单及权限
		APP_SETMENUANDOPERATION: (state, item) => {
			// 国际化menu
			if (state.language == "en-US") {
				item.menu.forEach(element => {
					element.title = element.enTitle || element.title
				})
			}
			let i = arrays.findIndexById(state.applications, item.id)
			if (i >= 0) {
				state.applications[i].sublist = item.menu
			}
		},
		APP_FOCUS: (state, id) => {
			let i = arrays.findIndexById(state.tasks, id)
			if (i >= 0) {
				let app = state.tasks[i]
				app.lastDate = new Date()
			}
		},
		APP_SORT_BY_DATE: (state) => {
			state.tasks.sort((a, b) => {
				return b.lastDate - a.lastDate
			})
		},
		APP_CLOSE: (state, id) => {
			let i = arrays.findIndexById(state.tasks, id)
			if (i >= 0) {
				arrays.deleteByIndex(state.tasks, i)

			}
			console.log(state.tasks)
		},
		APP_CLOSE_ALL: (state) => {
			state.tasks = reactive([])
			state.applications = []
		},
		APP_MIN_SWITCH: (state, id) => {
			let i = arrays.findIndexById(state.tasks, id)
			if (i >= 0) {
				let app = state.tasks[i]
				if (app.focus == true) {
					app.min = true
					app.lastDate = state.tasks[state.tasks.length - 1].lastDate - 1
				} else if (app.min == true) {
					app.min = false
					app.lastDate = new Date()
				} else {
					app.lastDate = new Date()
				}
			}
			if (state.startMenu) {
				state.startMenu = false
			}
		},
		OPEN_START_MENU(state) {
			state.startMenu = !state.startMenu
		},
		CLOSE_START_MENU(state) {
			state.startMenu = false
		},
		SELECT_ICON(state, id) {
			state.applications.forEach(item => {
				if (id == item.id) {
					item.selected = true
				} else {
					item.selected = false
				}
			})
			if (state.startMenu) {
				state.startMenu = false
			}
		},
		SET_CONTEXT_MENU(state, data) {
			state.contextMenu.x = data.x
			state.contextMenu.y = data.y
			state.contextMenu.type = data.type
			state.contextMenu.data = data.data
		},
		CLEAN_CONTEXT_MENU(state) {
			state.contextMenu.x = -1
			state.contextMenu.y = -1
			state.contextMenu.type = ''
			state.contextMenu.data = {}
		},
		SET_WALLPAPER(state, url) {
			helper.setLocalstorage('wallpaper', url)
			state.wallpaper = url
		},
		SWITCH_SIDEBAR(state, flag) {
			if (helper.ObjectIsNull(flag)) {
				state.sidebar = flag
			} else {
				state.sidebar = !state.sidebar
			}
		},
		SET_USERINFO: (state, info) => {
			state.userInfo = info
		},
		OUT_USERINFO: (state) => {
			state.userInfo = {}
			storage.remove('access_token')
		},



		/* 
		 *
		 *	所有deskData 数据更改
		 *  
		 */
		// 开启拖拽
		DRAGGABLEOPEN: (state) => {
			state.isDraggable = true
		},
		// 关闭拖拽
		DRAGGABLECLOSE: (state) => {
			state.isDraggable = false
		},

		// 更改主界面--常用功能--背景色
		SETCOMMONFOLDERBGCOLOR: (state, data) => {
			state.deskData[0].deskBox[1].appList.forEach(element => {
				element.label == data.selectBox.label ? element.bgColor = data.color : ''
			})
			helper.setLocalstorage('deskData', state.deskData)
		},
		// 设置主界面移动
		SETMAINMOVE: (state, data) => {
			state.deskData[0].deskBox.forEach(element => {
				if (element.id == data.id) {
					element.left = data.left
					element.top = data.top
				}
			})
			helper.setLocalstorage('deskData', state.deskData)
		},
		// 设置主界面 盒子高度变化
		BOXONRESIZE: (state, data) => {
			state.deskData[0].deskBox.forEach(element => {
				if (element.id == data.id) {
					switch (data.type) {
						case 'top':
							element.height = element.height + (element.top - data.moveY)
							element.height < element.minHeight ? '' : (element.top = data.moveY)
							break
						case 'left':
							element.width = element.width + (element.left - data.moveX)
							element.width < element.minWidth ? '' : (element.left = data.moveX)
							break
						case 'bottom':
							element.height = element.height + (data.moveY - (element.top + element.height))
							break
						case 'right':
							element.width = element.width + (data.moveX - (element.left + element.width))
							break
						default:
							break
					}
					element.width < element.minWidth ? (element.width = element.minWidth) : ''
					element.height < element.minHeight ? (element.height = element.minHeight) : ''
				}
			})
			helper.setLocalstorage('deskData', state.deskData)
		},
		// 设置app link 是否显示
		APPLISTLINKCHANGE: (state, data) => {
			let boxID = data.setting.id

			state.deskData[0].deskBox.forEach(element => {
				if (element.id == boxID) {
					element.appList.forEach(appelement => {
						if (appelement.id == data.id) {
							appelement.link = !appelement.link
						}
					})
				}
			})
			helper.setLocalstorage('deskData', state.deskData)
		},

		// 重置桌面
		RESETTHEDESKTOP: (state) => {
			helper.removeLocalstorage('deskData')
			state.deskData = JSON.parse(JSON.stringify(deskData))
		},
		// 打开锁屏
		OPENLOCKSCREEN: (state) => {
			state.openLockScreen = true
		},
		CHANGE_LOCKSCREEN: (state) => {
			state.openLockScreen = !state.openLockScreen
		},
		// 存入保存的密码
		BASEDONTHEPASSWORD: (state, item) => {
			state.saveThePassword = item
		}



	},
	actions: {
		// 获取用户信息
		GetUserInfo(context) {
			return new Promise((resolve, reject) => {
				getUserInfo().then(response => {
					const result = response.data
					context.commit("SET_USERINFO", result)
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户对应APP
		GetApplication(context) {
			return new Promise((resolve, reject) => {
				getApplication().then(response => {
					const result = response.data
					context.commit("APP_SETDATA", result)
					context.commit("APP_CLOSE_ALL")
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 用户退出登录
		userLoginOut(context, info) {
			return new Promise((resolve, reject) => {
				userloginOutApi(info).then(response => {
					context.commit("OUT_USERINFO")
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户对应权限
		// GetAppMenu(context, item) {
		// 	return new Promise((resolve, reject) => {
		// 		GetAppMenuAPi({ rid: item.rid, aid: item.aid }).then(response => {
		// 			const result = response.data
		// 			context.commit("APP_SETMENUANDOPERATION", { menu: result, id: item.aid })
		// 			resolve(response)
		// 		}).catch(error => {
		// 			reject(error)
		// 		})
		// 	})
		// },
		init(context) {
			context.commit("APP_INIT")
			context.commit("DESKTOP_INIT")
		},
		close(context, id) {
			context.commit("APP_CLOSE", id)
			context.commit("APP_SORT_BY_DATE")
		},
		focus(context, id) {
			context.commit("APP_FOCUS", id)
			context.commit("APP_SORT_BY_DATE")
		},
		minOrShow(context, id) {
			context.commit("APP_MIN_SWITCH", id)
			context.commit("APP_SORT_BY_DATE")
		},
		minSwitch(context, id) {
			context.commit("APP_MIN_SWITCH", id)
			context.commit("APP_SORT_BY_DATE")
		},
		selectIcon(context, id) {
			context.commit('SELECT_ICON', id)
		},
		// app点击获取权限
		openApp(context, item) {
			return new Promise((resolve, reject) => {
				GetAppMenuAPi({ rid: item.rid, aid: item.aid }).then(response => {
					const result = response.data
					result.forEach((element, index) => {
						if (element.title == '偏好设置') result.splice(index, 1)
					})
					context.commit("APP_SETMENUANDOPERATION", { menu: result, id: item.aid })
					context.commit('APP_OPEN', item.aid)
					context.commit('APP_SORT_BY_DATE', item.aid)
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},
		openSystemApp(context, item) {
			context.commit('APP_SYSTEM_OPEN', item)
			context.commit('APP_SORT_BY_DATE', item.id)
		},
		sidebarSwitch(context, flag) {
			context.commit('SWITCH_SIDEBAR', flag)
		},
		display(context, item) {
			context.commit('APP_SYSTEM_OPEN', item)
			context.commit('APP_SORT_BY_DATE', '0001')
		},
		// 重置桌面
		resetTheDesktop(context) {
			window.$dialog.warning({
				title: '警告',
				content: '确定重置桌面么？您的桌面将会重置成默认！',
				positiveText: '确定',
				negativeText: '取消',
				onPositiveClick: () => {
					context.commit('RESETTHEDESKTOP')
					context.commit('DESKTOP_INIT')

				}
			})
		},
		help(context, item) {
			context.commit('APP_SYSTEM_OPEN', item)
			context.commit('APP_SORT_BY_DATE', '0000')
		},
		openlockScreen(context) {
			context.commit('OPENLOCKSCREEN')
		},

	}
}
