/*
 * @Author: marineyulxl
 * @Date: 2023-04-21 15:56:11
 * @LastEditTime: 2023-04-21 21:49:24
 */
import request from '../utils/request';

export const deletceOrder = (id: any) => {
    return request({
        url: `order/${id}`,
        method: 'delete',
    })
}
export const getorders = (query: any) => {
    return request({
        url: 'orders',
        method: 'get',
        params: query
    })
}
export const deletceOrders = (ids: any) => {
    return request({
        url: 'order',
        method: 'delete',
        data:{ids}
    })
}
export const updateOrder  = (orderId:any,orderStatus:any)=>{
    return request({
        url: `order/${orderId}`,
        method: 'patch',
        data:{orderStatus}
    })
}