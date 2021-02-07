const Base64 = require("@/common/base64.js").Base64;
import {cache} from "@/common/cache.js"
//定义：页面中的to参数就是指最终的跳转页面

function base64ToStr(base64) {
	var ret = null
	try {
		ret = Base64.decode(base64).replace(/\"/g, "")
	} catch (e) {

	}
	return ret
}

function isEmpty(obj) {
	return (obj == "" || obj == null || obj == undefined)
}

function getFinalUrl(option) {
	return isEmpty(option.to)?null:base64ToStr(option.to)
}

export function postPageChanged(){
	let pages = getCurrentPages(); //获取所有页面栈实例列表
	if(pages.length>0){
		let nowPage = pages[ pages.length - 1]; //当前页页面实例
		uni.$emit("updateLeftMenu",nowPage.route)
	}
}

function packageParam(obj){
	var extra = ""
	for (let key in obj) {
		console.log(key + '--->' + obj[key])
		var p = ""
		if (ENCODE_KEYS.includes(key) && typeof(obj[key]) == 'string' && obj[key].includes('/'))
			p = key + '=' + Base64.encode(JSON.stringify(obj[key]))
		else {
			p = key + '=' + obj[key]
		}
		extra = extra + "&" + p
	}
	return extra
}	

function _navigateTo(_url,obj){
	var url=_url
	if(!isEmpty(obj))
		url=url+"?"+packageParam(obj)
		
	uni.navigateTo({
	  url: url,
	  success: function(res) {
		// 通过eventChannel向被打开页面传送数据
		postPageChanged()
	  }
	})
}
	
function _redirectTo(_url,obj){
		console.log("_redirectTo=>",url,obj)
	var url=_url
	if(!isEmpty(obj))
		url=url+"?"+packageParam(obj)
		
	uni.redirectTo({
	  url: url,
	  success: function(res) {
		// 通过eventChannel向被打开页面传送数据
		postPageChanged()

	  }
	})
}
		
function _relaunch(_url,obj){
	var url=_url
	if(!isEmpty(obj))
		url=url+"?"+packageParam(obj)
		
	uni.reLaunch({
	  url: url,
	  success: function(res) {
		// 通过eventChannel向被打开页面传送数据
		postPageChanged()
	  }
	})
}
			
function _naviTo(_url,obj){
	var url=_url
	if(!isEmpty(obj))
		url=url+"?"+packageParam(obj)
		
	uni.navigateTo({
	  url: url,
	  success: function(res) {
		// 通过eventChannel向被打开页面传送数据
		postPageChanged()
	  }
	})
}			


var ENCODE_KEYS = ['to','qrText',"background"]
//加密参数跳转
function goto(url, obj) {
	if (isEmpty(obj)) {
		_navigateTo(url)
		return
	}
	var extra = packageParam(obj)
	console.log('---goto extra', extra)
	_redirectTo(url,obj)
}

export function redirectTo(url, obj) {
	_redirectTo(url,obj)
}

export function relaunch(url, obj) {
	_relaunch(url,obj)
}

export function decodeOption(obj){
	var ret={}
	for (let key in obj) {
		console.log(key + '--->' + obj[key])
		var p = ""
		if (ENCODE_KEYS.includes(key) && typeof(obj[key]) == 'string'){
			var temp=Base64.decode(obj[key])
			ret[key]=temp.substr(1).substr(0,temp.length-2)// 删除多带的一对引号
		}else {
			ret[key]=obj[key]
		}
		
	}
	return  ret
}

export function naviTo(url, obj) {
	_naviTo(url,obj)
}

function closeTo(url) {
	_redirectTo(url)
}

//不加密参数跳转
function forwardTo(url, obj) {
	console.log("forwardTo=>",url,obj)
	//主要防止登录后url为空的情况
	if (isEmpty(url)) {
		redirectTo('/pages/news/index')
		return
	}
	_redirectTo(url,obj)

}




function loginTo(url, param) {
	//判断缓存中是否登录过，直接登录
	try {
		if (isLogin()) {
			goto(url, param)
		} else {
			//将参数复制后加入最终要去的页面的url
			var p = {}
			Object.assign(p, param, {
				to: url
			})
			goto('/pages/login/login', p)
		}
	} catch (e) {
		console.log("loginTo fail at：", e);
	}
}


function gotoToast(toast, url, obj) {
	uni.showToast({
		icon: 'none',
		position: 'bottom',
		title: toast,
		during: 2500
	});
	setTimeout(function() {
		goto(url, obj)
	}, 2500)
}

function checkLogin(url, param) {
	//判断缓存中是否登录过，直接登录
	if (!isLogin()) {
		var p = {}
		Object.assign(p, param, {
			to: url
		})
		gotoToast("需要登录后使用", '/pages/login/login', p)
	}
	// try {
	// if (isLogin()) {

	// }else{
	// 	//将参数复制后加入最终要去的页面的url
	// 	var p={}
	// 	Object.assign(p,param,{to:url})
	// 	goto('/pages/login/login',p)
	// }
	// } catch (e) {
	// console.log("loginTo fail at：",e);
	// }
}




function getToken() {
	return null != cache('setUserInfo') ? cache('setUserInfo').token : null
}

export function getUserId() {
	return null != cache('setUserInfo') ? cache('setUserInfo').user_id : null
}

export function saveUserInfo(userInfo) {
	try {
		cache('setUserInfo', userInfo); //存入缓存
		//console.log("---", 'userinfo:', cache('setUserInfo'))
	} catch (e) {
		console.log(e)
	}
}

export function getUserInfo() {
	return cache('setUserInfo')
}

function isLogin() {
	//判断缓存中是否登录过，直接登录
	var ret = false
	try {
		const value = cache('setUserInfo');
		//console.log("已登录用户：", value);
		return null != value
	} catch (e) {
		// error
	}
	return ret
}




export {
	loginTo,
	closeTo,
	getFinalUrl,
	base64ToStr,
	goto,
	forwardTo,
	checkLogin,
	isLogin,
	getToken
}
