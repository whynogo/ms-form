import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾


export function getAreaInBuilding(params) {
	return fly.post('seat/area_in_building', params);
}

export function getSeatInArea(params) {
	return fly.post('seat/in_area', params);
}

export function revSeat(params) {
	return fly.post('seat/rev', params);
}

export function isUserRev(params) {
	return fly.post('seat/is_rev', params);
}

export function cancelOrder(params) {
	return fly.post('seat/cancel', params);
}

export function getSeatInfo(params) {
	return fly.post('seat/info', params);
}

export function getUserRecord(params) {
	return fly.post('seat/record', params);
}

export function checkin(params) {
	return fly.post('seat/checkin', params);
}

export function getArea(params) {
	return fly.post('area/list', params);
}

export function getAreaList(params) {
	return fly.post('area/list', params);
}

export function getAreaForm(params) {
	return fly.post('area/form', params);
}

export function getAreaCusForm(params) {
	return fly.post('area/cus_form', params);
}

export function areaAdd(params) {
	return fly.post('area/add', params);
}

export function areaGet(params) {
	return fly.post('area/get', params);
}

export function areaDel(params) {
	return fly.post('area/del', params);
}

export function areaUpdate(params) {
	return fly.post('area/update', params);
}

export function getBuildingNames(params) {
	return fly.post('building/names', params);
}

export function getBuildingList(params) {
	return fly.post('building/list', params);
}

export function getBuildingForm(params) {
	return fly.post('building/form', params);
}

export function getBuildingCusForm(params) {
	return fly.post('building/cus_form', params);
}



let path='seat'

export function list(params) {
	return fly.post(`${path}/list`, params);
}

export function add(params) {
	return fly.post(`${path}/add`, params);
}

export function get(params) {
	return fly.post(`${path}/get`, params);
}

export function del(params) {
	return fly.post(`${path}/del`, params);
}

export function update(params) {
	return fly.post(`${path}/update`, params);
}

export function getForm(params) {
	return fly.post(`${path}/form`, params);
}

export function getCusForm(params) {
	return fly.post(`${path}/cus_form`, params);
}

export function names(params) {
	return fly.post(`${path}/names`, params);
}

export function getAreaNames(params) {
	return fly.post(`area/names`, params);
}

