<template>

		<cus-table
		ref="formTable" 
		:cols="columns" 
		:options="options" 
		:rows="rows" 
		:formatters="formatters" 
		:sortCol="sortCol"
		:url-col="urlCol"
		:total="total"
		:pageSize="listQuery.page_size"
		@onCellClick="onCellClick"
		@onCheck="onItemSelect"
		@pageSelected="onPageSelect"
		@doSort="doSort"
		@action="takeAction"
		 />
<!-- 		 <u-action-sheet :list="actionList" @click="takeAction" @close="closeAction" v-model="showAction"></u-action-sheet> -->


</template>
<script>
	import {fectchRemoteList,releaseList} from "@/common/list-driver.js"
	import {AreaList} from "./drivers/list-area.js"
	import {BuildingList} from "./drivers/list-building.js"
	import {MenuList} from "./drivers/list-menu.js"	
	import {SeatList} from "./drivers/list-seat.js"		
	import cusTable from '@/components/cus-table/cus-table.vue'
	import {getArea,getBuildingNames} from '@/api/seat.js'
	import {
		isEmpty,
		convertUTCTimeToLocalTime,
		orderCall,
		confirmDo,
		toAsync,
		today,
		compareDate,
		delayToast,
		reloadToast,
		postPageChanged
	} from '@/common/util.js';
	
	
	export default {
	    components: {
	        cusTable,

	    },
		methods:{
			createListByName(name){
				switch(name){
					case "area":return new AreaList(name,this)
					case "building":return new BuildingList(name,this)
					case "menu":return new MenuList(name,this)
					case "seat":return new SeatList(name,this)											
					default:
						uni.showToast({
							"icon":'none',
							title:"暂时没有配置这种table=>"+name
						})
						throw Error("没有配置这种form"+name)
				}
			},
			onCellClick(item){
				console.log(item)	
				this.showAction=true
			},
			onItemSelect(e){
				console.log("list select",e)
				var items=e	
				this.itemSelected=items.map(item=>{
					return item
				})
			},
			onPageSelect(pageNo){
				console.log("onPageSelect",pageNo,this)
				this.listQuery.page_index=pageNo
				fectchRemoteList(this.list.name,this.listQuery)	
			},
			doSort(res){
				console.log("doSort",res)
				//默认将排序放在第一个，用户可以本地放置其它sorter
				this.listQuery.sorter[0]={fn:res.key,order:"desc"==res.type?"-":"+"}
				fectchRemoteList(this.list.name,this.listQuery)		
			},
			closeAction(){
			},	
			takeAction(e){
				console.log("action",e,this.itemSelected)
				//要去的form的名字都在个子的driver里定义的
				switch(e){
					case "add":this.list.add();break;
					case "update":this.list.update(this.itemSelected[0]);break;
					case "del":{
							confirmDo("确定要删除吗?", f => {
								this.list.del(this.itemSelected);
							})
							break;
					}
				}

			},

			forceUpdate(){
				//小程序下无法通过props传入更新后的值，只能这样强行传入
				//小程序下要复制rows，headers，options，formatters，sortCol
				//所以这里传this进去
				// //#ifdef MP-WEIXIN
				// 	this.$refs.formTable.forceUpdate(this)
				// //#endif	
				this.$refs.formTable.forceUpdate(this)
			},
			openTable(name){
				if(isEmpty(name))
					uni.showToast({
						"icon":'none',
						title:"需要指定表格的名字"
					})
				else{
					this.list=this.createListByName(name)
					fectchRemoteList(this.list.name,this.listQuery)
				}
			}
		},
		props:{

		},
		watch:{
			
		},
		created(){
			this.showLeftMenu=true
		},
		onLoad(option){
			//this.id=option.id
			//默认打开area，用户在浏览器刷新的时候可以防止空白
			if(!isEmpty(option.name))
				this.openTable(option.name)
			else
				this.openTable("area")
				
				
			//发给左窗口的消息一定要nexttick，因为leftwindow初始化晚些		 
			this.$nextTick(function(){
				postPageChanged()			
			})
			
			//不能移动到onReady，会出错
			uni.$on("update-table",item=>{
				console.log("ask for open table=>",item)
				this.$nextTick(function(){
					this.openTable(item.name)					
				})

			})
		},
		onUnload(){
			uni.$off("update-table")
		},
		onReady(){
			this.$refs.formTable.calHeight()
		},	
		created(){
		},
		beforeDestroy(){
			//释放form对象，formDriver中和本地的
			if(null!=this.list)
				this.list.releaseList()
			this.list=null
			
			clearInterval(this.timer)	
		},
	    data() {
	        return {
				update:0,
				timer:null,
				timerCount:0,
				isTimerRuning:false,
				list:null,
				listQuery: {
						page_index: 1,
						page_size: 10,
						filters: [
						],
						sorter: [{
							fn: '',
							order: '-'
						}]
				},
				total:0,
				curPage:0,
				itemSelected:[],
				options:{
				},
				formatters:{
				},
	            headers: [
				], 
				columns:[],
				rows:[],
	            urlCol: [],
				sortCol:[{
				    key: 'name',    // 所在列的key值（表头的key）
				    isNumber: false // 该列数据是不是数字或者日期，日期例子：(2020-09-04 08:00) (2020/06/04) (08:00:06)
				}, {
				    key: 'age',
				    isNumber: false
				}],
				actionList: [{
					key:"add",
					text: '添加',
					color: 'blue',
					fontSize: 28,
					disabled:false
				},{
					"key":"update",
					text: '编辑',
					color: 'blue',
					fontSize: 28,
					disabled:false
				},{
					"key":"del",
					text: '删除',
					color: 'red',
					fontSize: 28,
					disabled:false				
				}],
				showAction: false,
		
			current: 0
	        }
	    }
	}
</script>

<style>
</style>
