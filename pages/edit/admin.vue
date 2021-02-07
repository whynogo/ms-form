<template>
	<view class="admin-wapper"  :style="'height:'+screenHeight+'px'">
		<hx-navbar ref="hxnb"  :config="naviConfig" @clickBtn="onNaviClick" />
		<mix-tree
			:list="treeData" 
			@treeItemClick="treeItemClick"
		></mix-tree>
	</view>
</template>

<script>
	import {getLeftMenu} from"@/api/sys.js"
	import {
		isEmpty,
		convertUTCTimeToLocalTime,
		orderCall,
		confirmDo,
		toAsync,
		today,
		compareDate,
		delayToast,
		reloadToast
	} from '@/common/util.js';
	import {isLogin,loginTo,naviTo} from "@/common/route.js"
	import mixTree from '@/components/mix-tree/mix-tree';
	export default {
		components: {
			mixTree
		},
		data() {
			return {
				defaultProps:() => {
					return {
						label: 'label',
						children: 'children',
						// icon: 'img', // 可以这样写
						icon(data, node) { // 也可以用函数动态配置
							return data.img;
						}
					}
				},
				
				coverImage:"https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/default-cover.jpeg",
				screenHeight:200,
				naviConfig: {
						back: true,
						backPage: "/pages/news/index",
						title: '',
						color: '#ffffff',
						//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
						backgroundColor: [1, "#3584F7"],
						statusBarBackground: ['', '#ffffff'],
						rightButton: [],
					
				  
				},
				treeData: [],
				expandItems:[]
			};
		},
		onLoad(){
			this.screenHeight=uni.getSystemInfoSync().windowHeight
			this.fetchRemoteData()
			
			uni.$on("left-window-show",()=>{
				console.log("left-window-show")
				this.fetchRemoteData()
			})
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		methods: {
			showImage(){
				this.screenHeight=uni.getSystemInfoSync().windowHeight+44
				return !isLogin()||0==this.treeData.length
			},
			showMenu(){
				this.screenHeight=uni.getSystemInfoSync().windowHeight+44
				return isLogin()&&this.treeData.length>0
			},
			load(){
				this.screenHeight=uni.getSystemInfoSync().windowHeight+44
				this.fetchRemoteData()
			},	
			//uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			treeItemClick(obj) {
				naviTo("/pages/edit/lists", {name:obj.name})
			},

			fetchRemoteData(){
				//下载depart内容
				var fun_getLeftMenu = toAsync(this,function(that,resolve,reject){
					getLeftMenu({user_id:"getUserId()"}).then(rsp=>{
						if(0==rsp.code){
							that.treeData = that.$u.deepClone(rsp.data.menus);
							if(rsp.data.menus.length>0)
								that.expandItems.push(rsp.data.menus[0].id)
							resolve(true)
						}else
							that.fail("菜单没有成功加载")
					
					})
				})
				
				console.log('fetchRemoteData');
				orderCall(fun_getLeftMenu)
			}
			
		}
	};
</script>
<style>
	.admin-wapper{
		/* width:300px; */
		background-color: #ECF5FF;
	}
	.cover-image{
		height:100%;
	}
</style>