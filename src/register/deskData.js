const deskData = [{
    "deskId": "0",
    "deskTopName": "主界面",
    "sequence": 0,
    "show": true,
    "deskBox": [{
        "id": 0,
        "boxName": "应用列表",
        "boxEnName": "Application List",
        "type": "appFolder",
        "top": 60,
        "left": 30,
        "width": 380,
        "height": 600,
        "minWidth": 200,
        "minHeight": 250,
        // 大小拖动
        "resizable": true,
        // 使用拖拽
        "useDrag": true,
        // 显示悬浮层
        "popoverFlag": true,
        "editBoxNameFlag": false,
        "appList": [{
            "id": 52094,
            "name": "销售管理",
            "icon": "sell",
            "url": "sellManager",
            "redirectTo": "index",
            "link": true,
            "preferences": true,
            "children": [{
                "label": "首页",
                "icon": "none",
                "id": 1023,
                "pagePath": "index"
            },
            {
                "label": "全部订单",
                "icon": "none",
                "id": 0,
                "pagePath": "allOrders"
            },
            {
                "label": "销售统计",
                "icon": "none",
                "id": 1,
                "pagePath": "sellStatistics",
                "children": [{
                    "label": "第三级示例",
                    "icon": "none",
                    "id": 6,
                    "pagePath": "exampleCascade/demo2"
                }]
            },
            {
                "label": "级联示例",
                "icon": "none",
                "id": 2,
                "redirectTo": "exampleCascade/demo1",
                "children": [{
                    "label": "级联示例一",
                    "icon": "none",
                    "id": 3,
                    "pagePath": "exampleCascade/demo1"
                },
                {
                    "label": "级联示例二",
                    "icon": "none",
                    "id": 4,
                    "redirectTo": "exampleCascade/demo2",
                    "children": [{
                        "label": "第三级示例",
                        "icon": "none",
                        "id": 6,
                        "pagePath": "exampleCascade/demo2"
                    }]
                },
                {
                    "label": "级联示例三",
                    "icon": "none",
                    "id": 5,
                    "pagePath": "exampleCascade/demo3"
                }
                ]
            }
            ]
        },
        {
            "id": 1,
            "name": "入库管理",
            "icon": "sell",
            "url": "assetManagement/index",
            "link": true,
            "preferences": false
        },
        {
            "id": 2,
            "name": "资产管理",
            "icon": "sell",
            "url": "assetManagement/categoryManagement/index",
            "link": true,
            "preferences": true
        },
        {
            "id": 3,
            "name": "steam",
            "icon": "steam",
            "url": "pigMeasure/list",
            "link": true,
            "preferences": true
        },
        {
            "id": 4,
            "name": "百度",
            "icon": "baidu",
            "url": "pigMeasure/list",
            "link": true,
            "preferences": true
        },
        {
            "id": 5,
            "name": "微信",
            "icon": "wechat",
            "url": "pigMeasure/list",
            "link": true,
            "preferences": true
        }
        ]
    },
    // {
    //     "id": 1,
    //     "boxName": "常用功能",
    //     "type": "commonFolder",
    //     "top": 465,
    //     "left": 30,
    //     "width": 380,
    //     "height": 200,
    //     "minWidth": 200,
    //     "minHeight": 150,
    //     "resizable": true,
    //     // 使用拖拽
    //     "useDrag": true,
    //     // 显示悬浮层
    //     "popoverFlag": true,
    //     "editBoxNameFlag": false,
    //     "appList": [{
    //         "label": "查看平均薪酬",
    //         "bgColor": "#2174D0"
    //     },
    //     {
    //         "label": "招聘管理",
    //         "bgColor": "#9C25AE"
    //     },
    //     {
    //         "label": "盈余查询",
    //         "bgColor": "#22BA49"
    //     },
    //     {
    //         "label": "快捷操作",
    //         "bgColor": "#22BA49"
    //     }
    //     ]
    // },
    // 数据概览位置
    {
        "id": 3,
        "boxName": "日程概况",
        "boxEnName": "schedule Overview",
        "type": "calendar",
        "top": 60,
        "left": 440,
        "width": 618,
        "height": 505,
        "minWidth": 390,
        "minHeight": 505,
        "resizable": true,
        // 使用拖拽
        "useDrag": false,
        // 显示悬浮层
        "popoverFlag": false,
        "editBoxNameFlag": false,
        "contextMenuList": [{
            "label": "修改名称",
            "id": "editname",
            "icon": "edit",
            "type": "action"
        },
        {
            "label": "关闭窗口",
            "id": "closeFolder",
            "icon": "close",
            "type": "action"
        }
        ],
        "appList": []
    }
    ],
    "contextMenuList": [{
        "name": "文件传输",
        "id": "addFolder",
        "page": "sys/fileTransfer/fileTransfer",
        "icon": "source",
        "type": "function",
        "action": "core/display",
        "children": [{
            "label": "应用列表",
            "type": "appFolder",
            "action": "createAppFolder"
        },
        {
            "label": "常用功能",
            "type": "commonFolder",
            "action": "createCommonFolder"
        },
        {
            "label": "数据概览",
            "type": "dataViewFolder",
            "action": "creatDataViewFolder"
        }
        ]
    },
    {
        "name": "锁屏",
        "id": "lockScreen",
        "page": "sys/lockScreen/lockScreen",
        "icon": "lockScreenIcon",
        "type": "lockScreen",
        "action": "core/openlockScreen"
    },
    {
        "name": "壁纸设置",
        "id": "system_003",
        "page": "sys/display",
        "icon": "wallpaperIcon",
        "type": "default",
        "action": "core/display"
    },
    {
        "name": "个人信息",
        "id": "system_003",
        "page": "sys/userInfo/userInfo",
        "icon": "personalInformationIcon",
        "type": "default",
        "action": "core/display"
    },
    {
        "name": "重置桌面",
        "id": "system_003",
        "page": "sys/userInfo/userInfo",
        "icon": "resetTheDesktop",
        "type": "default",
        "action": "core/resetTheDesktop"
    }
    ]
},
{
    "deskId": "1",
    "deskTopName": "仪表盘",
    "sequence": 0,
    "show": true,
    "deskBox": [{
        "id": 4,
        "boxName": "数据分析",
        "width": 95,
        "top": 60,
        // 大小拖动
        "resizable": true,
        // 使用拖拽
        "useDrag": true,
        // 显示悬浮层
        "popoverFlag": true,
        "editBoxNameFlag": false,
        "contextMenuList": [{
            "label": "修改名称",
            "id": "editname",
            "icon": "edit",
            "type": "action"
        },
        {
            "label": "关闭窗口",
            "id": "closeFolder",
            "icon": "close",
            "type": "action"
        }
        ],
        "appList": [{
            "id": 1,
            "title": "BI 报表",
            "type": "webView",
            "biUrl": process.env.NODE_ENV == 'development' ? "https://bi-uat.bestgenetics.com.cn/bi/view/667241515813056512?token=null" : process.env.NODE_ENV == 'uat' ? 'https://bi-uat.bestgenetics.com.cn/bi/view/667241515813056512?token=null' : 'https://bi.bestgenetics.com.cn/bi/view/667241515813056512?token=null'
        },
        {
            "id": 3,
            "width": "400",
            "height": "400",
            "title": "公司资源分配图"
        },
        {
            "id": 4,
            "width": "400",
            "height": "400",
            "title": '公司资源分配图'
        }
        ]
    }],
    "contextMenuList": []
}
]

// 先移除数据概览
// {
//     "id": 2,
//     "boxName": "数据概览",
//     "type": "dataViewFolder",
//     "top": 400,
//     "left": 30,
//     "width": 380,
//     "height": 274,
//     "resizable": true,
//     "minWidth": 196,
//     "minHeight": 150,
//     "useDrag": true,
//     "popoverFlag": false,
//     "handleClose": false,
//     "handleCustom": false,
//     "showAppLength": false,
//     "addApplication": true,
//     "editBoxNameFlag": false,
//     "contextMenuList": [],
//     "appList": [{
//         "id": 4,
//         "label": "本季度进行中的项目",
//         "content": "89个",
//         "bgColor": "#db812c"
//     },
//     {
//         "id": 5,
//         "label": "本季度已完成的项目",
//         "content": "43个",
//         "bgColor": "#21b838"
//     },
//     {
//         "id": 6,
//         "label": "本季度异常的项目",
//         "content": "2个",
//         "bgColor": "#de2626"
//     },
//     {
//         "id": 0,
//         "label": "上季度评分",
//         "content": "90分",
//         "bgColor": "#267cde"
//     }
//     ]
// },

export default deskData