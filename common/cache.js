export function cache(key, value=null, seconds=3600*8) {
	var timestamp = Date.parse(new Date()) / 1000
	if (key && value === null) {
		var val = uni.getStorageSync(key);
		if(null!=val){
			if (timestamp >= val.timestamp) {
				console.log("===>key已失效",key)
				uni.removeStorageSync(key)
				return null
			} else {
				//console.log("key未失效")
				return val.v
			}
		}
		return val
	} else if (key && value) {
		//设置缓存
		if (!seconds) {
			var expire = timestamp + (3600 * 24 * 28)
		} else {
			var expire = timestamp + seconds
		}
		uni.setStorageSync(key, {v:value,timestamp:expire});
		//console.log(timestamp + "===>" ,key,value)
	} else if(typeof key == "undefined") {
		console.log("key不能空")
	}
}