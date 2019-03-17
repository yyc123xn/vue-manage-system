import axios from 'axios' //引用axios

const service = axios.create({ // 创建服务
    timeout: 5000 // 请求延时
})

service.defaults.withCredentials = true
service.defaults.headers = {
    'Content-type': 'application/json'
}

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
service.interceptors.request.use(
    config => {
        config.data = JSON.stringify(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


// http response 拦截器
service.interceptors.response.use(
    response => {
        if(response.data.code === -1) {
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath} //从哪个页面跳转
            })
        }
        return response.data;
    },
    error => {
        return Promise.reject(error)
    });

export default service;