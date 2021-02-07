<template>
	<view class="forget">
		
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
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
					placeholder="6-11位新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verCode"
					type="number"
					maxlength="4"
					placeholder="验证码"
					
					isShowCode
					codeText="获取验证码"
					setTime="60"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			
			<wButton 
				class="wbutton"
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	
	import {
	  askMobile, register, isRegister, password
	} from '@/api/user.js';
	import {
	  gotoToast
	} from '@/common/util.js';
	
	
	export default {
		data() {
			return {
				phoneData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
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
					if(!rsp.data.is_register)
						gotoToast('此号码未注册','/pages/login/register')
					else	
						askMobile({mobile:this.phoneData}).then(rsp=>{
							if(rsp.data.ask_mobile){
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: '请输入收到的验证码'
								});
								console.log("获取验证码")
								_this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
								setTimeout(function(){
									_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
									uni.showToast({
									    icon: 'none',
										position: 'bottom',
									    title: '没有收到？可以重新请求发送验证码'
									});
								},60000)
							}else{
								uni.showToast({
									icon: 'none',
									position: 'bottom',
									title: '请重试'
								});
							}
							
						})					
				})
				

			},
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData.length != 11) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
				isRegister({mobile:this.phoneData}).then(rsp=>{
					if(!rsp.data.is_register){
						gotoToast('此号码未注册','/pages/login/register')
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
				
				password({mobile:this.phoneData,password:this.passData,code:this.verCode}).then(rsp=>{
					console.log("rsp->",rsp)
					if(0==rsp.code){
						gotoToast('修改密码成功','/pages/news/index',null)
					}
					_this.isRotate=false

				})
				
				
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>

