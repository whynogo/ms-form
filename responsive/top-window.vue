<template>
	<view class="top-window-header">
		<view class="left-header logo">
				<image src="logoImage()" mode="heightFix" style="width: 30px;"></image>
				<text>hello uni-app</text>
		</view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" ></u-tabs>
	</view>
</template>

<script>
	import { logoImage } from '@/common/logo.js'
	export default {
		data() {
			return {
				selected: {
					component: 0,
					API: 1,
					extUI: 2,
					template: 3
				},

				list: [{
									name: '待收货'
								}, {
									name: '待付款'
								}, {
									name: '待评价',
									count: 5
								}],
								
				current: 0,

			}
		},
		props: {
			matchLeftWindow: {
				type: Boolean
			},
			showLeftWindow: {
				type: Boolean
			}
		},
		watch: {

		},
		mounted() {
		},
		methods: {
			toSecondMenu(e) {
				const activeTabBar = '/' + e.pagePath
				for(const item of this.indexPage) {
					if (activeTabBar === item.tabBar) {
						uni.redirectTo({
							url: item.index
						})
					}
				}
			}
		}
	}
</script>

<style>
	.top-window-header {
		height: 60px;
		padding: 0 15px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 1px solid #e1e1e1;
		background-color: #FFFFFF;
		color: #333;
	}
	.logo {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex: 1;
	}
	.logo image {
		height: 30px;
		width: 30px;
	}
	.logo text {
		margin-left: 8px;
	}
	.right-header {
		display: flex;
		flex-direction: row;
		color: #333;
	}
	.right-header-item {
		line-height: 25px;
		margin-left: 40px;
		cursor: pointer;
		font-size: 16px;
	}
	.active {
		color: #4cd964;
		border-bottom: 2px solid;
	}
	.tab-bar-flex {
		width: 360px;
	}
	.phone-link {
		padding-left: 20px;
		cursor: pointer;
	}
</style>