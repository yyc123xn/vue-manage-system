import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

import api from './api/api'

import store from './store/store'

import VCharts from 'v-charts'

import VueCookies from 'vue-cookies'

import axios from './interceptor' // permission control

import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入

import {validator} from './utils/validator'

import Sidebar from './components/common/Sidebar.vue'

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});

Vue.use(VueCookies)
Vue.use(VCharts)

Vue.prototype.$axios = axios
Vue.prototype.$api = api
Vue.prototype.$validator = validator

if (localStorage.getItem('username')) {
    let routes = JSON.parse(localStorage.getItem('routes'))
    store.dispatch("add_Routes", routes)
}
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start()
    let userToken = window.$cookies.get("userToken")
    if (userToken) {
        api.FINANCE_DEVELOPER_API.get('CURRENT').then(developerRes => {
            if (developerRes.data.loggedIn === false) {
                next('/login')
            } else {
                // api.FINANCE_COMMON_API.get("GET_MENUS").then(menuRes => {
                    if (to.path === '/login') {
                        next('/')
                    } else {
                        localStorage.setItem('username', developerRes.data.nameCn)
                        next()
                        // console.log(menuRes.data)
                        // Sidebar.data().items = menuRes.data
                        // Vue.set(Sidebar.$data, "items", menuRes.data)
                        // console.log(Sidebar.data())
                    }
                // })
            }
        })
    } else {
        if (to.path !== '/login') {
            next('/login')
        } else {
            next()
        }
    }
    // const role = localStorage.getItem('username');
    // if (!role && to.path !== '/login') {
    //     next('/login');
    // } else {
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
})

router.afterEach(() => {
    NProgress.done()
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')