import {today} from "@/common/util.js"
import {WifiScaner} from '@/common/wx-commands.js'

class TabListStore {
	constructor() {
		//super()
		this.listQuery = [
			{
				page_index: 1,
				page_size: 8,
				filters: [{
					fn: 'date',
					fv: today()
				}],
				sorter: [{
					fn: 'created_at',
					order: '-'
				}],
				status: "loadmore"
			},
			{
				page_index: 1,
				page_size: 8,
				filters: [{
					fn: 'state',
					fv: null
				}],
				sorter: [{
					fn: 'created_at',
					order: '-'
				}],
				status: "loadmore"
			},
			{
				page_index: 1,
				page_size: 8,
				filters: [{
					fn: 'state',
					op: "in",
					fv: "3,4,5"
				}],
				sorter: [{
					fn: 'created_at',
					order: '-'
				}],
				status: "loadmore"
			},
		]
		this.queryResult = [{
				status: "loadmore",
				dataList: []
			},
			{
				status: "loadmore",
				dataList: []
			},
			{
				status: "loadmore",
				dataList: []
			}
		]
		
		this.isEmptyList=(pageNo)=>{
			return 0==this.queryResult[pageNo].dataList.length
		}
		this.itemDataLength=(pageNo)=>{
			return this.queryResult[pageNo].dataList.length
		}
		this.getItemDataList=(pageNo)=>{
			return this.queryResult[pageNo].dataList
		}
		this.getItemStatus=(pageNo)=>{
			return this.queryResult[pageNo].status
		}
		this.setItemStatusLoading=(pageNo)=>{
			return this.queryResult[pageNo].status="loading"
		}
		this.setItemStatusNoMore=(pageNo)=>{
			return this.queryResult[pageNo].status="nomore"
		}
		this.setItemStatusLoadMore=(pageNo)=>{
			return this.queryResult[pageNo].status="loadmore"
		}

		this.getItemName=(pageNo,itemNo)=>{
			var ret="text"
			// if(1==pageNo )
			// 	ret="text"
			// else
			// 	ret="newsItem"
			ret="record"
		//	console.log("getItemName pageNo=>",pageNo,itemNo,ret)
			return ret	
		}

		this.resetQuery=(pageNo)=>{
			this.queryResult[pageNo].dataList.length=0
			this.queryResult[pageNo].status="loadmore"
			this.listQuery[pageNo].page_index=1
		}
		
		this.getQueryPageIndex=(pageNo)=>{
			return this.listQuery[pageNo].page_index
		}
		
		
		this.addData=(that,pageNo,moreDataList,total,newPageIndex)=>{
			//如果有新数据
			if(moreDataList.length>0){
				//加入对应的数据列
				this.queryResult[pageNo].dataList=this.queryResult[pageNo].dataList.concat(moreDataList)
				//更新下次请求用的pageIndex
				this.queryResult[pageNo].page_index=newPageIndex
				//强制刷新tablist
				that.$nextTick (() => {
					that.show=!this.show//tablist要加一个:key="show"
					console.log("show again=>")
				});
			}
			//根据新的列表判断是否还有新数据
			this.queryResult[pageNo].status=(total==this.itemDataLength(pageNo))?"nomore":"more"	
		}
		
	}



}

class WifiStore {
	constructor() {
		this.wifi=new WifiScaner()
		this.wifiScaner=()=>{
			return this.wifi
		}
	}
	
}

/**
 * 以上是app定义
 */
class Dva {
	constructor() {
	    this.recordList=new TabListStore()
		this.wifiStore=new WifiStore()
	}
	
	tablist(name,pageNo){
		return this[name].queryResult[pageNo].dataList
	}
	
	wifi(){
		return this.wifiStore.wifiScaner()
	}
	
	
	getQueryPageIndex(store,pageNo){
		return this[store].listQuery[pageNo].page_index
	}
}

const dva=new Dva()
module.exports = {
	dva
}
