<template>
	<view>
		
		<view v-if="isCanUse">
			<view>
				<view class='header'>
					<image :src='logoImage'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>

				<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
					授权登录
				</button>
			</view>
		</view>
		
	</view>
</template>
<script>
	import { logoImage } from '@/common/logo.js'
	import {
	  getWxUserInfo
	} from '@/common/wx-commands.js';
	import {
	  getToken, saveToken, getFinalUrl, forwardTo, goto
	} from '@/common/route.js';
	import {
	  failToast
	} from '@/common/util.js';
	export default {
		data() {
			return {
				onLoadOptions:null,
				finalUrl:'',
				logoImage: logoImage(),
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse') || true //默认为true
			};
		},
		methods: {
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				console.log("wxGetUserInfo()")
				
				getWxUserInfo(rsp=>{
					console.log("getWxUserInfo->",rsp.data.old_user,this.finalUrl)
					if(rsp.data.old_user)
						forwardTo(this.finalUrl, this.onLoadOptions)
					else{
						//标明是微信模式
						this.onLoadOptions.mode="wx"
						failToast("用户还没有绑定手机号码,现在跳转到注册页面","/pages/login/register", this.onLoadOptions)
					}
						
				})	
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '微信账号登录中...'
				});

			 }, //登录
		},
		onLoad:function (option) { //默认加载
		   this.onLoadOptions=option
		   this.finalUrl=getFinalUrl(option)
		   console.log("wxLogin finalUrl",this.finalUrl,option)
		}
	}
</script>
<style>
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image{
		width:161rpx;
		height:161rpx;
		border-radius:50%;
	}
	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		line-height: 80upx;
		border-radius: 80upx;
		margin: 70rpx 50rpx;
		height: 80upx;
		font-size: 35rpx;
	}
</style>
