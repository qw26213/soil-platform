import axios from 'axios'
import Cookies from "js-cookie";
import router from '../router'
import { MessageBox, Message } from 'element-ui'

const service = axios.create({
    baseURL: '/', // 测试
    timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        const token = sessionStorage.ACCESS_TOKEN
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }

        // 方法不同 get\put 请求放在params post请求放在query上
        if (config.method == 'get' || config.method == 'put') {
            config.params = config.data
        } else if (config.method == 'post') {
            config.body = config.data
        }
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
                console.log(response)
                Message({
                    message: res.message || res.msg || 'Error',
                    type: 'warning',
                    duration: 2 * 1000
                })
            }
        }
        return res
    },
    function (error) {
        console.log(error)
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