<template>
	<view>
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<view class="wrap">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :label-position="labelPosition" label="结束时间" prop="end" label-width="150">
					<u-input :border="border" disabled placeholder="请选择活动结束时间" :select-open="params.show" v-model="model.end" type="text"
					 @click="params.show = true"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="时间段" label-width="150" prop="location">
					<section-time-creator :timeSections="model.slices" ref="sliceEditor" class="time_sel"></section-time-creator>
				</u-form-item>
			</u-form>
			<u-button @click="submit">提交(3/3)</u-button>
			<u-picker mode="time" v-model="params.show" :value="model.begin" :start-year="params.year":params="params" @confirm="onBeginChanged"></u-picker>
		</view>
	</view>
</template>

<script>
	import SectionTimeCreator from '@/components/section-time-creator/index.vue';
	import {
		checkLogin,
		goto,
		closeTo
	} from '@/common/route.js';
	import {
		isEmpty,
		successToast,
		reloadToast,
		confirmDo,
		convertUTCTimeToLocalTime,

	} from '@/common/util.js';
	import {
		add,
		update,
		addSlices,
		getSlices
	} from '@/api/event.js';
	var that = null
	export default {
		components: {
			SectionTimeCreator
		},
		data() {
			return {
				temp: {
					file: null
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					show: false,
					year:new Date().getFullYear()
				},
				model: {
					id: null,
					end: '',
					slices: []
				},
				selectList: [{
						value: '电子产品',
						label: '电子产品'
					},
					{
						value: '服装',
						label: '服装'
					},
					{
						value: '工艺品',
						label: '工艺品'
					}
				],
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
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}, ],
					intro: [{
							required: true,
							message: '请填写简介'
						},
						{
							min: 5,
							message: '简介不能少于5个字',
							trigger: 'change',
						},
						// 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
						{
							pattern: /^[\u4e00-\u9fa5]+$/gi,
							message: '简介只能为中文',
							trigger: 'change',
						},
					],
					region: [{
						required: true,
						message: '请选择地区',
						trigger: 'change',
					}]
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
					backPage: null,
					title: '编辑内容(3/3)',
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
			this.naviConfig.backPage = "/pages/edit/step2?id=" + this.model.id,
			checkLogin('/pages/edit/step3', option)
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
						this.uploadAndSubmit()
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
			checkboxGroupChange(e) {
				this.model.likeFruit = e;
			},
			// radio选择发生变化
			radioGroupChange(e) {
				this.model.payType = e;
			},
			// 勾选版权协议
			checkboxChange(e) {
				this.model.agreement = e.value;
			},
			// 选择地区回调
			regionConfirm(e) {
				this.model.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
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
			},
			onImageSelected(filelist) {
				console.log(filelist)
				this.temp.file = filelist[0].url
			},
			uploadAndSubmit() {
				if(null==this.$refs.sliceEditor.getSlices()){
					uni.showToast({
						icon: 'none',
						title: "时间片有重复项或者其它错误",
						during: 2500
					});
					return
				}
				this.model.slices = this.$refs.sliceEditor.getSlices()
				addSlices(this.model).then(rsp => {
					if (0 == rsp.code) {
						console.log("id->", this.model.id)
						//reloadToast("保存成功", "/pages/detail/index?id=" + this.model.id)
						reloadToast("保存成功", "/pages/news/index")
					}
				})
			},
			fectchRemoteData() {
				//this.model.id='718ec74b63c45a4ecbbddd9419b9510a'
				if (null == this.model.id) return
				getSlices(this.model).then(rsp => {
					if (0 == rsp.code) {
						this.model.slices.length=0
						this.model.slices = rsp.data.rows
						this.model.end=convertUTCTimeToLocalTime(rsp.data.event_end)
					}
				})
			},
			onNaviClick(item) {
				confirmDo("确定要退出编辑吗?", f => {
					reloadToast("正在退出...","/pages/news/index")
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 40rpx;
	}
</style>
