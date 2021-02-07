<template>
	<view class='wrapper'>
		<view :style="'height:'+editorHeight+'px;'" class="container">
			<editor v-if="!previewMode" v-show="!showPreview" id="editor" class="ql-container" placeholder="可以输入文字和图片..."
			 showImgSize showImgToolbar showImgResize @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
			</editor>
		</view>
		<view @click="changeMode">
			<view class='toolbar' @tap="format" v-if="!showPreview" v-show="keyboardHeight || !autoHideToolbar" :style="'bottom:'+ (isIOS ? keyboardHeight : 0)+'px'">
				<block v-for="(toolbar,index) in getToolbar()" :key="index">
					<block v-for="(t,i) in toolbar" :key="i">
						<view v-if="t=='bold'&&1==mode" :class="formats.bold ? 'ql-active' : ''" class="iconfont large icon-zitijiacu" data-name="bold"
						 data-label="加粗"></view>
						<view v-if="t=='italic'" :class="formats.italic ? 'ql-active' : ''" class="iconfont large icon-zitixieti"
						 data-name="italic" data-label="斜体"></view>
						<view v-if="t=='underline'" :class="formats.underline ? 'ql-active' : ''" class="iconfont large icon-zitixiahuaxian"
						 data-name="underline" data-label="下滑线"></view>
						<view v-if="t=='strike'" :class="formats.strike ? 'ql-active' : ''" class="iconfont large icon-zitishanchuxian"
						 data-name="strike" data-label="删除线"></view>
						<view v-if="t=='align-left'" :class="(formats.align === 'left' || !formats.align) ? 'ql-active' : ''" class="iconfont large icon-zuoduiqi"
						 data-name="align" data-value="left" data-label="居左"></view>
						<view v-if="t=='align-center'" :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont large icon-juzhongduiqi"
						 data-name="align" data-value="center" data-label="居中"></view>
						<view v-if="t=='align-right'" :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont large icon-youduiqi"
						 data-name="align" data-value="right" data-label="居右"></view>
						<view v-if="t=='align-justify'" :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont large icon-zuoyouduiqi"
						 data-name="align" data-value="justify" data-label="平铺"></view>
						<!--                  <view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont large icon-line-height" data-name="lineHeight"
								 data-value="2"></view>
						<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont large icon-Character-Spacing" data-name="letterSpacing"
								 data-value="2em"></view>
						<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont large icon-722bianjiqi_duanqianju" data-name="marginTop"
								 data-value="20px"></view>
						<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont large icon-723bianjiqi_duanhouju"
								 data-name="marginBottom" data-value="20px"></view> -->
						<view v-if="t=='removeformat'" class="iconfont large icon-clearedformat" @tap.stop="removeFormat"></view>
						<picker v-if="t=='font'" class="iconfont" mode="selector"  :range="fontSizeRange" @change="fontSize">
							<view class="icon-fontsize" @click="tryFontSizeList"></view>
						</picker>
						<view v-if="t=='color'" :style="fontColor!='#FFFFFF' ? 'color:'+formats.color : ''" class="iconfont large icon-text_color"
						 data-name="color" @tap.stop="openColor"></view>
						<view v-if="t=='backgroundColor'" :style="bgColor ? 'color:'+formats.backgroundColor : '' " class="iconfont large icon-fontbgcolor"
						 data-name="backgroundColor" @tap.stop="openColor"></view>
						<view v-if="t=='image'" class="iconfont large icon-charutupian" @tap.stop="insertImage"></view>
						<view v-if="t=='clear'" class="iconfont large icon-shanchu" @tap.stop="clear"></view>
						<view v-if="t=='preview'" class="iconfont large icon-preview" @tap.stop="preview"></view>
						<view v-if="t=='date'" class="iconfont large icon-date" @tap="insertDate"></view>
						<view v-if="t=='list-check'" class="iconfont large icon-checklist" data-name="list" data-value="check"></view>
						<view v-if="t=='list-ordered'" :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont large icon-youxupailie"
						 data-name="list" data-value="ordered"></view>
						<view v-if="t=='list-bullet'" :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont large icon-wuxupailie"
						 data-name="list" data-value="bullet"></view>
						<view v-if="t=='undo'" class="iconfont large icon-undo" @tap="undo"></view>
						<view v-if="t=='redo'" class="iconfont large icon-redo" @tap="redo"></view>
						<view v-if="t=='outdent'" class="iconfont large icon-outdent" data-name="indent" data-value="-1"></view>
						<view v-if="t=='indent'" class="iconfont large icon-indent" data-name="indent" data-value="+1"></view>
						<view v-if="t=='divider'" class="iconfont large icon-fengexian" @tap="insertDivider"></view>
						<view v-if="t=='h1'" :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont large icon-format-header-1"
						 data-name="header" :data-value="1"></view>
						<view v-if="t=='h2'" :class="formats.header === 2 ? 'ql-active' : ''" class="iconfont large icon-format-header-2"
						 data-name="header" :data-value="2"></view>
						<view v-if="t=='h3'" :class="formats.header === 3 ? 'ql-active' : ''" class="iconfont large icon-format-header-3"
						 data-name="header" :data-value="3"></view>
						<view v-if="t=='h4'" :class="formats.header === 4 ? 'ql-active' : ''" class="iconfont large icon-format-header-4"
						 data-name="header" :data-value="4"></view>
						<view v-if="t=='h5'" :class="formats.header === 5 ? 'ql-active' : ''" class="iconfont large icon-format-header-5"
						 data-name="header" :data-value="5"></view>
						<view v-if="t=='h6'" :class="formats.header === 6 ? 'ql-active' : ''" class="iconfont large icon-format-header-6"
						 data-name="header" :data-value="6"></view>
						<view v-if="t=='sub'" :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont large icon-zitixiabiao"
						 data-name="script" data-value="sub"></view>
						<view v-if="t=='super'" :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont large icon-zitishangbiao"
						 data-name="script" data-value="super"></view>
						<view v-if="t=='rtl'" :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont large icon-direction-rtl"
						 data-name="direction" :data-value="formats.direction === 'rtl' ? '' : 'rtl'"></view>
					</block>
					</br>
				</block>
				<u-button v-if="saveText" class="submit-button" :custom-style="customStyle" type="primary" @click="submit">{{saveText}}</u-button>
			</view>
		</view>
		<colorPicker ref="colorPicker" :color="curColor" @confirm="colorChanged"></colorPicker>
		<view class="preview" v-show="showPreview">
			<rich-text :nodes="htmlData" class="previewNodes"></rich-text>
		</view>
	</view>
