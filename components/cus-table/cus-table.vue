<template>
	<view class="warpper" >
		<z-table
		 ref="table"
		:key="update"
		:tableData='tableData' 
		:columns='columns'
		:options="optionData"
		:showLoading="true" 
		stickSide 
		emptyText='没有数据' 
		:tableHeight='tableHeight' 
		showSelect 
		@onClick='rowClick' 
		@onSelect='itemSelect' 
		@onSort='doSort' 
		@tableClick="onTableClick"
		@tableLongpress="onTableLongPress"
		@showAction="onShowAction"
		@message="alert()"
		></z-table>
						
		<cus-popup v-model="showPaging" mode="bottom" :mask="false" @click="showPaging=false">
			<paging  class="paging" :total="itemTotal" :pageSize='itemPageSize' v-model="curPage" @changes="onPageSelect"  ></paging>
		</cus-popup>
		<cus-popup v-model="showAction" mode="bottom" :mask="false">
			<u-button class="action"  :custom-style="customStyle" type="success"  @click="takeAction('add')">添加</u-button>
			<u-button class="action"  :custom-style="customStyle" type="warning" :disabled="1!=getItemSelectCount()" @click="takeAction('update')">编辑</u-button>
			<u-button class="action"  :custom-style="customStyle" type="error" :disabled="0==getItemSelectCount()" @click="takeAction('del')">删除</u-button>
		</cus-popup>
	</view>
</template>
<script>
	import zTable from "@/components/z-table/z-table.vue";
	import paging from '@/components/yang-paging/yang-paging.vue'
	import cusPopup from "@/components/cus-popup.vue"
	import moment from 'dayjs'
	import {EventHandler} from "@/common/event-handler.js"


	export default {
	    components: {
			 paging,
			 zTable,
			 cusPopup
	    },
		mounted() {
			this.calHeight()	
		},
		computed: {

		},
		methods:{
			//优先级是check>row>table>sort
			onShowAction(){
				console.log("onShowAction")
				this.showAction=true		
			},
			onTableLongPress(){
				//PC模式下收不到
				console.log("onTableLongPress")
				this.showAction=true
			},	
			rowClick(item,col) {
				//console.log("rowClick")
				
				if(this.eventHandler.input(20)){
					if(col.type=="image"){
						uni.previewImage({
							current:0,    //  传 Number H5端出现不兼容 
							urls: [item[col.name]]
						})
					}else {
						uni.showToast({
							icon:"none",
							title:item[col.name]
						})
						this.showPaging=true
					}	
				}
			},
			itemSelect(selectList) {
				//console.log("itemSelect")
				if(this.eventHandler.input(10)){				
					this.itemSelectCount=selectList.length
					this.showPaging=false
					this.$emit("onCheck",selectList)
				}
			},
			onTableClick(){
				//console.log("onTableClick")
				if(this.eventHandler.input(30))				
					this.showPaging=true	
				
			},
			doSort(res) {
				if(this.eventHandler.input(40))	
					this.$emit("doSort",res)
			},
			onPageSelect(pageNo){
				//console.log(pageNo)
				this.$emit("pageSelected",pageNo)
			},
			findHeader(name){
				return this.headerCache.find(it=>{return it.key==name})
			},
			calHeight(){
				let that = this
				this.$nextTick(() => { 
					that.tableHeight =(uni.getSystemInfoSync().windowHeight)*2
						// uni.getSystemInfo({
					 //                success: (res)=> {
					 //                    let height=res.windowHeight //获取系统信息，可使用窗口的高度
					 //                    that.tableHeight=uni.upx2px(height)
						// 											console.log("height=>",that.tableHeight) // 获取元素宽度
					 //                }
					 //    });
						 uni.createSelectorQuery().in(this).select("#warpper").boundingClientRect(function(data) { //data - 各种参数
							if(null!=data){
								that.tableHeight =uni.getSystemInfoSync().windowHeight
								//that.tableWidth =""+(uni.getSystemInfoSync().windowWidth -6)+"px"
								//that.tableWidth =""+that.calWidth()+"px"
							}
						 	console.log("height=>",that.tableWidth,that.tableHeight,data) // 获取元素宽度
							
						}).exec()
				})		
			},
			calWidth(){
				var width=0
				this.headers.forEach(h=>{
					if(typeof h.width !="undefined")
						width+=h.width
					else
						width+=165 
				})
				return width
			},
			clearCheck(){
				this.$refs.table.clearCheck()
				this.$forceUpdate()
			},
			newGuid() {
				let s4 = function() {
					return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
				}
				return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
			},
			forceUpdate(page){
				this.columns=page.columns.map(item=>{
					return item
				})
				this.tableData=page.rows.map(item=>{
					return item
				})
				this.optionData=this.$u.deepClone(page.options)
				
				this.itemTotal=page.total
				this.itemPageSize=page.pageSize
				
			    this.update++
				this.$forceUpdate()
			},

			getItemSelectCount(){
				return this.itemSelectCount
			},
			takeAction(action){
				this.$emit('action',action)
				this.showAction=false
				this.$refs.table.clearCheck()
			}	
			
		},
		props:{
			total:{
				type:Number,
				default:0
			},
			pageSize:{
				type:Number,
				default:0
			},
			rows: {
				type: Array,
				default() {
					return [{
						name: '张三'
					}, {
						name: '李四'
					}]
				}
			},
			cols: {
				type: Array,
				default() {
					return []
				}
			},
			options: {
				type: Object,
				default() {
					return{}
				}
			},
		},
		watch:{
			rows:{
				immediate: true,
				handler(nVal) {
					//console.log("rows...",nVal)
					this.tableData=nVal.map(item=>{
						return item
					})
					this.$forceUpdate()
				}
			},
			cols:{
				immediate: true,
				handler(nVal) {
					//console.log("cols...",nVal)
					this.columns=nVal.map(item=>{
						return item
					})
					this.$forceUpdate()
				}
			},
			options:{
				immediate: true,
				handler(nVal) {
					//console.log("options...",nVal)
					this.optionData=this.$u.deepClone(nVal)
					this.$forceUpdate()
				}
			},
		},	
	    data() {
	        return {
				update:0,
				headerCache:[],
				rowsCache:[],
				optionCache:{},
				formatterCache:{},
				sortColCache:[],
				tableWidth:"750upx",
				tableHeight:600,
				curPage:0,
				
				
				customStyle: {
					marginTop: '3px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				},
				columns:[],
				tableData: [],
				optionData:{},
				itemTotal:0,
				itemPageSize:5,
				showPaging:false,
				showAction:false,
				itemSelectCount:0.,
				eventHandler:new EventHandler()
	        }
	    }
	}
</script>

<style>

	.warpper{
		height:100%;
		width:100%;
	}
	.paging{
		margin: 6 6 6 6;
	}
	.action{
		width:80%;
		margin:10 10 10 10;
	}
</style>
