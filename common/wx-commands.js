import {
	CONFIG,_DEBUG_LOCAL
} from "@/common/config.js"
import * as Route from "@/common/route.js"



export function wxLogin(cb) {
	wx.login({
		success: res => {
			// 发送 res.code 到后台换取 openId, sessionKey, unionId
			wx.request({
				url: CONFIG.WX_BASE_URL + '/wxLogin?code=' + res.code,
				method: 'POST',
				header:{
					customer:CONFIG.customer_code
				},
				success: function(res) {
					console.log("login res---->", res);
					console.log("login token---->", res.data.data.token);
					Route.saveUserInfo(res.data.data)
					if (typeof cb == "function")
						cb(res)
				}
			})
		}
	})
}


export function wxGetUserInfo(cb) {
	console.log("wxGetUserInfo");
	wx.getUserInfo({
		success: res => {
			wx.request({
				url: CONFIG.WX_BASE_URL + '/wxUserInfo',
				method: 'POST',
				data: {
					token: Route.getToken(),
					encryptedData: res.encryptedData,
					iv: res.iv
				},
				header:{
					customer:CONFIG.customer_code
				},
				success: function(res) {
					console.log("--------", res);
					if (typeof cb == "function")
						cb(res.data) //截取一层
				}
			})
		}
	})
}


export function getWxUserInfo(cb) {
	wxLogin(rsp => {
		console.log("getWxUserInfo->", rsp)
		if (0 == rsp.data.code)
			wxGetUserInfo(cb)
		else
			uni.showToast({
				title: rsp.message,
				icon: 'none',
			});
	})
}





export class WifiScaner{
	constructor() {
		this.find=false
		this.bssid=null
		this.cb=null
		this.totalTime=0
		this.period=5000
		this.maxTime=60000
	}
	start(cb){
		var that=this
		if(_DEBUG_LOCAL){
			cb(true)
			return this
		}
		wx.onGetWifiList(function (res) {
			console.log("wifi 3=>",res)
			for(var i=0;i<res.wifiList.length;i++){
				if(that.bssid==res.wifiList[i].BSSID){
					cb(true)
					that.find=true
					break;
				}
			}
			//没找到就再来
			if(!that.find){
				setTimeout(that._scan, that.period, that)
			}
		})
		
		this.cb=cb
		this._scan(this)//立即开始扫描，不等5s后
		return this
	}
	
	search(bssid){
		this.bssid=bssid
		return this
	}
	
	_scan(that){
		console.log("_sacn",that)
		   
		if(that.find){
			that.stop()
			that.cb(true)
		}else{
			that.totalTime+=that.period
			if(that.totalTime>that.maxTime)
				that.cb(false)
			else	
				that.checkIfWifi(that.bssid,that.cb)
				
		}
	}
			
	
	stop(){
		wx.stopWifi()
		wx.offGetWifiList()
		console.log("wifi stopped")
	}
	
	
	checkIfWifi(bssid,callback) {
		var checkCode=function(res,cb){
			if(0==res.errCode)
				cb()
			else{
				console.error("wifi error=>",res)
				callback(false)
			}
		}
		
		wx.startWifi({
			success(res){
				console.error("wifi 1=>",res)
				checkCode(res,function(){
					wx.getWifiList({
					  success(e){
					  console.error("wifi 2=>",e)
					}})
				})
			}
		})
	}

}

