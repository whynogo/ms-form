
// #ifndef MP-WEIXIN		
import {
	uniUploadBlobUrl
} from '@/common/oss.js';
// #endif
// #ifdef MP-WEIXIN
import {
	wxOssUploadFile
} from '@/common/wx-oss-upload.js';
// #endif


import {
	isEmpty,
	convertUTCTimeToLocalTime,
	orderCall,
	orderRun,
	confirmDo,
	toAsync,
	today,
	compareDate,
	delayToast,
	reloadToast,
	backToast
} from '@/common/util.js';


var TEST_FORM=false

/**
 * 自动Form驱动器，可以完成add、get、update、del
 */
var g_formDrivers={}
export class FormDriver{
		constructor(name,page,jsonForm=null,directory="/reservation") {
			this.name=name
		    this.page=page//这个保存发起请求的page
			this.model={id:null}
			this.items=[]
			this.options={}
			this.directory=directory
			this.event_id="new-item-created"
			this.jsonForm=jsonForm
			g_formDrivers[name]=this
		}
		

		
		/**
		 * 设置当前编辑的记录id
		 * @param {Object} id
		 */
		setId(id){
			if(!isEmpty(id))
				this.model.id=id
		}
		/**
		 * 拉取服务器数据
		 * @param {Object} id
		 */
		fectchRemoteData(id){
			if(!isEmpty(id)){
				this.model.id=id
				console.log("fectchRemoteData=>",id)
				// this.get()
			}
		}
		
		/**分别是add，update，delete，需要被子类重载
		 * @param {Object} model
		 */
		add(model){
			console.log("override me=>add")
		}
		update(model){
			console.log("override me=>update")
		}
		get(model){
			console.log("override me=>get")
		}
		delete(model){
			console.log("override me=>del")
		}
		
		/**
		 * 根据平台选择不同的接口，但首先要先上传图片，如果有的话
		 * @param {Object} model
		 * @param {Object} request
		 */
		submit(model,request){
			console.log("start submitting...",model)
			this.model=Object.assign({},model)
			
			//注册一个回调，等待add返回的id
			this.page.$once(this.event_id, (value)=>{
				console.log("===>item id received",value)
				this.setId(value)
			})
			
			// #ifndef MP-WEIXIN
			this.uploadAndSubmit()
			// #endif
			// #ifdef MP-WEIXIN
			this.wxUploadAndSubmit()
			// #endif
		}




		/**
		 * 上传图片然后进行后续操作
		 */
		uploadAndSubmit() {
			//这里都是被orderCall调用的，this环境已经不是这个页面
			var calls=[]
			for( var field in this.model){
				if(field.indexOf("image") != -1&&!this.model.image.startsWith("http"))
					calls.push(toAsync(this,function(that,resolve,reject){
						//这里的that都是driver？
							uniUploadBlobUrl(that.model.image, that.directory, function(ret) {
								console.log("======上传图片结果：", ret)
								that.model.image = ret.name;
								resolve(true)
							}, err => {
								that.fail("图片上传失败，请重试!")
							})
						}))
			}
			
			var fun_addOrUpdate=toAsync(this,function(that,resolve,reject){
				if (!isEmpty(that.model.id))
					that.update(that.model)
				else
					that.add(that.model)
				resolve(true)	
			})
			
			calls.push(fun_addOrUpdate)	

			orderRun(calls)
		}


