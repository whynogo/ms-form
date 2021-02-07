<template>
	<view class="page">
		<picker mode="multiSelector" @cancel="onCancel" @change="onChanged"  @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray" style="margin-bottom: 00rpx;">
			<view class="uni-input">{{value}}</view>
		</picker>
	</view>
</template>
<script>
	import {
	  getDepartBranch
	} from '@/api/depart.js';
	import {
	  isEmpty
	} from '@/common/util.js';
export default {
	model: {
	      prop: 'clazz',//指向props的参数名
	      event: 'change'//事件名称
	},
	props:{
	  depart:''
	},
	data() {
		return {
			listQuery:[{
							page_index: 1,
							page_size: 50,
							filters: [
							  { fn: 'parent', fv: '' }
							],
							sorter: [
							  { fn: '', order: '-' }
							]
						  },
						  {
							page_index: 1,
							page_size: 50,
							filters: [
							  { fn: 'parent', fv: '' }
							],
							sorter: [
							  { fn: '', order: '-' }
							]
						  },
						  {
							page_index: 1,
							page_size: 50,
							filters: [
							  { fn: 'parent', fv: '' }
							],
							sorter: [
							  { fn: '', order: '-' }
							]
						  }
			],
			// multiArray 为初始化数据，不管以后用户是否已有数据，再进行初始化，都以该初始化数据为准，这样逻辑实现才会更清晰
			// 默认让服务端提供 第1列的数据，然后根据第1列数据的第1条数据，再次请求第2列、第3列的数据列表
			multiArray: [
				['---'],
				['---'],
				['---']
			],
			multiIndex: [0, 0, 0],
			multiData: [[],[],[]],
			initValue:null,
			value:'',
			departValue:''
		}
	},
	created(options){
		this.init()
	},
	watch:{
		 depart:function(newVal,oldVal){
			 console.log("Y->",newVal,oldVal);
			 this.init()	
		 }
	},
	methods: {
		init(){
			//这个为了防止为空的时候加载数据
			if(isEmpty(this.depart))return
			
			this.loadFromTopLevel(this.depart)
			//必须保留，否则值无法传出
			this.onChanged()
		},
		loadFromTopLevel(id){
			console.log("top level 0-->",id)
			this.listQuery[0].filters[0].fv=id
			getDepartBranch(this.listQuery[0]).then(rsp=>{
				if(0==rsp.code){
					//console.log("level 0-->",rsp.data)
					var id0=this.loadArray(0,rsp.data.rows)	
					if(rsp.data.numRows>0)
						this.loadFromLevel1(id0)	
				}
				
			})
		},
		loadFromLevel1(id){
			this.listQuery[1].filters[0].fv=id
			getDepartBranch(this.listQuery[1]).then(rsp=>{
				if(0==rsp.code){
					//console.log("level 1-->",rsp.data)
					var id1=this.loadArray(1,rsp.data.rows)	

					this.loadFromLevel2(id1)	
				}
			})
		},
		loadFromLevel2(id){
			this.listQuery[2].filters[0].fv=id
			getDepartBranch(this.listQuery[2]).then(rsp=>{
				if(0==rsp.code){
					//console.log("level 2-->",rsp.data)
					var id2=this.loadArray(2,rsp.data.rows)	
				}
			})
		},
		loadArray(index,rows){
			var id=null
			//缓存清空后保存新的
			this.multiData[index].length=0
			this.multiArray[index].length=0
			rows.forEach(item=>{
				//console.log(item.alias)
				if(null==id)id=item.id//取第一个id
				this.multiArray[index].push(item.alias)
				this.multiData[index].push(item)
			})
			this.value=this.output()
			if(null==this.initValue&&this.value.indexOf("---")<0){
				this.initValue=this.value
				this.onChanged()
			}
			// console.log("-------->multiArray",this.multiArray)
			// console.log("-------->multiData",this.multiData)
			// console.log("-------->listQuery",this.listQuery)
			 return id
		},
		bindMultiPickerColumnChange: function(e) {
			//console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value,e)
			this.multiIndex[e.detail.column] = e.detail.value;
			if (e.detail.column == 0) {	//拖动第1列
				this.loadFromLevel1(this.multiData[e.detail.column][e.detail.value].id)
			}else if (e.detail.column == 1){	//拖动第2列
				this.loadFromLevel2(this.multiData[e.detail.column][e.detail.value].id)
			}
			this.value=this.output()
			// 有时候你会碰到数据已经更新了但是组件还是没有刷新，这个时候需要调用$forceUpdate()强制刷新
			this.$forceUpdate();
		},
		 onChanged(){
			// var clazz=JSON.stringify(this.multiIndex)
			var clazz=this.output()
			this.value=this.output()
			console.log('---onChanged----',clazz)
			
			// #ifndef MP-WEIXIN
			this.$emit('change',clazz);
			// #endif
			// #ifdef MP-WEIXIN
			this.$emit('input',clazz);
			// #endif
		 },
		 onCancel(){
			 this.value=this.initValue
		 },
		 output(){
			let ma=this.multiArray
			let mi=this.multiIndex
			if(ma[0].length>0)
				return ma[0][mi[0]]+','+ma[1][mi[1]]+ma[2][mi[2]]
			else{
				ma[1].length=0
				ma[2].length=0
				return "无所属单位"
			}
		 }
	}
}
</script>