
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
	reloadToast
} from '@/common/util.js';

import {
	checkLogin,
	loginTo,
	getUserId,
	goto,
	naviTo,
	closeTo
} from '@/common/route.js';

var TEST_LIST=false

/**
 * 自动List驱动器，可以完成add、get、update、del
 */
var g_ListDrivers={}
export class ListDriver{
		constructor(name,page) {
			this.name=name
		    this.page=page//这个保存发起请求的page
			this.event_id="new-item-created"
			
			//将定制化的设置加入页面
			this.setCustomOptions()
			
			g_ListDrivers={}

			if(name in g_ListDrivers){
				//释放老的实例
				g_ListDrivers[name]=null
			}else{
				//否则注册一个监听器，等待formdriver发来的消息，如果名字匹配就更新。是每个实例都注册了
				uni.$on("req-update-list",(name)=>{
					if(this.name==name)
						this.fectchRemoteDataAgain()
				})
			}
			
			g_ListDrivers[name]=this
			

		}
		
		/**
		 * @param {Object} listQuery
		 * 使用上次的listQuery来查询一次
		 */
		fectchRemoteDataAgain(){
			if(!isEmpty(this.listQuery)){
				//拉取数据
				this.fectchRemoteData(this.listQuery)
			}
		}
		
		/**
		 * 拉取服务器数据
		 * @param {Object} id
		 */
		fectchRemoteData(listQuery){
			if(!isEmpty(listQuery)){
				this.listQuery=Object.assign({},listQuery)
				//拉取数据
				//this.doGetList()
			}
		}
		
		/**分别是add，update，delete，需要被子类重载
		 * @param {Object} model
		 */
		add(){
			console.log("override me=>add")
		}
		update(id){
			console.log("override me=>update")
		}
		del(id){
			console.log("override me=>del")
		}
		




		newGuid() {
			let s4 = function() {
				return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
			}
			return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
		}

		setCustomOptions(){
			//本地保存一份
			this.columns=this.getColumns()
			
			this.page.options=this.getOptions()
			// this.page.columns=this.getColumns()
		}	


		
		getOptions(){
			return {}
		}
		
		getColumns(){
			return []
		}
		
		/**
		 * 跳转到其它编辑页面
		 */
		doAdd(name,url="/pages/edit/forms"){
			naviTo(url,{"name":name})
		}
		
		/**
		 * 跳转到其它编辑页面
		 */
		doUpdate(id,name,url="/pages/edit/forms"){
			naviTo(url,{id:id,"name":name})
		}
		
		/**
		 * @param {Object} request
		 * 传入定制的request，完成数据删除的请求后并显示结果，并且回调让用户定制额外操作
		 */
		doDel(request,callback){
			var event_id=this.event_id
			var fun_del = toAsync(this.page,function(that,resolve,reject){
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
					uni.showToast({
						icon: 'success',
						title: "数据已删除",
						during: 2500
					});
					
					if(typeof callback =="function"){
						callback()
					}
				}	
				else
					uni.showToast({
						icon: 'none',
						title: "数据删除失败",
						during: 2500
					});
			})
		}
		
			
		doGetList(request){
			var fun_getList=this.getList(request)
			return orderCall(fun_getList)
		}
		
		getOption(request,optionName){
			return toAsync(this.page,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						//console.log("getOption",rsp.data.name_list)
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
		
		getList(request){
			var driver=this
			return toAsync(this.page,function(that,resolve,reject){
				//这里使用的that都是page				
				request.then(rsp=>{
					if(0==rsp.code){
						that.columns=driver.translate2Columns(rsp.data.headers)
						that.columns.push(driver.getActionColumn())
						that.rows=rsp.data.rows.map(item=>{
							return item
						})
						that.pageSize=rsp.data.pageSize
						that.total=rsp.data.total
						that.forceUpdate()//强制更新，其实没有props都可以了
						resolve(true)
					}else
						that.fail(rsp.message)
				})
			})
		}
		
		getActionColumn(){
			return{
					type:"action",
					name:"action",//将key换个名字
					title: "操作",
					width: 120,
					format: {
						template: "",
						names: ["id"]
					},
					listenerClick: false
			}
		}
		
		translate2Columns(headers){
			return this.mergeColumes(headers.map(item=>{
				if(item.key.indexOf("image")>=0){
					return {
							type:"image",
							name:item.key,//将key换个名字
							title: "图片",
							width: 200,
							format: {
								template: "<img src='#image#' style='width: 100%;height:100%; margin-right: 5px;margin-right: 1px; border-radius: 10%;vertical-align: middle;'/>",
								names: [item.key]
							},
							listenerClick: true
					}
				}else if("id"==item.key){
					return {
						type:"id",
						name:item.key,//将key换个名字
						key:item.key,
						title:item.label,
						hidden:true,
						//listenerClick: true
					}
				}else if("created_at" ==item.key||"updated_at"==item.key){
						//item.created_at=moment(item.created_at).format('YYYY-MM-DD HH:mm')
						return {
							type:"date",
							name:item.key,//将key换个名字
							key:item.key,
							title:item.label,
							sort: true,
							listenerClick: true,
							width:280
						}
				}else if("begin" ==item.key||"end"==item.key){
						return {
							type:"time",
							name:item.key,//将key换个名字
							key:item.key,
							title:item.label,
							sort: true,
							listenerClick: true,
							width:180
						}
				}else if("state" ==item.key){
						return {
							type:"state",
							name:item.key,//将key换个名字
							key:item.key,
							title:item.label,
							sort: true,
							listenerClick: true,
							width:280
						}
				}else
					return {
						type:"text",
						name:item.key,//将key换个名字						
						key:item.key,
						sort: true,
						title:item.label,
						listenerClick: true
					}

			}),this.columns)
		}
		
		mergeColumes(remote,local){
			remote.forEach(item=>{
				var it=local.find(it=>{return !isEmpty(item.key)&&it.key==item.key})
				if(!isEmpty(it)){
					for(var field in it){
						if("key"!=field)
							item[field]=it[field]
					}
					if("format" in it){
						delete(item["key"])//z-table的要求
					}
				}
			})
			return remote
		}
		
		releaseList(){
			g_ListDrivers[this.name]=null
		}
		
	}
	
	
	
	
export function fectchRemoteList(name,listQuery){
	console.log("fectchRemoteList=>",name,listQuery)
	g_ListDrivers[name].fectchRemoteData(listQuery)
}
	

export function releaseList(name){
	g_ListDrivers[name]=null
}
		