		/**
		 * 上传图片然后进行后续操作
		 */
		wxUploadAndSubmit() {
			//显示消息提示框
			function isLocalFilename(filename){
				return filename.startsWith("http://tmp")||filename.startsWith("wxfile://")
			}
			var calls=[]
			for( var field in this.model){
				if(field.indexOf("image") != -1&&isLocalFilename(this.model.image))
				calls.push(toAsync(this,function(that,resolve,reject){
						wxOssUploadFile(that.model.image, that.directory, function(ret) {
							console.log("======上传图片结果：", ret)
							that.model.image = ret.name;
							resolve(true)
						}, err => {
							that.fail("图片上传失败，请重试!")
						})
					}))
			}


			var fun_addOrUpdate=toAsync(this,function(that,resolve,reject){
				if (!isEmpty(that.model.id))
					that.update(that.model)
				else
					that.add(that.model)
			})
			
			calls.push(fun_addOrUpdate)	

			orderRun(calls)


			//上传图片
			//你的域名下的/images/当前年月日文件下的/图片.png
			//图片路径可自行修改【(这二个参数就是你oss地址目录的下一个路径目录，比如:https://xxx.com/images/xxx.png)】

		}

		newGuid() {
			let s4 = function() {
				return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
			}
			return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
		}

		/**
		 * 从服务器获取表单内容
		 * @param {Object} request
		 */
		getForm(request){
		
			if(TEST_FORM)
				this.jsonForm=jsonForm
			
			//如果没有设置jsonForm数据，则从远程获取
			if(null==this.jsonForm){
				return toAsync(this,function(that,resolve,reject){
					//这里使用的that都是page
					request.then(rsp=>{
						if (0 == rsp.code) {
							that.items.length=0
							that.items=rsp.data.items.map(item=>{
								return item
							})
							//只有id不存在时才将默认值放入
							console.log("getForm=>",that.model.id,that.model)
							if(isEmpty(that.model.id))
								that.model=Object.assign({},rsp.data.default)
							that.page.forceUpdate(that)//强制更新，其实没有props都可以了 
							resolve(true)
						}else
							that.fail(rsp.message)
						})
					})
			}else{
				return toAsync(this,function(that,resolve,reject){
					//这里使用的that都是page
					that.items.length=0
					that.items=that.jsonForm.items.map(item=>{
						return item
					})

					if(isEmpty(that.model.id))
						that.model=Object.assign({},that.jsonForm.default)
					//that.update=driver.newGuid()
					that.page.forceUpdate(that)	
					resolve(true)	
				})
			}
		}
		
