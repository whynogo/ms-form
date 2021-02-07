<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="手机号码"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="6-11位密码"
					isShowPass
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					maxlength="4"
					placeholder="验证码"
					
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
					
			</view>
				
			<wButton 
				class="wbutton"
				text="注 册"
				:rotate="isRotate" 
				@click.native="startReg()"
			></wButton>
			
			<!-- 底部信息 -->
<!-- 			<view class="footer">
				<text 
					@tap="isShowAgree" 
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				> 同意</text>
				<navigator url="" open-type="navigate">《协议》</navigator>
			</view>
 -->		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	
	import {
	  askMobile, register, isRegister, bindMobile
	} from '@/api/user.js';
	import {
	   saveUserInfo
	} from '@/common/route.js';
	import {
	   gotoToast,closeToast
	} from '@/common/util.js';
	import { logoImage } from '@/common/logo.js'
	export default {
		data() {
			return {
				//logo图片 base64
				onLoadOptions:null,
				logoImage: logoImage(),
				phoneData:'', // 用户/电话
				passData:'', //密码
				verCode:"", //验证码
				showAgree:true, //协议是否选择
				isRotate: false, //是否加载旋转
				askCode:false
			}
		},
		components:{
			wInput,
			wButton,
		},
		onLoad: function (option) {
		   this.onLoadOptions=option	
		   this.phoneData=option.mobile
		   console.log('---page/register mobile:',option, this.phoneData);
		},
		mounted() {
			_this= this;
		},
		methods: {
			isShowAgree(){
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			getVerCode(){
				//获取验证码
				if (_this.phoneData.length != 11) {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
				
				isRegister({mobile:this.phoneData}).then(rsp=>{
					if(0==rsp.code)
						if(rsp.data.is_register)
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: '手机号已注册'
							});
						else{	
							setTimeout(function(){
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: '没有收到？可以重新请求发送验证码'
								});
							},60000)
							askMobile({mobile:this.phoneData}).then(rsp=>{
								if(rsp.data.ask_mobile){
									uni.showToast({
										icon: 'none',
										position: 'bottom',
										title: '请输入收到的验证码'
									});
									console.log("获取验证码")
								}else{
									uni.showToast({
										icon: 'none',
										position: 'bottom',
										title: '请重试'
									});
								}
								
							})		
						}
				})

			},
		    startReg() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				
				if (this.showAgree == false) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请先同意《协议》'
				    });
				    return false;
				}
				if (this.phoneData.length !=11) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
				
				isRegister({mobile:this.phoneData}).then(rsp=>{
					if(rsp.data.is_register){
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: '手机号已注册'
						});
						return false;
					}
				})
				
		        if (this.passData.length < 6 ||this.passData.length > 11) {
		            uni.showToast({
		                icon: 'none',
						position: 'bottom',
		                title: '密码长度需6-11位之间'
		            });
		            return;
		        }
				
				
				
				
				
				if (this.verCode.length != 4) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '验证码不正确'
				    });
				    return false;
				}

				console.log("login mode->",this.onLoadOptions.mode)
				if(this.onLoadOptions.mode!="wx"){
					register({mobile:this.phoneData,password:this.passData,code:this.verCode}).then(rsp=>{
						console.log("rsp->",rsp)
						if(0==rsp.code){
							saveUserInfo(rsp.data)	
							closeToast('注册成功','/pages/detail/index',this.onLoadOptions)
						}else if(339==rsp.code){
							closeToast('您已经注册过!需要找回密码?','/pages/login/forget',null)
						}
						_this.isRotate=false
					})
				}else{
					bindMobile({mobile:this.phoneData,password:this.passData,code:this.verCode}).then(rsp=>{
						console.log("rsp->",rsp)
						if(0==rsp.code){
							saveUserInfo(rsp.data)	
							closeToast('手机号码绑定成功','/pages/detail/index',this.onLoadOptions)
						}else if(339==rsp.code){
							closeToast('您已经注册过!需要找回密码?','/pages/login/forget',null)
						}
						_this.isRotate=false
					})
				}

		    }
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>