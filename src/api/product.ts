/*
 * @Author: marineyulxl
 * @Date: 2023-04-18 12:41:35
 * @LastEditTime: 2023-04-21 16:01:07
 */
import request from '../utils/request';
export const addProduct = (form: any) => {
    return request({
        url: 'product',
        method: 'post',
        data:form
    })
}
export const getProduct = (query: any) => {
    return request({
        url: 'product',
        method: 'get',
        params: query
    })
}
export const updateProduct = (id: any, form: any) => {
    return request({
        url: `product/${id}`,
        method: 'patch',
        data: form,
    })
}
export const deleteProduct = (id: any) => {
    return request({
        url: `product/${id}`,
        method: 'delete',
    })
}
export const deleteProducts = (ids: any) => {
    return request({
        url: 'product',
        method: 'delete',
        data:{ids}
    })
}
export const getProductAll =()=>{
    return request ({
        url : 'productAll',
        method:'get'
    })
}