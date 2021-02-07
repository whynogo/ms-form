<template>
	<view>
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" />
		<view class="wrap">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" label-width="150" :label-position="labelPosition"
				 label="活动简介" prop="brief">
					<u-input :border="border" placeholder="请输入活动简介" v-model="model.brief" type="textarea" :auto-height="true"></u-input>
				</u-form-item>
				<text>详细介绍</text>
			</u-form>
			<h5-editor ref="editor" class="h5-editor":html="temp.content" :saveText="buttonLabel" :imageUploader="imageUploader" :submitHandler="submit">
			</h5-editor>
		</view>
	</view>
</template>


<script>
	import {
		H5Editor
	} from '@/components/h5-editor/h5-editor.vue';

	import {
		add,
		update,
		setContent,
		getContent
	} from '@/api/event.js';
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
		goto,
		closeTo
	} from '@/common/route.js';
	import {
		isEmpty,
		strToBase64,
		confirmDo,
		reloadToast
	} from '@/common/util.js';



	var that = null
	export default {
		components: {
			H5Editor
		},
		data() {
			return {
				buttonLabel: "提交(2/3)",
				temp: {
					file: null,
					content: ""
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false,
					show: false
				},
				model: {
					id: null,
					brief: '',
					content: ''
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
					brief: [{
							required: true,
							message: '请填写简介'
						},
						{
							min: 5,
							message: '简介不能少于5个字',
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
					backPage: null,
					title: '编辑内容(2/3)',
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
			this.naviConfig.backPage = "/pages/edit/step1?id=" + this.model.id,
				checkLogin('/pages/edit/step2', option)
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
				//必须用that，因为这个submit button在控件中
				that.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						that.submitContent()
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
				this.model.begin = e.year + "-" + e.month + "-" + e.day + "T" + e.hour + ":" + e.minute + ":00"
				this.model.end = this.model.begin
			},
			onImageSelected(filelist) {
				console.log(filelist)
				this.temp.file = filelist[0].url
			},
			submitContent() {
				console.log("content", this.temp.content)
				this.$refs.editor.getContent(res => {
					console.log("content->", res)
					this.model.content = strToBase64(res)
					setContent(this.model).then(rsp => {
						if (0 == rsp.code) {
							this.gotoStep3()
						}
					}).catch(e => {
						console.log(e)
					})
				})


			},
			imageUploader(path, cb) {
				// #ifndef MP-WEIXIN
				uniUploadBlobUrl(path, "reservation", function(result) {
					cb(result.url)
				})
				// #endif
				// #ifdef MP-WEIXIN
				wxOssUploadFile(path, "reservation", function(result) {
					cb(result.url)
				}, function(err) {})
				// #endif


			},
			gotoStep3() {
				loginTo("/pages/edit/step3", {
					id: that.model.id
				})
			},
			fectchRemoteData() {
				//this.model.id='718ec74b63c45a4ecbbddd9419b9510a'
				if (null == this.model.id) return
				getContent(this.model).then(rsp => {
					if (0 == rsp.code) {
						this.temp.content = isEmpty(rsp.data.content) ? '' : Base64.decode(rsp.data.content)
						this.model.brief = rsp.data.brief
					}
				})
			},
			onNaviClick(item) {
				confirmDo("确定要退出编辑吗?", f => {
					reloadToast("正在退出...","/pages/news/index")
				})
			},
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		width: 100%;
		//padding: 30rpx;
		margin-left: 16rpx;
		margin-right: 16rpx;
	}

	.h5-editor {
		width: 100%;
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
