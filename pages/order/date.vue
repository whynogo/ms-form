<template>
	<view class="wrap">
		<u-form :model="form.extra" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120"  label="姓名" prop="name">
				<u-input :border="border" placeholder="请输入姓名" v-model="form.extra.name" type="text"></u-input>
			</u-form-item>
			<u-form-item  label="班级" prop="clazz">
				<cus-picker  ref="classSelector" v-model="form.extra.clazz" @confirm="regionConfirm" :depart="depart" ></cus-picker>
			</u-form-item>
			
			<u-form-item v-show="!sectionEvent"  label="参加时间" prop="date" label-width="150">
				<u-input :border="border" disabled placeholder="请选择参加活动的时间" :select-open="params.show" v-model="form.date" type="text"	 @click="params.show = true"></u-input>
			</u-form-item>
			<u-form-item v-show="false"  label="参加时间" prop="datetime" label-width="150">
				<u-input :border="border" disabled placeholder="请选择参加活动的时间" :select-open="params.show" v-model="form.extra.datetime" type="text"	 @click="params.show = true"></u-input>
			</u-form-item>
			<section-time-selector  v-if="sectionEvent" ref="timeSelector" :begin="option.begin" :end="option.end" class="time_sel" timeInterval=2 @selectDate="onDateChanged" @selectTime="onTimeSelected" :times="times"></section-time-selector>
			<u-picker mode="time" v-model="params.show&&!oneDayEvent" :start-year="start" :end-year="end" :value="form.date" :params="params" @confirm="onDateSelected"></u-picker>
		</u-form>

		<u-button @click="submit">提交</u-button>


	</view>
</template>

