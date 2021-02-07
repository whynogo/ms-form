import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾

let path='menu'

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

export function getMenuNames(params) {
	return fly.post(`${path}/names`, params);
}