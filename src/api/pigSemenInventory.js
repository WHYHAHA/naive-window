// 精液出库  相关APi


import request from '../utils/request'

const pigSemenInventory = {
    // get接口
    getSemenOrderList: '/ms-masterdata-consummer/PigSemenNeed/{version}/getPigSemenNeedLists',
    getSemenOrderDetail: '/ms-masterdata-consummer/PigSemenNeed/{version}/getPigSemenNeedOrder',
    getSemenOrderSticker: '/ms-masterdata-consummer/PigSemenNeed/{version}/getPigSticker',
    // post接口
    updateSemenOrder: "/ms-masterdata-consummer/PigSemenNeed/{version}/updatePigSemenNeedOrderDealStatus",
    updateBatchSemenOrder: '/ms-masterdata-consummer/PigSemenNeed/{version}/updateBathPigSemenNeedOrderDealStatus'
}


// 出库列表
export function getSemenOrderListApi(parameter) {
    return request({
        url: pigSemenInventory.getSemenOrderList,
        method: 'get',
        params: parameter
    })
}

// 查询订单
export function getSemenOrderDetailApi(parameter) {
    return request({
        url: pigSemenInventory.getSemenOrderDetail,
        method: 'get',
        params: parameter
    })
}

// 修改订单
export function updateSemenOrderApi(data) {
    return request({
        url: pigSemenInventory.updateSemenOrder,
        method: 'post',
        data: data
    })
}

// 批量修改订单
export function updateBatchSemenOrderApi(data) {
    return request({
        url: pigSemenInventory.updateBatchSemenOrder,
        method: 'post',
        data: data
    })
}

// 获取贴纸数据
export function getSemenOrderStickerApi(parameter) {
    return request({
        url: pigSemenInventory.getSemenOrderSticker,
        method: 'get',
        params: parameter
    })
}