<script>
	var that;
	import CusPicker from '@/components/cus-picker.vue';
	//import TimeSelector from '@/components/xiujun-time-selector/index.vue';
	import SectionTimeSelector from '@/components/section-time-selector/index.vue';
	import {
		order,
		isUserRev,
		getEventSlice
	} from '@/api/main.js';
	import {
		base64ToStr,
		successToast,
		failToast,
		closeToast,
		today,
		isEmpty,
		isSameDay,
		convertUTCTimeToLocalTime,
		toAsync,
		orderCall,
		compareDate
	} from '@/common/util.js';
	import {
		goto,
		closeTo,
		checkLogin,
		isLogin
	} from '@/common/route.js';

	export default {
		components: {
			CusPicker,
			//TimeSelector,
			SectionTimeSelector
		},
		data() {
			let that = this;
			return {
				sectionEvent:false,
				oneDayEvent:true,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false,
					show: false
				},
				option:{begin:today(),end:today()},//小程序中onCreate会慢，参数还没有传过来
				times:[],
				depart:'',
				start:'',
				end:'',
				form: {
					kind: 'school',
					event: '',
					date:'',
					slice:'',
					extra:{
						name: '',
						clazz: '',
						datetime:''
					}
				},
	
				rules: {
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur',
						},
						{
							min: 2,
							max: 5,
							message: '姓名长度在2到5个字符',
							trigger: ['change', 'blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						},
						// 异步验证，用途：比如用户注册时输入完账号，后端检查账号是否已存在
						// {
						// 	trigger: ['blur'],
						// 	// 异步验证需要通过调用callback()，并且在里面抛出new Error()
						// 	// 抛出的内容为需要提示的信息，和其他方式的message属性的提示一样
						// 	asyncValidator: (rule, value, callback) => {
						// 		this.$u.post('/ebapi/public_api/index').then(res => {
						// 			// 如果验证出错，需要在callback()抛出new Error('错误提示信息')
						// 			if(res.error) {
						// 				callback(new Error('姓名重复'));
						// 			} else {
						// 				// 如果没有错误，也要执行callback()回调
						// 				callback();
						// 			}
						// 		})
						// 	},
						// }
					],
					clazz: [{
							required: true,
							message: '请填写班级'
						},
						// 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
						// {
						// 	pattern: /^[\u4e00-\u9fa5]+$/gi,
						// 	message: '简介只能为中文',
						// 	trigger: 'change',
						// },
					],
					datetime: [
						{
							//因为datetime不显示，所以这里特殊处理了
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								console.log("A->",value,rule.field,rule)
								
								if(that.sectionEvent){
									var ret= value.length=="2021-11-30 00:00-00:59".length
									if(!ret&&rule.field=="datetime")
										uni.showToast({
											icon:"none",
											title: rule.message,
											during: 2500
										});
									return  ret	
								}
								else
									return value.replace("  "," ").length=="2021-11-30 00:00".length
							},
							message: '必须选择时间段',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					slice: [{
							required: true,
							message: '请选择日期和时间'
						},
						// 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
						// {
						// 	pattern: /^[\u4e00-\u9fa5]+$/gi,
						// 	message: '简介只能为中文',
						// 	trigger: 'change',
						// },
					],
				},
				border: false,
				check: false,
				selectStatus: 'close',
				actionSheetShow: false,
				pickerShow: false,
				selectShow: false,
				errorType: ['message'],
			};
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		mounted() {
			that = this;
			//this.isLogin();
		},
		onLoad: function(option) {
			console.log('---order onload:', option);
			this.option=option
			//id就是传入的event_id
			this.form.event = option.id
			this.oneDayEvent=isSameDay(option.begin,option.end)
			this.form.date=!compareDate(today(),convertUTCTimeToLocalTime(option.begin))?convertUTCTimeToLocalTime(option.begin):today()
			this.form.extra.datetime=this.form.date//缺时间
			//截取begin的时间+date来凑
			if(10==this.form.extra.datetime.length)
				this.form.extra.datetime+=convertUTCTimeToLocalTime(option.begin).substring(11,17)
			
			//用于限制选取范围，这里只有年份
			this.start=""+new Date(this.form.date).getFullYear()
			this.end=''+new Date(this.option.end).getFullYear()
			console.log('---order onload=>:',this.option.begin);

			this.depart= option.depart
			//因为有了checkRev，所以可以不用checkLogin
			this.checkRev()
			console.log('--->order onload:', option, this.oneDayEvent,this.form.event,this.$refs.timeSelector);
			
			//因为微信小程序不刷新
			// #ifdef MP-WEIXIN
			this.$nextTick(() => {  
				console.log("nextTick1")  
				this.$refs.timeSelector.init()
				this.$refs.classSelector.init()
            }); 
			// #endif 

		},
		methods: {
			checkRev(cb) {
				isUserRev({
					event: this.form.event
				}).then(rsp => {
					if(0==rsp.code){
						console.log("---isUserRev", rsp.data.is_rev)
						if(rsp.data.is_expired){
							failToast('您的预约已过期，请先取消', '/pages/detail/index?id='+this.form.event)					
						}else if (rsp.data.is_rev) {
							successToast('您已经预约过此活动', "/pages/news/index")
						} else {
							if (typeof cb == 'function') cb()
						}
						getEventSlice({id:this.form.event,date:this.form.date}).then(rsp=>{
							if(0==rsp.code){
								that.times=rsp.data.rows
								console.log("times",that.times)
								that.sectionEvent=that.times.length>0
							}
						})
					}
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					console.log(this.form)
					if (valid) {
						this.checkAndSubmit()
					} else {
						console.log('验证失败');
					}
				});
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.form
					.sex = this.actionSheetList[index].text;
			},
			// checkbox选择发生变化
			checkboxGroupChange(e) {
				this.form
					.likeFruit = e;
			},
			// radio选择发生变化
			radioGroupChange(e) {
				this.form
					.payType = e;
			},
			// 勾选版权协议
			checkboxChange(e) {
				this.form
					.agreement = e.value;
			},
			// 选择地区回调
			regionConfirm(e) {
				this.form
					.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
			},

			onDateSelected(e){
				console.log(e)
				this.form.date=e.year+"-"+e.month+"-"+e.day
				this.params.show=false
			},
			onDateChanged(date){
				//小程序中这里先会触发，早于oncreate
				this.form.date=date
				if(!isEmpty(this.form.event))
					getEventSlice({id:this.form.event,date:date}).then(rsp=>{
						if(0==rsp.code){
							this.times=rsp.data.rows
							this.sectionEvent=this.times.length>0
							console.log("times",this.times)
						}
					})
			},
			onTimeSelected(datetime){
				this.form.date=datetime.date
				this.form.extra.datetime=datetime.label
				this.form.extra.date=datetime.date
				this.form.slice=datetime.slice
				console.log(datetime)
			},
			checkAndSubmit(){
				if(this.sectionEvent&&32!=this.form.slice.length)
				console.log('验证通过');
				
				order(this.form).then(rsp => {
					if (0 == rsp.code) {
						closeToast('您已经成功预约', '/pages/detail/index?id=' + that.form.event)
					}
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}
	.time_sel {
		min-height: 300rpx;
	}
	.agreement {
		display: flex;
		align-items: center;
		margin: 40rpx 0;

		.agreement-text {
			padding-left: 8rpx;
			color: $u-tips-color;
		}
	}
</style>
