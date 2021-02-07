<template>
	<view class="form-warpper">
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" @navibarDidBack="naviDidBack" />
		<dynamic-form ref="form"  :items="items" :options="options" :model="model" :itemId="id" :key="update" :nextPage="nextPage"/>
	</view>
</template>
<script>
	import {AreaForm} from "./drivers/form-area.js"
	import {BuildingForm} from "./drivers/form-building.js"
	import {MenuForm} from "./drivers/form-menu.js"
	import {SeatForm} from "./drivers/form-seat.js"			
	import dynamicForm from '@/components/cus-form/dynamic-form.vue'
	import {
		isEmpty,
		confirmDo,
		confirmCancel,
		reloadToast,
		postPageChanged,
	} from '@/common/util.js';
	import {naviTo} from "@/common/route.js"
	import {
		EditorDriver,
		fectchEditorContent,
		setEditorContent
	} from "@/common/editor-driver.js"
	
	
	export default {
	    components: {
	        dynamicForm ,
	    },
		methods:{
			createFormByName(name){
				switch(name){
					case "area":return new AreaForm(name,this)
					case "building":return new BuildingForm(name,this)
					case "menu":return new MenuForm(name,this)
					case "seat":return new SeatForm(name,this)										
					default:
						uni.showToast({
							"icon":'none',
							title:"暂时没有配置这种form=>"+name
						})
						throw Error("没有配置这种form"+name)
				}
			},
			naviDidBack(){
				console.log("navibarDidBack")
				//如果当前页为0，则退出，否则只是本页back一次
				//这个back由navibar和 form这两个同级组件共同完成
				if(0==this.$refs.form.getCurrentPageNo())
					uni.navigateBack({
						
					})
				else
					this.$refs.form.tryBack()
			},
			onNaviClick(item) {
				confirmDo("确定要退出编辑吗?", f => {
					reloadToast("正在退出...","/pages/news/index")
				})
			},
			forceUpdate(driver){
				//小程序下无法通过props传入更新后的值，只能这样强行传入
				console.log("driver=>",driver)
				this.$refs.form.forceUpdate(driver)
			},
			setRichContent(name,content){
				// console.log('setRichContent=>',name,content)
				// setEditorContent(name,content)
				// uni.$emit("richtext-back",name,content)
			},
		},
		onLoad(option){
			this.id=option.id
			this.name=option.name
			if(isEmpty(this.name))
				uni.showToast({
					"icon":'none',
					title:"需要指定表单的名字"
				})
			else	
				this.form=this.createFormByName(this.name)
				
			//发给左窗口的消息一定要nexttick，因为leftwindow初始化晚些
			this.$nextTick(function(){
				postPageChanged()			
			})	
		},
		onReady(){
			//必须放在onReady,否则无法拿到form
			this.$refs.form.setForm(this.form,this.id)
		},
		onShow(){
			uni.$on("update-table",item=>{
				console.log("ask for close table=>",item)
				if(item.name!=this.name)
					confirmDo("确定要退出编辑吗?", f => {
						naviTo("/pages/edit/lists")
					})
			})
		},
		onHide(){
			uni.$off("update-table")
		},
	    data() {
	        return {
				id:"",//661979c3956716fc877b6e976c809870",
				form:null,
				options:{},
				model:{},
				rules:{},
				items:[],
				nextPage:"/pages/edit/step1",
				update:'',
				naviConfig: {
					back: true,
					backPage: "",
					title: '编辑数据',
					color: '#ffffff',
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [1, ['#a9a1ff', '#6970ff']],
					// 滑动屏幕后切换颜色，注意颜色为数组时长度必须一样，还有使用滑动切换必须监听 onPageScroll 事件
					//    slideBackgroundColor: [0,['#a9a1ff','#6970ff','#ff55ff','#ff9999']],
					// 状态栏 ，数组则为滑动变色
					statusBarBackground: ['', '#ffffff'],
					rightButton: [{
						key: 'btn3',
						icon: '&#x2718;',
						position: 'left'
					}],
					customBack:true
				},
			}
	    }
	}
	

	

</script>

<style>
	
	.form-warpper{
					width: fit-content;
			box-sizing: border-box;
		position: relative;
		display: inline-block;
		height: 100%;
		min-height: 130rpx;
		width: 100%;
		background: #fff;
		border: solid 2rpx #ccc;
		font-size: 28rpx;//$uni-font-size-sm;
		box-sizing: border-box;
		transform: translateZ(0);
	}
</style>
