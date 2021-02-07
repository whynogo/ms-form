const Base64 = require("@/common/base64.js").Base64;
import {
	goto,
	closeTo
} from "@/common/route.js"

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}

export function formatDate(d) {
	return new Date(d).format("yyyy-MM-dd")
}

export function formatDateTime(d) {
	return new Date(new Date(d)).format("yyyy-MM-dd hh:mm")
}

export function day(offset) {
	var lw = new Date(new Date() - 1000 * 60 * 60 * 24 * (-offset)) // 最后一个数字30可改，30天的意思
	var lastY = lw.getFullYear()
	var lastM = lw.getMonth() + 1
	var lastD = lw.getDate()
	var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD) // 三十天之前日期
	return startdate
}

export function isSameDay(startTime, endTime) {
	const startTimeMs = new Date(startTime).setHours(0, 0, 0, 0);
	const endTimeMs = new Date(endTime).setHours(0, 0, 0, 0);
	return startTimeMs === endTimeMs ? true : false
}

export function compareDate(startTime, endTime) {
	const startTimeMs = new Date(startTime)
	const endTimeMs = new Date(endTime)
	return startTimeMs >= endTimeMs
}

export function today() {
	return day(0)
}

export function tomorrow(offset) {
	return day(1)
}


export function convertUTCTimeToLocalTime(UTCDateString) {
	if (!UTCDateString || isEmpty(UTCDateString)) {
		return '-'
	}

	function formatFunc(str) { // 格式化显示
		return str > 9 ? str : '0' + str
	}
	var date2 = new Date(UTCDateString) // 这步是关键
	var year = date2.getFullYear()
	var mon = formatFunc(date2.getMonth() + 1)
	var day = formatFunc(date2.getDate())
	var hour = date2.getHours()
	// var noon = hour >= 12 ? 'PM' : 'AM'
	// hour = (hour >= 12 ? hour - 12 : hour)
	hour = formatFunc(hour)
	var min = formatFunc(date2.getMinutes())
	var dateStr = year + '-' + mon + '-' + day + ' ' + ' ' + hour + ':' + min
	return dateStr
}

export function convertUTCTimeToLocalDate(UTCDateString) {
	if (!UTCDateString || isEmpty(UTCDateString)) {
		return '-'
	}

	function formatFunc(str) { // 格式化显示
		return str > 9 ? str : '0' + str
	}
	var date2 = new Date(UTCDateString) // 这步是关键
	var year = date2.getFullYear()
	var mon = formatFunc(date2.getMonth() + 1)
	var day = formatFunc(date2.getDate())
	var dateStr = year + '-' + mon + '-' + day
	return dateStr
}

export function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

export function isEmpty(obj) {
	return (obj == "" || obj == null || typeof obj == "undefined")
}

export function get(obj, key, def) {
	if (typeof obj == "undefined" || typeof obj[key] == "undefined")
		return def
	else
		return obj[key]
}

//定义：页面中的to参数就是指最终的跳转页面

export function base64ToStr(base64) {
	var ret = null
	try {
		ret = Base64.decode(base64).replace(/\"/g, "")
	} catch (e) {

	}
	return ret
}

export function strToBase64(str) {
	return Base64.encode(str)
}

export function toConstructor(className) {
    if (!/^[$_a-z][$_a-z0-9.]*$/i.test(className)) {
        throw new Error("Invalid class name: " + className);
    }

    try {
        return eval(className);
    }
    catch (error) {
        return null;
    }
}


export function getElementRect(that,element,cb) {
	setTimeout(()=>{
		let query = uni.createSelectorQuery().in(that);
		query.select(element).boundingClientRect();
		query.exec((res) => {
			if (!res) {//如果没获取到，再调一次
				that.getElementHeight();
			}else {
				cb(res[0])
			}
		})
	},20)
}


/**
 * 生成随机文件名称
 * 规则八位随机字符，加下划线连接时间戳
 */
export const getFileNameUUID = () => {
	function rx() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
	}
	return `${+new Date()}_${rx()}${rx()}`
}


export function getRandFileName(filename, path = '') {
	const temporary = filename.lastIndexOf('.')
	const fileNameLength = filename.length
	const fileFormat = filename.substring(
		temporary + 1,
		fileNameLength
	)
	//生成随机的文件名，保留文件后缀
	if (path !== '')
		return path + '/' + getFileNameUUID() + '.' + fileFormat
	else
		return getFileNameUUID() + '.' + fileFormat
}




export function postPageChanged(){
	let pages = getCurrentPages(); //获取所有页面栈实例列表
	let nowPage = pages[ pages.length - 1]; //当前页页面实例
	uni.$emit("updateLeftMenu",nowPage.route)
}


