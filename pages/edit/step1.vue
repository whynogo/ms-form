<template>
	<view>
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<view class="wrap">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" label-width="150" :label-position="labelPosition"
				 label="活动名称" prop="name">
					<u-input :border="border" placeholder="请输入活动正式名称" v-model="model.name" type="text"></u-input>
				</u-form-item>

				<u-form-item :label-position="labelPosition" label="活动状态" prop="state" label-width="150">
					<u-subsection style="width:200px" vibrateShort :list="stateList" :active-color="online[state].color" :button-color="online[state].bgColor" :current="model.state" @change="radioCheckboxChange"></u-subsection>
				</u-form-item>

				<u-form-item :label-position="labelPosition" label="活动时间" prop="begin" label-width="150">
					<u-input :border="border" disabled placeholder="请选择活动开始时间" :select-open="params.show" v-model="model.begin" type="text" @click="params.show = true"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="主办单位" prop="depart" label-width="150">
					<u-input :border="border" disabled placeholder="请选择活动主办人身份" :select-open="params.departShow" v-model="temp.depart" type="text" @click="params.departShow = true"
					 ></u-input>
				</u-form-item>
				<!-- 			<u-form-item :label-position="labelPosition" label="活动地点" prop="region" label-width="150">
				<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.region" placeholder="请选择地区" @click="pickerShow = true"></u-input>
			</u-form-item> -->
				<u-form-item :label-position="labelPosition" label="详细地址" label-width="150" prop="location">
					<u-input type="textarea" :border="border" placeholder="请填写详细地址" v-model="model.location" />
				</u-form-item>


				<!-- 此处switch的slot为right，如果不填写slot名，也即<u-switch v-model="model.remember"></u-switch>，将会左对齐 -->
				<u-form-item :label-position="labelPosition" label="上传图片" prop="image" label-width="150">
					<u-upload ref="fileSelector" :file-list="filelist" width="160" height="160" :max-size="2* 1024 * 1024" max-count="1"
					 :auto-upload="false" @on-choose-complete="onImageSelected" @on-remove="onImageRemoved"></u-upload>
				</u-form-item>
			</u-form>
			<u-button @click="submit">提交(1/3)</u-button>
			<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
			<u-picker mode="time" v-model="params.show" :value="model.begin" :start-year="params.year" :params="params" @confirm="onBeginChanged"></u-picker>
			<u-select v-model="params.departShow" :value="model.depart":list="departList" @confirm="departConfirm"></u-select>
		</view>
	</view>
</template>

