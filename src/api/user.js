import request from '@/utils/request.js'

// 登录
export function login(data) {
	return request({
		url: '/api/v1/admin/login',
		method: 'post',
		data
	})
}
//获取角色列表
export function role() {
	return request({
		url: '/api/v1/role',
		method: 'get',
	})
}

//获取验证码
export function verify(data) {
	return request({
		url: '/api/v1/sms/verify',
		method: 'put',
		data
	})
}

//验证码校验正确性
export function verify_check(data) {
	return request({
		url: '/api/v1/sms/verify_check',
		method: 'put',
		data
	})
}

//验证码邮箱或者手机号是否唯一
export function userCheck(data) {
	return request({
		url: '/api/v1/admin/check',
		method: 'get',
		data
	})
}

//注册
export function regist(data) {
	return request({
		url: '/api/v1/admin/register',
		method: 'post',
		data
	})
}


//获取注册图片验证码
export function captchaImg(data) {
	return request({
		url: '/api/v1/admin/captcha_img',
		responseType: 'blob',
		method: 'get',
		data
	})
}
//图片验证码效验
export function checkCaptcha(data) {
	return request({
		url: '/api/v1/admin/check_captcha',
		method: 'get',
		data
	})
}

//图片验证码效验
export function userPassword(data) {
	return request({
		url: '/api/v1/admin',
		method: 'put',
		data
	})
}

export function getAdminInfo() {
	return request({
		url: '/api/v1/admin/info',
		method: 'get'
	})
}