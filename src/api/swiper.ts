import request from '../utils/request';

export const getSwiper= () => {
    return request({
        url: 'swiper',
        method: 'get'
    });
};
export const updateSwiper= (id:any,formData:any) => {
    return request({
        url: `swiper/${id}`,
        method: 'patch',
        data:formData
    });
};
export const delectSwiper= (id:any) => {
    return request({
        url: `swiper/${id}`,
        method: 'delete'
    });
};
export const createSwiper= (formData:any) => {
    return request({
        url: 'swiper',
        method: 'post',
        data:formData
    });
};