import request from '../utils/request';
export const getVideo = () => {
    return request({
        url: 'video',
        method: 'get',
    })
}
export const updateVideo =(form:any)=>{
    return request({
        url: 'video',
        method: 'post',
        data:form
    })
}