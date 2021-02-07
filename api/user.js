import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾

export function userDepartList(params) {
	return fly.post('/ud/list', params);
}

export function register(params) {
	return fly.post('/user/register', params);
}

export function isRegister(params) {
	return fly.post('/user/is_register', params);
}

export function askMobile(params) {
	return fly.post('/user/ask_mobile', params);
}

export function bindMobile(params) {
	return fly.post('/user/bind_mobile', params);
}

export function password(params) {
	return fly.post('/user/password', params);
}

export function login(params) {
	return fly.post('/user/login', params);
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
