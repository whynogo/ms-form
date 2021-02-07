<template>
	<view class="admin-wapper" :style="'height:'+screenHeight+'px'">
		<hx-navbar ref="hxnb" :width="300" :config="naviConfig" @clickBtn="onNaviClick" />
		<!-- 这里必须是v-show否则不刷新 -->
		<mix-tree
			class="left-menu" style="margin-top: 8px;" v-show="showMenu()" 
			:list="treeData" 
			@treeItemClick="treeItemClick"
		></mix-tree>
		<cus-swiper :list="imageList" :title="true" duration="2000" interval="10000" :height="screenHeight" :style="'height:'+screenHeight+'px'"></cus-swiper>
		<!-- <u-image class="cover-image" v-if="showImage()" :style="'height:'+screenHeight+'px'":src="coverImage" mode="aspectFill" :fade="true" duration="450"></u-image> -->
	</view>

</template>


<script>
	import cusSwiper from '@/components/cus-swiper.vue'
	import mixTree from '@/components/mix-tree/mix-tree';

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
		getElementRect
	} from '@/common/util.js';
	import {
		isLogin
	} from "@/common/route.js"
	import {
		getLeftMenu
	} from "@/api/sys.js"

	var that;
	export default {
		components: {
			mixTree,
			cusSwiper
		},
		data() {
			return {
				defaultProps: () => {
					return {
						label: 'label',
						children: 'children',
						// icon: 'img', // 可以这样写
						icon(data, node) { // 也可以用函数动态配置
							return data.img;
						}
					}
				},
				imageList: [{
						image: "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/default-cover.jpeg",
						title: '同一代码可同时运行在微信和PC上'
					},
					{
						image: "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/default-cover.jpeg",
						title: '前端的CURD代码框架完成了90%'
					},
					{
						image: "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/default-cover.jpeg",
						title: '后端的CURD代码根据数据库设计自动生成'
					}
				],
				coverImage: "https://miao-share.oss-cn-shenzhen.aliyuncs.com/sys_images/default-cover.jpeg",
				screenHeight: 200,
				naviConfig: {
					back: false,
					backPage: "",
					title: '',
					color: '#ffffff',
					//背景颜色;参数一：透明度（0-1）;参数二：背景颜色（array则为线性渐变，string为单色背景）
					backgroundColor: [1, "#3584F7"],
					statusBarBackground: ['', '#ffffff'],
					rightButton: [],


				},
				treeData: [],
				expandItems: [],
				askShowImage: true,
				imageHeight:200
			}
		},

		created(e) {
			that = this
			uni.$on('updateLeftMenu', (page) => {
				that.askShowImage = !("pages/edit/lists" == page || "pages/edit/forms" == page)
				console.log("updateLeftMenu received=>", page, that.askShowImage)
				this.getImageHeight()
				that.$forceUpdate()
			})

			this.screenHeight = uni.getSystemInfoSync().windowHeight




			this.fetchRemoteData()
		},
		onReady() {

		},
		onLoad() {
			console.log("onload")

		},
		mounted() {
			uni.$emit("left-window-show")
			console.log("mounted")

			// this.getPageSize("admin-wapper").then(size=>{
			//   this.imageHeight=size.height	   
			// })
		},
		methods: {
			getImageHeight(){
				this.imageHeight=this.screenHeight
			},
			getPageSize(selecter) {
				// 获取元素信息
				return toAsync(this,function(that,resolve,reject){
					uni.createSelectorQuery().in(that).select(selecter).boundingClientRect(function(res) { //data - 各种参数
								if(null!=res)
									resolve(res)
								else
									reject({})
							})
							.exec()
				})
			},
			showCurrentPage() {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				if (pages.length > 0) {
					let nowPage = pages[pages.length - 1]; //当前页页面实例
					return "showLeftMenu" in nowPage
				}
				return false
			},
			showImage() {
				this.screenHeight = uni.getSystemInfoSync().windowHeight + 44
				return !this.showMenu()
			},
			showMenu() {
				this.screenHeight = uni.getSystemInfoSync().windowHeight + 44
				return isLogin() && this.treeData.length > 0 && !this.askShowImage
			},
			load() {
				this.screenHeight = uni.getSystemInfoSync().windowHeight + 44
				this.fetchRemoteData()
			},
			//uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			treeItemClick(obj) {
				uni.$emit("update-table", obj)
				// /console.log('handleNodeClick', JSON.stringify(obj));
			},

			fetchRemoteData() {
				//下载depart内容
				var fun_getLeftMenu = toAsync(this, function(that, resolve, reject) {
					getLeftMenu({
						user_id: "getUserId()"
					}).then(rsp => {
						if (0 == rsp.code) {
							that.treeData = that.$u.deepClone(rsp.data.menus);
							that.$forceUpdate()
							resolve(true)
						} else
							that.fail("菜单没有成功加载")

					})
				})

				console.log('fetchRemoteData');
				orderCall(fun_getLeftMenu)
			}
		}
	}
</script>

<style>
	.admin-wapper {
		width: 300px;
		background-color: #ECF5FF;
	}

	.cover-image {
		height: 100%;
	}
</style>