</template>

<script>
	var that = null
	//必须放在这里，否则小程序有错
	var defaultToolbar=[
		['undo', 'redo', 'clear', "removeformat"],
		['image'],
		['bold', 'italic', 'underline', 'strike', 'align-left', 'align-center', 'align-right',
			'font', 'color', 'backgroundColor'
		],
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
	]
	import colorPicker from '@/components/t-color-picker.vue';
	import {
		isEmpty
	} from '@/common/util.js';
	import {EventHandler} from "@/common/event-handler.js"
	export default {
		components: {
			colorPicker
		},
		props: {
			html: {
				type: String
			},
			imageUploader: {
				type: Function
			},
			submitHandler: {
				type: Function
			},
			muiltImage: {
				type: Boolean,
				default: false
			},
			compressImage: {
				type: Boolean,
				default: false
			},
			previewMode: {
				type: Boolean,
				default: false
			},
			autoHideToolbar: {
				type: Boolean,
				default: false
			},
			tools: {
				type: Array,
				default: function() {
					return defaultToolbar
				}
			},
			saveText: {
				type: String,
				default: null
			},
			name: {
				type: String,
				default: "h5-editor"
			},
		},
		data() {
			return {
				customStyle: {
					marginTop: '3px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				},
				eventHandler:new EventHandler(),
				curColor: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				show: true,
				readOnly: false,
				formats: {},
				fontColor: "#000000",
				bgColor: "",
				color: "",
				colorPickerName: "",
				showColor: false,
				fontSizeRange: [10, 12, 14, 16, 18, 24, 32],
				showPreview: false,
				htmlData: "",
				keyboardHeight: 0,
				editorHeight: 0,
				isIOS: false,
				mode:1,
				showFontSizeList:false,
				defaultToolbar:[
					['undo', 'redo', 'clear', "removeformat"],
					['image'],
					['bold', 'italic', 'underline', 'strike', 'align-left', 'align-center', 'align-right',
						'font', 'color', 'backgroundColor'
					],
					['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
				],
				smallToolbar:[
					['undo', 'redo', 'clear', "removeformat"]
				]
			}
		},
		watch: {
			html: (newVal, oldVal) => {
				//console.log("Y->",that, newVal);
				if (null != newVal && !isEmpty(that.editorCtx)) {
					that.editorCtx.setContents({
						html: newVal
					})
				}
			}
		},
		created(options) {
			that = this
		},
		mounted: function() {
			that = this
			const platform = uni.getSystemInfoSync().platform
			this.isIOS = platform === 'ios'
			if (this.previewMode) {
				this.previewData(this.html)
			}
			let keyboardHeight = 0
			this.updatePosition(0)
			uni.onKeyboardHeightChange(res => {
				if (res.height === keyboardHeight) return
				const duration = res.height > 0 ? res.duration * 1000 : 0
				keyboardHeight = res.height
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						success: () => {
							this.updatePosition(keyboardHeight)
							this.editorCtx && this.editorCtx.scrollIntoView()
						}
					})
				}, duration)
			})
		},
		computed: {
			labelConfirm: function() {
				return this.showPreview ? "关闭" : "保存"
			},
			labelCancel: function() {
				return this.showPreview ? "" : "取消"
			}
		},
		methods: {
			changeMode(){
				if(this.eventHandler.input(20))
					this.mode=0==this.mode?1:0
			},	
			getToolbar(){
				return 0==this.mode?this.smallToolbar:defaultToolbar
			},
			tryFontSizeList(){
				if(this.eventHandler.input(10)){
				}
			},
			updatePosition(keyboardHeight) {
				const {
					windowHeight,
					windowWidth,
					platform
				} = uni.getSystemInfoSync()
				const rpx = windowWidth / 750
				let topbarHeight = 85 * rpx;
				//#ifdef H5
				topbarHeight += 44;
				//#endif
				var tools=this.getToolbar()
				const toolbarHeight = (70 * Math.ceil(tools.length / 15) + 1) * rpx

				const bodyHeight = windowHeight - topbarHeight
				this.keyboardHeight = keyboardHeight
				this.editorHeight = keyboardHeight > 0 ? (bodyHeight - keyboardHeight - toolbarHeight) : (this.autoHideToolbar ?
					bodyHeight : bodyHeight - toolbarHeight - 80)
				this.editorHeight += 100 * tools.length
				console.log("updatePosition", keyboardHeight, this.editorHeight)
			},
			openColor(e) {
				var name = e.currentTarget.dataset.name
				this.colorPickerName = name
				this.$refs.colorPicker.open();
			},
			colorPop(e) {
				this.showColor = e.show
			},
			async colorChanged(e) {
				console.log(e)
				let label = ''
				this.onStatusChange({
					detail: {
						color: e.hex
					}
				});
				switch (this.colorPickerName) {
					case 'backgroundColor':
						if (e.color == '#FFFFFF') {
							e.color = ''
						}
						this.bgColor = e.hex
						label = '背景色'
						break
					case 'color':
						this.fontColor = e.hex
						label = '颜色'
						break
				}
				this._format(this.colorPickerName, e.hex, label + e.hex)
				this.$forceUpdate();
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().in(this).select('#editor').context((res) => {
					this.editorCtx = res.context
					if (this.html) {
						this.editorCtx.setContents({
							html: this.html
						})
					}
				}).exec()
			},
			undo() {
				if(this.eventHandler.input(10)){
					this.editorCtx.undo()
					this.toast("撤销")
				}
			},
			redo() {
				if(this.eventHandler.input(10)){
					this.editorCtx.redo()
					this.toast("重做")
				}
			},
			format(e) {
				let {
					name,
					value,
					label
				} = e.target.dataset
				if (!name) return
				this._format(name, value, label)
			},
			_format(name, value, label) {
				if(this.eventHandler.input(10)){
					this.editorCtx.format(name, value)
					this.toast(label)
				}
			},
			toast(label) {
				uni.showToast({
					duration: 600,
					icon: 'none',
					title: label
				})
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						this.toast("插入分割线")
					}
				})
			},
			clear() {
				if(this.eventHandler.input(10)){
					this.editorCtx.clear({
						success: (res) => {
							this.toast("清空")
						}
					})
				}
			},
			removeFormat() {
				if(this.eventHandler.input(10)){
					this.editorCtx.removeFormat()
					this.toast("清除格式")
				}
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
				this.toast("插入日期")
			},
			insertImage() {
				let params = {}
				params.count = this.muiltImage ? 9 : 1
				params.sizeType = this.compressImage ? ['compressed'] : ['original']
				uni.chooseImage({
					...params,
					success: (res) => {
						res.tempFilePaths.map(path => {
							this.imageUploader(path, (url) => {
								this.editorCtx.insertImage({
									src: url,
									alt: '图像',
									width: '100%',
								})
							})
						})
					}
				})
			},
			fontSize(e) {
				const index = e.detail.value
				const fz = this.fontSizeRange[index] + 'px'
				this._format('fontSize', fz, '字体大小:' + fz)
			},
			cancel() {
				this.$emit('cancel')
			},
			save() {
				if (this.showPreview) {
					if (this.previewMode) {
						this.cancel()
					} else {
						this.showPreview = false
					}
				} else {
					this.editorCtx.getContents({
						success: res => {
							this.$emit('save', res)
						}
					})
				}
			},
			previewData: function(html) {
				this.htmlData = html.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
				this.showPreview = true
			},
			preview: function() {
				this.editorCtx.getContents({
					success: res => {
						this.previewData(res.html)
					}
				})

			},
			getContent(cb) {
				this.editorCtx.getContents({
					success: res => {
						cb(res.html)
					}
				})
			},
			submit() {
				if (typeof this.submitHandler == "function")
					this.submitHandler(this.name)
				else
					console.log("请在H5Editor中注册submitHandler")
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./editor-icon.css";

	.wrapper {
		//	padding: 5px;
		width: 100%;

		.header {
			width: 100%;
			position: fixed;
			z-index: 9;
			left: 0;
			/* #ifndef H5 */
			top: 0;
			/* #endif */
			/* #ifdef H5 */
			top: 44px;
			/* #endif */

		}

		.container {
			width: 100%;
			margin-top: 20rpx;
			background: #fff;
			align-items: center;

			.ql-container {
				overflow: hidden;
				box-sizing: border-box;
				width: 100%;
				height: auto;
				min-height: 3000px;
				font-size: 15px;
				line-height: 2.0;
				padding: 16rpx;
			}
		}
		
		.triggle-button{
		/* 		margin-top:10rpx; */
				position: absolute;
				right: 0px; 
				top: 0px; 
		}

		.toolbar {
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			box-sizing: border-box;
			font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
			background-color: #fff;
			border-top: 1px solid #eee;
			line-height: 50rpx;

			.iconfont {
				display: inline-block;
				padding: 10rpx 0;
				width: 60rpx;
				text-align: center;
				font-size: 36rpx;
				box-sizing: border-box;
			}

			.large {
				display: inline-block;
				padding: 10rpx 0;
				width: 72rpx;
				text-align: center;
				font-size: 42rpx;
				box-sizing: border-box;
			}

			.submit-button {
				margin: 10rpx 20rpx;
			}
		}

	}





	.preview {
		width: 100%;
		margin-top: 90rpx;

		.previewNodes {
			width: 100%;
		}
	}

	.ql-active {
		color: #06c;
	}
</style>
