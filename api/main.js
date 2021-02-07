import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾
export function getRevList(params) {
	return fly.post('/event/list', params);
}

export function getRevContent(params) {
	return fly.post('/event/get', params);
}

export function getRevCount(params) {
	return fly.post('/event/rev_count', params);
}

export function getEventSlice(params) {
	return fly.post('/event/slice', params);
}

export function order(params) {
	return fly.post('/record/add', params);
}

export function cancelOrder(params) {
	return fly.post('/record/cancel',params);
}

export function downloadOrderList(params) {
	return fly.post('/record/download_list',params);
}

export function isUserRev(params) {
	return fly.post('/record/is_rev', params);
}

export function login(params) {
	return fly.post('/user/login', params);
}

export function reportQr(params) {
	return fly.post('/record/report_qr', params);
}


export default {
	// 新增一条打卡记录
	addCheck: (params) => {
		return fly.post('/check/add', params);
	},
	// 获取用户信息
	getUser: () => {
		return fly.get('/user/get');
	},
	// 查询点赞的用户
	getLikeUsers: (params) => {
		return fly.get('/user-like-check/getUsers?id=', params);
	}

}
