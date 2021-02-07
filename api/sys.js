import fly from '@/common/request'

//必须定义为 function
//get的url一定不能以/结尾


export function getLeftMenu(params) {
	return fly.post('config/left_menu', params);
}