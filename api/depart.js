import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾


export function getDepartBranch(params) {
	return fly.post('/depart/branch', params);
}


