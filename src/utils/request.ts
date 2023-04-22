/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 19:28:01
 * @LastEditTime: 2023-04-22 22:39:49
 */
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { useRouter } from 'vue-router'
const router = useRouter();
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
const token = localStorage.getItem('token');

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
const service: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/',
    timeout: 5000
});

service.interceptors.request.use(

    (config: any) => {

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject(response);
        }
    },
    (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {

            ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', 
            { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
                localStorage.removeItem('ms_username');
                localStorage.removeItem('token');
                location.href = '/login';
            }).catch((err) => {
                console.log(err);

            });
          
        }
        return Promise.reject(error)
        // if (error.response?.status === 401 || error.response?.status === 403) {
        //     // token 失效，需要重新登录
        //     localStorage.removeItem('token')
        //     const router = useRouter()
        //     ElMessage.error("token过期，请重新登录");
        //     router.push('/login')
        //   }
        //   return Promise.reject(error)
    }

);

export default service;
