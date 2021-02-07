import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾


export function add(params) {
	return fly.post('/event/add', params);
}

export function delOne(params) {
	return fly.post('/event/del', {ids:[params]});
}

export function update(params) {
	return fly.post('/event/update', params);
}

export function get(params) {
	return fly.post('/event/get', params);
}

export function getContent(params) {
	return fly.post('/event/content', params);
}

export function setContent(params) {
	return fly.post('/event/set_content', params);
}

export function addSlices(params) {
	return fly.post('/slice/add_list', params);
}

export function getSlices(params) {
	return fly.post('/event/slice_list', params);
}