<script>
	import SectionTimePicker from '@/components/section-time-picker.vue';
	// #ifndef MP-WEIXIN		
	import {
		uniUploadBlobUrl
	} from '@/common/oss.js';
	// #endif
	// #ifdef MP-WEIXIN
	import {
		wxOssUploadFile
	} from '@/common/wx-oss-upload.js';
	// #endif
	import {
		checkLogin,
		loginTo,
		getUserId,
		goto,
		closeTo
	} from '@/common/route.js';
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
	import {
		add,
		update,
		get
	} from '@/api/event.js';
	import {
		userDepartList
	} from '@/api/user.js';
	var that = null
	export default {
		components: {
			SectionTimePicker
		},
		data() {
			return {
				temp: {
					depart:'',
					file: null
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					year:new Date().getFullYear(),
					show: false,
					departShow:false
				},
				online:[{
						bgColor:"#FDFDFD",
						color:"#aa3133",
					},
					{
						bgColor:"#ff9900",
						color:"#303133",
					}
				],
				state:0,
				departList:[

				],
				stateList:[
					'下线', '上线'//, '过期'
				],
				filelist: [],
				//uniapp 的form必须放在model，否则无法校验
				model: {
					id: null,
					begin: '',
					end: '',
					name: '',
					image: '',
					location: '',
					depart:'',
					state:1

				},
				rules: {
					name: [{
							required: true,
							message: '请输入活动名称',
							trigger: 'blur',
						},
						{
							min: 4,
							max: 120,
							message: '活动名称长度在4到50个字符',
							trigger: ['change', 'blur'],
						},
						// {
						// 	// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						// 	validator: (rule, value, callback) => {
						// 		// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						// 		return this.$u.test.chinese(value);
						// 	},
						// 	message: '活动名称必须为中英文',
						// 	// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						// 	trigger: ['change', 'blur'],
						// },
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

					location: [{
							required: true,
							message: '请填写简介'
						},
						{
							min: 10,
							message: '地址不能少于10个字',
							trigger: 'change',
						}
					],
					depart: [{
							required: true,
							message: '请选择主办单位'
						}
					],
					begin: [{
							required: true,
							message: '请选择活动开始时间'
						}
					],
					image: [{
							required: true,
							message: '请选择活动封面图片'
						},
						{
							min: 10,
							message: '文件名不能少于10个字符',
							trigger: 'change',
						}
					]
				},
				border: false,
				check: false,
				selectStatus: 'close',
				radioList: [{
						name: '草稿',
						checked: true,
						disabled: false
					},
					{
						name: '发布',
						checked: false,
						disabled: false
					},
					{
						name: '过期',
						checked: false,
						disabled: true
					}
				],
				actionSheetShow: false,
				pickerShow: false,
				selectShow: false,
				radioCheckWidth: 'auto',
				radioCheckWrap: false,
				labelPosition: 'left',
				codeTips: '',
				errorType: ['message'],
				naviConfig: {
					back: true,
					backPage: "",
					title: '编辑内容(1/3)',
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
				},
			};
		},
		onLoad(option) {
			that = this;
			this.model.id = option.id
			checkLogin('/pages/edit/step1', option)
			this.fectchRemoteData()
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						// #ifndef MP-WEIXIN
						this.uploadAndSubmit()
						// #endif
						// #ifdef MP-WEIXIN
						this.wxUploadAndSubmit()
						// #endif

					} else {
						console.log('验证失败');
					}
				});
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.model.sex = this.actionSheetList[index].text;
			},
			// checkbox选择发生变化

			// radio选择发生变化
			radioCheckboxChange(e) {
				console.log(e);
				this.state=e	
				this.model.state = e
			},
			// 勾选版权协议
			checkboxChange(e) {
				this.model.agreement = e.value;
			},
			// 选择地区回调
			regionConfirm(e) {
				this.model.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.$refs.uForm.validate()
			},
			// 选择商品类型回调
			selectConfirm(e) {
				this.model.goodsType = '';
				e.map((val, index) => {
					this.model.goodsType += this.model.goodsType == '' ? val.label : '-' + val.label;
				})
			},
			labelPositionChange(index) {
				this.labelPosition = index == 0 ? 'left' : 'top';
			},
			codeChange(text) {
				this.codeTips = text;
			},
			onTimeActived() {
				this.params.show = true
			},
			onBeginChanged: function(e) {
				this.model.begin = e.year + "-" + e.month + "-" + e.day + " " + e.hour + ":" + e.minute + ":00"
				this.model.end = this.model.begin
				this.$refs.uForm.validate()
			},
			onImageSelected(filelist) {
				console.log("file list->", filelist[0].url)
				this.model.image = filelist[0].url
				this.$refs.uForm.validate()
			},
			onImageRemoved() {
				console.log("image removed")
				this.model.image = null
			},
			formatDateTime(dt) {
				var d = dt.replace("  ", " ")
				return (16 == d.length) ? d + ":00" : d
			},
			uploadAndSubmit() {
				//这里都是被orderCall调用的，this环境已经不是这个页面
				var fun1 = async function() {
					await new Promise(function(resolve, reject) {
						uniUploadBlobUrl(that.model.image, "/reservation", function(ret) {
							console.log("======上传图片结果：", ret)
							that.model.image = ret.name;
							resolve(true)
						}, err => {
							reject()
							throw Error("图片上传失败，请重试!")
						})
					})
				}

				if (that.model.image.startsWith("http")) {
					orderCall(this.addOrUpdate)
				} else
					orderCall(fun1, this.addOrUpdate)
			},
			wxUploadAndSubmit() {
				//显示消息提示框

				var fun1 = async function() {
					wx.showLoading({
						title: '上传中...',
						mask: true
					})
					await new Promise(function(resolve, reject) {
						console.log("======上传图片开始：", that.model.image)
						wxOssUploadFile(that.model.image, "/reservation", function(ret) {
							console.log("======上传图片结果：", ret)
							that.model.image = ret.name;
							resolve(true)
						}, err => {
							console.log(err)
							reject()
							throw Error("图片上传失败，请重试!")
						})
					})
					wx.hideLoading()
				}



				console.log("S->",that.model.image,this.isLocalFilename(that.model.image))
				if (this.isLocalFilename(that.model.image)) {
					orderCall(fun1,this.addOrUpdate)
				} else
					orderCall(this.addOrUpdate)


				//上传图片
				//你的域名下的/images/当前年月日文件下的/图片.png
				//图片路径可自行修改【(这二个参数就是你oss地址目录的下一个路径目录，比如:https://xxx.com/images/xxx.png)】

			},
			async addOrUpdate() {
				that.model.begin = that.formatDateTime(that.model.begin)
				that.model.end = that.formatDateTime(that.model.end)
				
				if(compareDate(that.model.begin,that.model.end)){
					that.model.end=that.model.begin
					delayToast("结束时间已经自动调整")
				}
				
				if (isEmpty(that.model.id))
					add(that.model).then(rsp => {
						if (0 == rsp.code) {
							that.model.id = rsp.data.event_id
							that.gotoStep2()
						}
					})
				else
					update(that.model).then(rsp => {
						if (0 == rsp.code) {
							that.gotoStep2()
						}
					})

			},
			isLocalFilename(filename){
				return filename.startsWith("http://tmp")||filename.startsWith("wxfile://")
			},
			gotoStep2() {
				loginTo("/pages/edit/step2", {
					id: that.model.id
				})
			},
			fectchRemoteData() {
				//下载event内容
				var fun_getEvent=toAsync(this,function(that,resolve,reject){
					get(that.model).then(rsp=>{
					if (0 == rsp.code) {
						that.model.name = rsp.data.name
						that.model.state = rsp.data.state
						that.state=rsp.data.state
						that.model.begin = convertUTCTimeToLocalTime(rsp.data.begin)
						that.model.end = convertUTCTimeToLocalTime(rsp.data.end)
						that.model.depart = rsp.data.depart
						that.temp.depart = rsp.data.depart_name
						that.model.location = rsp.data.location
						that.model.image = rsp.data.image
						that.filelist.push({
							url: rsp.data.image
						})
						resolve(true)
					}else
						that.fail("加载失败，请重试!")
					})
				})
		
				//下载depart内容
				var fun_getUserDepartList = toAsync(this,function(that,resolve,reject){
					userDepartList({user_id:getUserId()}).then(rsp=>{
						if(0==rsp.code){
							that.departList = rsp.data.rows;
							resolve(true)
						}else
							that.fail("用户关联单位加载失败，请重试!")
					
					})
				})
				
				if(isEmpty(this.model.id))
					orderCall(fun_getUserDepartList)
				else
					orderCall(fun_getUserDepartList,fun_getEvent)
					
				
			},
			onNaviClick(item) {
				confirmDo("确定要退出编辑吗?", f => {
					reloadToast("正在退出...","/pages/news/index")
				})
			},
			departConfirm(items){
				this.model.depart=items[0].value
				this.temp.depart=items[0].label
				this.$refs.uForm.validate()
				console.log(this.model.depart)
			}

		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
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
