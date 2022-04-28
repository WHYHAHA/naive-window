/** 类似于 windows 的注册表，所有可用的 application & icon都在这里定义**/
const register = {
	/**最大任务数 **/
	"MAXTASK": 50,
	/**标题栏高度 see global.less !!!**/
	"titleHeight": 30,
	/**任务栏高度  see global.less !!!**/
	"taskHeight": 40,
	'userManageApp': {
		"id": "system_001",
		"name": "系统偏好设置",
		"enName": "User Management",
		"page": "sys/preferences",
		"system": true,
		"width": 600,
		"height": 450,
		"icon": "help",
		"sublist": [{
			"id": "000101",
			"name": "场区栋舍",
			"icon": "call",
			"href": "sys/dormManage/list",
			"type": "application",
		}, {
			"id": "000102",
			"name": "组织",
			"icon": "call",
			"href": "sys/userManage/department/list",
			"type": "application",
		}, {
			"id": "000103",
			"name": "职位角色",
			"icon": "call",
			"href": "sys/userManage/job/list",
			"type": "application",
		}, {
			"id": "000104",
			"name": "账户",
			"icon": "setting",
			"href": "sys/userManage/user/list",
			"type": "application",

		}, {
			"id": "000105",
			"name": "字典管理",
			"icon": "setting",
			"href": "sys/dictionariesManage/list",
			"type": "application",

		}, {
			"id": "000106",
			"name": "日志",
			"icon": "call",
			"href": "sys/sysLog/log",
			"type": "application",
		},
		{
			"id": "000107",
			"name": "品种品系",
			"icon": "call",
			"href": "sys/varietiesOfStrain/varietiesOfStrain",
			"type": "application",
		}
		],
	},
	"system": [{
		"id": "system_002",
		"name": "帮助",
		"enName": "Help",
		"page": "sys/help",
		// "page": "breedingPlan/list",
		"system": true,
		"width": 500,
		"height": 400,
	}, {
		"id": "system_003",
		"name": "壁纸",
		"enName": "Wallpaper",
		"page": "sys/display",
		"system": true,
		"width": 600,
		"height": 450,
	}, {
		"id": "system_004",
		"name": "个人中心",
		"enName": "Wallpaper",
		"page": "sys/userInfo/userInfo",
		"system": true,
		"width": 600,
		"height": 450,
	}, {
		"id": "system_005",
		"name": "文件传输",
		"enName": "File Transfer",
		"page": "sys/fileTransfer/fileTransfer",
		"system": true,
		"width": 600,
		"height": 450,
	},],
	/**  前端写死app路由  see global.less !!!**/
	// "application": [{
	// 	"id": "000",
	// 	"name": "用户管理",
	// 	"page": "userManage/user/list",
	// 	"link": false,
	// 	"width": 600,
	// 	"height": 450,
	// 	"icon": "help",
	// 	"sublist": [{
	// 		"id": "000101",
	// 		"name": "用户",
	// 		"icon": "setting",
	// 		"page": "userManage/user/list",
	// 		"type": "application",
	// 		"link": false,
	// 		"children": [{
	// 			"name": "用户详情",
	// 			"page": "userManage/user/detail",
	// 		}]
	// 	},
	// 	{
	// 		"id": "000102",
	// 		"name": "部门 | 分组",
	// 		"icon": "call",
	// 		"page": "userManage/department/list",
	// 		"type": "application",
	// 		"link": false
	// 	}, {
	// 		"id": "000103",
	// 		"name": "岗位 | 角色",
	// 		"icon": "call",
	// 		"page": "userManage/job/list",
	// 		"type": "application",
	// 		"link": false
	// 	}
	// 	],
	// }, {
	// 	"id": "0001",
	// 	"name": "帮助",
	// 	"page": "sys/help",
	// 	"link": true,
	// 	"width": 500,
	// 	"height": 400,
	// 	"icon": "help",
	// },
	// {
	// 	"id": "002",
	// 	"name": "显示设置",
	// 	"page": "sys/display",
	// 	"link": false,
	// 	"width": 600,
	// 	"height": 450,
	// 	"icon": "system",
	// },
	// {
	// 	"id": "0010",
	// 	"name": "数据管理中心",
	// 	"page": "DataManagementCenter/index",
	// 	"icon": "trend",
	// 	"width": 2000,
	// 	"height": 900,
	// 	"link": true,
	// }
	// ]
}

export default register
