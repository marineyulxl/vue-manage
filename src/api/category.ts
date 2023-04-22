/*
 * @Author: marineyulxl
 * @Date: 2023-04-20 15:49:09
 * @LastEditTime: 2023-04-22 13:22:53
 */
import request from '../utils/request';

export const getCategory = () => {
    return request({
        url: 'category',
        method: 'get'
    });
};
export const getLimitCategory = (query: any) => {
    return request({
        url: 'limitCategory',
        method: 'get',
        params: query
    });
};
export const updateCategory = (id: any, name: any) => {
    return request({
        url: `category/${id}`,
        method: 'patch',
        data: {name}
    });
};
export const deleteCategory = (id: any) => {
    return request({
        url: `category/${id}`,
        method: 'delete',
    });
};
export const createCategory = (name: any) => {
    return request({
        url: 'category',
        method: 'post',
        data:{name},
    });
};