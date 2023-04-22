/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 19:28:01
 * @LastEditTime: 2023-04-19 15:26:16
 */
import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'post'
    });
};