export function closeToast(toast, url, obj) {
	uni.showToast({
		icon: 'none',
		position: 'bottom',
		title: toast,
		during: 2500
	});
	closeTo(url, obj)
}


export function gotoToast(toast, url, obj) {
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

export function failToast(toast, url, obj) {
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

export function successToast(toast, url, obj) {
	uni.showToast({
		icon: 'success',
		title: toast,
		during: 2500
	});
	setTimeout(function() {
		goto(url, obj)
	}, 2500)
}

// export function backToast(toast, url) {
// 	uni.showToast({
// 		icon: 'success',
// 		title: toast,
// 		during: 2500
// 	});
// 	setTimeout(function() {
// 		uni.redirectTo({
// 			url: url
// 		});
// 	}, 2500)
// }

export function backToast(toast) {
	uni.showToast({
		icon: 'success',
		title: toast,
		during: 2500
	});
	setTimeout(function() {
		uni.navigateBack({
			
		});
	}, 2500)
		
	
}

export function reloadToast(toast, url) {
	uni.showToast({
		icon: 'none',
		position: 'bottom',
		title: toast,
		during: 2500
	});
	setTimeout(function() {
		uni.reLaunch({
			url: url
		});
	}, 1000)
}

export function longToast(toast) {
	uni.showToast({
		icon: 'none',
		title: toast,
		during: 2500
	});
}


export function confirmDo(prompt, cb) {
	uni.showModal({
		title: '',
		content: prompt,
		success: function(res) {
			if (res.confirm) {
				if (typeof cb === "function") cb()
				console.log('用户点击确定');
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
}


export function confirmCancel(cb, prompt = "确定取消吗?") {
	confirmDo(prompt, cb)
}

export function justConfirm(prompt, cb) {
	uni.showModal({
		title: '',
		showCancel: false,
		content: prompt,
		success: function(res) {
			if (res.confirm) {
				if (typeof cb === "function") cb()
				console.log('用户点击确定');
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
}

export function delayToast(toast, timeout = 300) {
	setTimeout(function() {
		uni.showToast({
			icon: 'none',
			title: toast,
			during: 2000
		});
	}, timeout)
}



/**
 * @param {Object} args,必须全是异步async的函数
 * 返回的是包含最终结果的promise
 */

export function orderCall(...args) {
	return orderRun(arguments)
}

/**
 * @param {Object} funArr
 * 执行一个异步async函数数组。返回的是包含最终结果的promise
 */
export function orderRun(funArr) {
	return (async () => {
		uni.showLoading()
		var result=true
		for (let i = 0; i < funArr.length; i++) {
			var out=await funArr[i]()
			if(isEmpty(out)){
			   result=false
			   break;
			}
		}
		uni.hideLoading()
		return result
	})()
// 	Promise.all(funArr).then((result) => {
// 		console.log("orderRun ok=>",result) 
// 	}).catch((error) => {
// 		console.log("orderRun fail=>",error)
// 	})
}
class A{}
/**
 * @param {Object} obj,为了方便处理传入的类似全局变量，便于内部操作
 * @param {Object} resolve
 * @param {Object} reject
 */
export function toAsync(_that, handler = function(obj, resolve, reject) {}) {
	var that = _that
	return async function() {
		//给that动态增加报错接口,不给提示
		that.failCode = function(errCode) {
			//异常了就关闭loading，注意要放在showToast前,否则toast显示不出来
			//uni.hideLoading()
			//throw Error(errMsg, errCode)
		}
		//给that动态增加报错接口
		that.fail = function(errMsg = "加载失败，请重试!", errCode = 10000) {
			//异常了就关闭loading，注意要放在showToast前,否则toast显示不出来
			//uni.hideLoading()
			if(105!=errCode)
				uni.showToast({
					title: errMsg,
					icon: 'none',
				});
			//throw Error(errMsg, errCode)
		}
		//给that动态增加报错接口
		that.failTo = function(url,errMsg = "加载失败，请重试!", errCode = 10000) {
			//异常了就关闭loading，注意要放在showToast前,否则toast显示不出来
			//uni.hideLoading()
			if(105!=errCode)
				failToast(errMsg,url)
			//throw Error(errMsg, errCode)
		}
		return await new Promise(function(resolve, reject) {
			//发起请求，回调handler来处理response,出错UI直接提示了
			try {
				handler(that, resolve, reject)
			} catch (e) {
				console.log("toAsync err================>", e)
				//异常了就关闭loading，注意要放在showToast前,否则toast显示不出来
				//wx.hideLoading()
				uni.showToast({
					title: e.message,
					icon: 'none',
				});
				reject()
			}
		})
	}
}