		/**
		 * @param {Object} request
		 * 传入定制的request，完成数据添加的请求后并显示结果
		 */
		doAdd(request){
			var event_id=this.event_id
			var fun_add = toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						that.page.$emit(event_id,rsp.data.id)
						resolve(true)
					}else
						that.fail()
				})
			})
			
			orderCall(fun_add).then(ret=>{
				console.log("ret=>",ret)
				if(ret){
					//请求listdrvier更新数据
					uni.$emit("req-update-list",this.name)
					backToast("数据已添加")
				}else
					uni.showToast({
						icon: 'none',
						title: "数据添加失败",
						during: 2500
					});				
			})
		}
		
		/**
		 * @param {Object} request
		 * 传入定制的request，完成数据更新的请求后并显示结果
		 */
		doUpdate(request){
			//console.log("override me=>update")
			var fun_update = toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						resolve(true)
					}else
						that.fail()
				})
			})
			
			orderCall(fun_update).then(ret=>{
				console.log("ret=>",ret)
				if(ret){
					//请求listdrvier更新数据
					uni.$emit("req-update-list",this.name)
					backToast("数据已更新")
				}
				else
					uni.showToast({
						icon: 'none',
						title: "数据更新失败",
						during: 2500
					});				
			})
		}
		
		/**
		 * @param {Object} request
		 * 传入定制的request，完成数据删除的请求后并显示结果，并且回调让用户定制额外操作
		 */
		doDel(request,callback){
			var event_id=this.event_id
			var fun_del = toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						resolve(true)
					}else
						that.fail()
				})
			})
			
			orderCall(fun_del).then(ret=>{
				console.log("ret=>",ret)
				if(ret){
					//请求listdrvier更新数据
					uni.$emit("req-update-list",this.name)
					uni.showToast({
						icon: 'success',
						title: "数据已删除",
						during: 2500
					});
				}else
					uni.showToast({
						icon: 'none',
						title: "数据删除失败",
						during: 2500
					});
				callback(ret)					
			})
		}
		
		doGet(request){
			//console.log("get page=>",this.page)
			var fun_get = toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						//数据直接放在了页面中
						that.model=Object.assign({},rsp.data)
						resolve(true)
					}else
						that.fail()
				})
			})
			
			var fun_test=toAsync(this.page,function(that,resolve,reject){
				//这里使用的that都是page				

					var data= {
						"name": "达到达到",
						"created_at": "2021-01-23T19:48:24Z",
						"updated_at": "2021-01-27T09:15:48Z",
						"floor": 4,
						"begin": "20:56:00",
						"building": "30bf82a04bc405fdff66bc9f6d18f0e0",
						"state": 1,
						"mac": null,
						"id": "da68fb7eb1779cd5808cc36b15352d5e",
						"end": "21:56:00",
						"image": "https://miao-share.oss-cn-shenzhen.aliyuncs.com/reservation/b5634f6a23a76ddd1c90786723131bb2.png",
						"check":true,
						"switch":true,
						"rich":"i'm rich"
						}
						//数据直接放在了页面中
						that.model=Object.assign({},data)
						resolve(true)
				
			})
			
			
			if(TEST_FORM)
				orderCall(fun_test)
			else
				orderCall(fun_get).then(ret=>{
					console.log("ret=>",ret)
					//只处理获取数据失败的情况
					if(!ret)
						uni.showToast({
							icon: 'none',
							title: "数据拉取失败",
							during: 2500
						});
			})
		}

		getGet(request){
			//console.log("get page=>",this.page)
			var fun_get = toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						//数据直接放在了页面中
						that.model=Object.assign({},rsp.data)
						resolve(true)
					}else
						that.fail()
				})
			})
			
			var fun_test=toAsync(this.page,function(that,resolve,reject){
				//这里使用的that都是page				

					var data= {
						"name": "达到达到",
						"created_at": "2021-01-23T19:48:24Z",
						"updated_at": "2021-01-27T09:15:48Z",
						"floor": 4,
						"begin": "20:56:00",
						"building": "30bf82a04bc405fdff66bc9f6d18f0e0",
						"state": 1,
						"mac": null,
						"id": "da68fb7eb1779cd5808cc36b15352d5e",
						"end": "21:56:00",
						"image": "https://miao-share.oss-cn-shenzhen.aliyuncs.com/reservation/b5634f6a23a76ddd1c90786723131bb2.png",
						"check":true,
						"switch":true,
						"rich":"i'm rich"
						}
						//数据直接放在了页面中
						that.model=Object.assign({},data)
						resolve(true)
				
			})
			
			
			if(TEST_FORM)
				return fun_test
			else
				return fun_get
				
		}

		getOption(request,optionName){
			return toAsync(this,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						that.options[optionName] = rsp.data.name_list.map(item=>{
							return {
								label:item.label,
								value:item.key
							}
						})
						resolve(true)
					}else
						that.fail()
				})
			})
		}
	}
	
		var jsonForm={
				"items": [
					{
						"name": "building",
						"label": "建筑ID",
						"extTable": "buildings",
						"extCol": "building_id",
						"required": true,
						"page": 2,
						"type": "extKey",
						"placeholder": "请选择建筑ID",
						"message": "",
						"min": 32,
						"max": 32
					},
					// {
					// 	"name": "check",
					// 	"label": "建筑ID",
					// 	"extTable": "buildings",
					// 	"extCol": "building_id",
					// 	"required": true,
					// 	"page": 2,
					// 	"type": "check",
					// 	"placeholder": "请选择建筑ID",
					// 	"message": "",
					// 	"min": 32,
					// 	"max": 32
					// },
					{
						"name": "rich",
						"label": "富文本",
						"required": true,
						"page": 3,
						"type": "rich",
						"placeholder": "请编辑建筑历史",
						"message": "",
						"min": 32,
						"max": 32
					},
					// {
					// 	"name": "unkown",
					// 	"label": "unkown",
					// 	"required": true,
					// 	"page": 3,
					// 	"type": "unkown",
					// 	"placeholder": "请选择建筑",
					// 	"message": "",
					// 	"min": 32,
					// 	"max": 32
					// },
					// {
					// 	"name": "date",
					// 	"label": "建筑时间",
					// 	"required": true,
					// 	"page": 2,
					// 	"type": "date",
					// 	"placeholder": "建筑建筑时间",
					// 	"message": "",
					// 	"min": 32,
					// 	"max": 32
					// },
					{
						"name": "hellow",
						"label": "建筑时间",
						"required": true,
						"page": 1,
						"type": "text",
						"placeholder": "建筑建筑时间",
						"message": "",
						"min": 1,
						"max": 32
					},
					// {
					// 	"name": "switch",
					// 	"label": "建筑ID",
					// 	"extTable": "buildings",
					// 	"extCol": "building_id",
					// 	"required": true,
					// 	"page": 2,
					// 	"type": "switch",
					// 	"placeholder": "请选择建筑ID",
					// 	"message": "",
					// 	"min": 32,
					// 	"max": 32
					// },
					{
						"name": "name",
						"type": "text",
						"label": "区域名称",
						"required": true,
						"page": 0,
						"chinese": false,
						"placeholder": "请输入区域名称",
						"message": "",
						"min": 1,
						"max": 16
					},
					{
						"name": "floor",
						"label": "建筑楼层",
						"required": true,
						"page": 2,
						"type": "int",
						"placeholder": "请选择建筑楼层",
						"message": "",
						"show": false,
						"min": 0,
						"max": 9999
					},
					// {
					// 	"name": "begin",
					// 	"label": "开始时间",
					// 	"required": true,
					// 	"page": 2,
					// 	"type": "time",
					// 	"placeholder": "请选择开始时间",
					// 	"message": "",
					// 	"show": false
					// },
					// {
					// 	"name": "end",
					// 	"label": "结束时间",
					// 	"required": true,
					// 	"page": 3,
					// 	"type": "time",
					// 	"placeholder": "请选择结束时间",
					// 	"message": "",
					// 	"show": false
					// },
					// {
					// 	"name": "image",
					// 	"label": "区域图",
					// 	"required": true,
					// 	"page": 2,
					// 	"type": "upload",
					// 	"placeholder": "",
					// 	"message": "",
					// 	"min": 10,
					// 	"max": 255,
					// 	"size": 2097152,
					// 	"filelist": []
					// },
					{
						"name": "state",
						"label": "状态",
						"set": "0:关闭-1:正常",
						"isInt": true,
						"required": true,
						"page": 2,
						"type": "enum",
						"current": 1,
						"placeholder": "请选择状态",
						"message": "状态选择范围是 关闭,正常",
						"list": [
							{
								"value": 0,
								"label": "关闭"
							},
							{
								"value": 1,
								"label": "正常"
							}
						]
					},
					{
						"name": "mac",
						"type": "text",
						"label": "MAC地址",
						"required": false,
						"page": 2,
						"chinese": false,
						"placeholder": "请输入MAC地址",
						"message": "",
						"min": 0,
						"max": 17
					}
				],
				"default": {
					"building": null,
					"name": "",
					"floor": 0,
					"begin": "12:36:41.113",
					"end": "12:36:41.119",
					"image": "",
					"state": 1,
					"mac": ""
				}
			}
	
	
	
export function fectchRemoteForm(name,id){
	console.log("fectchRemoteForm====>",name,id)
	g_formDrivers[name].fectchRemoteData(id)
}
	
export function submitForm(name,model){
	g_formDrivers[name].submit(model)
}

export function releaseForm(name){
	g_formDrivers[name]=null
}
		
export function assignForm(name,page){
	//console.log("assignForm=>",name,page)
//	g_formDrivers[name].page=page
	//page.$set(page.model,"name","LLL")
//	page.$forceUpdate()
}			