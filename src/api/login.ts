/*
 * @Author: marineyulxl
 * @Date: 2023-04-19 15:24:35
 * @LastEditTime: 2023-04-19 15:54:08
 */
import request from '../utils/request';

interface LoginInfo {
    username: string;
    password: string;
}

export const Login = (params:LoginInfo) => {
    const { username,password} =params
    return request({
        url: 'web/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}