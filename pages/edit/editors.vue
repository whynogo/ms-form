<template>
	<view>
		<hx-navbar ref="hxnb" :config="naviConfig" @clickBtn="onNaviClick" @navibarDidBack="onNaviDidBack"/>
		<view class="wrap">
			<text>详细介绍</text>

			<h5-editor ref="editor" :name="name" class="h5-editor":html="temp.content" :saveText="buttonLabel" :imageUploader="imageUploader" :submitHandler="submit">
			</h5-editor>
		</view>
	</view>
</template>


<script>
	import {
		H5Editor
	} from '@/components/h5-editor/h5-editor.vue';

	import {
		fectchEditorContent,
		setEditorContent
	} from "@/common/editor-driver.js"

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
				name:"",
				directory:"",
				buttonLabel: "提交(2/3)",
				temp: {
					file: null,
					content: ""
				},
				model: {
					id: null,
					brief: '',
					content: ''
				},
				naviConfig: {
					back: true,
					backPage: null,
					title: '编辑图文',
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
					customBack:true
				},
			};
		},
		onLoad(option) {
			that = this;
			this.name=option.name
		},
		computed: {
		},
		onReady() {
			//默认取到的都是base64
			var editor=fectchEditorContent(this.name)
			this.temp.content = isEmpty(editor.content) ? '' : Base64.decode(editor.content)
			this.buttonLabel=editor.buttonLabel
			this.directory=editor.directory
		},
		onHide(){
			console.log("editors hidden<=")
		},	
		methods: {
			submit(name) {
				this.submitContent()

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
					
					setEditorContent(this.name,strToBase64(res))
					uni.$emit("richtext-back",this.name,"save")
					uni.navigateBack();
					
					
					// let pages = getCurrentPages(); 
					// let prevPage = pages[pages.length - 2]; //上一个页面 
					// //接调用上一个页面的setData()方法，把数据存到上一个页面中
					//prevPage.setRichContent(this.name,strToBase64(res)) 

					
				})
			},
			imageUploader(path, cb) {
				// #ifndef MP-WEIXIN
				uniUploadBlobUrl(path, this.directory, function(result) {
					cb(result.url)
				})
				// #endif
				// #ifdef MP-WEIXIN
				wxOssUploadFile(path, this.directory, function(result) {
					cb(result.url)
				}, function(err) {})
				// #endif


			},
			onNaviClick(item) {
				confirmDo("确定要退出编辑吗?", f => {
					reloadToast("正在退出...","/pages/news/index")
				})
			},
			onNaviDidBack(){
				uni.navigateBack({
					
				})
				uni.$emit("richtext-back",this.name,"back")
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		display:flex;
		width: 100%;
		//padding: 30rpx;

		flex-direction: column;
		justify-content:center;
		padding-top: 25upx;
		width: 100%;
		align-items: center;
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
