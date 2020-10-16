import request from '@/utils/request.js'

// 批次列表
export function batchList(data) {
	return request({
		url: '/api/v1/soil/batch/list',
		method: 'get',
		data
	})
}

// 获取省市级列表 
export function get_city(data) {
	return request({
		url: '/api/v1/soil/collect/area',
		method: 'get',
		data
	})
}

// 耕作方式
export function farm_method(data) {
	return request({
		url: '/api/v1/soil/collect/farm_method',
		method: 'get',
		data
	})
}

// 加载方式
export function load_method(data) {
	return request({
		url: '/api/v1/soil/collect/load_method',
		method: 'get',
		data
	})
}

// 土壤属性
export function soil_properties(data) {
	return request({
		url: '/api/v1/soil/collect/soil_properties',
		method: 'get',
		data
	})
}


// 土壤酸碱度 
export function soil_ph(data) {
	return request({
		url: '/api/v1/soil/collect/soil_ph',
		method: 'get',
		data
	})
}

// 生成批次
export function saveBatch(data) {
	return request({
		url: '/api/v1/soil/batch/v2',
		method: 'post',
		data
	})
}

// 批次详情
export function batchDetails(data) {
	return request({
		url: '/api/v1/soil/batch/detail',
		method: 'get',
		data
	})
}

// 批次认领详情
export function pointBindDetails(data) {
	return request({
		url: '/api/v1/soil/batch/view',
		method: 'get',
		data
	})
}

// 批次剩余点数
export function batchLastPoint(data) {
	return request({
		url: '/api/v1/soil/batch/last',
		method: 'get',
		data
	})
}

// 扩大人员范围
export function addRange(data) {
	return request({
		url: '/api/v1/soil/batch/range',
		method: 'get',
		data
	})
}

// 获取积分列表
export function integralList(data) {
	return request({
		url: '/api/v1/soil/batch/integral',
		method: 'get',
		data
	})
}

// 获取该批次的圈地和打点信息
export function batchPoint(data, batch_code) {
	let url = `/api/v1/soil/batch/v2/${batch_code}`
	return request({
		url: url,
		method: 'get',
		data
	})
}

// 生成
export function pubishBatch(data) {
	return request({
		url: '/api/v1/soil/batch',
		method: 'put',
		data
	})
}


// 直接分配 的 报名志愿者
export function bactchVolunteer(data) {
	return request({
		url: '/api/v1/soil/batch/volunteer',
		method: 'get',
		data
	})
}

// 直接分配 绑定接口
export function batchDirect(data) {
	return request({
		url: '/api/v1/soil/batch/direct',
		method: 'put',
		data
	})
}

// 任务管理列表
export function taskList(data) {
	return request({
		url: '/api/v1/soil/task',
		method: 'get',
		data
	})
}

// 任务列表头
export function taskListHeader(data) {
	return request({
		url: '/api/v1/soil/task/header',
		method: 'get',
		data
	})
}

// 志愿者列表
export function volunteerList(data) {
	return request({
		url: '/api/v1/soil/volunteer/list',
		method: 'get',
		data
	})
}

// 志愿者详情
export function volunteerDetails(data) {
	return request({
		url: '/api/v1/soil/volunteer/details',
		method: 'get',
		data
	})
}

// 结果展示
export function batchResult(data) {
	return request({
		url: '/api/v1/soil/batch/batch_result',
		method: 'get',
		data
	})
}


// 采样点统计
export function sampleCount(data) {
	return request({
		url: '/api/v1/soil/batch/sample_count',
		method: 'get',
		data
	})
}

//  仓库列表
export function depotList(data) {
	return request({
		url: '/api/v1/soil/depot',
		method: 'get',
		data
	})
}

//  创建货架
export function createShelf(data) {
	return request({
		url: '/api/v1/soil/depot/shelf',
		method: 'put',
		data
	})
}

//  创建盒子
export function createBox(data) {
	return request({
		url: '/api/v1/soil/depot/box',
		method: 'put',
		data
	})
}

//  创建容器
export function createContainer(data) {
	return request({
		url: '/api/v1/soil/depot/container',
		method: 'put',
		data
	})
}

//获取容器类型列表
export function depotContainer(data) {
	return request({
		url: '/api/v1/soil/depot/container',
		method: 'get',
		data
	})
}

// 获取 赋码管理 列表
export function depotCodeList(data) {
	return request({
		url: '/api/v1/soil/depot/list',
		method: 'get',
		data
	})
}

// 获取 类型 列表
export function depotType(data) {
	return request({
		url: '/api/v1/soil/depot/type',
		method: 'get',
		data
	})
}

// 获取 创建人 列表
export function depotCreater(data) {
	return request({
		url: '/api/v1/soil/depot/creater',
		method: 'get',
		data
	})
}


//获取赋码列表详情
export function depotCodeDetail(data) {
	return request({
		url: '/api/v1/soil/depot/detail',
		method: 'get',
		data
	})
}

//入库管理
export function deportManger(data) {
	return request({
		url: '/api/v1/soil/depot/deport_manger',
		method: 'get',
		data
	})
}

// 入库管理详情 
export function deportDetail(data) {
	return request({
		url: 'api/v1/soil/depot/deport_detail',
		method: 'get',
		data
	})
}

//编码导出
export function exportExcel(data) {
	return request({
		url: '/api/v1/soil/depot/export',
		method: 'get',
		data
	})
}

//货架查询
export function searchShelf(data) {
	return request({
		url: '/api/v1/soil/depot/shelf',
		method: 'get',
		data
	})
}

// 仓库查询 查询管理
export function deport_v2(data) {
	return request({
		url: '/api/v1/soil/depot/deport_v2',
		method: 'get',
		data
	})
}

//货架查询 -  详情
export function shelf_detail(data) {
	return request({
		url: '/api/v1/soil/depot/shelf_detail',
		method: 'get',
		data
	})
}

//容器查询
export function searchContainer(data) {
	return request({
		url: '/api/v1/soil/depot/container_query',
		method: 'get',
		data
	})
}


//样本查询
export function searchSample(data) {
	return request({
		url: '/api/v1/soil/depot/sample',
		method: 'get',
		data
	})
}

//样本查询 -  采土年份
export function batch_years(data) {
	return request({
		url: '/api/v1/soil/depot/batch_years',
		method: 'get',
		data
	})
}

//样本查询 -  批次列表
export function batch_query(data) {
	return request({
		url: '/api/v1/soil/depot/batch_query',
		method: 'get',
		data
	})
}

//样本查询 -  采土地址
export function area_query(data) {
	return request({
		url: '/api/v1/soil/depot/area_query',
		method: 'get',
		data
	})
}

//样本查询 -  采集人
export function collector_query(data) {
	return request({
		url: '/api/v1/soil/depot/collector_query',
		method: 'get',
		data
	})
}

//使用情况 -  容器
export function deport_container(data) {
	return request({
		url: '/api/v1/soil/depot/deport_container',
		method: 'get',
		data
	})
}

//使用情况 -  货架
export function deport_shelf(data) {
	return request({
		url: '/api/v1/soil/depot/deport_shelf',
		method: 'get',
		data
	})
}

//使用情况 -  样本
export function deport_sample(data) {
	return request({
		url: '/api/v1/soil/depot/deport_sample',
		method: 'get',
		data
	})
}











