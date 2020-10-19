import request from '@/utils/request.js'

// 创建采土袋
export function create_bag(data) {
	return request({
		url: '/api/v1/soil/system/bag?count=' + data,
		method: 'post'
	})
}

// 采土袋编码记录 
export function bag_list(data) {
	return request({
		url: '/api/v1/soil/system/bag_list',
		method: 'get',
		data
	})
}

// 创建仓库
export function create_deport(data) {
	return request({
		url: '/api/v1/soil/system/deport',
		method: 'post',
		data
	})
}

// 仓库名称
export function deport_name(data) {
	return request({
		url: '/api/v1/soil/system/deport_name',
		method: 'get',
		data
	})
}

// 采土袋编码导出
export function exportCode(data) {
	return request({
		url: '/api/v1/soil/system/export',
		method: 'post',
		data
	})
}

// 订购记录
export function order(data) {
	return request({
		url: '/api/v1/soil/system/order',
		method: 'get',
		data
	})
}

// 获取参数
export function getParam(data) {
	return request({
		url: '/api/v1/soil/system/system',
		method: 'get',
		data
	})
}

// 更新参数
export function updateParam(data) {
	return request({
		url: '/api/v1/soil/system/system',
		method: 'post',
		data
	})
}
