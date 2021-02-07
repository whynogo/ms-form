<template>
	<view class="an-box">
		<view class="an-title" :style="titleBgColor==''?'':'background-color:'+titleBgColor+'; color: '+color">{{title}}</view>
		<view class="an-content-box" :style="lineColor == ''?'':'border: 1px dashed '+lineColor">
			<view class="an-content">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'anTextAreaTip',
		props:{
			title: {
				type: String,
				default: 'Andot Warn'
			},
			color: {
				type: String,
				default: ''
			},
			lineColor: {
				type: String,
				default: ''
			},
			titleBgColor: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				message: 'Hello Lucas, Dot\'t forget why you started!'
			}
		},
		methods: {
			
		}
	}
</script>
	
<style>
	.an-box{
		position: relative;
	}
	.an-content-box{
		border: 1px dashed #7C7C7C;
		padding: 20upx;
		font-size: 14px;
		border-radius: 10upx;
		margin: 20upx;
	}
	.an-title{
		position: absolute;
		height: 30upx;
		background-color: #F2F2F2;
		font-size: 14px;
		top: -20upx;
		left: 50upx;
		color: #000000;
		line-height:20px;
		text-align:center;
		height:20px;
		padding:0 5px;
	}
</style>
