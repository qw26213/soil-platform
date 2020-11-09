import request from '@/utils/request.js'

// 检测结果查询
export function dected_result(data) {
	return request({
		url: '/api/v1/soil/detect/dected_result',
		method: 'get',
		data
	})
}

// 检测详情 
export function dected_detail(data) {
	return request({
		url: '/api/v1/soil/detect/dected_detail',
		method: 'get',
		data
	})
}

// 检测结果录入
export function detect_result_entry(data) {
	return request({
		url: '/api/v1/soil/detect/dected_result',
		method: 'put',
		data
	})
}

// 检测结果展示
export function dected_resultv2(data) {
	return request({
		url: '/api/v1/soil/detect/dected_resultv2',
		method: 'get',
		data
	})
}

// 生成检测记录
export function create_detect_record(data) {
	return request({
		url: '/api/v1/soil/detect/detect',
		method: 'post',
		data
	})
}

// 实验室检测列表
export function detect_ele(data) {
	return request({
		url: '/api/v1/soil/detect/detect_ele',
		method: 'get',
		data
	})
}

// 检测机构列表
export function detect_org(data) {
	return request({
		url: '/api/v1/soil/detect/detect_org',
		method: 'get',
		data
	})
}

// 采样密封袋检测
export function sample_check(data) {
	return request({
		url: '/api/v1/soil/detect/sample_check',
		method: 'get',
		data
	})
}

// 土样列表
export function get_samples(data) {
	return request({
		url: '/api/v1/soil/detect/samples',
		method: 'get',
		data
	})
}

//  采集结果分析
export function get_point_result(id, eles) {
	return request({
		url: '/api/v1/soil/detect/dected_resultv2/' + id + '?eles=' + eles,
		method: 'get'
	})
}
