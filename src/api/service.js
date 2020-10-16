import axios from 'axios'
import Cookies from "js-cookie";
import router from '../router'
import {
    MessageBox,
    Message
} from 'element-ui'

// create an axios instance
const service = axios.create({
    // baseURL: 'http://192.168.0.101:8082', //郭亚辉
    // baseURL: 'http://39.106.209.216:5403', //开发
    baseURL: '/', //测试 
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        console.log(config)
        const token = sessionStorage.getItem('ACCESS_TOKEN')
        console.log(token);
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }

        // 方法不同 get\put 请求放在params post请求放在query上
        if (config.method == 'get' || config.method == 'put') {
            config.params = config.data
        } else if (config.method == 'post') {
            config.body = config.data
        }
        // console.log(config.data);
        return config
    },
    error => {
        // console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        // console.log(response);
        if (response.config.responseType !== 'blob') { //排除blob对象
            if (res.code != 201) {
                Message({
                    message: res.code + res.message || res.msg || 'Error',
                    type: 'error',
                    duration: 2 * 1000
                })
            }
        }
        return res
    },
    function (error) {
        if (516 === error.response.status) {
            sessionStorage.removeItem('ACCESS_TOKEN')
            MessageBox.confirm('你的认证已过期，请重新登录！',
                '认证过期', {
                confirmButtonText: '重新登录',
                type: 'warning'
            }).then(() => {
                router.push('/login');
            })
        }
    }
)

export default service