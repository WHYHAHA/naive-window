import helper from '@/utils/helper.js'
import { h } from 'vue'
import { NAvatar, NButton } from 'naive-ui'
import { getUserMessageApi, bulkModifyTheMessageApi } from '../api/public.js'

export default {
	namespaced: true,
	state: {
		count: 0,
		current: {},
		list: [],
		firstShowNotification: true,
		// 代办消息 数组
		toDoList: [],
		// 所有消息数组
		allMessage: [],
	},
	getters: {},
	mutations: {
		// 设置用户待办
		SET_USERTODOLIST(state, list) {
			state.toDoList = list
		},
		PUSH_MESSAGE(state, message) {
			message.id = helper.uuid()
			state.current = message
			state.list.push(message)
			state.count = state.list.length
		},
		CLEAN_MESSAGE(state) {
			state.list = []
			state.count = 0
		},
		// 添加一条
		ADDT_TODOLIST(state, messageData) {
			state.toDoList.push(messageData.data)
		},
		// 移除多条
		DELETE_USERTODOLIST(state, id) {
			state.toDoList.forEach(function (item, i) {
				if (item.id == id) {
					state.toDoList.splice(i, 1)
				}
			})
		},
		// 用户登录消息总通知
		NOTIFICATION: (state, data) => {
			let userAvatar = data.userInfo.imgpath
			let toDoSum = data.messageInfo.length
			let newTime = helper.format(Date.now())
			if (state.firstShowNotification) {
				// 显示消息总通知
				window.$notification.create({
					title: "欢迎登录",
					description: '欢迎使用门户管理系统',
					content: '您有' + toDoSum + '条信息待处理',
					meta: newTime,
					duration: 10000,
					avatar: () =>
						h(NAvatar, {
							size: 'small',
							round: true,
							src: userAvatar,
							fallbackSrc: 'https://cdn.bestgenetics.com.cn/common/img/people.png'
						}),
				})
				state.firstShowNotification = false
			}

		},
	},
	actions: {
		pushMessage(context, message) {
			context.commit('PUSH_MESSAGE', message)
		},
		cleanMessage(context, message) {
			context.commit('CLEAN_MESSAGE', message)
		},
		deleteMessage(context, id) {
			context.commit('DELETE_MESSAGE', id)
		},

		// 添加一条代办 并置为已读
		AddToDoList(context, websocketData) {
			return new Promise((resolve, reject) => {
				let messageData = JSON.parse(websocketData.data)
				context.commit("ADDT_TODOLIST", messageData)


				let newTime = helper.format(Date.now())
				window.$notification.create({
					title: "您有一条新消息",
					description: messageData.data.extras,
					content: messageData.data.msgcontent,
					meta: newTime,
					action: () =>
						h(
							NButton,
							{
								text: true,
								type: 'primary',
								onClick: () => {
									let data = {
										models: [{
											id: messageData.data.receiverId,
											readStatus: '1'
										}]
									}
									bulkModifyTheMessageApi(data).then(response => {
										if (response.code == '0') {
											resolve()
											console.log('已将该条消息标记为已读！')
											window.$notification.destroyAll()
										} else {
											reject()
										}
									})
								}
							},
							{
								default: () => '已读并跳转APP'
							}
						)
				})
			})
		},
		// 获取用户待办消息
		GetUserMessage(context, type) {
			return new Promise((resolve, reject) => {
				getUserMessageApi({ readStatus: type }).then(response => {
					const result = response.data
					let newDate = helper.timestampToTime(Date.now())
					result.forEach(element => {
						element.createDatetime ? element.BetweenDay = helper.getDaysBetween(element.createDatetime, newDate) : ''
					})
					context.commit("SET_USERTODOLIST", result)
					context.commit("NOTIFICATION", { messageInfo: result, userInfo: context.rootState.core.userInfo })
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 批量修改消息状态 已读
		/**
		 *  @param ids ['1','2','3']
		 */
		BulkModifyTheMessage(context, ids) {
			let data = {
				models: ids.map(item => {
					return {
						id: item,
						readStatus: '1'
					}
				})
			}
			return new Promise((resolve, reject) => {
				bulkModifyTheMessageApi(data).then(response => {
					if (response.code == '0') {

						ids.forEach(element => {
							context.commit("DELETE_USERTODOLIST", element)
						})
						resolve(response)
					} else {
						reject(response)
					}
				}).catch(error => {
					reject(error)
				})
			})
		}
	},

}
