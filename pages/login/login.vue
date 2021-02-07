<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="手机号码"
					@blur="onPhoneNumInput(phoneData)"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="6-11位密码"
				></wInput>
			</view>
			<wButton 
				class="wbutton"
				text="登 录"
				:rotate="isRotate" 
				@click="startLogin"
			></wButton>
		
			<!--  #ifdef MP-WEIXIN -->
			<!-- 其他登录 -->
			<view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
<!-- 				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view> -->
<!-- 				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view> -->
			</view>
<!-- 			 #endif  -->
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import {
	  login
	} from '@/api/main.js';
	import {
	   failToast
	} from '@/common/util.js';
	import {
	  saveUserInfo,	getToken, saveToken, getFinalUrl, forwardTo, goto
	} from '@/common/route.js';
	import {
	  askMobile, register, isRegister
	} from '@/api/user.js';
	import { logoImage } from '@/common/logo.js'
	import {
	  getWxUserInfo
	} from '@/common/wx-commands.js';
	export default {
		data() {
			return {
				onLoadOptions:null,
				finalUrl: null,
				//logo图片 base64
				logoImage: logoImage(), 
				phoneData:'', //用户/电话
				passData:'', //密码
				isRotate: false, //是否加载旋转
			};
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
			//this.isLogin();
		},
		onLoad: function (option) {
		   this.onLoadOptions=option
		   this.finalUrl=getFinalUrl(option)
		   console.log('---page/login finalUrl:',option, this.finalUrl);
		},
		methods: {
			onPhoneNumInput(phoneNum){
				if(11==phoneNum.length){
					isRegister({mobile:phoneNum}).then(rsp=>{
						if(0==rsp.code&&!rsp.data.is_register){
							this.onLoadOptions.mobile=phoneNum
							this.onLoadOptions.mode="default"
							failToast("此号码尚未注册,现在跳转到注册页面","/pages/login/register", this.onLoadOptions)
						}
					})
				}
			},
		    startLogin(e){
//                console.log(e)
				//登录
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData.length == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '用户名不能为空'
				    });
				    return;
				}
		        if (this.passData.length < 6 ||this.passData.length > 11) {
		            uni.showToast({
		                icon: 'none',
						position: 'bottom',
		                title: '密码长度需6-11位之间'
		            });
		            return;
		        }
				
				console.log("登录成功")

				//登录按键旋转		
				_this.isRotate=true
				
				uni.showLoading({
					title: '登录中'
				});
				
				login({mobile:this.phoneData,password:this.passData}).then(res => {
					console.log(res)
					//简单验证下登录（不安全）
					if(0==res.code){
						saveUserInfo(res.data)
						_this.isRotate=false
						uni.hideLoading();
						console.log('---this.finalUrl', this.finalUrl)					
						forwardTo(this.finalUrl, this.onLoadOptions)
					}else{
						_this.isRotate=false
						_this.passData=""
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.message
						});
					}
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				})
				
		    },
			login_weixin() {
				//微信登录
				forwardTo("/pages/login/wxlogin",this.onLoadOptions)
			},
			// getWxMobile(){
			// 		console.log("getWxUserInfo");
			// 	    wx.getPhoneNumber({
			// 	      success: res => {
			// 	        wx.request({
			// 	          url: 'https://api.askxyz.top/app/wxUserInfo',
			// 	          method: 'POST',
			// 	          data:{
			// 	              token:getToken(),
			// 	              encryptedData:res.encryptedData,
			// 	              iv:res.iv
			// 	          },
			// 	          success: function (res) {
			// 	            console.log("--------",res);
				
			// 	            }
			// 	        })
			// 	      }
			// 	    })
			// }
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
