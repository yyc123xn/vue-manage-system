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
        console.log("拦截器-请求-config")
        const userToken = window.$cookies.get('session'); //获取Cookie
        config.data = JSON.stringify(config.data);
        if (userToken) {
            // config.params = {'userToken': userToken} //后台接收的参数，后面我们将说明后台如何接收
        }
        return config;
    },
    error => {
        console.log("拦截器-请求-error")
        return Promise.reject(error);
    }
);


// http response 拦截器
service.interceptors.response.use(
    response => {
        console.log("拦截器-响应-response")
        if(response.data.code === -1) {
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath} //从哪个页面跳转
            })
        }
        return response.data;
    },
    error => {
        console.log("拦截器-响应-error")
        return Promise.reject(error)
    });

export default service;